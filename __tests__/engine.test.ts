import { Chess } from 'chess.js';
import {
  ALL_COURSES,
  courseById,
  dayNumber,
  isReviewDay,
  needsNewPick,
  weekday,
  weekFocus,
  weekNumber,
} from '../src/engine/schedule';
import {
  applyPuzzleResult,
  formAdjustment,
  newRating,
  pickPuzzle,
  targetRating,
  themeSkill,
} from '../src/engine/puzzles';
import { nextReviewPuzzle, reviewLines, reviewThemes } from '../src/engine/review';
import { THEMES } from '../src/data/themes';
import { DEFAULT_PROGRESS, DEFAULT_SETTINGS, Progress } from '../src/storage/store';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => {}),
}));

const settings = { ...DEFAULT_SETTINGS, weekTheme: 'fork', weekCourse: 'najdorf' };
const MONDAY = dayNumber(new Date(2026, 9, 12)); // Mon 12 Oct 2026
const week = [0, 1, 2, 3, 4, 5, 6];

describe('schedule', () => {
  it('counts local calendar days', () => {
    expect(dayNumber(new Date(1970, 0, 1, 23, 59))).toBe(0);
    expect(dayNumber(new Date(1970, 0, 2, 0, 1))).toBe(1);
  });

  it('starts weeks on Monday', () => {
    expect(weekday(MONDAY)).toBe(0);
    expect(weekday(MONDAY + 6)).toBe(6);
    expect(weekNumber(MONDAY + 6)).toBe(weekNumber(MONDAY));
    expect(weekNumber(MONDAY + 7)).toBe(weekNumber(MONDAY) + 1);
  });

  it('trains the chosen theme and course, one variation per weekday', () => {
    const days = week.map(d => weekFocus(settings, MONDAY + d));
    expect(days.every(f => f.theme.id === 'fork')).toBe(true);
    expect(days.every(f => f.course.id === 'najdorf')).toBe(true);
    expect(days.map(f => f.dayIndex)).toEqual(week);
    expect(new Set(days.map(f => f.line.name)).size).toBe(7);
  });

  it('falls back to the first theme and course for unknown ids', () => {
    const f = weekFocus({ ...settings, weekTheme: 'nope', weekCourse: 'nope' }, MONDAY);
    expect(f.theme.id).toBe(THEMES[0].id);
    expect(f.course.id).toBe(ALL_COURSES[0].id);
    expect(courseById('italian').id).toBe('italian');
  });

  it('revises on Sunday only when enabled', () => {
    expect(week.filter(d => isReviewDay(settings, MONDAY + d))).toEqual([6]);
    expect(weekFocus(settings, MONDAY + 6).review).toBe(true);
    const off = { ...settings, sundayReview: false };
    expect(week.some(d => isReviewDay(off, MONDAY + d))).toBe(false);
  });

  it('asks for a new pick once the week changes', () => {
    const picked = { ...settings, pickedWeek: weekNumber(MONDAY) };
    expect(needsNewPick(picked, MONDAY + 6)).toBe(false);
    expect(needsNewPick(picked, MONDAY + 7)).toBe(true);
  });
});

describe('opening lines', () => {
  it('are legal and end on the trainee move', () => {
    for (const course of ALL_COURSES) {
      expect(course.days).toHaveLength(7);
      for (const line of course.days) {
        const chess = new Chess();
        line.moves.forEach(m => chess.move(m));
        const lastMover = line.moves.length % 2 === 1 ? 'w' : 'b';
        expect(lastMover).toBe(course.color);
      }
    }
  });
});

describe('puzzles', () => {
  it('has puzzles for every theme', () => {
    for (const t of THEMES) {
      const p = pickPuzzle(t.id, 1200, []);
      expect(p.theme).toBe(t.id);
      expect(p.moves.length).toBeGreaterThanOrEqual(2);
      expect(p.moves.length).toBeLessThanOrEqual(6);
    }
  });

  it('picks near the target rating and avoids seen puzzles', () => {
    const seen: string[] = [];
    for (let i = 0; i < 30; i++) {
      const p = pickPuzzle('fork', 1500, seen);
      expect(seen).not.toContain(p.id);
      expect(Math.abs(p.rating - 1500)).toBeLessThanOrEqual(150);
      seen.push(p.id);
    }
  });

  it('updates rating like Elo', () => {
    expect(newRating(1200, 1200, true)).toBe(1214);
    expect(newRating(1200, 1200, false)).toBe(1186);
    expect(newRating(1200, 1800, true)).toBeGreaterThan(1225);
    expect(newRating(400, 2000, false)).toBe(400);
  });
});

describe('adaptive difficulty', () => {
  it('adjusts to recent form', () => {
    expect(formAdjustment([1, 1])).toBe(0); // too few results
    expect(formAdjustment(Array(10).fill(1))).toBe(100);
    expect(formAdjustment(Array(10).fill(0))).toBe(-120);
    expect(formAdjustment([1, 1, 1, 1, 1, 1, 1, 0, 0, 0])).toBe(0);
    expect(targetRating(1500, formAdjustment(Array(10).fill(1)))).toBe(1600);
  });

  it('blends in your rating for the theme as you play it', () => {
    const p: Progress = { ...DEFAULT_PROGRESS, rating: 1500 };
    expect(themeSkill(p, 'fork')).toBe(1500);
    const few = { ...p, themeStats: { fork: { solved: 1, failed: 1, rating: 1300 } } };
    const many = { ...p, themeStats: { fork: { solved: 10, failed: 10, rating: 1300 } } };
    expect(themeSkill(few, 'fork')).toBe(1480);
    expect(themeSkill(many, 'fork')).toBe(1400);
  });

  it('tracks theme ratings, recent results and missed puzzles', () => {
    const puzzle = pickPuzzle('pin', 1200, []);
    let p: Progress = { ...DEFAULT_PROGRESS, rating: 1200 };
    p = applyPuzzleResult(p, puzzle, false, 100);
    expect(p.missed).toEqual([{ id: puzzle.id, theme: 'pin', day: 100 }]);
    expect(p.recent).toEqual([0]);
    expect(p.themeStats.pin.rating).toBeLessThan(1200);
    expect(p.themeStats.pin).toMatchObject({ failed: 1, lastDay: 100, todayCount: 1 });

    // Retrying it later clears it from the list without touching the rating.
    const rating = p.rating;
    p = applyPuzzleResult(p, { ...puzzle, source: 'retry' }, true, 106);
    expect(p.missed).toEqual([]);
    expect(p.rating).toBe(rating);
    expect(p.recent).toEqual([0]);
    expect(p.themeStats.pin.lastDay).toBe(106);
  });
});

describe('revision content', () => {
  const today = 200;

  it('revises weak and old themes first, and rotates', () => {
    const p: Progress = {
      ...DEFAULT_PROGRESS,
      themeStats: {
        fork: { solved: 9, failed: 1, lastDay: today - 2 },
        pin: { solved: 3, failed: 7, lastDay: today - 10 },
        skewer: { solved: 5, failed: 5, lastDay: today - 5 },
      },
    };
    expect(reviewThemes(p, today).map(t => t.id)).toEqual(['pin', 'skewer', 'fork']);
    const after = {
      ...p,
      themeStats: { ...p.themeStats, pin: { ...p.themeStats.pin, lastDay: today, todayCount: 1 } },
    };
    expect(reviewThemes(after, today)[0].id).toBe('skewer');
  });

  it('alternates retries of missed puzzles with themed revision', () => {
    const missed = pickPuzzle('fork', 1200, []);
    const p: Progress = {
      ...DEFAULT_PROGRESS,
      themeStats: { pin: { solved: 1, failed: 1, lastDay: today - 3 } },
      missed: [{ id: missed.id, theme: 'fork', day: today - 3 }],
    };
    expect(nextReviewPuzzle(settings, p, 0, today)).toMatchObject({ id: missed.id, source: 'retry' });
    expect(nextReviewPuzzle(settings, p, 1, today)).toMatchObject({ theme: 'pin', source: 'review' });
    // Puzzles missed today wait for a later revision day.
    const fresh = { ...p, missed: [{ id: missed.id, theme: 'fork', day: today }] };
    expect(nextReviewPuzzle(settings, fresh, 0, today).source).toBe('review');
    // Nothing practised yet: fall back to the week's theme.
    expect(nextReviewPuzzle(settings, DEFAULT_PROGRESS, 1, today).theme).toBe('fork');
  });

  it('revises learned opening lines, least solid first', () => {
    const white = ALL_COURSES.find(c => c.color === 'w')!;
    const black = ALL_COURSES.find(c => c.color === 'b')!;
    const p: Progress = {
      ...DEFAULT_PROGRESS,
      lineStats: {
        [`${white.id}:0`]: { reps: 4, perfect: 4, lastDay: today - 1, todayReps: 0 },
        [`${white.id}:1`]: { reps: 4, perfect: 1, lastDay: today - 6, todayReps: 0 },
        [`${black.id}:2`]: { reps: 2, perfect: 1, lastDay: today - 3, todayReps: 0 },
      },
    };
    expect(reviewLines(p, today)).toEqual([
      { courseId: white.id, dayIndex: 1 },
      { courseId: black.id, dayIndex: 2 },
      { courseId: white.id, dayIndex: 0 },
    ]);
  });
});

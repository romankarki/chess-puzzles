import { Chess } from 'chess.js';
import {
  ALL_COURSES,
  courseCycle,
  dayNumber,
  openingFocus,
  themeFocus,
  weekday,
} from '../src/engine/schedule';
import { newRating, pickPuzzle, targetRating } from '../src/engine/puzzles';
import { THEMES } from '../src/data/themes';
import { DEFAULT_SETTINGS } from '../src/storage/store';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => {}),
}));

const settings = { ...DEFAULT_SETTINGS };

describe('schedule', () => {
  it('counts local calendar days', () => {
    expect(dayNumber(new Date(1970, 0, 1, 23, 59))).toBe(0);
    expect(dayNumber(new Date(1970, 0, 2, 0, 1))).toBe(1);
  });

  it('starts weeks on Monday', () => {
    expect(weekday(dayNumber(new Date(2026, 9, 12)))).toBe(0); // Mon 12 Oct 2026
    expect(weekday(dayNumber(new Date(2026, 9, 18)))).toBe(6); // Sun 18 Oct 2026
  });

  it('keeps the same puzzle theme for 3 consecutive days', () => {
    const start = Math.ceil(20000 / 3) * 3; // first day of a block
    const themes = [0, 1, 2].map(d => themeFocus(settings, start + d));
    expect(new Set(themes.map(t => t.theme.id)).size).toBe(1);
    expect(themes.map(t => t.dayInBlock)).toEqual([1, 2, 3]);
    expect(themeFocus(settings, start + 3).theme.id).not.toBe(themes[0].theme.id);
  });

  it('keeps one course per week and a new variation each day', () => {
    const monday = dayNumber(new Date(2026, 9, 12));
    const week = [0, 1, 2, 3, 4, 5, 6].map(d => openingFocus(settings, monday + d));
    expect(new Set(week.map(w => w.course.id)).size).toBe(1);
    expect(week.map(w => w.dayIndex)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(new Set(week.map(w => w.line.name)).size).toBe(7);
    expect(openingFocus(settings, monday + 7).course.id).not.toBe(week[0].course.id);
  });

  it('only uses courses of the chosen colour', () => {
    expect(courseCycle('w').every(c => c.color === 'w')).toBe(true);
    expect(courseCycle('b').every(c => c.color === 'b')).toBe(true);
    expect(courseCycle('both')).toHaveLength(ALL_COURSES.length);
  });

  it('skipping moves to the next theme', () => {
    const day = 30000;
    const a = themeFocus(settings, day);
    const b = themeFocus({ ...settings, themeOffset: 1 }, day);
    expect(b.theme.id).toBe(a.next.id);
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

  it('ramps difficulty across the 3-day block', () => {
    expect(targetRating(1500, 1)).toBeLessThan(targetRating(1500, 3));
  });
});

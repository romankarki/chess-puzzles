import { dateKey, dayNumber } from './schedule';
import { DayLog, Progress, rememberSeen, updateProgress } from '../storage/store';

/** [id, fen, uci moves (space separated), rating] — see scripts/build_puzzles.py */
type RawPuzzle = [string, string, string, number];

export interface Puzzle {
  id: string;
  /** Position before the opponent's first move. */
  fen: string;
  /** moves[0] is the opponent's move; the trainee then plays moves[1], moves[3], … */
  moves: string[];
  rating: number;
  theme: string;
}

let data: Record<string, RawPuzzle[]> | null = null;

/** The puzzle database is large; load it on first use only. */
function db(): Record<string, RawPuzzle[]> {
  if (!data) {
    data = (require('../data/puzzles.json') as { themes: Record<string, RawPuzzle[]> }).themes;
  }
  return data;
}

export function themeSize(theme: string): number {
  return db()[theme]?.length ?? 0;
}

export const MIN_RATING = 400;
export const MAX_RATING = 3000;

/**
 * Pick an unseen puzzle of `theme` near `target` rating, widening the window
 * when the nearby puzzles have all been seen.
 */
export function pickPuzzle(theme: string, target: number, seen: string[]): Puzzle {
  const list = db()[theme] ?? db().fork;
  const seenSet = new Set(seen);
  for (const window of [75, 150, 300, 600]) {
    const candidates = list.filter(p => Math.abs(p[3] - target) <= window && !seenSet.has(p[0]));
    if (candidates.length >= 3 || (window === 600 && candidates.length)) {
      return toPuzzle(candidates[Math.floor(Math.random() * candidates.length)], theme);
    }
  }
  // Everything near this rating has been seen: pick the closest unseen, else any.
  const unseen = list.filter(p => !seenSet.has(p[0]));
  const pool = unseen.length ? unseen : list;
  const sorted = [...pool].sort((a, b) => Math.abs(a[3] - target) - Math.abs(b[3] - target));
  const top = sorted.slice(0, 20);
  return toPuzzle(top[Math.floor(Math.random() * top.length)], theme);
}

function toPuzzle(raw: RawPuzzle, theme: string): Puzzle {
  return { id: raw[0], fen: raw[1], moves: raw[2].split(' '), rating: raw[3], theme };
}

/**
 * Difficulty ramps up during the 3 days of a theme: day 1 is a little easier
 * than your rating, day 3 a little harder.
 */
export function targetRating(rating: number, dayInBlock: number): number {
  return Math.round(rating + (dayInBlock - 2) * 60);
}

/** Elo-style update. A puzzle counts as solved only without mistakes or hints. */
export function newRating(rating: number, puzzleRating: number, solved: boolean): number {
  const expected = 1 / (1 + Math.pow(10, (puzzleRating - rating) / 400));
  const k = 28;
  const next = rating + k * ((solved ? 1 : 0) - expected);
  return Math.round(Math.min(MAX_RATING, Math.max(MIN_RATING, next)));
}

export function bumpDay(p: Progress, field: keyof DayLog, by = 1): Progress {
  const key = dateKey();
  const log: DayLog = p.daily[key] ?? { puzzles: 0, openings: 0, challenges: 0 };
  const today = dayNumber();
  let streak = p.streak;
  if (streak.lastDay !== today) {
    streak = { count: streak.lastDay === today - 1 ? streak.count + 1 : 1, lastDay: today };
  }
  // Keep the last ~60 days of logs only.
  const daily: Record<string, DayLog> = {};
  const keys = Object.keys(p.daily).sort().slice(-60);
  keys.forEach(k => (daily[k] = p.daily[k]));
  daily[key] = { ...log, [field]: log[field] + by };
  return { ...p, daily, streak };
}

export function recordPuzzle(puzzle: Puzzle, solvedClean: boolean) {
  updateProgress(p => {
    const stat = p.themeStats[puzzle.theme] ?? { solved: 0, failed: 0 };
    const next: Progress = {
      ...p,
      rating: newRating(p.rating, puzzle.rating, solvedClean),
      puzzlesSolved: p.puzzlesSolved + (solvedClean ? 1 : 0),
      puzzlesFailed: p.puzzlesFailed + (solvedClean ? 0 : 1),
      seen: rememberSeen(p.seen, puzzle.id),
      themeStats: {
        ...p.themeStats,
        [puzzle.theme]: {
          solved: stat.solved + (solvedClean ? 1 : 0),
          failed: stat.failed + (solvedClean ? 0 : 1),
        },
      },
    };
    return bumpDay(next, 'puzzles');
  });
}

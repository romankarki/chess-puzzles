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
  /** 'review': revision of an older theme; 'retry': a puzzle you missed before. */
  source?: 'review' | 'retry';
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

export function puzzleById(theme: string, id: string): Puzzle | null {
  const raw = db()[theme]?.find(p => p[0] === id);
  return raw ? toPuzzle(raw, theme) : null;
}

function toPuzzle(raw: RawPuzzle, theme: string): Puzzle {
  return { id: raw[0], fen: raw[1], moves: raw[2].split(' '), rating: raw[3], theme };
}

/**
 * Difficulty to aim for: your skill in the theme, nudged by `form` (see
 * formAdjustment) while you are on a run of solves or misses.
 */
export function targetRating(skill: number, form = 0): number {
  return Math.round(skill + form);
}

const RECENT = 12;
/** Aim for ~70% clean solves: hard enough to learn, easy enough to keep going. */
const TARGET_SUCCESS = 0.7;

/**
 * Short-term difficulty shift from your latest results: up to +100 on a hot
 * streak, down to -120 when puzzles keep going wrong.
 */
export function formAdjustment(recent: number[]): number {
  if (recent.length < 4) {
    return 0;
  }
  const rate = recent.reduce((a, b) => a + b, 0) / recent.length;
  return Math.round(Math.min(100, Math.max(-120, (rate - TARGET_SUCCESS) * 400)));
}

/**
 * Your strength in one theme: the overall rating blended with the theme's own
 * rating, trusting the theme rating more as you play more of it (up to 50%).
 */
export function themeSkill(progress: Progress, theme: string): number {
  const stat = progress.themeStats[theme];
  const n = stat ? stat.solved + stat.failed : 0;
  if (!stat?.rating || n === 0) {
    return progress.rating;
  }
  const w = Math.min(n, 10) / 20;
  return Math.round(progress.rating * (1 - w) + stat.rating * w);
}

/** Elo-style update. A puzzle counts as solved only without mistakes or hints. */
export function newRating(rating: number, puzzleRating: number, solved: boolean, k = 28): number {
  const expected = 1 / (1 + Math.pow(10, (puzzleRating - rating) / 400));
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

const MAX_MISSED = 150;

export function applyPuzzleResult(
  p: Progress,
  puzzle: Puzzle,
  solvedClean: boolean,
  today = dayNumber(),
): Progress {
  const stat = p.themeStats[puzzle.theme] ?? { solved: 0, failed: 0 };
  const touched = {
    ...stat,
    lastDay: today,
    todayCount: (stat.lastDay === today ? stat.todayCount ?? 0 : 0) + 1,
  };
  const others = p.missed.filter(m => m.id !== puzzle.id);
  const missed = solvedClean
    ? others
    : [...others, { id: puzzle.id, theme: puzzle.theme, day: today }].slice(-MAX_MISSED);

  if (puzzle.source === 'retry') {
    // You have seen this one before: it counts for revision, not for rating.
    return { ...p, missed, themeStats: { ...p.themeStats, [puzzle.theme]: touched } };
  }
  return {
    ...p,
    rating: newRating(p.rating, puzzle.rating, solvedClean),
    puzzlesSolved: p.puzzlesSolved + (solvedClean ? 1 : 0),
    puzzlesFailed: p.puzzlesFailed + (solvedClean ? 0 : 1),
    seen: rememberSeen(p.seen, puzzle.id),
    recent: [...p.recent, solvedClean ? 1 : 0].slice(-RECENT),
    missed,
    themeStats: {
      ...p.themeStats,
      [puzzle.theme]: {
        ...touched,
        solved: stat.solved + (solvedClean ? 1 : 0),
        failed: stat.failed + (solvedClean ? 0 : 1),
        rating: newRating(stat.rating ?? p.rating, puzzle.rating, solvedClean, 36),
      },
    },
  };
}

export function recordPuzzle(puzzle: Puzzle, solvedClean: boolean) {
  updateProgress(p => bumpDay(applyPuzzleResult(p, puzzle, solvedClean), 'puzzles'));
}

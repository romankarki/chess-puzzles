import { dayNumber, lineKey } from './schedule';
import { bumpDay } from './puzzles';
import { getState, LineStat, updateProgress } from '../storage/store';

export function lineStat(courseId: string, dayIndex: number): LineStat {
  const s = getState().progress.lineStats[lineKey(courseId, dayIndex)];
  const empty: LineStat = { reps: 0, perfect: 0, lastDay: 0, todayReps: 0 };
  if (!s) {
    return empty;
  }
  return s.lastDay === dayNumber() ? s : { ...s, todayReps: 0 };
}

/**
 * The first time you see a line today you are shown each move (guided). After
 * that, you play from memory; hints appear only after mistakes.
 */
export function isGuided(courseId: string, dayIndex: number): boolean {
  return lineStat(courseId, dayIndex).todayReps === 0;
}

export function recordOpening(courseId: string, dayIndex: number, mistakes: number) {
  const today = dayNumber();
  updateProgress(p => {
    const key = lineKey(courseId, dayIndex);
    const prev = p.lineStats[key];
    const stat: LineStat = {
      reps: (prev?.reps ?? 0) + 1,
      perfect: (prev?.perfect ?? 0) + (mistakes === 0 ? 1 : 0),
      lastDay: today,
      todayReps: (prev && prev.lastDay === today ? prev.todayReps : 0) + 1,
    };
    return bumpDay({ ...p, lineStats: { ...p.lineStats, [key]: stat } }, 'openings');
  });
}

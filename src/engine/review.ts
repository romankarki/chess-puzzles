import { ALL_COURSES, dayNumber, lineKey } from './schedule';
import { formAdjustment, pickPuzzle, Puzzle, puzzleById, themeSkill } from './puzzles';
import { THEMES, ThemeInfo } from '../data/themes';
import type { LineStat, MissedPuzzle, Progress, Settings, ThemeStat } from '../storage/store';

/**
 * Revision revisits what you've already studied, most-needed first: material
 * you got wrong more often and haven't seen for longer comes first, and
 * anything already revised today drops back so the order keeps rotating.
 */
function priority(successRate: number, lastDay: number | undefined, todayCount: number, today: number) {
  const daysAway = lastDay ? Math.min(30, Math.max(0, today - lastDay)) : 30;
  return ((daysAway + 1) * (1.6 - successRate)) / (1 + 2 * todayCount);
}

export function themePriority(stat: ThemeStat, today: number): number {
  const n = stat.solved + stat.failed;
  const rate = n ? stat.solved / n : 0.5;
  const todayCount = stat.lastDay === today ? stat.todayCount ?? 0 : 0;
  return priority(rate, stat.lastDay, todayCount, today);
}

export function linePriority(stat: LineStat, today: number): number {
  const rate = stat.reps ? stat.perfect / stat.reps : 0;
  const todayCount = stat.lastDay === today ? stat.todayReps : 0;
  return priority(rate, stat.lastDay, todayCount, today);
}

/** Themes you have practised, in revision order. */
export function reviewThemes(progress: Progress, today = dayNumber()): ThemeInfo[] {
  return THEMES.filter(t => {
    const s = progress.themeStats[t.id];
    return s && s.solved + s.failed > 0;
  })
    .map(t => ({ t, score: themePriority(progress.themeStats[t.id], today) }))
    .sort((a, b) => b.score - a.score)
    .map(x => x.t);
}

/** Missed puzzles ready for a retry (missed before today), oldest first. */
export function dueMissed(progress: Progress, today = dayNumber()): MissedPuzzle[] {
  return progress.missed.filter(m => m.day < today);
}

/**
 * Next revision puzzle. Retries of missed puzzles alternate with fresh
 * puzzles from older themes, so a long list of misses never crowds out the rest.
 */
export function nextReviewPuzzle(
  settings: Settings,
  progress: Progress,
  servedToday: number,
  today = dayNumber(),
): Puzzle {
  const due = dueMissed(progress, today);
  if (due.length && servedToday % 2 === 0) {
    const p = puzzleById(due[0].theme, due[0].id);
    if (p) {
      return { ...p, source: 'retry' };
    }
  }
  const theme = reviewThemes(progress, today)[0] ?? THEMES.find(t => t.id === settings.weekTheme) ?? THEMES[0];
  // Revision consolidates: slightly below your level in that theme.
  const target = themeSkill(progress, theme.id) - 50 + formAdjustment(progress.recent);
  return { ...pickPuzzle(theme.id, target, progress.seen), source: 'review' };
}

export interface ReviewLine {
  courseId: string;
  dayIndex: number;
}

/** Opening lines you have played, in revision order. */
export function reviewLines(progress: Progress, today = dayNumber()): ReviewLine[] {
  const out: { line: ReviewLine; score: number }[] = [];
  for (const course of ALL_COURSES) {
    course.days.forEach((_, dayIndex) => {
      const stat = progress.lineStats[lineKey(course.id, dayIndex)];
      if (stat && stat.reps > 0) {
        out.push({ line: { courseId: course.id, dayIndex }, score: linePriority(stat, today) });
      }
    });
  }
  return out.sort((a, b) => b.score - a.score).map(x => x.line);
}

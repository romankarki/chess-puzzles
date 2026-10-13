import openingsData from '../data/openings.json';
import { THEMES, ThemeInfo } from '../data/themes';
import type { OpeningSide, Settings } from '../storage/store';

export type Color = 'w' | 'b';

export interface OpeningLine {
  name: string;
  note: string;
  moves: string[];
  /** [ply, eco, name] — the opening name reached after `ply` half-moves. */
  names: [number, string, string][];
}

export interface Course {
  id: string;
  name: string;
  color: Color;
  level: number;
  summary: string;
  ideas: string[];
  days: OpeningLine[];
}

export const ALL_COURSES: Course[] = (openingsData as { courses: Course[] }).courses;

/** Days since 1970-01-01 in the phone's local time zone. */
export function dayNumber(date = new Date()): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
}

export function dateKey(date = new Date()): string {
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

/** 0 = Monday … 6 = Sunday. Day 0 (1970-01-01) was a Thursday. */
export function weekday(day: number): number {
  return (day + 3) % 7;
}

export function weekNumber(day: number): number {
  return Math.floor((day + 3) / 7);
}

// ───────────────────────── Puzzles: 3 days per theme ─────────────────────────

export const DAYS_PER_THEME = 3;

export function enabledThemes(settings: Settings): ThemeInfo[] {
  const list = THEMES.filter(t => !settings.disabledThemes.includes(t.id));
  return list.length ? list : THEMES;
}

export interface ThemeFocus {
  theme: ThemeInfo;
  /** 1..3 */
  dayInBlock: number;
  daysLeft: number;
  next: ThemeInfo;
}

export function themeFocus(settings: Settings, day = dayNumber()): ThemeFocus {
  const list = enabledThemes(settings);
  const block = Math.floor(day / DAYS_PER_THEME) + settings.themeOffset;
  const idx = ((block % list.length) + list.length) % list.length;
  const dayInBlock = (day % DAYS_PER_THEME) + 1;
  return {
    theme: list[idx],
    dayInBlock,
    daysLeft: DAYS_PER_THEME - dayInBlock + 1,
    next: list[(idx + 1) % list.length],
  };
}

// ───────────────────── Openings: one course per week, one line per day ─────────────────────

/** Courses in teaching order: easier first, alternating White and Black. */
export function courseCycle(side: OpeningSide): Course[] {
  const byLevel = (a: Course, b: Course) => a.level - b.level;
  const white = ALL_COURSES.filter(c => c.color === 'w').sort(byLevel);
  const black = ALL_COURSES.filter(c => c.color === 'b').sort(byLevel);
  if (side === 'w') {
    return white;
  }
  if (side === 'b') {
    return black;
  }
  const out: Course[] = [];
  for (let i = 0; i < Math.max(white.length, black.length); i++) {
    if (i < white.length) {
      out.push(white[i]);
    }
    if (i < black.length) {
      out.push(black[i]);
    }
  }
  return out;
}

export interface OpeningFocus {
  course: Course;
  dayIndex: number;
  line: OpeningLine;
  /** Days left this week, including today. */
  daysLeft: number;
  next: Course;
}

export function openingFocus(settings: Settings, day = dayNumber()): OpeningFocus {
  const cycle = courseCycle(settings.openingSide);
  const w = weekNumber(day) + settings.courseOffset;
  const idx = ((w % cycle.length) + cycle.length) % cycle.length;
  const course = cycle[idx];
  const dayIndex = weekday(day);
  return {
    course,
    dayIndex,
    line: course.days[dayIndex % course.days.length],
    daysLeft: 7 - dayIndex,
    next: cycle[(idx + 1) % cycle.length],
  };
}

export function lineKey(courseId: string, dayIndex: number) {
  return `${courseId}:${dayIndex}`;
}

/** Opening name reached after `ply` half-moves of the line. */
export function nameAtPly(line: OpeningLine, ply: number): { eco: string; name: string } | null {
  let found: { eco: string; name: string } | null = null;
  for (const [p, eco, name] of line.names) {
    if (p <= ply) {
      found = { eco, name };
    }
  }
  return found;
}

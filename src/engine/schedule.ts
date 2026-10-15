import openingsData from '../data/openings.json';
import { THEME_BY_ID, THEMES, ThemeInfo } from '../data/themes';
import type { Settings } from '../storage/store';

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

export function courseById(id: string): Course {
  return ALL_COURSES.find(c => c.id === id) ?? ALL_COURSES[0];
}

export function themeById(id: string): ThemeInfo {
  return THEME_BY_ID[id] ?? THEMES[0];
}

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

/** Weeks start on Monday. */
export function weekNumber(day: number): number {
  return Math.floor((day + 3) / 7);
}

export const WEEKDAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Sunday revises what you learned during the week (when enabled). */
export function isReviewDay(settings: Settings, day = dayNumber()): boolean {
  return settings.sundayReview && weekday(day) === 6;
}

/** True once a new week has started since the focus was last picked. */
export function needsNewPick(settings: Settings, day = dayNumber()): boolean {
  return weekNumber(day) > settings.pickedWeek;
}

export interface WeekFocus {
  theme: ThemeInfo;
  course: Course;
  /** 0..6 — the course variation taught today (Monday = first). */
  dayIndex: number;
  line: OpeningLine;
  review: boolean;
}

/**
 * What to train today: the week's chosen theme and course, with one variation
 * of the course per weekday.
 */
export function weekFocus(settings: Settings, day = dayNumber()): WeekFocus {
  const course = courseById(settings.weekCourse);
  const dayIndex = weekday(day);
  return {
    theme: themeById(settings.weekTheme),
    course,
    dayIndex,
    line: course.days[dayIndex % course.days.length],
    review: isReviewDay(settings, day),
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

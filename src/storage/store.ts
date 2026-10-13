import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

export type TrainingMode = 'puzzles' | 'openings' | 'mixed';
export type OpeningSide = 'both' | 'w' | 'b';

export interface Settings {
  mode: TrainingMode;
  puzzlesPerChallenge: number;
  openingSide: OpeningSide;
  /** Shifts the 3-day theme cycle ("skip theme"). */
  themeOffset: number;
  /** Shifts the weekly course cycle ("skip opening"). */
  courseOffset: number;
  disabledThemes: string[];
  onboarded: boolean;
  /** Day number of onboarding: the curriculum and course cycle start here. */
  startDay: number;
}

export interface ThemeStat {
  solved: number;
  failed: number;
}

export interface LineStat {
  reps: number;
  perfect: number;
  /** Day number of the last rep (see engine/schedule dayNumber). */
  lastDay: number;
  /** Reps on lastDay. */
  todayReps: number;
}

export interface DayLog {
  puzzles: number;
  openings: number;
  challenges: number;
}

export interface Progress {
  rating: number;
  puzzlesSolved: number;
  puzzlesFailed: number;
  /** Recently seen puzzle ids (most recent last), to avoid repeats. */
  seen: string[];
  themeStats: Record<string, ThemeStat>;
  /** key: `${courseId}:${dayIndex}` */
  lineStats: Record<string, LineStat>;
  daily: Record<string, DayLog>;
  streak: { count: number; lastDay: number };
  /** Alternates puzzle/opening challenges in mixed mode. */
  challengeCounter: number;
}

export interface State {
  loaded: boolean;
  settings: Settings;
  progress: Progress;
}

export const DEFAULT_SETTINGS: Settings = {
  mode: 'puzzles',
  puzzlesPerChallenge: 1,
  openingSide: 'both',
  themeOffset: 0,
  courseOffset: 0,
  disabledThemes: [],
  onboarded: false,
  startDay: 0,
};

export const DEFAULT_PROGRESS: Progress = {
  rating: 1000,
  puzzlesSolved: 0,
  puzzlesFailed: 0,
  seen: [],
  themeStats: {},
  lineStats: {},
  daily: {},
  streak: { count: 0, lastDay: 0 },
  challengeCounter: 0,
};

const KEY_SETTINGS = 'chesslock.settings.v1';
const KEY_PROGRESS = 'chesslock.progress.v1';
const MAX_SEEN = 3000;

let state: State = {
  loaded: false,
  settings: DEFAULT_SETTINGS,
  progress: DEFAULT_PROGRESS,
};
const listeners = new Set<() => void>();
let loading: Promise<void> | null = null;

function emit() {
  listeners.forEach(l => l());
}

export function getState(): State {
  return state;
}

/** Loads persisted state once; safe to call from several screens. */
export function loadState(): Promise<void> {
  if (!loading) {
    loading = (async () => {
      try {
        const [s, p] = await Promise.all([
          AsyncStorage.getItem(KEY_SETTINGS),
          AsyncStorage.getItem(KEY_PROGRESS),
        ]);
        state = {
          loaded: true,
          settings: { ...DEFAULT_SETTINGS, ...(s ? JSON.parse(s) : {}) },
          progress: { ...DEFAULT_PROGRESS, ...(p ? JSON.parse(p) : {}) },
        };
      } catch (e) {
        console.warn('ChessLock: could not load state', e);
        state = { ...state, loaded: true };
      }
      emit();
    })();
  }
  return loading;
}

export function updateSettings(patch: Partial<Settings>) {
  state = { ...state, settings: { ...state.settings, ...patch } };
  emit();
  AsyncStorage.setItem(KEY_SETTINGS, JSON.stringify(state.settings)).catch(() => {});
}

export function updateProgress(fn: (p: Progress) => Progress) {
  state = { ...state, progress: fn(state.progress) };
  emit();
  AsyncStorage.setItem(KEY_PROGRESS, JSON.stringify(state.progress)).catch(() => {});
}

export function resetProgress(rating: number) {
  updateProgress(() => ({ ...DEFAULT_PROGRESS, rating }));
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useStore(): State {
  return useSyncExternalStore(subscribe, getState);
}

export function rememberSeen(seen: string[], id: string): string[] {
  const next = seen.filter(s => s !== id);
  next.push(id);
  return next.length > MAX_SEEN ? next.slice(next.length - MAX_SEEN) : next;
}

import React, { useMemo, useState } from 'react';
import { getState, TrainingMode } from '../storage/store';
import { ALL_COURSES, openingFocus, themeFocus } from '../engine/schedule';
import { pickPuzzle, Puzzle, recordPuzzle, targetRating } from '../engine/puzzles';
import { isGuided, recordOpening } from '../engine/openings';
import PuzzleTrainer from './PuzzleTrainer';
import OpeningTrainer from './OpeningTrainer';

export type SessionKind = 'puzzles' | 'opening';

/** Picks what to train for a challenge, alternating in mixed mode. */
export function sessionKindFor(mode: TrainingMode, counter: number): SessionKind {
  if (mode === 'openings') {
    return 'opening';
  }
  if (mode === 'mixed') {
    return counter % 2 === 0 ? 'puzzles' : 'opening';
  }
  return 'puzzles';
}

function nextPuzzle(themeId?: string): Puzzle {
  const { settings, progress } = getState();
  if (themeId) {
    return pickPuzzle(themeId, progress.rating, progress.seen);
  }
  const focus = themeFocus(settings);
  return pickPuzzle(focus.theme.id, targetRating(progress.rating, focus.dayInBlock), progress.seen);
}

interface Props {
  kind: SessionKind;
  /** Number of puzzles to solve (puzzle sessions only). */
  count: number;
  size: number;
  onFinished: () => void;
  onProgress?: (done: number, total: number) => void;
  finishLabel?: string;
  /** Practise this theme instead of the current 3-day focus. */
  themeId?: string;
  /** Practise this line instead of today's opening. */
  line?: { courseId: string; dayIndex: number };
}

/** Runs today's training: N puzzles of the current theme, or one pass of today's opening line. */
export default function TrainingSession({
  kind,
  count,
  size,
  onFinished,
  onProgress,
  finishLabel = 'Done',
  themeId,
  line,
}: Props) {
  const [index, setIndex] = useState(0);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(() =>
    kind === 'puzzles' ? nextPuzzle(themeId) : null,
  );
  const opening = useMemo(() => {
    if (line) {
      const course = ALL_COURSES.find(c => c.id === line.courseId) ?? ALL_COURSES[0];
      return { course, dayIndex: line.dayIndex, guided: isGuided(course.id, line.dayIndex) };
    }
    const focus = openingFocus(getState().settings);
    return { ...focus, guided: isGuided(focus.course.id, focus.dayIndex) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (kind === 'opening') {
    return (
      <OpeningTrainer
        course={opening.course}
        dayIndex={opening.dayIndex}
        guided={opening.guided}
        size={size}
        continueLabel={finishLabel}
        onComplete={r => {
          recordOpening(opening.course.id, opening.dayIndex, r.mistakes);
          onProgress?.(1, 1);
          onFinished();
        }}
      />
    );
  }

  if (!puzzle) {
    return null;
  }
  const last = index + 1 >= count;
  return (
    <PuzzleTrainer
      key={puzzle.id}
      puzzle={puzzle}
      size={size}
      continueLabel={last ? finishLabel : 'Next puzzle'}
      onComplete={r => {
        recordPuzzle(puzzle, r.clean);
        onProgress?.(index + 1, count);
        if (last) {
          onFinished();
        } else {
          setIndex(i => i + 1);
          setPuzzle(nextPuzzle(themeId));
        }
      }}
    />
  );
}

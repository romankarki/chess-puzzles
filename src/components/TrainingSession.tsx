import React, { useMemo, useState } from 'react';
import { getState, TrainingMode } from '../storage/store';
import { courseById, dateKey, weekFocus } from '../engine/schedule';
import {
  formAdjustment,
  pickPuzzle,
  Puzzle,
  recordPuzzle,
  targetRating,
  themeSkill,
} from '../engine/puzzles';
import { isGuided, recordOpening } from '../engine/openings';
import { nextReviewPuzzle, reviewLines } from '../engine/review';
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

function nextPuzzle(review: boolean): Puzzle {
  const { settings, progress } = getState();
  if (review) {
    return nextReviewPuzzle(settings, progress, progress.daily[dateKey()]?.puzzles ?? 0);
  }
  const theme = weekFocus(settings).theme.id;
  const target = targetRating(themeSkill(progress, theme), formAdjustment(progress.recent));
  return pickPuzzle(theme, target, progress.seen);
}

interface Props {
  kind: SessionKind;
  /** Number of puzzles to solve (puzzle sessions only). */
  count: number;
  size: number;
  onFinished: () => void;
  onProgress?: (done: number, total: number) => void;
  finishLabel?: string;
  /** Practise this line instead of today's. */
  line?: { courseId: string; dayIndex: number };
  /** Revise older material. Defaults to on for revision days (unless a line is given). */
  review?: boolean;
}

/** Runs today's training: N puzzles of the week's theme, or one pass of today's opening line. */
export default function TrainingSession({
  kind,
  count,
  size,
  onFinished,
  onProgress,
  finishLabel = 'Done',
  line,
  review,
}: Props) {
  const [reviewing] = useState(() => review ?? (!line && weekFocus(getState().settings).review));
  const [index, setIndex] = useState(0);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(() =>
    kind === 'puzzles' ? nextPuzzle(reviewing) : null,
  );
  const opening = useMemo(() => {
    const { settings, progress } = getState();
    if (line) {
      const course = courseById(line.courseId);
      return { course, dayIndex: line.dayIndex, guided: isGuided(course.id, line.dayIndex) };
    }
    const old = reviewing ? reviewLines(progress)[0] : undefined;
    if (old) {
      // Revision is always from memory; hints appear only after mistakes.
      return { course: courseById(old.courseId), dayIndex: old.dayIndex, guided: false };
    }
    const focus = weekFocus(settings);
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
      continueLabel={last ? finishLabel : 'Next'}
      onComplete={r => {
        recordPuzzle(puzzle, r.clean);
        onProgress?.(index + 1, count);
        if (last) {
          onFinished();
        } else {
          setIndex(i => i + 1);
          setPuzzle(nextPuzzle(reviewing));
        }
      }}
    />
  );
}

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Chess } from 'chess.js';
import Board, { AnimatedMove, BoardArrow, Color } from '../chess/Board';
import { checkSquareOf, destsOf, opposite, parseUci, piecesOf, toUci, tryMove } from '../chess/game';
import { Puzzle } from '../engine/puzzles';
import { THEME_BY_ID } from '../data/themes';
import { colors } from '../theme';
import { Button, Pill, Row } from './ui';

type Status = 'intro' | 'play' | 'opponent' | 'wrong' | 'solved';

export interface PuzzleResult {
  /** Solved without any mistake or hint. */
  clean: boolean;
}

interface Props {
  puzzle: Puzzle;
  size: number;
  onComplete: (result: PuzzleResult) => void;
  /** Label for the button shown after solving. */
  continueLabel?: string;
}

const OPPONENT_DELAY = 450;
const NO_DESTS = {};

export default function PuzzleTrainer({ puzzle, size, onComplete, continueLabel = 'Continue' }: Props) {
  const chess = useRef(new Chess(puzzle.fen)).current;
  const [version, setVersion] = useState(0);
  const [status, setStatus] = useState<Status>('intro');
  const [step, setStep] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hints, setHints] = useState(0);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [anim, setAnim] = useState<AnimatedMove | null>(null);
  const [flash, setFlash] = useState<{ square: string; kind: 'good' | 'bad'; id: number } | null>(null);
  const animId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // The trainee plays the side that is NOT to move in the starting FEN.
  const userColor: Color = useMemo(() => opposite(new Chess(puzzle.fen).turn()), [puzzle.fen]);
  const theme = THEME_BY_ID[puzzle.theme];

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const refresh = () => setVersion(v => v + 1);

  const playScripted = useCallback(
    (index: number) => {
      const { from, to, promotion } = parseUci(puzzle.moves[index]);
      tryMove(chess, { from, to, promotion });
      setLastMove({ from, to });
      setAnim({ from, to, id: ++animId.current });
      refresh();
    },
    [chess, puzzle.moves],
  );

  // Opponent's first move starts the puzzle.
  useEffect(() => {
    later(() => {
      playScripted(0);
      setStep(1);
      setStatus('play');
    }, 650);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMove = (from: string, to: string, promotion: string | undefined, dragged: boolean) => {
    if (status !== 'play') {
      return;
    }
    const expected = puzzle.moves[step];
    const move = tryMove(chess, { from, to, promotion });
    if (!move) {
      return;
    }
    const correct = toUci(move) === expected || chess.isCheckmate();
    setLastMove({ from, to });
    setAnim(dragged ? null : { from, to, id: ++animId.current });
    refresh();

    if (!correct) {
      setMistakes(m => m + 1);
      setStatus('wrong');
      setFlash({ square: to, kind: 'bad', id: Date.now() });
      later(() => {
        chess.undo();
        setLastMove(null);
        setAnim(null);
        refresh();
        setStatus('play');
      }, 700);
      return;
    }

    setFlash({ square: to, kind: 'good', id: Date.now() });
    const next = step + 1;
    if (next >= puzzle.moves.length || chess.isCheckmate()) {
      setStep(next);
      setStatus('solved');
      return;
    }
    setStatus('opponent');
    later(() => {
      playScripted(next);
      const after = next + 1;
      setStep(after);
      setStatus(after >= puzzle.moves.length ? 'solved' : 'play');
    }, OPPONENT_DELAY);
  };

  const expected = status === 'play' ? parseUci(puzzle.moves[step]) : null;
  // Hints escalate: 1 = highlight the piece, 2 = show the arrow.
  const hintLevel = Math.max(hints, mistakes >= 3 ? 2 : mistakes >= 2 ? 1 : 0);
  const arrows: BoardArrow[] =
    expected && hintLevel >= 2 ? [{ from: expected.from, to: expected.to, color: colors.info }] : [];
  const clean = mistakes === 0 && hints === 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pieces = useMemo(() => piecesOf(chess), [version]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dests = useMemo(() => destsOf(chess), [version]);

  let message: string;
  let messageColor = colors.text;
  if (status === 'intro') {
    message = 'Get ready…';
    messageColor = colors.textDim;
  } else if (status === 'solved') {
    message = clean ? 'Solved!' : 'Solved — with help.';
    messageColor = colors.success;
  } else if (status === 'wrong') {
    message = 'Not that one — try again.';
    messageColor = colors.danger;
  } else if (status === 'opponent') {
    message = 'Good move…';
    messageColor = colors.success;
  } else {
    message = 'Your move.';
  }

  const userMovesTotal = Math.floor(puzzle.moves.length / 2);
  const userMovesDone = Math.floor(step / 2);

  return (
    <View style={{ width: size }}>
      <Row style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{theme?.title ?? 'Puzzle'}</Text>
          <Text style={styles.sub}>
            {puzzle.source === 'retry'
              ? 'Retry · you missed this one before · '
              : puzzle.source === 'review'
              ? 'Revision · '
              : ''}
            {userMovesTotal === 1 ? 'One move' : `${userMovesTotal} moves`} · rated {puzzle.rating}
          </Text>
        </View>
        <Pill text={userColor === 'w' ? 'WHITE' : 'BLACK'} color={colors.text} />
      </Row>
      <Board
        pieces={pieces}
        orientation={userColor}
        size={size}
        movable={status === 'play' ? userColor : null}
        dests={status === 'play' ? dests : NO_DESTS}
        onMove={onMove}
        lastMove={lastMove}
        checkSquare={checkSquareOf(chess)}
        arrows={arrows}
        hintSquare={expected && hintLevel >= 1 ? expected.from : null}
        flash={flash}
        animatedMove={anim}
      />
      <View style={styles.progressRow}>
        {Array.from({ length: userMovesTotal }).map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i < userMovesDone && { backgroundColor: colors.success }]}
          />
        ))}
      </View>
      <Text style={[styles.message, { color: messageColor }]}>{message}</Text>
      {theme && status !== 'solved' && (hintLevel > 0 || mistakes > 0) && (
        <Text style={styles.tip}>{theme.tip}</Text>
      )}
      <Row style={styles.actions}>
        {status === 'solved' ? (
          <Button title={continueLabel} onPress={() => onComplete({ clean })} style={{ flex: 1 }} />
        ) : (
          <Button
            title={hintLevel >= 2 ? 'Showing solution' : hintLevel === 1 ? 'Show move' : 'Hint'}
            kind="secondary"
            small
            disabled={status !== 'play' || hintLevel >= 2}
            onPress={() => setHints(h => Math.max(h, hintLevel) + 1)}
          />
        )}
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  sub: {
    color: colors.textDim,
    fontSize: 13,
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  message: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 12,
  },
  tip: {
    color: colors.textDim,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  actions: {
    marginTop: 14,
    justifyContent: 'center',
  },
});

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, ScrollViewInstance, StyleSheet, Text, View } from 'react-native';
import { Chess } from 'chess.js';
import Board, { AnimatedMove, BoardArrow } from '../chess/Board';
import { checkSquareOf, destsOf, piecesOf, tryMove } from '../chess/game';
import { Course, nameAtPly } from '../engine/schedule';
import { colors, radius } from '../theme';
import { Button, Pill, Row } from './ui';

type Status = 'play' | 'opponent' | 'wrong' | 'done';

export interface OpeningResult {
  mistakes: number;
}

interface Props {
  course: Course;
  dayIndex: number;
  /** Show the expected move with an arrow before every move. */
  guided: boolean;
  size: number;
  onComplete: (result: OpeningResult) => void;
  continueLabel?: string;
}

const OPPONENT_DELAY = 420;
const NO_DESTS = {};

export default function OpeningTrainer({
  course,
  dayIndex,
  guided,
  size,
  onComplete,
  continueLabel = 'Continue',
}: Props) {
  const line = course.days[dayIndex];
  const userColor = course.color;
  const chess = useRef(new Chess()).current;
  const [version, setVersion] = useState(0);
  const [ply, setPly] = useState(0);
  const [status, setStatus] = useState<Status>('opponent');
  const [mistakes, setMistakes] = useState(0);
  const [missesHere, setMissesHere] = useState(0);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [anim, setAnim] = useState<AnimatedMove | null>(null);
  const [flash, setFlash] = useState<{ square: string; kind: 'good' | 'bad'; id: number } | null>(null);
  const animId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scroller = useRef<ScrollViewInstance>(null);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const isUserTurn = (p: number) => (p % 2 === 0 ? 'w' : 'b') === userColor;

  /** Plays scripted opponent moves until it is the trainee's turn (or the line ends). */
  const advance = (fromPly: number) => {
    if (fromPly >= line.moves.length) {
      setPly(fromPly);
      setStatus('done');
      return;
    }
    if (isUserTurn(fromPly)) {
      setPly(fromPly);
      setStatus('play');
      setMissesHere(0);
      return;
    }
    setStatus('opponent');
    later(() => {
      const mv = tryMove(chess, line.moves[fromPly]);
      if (mv) {
        setLastMove({ from: mv.from, to: mv.to });
        setAnim({ from: mv.from, to: mv.to, id: ++animId.current });
      }
      setVersion(v => v + 1);
      advance(fromPly + 1);
    }, fromPly === 0 ? 650 : OPPONENT_DELAY);
  };

  useEffect(() => {
    advance(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scroller.current?.scrollToEnd({ animated: true });
  }, [ply]);

  // What the expected move looks like on the board (for arrows).
  const expected = useMemo(() => {
    if (status !== 'play' || ply >= line.moves.length) {
      return null;
    }
    const probe = new Chess(chess.fen());
    const mv = tryMove(probe, line.moves[ply]);
    return mv ? { from: mv.from, to: mv.to, san: mv.san } : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, ply, version]);

  const onMove = (from: string, to: string, promotion: string | undefined, dragged: boolean) => {
    if (status !== 'play') {
      return;
    }
    const mv = tryMove(chess, { from, to, promotion });
    if (!mv) {
      return;
    }
    setLastMove({ from, to });
    setAnim(dragged ? null : { from, to, id: ++animId.current });
    setVersion(v => v + 1);
    if (mv.san !== line.moves[ply]) {
      setMistakes(m => m + 1);
      setMissesHere(m => m + 1);
      setStatus('wrong');
      setFlash({ square: to, kind: 'bad', id: Date.now() });
      later(() => {
        chess.undo();
        setLastMove(null);
        setAnim(null);
        setVersion(v => v + 1);
        setStatus('play');
      }, 650);
      return;
    }
    setFlash({ square: to, kind: 'good', id: Date.now() });
    advance(ply + 1);
  };

  const showArrow = expected && (guided || missesHere > 0);
  const arrows: BoardArrow[] = showArrow
    ? [{ from: expected!.from, to: expected!.to, color: guided && missesHere === 0 ? colors.arrow : colors.info }]
    : [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pieces = useMemo(() => piecesOf(chess), [version]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dests = useMemo(() => destsOf(chess), [version]);
  const reached = nameAtPly(line, Math.max(ply, 1));

  let message: string;
  let messageColor = colors.text;
  if (status === 'done') {
    message = mistakes === 0 ? 'Perfect!' : `Done — ${mistakes} mistake${mistakes > 1 ? 's' : ''}.`;
    messageColor = colors.success;
  } else if (status === 'wrong') {
    message = 'Not the book move — try again.';
    messageColor = colors.danger;
  } else if (status === 'opponent') {
    message = '…';
    messageColor = colors.textDim;
  } else if (showArrow && guided && missesHere === 0) {
    message = `Play ${expected!.san}.`;
  } else if (showArrow) {
    message = `The book move is ${expected!.san}.`;
    messageColor = colors.info;
  } else {
    message = 'Your move, from memory.';
  }

  const userTotal = line.moves.filter((_, i) => isUserTurn(i)).length;
  const userDone = line.moves.slice(0, ply).filter((_, i) => isUserTurn(i)).length;

  return (
    <View style={{ width: size }}>
      <Row style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {course.name}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            Day {dayIndex + 1}: {line.name}
          </Text>
        </View>
        <Pill text={guided ? 'LEARN' : 'RECALL'} color={guided ? colors.info : colors.accent} />
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
        flash={flash}
        animatedMove={anim}
      />
      <ScrollView
        ref={scroller}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.moves}
        contentContainerStyle={styles.movesContent}>
        {line.moves.slice(0, ply).map((san, i) => (
          <Text key={i} style={[styles.move, isUserTurn(i) && styles.moveUser]}>
            {i % 2 === 0 ? `${i / 2 + 1}. ` : ''}
            {san}
          </Text>
        ))}
        {ply < line.moves.length && <Text style={styles.moveNext}>…</Text>}
      </ScrollView>
      <Text style={styles.eco} numberOfLines={2}>
        {reached ? `${reached.eco} · ${reached.name}` : ' '}
      </Text>
      <Text style={[styles.message, { color: messageColor }]}>{message}</Text>
      <Text style={styles.note}>{status === 'done' ? line.note : `${userDone}/${userTotal} moves`}</Text>
      {status === 'done' && (
        <Button
          title={continueLabel}
          onPress={() => onComplete({ mistakes })}
          style={{ marginTop: 14 }}
        />
      )}
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
  moves: {
    marginTop: 10,
    maxHeight: 34,
  },
  movesContent: {
    alignItems: 'center',
    gap: 6,
    paddingRight: 8,
  },
  move: {
    color: colors.textDim,
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  moveUser: {
    color: colors.accent,
    backgroundColor: colors.accentDim,
  },
  moveNext: {
    color: colors.textFaint,
    fontSize: 16,
  },
  eco: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  message: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  note: {
    color: colors.textDim,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});

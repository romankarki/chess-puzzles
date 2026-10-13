import React, { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Line, Polygon, SvgXml } from 'react-native-svg';
import { PIECE_XML } from './pieces';
import { colors } from '../theme';

export type Color = 'w' | 'b';
export type Square = string; // "e4"
export type PieceCode = string; // "wN"

export interface BoardArrow {
  from: Square;
  to: Square;
  color?: string;
}

export interface AnimatedMove {
  from: Square;
  to: Square;
  /** Changes every time a new animation should run. */
  id: number;
}

interface Props {
  /** Map of square -> piece code ("wK"). */
  pieces: Record<Square, PieceCode>;
  orientation: Color;
  size: number;
  /** Side allowed to move pieces; null disables interaction. */
  movable: Color | null;
  /** Legal destinations per origin square for the movable side. */
  dests: Record<Square, Square[]>;
  /** `dragged` is true when the piece was dropped by hand (no animation needed). */
  onMove: (from: Square, to: Square, promotion: string | undefined, dragged: boolean) => void;
  lastMove?: { from: Square; to: Square } | null;
  checkSquare?: Square | null;
  arrows?: BoardArrow[];
  hintSquare?: Square | null;
  flash?: { square: Square; kind: 'good' | 'bad'; id: number } | null;
  animatedMove?: AnimatedMove | null;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function squareToXY(sq: Square, orientation: Color, cell: number) {
  const f = sq.charCodeAt(0) - 97;
  const r = parseInt(sq[1], 10) - 1;
  const col = orientation === 'w' ? f : 7 - f;
  const row = orientation === 'w' ? 7 - r : r;
  return { x: col * cell, y: row * cell };
}

function xyToSquare(x: number, y: number, orientation: Color, cell: number): Square | null {
  const col = Math.floor(x / cell);
  const row = Math.floor(y / cell);
  if (col < 0 || col > 7 || row < 0 || row > 7) {
    return null;
  }
  const f = orientation === 'w' ? col : 7 - col;
  const r = orientation === 'w' ? 7 - row : row;
  return `${FILES[f]}${r + 1}`;
}

export const PieceImage = memo(function PieceImage({
  code,
  size,
}: {
  code: PieceCode;
  size: number;
}) {
  return <SvgXml xml={PIECE_XML[code]} width={size} height={size} />;
});

const AnimatedPiece = memo(function AnimatedPiece({
  code,
  cell,
  x,
  y,
  fromX,
  fromY,
  animId,
  hidden,
}: {
  code: PieceCode;
  cell: number;
  x: number;
  y: number;
  fromX?: number;
  fromY?: number;
  animId?: number;
  hidden: boolean;
}) {
  const offset = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  useLayoutEffect(() => {
    if (animId === undefined || fromX === undefined || fromY === undefined) {
      return;
    }
    offset.setValue({ x: fromX - x, y: fromY - y });
    Animated.timing(offset, {
      toValue: { x: 0, y: 0 },
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    // Only re-run when a new animation is requested.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animId]);
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.piece,
        {
          width: cell,
          height: cell,
          left: x,
          top: y,
          opacity: hidden ? 0.25 : 1,
          transform: offset.getTranslateTransform(),
        },
      ]}>
      <PieceImage code={code} size={cell} />
    </Animated.View>
  );
});

function Arrows({
  arrows,
  orientation,
  cell,
  size,
}: {
  arrows: BoardArrow[];
  orientation: Color;
  cell: number;
  size: number;
}) {
  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill} pointerEvents="none">
      {arrows.map((a, i) => {
        const p1 = squareToXY(a.from, orientation, cell);
        const p2 = squareToXY(a.to, orientation, cell);
        const x1 = p1.x + cell / 2;
        const y1 = p1.y + cell / 2;
        const x2 = p2.x + cell / 2;
        const y2 = p2.y + cell / 2;
        const ang = Math.atan2(y2 - y1, x2 - x1);
        const head = cell * 0.38;
        const bx = x2 - Math.cos(ang) * head;
        const by = y2 - Math.sin(ang) * head;
        const w = cell * 0.2;
        const color = a.color ?? colors.arrow;
        const pts = [
          `${x2},${y2}`,
          `${bx + Math.sin(ang) * w},${by - Math.cos(ang) * w}`,
          `${bx - Math.sin(ang) * w},${by + Math.cos(ang) * w}`,
        ].join(' ');
        return (
          <React.Fragment key={i}>
            <Line
              x1={x1}
              y1={y1}
              x2={bx}
              y2={by}
              stroke={color}
              strokeWidth={cell * 0.16}
              strokeLinecap="round"
              opacity={0.85}
            />
            <Polygon points={pts} fill={color} opacity={0.85} />
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

export default function Board({
  pieces,
  orientation,
  size,
  movable,
  dests,
  onMove,
  lastMove,
  checkSquare,
  arrows,
  hintSquare,
  flash,
  animatedMove,
}: Props) {
  const cell = size / 8;
  const [selected, setSelected] = useState<Square | null>(null);
  const [drag, setDrag] = useState<{ from: Square; code: PieceCode } | null>(null);
  const [promo, setPromo] = useState<{ from: Square; to: Square; dragged: boolean } | null>(null);
  const gesture = useRef<{ x: number; y: number; sq: Square | null; consumed: boolean } | null>(null);
  const dragPos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  // Keep the latest props visible to the PanResponder, which is created once.
  const live = useRef({ pieces, orientation, cell, movable, dests, selected, onMove });
  live.current = { pieces, orientation, cell, movable, dests, selected, onMove };

  useEffect(() => {
    setSelected(null);
    setPromo(null);
  }, [pieces, movable]);

  useEffect(() => {
    if (!flash) {
      return;
    }
    flashAnim.setValue(1);
    Animated.timing(flashAnim, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [flash, flashAnim]);

  const isPromotion = (from: Square, to: Square) => {
    const code = live.current.pieces[from];
    return !!code && code[1] === 'P' && (to[1] === '8' || to[1] === '1');
  };

  const tryMove = (from: Square, to: Square, dragged: boolean) => {
    const { dests: d, onMove: om } = live.current;
    if (!(d[from] ?? []).includes(to)) {
      return false;
    }
    if (isPromotion(from, to)) {
      setPromo({ from, to, dragged });
      return true;
    }
    setSelected(null);
    om(from, to, undefined, dragged);
    return true;
  };

  const ownPieceAt = (sq: Square | null) => {
    const { pieces: p, movable: m } = live.current;
    return !!sq && !!m && !!p[sq] && p[sq][0] === m;
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => live.current.movable !== null,
        onMoveShouldSetPanResponder: () => live.current.movable !== null,
        onPanResponderGrant: evt => {
          const { orientation: o, cell: c, pieces: p, selected: sel } = live.current;
          const { locationX, locationY } = evt.nativeEvent;
          const sq = xyToSquare(locationX, locationY, o, c);
          gesture.current = { x: locationX, y: locationY, sq, consumed: false };
          if (sel && sq && sq !== sel && tryMove(sel, sq, false)) {
            gesture.current.consumed = true;
            return;
          }
          if (ownPieceAt(sq)) {
            setSelected(sq);
            setDrag({ from: sq!, code: p[sq!] });
            dragPos.setValue({ x: locationX - c / 2, y: locationY - c / 2 });
          } else {
            setSelected(null);
          }
        },
        onPanResponderMove: (_evt, g) => {
          const start = gesture.current;
          if (!start || start.consumed) {
            return;
          }
          const c = live.current.cell;
          dragPos.setValue({ x: start.x + g.dx - c / 2, y: start.y + g.dy - c / 2 });
        },
        onPanResponderRelease: (_evt, g) => {
          const start = gesture.current;
          setDrag(null);
          if (!start || start.consumed || !start.sq) {
            return;
          }
          const { orientation: o, cell: c } = live.current;
          const target = xyToSquare(start.x + g.dx, start.y + g.dy, o, c);
          if (target && target !== start.sq) {
            tryMove(start.sq, target, true);
          }
        },
        onPanResponderTerminate: () => setDrag(null),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const squares = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const f = orientation === 'w' ? col : 7 - col;
      const r = orientation === 'w' ? 7 - row : row;
      const sq = `${FILES[f]}${r + 1}`;
      const light = (f + r) % 2 === 1;
      const isLast = lastMove && (lastMove.from === sq || lastMove.to === sq);
      const isSel = selected === sq;
      squares.push(
        <View
          key={sq}
          style={{
            position: 'absolute',
            left: col * cell,
            top: row * cell,
            width: cell,
            height: cell,
            backgroundColor: light ? colors.lightSquare : colors.darkSquare,
          }}>
          {isLast && <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.lastMove }]} />}
          {isSel && <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.selected }]} />}
          {hintSquare === sq && (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.hint }]} />
          )}
          {checkSquare === sq && (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.check, borderRadius: cell / 2 },
              ]}
            />
          )}
          {col === 0 && (
            <Text
              style={[
                styles.coord,
                { top: 2, left: 3, fontSize: cell * 0.2 },
                { color: light ? colors.darkSquare : colors.lightSquare },
              ]}>
              {r + 1}
            </Text>
          )}
          {row === 7 && (
            <Text
              style={[
                styles.coord,
                { bottom: 1, right: 4, fontSize: cell * 0.2 },
                { color: light ? colors.darkSquare : colors.lightSquare },
              ]}>
              {FILES[f]}
            </Text>
          )}
        </View>,
      );
    }
  }

  const destDots = selected
    ? (dests[selected] ?? []).map(to => {
        const { x, y } = squareToXY(to, orientation, cell);
        const capture = !!pieces[to];
        return (
          <View
            key={`d${to}`}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: cell,
              height: cell,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {capture ? (
              <View
                style={{
                  width: cell,
                  height: cell,
                  borderRadius: cell / 2,
                  borderWidth: cell * 0.08,
                  borderColor: colors.dest,
                }}
              />
            ) : (
              <View
                style={{
                  width: cell * 0.3,
                  height: cell * 0.3,
                  borderRadius: cell * 0.15,
                  backgroundColor: colors.dest,
                }}
              />
            )}
          </View>
        );
      })
    : null;

  const pieceViews = Object.entries(pieces).map(([sq, code]) => {
    const { x, y } = squareToXY(sq, orientation, cell);
    const anim = animatedMove && animatedMove.to === sq ? animatedMove : null;
    const from = anim ? squareToXY(anim.from, orientation, cell) : null;
    return (
      <AnimatedPiece
        key={`${sq}${code}`}
        code={code}
        cell={cell}
        x={x}
        y={y}
        fromX={from?.x}
        fromY={from?.y}
        animId={anim?.id}
        hidden={drag?.from === sq}
      />
    );
  });

  let flashView = null;
  if (flash) {
    const { x, y } = squareToXY(flash.square, orientation, cell);
    flashView = (
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: cell,
          height: cell,
          opacity: flashAnim,
          backgroundColor: flash.kind === 'good' ? colors.good : colors.bad,
        }}
      />
    );
  }

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[styles.board, { width: size, height: size }]}
        {...panResponder.panHandlers}>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {squares}
          {flashView}
          {pieceViews}
          {destDots}
          {arrows && arrows.length > 0 && (
            <Arrows arrows={arrows} orientation={orientation} cell={cell} size={size} />
          )}
          {drag && (
            <Animated.View
              style={[
                styles.piece,
                {
                  width: cell * 1.25,
                  height: cell * 1.25,
                  marginLeft: -cell * 0.125,
                  marginTop: -cell * 0.35,
                  transform: dragPos.getTranslateTransform(),
                },
              ]}>
              <PieceImage code={drag.code} size={cell * 1.25} />
            </Animated.View>
          )}
        </View>
      </View>
      {promo && (
        <View style={[StyleSheet.absoluteFill, styles.promoBackdrop]}>
          <Text style={styles.promoTitle}>Promote to</Text>
          <View style={styles.promoRow}>
            {['q', 'r', 'b', 'n'].map(p => (
              <Pressable
                key={p}
                style={[styles.promoBtn, { width: cell * 1.3, height: cell * 1.3 }]}
                onPress={() => {
                  const m = promo;
                  setPromo(null);
                  setSelected(null);
                  onMove(m.from, m.to, p, m.dragged);
                }}>
                <PieceImage code={`${movable ?? 'w'}${p.toUpperCase()}`} size={cell * 1.15} />
              </Pressable>
            ))}
          </View>
          <Pressable onPress={() => setPromo(null)}>
            <Text style={styles.promoCancel}>Cancel</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  piece: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  coord: {
    position: 'absolute',
    fontWeight: '700',
  },
  promoBackdrop: {
    backgroundColor: 'rgba(10,12,20,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  promoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  promoBtn: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoCancel: {
    color: '#ccc',
    marginTop: 16,
    fontSize: 14,
  },
});

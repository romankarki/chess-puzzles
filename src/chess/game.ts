import { Chess, Move } from 'chess.js';
import type { Color, PieceCode, Square } from './Board';

export function piecesOf(chess: Chess): Record<Square, PieceCode> {
  const out: Record<Square, PieceCode> = {};
  for (const row of chess.board()) {
    for (const p of row) {
      if (p) {
        out[p.square] = `${p.color}${p.type.toUpperCase()}`;
      }
    }
  }
  return out;
}

export function destsOf(chess: Chess): Record<Square, Square[]> {
  const out: Record<Square, Square[]> = {};
  for (const m of chess.moves({ verbose: true })) {
    (out[m.from] ??= []).push(m.to);
  }
  return out;
}

export function checkSquareOf(chess: Chess): Square | null {
  if (!chess.inCheck()) {
    return null;
  }
  const turn = chess.turn();
  for (const row of chess.board()) {
    for (const p of row) {
      if (p && p.type === 'k' && p.color === turn) {
        return p.square;
      }
    }
  }
  return null;
}

export function parseUci(uci: string) {
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: uci.length > 4 ? uci[4] : undefined,
  };
}

export function toUci(m: Pick<Move, 'from' | 'to' | 'promotion'>): string {
  return `${m.from}${m.to}${m.promotion ?? ''}`;
}

/** Plays a move, returning null instead of throwing when it is illegal. */
export function tryMove(
  chess: Chess,
  move: string | { from: string; to: string; promotion?: string },
): Move | null {
  try {
    return chess.move(move);
  } catch {
    return null;
  }
}

export function opposite(c: Color): Color {
  return c === 'w' ? 'b' : 'w';
}

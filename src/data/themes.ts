/**
 * Puzzle curriculum. Each theme is trained for 3 days, in this order, then the
 * cycle repeats (with harder puzzles as your rating grows).
 */
export interface ThemeInfo {
  id: string;
  title: string;
  /** One-line explanation shown with every puzzle. */
  lesson: string;
  /** What to look for — shown as a hint before the first move. */
  tip: string;
}

export const THEMES: ThemeInfo[] = [
  {
    id: 'mateIn1',
    title: 'Mate in 1',
    lesson: 'Spot checkmate in one move. Every check should be considered.',
    tip: 'Look at every check — which one leaves the king no escape?',
  },
  {
    id: 'hangingPiece',
    title: 'Hanging pieces',
    lesson: 'Win material that is undefended or insufficiently defended.',
    tip: 'Count attackers and defenders of every enemy piece.',
  },
  {
    id: 'fork',
    title: 'Forks',
    lesson: 'One piece attacks two or more targets at once.',
    tip: 'Find a square where one of your pieces hits two valuable targets.',
  },
  {
    id: 'pin',
    title: 'Pins',
    lesson: 'A piece cannot move without exposing a more valuable piece behind it.',
    tip: 'Line up your bishop, rook or queen with an enemy piece and the king or queen behind it.',
  },
  {
    id: 'skewer',
    title: 'Skewers',
    lesson: 'Attack a valuable piece so that, when it moves, you win the piece behind it.',
    tip: 'A reverse pin: the bigger piece is in front.',
  },
  {
    id: 'discoveredAttack',
    title: 'Discovered attacks',
    lesson: 'Move one piece out of the way to unleash an attack by another.',
    tip: 'Which of your pieces is blocking a line of attack?',
  },
  {
    id: 'backRankMate',
    title: 'Back-rank mate',
    lesson: 'Checkmate a king trapped behind its own pawns on the back rank.',
    tip: 'Is the enemy king boxed in by its own pawns? Look for a rook or queen check on the back rank.',
  },
  {
    id: 'mateIn2',
    title: 'Mate in 2',
    lesson: 'Force checkmate in two moves — often with a sacrifice first.',
    tip: 'Checks, captures, threats — in that order.',
  },
  {
    id: 'doubleCheck',
    title: 'Double check',
    lesson: 'Check with two pieces at once: the king must move.',
    tip: 'A discovered check where the moving piece also gives check.',
  },
  {
    id: 'trappedPiece',
    title: 'Trapped pieces',
    lesson: 'Attack a piece that has no safe squares to escape to.',
    tip: 'Look for pieces with few retreats — bishops and knights on the rim.',
  },
  {
    id: 'attraction',
    title: 'Attraction',
    lesson: 'Sacrifice to lure an enemy piece (often the king) onto a bad square.',
    tip: 'Which square would you like their king or queen to stand on?',
  },
  {
    id: 'deflection',
    title: 'Deflection',
    lesson: 'Force a defender away from the piece or square it protects.',
    tip: 'Find the overloaded defender and give it a second job.',
  },
  {
    id: 'capturingDefender',
    title: 'Remove the defender',
    lesson: 'Capture the piece that defends a key square or piece.',
    tip: 'What holds their position together? Take it.',
  },
  {
    id: 'smotheredMate',
    title: 'Smothered mate',
    lesson: 'A knight mates a king that is surrounded by its own pieces.',
    tip: 'A king with no breathing room is helpless against a knight check.',
  },
  {
    id: 'promotion',
    title: 'Pawn promotion',
    lesson: 'Push and promote passed pawns — sometimes to a knight!',
    tip: 'Can a pawn reach the last rank? Clear its path.',
  },
  {
    id: 'attackingF2F7',
    title: 'Attacking f2/f7',
    lesson: 'The f-pawn next to the king is defended only by the king early on.',
    tip: 'Count the attackers on f7 (or f2) — can you break through?',
  },
  {
    id: 'sacrifice',
    title: 'Sacrifices',
    lesson: 'Give up material for a bigger gain: mate, material or a winning attack.',
    tip: 'What would happen if you gave up your most active piece?',
  },
  {
    id: 'intermezzo',
    title: 'In-between moves',
    lesson: 'Before the expected recapture, insert a stronger move (Zwischenzug).',
    tip: "Don't auto-recapture — is there a check or bigger threat first?",
  },
  {
    id: 'clearance',
    title: 'Clearance',
    lesson: 'Move a piece with tempo to free a square or line for another piece.',
    tip: 'Which of your own pieces is in the way?',
  },
  {
    id: 'interference',
    title: 'Interference',
    lesson: 'Place a piece between an enemy piece and what it defends.',
    tip: 'Cut the line between a defender and its target.',
  },
  {
    id: 'xRayAttack',
    title: 'X-ray attacks',
    lesson: 'A piece attacks or defends through another piece.',
    tip: 'Rooks and queens on the same line support each other through pieces.',
  },
  {
    id: 'quietMove',
    title: 'Quiet moves',
    lesson: 'The winning move is not a check or capture, but a deadly quiet threat.',
    tip: 'No checks work? Find the move that creates an unstoppable threat.',
  },
  {
    id: 'defensiveMove',
    title: 'Defensive moves',
    lesson: 'Find the only move that saves the position.',
    tip: 'What is your opponent threatening? Stop the biggest threat.',
  },
  {
    id: 'kingsideAttack',
    title: 'Kingside attack',
    lesson: 'Break open the enemy king with sacrifices and checks.',
    tip: 'Bring more attackers than they have defenders.',
  },
  {
    id: 'mateIn3',
    title: 'Mate in 3',
    lesson: 'Calculate a forced checkmate three moves deep.',
    tip: 'Visualise the final mating net, then work backwards.',
  },
  {
    id: 'matingPatterns',
    title: 'Mating patterns',
    lesson: "Anastasia's, Arabian, Boden's, hook and dovetail mates.",
    tip: 'Recognise the pattern: which squares around the king are covered?',
  },
  {
    id: 'zugzwang',
    title: 'Zugzwang',
    lesson: 'Put your opponent in a position where every move worsens it.',
    tip: 'Sometimes the best move is one that changes nothing — and passes the move.',
  },
  {
    id: 'pawnEndgame',
    title: 'Pawn endgames',
    lesson: 'Opposition, breakthroughs and outside passed pawns.',
    tip: 'Count the moves: who queens first?',
  },
  {
    id: 'rookEndgame',
    title: 'Rook endgames',
    lesson: 'The most common endgame — activity and checks decide.',
    tip: 'Rooks belong behind passed pawns. Activate your king.',
  },
  {
    id: 'minorPieceEndgame',
    title: 'Bishop & knight endgames',
    lesson: 'Minor-piece endgame technique and tactics.',
    tip: 'Knights love outposts; bishops love open diagonals.',
  },
  {
    id: 'queenEndgame',
    title: 'Queen endgames',
    lesson: 'Queen endings: perpetual checks, skewers and promotion races.',
    tip: 'Look for forks and skewers with checks.',
  },
  {
    id: 'openingTactics',
    title: 'Opening tactics',
    lesson: 'Punish early mistakes: traps, loose pieces and weak kings in the opening.',
    tip: 'Undeveloped or undefended pieces are targets.',
  },
];

export const THEME_BY_ID: Record<string, ThemeInfo> = Object.fromEntries(
  THEMES.map(t => [t.id, t]),
);

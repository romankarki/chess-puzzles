/**
 * Curated opening courses. One course = one week; each of its 7 days drills one
 * variation. `line` is the main line in SAN, from the starting position; the
 * build script (scripts/build-openings.js) checks every move for legality and
 * names positions using the lichess chess-openings database.
 *
 * color: the side YOU play.
 */
module.exports = [
  // ───────────────────────────── WHITE ─────────────────────────────
  {
    id: 'italian',
    name: 'Italian Game',
    color: 'w',
    level: 1,
    summary:
      'Develop fast, aim the bishop at f7 and fight for the centre with c3 and d4. The classic first opening to learn as White.',
    ideas: [
      'Bc4 targets the weak f7 square.',
      'c3 prepares d4 to build a big centre.',
      'Castle early, then expand with d4 or a slow d3 plan.',
    ],
    days: [
      {
        name: 'Giuoco Piano: c3 & d4',
        line: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2 d5 exd5 Nxd5 Qb3 Nce7 O-O O-O',
        note: 'The open main line: White gets a strong centre and pressure on d5.',
      },
      {
        name: 'Giuoco Pianissimo',
        line: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O Re1 a6 Bb3 Ba7 h3 h6 Nbd2',
        note: 'The modern slow plan: d3, Re1, h3, then Nbd2–f1–g3.',
      },
      {
        name: 'Two Knights: Fried Liver',
        line: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7 Kxf7 Qf3+ Ke6 Nc3',
        note: 'Punish 5...Nxd5? with the famous knight sacrifice on f7.',
      },
      {
        name: 'Two Knights: 5...Na5 main line',
        line: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2 h6 Nf3 e4 Ne5 Bd6',
        note: 'Black gives a pawn for activity; White keeps the extra pawn.',
      },
      {
        name: 'Two Knights: quiet 4.d3',
        line: 'e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Be7 O-O O-O Re1 d6 c3 Na5 Bb5 a6 Ba4 b5 Bc2 c5',
        note: 'Avoid tactics, keep the structure and manoeuvre like a Ruy Lopez.',
      },
      {
        name: 'Evans Gambit',
        line: 'e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O Nge7 cxd4 d5 exd5 Nxd5',
        note: 'Give the b-pawn to gain time for c3, d4 and a fast attack.',
      },
      {
        name: 'Scotch Gambit: Anderssen Attack',
        line: 'e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 O-O Nxe4 Re1 d5 Bxd5 Qxd5 Nc3 Qa5 Nxe4 Be6 Neg5 O-O-O Nxe6 fxe6 Rxe6',
        note: 'Open the e-file against the black king and win back material with interest.',
      },
    ],
  },
  {
    id: 'ruy-lopez',
    name: 'Ruy Lopez',
    color: 'w',
    level: 2,
    summary:
      'The Spanish Opening: pressure the knight that defends e5 and build a slow, powerful centre. A lifetime opening used at every level.',
    ideas: [
      'Bb5 pressures the defender of e5.',
      'c3 and d4 build the ideal centre; h3 stops ...Bg4.',
      'The Nbd2–f1–g3 manoeuvre brings a knight to the kingside.',
    ],
    days: [
      {
        name: 'Closed: Chigorin',
        line: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 c5 d4 Qc7',
        note: 'The classical main line: White keeps the centre, Black gains space on the queenside.',
      },
      {
        name: 'Closed: Breyer',
        line: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nb8 d4 Nbd7 Nbd2 Bb7 Bc2 Re8',
        note: 'Black reroutes the knight via b8–d7 to support e5.',
      },
      {
        name: 'Berlin Defense',
        line: 'e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8 Nc3',
        note: 'The Berlin endgame: Black has the bishops, White has the kingside majority.',
      },
      {
        name: 'Marshall Attack',
        line: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5 exd5 Nxd5 Nxe5 Nxe5 Rxe5 c6 d4 Bd6 Re1 Qh4 g3 Qh3',
        note: "Black's famous pawn sacrifice for a kingside attack — know the main moves.",
      },
      {
        name: 'Exchange Variation',
        line: 'e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6 d4 exd4 Nxd4 c5 Nb3 Qxd1 Rxd1',
        note: 'Trade bishop for knight to damage the structure; White plays for the endgame.',
      },
      {
        name: 'Open Ruy Lopez',
        line: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Bc5 Nbd2 O-O Bc2',
        note: 'Black grabs e4; White attacks the knight and the light squares.',
      },
      {
        name: 'Schliemann: 4.d3',
        line: 'e4 e5 Nf3 Nc6 Bb5 f5 d3 fxe4 dxe4 Nf6 O-O d6 Nc3 Be7',
        note: 'Meet the sharp ...f5 calmly; the weak e6 and loose king favour White.',
      },
    ],
  },
  {
    id: 'scotch',
    name: 'Scotch Game',
    color: 'w',
    level: 1,
    summary:
      'Open the centre at once with 3.d4. Clear plans, quick development and open lines for your pieces.',
    ideas: [
      '3.d4 trades the e5 pawn and gives White space.',
      'The d4 knight is the key piece — watch for ...Bc5 and ...Qh4 attacks on it.',
      'After Nxc6 bxc6 and e5, Black\'s structure is compromised.',
    ],
    days: [
      {
        name: 'Classical: 5.Nxc6',
        line: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Nxc6 Qf6 Qd2 dxc6 Nc3 Be6 Na4 Rd8 Bd3 Bd4 O-O',
        note: 'Win time on the bishop and aim for a better structure.',
      },
      {
        name: 'Classical: 5.Be3',
        line: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Bc4 Ne5 Be2 Qg6 O-O d6 f3 O-O',
        note: 'Defend d4 with c3 and keep all pieces on.',
      },
      {
        name: 'Mieses: 4...Nf6',
        line: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 e5 Qe7 Qe2 Nd5 c4 Ba6 b3 g6 f4',
        note: 'Gain space with e5 and c4; the black knight is pushed around.',
      },
      {
        name: 'Steinitz: 4...Qh4',
        line: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nc3 Bb4 Be2 Qxe4 Nb5 Bxc3+ bxc3 Kd8 O-O',
        note: 'Give the e-pawn and hunt the uncastled black king.',
      },
      {
        name: 'Scotch Gambit',
        line: 'e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 e5 d5 Bb5 Ne4 Nxd4 Bd7 Bxc6 bxc6 O-O Bc5',
        note: 'Delay recapturing d4 to develop with tempo.',
      },
      {
        name: 'Göring Gambit Declined',
        line: 'e4 e5 Nf3 Nc6 d4 exd4 c3 d5 exd5 Qxd5 cxd4 Bg4 Be2 Bb4+ Nc3 Bxf3 Bxf3 Qc4',
        note: 'Black returns the pawn; White gets an isolated but active centre.',
      },
      {
        name: 'Scotch Four Knights',
        line: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nc3 Bb4 Nxc6 bxc6 Bd3 d5 exd5 cxd5 O-O O-O Bg5 c6',
        note: 'Pin play and an IQP structure — typical middlegame plans.',
      },
    ],
  },
  {
    id: 'queens-gambit',
    name: "Queen's Gambit",
    color: 'w',
    level: 1,
    summary:
      "Offer the c-pawn to deflect Black's d-pawn and take the centre. White's most respected 1.d4 system.",
    ideas: [
      'c4 attacks d5; if Black takes, e4 often follows.',
      'Bg5 pins the f6 knight that guards d5.',
      'The minority attack (b4–b5) works against the QGD structure.',
    ],
    days: [
      {
        name: 'QGD: Orthodox',
        line: 'd4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Rc1 c6 Bd3 dxc4 Bxc4 Nd5',
        note: 'Classical development; Black frees the position with ...Nd5.',
      },
      {
        name: 'QGD: Exchange',
        line: 'd4 d5 c4 e6 Nc3 Nf6 cxd5 exd5 Bg5 c6 Qc2 Be7 e3 Nbd7 Bd3 O-O Nge2 Re8 O-O',
        note: 'Fix the structure, then choose a minority attack or a central e4 break.',
      },
      {
        name: "Queen's Gambit Accepted",
        line: 'd4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 dxc5 Qxd1 Rxd1 Bxc5',
        note: 'Win back the pawn and keep a small development lead.',
      },
      {
        name: 'Slav: Main Line',
        line: 'd4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 e3 e6 Bxc4 Bb4 O-O O-O Qe2',
        note: 'a4 stops ...b5; regain c4 and prepare e4.',
      },
      {
        name: 'Albin Countergambit',
        line: 'd4 d5 c4 e5 dxe5 d4 Nf3 Nc6 g3 Be6 Nbd2 Qd7 Bg2 O-O-O O-O',
        note: 'Fianchetto, castle, and return the pawn at the right moment.',
      },
      {
        name: 'Chigorin Defense',
        line: 'd4 d5 c4 Nc6 Nf3 Bg4 cxd5 Bxf3 gxf3 Qxd5 e3 e5 Nc3 Bb4 Bd2 Bxc3 bxc3',
        note: 'Take the bishop pair and a strong centre.',
      },
      {
        name: 'Tarrasch Defense',
        line: 'd4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O Bg5 cxd4 Nxd4 h6 Be3 Re8',
        note: 'The fianchetto against the isolated d5 pawn.',
      },
    ],
  },
  {
    id: 'london',
    name: 'London System',
    color: 'w',
    level: 1,
    summary:
      'A solid, easy-to-learn system: Bf4, e3, c3, Nf3, Bd3 and Nbd2 against almost anything.',
    ideas: [
      'Get the bishop out to f4 before playing e3.',
      'The pyramid d4–e3–c3 is hard to break.',
      'Ne5 and a kingside attack are typical plans.',
    ],
    days: [
      {
        name: 'Main line vs ...d5 & ...e6',
        line: 'd4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3 Nc6 Nbd2 Bd6 Bg3 O-O Bd3',
        note: 'Meet ...Bd6 with Bg3 to keep the bishop.',
      },
      {
        name: "vs King's Indian setup",
        line: 'd4 Nf6 Bf4 g6 e3 Bg7 Nf3 O-O Be2 d6 h3 c5 c3 b6 O-O',
        note: 'h3 gives the bishop a retreat square on h2.',
      },
      {
        name: 'vs early ...c5 & ...Qb6',
        line: 'd4 d5 Bf4 c5 e3 Nc6 c3 Qb6 Qb3 c4 Qc2 Bf5 Qc1 e6 Nd2',
        note: 'Defend b2 with the queen and keep the structure intact.',
      },
      {
        name: 'vs ...Bf5: the c4 plan',
        line: 'd4 d5 Bf4 Nf6 e3 Bf5 c4 e6 Nc3 Bb4 Qb3 Nc6',
        note: "When Black copies with ...Bf5, c4 and Qb3 hit b7.",
      },
      {
        name: "vs Queen's Indian setup",
        line: 'd4 Nf6 Bf4 e6 e3 b6 Nf3 Bb7 h3 c5 c3 Be7 Nbd2 O-O Bd3',
        note: 'Same setup, and keep an eye on the long diagonal.',
      },
      {
        name: 'vs Dutch Defense',
        line: 'd4 f5 Bf4 Nf6 e3 e6 Nf3 b6 Bd3 Bb7 Nbd2 Be7 h3 O-O O-O',
        note: 'The light-squared bishop aims at the weakened kingside.',
      },
      {
        name: 'vs Grünfeld setup',
        line: 'd4 Nf6 Bf4 g6 e3 Bg7 Nf3 d5 c4 O-O Nc3 c5 dxc5 Qa5 Rc1 dxc4 Bxc4 Qxc5 Bb3 Nc6 O-O',
        note: "Against ...d5 & ...c5, c4 takes the fight to Black's centre.",
      },
    ],
  },
  {
    id: 'english',
    name: 'English Opening',
    color: 'w',
    level: 2,
    summary:
      'Start with 1.c4 for flexible, positional play: control d5, fianchetto the bishop, and decide on the centre later.',
    ideas: [
      'g3 and Bg2 aim the bishop down the long diagonal.',
      'Control d5 with c4 and Nc3.',
      'Queenside expansion with a3, Rb1 and b4.',
    ],
    days: [
      {
        name: 'Reversed Sicilian',
        line: 'c4 e5 Nc3 Nf6 Nf3 Nc6 g3 d5 cxd5 Nxd5 Bg2 Nb6 O-O Be7 d3 O-O a3',
        note: 'A Sicilian Dragon with an extra tempo for White.',
      },
      {
        name: 'Symmetrical',
        line: 'c4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 Nf3 e6 O-O Nge7 d3 O-O Bd2',
        note: 'Slow manoeuvring; aim for a3, Rb1 and b4.',
      },
      {
        name: 'Agincourt: Réti setup',
        line: 'c4 e6 Nf3 d5 g3 Nf6 Bg2 Be7 O-O O-O b3 c5 Bb2 Nc6 e3',
        note: 'Double fianchetto pressure on the long diagonals.',
      },
      {
        name: 'Anglo-Indian: Botvinnik',
        line: 'c4 Nf6 Nc3 g6 g3 Bg7 Bg2 O-O e4 d6 Nge2 e5 O-O c6 d3',
        note: 'Pawns on c4 and e4 clamp d5.',
      },
      {
        name: 'vs Slav setup',
        line: 'c4 c6 Nf3 d5 e3 Nf6 Nc3 e6 b3 Nbd7 Bb2 Bd6 Qc2 O-O Be2',
        note: 'Keep the tension and fianchetto the dark-squared bishop.',
      },
      {
        name: 'Four Knights English',
        line: 'c4 e5 Nc3 Nf6 Nf3 Nc6 g3 Bb4 Bg2 O-O O-O e4 Ng5 Bxc3 bxc3 Re8 f3',
        note: "Undermine Black's e4 pawn with f3.",
      },
      {
        name: 'vs Dutch',
        line: 'c4 f5 Nf3 Nf6 g3 g6 Bg2 Bg7 O-O O-O Nc3 d6 d4',
        note: 'Transpose to a favourable Leningrad Dutch structure.',
      },
    ],
  },
  {
    id: 'vienna',
    name: 'Vienna Game',
    color: 'w',
    level: 1,
    summary:
      'Nc3 first, then f4 or Bc4. A sharp, fun alternative to 2.Nf3 that sets many traps.',
    ideas: [
      'Nc3 supports f4 without allowing ...Nxe4 tricks.',
      'The Vienna Gambit opens the f-file for an attack.',
      'Bc4 aims at f7, as in many open games.',
    ],
    days: [
      {
        name: 'Vienna Gambit: 3...d5',
        line: 'e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Nf3 Be7 d4 O-O Bd3 f5 exf6 Bxf6 O-O',
        note: 'Gain space with e5, then open lines toward the black king.',
      },
      {
        name: 'Vienna Gambit vs 3...d6',
        line: 'e4 e5 Nc3 Nf6 f4 d6 Nf3 Nc6 Bb5 Bd7 d3 exf4 Bxf4',
        note: 'Black is passive; develop quickly and regain the pawn.',
      },
      {
        name: 'Frankenstein-Dracula',
        line: 'e4 e5 Nc3 Nf6 Bc4 Nxe4 Qh5 Nd6 Bb3 Nc6 Nb5 g6 Qf3 f5 Qd5 Qe7 Nxc7+ Kd8 Nxa8 b6',
        note: 'Wild complications: White wins the rook; Black gets play.',
      },
      {
        name: 'Bc4 with f4',
        line: 'e4 e5 Nc3 Nf6 Bc4 Bc5 d3 d6 f4 Nc6 Nf3 Bg4 Na4',
        note: 'Trade off the dangerous c5 bishop with Na4.',
      },
      {
        name: 'Mieses Variation',
        line: 'e4 e5 Nc3 Nf6 g3 d5 exd5 Nxd5 Bg2 Nxc3 bxc3 Bd6 Nf3 O-O O-O',
        note: 'A positional fianchetto setup.',
      },
      {
        name: 'Paulsen Variation',
        line: 'e4 e5 Nc3 Nc6 g3 Bc5 Bg2 d6 Nge2 Nf6 d3 O-O O-O',
        note: 'Calm development, then f4 later.',
      },
      {
        name: 'vs 2...Bc5',
        line: 'e4 e5 Nc3 Bc5 Nf3 d6 d4 exd4 Nxd4 Nf6 Be2 O-O O-O Re8',
        note: 'Open the centre while Black is uncoordinated.',
      },
    ],
  },
  {
    id: 'catalan',
    name: 'Catalan Opening',
    color: 'w',
    level: 3,
    summary:
      'Queen\'s Gambit plus a g2 fianchetto. Long-term pressure on the long diagonal and the queenside.',
    ideas: [
      'The g2 bishop is the soul of the Catalan.',
      'If Black takes on c4, White often regains it with Qc2/Qa4.',
      'Pressure on b7 and the c-file.',
    ],
    days: [
      {
        name: 'Open Catalan: 5...Be7',
        line: 'd4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Nf3 Be7 O-O O-O Qc2 a6 Qxc4 b5 Qc2 Bb7 Bd2 Be4 Qc1',
        note: 'Regain the pawn and keep the long diagonal under control.',
      },
      {
        name: 'Closed Catalan',
        line: 'd4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O Nbd7 Qc2 c6 Nbd2 b6 e4 Bb7 b3',
        note: 'Prepare e4 to open the centre.',
      },
      {
        name: '4...Bb4+',
        line: 'd4 Nf6 c4 e6 g3 d5 Bg2 Bb4+ Bd2 Be7 Nf3 O-O O-O c6 Qc2 b6',
        note: 'The check lures the bishop to d2; then normal development.',
      },
      {
        name: 'Open Catalan: 5.Qa4+',
        line: 'd4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Qa4+ Nbd7 Qxc4 a6 Qc2 c5 Nf3 b6',
        note: 'Regain the pawn immediately with the queen check.',
      },
      {
        name: 'Tarrasch-style 4...c5',
        line: 'd4 Nf6 c4 e6 g3 d5 Bg2 c5 Nf3 Nc6 O-O Be7 cxd5 Nxd5 Nc3 O-O',
        note: 'The g2 bishop bears down on the d5 knight and c6.',
      },
      {
        name: 'Open Catalan: 5...c5',
        line: 'd4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Nf3 c5 O-O Nc6 Qa4 cxd4 Nxd4 Qxd4 Bxc6+ Bd7 Rd1 Qxd1+ Qxd1 Bxc6',
        note: 'A forcing line that leads to a balanced position.',
      },
      {
        name: 'vs Benoni-style 3...c5',
        line: 'd4 Nf6 c4 e6 g3 c5 d5 exd5 cxd5 d6 Nc3 g6 Bg2 Bg7 Nf3 O-O O-O',
        note: 'A fianchetto against the Benoni structure.',
      },
    ],
  },
  {
    id: 'reti-kia',
    name: "Réti & King's Indian Attack",
    color: 'w',
    level: 2,
    summary:
      "Hypermodern play: Nf3, g3, Bg2 and strike at the centre with c4 or e4–e5. Easy to learn and flexible.",
    ideas: [
      'Control the centre with pieces, not pawns.',
      'In the KIA, e5 and a kingside attack are typical.',
      'c4 challenges d5 in the Réti.',
    ],
    days: [
      {
        name: 'Réti vs ...d5 & ...e6',
        line: 'Nf3 d5 c4 e6 g3 Nf6 Bg2 Be7 O-O O-O b3 c5 Bb2 Nc6 e3',
        note: 'Double fianchetto and quiet pressure.',
      },
      {
        name: 'Réti Accepted',
        line: 'Nf3 d5 c4 dxc4 e3 Nf6 Bxc4 e6 O-O c5 b3 Nc6 Bb2 a6',
        note: 'Regain the pawn and fianchetto the bishop.',
      },
      {
        name: 'Réti Advance: 2...d4',
        line: 'Nf3 d5 c4 d4 e3 Nc6 exd4 Nxd4 Nxd4 Qxd4 Nc3',
        note: 'Undermine the d4 pawn right away.',
      },
      {
        name: 'KIA vs French',
        line: 'e4 e6 d3 d5 Nd2 Nf6 Ngf3 c5 g3 Nc6 Bg2 Be7 O-O O-O Re1 b5 e5 Nd7',
        note: 'Push e5 and prepare a kingside attack while Black attacks the queenside.',
      },
      {
        name: 'KIA vs Sicilian',
        line: 'e4 c5 Nf3 e6 d3 Nc6 g3 d5 Nbd2 Nf6 Bg2 Be7 O-O O-O Re1',
        note: 'The KIA setup works against ...e6 Sicilians.',
      },
      {
        name: 'KIA vs Caro-Kann',
        line: 'e4 c6 d3 d5 Nd2 e5 Ngf3 Bd6 g3 Nf6 Bg2 O-O O-O Re8',
        note: 'Avoid main-line theory and play a solid setup.',
      },
      {
        name: "Réti vs King's Indian",
        line: 'Nf3 Nf6 c4 g6 g3 Bg7 Bg2 O-O O-O d6 Nc3 e5 d3',
        note: 'A flexible fianchetto setup against ...g6.',
      },
    ],
  },
  {
    id: 'open-sicilian-white',
    name: 'Open Sicilian (as White)',
    color: 'w',
    level: 3,
    summary:
      'Meet 1...c5 with 2.Nf3 and 3.d4: open lines, a lead in development and sharp attacks, often with opposite-side castling.',
    ideas: [
      'Trade the d-pawn for the c-pawn to open lines.',
      'Be3, f3, Qd2 and O-O-O, then storm with g4–g5.',
      'Watch for Black\'s ...b5–b4 and ...Rxc3 counterplay.',
    ],
    days: [
      {
        name: 'vs Najdorf: English Attack',
        line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be6 f3 Be7 Qd2 O-O O-O-O Nbd7 g4 b5',
        note: 'Castle long and race with g4–g5.',
      },
      {
        name: 'vs Dragon: Yugoslav Attack',
        line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7 O-O-O Rc8 Bb3 Ne5',
        note: 'Bh6 and h4–h5 to trade the Dragon bishop and open the h-file.',
      },
      {
        name: 'vs Scheveningen: Keres Attack',
        line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 e6 g4 h6 h4 Nc6 Rg1 h5 gxh5 Nxh5 Bg5 Nf6',
        note: 'g4 at once kicks the f6 knight.',
      },
      {
        name: 'vs Taimanov',
        line: 'e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Qc7 Be3 a6 Qd2 Nf6 O-O-O Bb4 f3 Ne5 Nb3 b5',
        note: 'The English Attack setup works here too.',
      },
      {
        name: 'vs Kan',
        line: 'e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Bd3 Nf6 O-O Qc7 Qe2 d6 c4 g6 Nc3 Bg7',
        note: 'The Maroczy bind with c4 restricts Black.',
      },
      {
        name: 'vs Classical: Richter-Rauzer',
        line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Qd2 a6 O-O-O Bd7 f4 b5',
        note: 'Bg5, Qd2 and long castling, then pressure on d6.',
      },
      {
        name: 'vs Sveshnikov',
        line: 'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5 Nd5 Be7 Bxf6 Bxf6 c3 O-O Nc2',
        note: 'Fight for the d5 outpost; the a3 knight returns via c2.',
      },
    ],
  },
  {
    id: 'kings-gambit',
    name: "King's Gambit",
    color: 'w',
    level: 2,
    summary:
      'The romantic 2.f4: give a pawn to open the f-file and build a big centre. Great for learning attacking chess.',
    ideas: [
      'f4 deflects the e5 pawn and opens the f-file.',
      'd4 and Bxf4 regain the pawn with a big centre.',
      'Don\'t forget your own king on the a7–g1 diagonal.',
    ],
    days: [
      {
        name: 'Kieseritzky Gambit',
        line: 'e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Nf6 Bc4 d5 exd5 Bd6 d4 Nh5',
        note: 'Undermine the g-pawn chain with h4.',
      },
      {
        name: 'Fischer Defense',
        line: 'e4 e5 f4 exf4 Nf3 d6 d4 g5 h4 g4 Ng1',
        note: 'The knight retreats; White regains f4 later.',
      },
      {
        name: 'Modern Defense',
        line: 'e4 e5 f4 exf4 Nf3 d5 exd5 Nf6 Bb5+ c6 dxc6 bxc6 Bc4 Nd5',
        note: 'Black returns the pawn for quick development.',
      },
      {
        name: "Bishop's Gambit",
        line: 'e4 e5 f4 exf4 Bc4 Nf6 Nc3 c6 Bb3 d5 exd5 cxd5 d4 Bd6',
        note: 'Bc4 first; White aims at f7.',
      },
      {
        name: 'Falkbeer Countergambit',
        line: 'e4 e5 f4 d5 exd5 exf4 Nf3 Nf6 Bc4 Nxd5 O-O Be7',
        note: 'Black counterattacks in the centre.',
      },
      {
        name: "King's Gambit Declined: Classical",
        line: 'e4 e5 f4 Bc5 Nf3 d6 Nc3 Nf6 Bc4 Nc6 d3 Bg4 Na4',
        note: 'Trade the annoying c5 bishop, then castle.',
      },
      {
        name: 'Cunningham Defense',
        line: 'e4 e5 f4 exf4 Nf3 Be7 Bc4 Nf6 e5 Ng4 O-O d6 exd6 Qxd6',
        note: 'Avoid ...Bh4+ ideas and develop with tempo.',
      },
    ],
  },

  // ───────────────────────────── BLACK ─────────────────────────────
  {
    id: 'najdorf',
    name: 'Sicilian Najdorf',
    color: 'b',
    level: 3,
    summary:
      "Fischer's and Kasparov's weapon: 5...a6 keeps every option open — ...e5, ...e6 or ...b5 — and fights for a win.",
    ideas: [
      '...a6 controls b5 and prepares ...b5.',
      '...e5 grabs space but leaves a hole on d5.',
      'Counterattack on the c-file and with ...b5–b4.',
    ],
    days: [
      {
        name: '6.Be3: English Attack',
        line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be6 f3 Be7 Qd2 O-O O-O-O Nbd7 g4 b5',
        note: 'Race on opposite wings: your ...b5–b4 against g4–g5.',
      },
      {
        name: '6.Bg5: Main Line',
        line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 Be7 Qf3 Qc7 O-O-O Nbd7 g4 b5',
        note: 'Solid ...e6 and ...Be7, then fast queenside play.',
      },
      {
        name: '6.Be2: Classical',
        line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be2 e5 Nb3 Be7 O-O O-O Be3 Be6 Qd2 Nbd7 a4',
        note: 'Grab space with ...e5 and develop harmoniously.',
      },
      {
        name: '6.Bc4: Fischer-Sozin',
        line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bc4 e6 Bb3 b5 O-O Be7 Qf3 Qc7 Qg3 O-O',
        note: 'Blunt the Bc4 with ...e6 and expand with ...b5.',
      },
      {
        name: '6.h3: Adams Attack',
        line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 h3 e5 Nde2 h5 g3 Be6 Bg2 Nbd7 a4 Be7',
        note: '...h5 stops g4 cold.',
      },
      {
        name: '6.f4',
        line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 f4 e5 Nf3 Nbd7 a4 Be7 Bd3 O-O O-O exf4',
        note: 'Hit the f4 pawn with ...e5 and take e5 for your knight.',
      },
      {
        name: 'vs Alapin: 2...Nf6',
        line: 'e4 c5 c3 Nf6 e5 Nd5 d4 cxd4 Nf3 Nc6 cxd4 d6 Bc4 Nb6 Bb5 dxe5 Nxe5 Bd7',
        note: "Every Sicilian player needs an answer to 2.c3 — this is the main one.",
      },
    ],
  },
  {
    id: 'dragon',
    name: 'Sicilian Dragon',
    color: 'b',
    level: 3,
    summary:
      'Fianchetto the bishop on the long diagonal and counterattack on the queenside. Sharp, forcing and tactical.',
    ideas: [
      'The g7 bishop is your best piece — never trade it lightly.',
      '...Rc8, ...Ne5–c4 and the ...Rxc3 exchange sacrifice.',
      '...d5 in one move frees your position.',
    ],
    days: [
      {
        name: 'Yugoslav: 9.Bc4',
        line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7 O-O-O Rc8 Bb3 Ne5',
        note: 'Ne5–c4 and play along the c-file.',
      },
      {
        name: 'Yugoslav: 9.O-O-O d5',
        line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 O-O-O d5 exd5 Nxd5 Nxc6 bxc6 Bd4',
        note: 'Strike in the centre before White attacks.',
      },
      {
        name: 'Yugoslav: 9.g4',
        line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 g4 Be6 O-O-O Nxd4 Bxd4 Qa5 a3 Rfc8 h4',
        note: 'Trade on d4 and bring the queen and rooks into the attack.',
      },
      {
        name: 'Classical: 6.Be2',
        line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be2 Bg7 O-O O-O Be3 Nc6 Nb3 Be6 f4',
        note: 'Calm development; Black is comfortable.',
      },
      {
        name: 'Fianchetto: 6.g3',
        line: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 g3 Nc6 Nde2 Bg7 Bg2 O-O O-O Rb8',
        note: 'Prepare ...b5 against the quiet setup.',
      },
      {
        name: 'Accelerated Dragon: Maroczy Bind',
        line: 'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4 Nf6 Nc3 d6 Be2 Nxd4 Qxd4 Bg7 Be3 O-O Qd2 Be6',
        note: 'Trade knights and play ...Be6, ...Qa5 and ...a6–b5.',
      },
      {
        name: 'Accelerated Dragon: 5.Nc3',
        line: 'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nc3 Bg7 Be3 Nf6 Bc4 O-O Bb3 d6 f3 Bd7 Qd2 Nxd4 Bxd4 b5',
        note: 'The Accelerated Dragon can play ...d5 or ...b5 in one move.',
      },
    ],
  },
  {
    id: 'sveshnikov',
    name: 'Sicilian Sveshnikov',
    color: 'b',
    level: 3,
    summary:
      "Take space with ...e5, accept a backward d-pawn and a hole on d5, and get dynamic play with the bishop pair and ...f5.",
    ideas: [
      '...e5 kicks the d4 knight with tempo.',
      'The d5 square is the battle — counter with ...f5.',
      'After Bxf6 gxf6, the f-pawns become an attacking force.',
    ],
    days: [
      {
        name: 'Main line: 9.Bxf6 gxf6 10.Nd5 f5',
        line: 'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5 Bxf6 gxf6 Nd5 f5 Bd3 Be6',
        note: 'Strike back with ...f5 immediately.',
      },
      {
        name: 'Novosibirsk: 10...Bg7',
        line: 'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5 Bxf6 gxf6 Nd5 Bg7 Bd3 Ne7 Nxe7 Qxe7',
        note: 'Trade the d5 knight off to remove the strong piece.',
      },
      {
        name: '9.Nd5 Be7',
        line: 'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5 Nd5 Be7 Bxf6 Bxf6 c3 O-O Nc2 Bg5',
        note: 'The "good" dark-squared bishop goes to g5.',
      },
      {
        name: '7.Nd5',
        line: 'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Nd5 Nxd5 exd5 Nb8 c4 a6 Nc3 Be7',
        note: 'Re-route the knight and play ...f5 later.',
      },
      {
        name: 'Kalashnikov',
        line: 'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 e5 Nb5 d6 N1c3 a6 Na3 b5 Nd5 Nge7',
        note: 'The Sveshnikov idea without ...Nf6.',
      },
      {
        name: 'vs Rossolimo: 3.Bb5',
        line: 'e4 c5 Nf3 Nc6 Bb5 g6 O-O Bg7 Re1 e5 Bxc6 dxc6 d3 Qe7',
        note: 'Fianchetto and play ...e5; the bishop pair compensates for doubled pawns.',
      },
      {
        name: 'vs 3.Nc3: Anti-Sveshnikov',
        line: 'e4 c5 Nf3 Nc6 Nc3 e5 Bc4 Be7 d3 d6 Nd2 Bg5',
        note: 'Trade the bad bishop and fight for d4.',
      },
    ],
  },
  {
    id: 'anti-sicilians',
    name: 'Anti-Sicilians (as Black)',
    color: 'b',
    level: 2,
    summary:
      'Half your Sicilian games never reach the Open Sicilian. Learn solid answers to the Alapin, Smith-Morra, Grand Prix, Closed, Moscow and more.',
    ideas: [
      'Against early f4, fianchetto and hit the centre.',
      'Against gambits, return material at the right time.',
      'Know one setup against each system.',
    ],
    days: [
      {
        name: 'Alapin: 2...d5',
        line: 'e4 c5 c3 d5 exd5 Qxd5 d4 Nf6 Nf3 Bg4 Be2 e6 O-O Nc6',
        note: 'Hit the centre at once and develop the light-squared bishop.',
      },
      {
        name: 'Smith-Morra Gambit Accepted',
        line: 'e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 d6 Bc4 e6 O-O Nf6 Qe2 Be7 Rd1 e5',
        note: 'Take the pawn, develop carefully and block with ...e5.',
      },
      {
        name: 'Grand Prix Attack',
        line: 'e4 c5 Nc3 Nc6 f4 g6 Nf3 Bg7 Bc4 e6 f5 Nge7',
        note: '...e6 blunts the Bc4; meet f5 calmly.',
      },
      {
        name: 'Closed Sicilian',
        line: 'e4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6 Be3 e5 Qd2 Nge7',
        note: 'Mirror the fianchetto and grab space on the queenside.',
      },
      {
        name: 'Moscow: 3.Bb5+',
        line: 'e4 c5 Nf3 d6 Bb5+ Bd7 Bxd7+ Qxd7 c4 Nc6 Nc3 g6 d4 cxd4 Nxd4 Bg7',
        note: 'Trade bishops and fianchetto.',
      },
      {
        name: 'Wing Gambit',
        line: 'e4 c5 b4 cxb4 a3 d5 exd5 Qxd5 Nf3 e5 axb4 Bxb4',
        note: 'Take the pawn and strike in the centre.',
      },
      {
        name: 'Alapin: 2...Nf6 deeper',
        line: 'e4 c5 c3 Nf6 e5 Nd5 d4 cxd4 Nf3 Nc6 Bc4 Nb6 Bb3 d5 exd6 Qxd6',
        note: 'Open the centre to free your pieces.',
      },
    ],
  },
  {
    id: 'french',
    name: 'French Defense',
    color: 'b',
    level: 2,
    summary:
      'Solid and strategic: ...e6 and ...d5 build a firm centre, then counter with ...c5 and ...f6.',
    ideas: [
      'Attack the base of White\'s pawn chain with ...c5.',
      'The light-squared bishop is "bad" — trade it or free it.',
      '...f6 hits the head of the e5 pawn.',
    ],
    days: [
      {
        name: 'Advance Variation',
        line: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 c4 Nbd2 Na5',
        note: 'Pressure d4 and b2, then lock the queenside with ...c4.',
      },
      {
        name: 'Winawer: Poisoned Pawn',
        line: 'e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7 Qxg7 Rg8 Qxh7 cxd4 Ne2 Nbc6 f4',
        note: 'Give the kingside pawns for a strong centre attack.',
      },
      {
        name: 'Tarrasch: 3...Nf6',
        line: 'e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ne2 cxd4 cxd4 f6 exf6 Nxf6',
        note: 'Undermine the chain with ...c5 and ...f6.',
      },
      {
        name: 'Classical: Steinitz',
        line: 'e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3 Nc6 Be3 cxd4 Nxd4 Bc5 Qd2 O-O',
        note: 'Trade on d4 and develop with ...Bc5.',
      },
      {
        name: 'Classical: 4.Bg5',
        line: 'e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 f4 O-O Nf3 c5',
        note: 'Castle, then ...c5 and ...Nc6.',
      },
      {
        name: 'Exchange Variation',
        line: 'e4 e6 d4 d5 exd5 exd5 Nf3 Nf6 Bd3 Bd6 O-O O-O Bg5 Bg4',
        note: 'A symmetrical position; develop actively.',
      },
      {
        name: 'Rubinstein',
        line: 'e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+ Nxf6 Bd3 c5',
        note: 'Give up the centre for easy development and ...c5.',
      },
    ],
  },
  {
    id: 'caro-kann',
    name: 'Caro-Kann Defense',
    color: 'b',
    level: 1,
    summary:
      'Rock-solid: ...c6 and ...d5, developing the light-squared bishop before ...e6. A great choice to learn first against 1.e4.',
    ideas: [
      'Get the bishop out to f5 or g4 before ...e6.',
      '...c5 is the key break in the Advance.',
      'Good endgames thanks to a healthy pawn structure.',
    ],
    days: [
      {
        name: 'Advance: Short System',
        line: 'e4 c6 d4 d5 e5 Bf5 Nf3 e6 Be2 c5 Be3 Nd7 O-O Ne7',
        note: 'Bf5 outside the chain, then ...c5 to hit d4.',
      },
      {
        name: 'Advance: Bayonet 4.Nc3 & g4',
        line: 'e4 c6 d4 d5 e5 Bf5 Nc3 e6 g4 Bg6 Nge2 c5 h4 h5 Nf4 Bh7 Nxh5',
        note: 'A sharp line — know how to handle White\'s pawn storm.',
      },
      {
        name: 'Classical: 4...Bf5',
        line: 'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3 e6 Bd2 Ngf6 O-O-O Be7',
        note: 'The classical main line with the h-pawn push.',
      },
      {
        name: 'Karpov: 4...Nd7',
        line: 'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+ Nxf6 c3 Bg4 Be2 e6 O-O Bd6',
        note: 'Prepare ...Ngf6 so you can recapture with a knight.',
      },
      {
        name: 'Exchange Variation',
        line: 'e4 c6 d4 d5 exd5 cxd5 Bd3 Nc6 c3 Nf6 Bf4 Bg4 Qb3 Qd7 Nd2 e6 Ngf3 Bd6',
        note: 'Pin with ...Bg4 and complete development.',
      },
      {
        name: 'Panov-Botvinnik Attack',
        line: 'e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 e6 Nf3 Be7 cxd5 Nxd5 Bd3 Nc6 O-O O-O Re1',
        note: 'Play against the isolated d4 pawn.',
      },
      {
        name: 'Two Knights',
        line: 'e4 c6 Nc3 d5 Nf3 Bg4 h3 Bxf3 Qxf3 e6 d3 Nf6 Bd2 Nbd7 g4 Bb4',
        note: 'Trade the bishop for the knight and play solidly.',
      },
    ],
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian Defense',
    color: 'b',
    level: 1,
    summary:
      'Hit e4 at once with 1...d5. Simple plans and fast development; it forces White into your preparation.',
    ideas: [
      'After ...Qxd5 and Nc3, choose a safe queen square (a5, d6 or d8).',
      'Develop the light bishop to f5 or g4 before ...e6.',
      '...c6 gives the queen a retreat and solidifies the position.',
    ],
    days: [
      {
        name: 'Main Line: 3...Qa5',
        line: 'e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Nf3 Bf5 Bd2 c6 Bc4 e6 Nd5 Qd8 Nxf6+ gxf6',
        note: 'Solid ...c6/...e6 with an active bishop on f5.',
      },
      {
        name: 'Modern: 3...Qd6',
        line: 'e4 d5 exd5 Qxd5 Nc3 Qd6 d4 Nf6 Nf3 a6 g3 Bg4 Bg2 Nc6',
        note: '...a6 stops Nb5 tricks; the queen is safe on d6.',
      },
      {
        name: 'Retreat: 3...Qd8',
        line: 'e4 d5 exd5 Qxd5 Nc3 Qd8 d4 Nf6 Nf3 Bg4 h3 Bh5 g4 Bg6 Ne5 e6',
        note: 'The safest square: no more tempi lost.',
      },
      {
        name: 'Modern: 2...Nf6',
        line: 'e4 d5 exd5 Nf6 d4 Nxd5 Nf3 g6 Be2 Bg7 O-O O-O c4 Nb6',
        note: 'Recapture with the knight and fianchetto.',
      },
      {
        name: 'Portuguese Gambit',
        line: 'e4 d5 exd5 Nf6 d4 Bg4 f3 Bf5 Bb5+ Nbd7 c4 e6 dxe6 Bxe6',
        note: 'Sacrifice a pawn for rapid development.',
      },
      {
        name: 'vs 3.Nf3',
        line: 'e4 d5 exd5 Qxd5 Nf3 Bg4 Be2 Nc6 O-O O-O-O Nc3 Qh5',
        note: 'Castle long and go after the white king.',
      },
      {
        name: 'Qa5 vs 5.Bc4',
        line: 'e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Bc4 Bf5 Bd2 e6 Qe2 Bb4',
        note: 'Pin the c3 knight to relieve the pressure.',
      },
    ],
  },
  {
    id: 'petrov',
    name: "Petrov's Defense",
    color: 'b',
    level: 2,
    summary:
      'Counterattack e4 with 2...Nf6. One of the most solid answers to 1.e4, used by world champions.',
    ideas: [
      'Never play 3...Nxe4? at once — play 3...d6 first.',
      'Active piece play with ...Nc6, ...Be7 and ...Bf5/g4.',
      'A symmetrical structure that is hard to crack.',
    ],
    days: [
      {
        name: 'Classical Attack',
        line: 'e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Nc6 O-O Be7 c4 Nb4 Be2 O-O Nc3 Bf5',
        note: 'Keep the knight on e4 as long as possible.',
      },
      {
        name: 'Nimzowitsch Attack: 5.Nc3',
        line: 'e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 Nc3 Nxc3 dxc3 Be7 Be3 Nc6 Qd2 Be6 O-O-O Qd7',
        note: 'Opposite-side castling is possible — know the plans.',
      },
      {
        name: 'Modern Attack: 3.d4',
        line: 'e4 e5 Nf3 Nf6 d4 Nxe4 Bd3 d5 Nxe5 Nd7 Nxd7 Bxd7 O-O Bd6 c4 c6',
        note: 'Hit e4 and trade off the strong e5 knight.',
      },
      {
        name: 'Cochrane Gambit',
        line: 'e4 e5 Nf3 Nf6 Nxe5 d6 Nxf7 Kxf7 d4 c5 dxc5 Nc6 Bc4+ Be6',
        note: 'Take the knight and stay calm — Black is better.',
      },
      {
        name: 'Three Knights: 3.Nc3',
        line: 'e4 e5 Nf3 Nf6 Nc3 Nc6 Bb5 Nd4 Ba4 Bc5 Nxe5 O-O Nd3 Bb6 e5 Ne8',
        note: "Rubinstein's ...Nd4 against the Four Knights.",
      },
      {
        name: 'Italian Variation: 3.Bc4',
        line: 'e4 e5 Nf3 Nf6 Bc4 Nxe4 Nc3 Nxc3 dxc3 f6 O-O Qe7',
        note: 'Take on e4 and shut down the Bc4 with ...f6.',
      },
      {
        name: '5.Qe2',
        line: 'e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 Qe2 Qe7 d3 Nf6 Bg5 Qxe2+ Bxe2 Be7',
        note: 'Trade queens and equalize.',
      },
    ],
  },
  {
    id: 'open-games-black',
    name: '1...e5 Open Games (as Black)',
    color: 'b',
    level: 1,
    summary:
      "Classical 1...e5: learn Black's best answers to the Italian, Ruy Lopez, Scotch, Vienna and King's Gambit.",
    ideas: [
      'Develop knights before bishops, castle early.',
      'Strike in the centre with ...d5 when possible.',
      "Watch the f7 square — it's the weakest point.",
    ],
    days: [
      {
        name: 'vs Italian: Giuoco Pianissimo',
        line: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O Re1 a6 Bb3 Ba7 h3 h6',
        note: 'Mirror development; ...a6 & ...Ba7 keep the bishop.',
      },
      {
        name: 'vs Ng5: 5...Na5',
        line: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2 h6 Nf3 e4 Ne5 Bd6',
        note: 'Never play 5...Nxd5?; the pawn sacrifice gives real play.',
      },
      {
        name: 'vs Ruy Lopez: Berlin',
        line: 'e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8',
        note: 'The Berlin Wall: solid and drawish at the top level.',
      },
      {
        name: 'vs Ruy Lopez: Closed',
        line: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 c5 d4 Qc7',
        note: 'The Chigorin setup with ...Na5 and ...c5.',
      },
      {
        name: 'vs Scotch: 4...Bc5',
        line: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Nb3 Bb6 a4 a6 Nc3 d6 Nd5 Ba7',
        note: 'Hit the d4 knight with tempo.',
      },
      {
        name: 'vs Vienna: 2...Nf6',
        line: 'e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Nf3 Be7 d4 O-O Bd3 f5',
        note: 'Strike back with ...d5 against the Vienna Gambit.',
      },
      {
        name: "vs King's Gambit: 3...d5",
        line: 'e4 e5 f4 exf4 Nf3 d5 exd5 Nf6 Bc4 Nxd5 O-O Be7',
        note: 'Return the pawn for smooth development.',
      },
    ],
  },
  {
    id: 'kings-indian',
    name: "King's Indian Defense",
    color: 'b',
    level: 3,
    summary:
      'Let White build a big centre, then attack it with ...e5 or ...c5 and launch a kingside pawn storm with ...f5.',
    ideas: [
      'Fianchetto, castle, then ...e5.',
      'When the centre closes (d5), attack with ...f5–f4–g5.',
      'The g7 bishop is the heart of the defence.',
    ],
    days: [
      {
        name: 'Classical: Mar del Plata',
        line: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1 Nd7 Nd3 f5',
        note: 'Opposite-wing race: your ...f5–f4–g5 against White\'s c5.',
      },
      {
        name: 'Petrosian: 7.d5',
        line: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 d5 a5 Bg5 h6 Bh4 Na6 Nd2 Qe8',
        note: 'Unpin with ...Qe8 and prepare ...Nc5 and ...f5.',
      },
      {
        name: 'Sämisch',
        line: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 e5 d5 Nh5 Qd2 f5 O-O-O Nd7',
        note: 'Meet the closed centre with ...Nh5 and ...f5.',
      },
      {
        name: 'Four Pawns Attack',
        line: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4 O-O Nf3 c5 d5 e6 Be2 exd5 cxd5 Bg4',
        note: 'Undermine the big centre with ...c5 and ...e6.',
      },
      {
        name: 'Fianchetto Variation',
        line: 'd4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d6 O-O Nbd7 Nc3 e5 e4 c6 h3 Qb6',
        note: 'Hit d4 and b2 with ...Qb6.',
      },
      {
        name: 'Averbakh',
        line: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Bg5 c5 d5 e6 Qd2 exd5 exd5 Re8',
        note: 'Break with ...c5 and ...e6 against the pin.',
      },
      {
        name: 'Exchange: 7.dxe5',
        line: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 dxe5 dxe5 Qxd8 Rxd8 Bg5 Re8',
        note: 'The queenless middlegame is fine for Black.',
      },
    ],
  },
  {
    id: 'nimzo-indian',
    name: 'Nimzo-Indian Defense',
    color: 'b',
    level: 3,
    summary:
      'Pin the c3 knight with ...Bb4 to control e4. Flexible, sound and strategically rich.',
    ideas: [
      '...Bb4 stops e4 by pinning the c3 knight.',
      'Often trade bishop for knight to double White\'s pawns.',
      'Blockade the doubled pawns with ...c5 and ...d6.',
    ],
    days: [
      {
        name: 'Rubinstein: 4.e3',
        line: 'd4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5 O-O Nc6 a3 Bxc3 bxc3 dxc4 Bxc4 Qc7',
        note: 'The main line: hit the centre with ...d5 and ...c5.',
      },
      {
        name: 'Classical: 4.Qc2',
        line: 'd4 Nf6 c4 e6 Nc3 Bb4 Qc2 O-O a3 Bxc3+ Qxc3 b6 Bg5 Bb7 f3 h6 Bh4 d5',
        note: 'Fight for e4 with ...b6, ...Bb7 and ...d5.',
      },
      {
        name: 'Sämisch: 4.a3',
        line: 'd4 Nf6 c4 e6 Nc3 Bb4 a3 Bxc3+ bxc3 c5 f3 d5 cxd5 Nxd5 dxc5 f5',
        note: 'Attack the doubled c-pawns.',
      },
      {
        name: 'Kasparov: 4.Nf3',
        line: 'd4 Nf6 c4 e6 Nc3 Bb4 Nf3 c5 g3 cxd4 Nxd4 O-O Bg2 d5 cxd5 Nxd5',
        note: 'Open the centre and develop quickly.',
      },
      {
        name: 'Leningrad: 4.Bg5',
        line: 'd4 Nf6 c4 e6 Nc3 Bb4 Bg5 h6 Bh4 c5 d5 d6 e3 Bxc3+ bxc3 e5',
        note: 'Block the centre with ...e5 against the doubled pawns.',
      },
      {
        name: 'Spielmann: 4.Qb3',
        line: 'd4 Nf6 c4 e6 Nc3 Bb4 Qb3 c5 dxc5 Nc6 Nf3 Ne4 Bd2 Nxd2 Nxd2 Bxc5',
        note: 'Counterattack with ...c5 and ...Nc6.',
      },
      {
        name: 'Kmoch: 4.f3',
        line: 'd4 Nf6 c4 e6 Nc3 Bb4 f3 d5 a3 Bxc3+ bxc3 c5 cxd5 Nxd5 dxc5 f5',
        note: 'Stop e4 directly with ...d5.',
      },
    ],
  },
  {
    id: 'qgd-black',
    name: "Queen's Gambit Declined (as Black)",
    color: 'b',
    level: 2,
    summary:
      'The classical answer to 1.d4: hold d5 with ...e6, develop solidly and free the position with ...c5 or ...e5.',
    ideas: [
      '...e6 supports d5 but locks in the light-squared bishop.',
      'Freeing breaks: ...c5 and ...e5.',
      'Trades relieve the cramp (Lasker\'s ...Ne4).',
    ],
    days: [
      {
        name: 'Tartakower',
        line: 'd4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 h6 Bh4 b6 cxd5 Nxd5 Bxe7 Qxe7 Nxd5 exd5',
        note: '...b6 and ...Bb7 solve the bad bishop problem.',
      },
      {
        name: 'Lasker Defense',
        line: 'd4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 h6 Bh4 Ne4 Bxe7 Qxe7 cxd5 Nxc3 bxc3 exd5',
        note: 'Trade pieces with ...Ne4 to free your game.',
      },
      {
        name: 'Exchange Variation',
        line: 'd4 d5 c4 e6 Nc3 Nf6 cxd5 exd5 Bg5 c6 e3 Be7 Bd3 Nbd7 Qc2 O-O Nge2 Re8',
        note: 'Know the Carlsbad structure and the minority attack.',
      },
      {
        name: '5.Bf4',
        line: 'd4 d5 c4 e6 Nc3 Nf6 Nf3 Be7 Bf4 O-O e3 c5 dxc5 Bxc5 Qc2 Nc6 a3 Qa5',
        note: 'Hit back at once with ...c5.',
      },
      {
        name: 'Ragozin',
        line: 'd4 d5 c4 e6 Nc3 Nf6 Nf3 Bb4 cxd5 exd5 Bg5 Nbd7 e3 c5 Bd3 Qa5',
        note: 'A Nimzo-style pin inside the QGD.',
      },
      {
        name: 'Semi-Tarrasch',
        line: 'd4 Nf6 c4 e6 Nf3 d5 Nc3 c5 cxd5 Nxd5 e4 Nxc3 bxc3 cxd4 cxd4 Bb4+ Bd2 Bxd2+ Qxd2 O-O',
        note: 'Trade into a position where White\'s centre is a target.',
      },
      {
        name: 'vs Catalan',
        line: 'd4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O dxc4 Qc2 a6 Qxc4 b5 Qc2 Bb7',
        note: 'Take c4 and develop the bishop to b7.',
      },
    ],
  },
  {
    id: 'slav',
    name: 'Slav & Semi-Slav',
    color: 'b',
    level: 2,
    summary:
      'Support d5 with ...c6, keeping the light-squared bishop free. Solid and full of fighting chances.',
    ideas: [
      '...c6 keeps the c8 bishop free.',
      '...dxc4 and ...b5 in the Meran grab queenside space.',
      'Develop the bishop before ...e6 in the pure Slav.',
    ],
    days: [
      {
        name: 'Slav Main Line',
        line: 'd4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 e3 e6 Bxc4 Bb4 O-O Nbd7 Qe2 O-O',
        note: 'Take c4, develop the bishop to f5, then castle.',
      },
      {
        name: 'Exchange Slav',
        line: 'd4 d5 c4 c6 cxd5 cxd5 Nc3 Nf6 Bf4 Nc6 e3 Bf5 Nf3 e6',
        note: 'Symmetry: develop actively and copy where safe.',
      },
      {
        name: 'Quiet: 4.e3 Bf5',
        line: 'd4 d5 c4 c6 Nf3 Nf6 e3 Bf5 Nc3 e6 Nh4 Bg6 Nxg6 hxg6',
        note: 'Allow Nxg6: the half-open h-file is useful.',
      },
      {
        name: 'Chebanenko: 4...a6',
        line: 'd4 d5 c4 c6 Nf3 Nf6 Nc3 a6 e3 b5 b3 Bg4 h3 Bxf3 Qxf3 e6',
        note: 'Gain queenside space with ...a6 and ...b5.',
      },
      {
        name: 'Semi-Slav: Meran',
        line: 'd4 d5 c4 c6 Nc3 Nf6 Nf3 e6 e3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 Bb7 O-O a6 e4 c5',
        note: 'Grab space with ...b5, then strike with ...c5.',
      },
      {
        name: 'Semi-Slav: Moscow',
        line: 'd4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 h6 Bxf6 Qxf6 e3 Nd7 Bd3 dxc4 Bxc4 g6',
        note: 'The bishop pair gives Black long-term chances.',
      },
      {
        name: 'Semi-Slav: Botvinnik',
        line: 'd4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 dxc4 e4 b5 e5 h6 Bh4 g5 Nxg5 hxg5 Bxg5 Nbd7',
        note: 'One of the sharpest lines in chess — know the moves.',
      },
    ],
  },
  {
    id: 'grunfeld',
    name: 'Grünfeld Defense',
    color: 'b',
    level: 3,
    summary:
      "Let White build a big centre, then destroy it with ...d5, ...Bg7 and ...c5. Kasparov's dynamic favourite.",
    ideas: [
      '...d5 challenges the centre on move 3.',
      'The g7 bishop and ...c5 attack d4.',
      'Piece pressure, not pawns, wins the centre.',
    ],
    days: [
      {
        name: 'Exchange: Rb1 line',
        line: 'd4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Nf3 c5 Rb1 O-O Be2 cxd4 cxd4 Qa5+ Bd2 Qxa2 O-O',
        note: 'Grab the a2 pawn when White plays Rb1.',
      },
      {
        name: 'Exchange: Bc4',
        line: 'd4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Bc4 c5 Ne2 Nc6 Be3 O-O O-O',
        note: 'Pressure d4 with ...c5 and ...Nc6.',
      },
      {
        name: 'Russian: 5.Qb3',
        line: 'd4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3 dxc4 Qxc4 O-O e4 a6 Be2 b5 Qb3',
        note: 'Hit the queen with ...b5 and gain space.',
      },
      {
        name: '4.Bf4',
        line: 'd4 Nf6 c4 g6 Nc3 d5 Bf4 Bg7 e3 c5 dxc5 Qa5 Rc1 dxc4 Bxc4 O-O Nf3 Qxc5',
        note: 'Sacrifice and regain the c5 pawn.',
      },
      {
        name: '5.Bg5',
        line: 'd4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Bg5 Ne4 cxd5 Nxg5 Nxg5 e6 Nf3 exd5',
        note: 'Win the bishop pair with ...Ne4.',
      },
      {
        name: 'Fianchetto',
        line: 'd4 Nf6 c4 g6 g3 d5 Bg2 Bg7 cxd5 Nxd5 Nf3 O-O O-O c5',
        note: 'Same plan: ...c5 against d4.',
      },
      {
        name: 'Quiet: 5.e3',
        line: 'd4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 e3 O-O Qb3 e6 Be2 b6 O-O Bb7',
        note: 'Solid play with ...e6 and ...b6.',
      },
    ],
  },
  {
    id: 'dutch',
    name: 'Dutch Defense',
    color: 'b',
    level: 2,
    summary:
      'Fight for e4 with 1...f5 and aim for a kingside attack. Choose the Leningrad (...g6) or the Stonewall (...d5, ...e6).',
    ideas: [
      '...f5 controls e4 and gives kingside space.',
      'Leningrad: ...g6, ...Bg7, ...d6 and ...e5.',
      'Stonewall: ...d5, ...e6, ...c6 and a knight on e4.',
    ],
    days: [
      {
        name: 'Leningrad',
        line: 'd4 f5 g3 Nf6 Bg2 g6 Nf3 Bg7 O-O O-O c4 d6 Nc3 Qe8 d5 a5',
        note: '...Qe8 prepares ...e5 and kingside play.',
      },
      {
        name: 'Stonewall',
        line: 'd4 f5 c4 Nf6 g3 e6 Bg2 d5 Nf3 c6 O-O Bd6 b3 Qe7 Ne5 O-O',
        note: 'A rock-solid centre and an e4 outpost.',
      },
      {
        name: 'Classical',
        line: 'd4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O d6 Nc3 Qe8',
        note: 'The queen swings to h5 for an attack.',
      },
      {
        name: 'Staunton Gambit',
        line: 'd4 f5 e4 fxe4 Nc3 Nf6 Bg5 Nc6 d5 Ne5 Qd4 Nf7',
        note: 'Hold the extra pawn and finish development.',
      },
      {
        name: 'vs 2.Bg5',
        line: 'd4 f5 Bg5 g6 Nd2 Bg7 c3 Nf6 e3',
        note: 'Avoid the pin with ...g6.',
      },
      {
        name: 'vs 2.Nc3',
        line: 'd4 f5 Nc3 Nf6 Bg5 d5 Bxf6 exf6 e3 c6',
        note: 'Hold e4 with ...d5.',
      },
      {
        name: 'vs London',
        line: 'd4 f5 Bf4 Nf6 e3 g6 Nf3 Bg7 h3 O-O Be2 d6 O-O',
        note: 'Leningrad setup, then ...Qe8 and ...e5.',
      },
    ],
  },
  {
    id: 'pirc-modern',
    name: 'Pirc & Modern Defense',
    color: 'b',
    level: 2,
    summary:
      'Hypermodern defence: let White take the centre, fianchetto your bishop, then hit back with ...e5 or ...c5.',
    ideas: [
      'Strike the centre after it is built.',
      '...c6 and ...b5 for queenside play.',
      'Be careful against early attacks like f4 and Be3–Qd2.',
    ],
    days: [
      {
        name: 'Austrian Attack',
        line: 'e4 d6 d4 Nf6 Nc3 g6 f4 Bg7 Nf3 O-O Bd3 Na6 O-O c5 d5 Bg4',
        note: 'Hit the big centre with ...c5.',
      },
      {
        name: 'Classical',
        line: 'e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 Be2 O-O O-O c6 a4 a5 h3 Na6',
        note: '...Na6–b4 makes good use of the b4 hole.',
      },
      {
        name: '150 Attack',
        line: 'e4 d6 d4 Nf6 Nc3 g6 Be3 c6 Qd2 b5 Bd3 Nbd7 Nf3 e5',
        note: 'Counter on the queenside before White attacks.',
      },
      {
        name: 'Modern: ...a6 & ...b5',
        line: 'e4 g6 d4 Bg7 Nc3 d6 Be3 a6 Qd2 Nd7 f4 b5 Nf3 Bb7 Bd3 c5',
        note: 'Flexible development with fast queenside expansion.',
      },
      {
        name: 'Modern: Bishop Attack',
        line: 'e4 g6 d4 Bg7 Bc4 d6 Qf3 e6 Ne2 Nc6',
        note: 'Cover f7 with ...e6 and play ...Nc6.',
      },
      {
        name: 'Byrne: 4.Bg5',
        line: 'e4 d6 d4 Nf6 Nc3 g6 Bg5 Bg7 Qd2 h6 Bh4 c6',
        note: 'Kick the bishop and keep flexible.',
      },
      {
        name: 'Fianchetto: 4.g3',
        line: 'e4 d6 d4 Nf6 Nc3 g6 g3 Bg7 Bg2 O-O Nge2 e5 O-O c6',
        note: 'Classical ...e5 against the quiet setup.',
      },
    ],
  },
  {
    id: 'alekhine',
    name: 'Alekhine Defense',
    color: 'b',
    level: 2,
    summary:
      "Provoke White's pawns forward with 1...Nf6, then attack the overextended centre.",
    ideas: [
      'Invite e5, c4 and d4, then undermine with ...d6.',
      'The b6 knight and ...Bg4 pressure d4.',
      'Do not let White\'s pawns roll forward unchecked.',
    ],
    days: [
      {
        name: 'Modern: 4...Bg4',
        line: 'e4 Nf6 e5 Nd5 d4 d6 Nf3 Bg4 Be2 e6 O-O Be7 c4 Nb6 h3 Bh5 Nc3 O-O Be3 d5',
        note: 'Pin the knight, then build a French-like structure.',
      },
      {
        name: 'Modern: 4...dxe5',
        line: 'e4 Nf6 e5 Nd5 d4 d6 Nf3 dxe5 Nxe5 c6 Be2 Bf5 O-O Nd7 Nf3 e6',
        note: 'Trade the e5 pawn and develop solidly.',
      },
      {
        name: 'Four Pawns Attack',
        line: 'e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4 dxe5 fxe5 Nc6 Be3 Bf5 Nc3 e6 Nf3 Be7',
        note: 'Attack the huge centre with pieces.',
      },
      {
        name: 'Exchange Variation',
        line: 'e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 exd6 cxd6 Nc3 g6 Be3 Bg7 Rc1 O-O b3 e5',
        note: 'Hit d4 with ...e5 and the g7 bishop.',
      },
      {
        name: 'Two Pawns Attack',
        line: 'e4 Nf6 e5 Nd5 c4 Nb6 c5 Nd5 Bc4 e6 Nc3 Nxc3 dxc3 Bxc5',
        note: 'Grab the overextended c5 pawn.',
      },
      {
        name: 'Scandinavian Variation',
        line: 'e4 Nf6 Nc3 d5 exd5 Nxd5 Bc4 Nb6 Bb3 c5',
        note: 'Gain space with ...c5 and ...Nc6.',
      },
      {
        name: 'vs 3.Nc3',
        line: 'e4 Nf6 e5 Nd5 Nc3 Nxc3 dxc3 d6 Nf3 Nc6 Bb5 Bd7',
        note: 'Trade and attack the e5 pawn.',
      },
    ],
  },
  {
    id: 'queens-indian',
    name: "Queen's Indian & Bogo-Indian",
    color: 'b',
    level: 2,
    summary:
      'Against 3.Nf3, control e4 with ...b6/...Bb7 (Queen\'s Indian) or check with ...Bb4+ (Bogo-Indian). Solid and flexible.',
    ideas: [
      '...b6 and ...Bb7 (or ...Ba6) fight for e4.',
      'The Bogo check trades off dark-squared bishops.',
      'Free the position with ...c5 or ...d5.',
    ],
    days: [
      {
        name: "QID: Fianchetto 4...Ba6",
        line: 'd4 Nf6 c4 e6 Nf3 b6 g3 Ba6 b3 Bb4+ Bd2 Be7 Bg2 c6 Bc3 d5 Ne5 Nfd7 Nxd7 Nxd7 Nd2 O-O O-O',
        note: '...Ba6 hits c4 and slows White down.',
      },
      {
        name: 'QID: Petrosian 4.a3',
        line: 'd4 Nf6 c4 e6 Nf3 b6 a3 Bb7 Nc3 d5 cxd5 Nxd5 Qc2 Nxc3 bxc3 Be7 e4 O-O Bd3 c5',
        note: 'Hit the centre with ...c5 after trading on c3.',
      },
      {
        name: 'QID: 4.e3',
        line: 'd4 Nf6 c4 e6 Nf3 b6 e3 Bb7 Bd3 d5 O-O Bd6 Nc3 O-O b3 Nbd7 Bb2',
        note: 'Symmetrical development; aim for ...c5 or ...Ne4.',
      },
      {
        name: 'QID: 4.Nc3',
        line: 'd4 Nf6 c4 e6 Nf3 b6 Nc3 Bb4 Bg5 Bb7 e3 h6 Bh4 g5 Bg3 Ne4 Nd2 Nxc3 bxc3',
        note: 'Break the pin with ...h6 and ...g5.',
      },
      {
        name: 'Bogo: 4...Be7 Retreat',
        line: 'd4 Nf6 c4 e6 Nf3 Bb4+ Bd2 Be7 g3 d5 Bg2 O-O O-O c6 Qc2 Nbd7',
        note: 'The bishop drops back after misplacing White\'s bishop.',
      },
      {
        name: 'Bogo: 4...Qe7',
        line: 'd4 Nf6 c4 e6 Nf3 Bb4+ Bd2 Qe7 g3 Nc6 Nc3 Bxc3 Bxc3 Ne4 Rc1 O-O Bg2 d6',
        note: 'Keep the tension and fight for e5.',
      },
      {
        name: 'Bogo: 4.Nbd2',
        line: 'd4 Nf6 c4 e6 Nf3 Bb4+ Nbd2 O-O a3 Be7 e4 d5 e5 Nfd7 Bd3 c5',
        note: 'Hit back at the centre with ...d5 and ...c5.',
      },
    ],
  },
  {
    id: 'benoni-benko',
    name: 'Benoni & Benko',
    color: 'b',
    level: 3,
    summary:
      'Unbalance the game with ...c5. The Benoni gives dynamic piece play; the Benko gambit gives lasting queenside pressure.',
    ideas: [
      'Queenside majority vs central majority.',
      'The g7 bishop and ...b5 are your main weapons.',
      'In the Benko, the a- and b-files belong to your rooks.',
    ],
    days: [
      {
        name: 'Modern Benoni: Classical',
        line: 'd4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 Nf3 g6 e4 Bg7 Be2 O-O O-O Re8 Nd2 Na6',
        note: '...Na6–c7 and ...b5 for queenside play.',
      },
      {
        name: 'Modern Benoni: Fianchetto',
        line: 'd4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 Nf3 g6 g3 Bg7 Bg2 O-O O-O Re8',
        note: 'Pressure e4 and prepare ...a6/...b5.',
      },
      {
        name: 'Benoni: Taimanov',
        line: 'd4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 f4 Bg7 Bb5+ Nfd7 a4 O-O Nf3 Na6',
        note: 'The dangerous Bb5+ line — block with the knight.',
      },
      {
        name: 'Benko: King Walk',
        line: 'd4 Nf6 c4 c5 d5 b5 cxb5 a6 bxa6 g6 Nc3 Bxa6 e4 Bxf1 Kxf1 d6 Nf3 Bg7 g3 O-O Kg2 Nbd7',
        note: 'Classic Benko pressure on the a- and b-files.',
      },
      {
        name: 'Benko: 5.b6',
        line: 'd4 Nf6 c4 c5 d5 b5 cxb5 a6 b6 Qxb6 Nc3 d6 e4 g6 Nf3 Bg7',
        note: 'White returns the pawn; develop normally.',
      },
      {
        name: 'Benko Declined: 4.Nf3',
        line: 'd4 Nf6 c4 c5 d5 b5 Nf3 g6 cxb5 a6 bxa6 Bxa6',
        note: 'Same plans: ...Bxa6 and fianchetto.',
      },
      {
        name: 'Benoni via ...e6 & ...c5',
        line: 'd4 Nf6 c4 e6 Nf3 c5 d5 exd5 cxd5 d6 Nc3 g6 Nd2 Bg7 e4 O-O Be2 Re8',
        note: 'A move order that avoids the Taimanov attack.',
      },
    ],
  },
];

/**
 * Builds src/data/openings.json from the curated courses (scripts/courses.js).
 *
 * - Every move is validated with chess.js (an illegal move fails the build).
 * - Lines are trimmed to end on the trainee's move.
 * - Positions are named with the lichess chess-openings database (CC0):
 *   https://github.com/lichess-org/chess-openings  (scripts/data/[a-e].tsv)
 *
 * Usage: node scripts/build-openings.js
 */
const fs = require('fs');
const path = require('path');
const { Chess } = require('chess.js');
const courses = require('./courses');

const dataDir = path.join(__dirname, 'data');
const epd = fen => fen.split(' ').slice(0, 4).join(' ');

// EPD -> { eco, name } for every named position in the lichess database.
const named = new Map();
for (const f of ['a', 'b', 'c', 'd', 'e']) {
  const rows = fs.readFileSync(path.join(dataDir, `${f}.tsv`), 'utf8').trim().split('\n').slice(1);
  for (const row of rows) {
    const [eco, name, pgn] = row.split('\t');
    const chess = new Chess();
    const sans = pgn.replace(/\d+\.\s*/g, '').trim().split(/\s+/);
    try {
      sans.forEach(s => chess.move(s));
    } catch (e) {
      continue;
    }
    named.set(epd(chess.fen()), { eco, name });
  }
}
console.log(`lichess openings indexed: ${named.size}`);

let errors = 0;
let totalLines = 0;
const out = courses.map(course => {
  if (course.days.length !== 7) {
    console.error(`✗ ${course.id}: expected 7 days, got ${course.days.length}`);
    errors++;
  }
  const days = course.days.map((day, di) => {
    const chess = new Chess();
    const moves = day.line.trim().split(/\s+/);
    const sans = [];
    const names = [];
    let last = null;
    for (let i = 0; i < moves.length; i++) {
      let mv;
      try {
        mv = chess.move(moves[i]);
      } catch (e) {
        console.error(`✗ ${course.id} day ${di + 1} (${day.name}): illegal move #${i + 1} "${moves[i]}"`);
        errors++;
        break;
      }
      sans.push(mv.san);
      const n = named.get(epd(chess.fen()));
      if (n && n.name !== last) {
        names.push([i + 1, n.eco, n.name]);
        last = n.name;
      }
    }
    // Lines end on the trainee's move: white moves are even indexes.
    const userParity = course.color === 'w' ? 1 : 0;
    while (sans.length && sans.length % 2 !== userParity) {
      sans.pop();
    }
    const userMoves = Math.floor((sans.length + (course.color === 'w' ? 1 : 0)) / 2);
    if (userMoves < 4) {
      console.error(`✗ ${course.id} day ${di + 1}: only ${userMoves} moves for the trainee`);
      errors++;
    }
    if (names.length === 0) {
      console.warn(`! ${course.id} day ${di + 1}: no named position found`);
    }
    totalLines++;
    return {
      name: day.name,
      note: day.note,
      moves: sans,
      names: names.filter(([ply]) => ply <= sans.length),
    };
  });
  return {
    id: course.id,
    name: course.name,
    color: course.color,
    level: course.level,
    summary: course.summary,
    ideas: course.ideas,
    days,
  };
});

if (errors) {
  console.error(`\n${errors} error(s) — not writing output.`);
  process.exit(1);
}
const dest = path.join(__dirname, '..', 'src', 'data', 'openings.json');
fs.writeFileSync(dest, JSON.stringify({ courses: out }));
console.log(`wrote ${out.length} courses, ${totalLines} lines -> ${path.relative(process.cwd(), dest)}`);

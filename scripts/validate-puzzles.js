// Replays every puzzle in src/data/puzzles.json with chess.js to verify legality.
const { Chess } = require('chess.js');
const { themes } = require('../src/data/puzzles.json');

let total = 0;
let bad = 0;
const ids = new Set();
for (const [theme, list] of Object.entries(themes)) {
  for (const [id, fen, moves] of list) {
    total++;
    ids.add(id);
    const chess = new Chess(fen);
    try {
      for (const uci of moves.split(' ')) {
        chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
      }
    } catch (e) {
      bad++;
      console.error(`✗ ${theme} ${id}: ${e.message}`);
    }
  }
}
console.log(`${total} entries, ${ids.size} unique puzzles, ${bad} invalid`);
process.exit(bad ? 1 : 0);

"""
Builds src/data/puzzles.json from the lichess puzzle database (CC0):
https://database.lichess.org/#puzzles  (lichess_db_puzzle.csv.zst)

Usage:
  py -m pip install zstandard
  py scripts/build_puzzles.py path/to/lichess_db_puzzle.csv.zst

For every training theme we keep the best puzzles (popularity, play count) in each
rating band, limited to short solutions (at most 3 moves for the trainee).
"""
import csv
import heapq
import io
import json
import os
import sys

import zstandard

# Training themes -> lichess theme tags (a puzzle matches if it has any of them).
THEMES = {
    "mateIn1": ["mateIn1"],
    "hangingPiece": ["hangingPiece"],
    "fork": ["fork"],
    "pin": ["pin"],
    "skewer": ["skewer"],
    "discoveredAttack": ["discoveredAttack"],
    "backRankMate": ["backRankMate"],
    "mateIn2": ["mateIn2"],
    "doubleCheck": ["doubleCheck"],
    "trappedPiece": ["trappedPiece"],
    "attraction": ["attraction"],
    "deflection": ["deflection"],
    "capturingDefender": ["capturingDefender"],
    "smotheredMate": ["smotheredMate"],
    "promotion": ["promotion", "advancedPawn"],
    "attackingF2F7": ["attackingF2F7"],
    "sacrifice": ["sacrifice"],
    "intermezzo": ["intermezzo"],
    "clearance": ["clearance"],
    "interference": ["interference"],
    "xRayAttack": ["xRayAttack"],
    "quietMove": ["quietMove"],
    "defensiveMove": ["defensiveMove"],
    "kingsideAttack": ["kingsideAttack", "exposedKing"],
    "mateIn3": ["mateIn3"],
    "matingPatterns": ["anastasiaMate", "arabianMate", "bodenMate", "hookMate",
                       "doubleBishopMate", "dovetailMate", "killBoxMate", "vukovicMate"],
    "zugzwang": ["zugzwang"],
    "pawnEndgame": ["pawnEndgame"],
    "rookEndgame": ["rookEndgame"],
    "minorPieceEndgame": ["bishopEndgame", "knightEndgame"],
    "queenEndgame": ["queenEndgame", "queenRookEndgame"],
    "openingTactics": ["opening"],
}

BANDS = [0, 800, 1100, 1400, 1700, 2000, 2300, 9999]
PER_BAND = 110
MAX_MOVES = 6          # opponent's first move + up to 3 trainee moves
MIN_POPULARITY = 80
MIN_PLAYS = 300
MAX_RD = 85


def band_of(rating):
    for i in range(len(BANDS) - 1):
        if BANDS[i] <= rating < BANDS[i + 1]:
            return i
    return len(BANDS) - 2


def main(src):
    tag_to_themes = {}
    for theme, tags in THEMES.items():
        for t in tags:
            tag_to_themes.setdefault(t, []).append(theme)

    # (theme, band) -> min-heap of (score, puzzle)
    heaps = {}
    seen = 0
    kept = 0
    with open(src, "rb") as fh:
        reader = zstandard.ZstdDecompressor().stream_reader(fh)
        text = io.TextIOWrapper(reader, encoding="utf-8")
        for row in csv.DictReader(text):
            seen += 1
            moves = row["Moves"].split()
            if len(moves) > MAX_MOVES or len(moves) < 2:
                continue
            pop = int(row["Popularity"])
            plays = int(row["NbPlays"])
            rd = int(row["RatingDeviation"])
            if pop < MIN_POPULARITY or plays < MIN_PLAYS or rd > MAX_RD:
                continue
            rating = int(row["Rating"])
            tags = row["Themes"].split()
            themes = set()
            for t in tags:
                themes.update(tag_to_themes.get(t, ()))
            if not themes:
                continue
            kept += 1
            score = (pop, min(plays, 20000))
            entry = [row["PuzzleId"], row["FEN"], row["Moves"], rating]
            b = band_of(rating)
            for theme in themes:
                h = heaps.setdefault((theme, b), [])
                item = (score, row["PuzzleId"], entry)
                if len(h) < PER_BAND:
                    heapq.heappush(h, item)
                elif item > h[0]:
                    heapq.heapreplace(h, item)
            if seen % 500000 == 0:
                print(f"  scanned {seen:,} puzzles, {kept:,} candidates", flush=True)

    out = {}
    for theme in THEMES:
        entries = []
        for b in range(len(BANDS) - 1):
            entries.extend(e for _, _, e in heaps.get((theme, b), []))
        entries.sort(key=lambda e: e[3])
        out[theme] = entries
        print(f"{theme:20} {len(entries):5}  ratings {entries[0][3] if entries else '-'}–{entries[-1][3] if entries else '-'}")

    dest = os.path.join(os.path.dirname(__file__), "..", "src", "data", "puzzles.json")
    with open(dest, "w", encoding="utf-8") as fh:
        json.dump({"themes": out}, fh, separators=(",", ":"))
    total = sum(len(v) for v in out.values())
    unique = len({e[0] for v in out.values() for e in v})
    print(f"\nscanned {seen:,}; wrote {total:,} entries ({unique:,} unique puzzles) -> {dest}")


if __name__ == "__main__":
    main(sys.argv[1])

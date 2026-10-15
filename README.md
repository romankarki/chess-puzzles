# ♞ ChessLock

Turn your phone habits into chess training. ChessLock blocks the apps you choose
(social media, YouTube, games…) and asks you to **solve a short chess puzzle or play
the opening of the week** every time you open one of them — and, optionally, every
time you unlock your phone. Phone and Messages are never blocked.

> Android only. iOS does not let apps detect unlocks or show custom UI before other
> apps open.

## How training works

Each week you pick **one puzzle theme** and **one opening** from the dropdowns on the Today
screen. They stay until you change them; a Monday 9:00 notification reminds you to.

| | Puzzles | Openings |
|---|---|---|
| **This week** | The chosen theme (forks, pins, mate in 2, …) | The chosen opening course |
| **Mon–Sat** | Puzzles at your level in that theme | One variation of the course per day, **the same line all day** |
| **Sunday** | Revision: older themes, weakest first, plus retries of puzzles you missed | Revision: lines you've learned, least solid first, from memory |
| **Per challenge** | 1–3 short puzzles (≤ 3 moves to find) | Play the day's line from memory |
| **Database** | 18,190 lichess puzzles across 32 themes, rated ~450–2750 | 30 courses × 7 variations = 210 lines, named with 3,800+ lichess ECO names |

- **Adaptive difficulty**: an Elo-style rating picks puzzles near your level. Each theme also
  keeps its own rating, blended in as you play it (weak themes get easier puzzles, strong
  ones harder), and your last 12 results nudge difficulty by −120…+100 to keep you near
  ~70% clean solves. A puzzle counts as solved only without mistakes or hints.
- **Sunday revision** (Settings › Training, on by default): challenges revisit themes you have
  practised — ranked by miss rate and how long since you saw them, rotating as you go —
  alternating with retries of puzzles you missed on earlier days (a clean retry clears it;
  retries don't change your rating). Opening challenges replay learned lines from memory.
- **Hints** escalate after mistakes (piece highlight → arrow), so a challenge can always be finished.
- **Openings**: the first run of the day is *guided* (arrows show each move); afterwards you
  play from memory and an arrow appears only after a mistake. Every position shows its ECO
  name, e.g. *B90 · Sicilian Defense: Najdorf Variation, English Attack*. Any of the course's
  7 lines can be practised from the "Other lines" dropdown.
- **Modes**: Puzzles, Openings or Mixed (alternates).
- **Themes**: Mate in 1, Hanging pieces, Forks, Pins, Skewers, Discovered attacks, Back-rank
  mate, Mate in 2, Double check, Trapped pieces, Attraction, Deflection, Remove the defender,
  Smothered mate, Promotion, f2/f7, Sacrifices, In-between moves, Clearance, Interference,
  X-ray, Quiet moves, Defensive moves, Kingside attack, Mate in 3, Mating patterns, Zugzwang,
  Pawn / Rook / Minor-piece / Queen endgames, Opening tactics.
- **Opening courses** — White: Italian, Ruy Lopez, Scotch, Queen's Gambit, London, English,
  Vienna, Catalan, Réti & KIA, Open Sicilian, King's Gambit. Black: Najdorf, Dragon,
  Sveshnikov, Anti-Sicilians, French, Caro-Kann, Scandinavian, Petrov, 1…e5 Open Games,
  King's Indian, Nimzo-Indian, QGD, Slav & Semi-Slav, Grünfeld, Dutch, Pirc & Modern,
  Alekhine, Queen's Indian & Bogo, Benoni & Benko.

## Blocking rules

- Opening a blocked app shows the challenge on top of it. Solve it and the app opens.
- While you stay in the app you're never interrupted. Leaving and coming back requires a new
  challenge (configurable grace period: never / 1 / 5 / 15 min).
- **Puzzle on every unlock** (optional, off by default): after unlocking, a challenge appears. Until it is solved,
  every app except Phone, Messages, Settings and the home screen re-opens it.
- Always allowed: default Phone and Messages apps, the home screen, Settings and ChessLock.
- **No easy way out**: unblocking an app or turning protection off costs a puzzle first.
  Blocking is free.
- The challenge screen always has **Phone**, **Messages** and **Home** buttons.

## Install & set up

Requirements: Node ≥ 22, JDK 17–21 (Android Studio's bundled JBR works), Android SDK.

```sh
npm install
npm run android          # with a device connected (USB debugging) or emulator running
```

Release APK (no Metro needed):

```sh
cd android
./gradlew assembleRelease
# android/app/build/outputs/apk/release/app-release.apk
```

On the phone:

1. Open ChessLock → pick your level and training mode.
2. **Accessibility**: Settings › Accessibility › ChessLock › On.
   On Android 13+ sideloaded apps are "restricted": if the switch is greyed out, open
   *App info › ⋮ › Allow restricted settings*, then try again.
3. **Apps** tab → choose what to block ("Block social & video" selects common ones).
4. **Battery**: allow unrestricted battery use so the system doesn't stop the blocker
   (important on ASUS, Xiaomi, Samsung, Huawei…).
5. Turn **Protection** on.

## Project layout

```
android/app/src/main/java/com/chesslock/
  AppBlockerService.kt   AccessibilityService: foreground app + unlock detection, session rules
  ChallengeActivity.kt   Separate task that hosts the JS challenge over other apps
  Reminders.kt           Monday 9:00 "pick your focus" notification (AlarmManager)
  ChessLockModule.kt     TurboModule (spec: specs/NativeChessLock.ts)
  SystemApps.kt          Phone / SMS / launcher / keyboard detection
src/
  chess/Board.tsx        SVG board: tap or drag, animations, arrows, promotion
  components/            PuzzleTrainer, OpeningTrainer, TrainingSession
  engine/                schedule (week focus, Sunday revision), puzzle picking & rating, review
  screens/               Today, Apps, Settings, Challenge
  data/                  puzzles.json, openings.json (generated), themes.ts
scripts/
  build_puzzles.py       lichess puzzle DB → src/data/puzzles.json
  validate-puzzles.js    replays every puzzle with chess.js
  courses.js             curated opening courses (edit here)
  build-openings.js      validates courses, adds ECO names → src/data/openings.json
```

### Rebuilding the data

```sh
# Puzzles (downloads ~300 MB)
curl -LO https://database.lichess.org/lichess_db_puzzle.csv.zst
py -m pip install zstandard
py scripts/build_puzzles.py lichess_db_puzzle.csv.zst
node scripts/validate-puzzles.js

# Openings (after editing scripts/courses.js)
node scripts/build-openings.js
npm test
```

## Credits

- Puzzles: [lichess.org puzzle database](https://database.lichess.org/#puzzles) — CC0.
- Opening names: [lichess-org/chess-openings](https://github.com/lichess-org/chess-openings) — CC0.
- Pieces: cburnett by Colin M.L. Burnett — CC BY-SA 3.0.
- Move generation: [chess.js](https://github.com/jhlywa/chess.js) — BSD-2.

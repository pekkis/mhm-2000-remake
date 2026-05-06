# Status — where the archaeology stands

> **For Jean-Claude / any agent picking this up.** Read this first, then
> [README.md](README.md) for the file map, then dive into whichever
> decoder doc is relevant.

## TL;DR

We're reverse-engineering MHM 2000's QuickBASIC 4.5 source (in
`src/mhm2000-qb/`) toward a TypeScript port. The runtime stack
(XState 5 + React 19 + vanilla-extract + immer) is **already proven** —
it's the inherited MHM 97 remake foundation. New game logic ports onto
it sub-by-sub.

## Phase 2 progress (Port Pipeline Shakedown — IN PROGRESS)

The first end-to-end vertical slice is up: `SUB ottpel` (managed-base-
team subset) ported, wired into the gameday machine, scores rendered
with overtime markers, save/load surviving the new shape.

- **Match engine.** [src/services/mhm-2000/simulate-match.ts](../../services/mhm-2000/simulate-match.ts)
  — pure faithful port of `SUB ottpel` (decode at SUBS.md `ottpel` row).
  Consumes `MatchSide = { team: Team; manager: Manager }`, returns
  `MatchResult` with `homeGoals / awayGoals / overtime / *MoraleChange`.
  Symmetric over AI vs human via `calculateStrength(team)` from
  [src/services/team.ts](../../services/team.ts).
- **Service façade.** [src/services/mhm-2000/game.ts](../../services/mhm-2000/game.ts) —
  `MHM2000GameService` mirrors the inherited `GameService` shape;
  `toGameResult()` adapts to MHM 97's `GameResult`.
- **Light-team handling.** Every light team carries the
  `Pier Paolo Proxy Pasolini` proxy manager (singleton, all-zero
  attributes, last row of [src/data/managers.ts](../../data/managers.ts)).
  Encapsulates QB's `man(49..86) = 0` + `mtaito(*, 0)` zero-row pattern
  into a single Manager reference, eliminating `Manager | undefined`
  branching downstream. See GLOSSARY.md `light team` + `Pier Paolo Proxy
Pasolini` rows for the rationale and a full list of QB sites this
  collapses.
- **UI.** Both [src/components/gameday/Results.tsx](../../components/gameday/Results.tsx)
  and [src/components/gameday/Games.tsx](../../components/gameday/Games.tsx)
  now append the QB " ja." overtime marker to every score string when
  `result.overtime`.

**Still on the Phase-2 punch list:** `tre` / `tautip` / `erik` services,
`inte` / `treeni` etu modifiers, `spx(3/4)` consumables, `pel(*).spe`
roster effects (extremelyFat, daddyPays), `jaynax(2/6)` prank wiring,
league comeback handicap ([ILEX5.BAS:3754-3762](../ILEX5.BAS)),
tournament-match path. All TODO-tagged inline in the port.

### Season-arc readiness (DONE)

`valm` / `tre` system fully decoded and wired:

- **`valm(team)`** ∈ {1, 2, 3, 0} — chosen season strategy per team.
  1 = JURI SIMONOV (peak late), 2 = KAIKKI PELIIN! (peak early),
  3 = TASAINEN PUURTO (flat), 0 = light team (no strategy).
  Strings come from DATAX.M2K rows 46-48 (mislabel in earlier
  DATA-FILES.md fixed: these are season-strategy labels, **not**
  trainer-class labels).
- **`tre(team)`** — the per-team season-arc multiplier (~0.7..1.3,
  centered on 1.0). Initialised by `SUB tremaar` ([ILEX5.BAS:7457](../ILEX5.BAS)),
  drifts ±0.0025 per regular-season runkosarja gameday at
  [ILEX5.BAS:1574](../ILEX5.BAS) — and ONLY on `kiero(kr) = 1` rounds
  (verified: 44 such rounds in KIERO.M2K, matched 1:1 by the
  `readiness-tick` tag in [src/data/calendar.ts](../../data/calendar.ts)).
  EHL / cup / playoff / training / preseason rounds do NOT drift `tre`.
- **Hard-coded picks** generalised via manager `tags`:
  `"strategy:simonov"` (Juri Simonov, mirroring QB's
  `IF man = 33 THEN mahd(1) = 100` at [MHM2K.BAS:2497](../MHM2K.BAS) /
  [ILEZ5.BAS:2030](../ILEZ5.BAS)) and `"strategy:tasainen-puurto"`
  (Pier Paolo Proxy Pasolini for all light teams).
- **Ported to:** [src/data/mhm2000/strategies.ts](../../data/mhm2000/strategies.ts)
  (`Strategy` definitions, `READINESS_TICK_TAG`,
  `forcedStrategyForManager`, `initialReadinessFor`),
  [src/components/SelectStrategy.tsx](../../components/SelectStrategy.tsx),
  `selectStrategy` action and `executeCalculations` in
  [src/machines/game.ts](../../machines/game.ts),
  [src/machines/parts/season-start.ts](../../machines/parts/season-start.ts).
- **MHM 97-era readiness/joboffer events deleted.** The four
  integer-delta readiness events (`simonovSuccess`, `allgoSuccess`,
  `strategySuccess`, `strategyFailure`) and the two MHM 97 job-offer
  events (`jobofferPHL`, `jobofferDivision`) were removed wholesale —
  wrong scale for the new multiplier semantics, and MHM 2000's job-offer
  flow is structurally different anyway. The `incrementReadiness` /
  `setReadiness` `EventEffect` cases came out with them; the only path
  that still touches `team.readiness` is the per-round drift in
  `executeCalculations`. Roll-table ids 110/137/168/262 (readiness) and
  43/111/138/301 (job offers) now silently no-op like other unported ids.
- **Still TODO:** none for the season-arc readiness arc itself — the
  AI `mahd()` strength-rank distribution at
  [MHM2K.BAS:2470-2503](../MHM2K.BAS) is now ported in
  [src/services/strategy.ts](../../services/strategy.ts), wired in
  [src/machines/parts/season-start.ts](../../machines/parts/season-start.ts),
  and covered by 50 parity tests in
  [src/services/strategy.test.ts](../../services/strategy.test.ts).
  Per-team `proxy(4)` (mean of goalie/defence/attack ratios vs the
  competition's AI-only averages) selects one of 8 weighted bands;
  `strategy:*` manager tags short-circuit the lottery (Simonov, Pasolini-
  proxied light teams, … — same hook as the QB `IF man = 33` override).
  `proxy(1..3)` are computed in QB but never read after `proxy(4)` is
  derived — we mirror the QB by exposing `proxy(4)` only.
  - **`Per von Bachman` is NOT hard-coded** to KAIKKI PELIIN! despite
    being name-checked in the strategy help text (`DATA/X.MHM`). His
    "putoajaksi tuomitun ryhmänsä" lore lives in flavor text only —
    the simulator rolls him through `mahd()` like any other AI. Only
    Simonov gets a real override (`IF man = 33` at MHM2K.BAS:2493 /
    ILEZ5.BAS:2026).
  - **Strategy descriptions** are now ported verbatim from `DATA/X.MHM`
    (cp850 → UTF-8, `$j…$b` and `$n…$b` → Markdown `**bold**`). See
    [DATA-FILES.md](DATA-FILES.md) for the canonical token-rewrite
    table.

### End-of-season port progress

Two `ILEZ5.BAS` SUBs are now decoded, ported, and pinned by parity
tests:

- **`SUB omasopimus` (`ILEZ5.BAS:1133`)** — manager-strength score
  `sin1`, threshold `a`, and the team-grid gate
  `(sed+sedd+seddd)/3 >= a`. Ported as `computeManagerStrength` /
  `sin1ToThreshold` / `isTeamSelectable` in
  [src/machines/new-game.ts](../../machines/new-game.ts). Used by both
  the new-game wizard team picker (`MHM2K.BAS:1842`) and contract
  negotiation. **Surprising verbatim quirk:** strong managers (low `a`)
  do _not_ unlock the literal #1 team — the gate is `>= a`, so for
  `a = 3` the top 1-2 teams stay locked. Only `a = 1` (sin1 ≥ 501)
  fully opens the pyramid. The two intentional `a = 0` SELECT-CASE
  gaps (sin1 ∈ {19, 20} and {111…120}) trivially pass everything.
  Pinned by 52 tests in
  [src/machines/new-game.test.ts](../../machines/new-game.test.ts).
- **`SUB tasomuut` (`ILEZ5.BAS:1832`)** — AI team-strength
  recalculation. Ported as `runTasomuut` in
  [src/machines/end-of-season.ts](../../machines/end-of-season.ts);
  wired into `runSeasonEnd` after the promotion/relegation block.
  All three direction paths (same-tier ladder, relegated bump,
  promoted cap-and-roll) plus negotiation jitter and the tiny-arena
  cap covered by 92 tests in
  [src/machines/end-of-season.test.ts](../../machines/end-of-season.test.ts).
  **Skill is signed -3..+3** — `mtaito(3, man)` in QB is bounded to
  `-3..+3` by the wizard at `MHM2K.BAS:1535/1539` and rendered with
  a sign branch at `ILES5.BAS:741`; our `manager.attributes.negotiation`
  stores the same signed value verbatim, so jitter math passes it
  through unchanged. (No `+4` shift — a previous draft of this port
  had one based on a misreading; corrected.)
- **TODO: `SUB managerisiirrot` (`ILEZ5.BAS:940`)** — AI manager
  shuffle. Must run **before** `runTasomuut` to honour the QB call
  order so jitter uses the _incoming_ manager's NEUVOKKUUS. Currently
  un-ported; placeholder TODO at the `runTasomuut` call site.

## Sub-decode docs

- [MHM2K-FLOW.md](MHM2K-FLOW.md) — `MHM2K.BAS` end-to-end: title
  splash, 8-slot menu, new-game wizard (`alku` / `alku2`),
  world-generation pipeline (`oppnas2` → `vihat`), save-file layout,
  XState mapping cheat sheet. **Required reading before touching the
  new-game flow.**

## What we already know (verified)

### The player market is an illusion

The single most important thing to understand before touching players or transfers:

- **Only human team players are real.** `pel(1..32, 1..plkm)` holds actual `pelaaja` records — only for human-controlled teams.
- **AI team "players" are display ghosts.** At game start, `TAHDET.M2K` seeds notable players per team (`MHM2K.BAS:2308-2332`). For AI teams (`ohj(team) = 0`) these go into `top()` (the `topp` TYPE — name, gls, ass, age, nat — display only). For human teams they go into real `pel()` slots via `etsipel`. `top()` is what gets shown in standings/leaderboards for AI teams. No full `pelaaja` record is ever created for them.
- **Free agents in `bel(1..lastbors)`** are players that left a human team. They may linger in the market UI but if "picked up" by an AI team they simply vanish — the AI team doesn't store them anywhere, they're gone.
- **NHL / abroad = gone forever.** No return path. Player ceases to exist.
- **When an AI team becomes human-controlled**, real `pelaaja` records are synthesised (presumably from the `top()` stub data). Only then do they gain real attributes.
- `borsgene` (`ILEX5.BAS:1061`) generates fresh market entries to fill `bel` up to index 440 — these are the procedurally-generated free agents that provide market activity.
- **SAVETUS6.XXX** = persisted `top()` array (AI star scoring display).

**Porting implication:** AI teams have no real roster. Don't model them as having `Player[]`. The scoring display reads from `top()`, not from player records.

### Architecture

- **3 CHAINed programs** share `COMMON SHARED` globals via `MHM2K.BI`:
  - `MHM2K.BAS` — entry / menu / new-game wizard
  - `ILEX5.BAS` — main loop, ~8967 lines, ~120 SUBs
  - `ILEZ5.BAS` — between-seasons (transfers, awards), ~30 SUBs
  - `ILES5.BAS` — utilities (stats viewer + arena renovate), ~16 SUBs
- `chainahdus` = return-tag (1 = stats, 2 = arena renovate).
- `ensintoinen = 0` = "we got here without going through mhm2k first" → bail to mhm2k.
- Modern equivalent: a single `gameMachine.context` with three top-level states sharing one shape.

### Source classification

- 35 `.BAS` files total in `src/mhm2000-qb/`:
  - **24 tokenized** (QB45 binary, magic `0xFC 00 01 00`) — editors and tooling. Don't decode unless we need to.
  - **11 plain ASCII** — the actual simulation. All readable.
  - **9 of those are empty stubs.**
- DRM: `pirtar1..7` are obfuscated checksums. **Will not port.**

### Data files (`src/mhm2000-qb/DATA/`)

Full inventory in [DATA-FILES.md](DATA-FILES.md). Highlights:

- **`.MHM`** = 500-byte fixed random-access records, **cp850** encoded,
  space-padded. **27 files, 1539 records, ~750 KB of Finnish prose.**
  - Inline format tokens: `$b` (body/reset), `$j` (name), `$n` (emphasis),
    `$f` (dramatic/money), `$o` (single-letter highlight), `$h` (header),
    rare `$d`. ❓ TODO confirm exact COLOR codes.
  - Inline placeholders: `@0..@6`. `@4` = money, `@5` = number, `@6` =
    manager name. Possibly a second `£N` syntax for substitutions inside
    a colored span (saw `$j£2$b` in `N.MHM`). ❓ TODO confirm.
  - **Yes/no choice events** use parallel `KYLLA.MHM` + `EI.MHM`
    (30 records each, same index → paired flavor text).
  - **Lentti Pindegren** lives in `S1..S5.MHM` + `GA.MHM` (456 records of
    studio commentary). Sacred. Port verbatim.
- **`.MHX`** = 17 files, one per nation. Plain ASCII quoted surnames.
  `1.MHX` = Finnish (636), `2.MHX` = Swedish (344), `17.MHX` = Polish (100).
  File index = nation id (cross-ref `KANSAT.M2K`).
- **`KIERO.M2K`** = the calendar. **99 rounds × 3 cols** (`phase_id, flag,
param`). MHM 2000 expanded MHM 97's 75-round calendar.
- **`KARSA.M2K`** = lineup slot mask → `dad(1..5, 1..6)` = 5 positions ×
  6 line configurations (1 = slot required). File cols ordered
  `[3, 4, 5, 1, 2]`. Used by auto-line-assigner.
- **börssi ≠ stock market.** It's the **player market** (free agents /
  transfers). `borzzi` TYPE = market entry. Runtime players also stored
  in a random-access file like a database. ❓ TODO find that filename
  (probably written next to save, not in `DATA/`).

### Naming patterns

- Suffix `*maar` = `määritä` (init/setup)
- Suffix `*lisa` = bonus/multiplier
- Prefix `e*` = EHL version of something
- Prefix `p*` = playoff version
- `cup`, `tur`, `mm` = cup/tournament/world-championship
- Variable hall of fame: `dad()`, `qwe`, `zz`, `cupex`, `haikka`,
  `chainahdus`, `ensintoinen`, `borzzi`, `tazzo`, `montx`. They mean
  what they mean. Don't rename in QB; we'll rename in the port.

## Open mysteries (TODO, in rough priority)

### High value — unblocks porting

1. **`sattuma` SUB** in `ILEX5.BAS:5527` — the main random-event roller.
   Decoding this maps E.MHM record indices to event triggers (which
   record fires under which condition).
2. **`ottpel` / `ottul` SUBs** — gameday simulation core. Untangling
   these gives us the match engine.
   _(`ottpel` ported managed-base-team subset — see Phase 2 progress.
   `ottul` still pending; check post-match logic for tournament path.)_
3. **Runtime player random-access DB filename** — created on new game.
4. **`borzzi` field meanings**: `na` (name, 13 chars, confirmed),
   `ma` ❓, `sy` ❓, `pi` ❓, `jo` ❓, `ka` ❓.

### Medium — fills out the data layer

5. **`KIERO.M2K` phase_id values** — the 99-row calendar. What does
   `99,1,4` vs `4,1,1` vs `47,0,2` mean? Need to find the `kierokset`
   reader and decode each phase id.
6. **`.PLX` files** (`ELT.PLX`, `JT1..JT10.PLX`) — likely 10 invitation
   tournaments + an "elite" definition. Need to peek.
7. **`.MHZ` files** (3: `LAKKO.MHZ`, `MONTY.MHZ`, `P.MHZ`) — strike +
   `montx` records?
8. **Remaining `.M2K` files** still ❓: `STVARI`, `PEPDEP`,
   `MUUDIT`, `MUUTOS`, `ORGASM`, `PELKIEL`,
   `TAHDET`. (Decoded so far: `KANSAT`, `MANAGERS`, `KEISIT`,
   `MATERIA`, `MATERIAX`, `TASOT`, `DATAX`, `KARSA`, `KIERO` outline.)
9. **`TEAMS.{ALA,FOR,NHL,PLN}`** — extension naming. Best guesses in
   [DATA-FILES.md](DATA-FILES.md).

### Lower priority — fill at leisure

10. User to fill `❓ TODO` markers across [VARIABLES.md](VARIABLES.md),
    [SUBS.md](SUBS.md), [GLOSSARY.md](GLOSSARY.md) as time permits.
    Either inline or just tell me in chat and I'll update.

## Recommended next session order

1. Decode `sattuma` → unlock event-system porting.
2. Decode `ottpel` → unlock gameday porting.
3. Build a TS `GameContext` shape that maps the QB globals (use
   [VARIABLES.md](VARIABLES.md) as the source of truth).
4. Port the simplest event first (`KONKKA.MHM` bankruptcy escalation
   has only 5 stages and is purely deterministic) as the
   port-pipeline shakedown.
5. From there, iterate: declarative event registry, prank registry,
   per-competition extension methods, calendar driver — all the
   patterns already exist in the inherited codebase.

## Vibe / collaboration notes

- User loves the Finnish-legacy spelunking. Conversational pace,
  liberal humor welcome.
- Pier Paolo Pasolini = preferred mock-data subject.
- Lentti Pindegren = the legendary in-game anchor, port with reverence.
- "VAPPU" = Finnish May Day = long weekend = more archaeology time.
- Don't auto-port without understanding. Decode-then-port.
- `pnpm` only. Never `npm` / `npx`.

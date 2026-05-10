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

### Injury catalog decoded (DONE 2026-05-07)

All 45 injury records decoded from `I.MHM` (cp850) + `INJURIES.M2K` severity table and ported to [src/data/injuries.ts](../../data/injuries.ts) as a `readonly InjuryDefinition[]` array. Key findings:

- Natural post-match roll `INT(44*RND)+1` reaches ids **1..44** only.
- **Id 44** ("gangsters") — forced by prank #5 PELAAJAN HOITELU victim-side (`SUB jaynacheck` block 2, `ILEX5.BAS:2199`).
- **Id 45** ("kolossimainen poliisi") — forced by POLIISI enforcer (`spe=666`) victim-side (`SUB jaynacheck` block 3, `ILEX5.BAS:2209`). Unreachable from natural roll.
- **Ids 46–47** — empty trailing slots in I.MHM, no severity rows; dead data.
- `-1` duration = season-ending (ids 41/42/43 always; id 18 at budget 1–2).
- JAYNAT.M2K 7-prank list + costs fully confirmed (see DATA-FILES.md).
- `SUB muilutus` (`ILEX5.BAS:3365`) = CPU-path resolver applying `tauti/tkest` team debuff; human path uses `SUB jaynacheck` blocks 2–3 instead.

### Player generation port (DONE 2026-05-07)

`borsgene` + `gene` + `rela` + `mahmax` fully ported and wired into `composeNewGameContext`.

- **`borsgene`** (`ILEX5.BAS:1061`) → [src/services/mhm-2000/generate-market-players.ts](../../services/mhm-2000/generate-market-players.ts).
  Generates 440 `MarketPlayer` records using the KEISIT/BORSSIX nation+skill tables. Specialty rolls (greedySurfer > enforcer > foulMouth > evangelist) only when `psk > 6`. `askingSalary = psk * 1000` placeholder (real salary comes when contract system ports).
- **`gene`** (`MHM2K.BAS:1026`) → [src/services/mhm-2000/generate-team-roster.ts](../../services/mhm-2000/generate-team-roster.ts).
  Generates 24-player human team roster from `TeamStrength`. Slot layout (g/g/d×6/lw×4/c×4/rw×4/bench×4), balance passes to hit pw/hw totals, then redistribution shuffles to add intra-group variety. Specialties NOT assigned here (QB gene skips spe).
- **`rela`** (`ILEX5.BAS:5228`) + **`mahmax`** (`MHM2K.BAS:1548`) → [src/services/mhm-2000/generate-player.ts](../../services/mhm-2000/generate-player.ts).
  Rolls position/age/ego from uniform keisit index; leadership/charisma from triangular double-roll `floor((r+r)/2)`; yvo/avo independently from keisit[6]; name from nation's .MHX surname pool + Pekkalandian/foreign initial pool.
- **Data tables** → [src/data/keisit.ts](../../data/keisit.ts) (7×100), [src/data/borssix.ts](../../data/borssix.ts) (17×9, all rows sum to 200).
- **Wiring** → `composeNewGameContext` (`compose-new-game.ts`) now calls `generateMarketPlayers(440)` and converts each human-picked `AITeam` → `HumanTeam` with a generated roster. `HumanTeam` now carries `strengthObj` (needed by `orgamaar` when it ports).
- **Bug found:** QB `gene`'s redistribution loop hangs if all defenders/forwards have `psk=1` (minimum-strength teams). Added `any(s > 1)` guard — faithful to QB's implicit assumption; the real game never hit this case.
- **RND() → random-js verified:** all QB `INT(N*RND)` patterns confirmed; the triangular double-roll `INT(((100*RND)+(100*RND))/2)` → `Math.floor((r(0,99)+r(0,99))/2)` same range and shape. Full mapping table in the test files.
- 27 test files, 502 tests passing.

### Tauti / epidemic system decoded (2026-06-11)

Full two-layer team debuff system documented in [TAUTI.md](TAUTI.md):

- **Layer 1:** `tauti(1..3)` + `tkest(1..3)` — AI-only per-stat (goalie/defence/attack) debuffs, additive to `ode(d)`.
- **Layer 2:** `tautip` + `tautik` — per-team multiplicative match-strength modifier (0.75–1.1), affects AI and human teams.
- Writers: `sattuma` cases 29-30/50-51 (human), `uutisia` case pool (AI), `muilutus` prank (AI).
- Countdown per round, season reset in `topmaar`.
- TS TODO: wire `tautip` placeholder in `simulate-match.ts` + add `tauti` stat debuffs.

**Still on the Phase-2 punch list:** `tautip` / `tauti` epidemic port,
`spx(3/4)` consumables, `pel(*).spe`
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

### Lineup & strength calculation decoded (2026-05-08)

Full decode of `SUB voimamaar`, `SUB automa`, `SUB ketjuchk`,
`SUB ketlaita`, `SUB kc`, `SUB pisteet`, and `KARSA.M2K`. Documented
in new [LINEUPS.md](LINEUPS.md). Key findings:

- **`ketju(1..5, 1..6, plkm)`** = 3D lineup array: position-slot ×
  unit × manager. Units 1–3 = regular (3 D pairs + 3 forward lines),
  4 = forward line 4 (no 4th D pair), 5 = PP (5 skaters), 6 = PK
  (4 skaters: 2D + 2F, no RW slot).
- **PK forward slots are position-generic** (`xxx=6` in `zzra`):
  any LW/C/RW contributes at full strength. Confirmed by QB code —
  only goalies/defensemen get the ×0.7 out-of-position penalty.
  TS type uses `f1`/`f2` (not `lw`/`c`).
- **PP forward slots ARE position-specific** (`xxx=3/4/5`): wrong
  forward type gets −1, defenseman in forward slot gets ×0.7.
- **`zzra` per-player evaluation**: `temp = psk + plus + erik(3)`,
  add `yvo`/`avo` for PP/PK, then position penalty, `spe=8`
  (greedySurfer) penalty ×0.7, condition penalty (×0.9..×0.3),
  floor at 0.
- **`ket` rule**: max 2 lineup units per player (regular + special).
  `SUB kc` only counts units 1–4 (regular), not PP/PK units 5/6.
- **`yvpelaa`/`avpelaa` fallback**: PP/PK fall back to unit 1 if
  the dedicated unit is incomplete.
- **`SUB pisteet`**: goal-scorer attribution uses weighted random
  (`hketju^2.5` for forward lines, `pketju^2` for D pairs). PP goals
  attribute from the PP unit directly.
- **TS `Lineup` type validated** against QB. No changes needed.
- All existing \_NOTES docs updated with decoded lineup details.

### Auto-lineup builder ported (2026-05-08)

`SUB automa` (ILEX5.BAS:822-920) ported as `autoLineup()` in
`src/services/lineup.ts`. Pure function: `(players, mode?) → Lineup`.

- Two modes: `"gameday"` (default, filters injured/suspended/striking/
  absent/overtired) and `"potential"` (uses all players regardless).
  No separate "potential" routine exists in the QB source — verified
  by full grep.
- Three sorting pools (regular/PP/PK) match QB `verrokki` exactly.
- `spe=4` (`extremelyFat`) gets sort value 99 in regular pool —
  the **Läski-Salonen clause** guaranteeing the fat supergoalie
  always auto-slots to starter.

**Lesson learned:** `spe=4` was initially misidentified as `enforcer`
(which is `spe=5`). The specialty array is 0-indexed and the English
names don't match QB's integer ordering intuitively. Full mapping
table now in GLOSSARY.md "Specialty index off-by-one trap" section.
Always cross-reference against `playerSpecialtyByLegacyIndex` in
`src/data/player-specialties.ts`.

### Strength pipeline ported (2026-05-08)

The full `zzra` per-player strength evaluation (ILEX5.BAS:8545-8570)
ported as composable pure functions in `src/services/lineup.ts`:

- `applyPositionPenalty(position, slot, base)` — FIX (trunc)
- `applySpecialtyPenalty(specialty, value)` — CINT (round), greedySurfer only
- `applyConditionPenalty(condition, value)` — FIX (trunc)
- `floorStrength(value)` — min 1 (**gameplay deviation**: QB floors at 0)
- `effectiveStrength(base, position, slot, specialty, condition)` — composed in QB order

**Gameplay deviation: goalie↔skater cross-assignment.** QB hard-locks
goalies to the goalie slot. We allow any player in any slot — goalie
skating out or skater in goal resolves to `MIN_EFFECTIVE_STRENGTH` (1).
See [DEVIATIONS.md](DEVIATIONS.md) §1.

**Gameplay deviation: floor at 1.** QB floors at 0; we floor at 1.
The worst possible warm body on the ice is still _a_ body on the ice.
See [DEVIATIONS.md](DEVIATIONS.md) §2.

**CINT vs FIX is load-bearing.** Specialty penalty uses `Math.round`
(QB CINT), all others use `Math.trunc` (QB FIX). The difference
matters at boundary values (e.g. `0.7 * 15 = 10.5` → round=11, trunc=10).

Also ported: `performanceModifier(player)` (sums active skill effects =
QB `plus`), `isAvailable(player)` (availability gate = QB `inj=0 AND
svu>0 AND kun>=0`).

### Lineup UI — Radix Select + full wiring (2026-05-09)

Interactive lineup management using `@radix-ui/react-select`. Each
dropdown sorts players by **effective strength for that specific slot**,
so a center shows highest in the C dropdown and lower in the LW
dropdown (with the −1 penalty reflected).

- **`PlayerSelect`** (`src/components/lineup/PlayerSelect.tsx`) —
  Radix Select with structured layout: position tag (bold) + player
  name + skill value + Badge (lineup appearances). Sentinel `"__none__"`
  for clearing a slot. Excluded players shown as disabled items.
- **Slot threading:** `GoalieView` → `target={ unit: "g" }`,
  `DefencivePairingView` → `target={ unit: "d", index, side }`,
  `ForwardLineView` → `target={ unit: "f", index, position }`.
- **PP/PK views:** `PowerPlayView` (5 slots) and `PenaltyKillView`
  (4 slots: 2D + 2F, no RW) fully rendered in the Lineup page.
- **`ASSIGN_PLAYER_TO_LINEUP` machine event:** wired in `gameMachine`,
  calls `assignPlayerToLineup()` with full guards (ket < 2, excluded
  players, goalie lock, same-unit conflicts).
- **`excludedPlayers(lineup, target)`** — returns `Set<string>` of
  player IDs that can't be assigned to a given slot. Three rules:
  goalie lock, same-pairing LD/RD conflict, same-line/unit conflict.
- **`lineupAppearances(lineup)`** — port of QB `SUB kc`. Counts
  regular-line slots per player (units 1–4 + goalie). PP/PK excluded.
  Drives Badge display and ket < 2 guard.
- **Badge component** (`src/components/ui/Badge.tsx`) — pill badge
  with AlertLevel colors for lineup appearance counts.
- **csstype patch:** `appearance: "base-select"` not in csstype's
  `Property.Appearance` type alias — patched via `pnpm patch`
  (`patches/csstype@3.2.3.patch`).

### Human team strength calculation (2026-05-09)

`calculateStrength()` in `src/services/team.ts` no longer returns a
mock `rollTeamStrength()` for human teams. It now calls
`calculateLineupStrength(lineup, players)` — a faithful port of the
base-stat portion of `SUB voimamaar` (ILEX5.BAS:8429-8490).

- **`calculateLineupStrength(lineup, players)`** in
  `src/services/lineup.ts`: walks goalie slot, 3 defensive pairings,
  and all 4 forward lines through the `effectiveStrength` pipeline.
  Returns `{ goalie, defence, attack }`.
- **Incomplete units contribute 0** — matches QB's `htarko`/`ptarko`
  completeness flags. A pair needs both LD+RD, a line needs all 3
  (LW+C+RW).
- **`calculateYw(team, manager)` / `calculateAw(team, manager)`** —
  PP/PK weights abstracted for both AI and human teams. Currently
  uses the approximation formula `(hw/3.3 + pw/2.5) × specialTeamsMult`
  for both. Match engine (`prepareSide`) now calls these instead of
  inlining the formula.
- **`playerBaseValue(player)`** = `skill + performanceModifier(player)`.
  TODO: add `erik(3)` team investment bonus when erikoistoimet ports.
  See [DOPING.md](../_NOTES/DOPING.md) for the full dual-path analysis
  (human teams via `zzra`, AI teams via `ottpel` league-gated addition).
- **TODO: human PP/PK from actual lineup slots.** QB `voimamaar`
  computes `yw`/`aw` from the dedicated PP/PK units with per-player
  `yvo`/`avo` bonuses + `mtaito(2)` multiplier. Currently deferred —
  both team kinds use the base-stat approximation.

### Willful deviations log started (2026-05-09)

New [DEVIATIONS.md](DEVIATIONS.md) tracks intentional gameplay
divergences from the QB original. Currently documents:

1. Goalie↔skater cross-assignment (QB: hard-locked; us: catastrophic penalty → 1)
2. Effective strength floor 0 → 1 (revisit risk: medium)

### Game machine wiring (2026-05-08)

- `AUTO_LINEUP` event + `executeAutoLineup` action added to
  `gameMachine`. Calls `autoLineup(values(team.players))` via
  `assign` + `produce`.
- `HumanTeam.players` type fixed: `Record<string, Player>` →
  `Record<string, HiredPlayer>` (a team roster can't hold market players).
- Skeleton pages: `/pelaajat` (Pelaajat) and `/kokoonpano` (Kokoonpano)
  routed in `Game.tsx`.
- `src/machines/commands.ts` deleted (dead code, zero imports).

### Performance modifiers decoded (2026-05-09)

Full archaeology of `pel.plus` / `pel.kest` — the transient per-player
skill modifier system. QB stores a **single `plus`/`kest` pair** per
player (TS models this as multiple effects via `PlayerEffect[]`).

**Assignment sites** (5 SET + 2 RESET + 1 DECREMENT):

| Site                 | File:Lines      | SUB             | plus           | kest                                   | Trigger         |
| -------------------- | --------------- | --------------- | -------------- | -------------------------------------- | --------------- |
| Mood events          | ILEX5:1275-1276 | `dap` CASE 3    | `mood(muud,1)` | `INT(mood(muud,3)*RND)+mood(muud,2)+1` | Random event    |
| B-tournament accept  | ILEX5:3269-3270 | `mmkisaalku`    | `1`            | `INT(10*RND)+10`                       | Player released |
| B-tournament decline | ILEX5:3274-3275 | `mmkisaalku`    | `INT(3*RND)-3` | `INT(10*RND)+10`                       | Player blocked  |
| Contract accept      | ILEX5:5894      | `rstages` 68/69 | `1`            | `1000`                                 | Happy re-sign   |
| Contract forced      | ILEX5:5894      | `rstages` 68/69 | `-2`           | `1000`                                 | Forced re-sign  |
| Countdown            | ILEX5:1842-1843 | (per-turn)      | _cleared→0_    | `kest-1`                               | Every turn      |
| Season reset         | ILEX5:7740-7741 | `suunnitelma`   | `0`            | `0`                                    | Season rollover |
| Bench reset          | ILEZ5:226-227   | (bench init)    | `0`            | `0`                                    | Bench rebuild   |

**Key design facts:**

- **No stacking** — each assignment overwrites the previous `plus`/`kest`.
  TS allows multiple via effects array but should maintain the "one skill
  modifier at a time" convention at the call site.
- **Countdown is automatic** — every turn, `kest` decrements; when it
  hits 0, `plus` auto-clears.
- **`kest=1000`** = effectively permanent (contract events). Only
  season rollover wipes it.
- **CCCP tablet** (`xavier` CASE 1) does NOT use `plus`/`kest` — it
  directly modifies `psk` (+1 or +2, 50% chance, capped at 20).

**Mood events** — the main data-driven source:

- 45 definitions from `MUUDIT.M2K` (amount/durationBase/durationRange)
  - `M.MHM` (cp850 narrative text).
- Selection: `muud = INT(45*RND)+1` — uniform random pick.
- Guard: `lukka=0 AND psk+amount > 0` — modifier must not reduce skill
  to zero or below.
- Duration formula: `INT(durationRange * RND) + durationBase + 1`.
- Extracted to [src/data/performance-modifier.ts](../../data/performance-modifier.ts)
  as `MoodDefinition[]` (45 entries).
- Amount range: −5 to +14 (!!). Row 24 (metallilevy/säteily) is the
  outlier at +14 with only 1–5 turn duration.

**Non-mood sources** don't form a data table — their parameters are
inline in the event logic (B-tournament: `mmkisaalku`, contract:
`rstages` CASE 68/69). Will be implemented as hardcoded params in
the respective `DeclarativeEvent.resolve` functions.

### Bans (pelikielto) decoded (2026-05-09)

Full archaeology of the ban/suspension system. QB uses `pel.inj` with a
sentinel range `1001..1999` (ban duration encoded as `1000 + rounds`).

**Data sources:**

- `PELKIEL.M2K` — 18 static durations (1–15 rounds).
- `PK.MHM` — 18 narrative texts (cp850 → UTF-8), 500-byte records.

**Assignment via `dap` CASE 2** (ILEX5.BAS:1262-1266):
`gnome = pelki(lukka)` → `pel(xx,pv).inj = gnome + 1000`

**Countdown** (ILEX5.BAS:3804-3806): per turn `inj -= 1`;
when `inj = 1000` → clears to 0.

**Triggers:**

| Code range | Trigger                                     | Source          |
| ---------- | ------------------------------------------- | --------------- |
| 1–16       | Post-match random roll (5% chance, uniform) | ILEX5:5649-5650 |
| 17         | POLIISI prank enforcer (spe=666, always)    | ILEX5:2183-2186 |
| 18         | Aggressive specialty (spe=2) + captain, 2%  | ILEX5:2190      |

**Key design facts:**

- **Durations are static** — no random range, just a per-code lookup.
  Unlike mood events (which randomize duration).
- **Uses the `inj` field** — NOT a separate field. Same field as
  injuries, strikes, and national-team absence, disambiguated by
  sentinel ranges.
- `pot` in the player struct is **games played**, not bans.
- Code 12 (attacked opponent's manager, 15 rounds) and code 15
  (beat up a junior player, 13 rounds) are the longest.
- Extracted to [src/data/bans.ts](../../data/bans.ts)
  as `BanDefinition[]` (18 entries).

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
- [SPONSORS.md](SPONSORS.md) — `SUB sponsorit` + `SUB annarahaa` +
  `SUB sporvagen` end-to-end: preseason 3-candidate negotiation, 4
  goal categories (PHL / DIV-MUT / CUP / EHL), 20 payout slots, base
  offer formula, NEUVOTTELE roll mechanics, the "two-walked
  lockout", every payout trigger site, CPU-team open question.

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

1. ~~**`sattuma` SUB** in `ILEX5.BAS:5527` — the main random-event roller.~~
   **DECODED 2026-05-10.** Full archaeology in
   [RANDOM-EVENTS.md](RANDOM-EVENTS.md): all 5 layers (KONKKA banner,
   sopupeli detection, TV bonus, `dap` post-match trinity, `dat%`
   pool of ~70 cases out of a 1..521 roll), every event-effect kind
   catalogued and mapped against the existing `EventEffect` union,
   data files involved, MHM record references, archetype mapping,
   and a recommended port order. Open follow-ups now live there.
2. **`ottpel` / `ottul` SUBs** — gameday simulation core. Untangling
   these gives us the match engine.
   _(`ottpel` ported managed-base-team subset — see Phase 2 progress.
   `ottul` still pending; check post-match logic for tournament path.)_
3. **Runtime player random-access DB filename** — created on new game.
4. ~~**`borzzi` field meanings**~~ **RESOLVED** — `borzzi` is NOT a player-market
   entry. It's the **scoring leaderboard** (`ppors()`/`rekord()`/`pvoittaja()` arrays).
   Fields: `na`=name (13 chars), `ma`=goals (`maalit`), `sy`=assists (`syötöt`),
   `pi`=points (`pisteet` = ma+sy), `jo`=team index (`joukkue`), `ka`=nationality
   (`kansallisuus`). Filled from `ILEX5.BAS:4505-4510`. See VARIABLES.md `ppors`/`rekord`
   rows for the full decode. `MarketPlayer` type is `Omit<Player, "contract"|"plannedDeparture"> & { askingSalary }`.

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
   ~~`TAHDET`~~ (decoded — see player-market section). (Decoded so far: `KANSAT`, `MANAGERS`, `KEISIT`,
   `MATERIA`, `MATERIAX`, `TASOT`, `DATAX`, `KARSA`, `KIERO` outline.)
9. **`TEAMS.{ALA,FOR,NHL,PLN}`** — extension naming. Best guesses in
   [DATA-FILES.md](DATA-FILES.md).

### Lower priority — fill at leisure

10. User to fill `❓ TODO` markers across [VARIABLES.md](VARIABLES.md),
    [SUBS.md](SUBS.md), [GLOSSARY.md](GLOSSARY.md) as time permits.
    Either inline or just tell me in chat and I'll update.

## Recommended next session order

1. **Contract negotiations state machine** — `sopimusext` SUB
   (`ILEZ5.BAS`) drives the end-of-season player negotiation loop.
   `omasopimus` (manager strength → team selectability gate) is
   already ported. Contracts use `RegularContract` / `GuestContract`
   shapes in [src/state/player.ts](../../state/player.ts); the
   `specialClause` (NHL/free-fire) decode is documented there.
   Player salaries are placeholder (`psk*1000`) — the real salary
   curve from `sopimusext` will replace them.
2. ~~Decode `sattuma` → unlock event-system porting.~~ **DONE.** See
   [RANDOM-EVENTS.md](RANDOM-EVENTS.md). Next is to extract E.MHM and
   V.MHM to raw JSON and start extending the `EventEffect` union with
   the NEW kinds catalogued in §7 of that doc.
3. Port `orgamaar` — human team strength recalculation from actual
   player roster (`mw = max(pel(*).psk)` for goalies, `pw/hw` from
   sums). `HumanTeam.strengthObj` is now wired and ready.
4. Port the simplest event (`KONKKA.MHM` bankruptcy escalation) as
   the event-pipeline shakedown.
5. From there: declarative event registry, prank registry,
   per-competition extension methods, calendar driver.

## Vibe / collaboration notes

- User loves the Finnish-legacy spelunking. Conversational pace,
  liberal humor welcome.
- Pier Paolo Pasolini = preferred mock-data subject.
- Lentti Pindegren = the legendary in-game anchor, port with reverence.
- "VAPPU" = Finnish May Day = long weekend = more archaeology time.
- Don't auto-port without understanding. Decode-then-port.
- `pnpm` only. Never `npm` / `npx`.

# Lineups & Strength Calculation

Decoded from `SUB voimamaar` ([ILEX5.BAS:8430–8570](../ILEX5.BAS)),
`SUB automa` ([ILEX5.BAS:822–920](../ILEX5.BAS)),
`SUB ketlaita` ([ILEX5.BAS:2639–2710](../ILEX5.BAS)),
`SUB kc` ([ILEX5.BAS:2559–2572](../ILEX5.BAS)),
`SUB ketjuchk` ([ILEX5.BAS:2571–2615](../ILEX5.BAS)),
and the slot template `KARSA.M2K`.

---

## The `ketju()` Array

```
DIM ketju(1 TO 5, 1 TO 6, 1 TO plkm) AS INTEGER
```

Three dimensions: **position × unit × manager**.

### Dimension 1 — position slot

| Index | Slot | Player position (`ppp`) |
| ----- | ---- | ----------------------- |
| 1     | LD   | 2 (defenseman)          |
| 2     | RD   | 2 (defenseman)          |
| 3     | LW   | 3 (left wing)           |
| 4     | C    | 4 (center)              |
| 5     | RW   | 5 (right wing)          |

### Dimension 2 — unit

| Index | Unit              | Slots used                       |
| ----- | ----------------- | -------------------------------- |
| 1     | Pair/Line 1       | 2D + 3F                          |
| 2     | Pair/Line 2       | 2D + 3F                          |
| 3     | Pair/Line 3       | 2D + 3F                          |
| 4     | Line 4            | 3F only (no 4th defense pair)    |
| 5     | Power play (PP)   | 2D + 3F = 5 skaters              |
| 6     | Penalty kill (PK) | 2D + 2F = 4 skaters (no RW slot) |

### Goalie

```
DIM maa(1 TO 1, 1 TO plkm) AS INTEGER
```

Single slot per manager. Not part of `ketju()`.

### Total active roster: 20 players

1 goalie + 6 defensemen (3 pairs) + 12 forwards (4 lines) + PP/PK
drawn from the same 18 skaters (overlap allowed, see **ket rule**
below).

---

## Slot Template: `KARSA.M2K`

Loaded via `INPUT #1, dad(3, zz), dad(4, zz), dad(5, zz), dad(1, zz), dad(2, zz)` for `zz = 1..6`.

Values are 0/1 flags indicating which slots exist per unit:

```
Unit  LW  C   RW  LD  RD   Notes
──────────────────────────────────
1     1   1   1   1   1    Pair 1 + Line 1
2     1   1   1   1   1    Pair 2 + Line 2
3     1   1   1   1   1    Pair 3 + Line 3
4     1   1   1   0   0    Line 4 (forwards only)
5     1   1   1   1   1    PP: all 5 skater positions
6     1   1   0   1   1    PK: 2D + LW + C (NO RW slot)
```

The PK unit has **4 active slots**: LD, RD, and two forward slots
(labeled LW/C in the data, but position-generic in the strength
calculation — see below).

---

## `ket` — Lineup Assignment Count

`SUB kc` counts how many `ketju()` slots + the `maa()` goalie slot
reference each player:

```
pel(xx, pv).ket = (number of ketju slots containing xx) + (1 if maa(1, pv) = xx)
```

- `ket = 0` → bench (not in any lineup slot)
- `ket = 1` → in exactly one unit
- `ket = 2` → in two units (e.g. line 1 + PP — normal and expected)

**Assignment guard** (`SUB ketlaita`): `pel().ket < 2` required to
assign a player to a new slot. So a player can appear in **at most 2
lineup units** (typically one regular + one special teams). A player
already at ket=2 cannot be placed into a third unit.

---

## Auto-Lineup: `SUB automa`

Three sorting pools (`zz = 1, 2, 3`) each rank players per position:

| Pool | Purpose | Sort key                  |
| ---- | ------- | ------------------------- |
| 1    | Regular | `psk + plus` (spe=4 → 99) |
| 2    | PP      | `psk + yvo + plus`        |
| 3    | PK      | `psk + avo + plus`        |

Each pool maintains a ranked list per position (D, LW, C, RW). The
auto-fill then assigns:

- **Regular**: top 6 D → pairs 1–3, top 4 per forward pos → lines 1–4
- **PP** (unit 5): top 2 D by PP key → PP defense, top 1 LW/C/RW by
  PP key → PP forwards
- **PK** (unit 6): top 2 D by PK key → PK defense, top 1 LW/C by PK
  key → PK forwards (no RW slot per `KARSA.M2K`)

The `spe = 4` (`extremelyFat` / ÄÄRIMMÄISEN LIHAVA) players get sort
value 99 in pool 1, guaranteeing top-line ice time regardless of skill.
This is effectively a **Läski-Salonen clause** — the event-spawned
supergoalie always auto-slots to starter.

> **⚠ Off-by-one trap:** `spe = 4` is `extremelyFat`, NOT `enforcer`.
> `enforcer` is `spe = 5`. The QB specialty array is 0-indexed
> (`none=0, evangelist=1, foulMouth=2, uglyAndWeird=3,
extremelyFat=4, enforcer=5, …`). When reading QB code like
> `IF spe = N`, always cross-reference against
> `src/data/player-specialties.ts:playerSpecialtyByLegacyIndex`
> — never guess from the English name.

---

## Lineup Validation: `SUB ketjuchk`

Called after roster changes (trades, injuries, etc.):

1. **Remove injured players** from all lineup slots (goalie +
   `ketju(1..5, 1..6)`). Also clears captain if injured.
2. **Re-sort defensive pairs** by combined skill (strongest pair →
   pair 1). Bubble sort on `pketju`.
3. **Re-sort forward lines** by combined skill (strongest line → line
   1). Bubble sort on `hketju`.
4. **Compute roster averages**: `avg(1) = mean(psk)`, `avg(2) =
mean(age)`, `avg(3) = mean(kar)`.

---

## Strength Calculation: `SUB voimamaar`

Computes five team strength components: `mw`, `pw`, `hw`, `yw`, `aw`.

### Per-Player Effective Value (`zzra` Subroutine)

For each player in a lineup slot:

```
temp = psk + plus + erik(3)
if PP context: temp += yvo
if PK context: temp += avo
```

Then **position penalty** based on `xxx` (the expected position):

| `xxx` | Slot type            | Penalty rule                                                     |
| ----- | -------------------- | ---------------------------------------------------------------- |
| 1     | Goalie               | No penalty check (goalie slot)                                   |
| 2     | Defense (LD/RD)      | If `ppp ≠ 2`: × 0.7                                              |
| 3,4,5 | Forward (LW/C/RW)    | If `ppp = 2` (D in fwd slot): × 0.7. If wrong fwd type: −1       |
| 6     | PK forward (generic) | If `ppp < 3` (goalie/D in fwd slot): × 0.7. **Any fwd type: OK** |

Then **specialty penalty**: `spe = 8` (greedySurfer) → × 0.7.

Then **condition penalty**:

| `kun` | Multiplier |
| ----- | ---------- |
| −1    | × 0.9      |
| −2    | × 0.7      |
| −3    | × 0.5      |
| < −3  | × 0.3      |

Floor: `temp = max(0, temp)`.

### Component Aggregation

**Goalie (`mw`):**

```
mw = zzra(goalie, xxx=1)
```

**Defense (`pw`):**

```
pketju(pair) = sum of zzra(LD, xxx=2) + zzra(RD, xxx=2)
pw = pketju(1) + pketju(2) + pketju(3)
```

Skip any pair that has an empty slot.

**Attack (`hw`):**

```
hketju(line) = sum of zzra(LW, xxx=3) + zzra(C, xxx=4) + zzra(RW, xxx=5)
hw = hketju(1) + hketju(2) + hketju(3) + hketju(4)
```

Skip any line that has an empty slot.

### Power Play (`yw`)

PP reads from unit 5 (dedicated PP team) or falls back to unit 1
(first pair+line):

| State                                     | `yvpelaa` | Behavior         |
| ----------------------------------------- | --------- | ---------------- |
| All 5 PP slots filled                     | 5         | Use unit 5       |
| PP has empty slot, but unit 1 is complete | 1         | Use unit 1 as PP |
| PP has empty slot AND unit 1 incomplete   | 0         | **No PP at all** |

PP strength (5 skaters, `gnome = 1` → adds `yvo`):

```
yw = sum of:
  zzra(slot 1, xxx=2)   — LD
  zzra(slot 2, xxx=2)   — RD
  zzra(slot 3, xxx=3)   — LW (position-specific)
  zzra(slot 4, xxx=4)   — C  (position-specific)
  zzra(slot 5, xxx=5)   — RW (position-specific)
```

### Penalty Kill (`aw`)

PK reads from unit 6 (dedicated PK team) or falls back to unit 1:

| State                                     | `avpelaa` | Behavior         |
| ----------------------------------------- | --------- | ---------------- |
| All 4 PK slots filled                     | 6         | Use unit 6       |
| PK has empty slot, but unit 1 is complete | 1         | Use unit 1 as PK |
| PK has empty slot AND unit 1 incomplete   | 0         | **No PK at all** |

PK strength (4 skaters, `gnome = 2` → adds `avo`):

```
aw = sum of:
  zzra(slot 1, xxx=2)   — LD
  zzra(slot 2, xxx=2)   — RD
  zzra(slot 3, xxx=6)   — forward 1 (POSITION-GENERIC: any fwd OK)
  zzra(slot 4, xxx=6)   — forward 2 (POSITION-GENERIC: any fwd OK)
```

**Key finding:** PK forward slots use `xxx = 6`, which only penalizes
defensemen/goalies (`ppp < 3`). Any forward type (LW, C, RW) contributes
at full strength. This is why the TS type uses generic `f1`/`f2`
instead of position-specific slots.

### Manager Modifier

After both PP/PK sums:

```
yw *= (1 + mtaito(2, manager) × 0.04)
aw *= (1 + mtaito(2, manager) × 0.04)
```

`mtaito(2)` = ERIKOISTILANTEET (special situations), range −3..+3.
Effect: −12% to +12%.

### Variables Feeding Into Match Engine

| Variable   | Finnish name      | Meaning          | Used by `ottpel`     |
| ---------- | ----------------- | ---------------- | -------------------- |
| `mw(team)` | maalivahtivahvuus | Goalie strength  | `ode(1, z) = mw/30`  |
| `pw(team)` | puolustus         | Defense strength | `ode(2, z) = pw/60`  |
| `hw(team)` | hyökkäys          | Attack strength  | `ode(3, z) = hw/120` |
| `yw(team)` | ylivoimavahvuus   | PP strength      | PP goal rolls        |
| `aw(team)` | alivoimavahvuus   | PK strength      | PK defense rolls     |

In the match engine, `ode` components are divided down to probability
scale, then `hw(attacker)` tries to beat `pw(defender) + mw(defender)`.
For special teams, `yw(PP team)` duels `aw(PK team)`.

---

## `erik(3)` — Pekkiini-Douppaus Bonus

The team investment slider "PEKKIINI-DOUPPAUS" (`erik(3, team)`)
adds a flat bonus to every player's strength value in `zzra`. It
also contributes to PP/PK and match engine components:

```
ode(1) += erik(3) × 1    (goalie)
ode(2) += erik(3) × 6    (defense)
ode(3) += erik(3) × 12   (attack)
yw     += erik(3) × 5    (PP)
aw     += erik(3) × 4    (PK)
```

(These additional boosts are applied in `ottpel` at
[ILEX5.BAS:3830–3835](../ILEX5.BAS), NOT in `voimamaar`.)

---

## Scoring Attribution: `SUB pisteet`

When a goal is scored, the engine picks which line/pair gets credit:

**Even strength:** Forward line picked by weighted random
(`hketju(line)^2.5`), defense pair by weighted random
(`pketju(pair)^2`). This means better lines produce more scorers.

> **Design insight:** These nonlinear exponents (`^2.5`, `^2`) are the
> source of the exponential-feeling tier gaps between leagues. The
> TASOT.M2K skill table itself is **perfectly linear** (attack =
> level × 4), but squaring and power-2.5-ing the line strengths means
> small advantages at the top translate to huge outcome differences,
> while bottom-tier teams (mutasarja) are barely distinguishable. This
> is clean separation of concerns: the data layer is simple arithmetic,
> the engine layer applies the game-feel curve.

**Power play:** All 5 PP slots used directly
(`cketju(z) = ketju(z, yvpelaa, ww)`).

**Goal scorer:** 20% chance a defenseman (slot 1–2), 80% chance a
forward (slot 3–5). Assist(s): 0–2 additional players from the same
5-man unit, avoiding the scorer.

---

## Position System

QB has **5 positions** on players (`pel().ppp`):

| `ppp` | Position    | TS value | Count in starter roster |
| ----- | ----------- | -------- | ----------------------- |
| 1     | Goalie (G)  | `"g"`    | 2                       |
| 2     | Defense (D) | `"d"`    | 7 (6 + 1 bench)         |
| 3     | Left Wing   | `"lw"`   | 5 (4 + 1 bench)         |
| 4     | Center      | `"c"`    | 5 (4 + 1 bench)         |
| 5     | Right Wing  | `"rw"`   | 5 (4 + 1 bench)         |

**No LD/RD split.** All defensemen are `ppp = 2`. The LD/RD naming in
lineup slots is purely positional (first/second in pair), not a player
attribute. Both slots apply the same strength formula (`xxx = 2`).

Players can be placed in off-position slots with penalties (see
position penalty table above). A defenseman in a forward slot gets
×0.7. A forward in a defense slot gets ×0.7. A forward in a
different forward slot gets −1.

---

## TS Type Model (verified)

```ts
type Lineup = {
  g?: string; // maa(1, pv)
  forwardLines: [ForwardLine, ForwardLine, ForwardLine, ForwardLine]; // ketju(3..5, 1..4)
  defensivePairings: [DefensivePairing, DefensivePairing, DefensivePairing]; // ketju(1..2, 1..3)
  powerplayTeam: PowerPlayTeam; // ketju(1..5, 5)
  penaltyKillTeam: PenaltyKillTeam; // ketju(1..4, 6)
};

type ForwardLine = { lw?: string; c?: string; rw?: string };
type DefensivePairing = { ld?: string; rd?: string };
type PowerPlayTeam = {
  lw?: string;
  c?: string;
  rw?: string;
  ld?: string;
  rd?: string;
};
type PenaltyKillTeam = { f1?: string; f2?: string; ld?: string; rd?: string };
```

All string values are player IDs (or `undefined` for empty slot).

**Why PK uses `f1`/`f2` instead of `lw`/`c`:** The QB strength calc
treats both PK forward slots as position-generic (`xxx = 6`). Any
forward type contributes at full strength. The auto-fill picks from
LW and C pools by convention (per `KARSA.M2K`), but the engine
doesn't penalize an RW in either slot. Generic naming reflects the
actual mechanic.

**Why PP uses `lw`/`c`/`rw`:** PP forward slots ARE position-specific
(`xxx = 3/4/5`). A wrong-position forward gets −1 penalty, and a
defenseman in a forward PP slot gets ×0.7.

---

## Roster Size

The starter pack from `SUB gene` generates **24 players** (2G + 7D +
5LW + 5C + 5RW). But rosters can grow beyond 24 through trades,
free agent signings, and contract negotiations. The lineup always
draws from the full current roster, not just the initial 24. Roster
management (cutting, trading) is the player's responsibility.

---

## Open Questions

- **Lineup UI layout:** `SUB printket` ([ILEX5.BAS](../ILEX5.BAS))
  renders the lineup screen with keyboard shortcuts (z=goalie,
  q/w/e=LW/C/RW, a/s=LD/RD). How closely should we mirror this UX?
- **Captain (`kapu`):** Set via `SUB automa` from `suosikki(2, *, pv)`
  (fan favourite list). Captain is a lineup-adjacent concept but
  stored separately. Port TBD.
- **~~Wiring `voimamaar` to the match engine:~~** ✅ DONE.
  `calculateStrength` in `src/services/team.ts` calls
  `calculateLineupStrength(lineup, players)` for human teams — full
  `zzra` pipeline (position/specialty/condition penalties) over goalie +
  3 D pairs + 4 forward lines. PP/PK weights (`calculateYw`/`calculateAw`)
  use the `hw/pw` approximation formula for now; TODO: compute from
  actual PP/PK lineup slots with `yvo`/`avo` bonuses.
- **PP/PK lineup-based strength:** `voimamaar` computes `yw`/`aw` from
  the dedicated PP (unit 5) and PK (unit 6) slots with per-player
  `yvo`/`avo` bonuses and `mtaito(2)` multiplier. Still TODO — both
  AI and human teams currently use the base-stat approximation.

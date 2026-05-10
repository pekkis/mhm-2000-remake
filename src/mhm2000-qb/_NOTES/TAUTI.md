# Tauti — team epidemic / affliction system

Decoded from `ILEX5.BAS` and `MHM2K.BAS`. Despite the name ("tauti" =
disease/illness), this is really a **team-level debuff system** — a
way to temporarily weaken a team's match stats. It has two independent
layers that happen to share a namespace:

1. **`tauti(1..3, tox)` + `tkest(1..3, tox)`** — per-slot stat
   debuffs applied to AI teams. Directly subtract from `ode(1..3)`
   (goalie / defence / attack) and modify `yw` / `aw` in the per-round
   shadow. Only meaningful for AI teams (`ohj(xx) = 0`).

2. **`tautip(team)` + `tautik(team)`** — a per-team match-strength
   multiplier (SINGLE, default 1.0). Scales `ode(1..3)`, `yw`, and
   `aw` in `SUB ottpel`. Affects both AI and human teams.

Both are persisted to save files and count down per round.

---

## Variables

### `tauti(1..3, 1..N)` — AI stat debuff slots

```basic
DIM tauti(1 TO 3, 1 TO 48 - plkm) AS INTEGER   ' MHM2K.BAS:473
```

- **Dimension 1** = stat slot: `1` = goalie (`mw`), `2` = defence
  (`pw`), `3` = attack (`hw`).
- **Dimension 2** = AI-team index via the `tox()` indirection (see
  below).
- **Values**: 0 = healthy, **negative** = debuffed. Set to
  `-(INT(R * RND) + B)` where `R` and `B` depend on the source (see
  §Writers below). The value is added directly to `ode(d, z)` in
  `ottpel` — since it's negative, it reduces the stat.
- **Sign convention**: always ≤ 0 in practice. The `tarka(d)` function
  returns 1 if `tauti(d, tox(xx)) ≠ 0`, used as a "slot occupied"
  check before applying a new debuff.

### `tkest(1..3, 1..N)` — debuff duration countdown

```basic
DIM tkest(1 TO 3, 1 TO 48 - plkm) AS INTEGER   ' MHM2K.BAS:474
```

- Per-slot countdown in rounds. Decremented once per round at
  [ILEX5.BAS:1856](../ILEX5.BAS). When it reaches 0, the
  corresponding `tauti(d, *)` is cleared to 0.

### `tautip(1..48)` — team match-strength multiplier

```basic
DIM tautip(1 TO 48) AS SINGLE                   ' MHM2K.BAS:476
```

- Default: `1.0` (healthy). Values observed: `0.75`, `0.8`, `0.85`,
  `0.9`, `0.93`, `0.95`, `1.0`, `1.05`, `1.1`.
- Applied in `ottpel` at [3844-3845](../ILEX5.BAS) (`yw *= tautip`,
  `aw *= tautip`) and [3857](../ILEX5.BAS)
  (`ode(d) *= tautip`). Both are inside the `zz < 49` gate — only
  managed base teams.
- Human teams get it too: `sattuma` cases 29-30 and 50-51 set
  `tautip(u(pv))` directly for the human manager's team.
- Also used as a **health filter** in `arpo 2` (`tautip(xx) = 1`
  means "this team is healthy, eligible for certain random events").

### `tautik(1..48)` — tautip duration countdown

```basic
DIM tautik(1 TO 48) AS INTEGER                  ' MHM2K.BAS:477
```

- Countdown in rounds. Decremented at [ILEX5.BAS:1861](../ILEX5.BAS).
  When it reaches 0, `tautip` resets to 1.0.
- Special value: `1000` = effectively permanent for the season
  (never reaches 0 within 99 rounds). Used by `uutisia` cases 9 and
  25 for severe AI-team afflictions.

### `tox(1..48)` — AI-team indirection index

```basic
DIM tox(1 TO 48) AS INTEGER                     ' MHM2K.BAS:479
```

- Maps team id (1..48) to a dense index (1..48−plkm) into the
  `tauti(*, N)` / `tkest(*, N)` arrays. Only AI teams (`ohj = 0`)
  get an index assigned. Set up in `SUB topmaar`
  ([MHM2K.BAS:2215](../MHM2K.BAS)):

  ```basic
  toxik = 1
  FOR zzz = 1 TO 48
    IF ohj(zzz) = 0 THEN tox(zzz) = toxik: toxik = toxik + 1
  NEXT zzz
  ```

  Human teams have `tox(team) = 0` (uninitialized), so any code that
  reads `tauti(d, tox(humanTeam))` hits index 0 — which is outside
  the DIMmed range (`1 TO N`). In practice this never happens because
  `tauti` reads/writes are always guarded by `ohj(xx) = 0`.

---

## Match-engine integration (`SUB ottpel`)

Two separate application points in the match engine:

### 1. `tauti(d)` stat debuff — AI teams only

At [ILEX5.BAS:3822-3826](../ILEX5.BAS):

```basic
IF ohj(od(z)) = 0 AND od(z) < 49 THEN
  zz = od(z)
  FOR d = 1 TO 3
    ode(d, z) = ode(d, z) + tauti(d, tox(zz))   ' negative → reduces stat
  NEXT d
  …
END IF
```

Also in the per-round PP/PK shadow at [ILEX5.BAS:328-329](../ILEX5.BAS):

```basic
yw(xx) = ((hw(xx) + tauti(2, tox(xx))) / 3.3 + (pw(xx) + tauti(3, tox(xx))) / 2.5) * …
aw(xx) = ((hw(xx) + tauti(2, tox(xx))) / 4.4 + (pw(xx) + tauti(3, tox(xx))) / 2.5) * …
```

So `tauti(2)` and `tauti(3)` (defence/attack debuffs) feed into the
PP/PK calculation as well — `tauti(1)` (goalie) doesn't, because the
yw/aw formula doesn't reference goalie stats.

### 2. `tautip` match multiplier — all managed teams

At [ILEX5.BAS:3844-3845, 3857](../ILEX5.BAS):

```basic
yw(zz) = yw(zz) * tautip(zz)
aw(zz) = aw(zz) * tautip(zz)
…
ode(d, z) = ode(d, z) * tautip(zz)
```

Applied after `tauti(d)` addition and after doping, but before `tre`
and `etu` scaling. Both human and AI teams.

---

## Per-round countdown

At [ILEX5.BAS:1855-1862](../ILEX5.BAS), executed once per round
after all matches:

```basic
' tauti/tkest countdown (AI teams only)
FOR zzz = 1 TO 48 - plkm
  FOR zz = 1 TO 3
    IF tkest(zz, zzz) > 0 THEN tkest(zz, zzz) = tkest(zz, zzz) - 1
    IF tkest(zz, zzz) = 0 AND tauti(zz, zzz) <> 0 THEN tauti(zz, zzz) = 0
  NEXT zz
NEXT zzz

' tautip/tautik countdown (all teams)
FOR zz = 1 TO 48
  IF tautik(zz) > 0 THEN tautik(zz) = tautik(zz) - 1
  IF tautik(zz) = 0 AND tautip(zz) <> 1 THEN tautip(zz) = 1
NEXT zz
```

---

## Writers — what sets these values?

### `tauti(d)` / `tkest(d)` writers

These only fire for **AI teams** — human teams never get `tauti` slots
set.

| Source                   | QB location               | Slot(s)                                                                           | Values                                                                                                                                      | Trigger                                                |
| ------------------------ | ------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `SUB muilutus`           | [3365-3387](../ILEX5.BAS) | picks `zz = INT(2*RND)+2` → slot 2 or 3, then tries slot 3 or 2 if first occupied | `tauti = -(INT(4*RND)+3)` (−3..−6), `tkest = INT(4*RND)+3` (3..6 rounds)                                                                    | CPU-path prank resolver (jaynax 5/4/3 against AI team) |
| `SUB teet` via `uutisia` | [7850](../ILEX5.BAS)      | `a` = 1 (10%), 2 (40%), or 3 (50%)                                                | slot 1: `-(INT(2*RND)+1)` (−1..−2), slot 2: `-(INT(5*RND)+1)` (−1..−5), slot 3: `-(INT(10*RND)+1)` (−1..−10). `tkest = INT(8*RND)+1` (1..8) | random AI news event (6% per AI team per round)        |
| `SUB teet` via `uutisia` | [7876](../ILEX5.BAS)      | slot 3 only                                                                       | `tauti = -10`, `tkest = INT(5*RND)+3` (3..7)                                                                                                | AI news case 7-8 (attack-specific affliction)          |

**Distribution of affected slots**: slot 3 (attack) is hit most
often — 50% from the random news event + dedicated case 7-8 + prank
fallback. Slot 1 (goalie) is rare (10% from news). Slot 2 (defence)
is moderate (40% from news + prank alternate).

### `tautip` / `tautik` writers

These fire for **both AI and human** teams.

| Source                 | QB location               | tautip | tautik                  | Trigger                                                 |
| ---------------------- | ------------------------- | ------ | ----------------------- | ------------------------------------------------------- |
| `sattuma` case 29-30   | [5719-5720](../ILEX5.BAS) | 0.8    | 2                       | Human random event (illness onset)                      |
| `sattuma` case 50-51   | [5820-5821](../ILEX5.BAS) | 0.9    | `gnome + 1` (4 or 9)    | Human random event (illness diagnosis)                  |
| `uutisia` case 1-6     | [7865](../ILEX5.BAS)      | 1.1    | `INT(6*RND)+6` (6..11)  | AI news: strategy roll hit → team gets a _boost_        |
| `uutisia` case 1-6     | [7868](../ILEX5.BAS)      | 0.9    | `INT(6*RND)+6` (6..11)  | AI news: strategy roll miss → team weakened             |
| `uutisia` case 9       | [7881](../ILEX5.BAS)      | 0.85   | 1000 (permanent)        | AI news: severe affliction (healthy team only)          |
| `uutisia` case 12-13   | [7891](../ILEX5.BAS)      | 0.9    | `INT(7*RND)+4` (4..10)  | AI news: PHL team crisis (+ `mor -10`, possible firing) |
| `uutisia` case 25      | [7951](../ILEX5.BAS)      | 0.9    | 1000 (permanent)        | AI news: severe PHL crisis (+ `mor -55`, manager fired) |
| `uutisia` case 39-40   | [7996](../ILEX5.BAS)      | 0.8    | `INT(10*RND)+2` (2..11) | AI news: disaster (+ `mor -55`, possible firing)        |
| `uutisia` case 53      | [8036](../ILEX5.BAS)      | 0.93   | `INT(3*RND)+1` (1..3)   | AI news: minor dip                                      |
| `uutisia` case 54-55   | [8041](../ILEX5.BAS)      | 0.95   | `INT(5*RND)+2` (2..6)   | AI news: mild affliction                                |
| `uutisia` case 56      | [8043](../ILEX5.BAS)      | 1.05   | `INT(6*RND)+3` (3..8)   | AI news: team _boost_                                   |
| `uutisia` case 64      | [8077](../ILEX5.BAS)      | 0.75   | 1                       | AI news: one-round severe hit                           |
| `uutisia` case 77-80   | [8117](../ILEX5.BAS)      | 0.9    | `INT(4*RND)+1` (1..4)   | AI news: generic affliction                             |
| `SUB taut` (catch-all) | [7443-7445](../ILEX5.BAS) | `jop`  | `jupp% + 1`             | All of the above funnel through `taut`                  |

Note that `tautip` can be **> 1.0** (cases 1-6 hit path: 1.1, case
56: 1.05) — it's a bidirectional multiplier, not just a penalty.

### Season initialization

In `SUB topmaar` ([MHM2K.BAS:2220-2228](../MHM2K.BAS)):

```basic
FOR zz = 1 TO 48 - plkm
  FOR zzz = 1 TO 3
    tauti(zzz, zz) = 0
    tkest(zzz, zz) = 0
  NEXT zzz
NEXT zz
FOR zz = 1 TO 48
  tautip(zz) = 1
  tautik(zz) = 0
NEXT zz
```

All zeroed / reset to 1.0 at season start.

---

## Pre-match display

At [ILEX5.BAS:685-688](../ILEX5.BAS), when scouting the opponent
before a match:

```basic
FOR qwe = 1 TO 3
  IF tauti(qwe, tox(vast(pv))) < 0 THEN LOCATE , 2: lax 77 + qwe
NEXT qwe
IF tautip(vast(pv)) < 1 THEN lax 81
ELSE IF tautip(vast(pv)) > 1 THEN lax 82
```

- `lax 78` / `lax 79` / `lax 80` = X.MHM records for "opponent's
  goalie / defence / attack is weakened" messages (slot 1/2/3).
- `lax 81` = "opponent is afflicted" (tautip < 1).
- `lax 82` = "opponent is in good form" (tautip > 1).

This is only shown for **AI opponents** (`ohj(vast(pv)) = 0 AND
vast(pv) < 49`). Human teams don't get scouted this way.

---

## TS porting implications

### Layer 1: `tauti(1..3)` → AI team stat modifiers

These are **AI-only** per-stat debuffs. In the TS port:

- Store as `team.epidemic: { goalie: number, defence: number, attack: number }` on AI teams (default all 0).
- Add a parallel `team.epidemicDuration: { goalie: number, defence: number, attack: number }` countdown.
- Apply in `calculateStrength(team)` and `calculateYw/calculateAw(team)` — the same AI-path functions that already handle doping.
- Countdown per round alongside the existing readiness drift.

Human teams don't need this — they have per-player injuries instead
(the `pel(xx).inj` system).

### Layer 2: `tautip` → match-strength multiplier

This is a **per-team** multiplier affecting all managed teams (AI and
human). In the TS port:

- Store as `team.epidemicMultiplier: number` (default 1.0).
- Store `team.epidemicMultiplierDuration: number` (default 0).
- Apply in `prepareSide()` in `simulate-match.ts` where the
  `tautip` placeholder currently sits (hardcoded 1.0).
- Countdown per round.

### Naming

Despite "tauti" = disease, the actual mechanic is broader:

- It represents team-level "form" or "condition" for AI teams
- It can be positive (1.05, 1.1) — more like a "form" modifier
- It's set by random news events, pranks, and player choices
- Human teams only get the `tautip` multiplier, never the slot debuffs

Suggested TS naming: `teamCondition` or `teamForm` for the multiplier,
`statDebuff` for the per-slot AI-only layer. Or keep `epidemic` to
honour the QB etymology — it's evocative even if not perfectly
accurate.

---

## Cross-references

- **Match simulation**: [simulate-match.ts](../../services/mhm-2000/simulate-match.ts) — `tautip` placeholder at `prepareSide()`
- **AI PP/PK shadow**: [ILEX5.BAS:328-329](../ILEX5.BAS) — `tauti(2/3)` in yw/aw formula
- **Random events**: [RANDOM-EVENTS.md §7.2](RANDOM-EVENTS.md) — `tautip`/`tautik` as effect kinds
- **AI news**: [ILEX5.BAS:7840-8120](../ILEX5.BAS) — `SUB uutisia` dat% pool
- **Pranks**: [SUBS.md `muilutus` row](SUBS.md) — CPU-path prank applying `tauti` debuffs
- **Pre-match scouting**: [ILEX5.BAS:685-688](../ILEX5.BAS) — opponent condition display
- **Variables**: [VARIABLES.md](VARIABLES.md) — `tauti`, `tkest`, `tautip`, `tautik`, `tox` rows

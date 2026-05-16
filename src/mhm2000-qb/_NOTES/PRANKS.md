# Pranks (`jäynät`) — full system decode

> Working notes for porting the prank subsystem. **Pranks are the most
> distinctively MHM mechanic the game has** — a paid, manager-vs-manager
> sabotage market that touches the match engine, the post-match random
> event roller, the calendar gate logic, and (in hotseat) the way the
> turn loop hands control between managers.
>
> Source of truth: `MHM2K.BI`, `MHM2K.BAS` (loader), `ILEX5.BAS` (whole
> system), `DATA/JAYNAT.M2K` (catalogue), plus the `KO.MHM`/`AL.MHM`/
> `Y.MHM` text records the resolvers read.
>
> Related notes: [DATA-FILES.md](DATA-FILES.md) (file formats),
> [RANDOM-EVENTS.md](RANDOM-EVENTS.md) (post-match `sattuma`/`uutisia`
> tie-ins), [CALENDAR.md](CALENDAR.md) (`kr` round-type gating),
> [GLOSSARY.md](GLOSSARY.md) entries for `jäynä`, `muilutus`, `POLIISI`,
> `faarao`, `fbimiehet`, `xavier`, `sporvagen`.

---

## 1 · The catalogue (`DATA/JAYNAT.M2K`)

7 prank slots. Each slot has a **name** (record 1..7) and a **base
price in markka** (record 8..14). Loaded once at startup by
`MHM2K.BAS:774-781` into `jayna(1..7) AS STRING` and `jahinta(1..7) AS
LONG`.

| Slot | Name (verbatim cp850 → UTF-8)    | `jahinta` base | Resolver path                                    | Slot semantics                                              |
| ---- | -------------------------------- | -------------: | ------------------------------------------------ | ----------------------------------------------------------- |
| 1    | **PROTESTI**                     |              0 | `SUB protesti` (immediate)                       | League appeal; resolved on the spot, NOT queued via jaynax. |
| 2    | **SOPUPELI**                     |        100 000 | `SUB ottpel` match engine reads `jaynax(2, t)`   | Match-fix flag; consumed inside the next sim of `t`'s game. |
| 3    | **SKANDAALIN JULKISTAMINEN**     |         50 000 | `jaynacheck` `skandalpl:` (human) / `SUB skandal` (CPU) | Public scandal smear.                                |
| 4    | **PELAAJAN KOUKUTUS**            |         45 000 | `jaynacheck` `vieroitus:` (human) / `SUB muilutus 2` (CPU) | Drug-hook a player → rehab.                     |
| 5    | **PELAAJAN HOITELU**             |         70 000 | `jaynacheck` block 2 (human) / `SUB muilutus 1` (CPU)      | Pre-match assault on a player.                  |
| 6    | **URHEILUJUOMAN TERÄSTÄMINEN**   |         60 000 | `jaynacheck` `ripuli:` (human) / inline `luz 53` (CPU)     | Mass food poisoning (ripuli = "diarrhoea").     |
| 7    | **KYTTÄYSKEIKKA**                |         50 000 | `jaynacheck` morale-hit block (both)                       | Manager stakeout / blackmail. Only prank that records the **perp's team id** as its value rather than a `1`. |

### Final price formula

`finalPrice = jahinta(slot) * (4 - sr(targetTeam))`
[ILEX5.BAS:3207, 3218, 3224]

`sr(t)` is the **series rank** of the target team (1 = PHL, 2 = Div I,
3 = Div II in MHM 97 layout; MHM 2000 keeps the same numbering — see
[VARIABLES.md `sr()`]). So pranking up the pyramid is 3× as expensive
as pranking down:

| Target tier | Multiplier |
| ----------- | ---------: |
| PHL (`sr=1`)        | 3× |
| Div I (`sr=2`)      | 2× |
| Div II (`sr=3`)     | 1× |

PROTESTI is free regardless (jahinta=0).

---

## 2 · The state cluster (`MHM2K.BI:100/104/109/112/121`)

| Variable        | Type                    | Purpose                                                                                                                                                                                |
| --------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `jayna()`       | STRING, 1..7            | Display labels for the 7 prank slots.                                                                                                                                                  |
| `jahinta()`     | LONG, 1..7              | Base prices (slot 1 = 0).                                                                                                                                                              |
| `jaynteh`       | INTEGER, **global**     | "have-pranked-this-turn" flag. Reset to 0 at the **start of each manager's gameday prep** [`ILEX5.BAS:240`]. Set to 1 when a prank is bought [`:3225 / :3229`]. Saved at `:7239`. |
| `jaynateh()`    | INTEGER, per-manager    | **PROTESTI lifetime counter** for this manager. Cap at 3 → grey-out / lockout (`IF jaynateh(pv) = 3 THEN lay 23: pjn: EXIT SUB` [`:3174`]). Reset to 0 at `uusikausi` [`:7736`]. Saved at `:7254`. |
| `jaynmax`       | INTEGER, ephemeral      | Number of selectable slots in the current `meanstuff` view. `7` normally, `1` (PROTESTI only) on the very last round [`kr = 68`, `:3177`].                                          |
| `jaynax(s, t)`  | INTEGER 2D, **the queue** | The pending-prank matrix. `s` = slot 1..7, `t` = team or manager index 1..48. See dual-index quirk below. Persisted in the save file via the nested loop at `:7322`.                |

### `jaynax` indexing semantics (this is the trap)

The second subscript is **team index** (1..48) in almost every site,
but the **set sites** are inconsistent:

- `meanstuff CASE 2..6` writes `jaynax(slot, x(kurso))` where `x(kurso)`
  = the **team** under the standings cursor → indexed by **target team**.
- `meanstuff CASE 7` (KYTTÄYSKEIKKA) writes `jaynax(7, x(kurso)) = u(pv)`
  → indexed by **target team**, **value** = the perp's team id.
- `jaynacheck` block 1 (`pel(xx, pv).spe = 666`) writes
  `jaynax(5, pv) = 1` — indexed by the **manager** `pv`. Sets a flag
  that the next muilutus has already been ordered (POLIISI enforcer).
- `jaynacheck` reads `jaynax(_, u(pv))` everywhere else — indexed by
  the manager's **team** `u(pv)`.

In practice this works because for a managed team, `u(pv) = team` and
that team is the unique target. The POLIISI-set `jaynax(5, pv)` is
immediately consumed in the same call to `jaynacheck` (block 1 sets,
block 2 reads). Treat it as: **`jaynax(*, team)` is the canonical view**,
the `(5, pv)` write is a within-function scratch that happens to alias.

When porting: model `jaynax` as `Record<PrankSlot, Record<TeamId,
PrankPending>>` where `PrankPending` is `0 | 1` for slots 2..6 and
`0 | TeamId` (perp's team) for slot 7. Drop the `(5, pv)` shorthand —
fold the POLIISI sweep into the same resolver that handles slot 5.

---

## 3 · `SUB meanstuff` — the buy menu (`ILEX5.BAS:3169-3253`)

Player-facing. Reached via the **"f" hotkey** from the main info menu,
gated by:

```basic
IF me$ = "f" AND jaynteh = 0 AND kr <= 68 THEN meanstuff: EXIT DO     ' :404
```

→ One prank per turn (`jaynteh = 0`), only in rounds 1..68 (i.e.
through the start of playoffs; full QF/SF/F bracket disallows new
pranks). See `KIERO.M2K` rows 1..68 in [CALENDAR.md](CALENDAR.md);
new pranks are blocked from the first QF draw round (kr=78 in MHM
2000's 99-round calendar) onward, even though the kr<=68 guard
itself dates from MHM 97's shorter calendar.

### Flow

1. **Lockout check** [`:3174`]: `IF jaynateh(pv) = 3` → text record
   `KO.MHM:23` ("You've already filed 3 protests this season…") and
   bail. **Only PROTESTI counts toward this cap** (incremented only in
   the CASE 1 branch at `:3230`).
2. **Standings view** [`:3176, 3243-3252` `dalailama:` label]: 48-team
   league grid in 4 columns of 12. Cursor `kurso` selects target team
   `x(kurso)`.
3. **Slot list** [`:3177-3186`]: 7 (or 1 if `kr = 68`) prank rows
   right-aligned at column 41. Greyed out when:
   - `ohj(x(kurso)) <> 0 AND zz = 2` → SOPUPELI on a managed team
     (multiplayer block — match-fix must be against an AI team).
   - `ohj(x(kurso)) = pv` → all slots greyed for own team.
4. **Confirm** [`:3197-3239`]:
   - Re-check the same `d = 1` gate.
   - `raha(pv) < jahinta(slot) * (4 - sr(target))` → `KO.MHM:6`
     ("Not enough money, try again later") and bail back to grid.
   - Show "Uhri" (victim) and "Hinta" (price), prompt y/n
     (`AL.MHM:137..143` via `lax 136 + oldkurso`).
   - On confirm: deduct `raha(pv)`, set `jaynteh = 1`, dispatch:
     - **CASE 1 (PROTESTI):** `xx = u(pv): xxx = x(kurso)`, increment
       `jaynateh(pv)`, call `SUB protesti` immediately.
     - **CASE 2..6:** `jaynax(slot, x(kurso)) = 1`. Queued; resolves
       on the target's next gameday.
     - **CASE 7 (KYTTÄYSKEIKKA):** `jaynax(7, x(kurso)) = u(pv)`.
       Queued; the **value is the perp's team id** so the victim's
       resolver knows who ordered it.

`meanstuff` never queues against own team and never queues SOPUPELI
against another human — see "Multiplayer / hotseat semantics" below.

---

## 4 · `SUB protesti` (`ILEX5.BAS:5181-5209`) — PROTESTI resolution

PROTESTI is **synchronous** — resolved right inside `meanstuff` before
the manager returns to the menu. Not queued via `jaynax`.

1. Banner `AL.MHM:119` ("Liiton kurinpitokomitea käsittelee…"), then
   "SYYTTÄJÄ" (accuser = `xx = u(pv)`) and "SYYTETTY" (accused =
   `xxx = x(kurso)`).
2. **11-juror vote** [`:5195-5202`]: each juror rolls
   `d ≤ 50 + mtaito(5, accuser)*5 - mtaito(5, accused)*5`. `mtaito(5,
   manager)` is the **diplomacy attribute** ([ATTRIBUTES.md]). Higher
   diplomacy on either side shifts juror sympathy by ±5 percentage
   points per point of attribute.
3. **Loser determination** [`:5203`]: if `votes_against ≥
   votes_for`, the **accuser** loses (frivolous protest). Otherwise
   the accused loses.
4. **Penalty** [`:5204-5205`]: `p(loser) -= 2` (standings points),
   `mo(loser) -= 2` (morale).
5. Outcome text: win = `AL.MHM:184`, loss = `AL.MHM:185`. Updates
   standings (`staulmaar`).

Notable: **filing a protest is risky** — there's a real chance you
lose 2 standings points yourself. This is why `jaynateh()` caps at 3
to prevent spam-griefing.

---

## 5 · `SUB jaynacheck (choko%)` (`ILEX5.BAS:2177-2266`) — the human-team resolver

Called **3 times per human gameday** from `SUB sattuma`, with the
`choko%` parameter selecting which mode:

| Call site (in `sattuma`) | `choko%` | Effect                                                                                                                |
| ------------------------ | -------: | --------------------------------------------------------------------------------------------------------------------- |
| `:5654` (after each match)   | 0    | Normal post-match resolver. Runs blocks 1-5 sequentially.                                                             |
| `:5783` (random event branch) | 1    | **Forced ripuli** — jumps straight to the `ripuli:` GOSUB (mass food poisoning). Triggered from `sattuma dat% = 42`.   |
| `:5985` (random event branch) | 2    | **Forced skandalpl** — jumps straight to the `skandalpl:` GOSUB. Triggered from `sattuma dat% = 92`.                  |

Both `1` and `2` exit after their GOSUB; only `0` runs the full
sequence:

### Block 1 · POLIISI sweep [`:2181-2193`]

Scan own roster for the **enforcer-armed flag**:

- `pel(xx, pv).spe = 666` → manager pressed `m` earlier ([GLOSSARY.md
  `POLIISI` / `xavier`]) to turn `spe=5` enforcer into a goon for this
  match. Side-effects: `jaynax(5, pv) = 1` (queue muilutus on self →
  read by block 2 immediately), `lukka = 17` ("17 game ban" injury
  code), `yy = vast(pv)` (opponent), `dap 2` (apply ban).
- `pel(xx, pv).spe = 2 AND .ket > 0` → fighter on a line, 2% chance of
  triggering `lukka = 18` then `dap 2`.

### Block 2 · PELAAJAN HOITELU on self [`:2195-2202`]

`IF jaynax(5, u(pv)) = 1 THEN`: someone (a CPU manager via
`uutisia`, or the POLIISI block above) has queued a hit on you. Pick
random own player via `al 1`, if not already injured (`lukka = 0`)
set `lukka = 44` (injury #44 in `I.MHM` = hoitelu victim) + `dap 1`.
Clear the flag.

### Block 3 · POLIISI victim-side [`:2204-2213`]

For each opposing CPU manager `xxx` facing us today (`vast(xxx) =
u(pv) AND jaynax(5, xxx) = 1`): the CPU's enforcer hit us. Apply
**injury #45** (POLIISI victim) to a random own player. Clear flag.

### Block 4 · KYTTÄYSKEIKKA resolution [`:2215-2228`]

Two sub-cases:

- **You were stakeout-target** [`:2215-2220`]: `IF jaynax(7, u(pv))
  <> 0`: `xx = jaynax(7, u(pv))` recovers the **perp's team id**.
  Show `E.MHM:13` (the V.MHM/E.MHM mapping for KYTTÄYSKEIKKA reveal),
  apply `mor u(pv), -15` (−15 manager morale).
- **CPU managers were stakeout-targets** [`:2222-2228`]: sweep all
  CPU teams with `jaynax(7, xx) <> 0` → `mor xx, -55` (a *much*
  harsher hit) and show `E.MHM:36`.

Asymmetry note: human victims take **−15** morale, CPU victims take
**−55**. This isn't unfairness toward the AI — it's there so that
when a human pays for KYTTÄYSKEIKKA against an AI it has a meaningful
gameplay effect (CPU managers don't have a "you got owned" UI moment,
so the penalty has to be big enough to shift their standings).

### Block 5 · SKANDAALI / RIPULI / VIEROITUS dispatch [`:2230-2232`]

```basic
IF jaynax(3, u(pv)) = 1 THEN GOSUB skandalpl     ' SKANDAALIN JULKISTAMINEN
IF jaynax(6, u(pv)) = 1 THEN GOSUB ripuli        ' URHEILUJUOMAN TERÄSTÄMINEN
IF jaynax(4, u(pv)) = 1 THEN GOSUB vieroitus     ' PELAAJAN KOUKUTUS
```

#### `skandalpl:` [`:2235-2246`]

- Show `AL.MHM:59` (banner).
- Charisma `tarko` roll `tarko(u(pv), 5, 15, 50)` ([ATTRIBUTES.md:
  attribute 5 = `kar` charisma, weight 15, base 50%]).
- Win (`= 1`): `AL.MHM:60` + `mor +10`. Lose: `AL.MHM:61` + `mor -10`.
- Clear `jaynax(3, u(pv))`.

#### `ripuli:` [`:2248-2255`]

- Show E.MHM:19 (the "ripuli" banner, via `lux 19`).
- Charisma roll `tarko(u(pv), 6, 15, 50)` (attribute 6 = `kun`
  fitness/management). Win: `lux 76`, lose: `lux 77`.
- **Mass roster damage** [`:2251-2253`]: every healthy player rolls
  `100*RND > 60` → `inj = 2` (2-round injury).
- Clear `jaynax(6, u(pv))`.

#### `vieroitus:` [`:2257-2265`]

- `al 3` picks a random own player not already in rehab. If
  available (`lukka = 0`):
  - `gnome = INT(11*RND) + 7` (7..17 rounds).
  - Show `AL.MHM:118` ("…joutuu vieroitushoitoon…").
  - `pel(xx, pv).inj = gnome + 2000` — the **rehab sentinel range
    `2001..2017`** (see [RANDOM-EVENTS.md] § 4 for the full injury-
    code map; `1..999` regular injuries, `2001..2999` rehab).
- Clear `jaynax(4, u(pv))`.

---

## 6 · CPU-team resolver: `uutisia` :7819-7835 + `SUB muilutus` + `SUB skandal`

Per-round, after the player-facing match block, `SUB uutisia` walks
the `jaynax` queue for **CPU-owned teams** (`ohj(xx) = 0`):

```basic
' :7819-7825 — KYTTÄYSKEIKKA-equivalent for muilutus, against CPU opponent
FOR a = 1 TO plkm
  IF jaynax(5, a) = 1 AND ohj(vast(a)) = 0 THEN
    jaynax(5, a) = 0
    xx = vast(a)
    muilutus 3                                                 ' "muilutus from opponent" flavour
  END IF
NEXT a

' :7827-7835 — generic CPU sweep
FOR xx = 1 TO 48
  IF ohj(xx) = 0 AND jaynax(3, xx) = 1 THEN skandal             ' SKANDAALI
  IF ohj(xx) = 0 AND jaynax(5, xx) = 1 THEN muilutus 1         ' PELAAJAN HOITELU
  IF ohj(xx) = 0 AND jaynax(4, xx) = 1 THEN muilutus 2         ' VIEROITUS / koukutus
  IF ohj(xx) = 0 AND jaynax(6, xx) = 1 THEN
    luz 53                                                      ' "ripuli" headline
    jaynax(6, xx) = 2                                          ' two-stage: 2 = "consumed, applies in next ottpel"
  END IF
NEXT xx
```

The two-stage `jaynax(6, xx) = 1 → 2` on AI teams is the only
multi-tick prank flag. It survives until `SUB ottpel` line `:3827`:

```basic
IF jaynax(6, zz) = 2 THEN ode(1, z) = 0: ode(2, z) = 0: ode(3, z) = 0: jaynax(6, zz) = 0
```

→ a poisoned AI team plays the **next match** with all three
attack-defence-goalie multipliers zeroed (catastrophic defeat,
0-something blowout). Then the flag clears.

### `SUB skandal` (`ILEX5.BAS:6208-6217`) — CPU SKANDAALI

```basic
SUB skandal
  jaynax(3, xx) = 0
  luz 35                                  ' V.MHM:35 banner
  IF tarko(xx, 5, 15, 50) = 1 THEN        ' charisma roll
    mor xx, 55                            ' +55 morale (rallied)
  ELSE
    mor xx, -55                           ' -55 morale (crushed)
    potk xx                               ' MANAGER FIRED
  END IF
END SUB
```

Note the swing: CPU scandals are existential (±55, possible fire).
Human's `skandalpl:` swings ±10. Same reason as KYTTÄYSKEIKKA — the
AI needs a bigger shove for the prank to bite in standings.

### `SUB muilutus (fat%)` (`ILEX5.BAS:3365-3388`) — three flavours

| `fat%` | Trigger                                                     | Cleanup                  | Headline (V.MHM via `luz`) |
| -----: | ----------------------------------------------------------- | ------------------------ | -------------------------- |
| 1      | `jaynax(5, xx) = 1` (PELAAJAN HOITELU on CPU team)          | `jaynax(5, xx) = 0`      | `luz 51`                   |
| 2      | `jaynax(4, xx) = 1` (KOUKUTUS / vieroitus on CPU team)      | `jaynax(4, xx) = 0`      | `luz 52`                   |
| 3      | CPU opponent of human just got `jaynax(5, *) = 1`           | (cleared by caller)      | `luz 54`                   |

Effect (same for all three): walk lines 2 → 3 (or 3 → 2 randomly,
`zz = INT(2*RND) + 2`), find a line where `tarka(d) = 0` (line has
healthy attackers), apply **`tauti(line, team) = -(INT(4*RND)+3)`**
and **`tkest(line, team) = INT(4*RND)+3`** — i.e. the team's line
gets a 3-7 point attack debuff for 3-7 rounds. See [TAUTI.md] for
the `tauti/tkest/tautip` injury-disease cluster.

---

## 7 · SOPUPELI inside the match engine (`SUB ottpel`)

The match-fix prank is unique: it doesn't go through any resolver
SUB. Instead the simulator branches on the **sum** of both teams'
SOPUPELI flags at `:3879`.

```basic
SELECT CASE jaynax(2, od(1)) + jaynax(2, od(2))
  CASE 0   ' clean game — 15 normal possessions
  CASE 1   ' THROWN game — fixed side capped at gl(other)-2 throughout
  CASE 2   ' MUTUAL fix — both teams targeting the same random tied score
END SELECT
```

### CASE 2 — mutual collusion (`:3888-3895`)

Both managers (or one manager + an AI fix-buyer) want a fix. `gnome =
5 * RND` picks a target tie score 0..4. Loop until **both** teams
match that exact score:

```basic
ja(od(1)) = 1: ja(od(2)) = 1                    ' "tied — go to OT"
gnome = 5 * RND
DO UNTIL gl(od(1)) = gnome AND gl(od(2)) = gnome
  ' 15-attempt scoring loop
LOOP
```

→ guaranteed tied regulation score → flagged for OT loop (this is
why `ja()` is set: the OT block at `:3914-3925` reads it).

### CASE 1 — one-sided throw (`:3897-3907`)

Whichever side has the flag `b` is the **thrown side**; the other
side `c` is the free side. `gl(od(b)) += 1` (the free side gets a +1
freebie), then 14 normal possessions run. Per-possession inside
`tvtilanne:`/`yvtilanne:` [`:3977-3979`, `:3997-3999`], the cap
`gnome` is overridden:

- thrown side `b`: `gnome = gl(od(c)) - 2` → b can only score up to
  c's-score-minus-2. b deliberately loses by at least 2.
- free side: `gnome = 999` → uncapped.

### Cleanup [`:3911-3913`]

```basic
sattans:
IF ohj(od(1)) = 0 THEN jaynax(2, od(1)) = 0
IF ohj(od(2)) = 0 THEN jaynax(2, od(2)) = 0
```

Only **CPU-side** flags are cleared. The **human side's flag
persists** — see § 8.4.

### The "S" hotkey [`:418-421`]

```basic
IF me$ = "S" THEN
  IF jaynax(2, u(pv)) = 0 THEN jaynax(2, u(pv)) = 1 ELSE jaynax(2, u(pv)) = 0
  intejasopu
END IF
```

The capital-S hotkey **toggles SOPUPELI on your own team** for free.
This is *not* a prank you buy — it's the second-half of a SOPUPELI
deal: to actually fix a match, **both** sides need `jaynax(2)` set.
The buyer pays the 100 000 mk via `meanstuff` to set the AI side,
and toggles "S" to set their own side. The UI indicator is
`intejasopu` [`:2147`] which blinks (`COLOR 30`) the intensity panel
when `jaynax(2, u(pv)) = 1`, so you can see at a glance whether
you're currently complicit.

---

## 8 · Multiplayer / hotseat semantics

MHM 2000 is hotseat-multiplayer (`plkm` human managers, turn loop
`vu = 1..plkm` in `:206-216`). Several prank behaviours are
multiplayer-aware:

### 8.1 · SOPUPELI is blocked against managed teams [`:3183`, `:3199`]

In the buy menu, SOPUPELI (slot 2) is greyed out (`COLOR 8`) and
disallowed (`d = 0`) when the target team has a human manager
(`ohj(x(kurso)) <> 0`). Rationale: a match-fix only works if both
sides set their flag, and there's no way to force a human to accept.
(See also § 7.4: the buyer still needs their own "S" toggle to
actually trigger it.)

### 8.2 · All pranks blocked against own team [`:3183`, `:3200`]

`ohj(x(kurso)) = pv` → `COLOR 8` and `d = 0`. Can't prank yourself.

### 8.3 · The `jaynteh` reset cadence [`:240`]

`jaynteh = 0` (global flag, "no prank ordered this turn") is reset
at the top of each manager's gameday-prep block, which is inside
the `vu`/`pv` turn loop. So in hotseat: manager A buys a prank →
`jaynteh = 1` → A can't buy a second → control hands to B → B's
prep resets `jaynteh = 0` → B can buy → resets at C → etc. Works
correctly despite the variable being a global rather than per-manager.

When porting: model as `currentManager.prankBoughtThisRound: boolean`
that resets on `TURN_HANDOFF`.

### 8.4 · `jaynateh()` is per-manager and PROTESTI-only [`:3174, 3230, 7736`]

Lifetime cap 3 PROTESTI per season per human manager. CPU managers
can file unlimited PROTESTI (they don't go through `meanstuff`).
Reset at season rollover (`uusikausi:7736`).

### 8.5 · KYTTÄYSKEIKKA records the perp [`:3235, 2216`]

Only prank with attribution: `jaynax(7, victim_team) = perp_team`.
The victim's `jaynacheck` recovers the perp from the slot value
itself. The `E.MHM:13` reveal text uses `xx` (the perp team id) when
rendered — so victim sees **who** stakeout'd them. Every other prank
is anonymous (just `= 1`).

### 8.6 · Asymmetric morale hits

| Prank          | Human victim | CPU victim         |
| -------------- | -----------: | -----------------: |
| KYTTÄYSKEIKKA  |          −15 |               −55  |
| SKANDAALI      |  ±10 (tarko) | ±55 (tarko) + fire on loss |
| HOITELU/KOUKUTUS | injury #44/rehab | line debuff (3-7 pts × 3-7 rounds) |
| RIPULI         | mass `inj = 2` (60% per player) | all `ode` multipliers zeroed next match |

The CPU side hits harder mechanically because the AI has no UI for
"you've been pranked" → the impact has to be in the standings, not
in the player's emotional response.

### 8.7 · Persistence

Saved by `SUB tallennus`:

- `jaynteh` written once (global) at `:7239`.
- `jaynateh(tt)` per-manager at `:7254`.
- `jaynax(zz, tt)` for `zz = 1..7`, `tt = 1..48` at `:7322` (nested
  loop, 336 entries).

So the prank queue **survives save/load**. In MHM 2000 we have to
preserve identical semantics if we want loaded games to behave
deterministically — i.e. the `PrankPending` state must round-trip
through `getPersistedSnapshot()`.

---

## 9 · Calendar tie-ins

### 9.1 · Buy gate: `kr <= 68` [`:404`]

The `meanstuff` hotkey is open only on rounds 1..68. In MHM 2000's
99-round calendar ([`KIERO.M2K`](../DATA/KIERO.M2K) + [CALENDAR.md]),
rounds 1..66 are regular-season (mostly `kiero=1/2/3` matchdays plus
preseason `kiero=99` and training `kiero=4` rounds, the EHL final
tournament `kiero=22` at row 56, etc.). Rounds 78..95 are the
playoff bracket (`kiero=41..46`). Rounds 67..77 sit in the
post-regular-season window before the QF draw at row 78. **MHM 97
inherited the literal `68` constant**, so the cutoff slightly
overshoots into early playoffs (legacy behaviour preserved).

### 9.2 · Last-round PROTESTI lock-in [`:3177`]

```basic
IF kr = 68 THEN jaynmax = 1 ELSE jaynmax = 7
```

At round 68 exactly, only the first slot (PROTESTI) is shown. This
is the "last legal protest before playoffs lock in" affordance.

### 9.3 · Bracket-admin rounds do NOT run `sattuma` [`CALENDAR.md`]

`kiero = 41/43/45` are pure bracket-draw rounds — no match
simulation, no `sattuma`, no `jaynacheck`. Queued `jaynax` flags
sit dormant through these rounds and resolve on the next `kiero =
42/44/46` matchday.

### 9.4 · Random-event tie-ins (`SUB sattuma`/`uutisia` dispatch)

`SUB sattuma` ([RANDOM-EVENTS.md], `:5527`) and `SUB uutisia`
([RANDOM-EVENTS.md], `:7776`) both write to `jaynax`. Key cases:

| dat% case (in `uutisia` / `sattuma`) | Effect                                                                              | Source line     |
| ------------------------------------ | ----------------------------------------------------------------------------------- | --------------- |
| `sattuma :5413-5423` (after sopupeli match-fix exposed) | `seuraus%` 1..49 → set `jaynax(5)`; 50..80 → `jaynax(6)`; 81..100 → `jaynax(3) + jaynax(5) + jaynax(6)` | `:5413-5423`    |
| `sattuma :5749` (KYTTÄYSKEIKKA event)  | `jaynax(7, u(pv)) = xx` (CPU manager `xx` pranks human)                            | `:5749`         |
| `uutisia 33-34`                        | `arpo 1` picks AI manager into `xx`, then `jaynax(7, u(pv)) = xx`                  | RANDOM-EVENTS § 5 |
| `uutisia 42`                           | `jaynacheck 1` (forced ripuli, no own flag)                                        | `:5783`         |
| `uutisia 92`                           | `jaynacheck 2` (forced skandalpl, no own flag)                                     | `:5985`         |
| `uutisia 108`                          | `muilutus 1` (forced HOITELU resolution, no own flag)                              | `:8190`         |
| `uutisia 109`                          | `muilutus 2` (forced VIEROITUS resolution, no own flag)                            | `:8194`         |
| `uutisia 110-114`                      | `jaynax(2, xx) = 1` (random SOPUPELI flag against CPU team `xx`)                   | `:8198`         |
| `uutisia 132-135`                      | Random `jaynax(5/6/4/3, INT(24*RND)+1) = 1` against a top-div team                 | `:8272-8284`    |
| `ottpel :6132` (mafia `sovtap`)        | After accepted mafia bribe → `sovtap(pv) = 1` (separate from `jaynax(2)`!)         | `:6132`         |
| `ottpel :6142-6144` (mafia escalation) | `jaynax(6) + jaynax(5) + jaynax(3)` all set (mafia triple-cross)                   | `:6142-6144`    |

`sovtap(pv)` is a **separate match-fix flag** from `jaynax(2)`. It's
specifically the **mafia consent** flag — see [RANDOM-EVENTS.md] and
the `ottpel` mafia case at `:6131-6149`. Both flags get consulted
during match simulation but via different code paths. When `sovtap=1`
gets exposed post-match (`:5409-5425`), the *consequences* include
random `jaynax(3/5/6)` retaliation pranks against the cheating
manager.

---

## 10 · Adjacent SUBs (NOT pranks, often confused for them)

The AGENTS.md mission statement lists `muilutus, faarao, fbimiehet,
xavier, sporvagen` as "new prank types in MHM 2000". This is
misleading — those names are mostly **on-ice / punitive flavour**
SUBs that are *triggered* by other systems, not by the `meanstuff`
buy menu. For the porting register:

| SUB           | What it actually is                                                                                                                                                | Prank-system role                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `muilutus`    | Apply line debuff (3-7 pt × 3-7 rd) to a CPU team. Called from `uutisia` to resolve `jaynax(5/4)` on CPU teams. **Triggered by pranks**, not a buyable prank itself. | Slot 4/5 CPU resolver.                                                     |
| `skandal`     | Apply ±55 morale + possible fire to a CPU manager. Called from `uutisia` to resolve `jaynax(3)` on CPU. **Triggered by pranks**, not a buyable prank.              | Slot 3 CPU resolver.                                                       |
| `faarao`      | Bankruptcy player-strike SUB ([GLOSSARY.md `faarao`]). Triggered by `konkurssi(pv) > 0`. **Nothing to do with pranks.**                                            | None — but creates an injury-like sentinel (`inj = 3333`) similar in spirit. |
| `fbimiehet`   | FBI abduction of `spe=3` (`uglyAndWeird`) players ([GLOSSARY.md `fbimiehet`]). Per-player roll on gameday. **Nothing to do with pranks.**                          | None.                                                                       |
| `xavier`      | Per-player action dispatcher for the "t/k/p/z" hotkeys ([GLOSSARY.md `xavier`]) — CCCP-TABLETTI, karisma training, release, ZOMBIPULVERI. **Nothing to do with pranks.** | None — but the sibling `m` hotkey (POLIISI flip) feeds into `jaynax(5)` via `jaynacheck` block 1. |
| `sporvagen`   | Read-only sponsor info viewer ([GLOSSARY.md `sporvagen`]). **Nothing to do with pranks.**                                                                          | None.                                                                       |
| `plajaytajoukkueet` | Playoff bracket printer ("play[off]ja[t]ka[va]joukkueet" = "play-off continuing teams"). Pure presentation. **Not** a prank target-list. | None. (SUBS.md had this mislabelled as "set prank-target teams"; that decoding is wrong — the SUB body just prints the bracket text.) |
| `playoffplajays` | Playoff round setup (seeding, sponsor adjustments). **Not** prank-related despite the name fragment. | None. |
| `meanstuff`   | The prank buy menu. **This** is the player-facing prank SUB.                                                                                                       | Sole entry point.                                                          |
| `jaynacheck`  | The prank queue resolver. **This** is the engine-facing prank SUB.                                                                                                 | Sole resolver for human-managed teams.                                     |
| `protesti`    | PROTESTI dispatcher.                                                                                                                                               | Slot 1 resolver.                                                           |

---

## 11 · Porting plan (preview)

Phase 4 (bulk port) will implement pranks as **declarative events** in
the `src/game/pranks.ts` registry pattern documented in
[AGENTS.md](../../../AGENTS.md):

```ts
type PrankSlot = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type PrankInstance = {
  slot: PrankSlot;
  buyer: ManagerId;      // u(pv)
  target: TeamId;        // x(kurso)
  cost: number;          // jahinta(slot) * (4 - sr(target))
};
```

- Catalogue → `src/data/pranks.ts` (port `JAYNAT.M2K` to a typed
  constant; keep cp850-decoded Finnish names verbatim).
- Pricing formula → pure function `prankPrice(slot, target)`.
- `meanstuff` → React page component (target picker over standings +
  slot list) + `BUY_PRANK` event handler that runs the `kr <= 68`,
  `kr = 68 → PROTESTI only`, `ohj() = pv` self-block, `ohj() <> 0 →
  no SOPUPELI`, `jaynateh(pv) < 3` PROTESTI cap, and
  `jaynteh === false` per-turn checks as XState guards (using
  `ContextSelector<T>` predicates so the UI and the machine read the
  same rule — see [AGENTS.md] § XState).
- `jaynax(slot, team)` → `GameContext.pendingPranks: Record<TeamId,
  Partial<Record<PrankSlot, true | TeamId>>>`. PROTESTI omitted
  (synchronous).
- `jaynacheck`/`skandal`/`muilutus` → declarative events with the
  random rolls in `resolve()` (per [AGENTS.md] Random discipline).
- `sattuma`/`uutisia` cases that schedule pranks → use the
  `spawnEvent` effect from [RANDOM-EVENTS.md].
- SOPUPELI integration into the match simulator: when the
  `simulateMatch` service runs, read both teams' `pendingPranks[*][2]`
  flags and apply the CASE 0/1/2 branch verbatim. **Random
  discipline**: the `gnome = 5 * RND` mutual-fix target score is a
  match-time roll, not a snapshot — but the match itself snapshots
  its full result, so replay is deterministic.
- Persistence: pendingPranks survives `getPersistedSnapshot()`
  automatically (it's just context).

Behaviour-preservation testing: write a fixture per slot that walks
`buy → tick to next match → resolve → assert state` using the
`scriptedRandom` test helper. Particular care for:

- The two-stage `jaynax(6, xx) = 1 → 2 → 0` CPU ripuli flow (`luz 53`
  headline on turn N, `ode = 0,0,0` on turn N+1).
- The KYTTÄYSKEIKKA perp-attribution path (victim sees who pranked
  them).
- The `(5, pv)` POLIISI scratch write inside `jaynacheck` — fold into
  the slot 5 resolver, do **not** expose as a separate code path.
- The asymmetric morale numbers (−15/−55, ±10/±55) — preserve
  verbatim; they're load-bearing for AI standings balance.

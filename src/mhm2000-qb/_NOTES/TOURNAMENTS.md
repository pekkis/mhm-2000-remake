# Tournaments (kutsuturnaukset & EHL:n lopputurnaus)

MHM 2000 has **eleven** tournaments in total:

- **10 invitation tournaments** (`JT1..JT10`) all played on the
  Christmas-break round (`kiero=98`, KIERO.M2K row 47). Inherited
  shorthand `JT` = _joulu-turnaus_ (Christmas tournament). Each runs
  as a 6-team round-robin over 5 rounds, on a neutral venue, with
  cash payouts per finishing position.
- **1 EHL final tournament** ("EHL:N LOPPUTURNAUS", `kiero=22`,
  KIERO.M2K row 56) — same 6-team round-robin engine, but the seats
  are filled deterministically from the EHL group-stage standings.
  Winner is crowned `emestari` (European champion).

This note covers all eleven. They share one machine (`SUB turnaus`),
one fixture array (`tfxt`), one prize-table loader (`SUB maarpalk`),
and one set of guards (`turnauz = 1` → tournament mode).

Currently the TS port has three MHM-97-era tournaments in
[src/data/tournaments.ts](../../data/tournaments.ts). MHM 2000 supersedes
that completely — keep none of the names, prizes, or eligibility rules.

---

## 1. Source map

| Concern                        | QB site                                                                                                                                                          |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tournament names (10)          | `DATAX.M2K` rows 4–13, loaded into `turnimi(1..10)` at `MHM2K.BAS:787-789`                                                                                       |
| Invitation tier table          | `TKUTSU.M2K` (48 lines), loaded into `tkutsux(1..48)` at `MHM2K.BAS:768-771`                                                                                     |
| Per-tournament prize tables    | `JT1.PLX..JT10.PLX`, `ELT.PLX` (6 lines each = palki(1..6))                                                                                                      |
| Prize loader                   | `SUB maarpalk (jepulis$)` at `ILEX5.BAS:3151-3157`                                                                                                               |
| Invitation UI                  | `SUB kutsuturnaus` at `ILEX5.BAS:2974-2993`                                                                                                                      |
| Hotkey to open invitation UI   | `ILEX5.BAS:406` (`l` key, gated `kiero3(kr)=3 AND mukt(pv)=0`)                                                                                                   |
| "POSTIA!" mail reminder        | `ILEX5.BAS:4157` (`postia 1` = "TURNAUSKUTSU")                                                                                                                   |
| NHL CHALLENGE auto-pick        | `SUB tarkistanhlc` at `ILEX5.BAS:7417-7431`                                                                                                                      |
| Christmas tournaments runner   | `SUB joulutauko` at `ILEX5.BAS:2268-2324`                                                                                                                        |
| EHL group → final assembly     | `SUB ehllopturmaar (1)` at `ILEX5.BAS:1283-1340`                                                                                                                 |
| EHL final tournament runner    | `SUB ehllopturmaar (2)` at `ILEX5.BAS:1342-1366`                                                                                                                 |
| Tournament play engine         | `SUB turnaus` at `ILEX5.BAS:7603-7654`                                                                                                                           |
| Standings + prize disbursement | `SUB staulturmaar` at `ILEX5.BAS:7083-7115`                                                                                                                      |
| 6-team round-robin fixtures    | `FIXTURE.M2K` last block (5 rows × 6 ints), loaded into `tfxt(1..5,1..6)` at `MHM2K.BAS:880-884`                                                                 |
| Calendar slots                 | `KIERO.M2K` row 47 (`98,1,0` = joulutauko), row 56 (`22,1,11` = EHL final); rows 21-23 (`1,1,3` = invitation window); row 24 (`2,1,7` = NHL CHALLENGE auto-pick) |

---

## 2. The ten Christmas tournaments

| #   | `turnimi(N)`          | Tier-1 prize (`JTn.PLX` line 1) | Prize fall-off (1st..6th, mk)                                                                                                            |
| --- | --------------------- | ------------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | NHL CHALLENGE         |                       4 000 000 | 4 000 000 / 600 / 550 / 500 / 450 / 400 k                                                                                                |
| 2   | NOGIA TOURNAMENT      |                         900 000 | 900 / 700 / 650 / 600 / 550 / 500 k                                                                                                      |
| 3   | MARBORLO TOURNAMENT   |                         800 000 | 800 / 600 / 650 / 600 / 550 / 500 k                                                                                                      |
| 4   | GOGO-COLA CUP         |                         700 000 | 700 / 500 / 450 / 400 / 350 / 300 k                                                                                                      |
| 5   | SÖNERÖ-TURNAUS        |                         400 000 | 400 / 275 / 250 / 200 / 250 / 200 / 150 k (file has 7 lines — bug; only 6 are read into `palki(1..6)`, the trailing `150000` is ignored) |
| 6   | SUSIRAJA-TURNAUS      |                         250 000 | 250 / 200 / 150 / 125 / 100 / 75 k                                                                                                       |
| 7   | HIRVIKOSKI-PÄIVÄT     |                         170 000 | 170 / 125 / 100 / 75 / 60 / 45 k                                                                                                         |
| 8   | NÄRPIÖN HOKI-VESTIVAL |                         150 000 | 150 / 100 / 80 / 60 / 40 / 30 k                                                                                                          |
| 9   | AAVASAKSA OPEN ICE    |                         100 000 | 100 / 50 / 30 / 25 / 20 / 15 k                                                                                                           |
| 10  | KIVESJÄRVI CUP        |                          80 000 | 80 / 60 / 40 / 30 / 20 / 10 k                                                                                                            |

Note the non-monotonic prize ladder in JT3 (slot 3 > slot 4 reversed:
600/650) and JT5 (200/150 inversion + 7th line). Almost certainly
typos in the original; preserve in port but flag as `// QB data
anomaly: prize ladder non-monotonic, see TOURNAMENTS.md`.

The names are **all parody product / place names**. Preserve verbatim
in cp850 → UTF-8:

- NOGIA = Nokia parody
- MARBORLO = Marlboro
- GOGO-COLA = Coca-Cola
- SÖNERÖ = Sonera (Finnish telecom)
- HIRVIKOSKI / KIVESJÄRVI / AAVASAKSA = absurd Finnish place names
- NÄRPIÖ = real, but in mock-Swedish "HOKI-VESTIVAL" (hockey festival)

### EHL final

| Name               | Prize ladder (1st..6th, mk)         |
| ------------------ | ----------------------------------- |
| EHL:N LOPPUTURNAUS | 800 / 500 / 475 / 450 / 425 / 400 k |

`tnimi(1)` for the EHL final is hard-coded to `"EHL:N LOPPUTURNAUS"`
at `ILEX5.BAS:1344` (no DATAX entry). The first-place 800 k is on top
of the EHL group-stage qualifier payout (sponsor slot 9 via
`annarahaa 9` at `ILEX5.BAS:1331`) and the eventual European-champion
payout (sponsor slot 8 via `annarahaa 8` at `ILEX5.BAS:1361`).

---

## 3. Eligibility — who can be invited?

Each human manager `pv` has a season-achievement score
`sed(u(pv))` ([VARIABLES.md `sed/sedd/seddd` row](VARIABLES.md)). A
**lower** `sed` is better (best=1, worst=48).

`TKUTSU.M2K` is the 48-row threshold table mapping
`sed → minimum tournament tier visible`:

```
sed →   1   2-5   6-10  11-17  18-23  24-29  30-34  35-40  41-46  47-48
tier →  1     2      3      4      5      6      7      8      9     10
```

In `SUB kutsuturnaus`:

```basic
IF sed(u(pv)) < 49 THEN d = tkutsux(sed(u(pv))) ELSE d = 48
kurso = d
...
FOR zz = d TO 10
  PRINT turnimi(zz)
NEXT zz
```

The manager is shown tournaments `d..10` and picks one (or ESC =
decline). The choice is stored as `mukt(pv) ∈ {0..10}` (0 = declined
/ not invited / will get a rest day).

**Consequences:**

- The best teams (sed=1) see all 10 tournaments and can self-select
  the most prestigious.
- The worst teams (sed=47..48) only ever see KIVESJÄRVI CUP.
- A team can always go _down_ in prestige (better team picks the
  small KIVESJÄRVI prize). The game does not gate that.
- Multiple humans CAN pick the same tournament — they all get seeds
  and the AI fills the remaining slots.

### `sed` semantics — TODO confirm

`sed` is **achievement / ranking**, computed during the end-of-season
flow. Cross-check the formula in `ILEZ5.BAS` before porting (it's the
same variable used for press / board rep — best=1, worst=48). The
TKUTSU thresholds suggest it's a stable league-wide ranking integer.

---

## 4. Invitation window — when are invitations sent?

**Rounds 21, 22, 23** of the regular season, all flagged
`kiero3(kr) = 3` in `KIERO.M2K`. Each of those rounds:

- `SUB piirtox` displays a flashing "POSTIA! L: TURNAUSKUTSU" banner
  if `mukt(pv) = 0` ([ILEX5.BAS:4157](../ILEX5.BAS) → `SUB postia 1`).
- Pressing `L` opens `SUB kutsuturnaus`
  ([ILEX5.BAS:406](../ILEX5.BAS)).
- Pressing ESC inside `kutsuturnaus` sets `mukt(pv) = 0` (still
  pending). Pressing ENTER commits the highlighted tier and exits.

**Validity:** invitations are open as long as `mukt(pv) = 0` AND
`kiero3(kr) = 3`. Once round 24 starts (`kiero3 = 7`, NHL CHALLENGE
auto-pick), the door closes and `kutsuturnaus` is no longer
reachable. A `mukt` value set in any of rounds 21–23 persists until
the Christmas break consumes it.

**Net invitation window: 3 game rounds (~3 weeks).**

There is no notion of "the host withdraws if you wait too long" —
the invitation is open until you accept or the window closes.

### NHL CHALLENGE forced invitation (`SUB tarkistanhlc`, round 24)

After invitations close, the highest-ranked PHL team gets a forced
NHL CHALLENGE seat:

```basic
FOR xx = 1 TO 5
  IF ohj(karki(xx)) = 0 THEN tietos = karki(xx) : EXIT SUB   ' AI top team → free seat
  IF ohj(karki(xx)) <> 0 AND mukt(ohj(karki(xx))) = 1 THEN EXIT SUB
  ' else: ask the human ranked #xx whether they want NHL CHALLENGE
  pv = ohj(karki(xx))
  IF me$ = "k" THEN mukt(pv) = 1 : EXIT SUB
NEXT xx
```

`karki(1..5)` = PHL top 5 at the time of round 24
([STATUS.md "league-leader array"](STATUS.md) for cross-ref).

- If the PHL leader is AI: `tietos = leader`, that team takes
  tx(1) at Christmas, no human prompt.
- If the PHL leader is human and already chose NHL CHALLENGE: done.
- Otherwise walk top-5 humans in standings order, asking
  yes/no (`leq 4`, `wnd 2`). First "k" wins.
- If nobody accepts, `tietos = 0` and the NHL CHALLENGE field is all
  AI seats (`b = 64 + cupex` → team indices 65..70 = last foreign EHL
  champion + 5 NHL teams).

After the joulutauko runs, `tietos = 0` is restored
([ILEX5.BAS:2322](../ILEX5.BAS)).

---

## 5. Seeding — how `tx(1..6)` is built

`SUB joulutauko` runs the 10 tournaments in **reverse tier order**
(`FOR qwe = 10 TO 1 STEP -1`). For each tournament `qwe`:

1. Load `JT<qwe>.PLX` into `palki(1..6)` via `maarpalk`.
2. Tournament name = `turnimi(qwe)`.
3. `lusmux(qwe)` (next free seat index) starts at 1.
4. **Human seeds.** Walk `zz = 1..plkm`. If `mukt(zz) = qwe`, put
   that team into `tx(lusmux(qwe))` and bump the cursor.
   `naaturnaus = 1` is set when at least one human is seeded — this
   flag controls whether the player sees the tournament UI at all
   (see §8).
5. **NHL CHALLENGE forced seat.** If `qwe = 1` AND `tietos > 0`,
   overwrite `tx(1) = tietos` and bump cursor. Guarded so it only
   happens when no human took the NHL CHALLENGE invitation
   (`tarkistanhlc` skips humans that already chose `mukt=1`).
6. **AI fillers.** For `cupex = lusmux(qwe)..6`, roll a random team
   index `b` per the per-tier pool below; reject if already seeded
   (`turnax(b) = 1`); else seat it.

The `turnax(1..86)` bitmap prevents the same team showing up in two
tournaments in the same Christmas break (seeded with `tietos` and
all human-managed teams up front, then updated as we seat).

### AI fill pools per tier

`x(rank)` = team index sorted by `sr` (cross-league strength rank)
— see [VARIABLES.md `x()` row](VARIABLES.md). Slots 49..65 = foreign
EHL champions (`muutmestarit` at `MHM2K.BAS:1558-1611` fills these
from `TEAMS.FOR`). Slots 66..70 = NHL teams (`TEAMS.NHL`). Slots
71..86 = mutasarja teams (`TEAMS.ALA`).

| Tier | Tournament            | Random roll                             | Pool                                                                   |
| ---- | --------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| 1    | NHL CHALLENGE         | _none_ — `b = 64 + cupex`               | 65..70 (last foreign EHL champ + 5 NHL teams), deterministic sweep     |
| 2    | NOGIA TOURNAMENT      | 40% top-5 PHL, 60% foreign              | `x(1..5)` or `49..65`                                                  |
| 3    | MARBORLO TOURNAMENT   | 50% top-12 PHL, 50% foreign             | `x(1..12)` or `49..65`                                                 |
| 4    | GOGO-COLA CUP         | 70% top-12 PHL, 30% slot 5..16          | `x(1..12)` or `x(5..16)`                                               |
| 5    | SÖNERÖ-TURNAUS        | 20% top-12 PHL, 80% slot 13..24         | `x(1..12)` or `x(13..24)`                                              |
| 6    | SUSIRAJA-TURNAUS      | 50% slot 12..23, 50% slot 25..48        | `x(12..23)` (mid-PHL / top-divari) or `x(25..48)` (divari + mutasarja) |
| 7    | HIRVIKOSKI-PÄIVÄT     | 25% slot 12..23, 75% slot 25..48        | same pools as tier 6, weighting flipped                                |
| 8    | NÄRPIÖN HOKI-VESTIVAL | 70% slot 25..48, 30% mutasarja (71..86) | `x(25..48)` or `INT(16*RND)+71`                                        |
| 9    | AAVASAKSA OPEN ICE    | 25% slot 25..48, 75% mutasarja          | same pools as tier 8, weighting flipped                                |
| 10   | KIVESJÄRVI CUP        | _none_ — pure mutasarja                 | `INT(16*RND)+71` only                                                  |

Pattern: tier 1 is the only one that pulls NHL teams; tier 10 is the
only one with mutasarja-only. Tiers 2–9 form a smooth ladder from
"strong PHL / foreign EHL champions" down to "mutasarja". Higher
tiers mix foreign teams in (49..65); the only "pure domestic" tiers
are 4–9.

There is **no formal bracket / seeding** beyond seat order: humans
take the lowest free seats, then AI fills upward, then `tfxt` pairs
them as `tx(1)`–`tx(2)`, `tx(3)`–`tx(4)`, `tx(5)`–`tx(6)` in round 1
and rotates around `tx(1)` for rounds 2–5 (classic 6-team
round-robin from `FIXTURE.M2K`):

```
Round 1: 1-2  3-4  5-6
Round 2: 1-3  2-6  4-5
Round 3: 1-4  2-5  3-6
Round 4: 1-5  2-3  4-6
Round 5: 1-6  2-4  3-5
```

So humans land at the front of the rotation. Two humans in the same
tournament always meet in round 1 (1v2), regardless of strength.

---

## 6. EHL final tournament — separate qualification path

The EHL final ("EHL:N LOPPUTURNAUS", `kiero=22`) is plumbed through
the same `SUB turnaus` engine but **does not use invitations**.

### Qualification (`SUB ehllopturmaar (1)`, after EHL group stage)

The EHL group stage is **5 groups of 4** (`es / ex / ep / egf / ega`
arrays, `staulehlmaar` printer at `staulnaytehl`). Triggered when
all 6 group rounds are played (`IF eot = 6 THEN ehllopturmaar 1` at
`ILEX5.BAS:1679`).

Qualifiers:

1. **Five group winners.** For each `qwe = 1..5`, find the team with
   `es = 1` (1st in group) → `elt(qwe) = ex(...)`.
2. **Best runner-up.** Cross-group comparison of all five
   `es = 2` teams. Sort by `ep` (points), then goal difference
   (`egf - ega`), then goals-for (`egf`). The single winner of this
   comparison becomes `elt(6)`.

For each qualifier, set `muke(pv) = 1` (human flag → "playing the
EHL final round"). Disburse sponsor money:

- Qualifiers: `annarahaa 9` (sponsor slot 9 = "PÄÄSY EHL-LOPPUTURNAUKSEEN")
  per [SPONSORS.md](SPONSORS.md). Clear slot 18.
- Non-qualifiers: `annarahaa 18` (penalty). Clear slots 8 and 9.

### Execution (`SUB ehllopturmaar (2)`, round 56)

```basic
maarpalk "elt"
tnimi(1) = "EHL:N LOPPUTURNAUS"
FOR xx = 1 TO 6 : tx(xx) = elt(xx) : NEXT xx
naaturnaus = 1
turnaus
```

Then winner is `tx(xx)` where `ts(xx) = 1` after the final standings
sort. That team becomes `emestari` (Euroopan mestari, season-long
display flag). `annarahaa 8` (sponsor slot 8 = European championship
payout) to the champion's manager if human. `muke(pv) = 0` reset for
all humans after the cup ceremony.

The pysti2 (trophy) screen shows for human champions only.

---

## 7. The play engine (`SUB turnaus`)

Compact loop, `tkr = 1..5`. For each tournament round:

1. Clear `gl(tx(xx))` and `ja(tx(xx))` per seat.
2. If `naaturnaus = 1` (there's a human seed): print fixtures with
   `ont 2` (prediction prompt UI), let humans pick winners
   (Toto-style coupons), then advance with `pjn` (press any key).
3. For each fixture, `ottpel` (match), `otmuut 4` (post-process,
   variant 4 → tournament mode).
4. After all 3 fixtures in the round: print standings via
   `staulturmaar`, `pjn`.
5. Final round (`tkr = 6`): print final standings, **disburse prize
   money** — `raha(ohj(tx(xx))) += palki(ts(xx))` for human seats
   (AI seats don't get cash booked, they have no `raha`). Print
   prize amount in parentheses next to each line.

Standings sort (`staulturmaar`, `ILEX5.BAS:7083-7115`):

- Primary: `tp(xx)` (points).
- Tiebreaker: `tero(xx)` (goal differential, `tero(xx) >= tero(xxx)`).
- No further tiebreaker — head-to-head is ignored, ties land alphabetically by seat number.

`tp` / `tero` are accumulated inside `otmuut 4` per result.

---

## 8. Tournament-specific rules (`turnauz = 1` guards)

When `SUB turnaus` enters, it sets `turnauz = 1`. The match engine
checks this flag in several places to suppress the regular-season
machinery. Restored to 0 on exit (`ILEX5.BAS:7653`).

| Site                  | Effect when `turnauz = 1`                                                                                                                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ILEX5.BAS:3778-3780` | **No intensity bonus.** `inte(zz)=0/2` → `etu` delta is skipped. Already documented in [INTENSITY.md §3](INTENSITY.md).                                                                                                                   |
| `ILEX5.BAS:3799-3817` | **Per-player housekeeping skipped.** No wage payouts (`spe=10` → `raha += 10000`), no `pok`/`pot` increments (point-streak / appearance counters), no injury countdown decrement, no `svu` decrement, no special-token (`spe=4`) effects. |
| `ILEX5.BAS:3929-3936` | **No morale delta from result.** Win/loss/draw doesn't push `mo()` up or down.                                                                                                                                                            |
| `ILEX5.BAS:4038-4042` | **No attendance displayed.** Audience line skipped in match printout (consistent with neutral-venue model — there's no home team to fill an arena).                                                                                       |
| `ILEX5.BAS:4044-4057` | **No coupon betting** — only fires on `kiero=1`, so tournaments never participate.                                                                                                                                                        |

Additional guards _not_ gated on `turnauz` but tied to tournament
rounds:

| Site                                   | Effect                                                                                                                                                                                                                                                                                                      |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ILEX5.BAS:2141`                       | `IF kiero(kr) = 98 OR kiero(kr) = 22 THEN inte(pv) = 1` — **intensity reset to NORMAALI** on tournament rounds, regardless of manager choice. See [INTENSITY.md §"Reset"](INTENSITY.md).                                                                                                                    |
| `ILEX5.BAS:467`                        | `mukax(pv) = 0` if `mukt(pv) = 0` on `kiero=98` — declined-invitation team gets a **rest day** (mukax=0 → no match, players recover via the global `kiero<>99 AND kiero<>4` fitness rule at line 1811).                                                                                                     |
| `ILEX5.BAS:465`                        | `mukax(pv) = 2` only if `muke(pv) = 1` on `kiero=22` — EHL final, only qualifiers play. Non-qualifiers get a rest day.                                                                                                                                                                                      |
| `ILEX5.BAS:3916-3925` (`SELECT kiero`) | **No overtime / no shootout.** OT is wired to `kiero(kr) IN (1, 2)` (regular season, EHL group), `3` (cup, with leg-aggregate check), `40..50` (playoffs). `kiero=22` (EHL final) and `kiero=98` (joulutauko) are not in the list → **ties stand** and contribute 1 point each via `tp += 1` in `otmuut 4`. |

### Not yet modeled / TODO check in port

- No matchday _gala_ / press-day overlay during tournaments (confirmed
  by `kiero3 = 0` on the joulutauko / EHL-final calendar slots).
- **Coaching staff suggestions** (`apulaisvalm`): need to confirm
  they still print during tournament rounds — the `piirtox` call runs
  for both joulutauko and EHL-final action screens. Probably "play
  it safe" generic suggestions only.
- **`uhka` (board pressure)** is not touched by tournament results
  (no morale delta → no board reaction). Cross-check with
  `lopptilanne` / EOS rep updates.
- **Random events / pranks (`jaynat`):** the per-round `actiox`
  setup at `ILEX5.BAS:247` triggers events on every round including
  tournaments. Worth verifying whether jäynät should be enabled on
  Christmas / EHL-final rounds or muted (the original allows them).
- **Sponsor goal counters** (`spox`, `spoz`): these are seasonal
  totals, so tournament results don't move them in either direction.
  But the EHL final winner's `annarahaa 8` is a sponsor payout, not
  a sponsor counter increment. Already covered in
  [SPONSORS.md](SPONSORS.md).
- **National-team duties:** `kiero=97` (maajoukkuetauko) lands at
  rounds 26 and 48, both adjacent to tournament-related rounds.
  No interaction with tournaments.

---

## 9. Variable cheat sheet

| Var                 | Type          | Role                                                                                                        |
| ------------------- | ------------- | ----------------------------------------------------------------------------------------------------------- |
| `turnimi(1..10)`    | STRING        | tournament display names (from `DATAX.M2K`)                                                                 |
| `turnauz`           | INTEGER 0/1   | engine-wide flag: 1 inside `SUB turnaus`, suppresses regular-season machinery                               |
| `turnax(1..86)`     | INTEGER bit   | per-Christmas-break "team already seeded somewhere" bitmap                                                  |
| `tkutsux(1..48)`    | INTEGER       | `sed → minimum visible tier` lookup (from `TKUTSU.M2K`)                                                     |
| `naaturnaus`        | INTEGER 0/1   | "at least one human seat in this tournament" flag → controls UI prompting                                   |
| `tnimi(1)`          | STRING        | single-slot scratch for current tournament name (joulutauko sets it per `qwe`, EHL final hard-codes)        |
| `tx(1..6)`          | INTEGER       | seat → team-index mapping for the current tournament                                                        |
| `ts(1..6)`          | INTEGER       | seat → final-standings rank (1 = winner) after `staulturmaar`                                               |
| `tp(1..6)`          | INTEGER       | seat → points in current tournament                                                                         |
| `tero(1..6)`        | INTEGER       | seat → goal differential                                                                                    |
| `tfxt(round, slot)` | INTEGER       | 5×6 fixture table for 6-team round-robin (from `FIXTURE.M2K`)                                               |
| `tkr`               | INTEGER       | current tournament round (1..5, then 6 = "show finals + payouts")                                           |
| `palki(1..6)`       | LONG          | prize money for placements 1..6 (loaded per-tournament by `maarpalk`)                                       |
| `mukt(pv)`          | INTEGER 0..10 | human's chosen tournament tier (0 = declined / not yet chosen)                                              |
| `muke(pv)`          | INTEGER 0/1   | human qualified to EHL final tournament (set in `ehllopturmaar 1`)                                          |
| `mukax(pv)`         | INTEGER 0/2   | this round: 0 = rest day, 2 = play. Computed at `ILEX5.BAS:459-472` per `kiero`.                            |
| `tietos`            | INTEGER       | NHL CHALLENGE forced seat (top PHL AI team, set by `tarkistanhlc`, consumed in `joulutauko`, cleared after) |
| `elt(1..6)`         | INTEGER       | EHL final qualifiers in order (5 group winners + 1 best runner-up)                                          |
| `emestari`          | INTEGER       | season-long European-champion team index (set by `ehllopturmaar 2`)                                         |
| `karki(1..5)`       | INTEGER       | PHL top-5 (used by `tarkistanhlc` for the NHL CHALLENGE forced invitation)                                  |

### Persistence

`mukt(tt)` and `mukc(tt)` are written per-team in the human save
record at `ILEX5.BAS:7253-7254`, between `automat` and `kapu`. `muke`
ditto at the same line. `tietos`, `elt(…)`, `emestari`, `karki()`
are short-lived scratch — they only need to survive within a single
round flow (mid-round saves do persist them since QB writes the full
COMMON SHARED block).

---

## 10. Notable behaviours / quirks

1. **Iteration order is tier 10 → tier 1.** `joulutauko` processes
   KIVESJÄRVI first and NHL CHALLENGE last. This matters only if you
   simulate it linearly and observe the `turnax` bitmap filling up —
   high-tier picks happen against an already-thinned pool. In
   practice the pool overlap is small (tier 10 only touches 71..86,
   tier 1 only touches 65..70) so no cross-contamination.
2. **Mid-tier mutasarja flow.** Tiers 7–9 are the only place a
   mutasarja team gets a payday. Combined with the inverse `sed`
   ladder, weak managers can occasionally bank ~150 k at HIRVIKOSKI
   if they ace the round-robin against random foreigners.
3. **NHL CHALLENGE is the only tournament with an explicit
   auto-invitation.** All others are pure opt-in. This makes
   NHL CHALLENGE structurally different and worth modelling as a
   distinct event in the port.
4. **The "tx(1) overwrite" quirk** at `ILEX5.BAS:2289`: if both
   `tietos > 0` AND a human chose NHL CHALLENGE, the human's seat in
   `tx(1)` is silently overwritten. `tarkistanhlc` is meant to
   prevent this (it bails if any top-5 human has already chosen
   `mukt=1`), so the bug doesn't normally manifest. **Port should
   guard explicitly** rather than relying on the upstream guard.
5. **No bracket / seeding within a tournament.** The 6 seats are
   filled in arrival order (human → forced → AI) and paired by a
   static fixture table. Two humans in the same tournament always
   meet in round 1.
6. **Ties stand in tournament play.** No OT, no shootout. 1 pt each
   for a draw. This makes goal-differential tiebreaks decisive.
7. **The `naaturnaus` flag elides UI for AI-only tournaments.** If
   no human signed up for a tier, the round-robin still runs (so
   AI standings update and prize money is "paid" to AI teams as a
   no-op), but the player never sees the screen.
8. **MHM 97 had ~3 tournaments; MHM 2000 has 11.** The current TS
   port in [src/data/tournaments.ts](../../data/tournaments.ts) is
   MHM-97-era — Christmas Cup / Go-Go Cola Cup / Cacca Cup — and
   should be **replaced wholesale**, not extended.

---

## 11. Port plan sketch

When the time comes to port (Phase 3, post-shakedown):

1. **Decode `sed`** from `ILEZ5.BAS` end-of-season SUBs — it's the
   linchpin of the eligibility model.
2. **Drop the current `tournamentList`** in
   [src/data/tournaments.ts](../../data/tournaments.ts). Replace
   with a typed `TournamentDefinition` per QB tier (10 entries +
   the EHL final = 11 records), each carrying:
   - `id` ("nhl-challenge", "nogia", … "ehl-final")
   - `name` (Finnish, verbatim)
   - `tier: 1..10 | "ehl-final"`
   - `prizes: [number, number, number, number, number, number]`
   - `aiFillPool: (ctx) => TeamId[]` (deterministic given seed +
     standings)
3. **One competition** in `CompetitionDefinition` for
   "joulu-turnaus" (groups the 10) plus one for "ehl-lopputurnaus".
   Both use the same neutral-venue 6-team round-robin sub-engine.
4. **Calendar slots:** new MHM 2000 calendar lands rounds 21–23 as
   the invitation window, round 47 as joulutauko, round 56 as EHL
   final. (See open work in [STATUS.md](STATUS.md) — the calendar
   port is its own task.)
5. **Reuse the `CompetitionDefinition.groupEnd` hook** for the
   "qualify 5 winners + best runner-up" logic on the EHL group
   stage; cleaner than special-casing inside the game machine.
6. **Tournament-mode flag.** A `inTournament: boolean` field on the
   match-simulation input is the moral equivalent of `turnauz`. All
   the QB sites in §8 become guards on this flag in
   `simulate-match.ts` / post-match handlers.
7. **Intensity reset on tournament rounds** (§8) needs a hook on
   round transitions, not in the match itself.

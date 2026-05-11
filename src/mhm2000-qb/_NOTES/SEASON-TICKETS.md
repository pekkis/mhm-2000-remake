# MHM 2000 — Season Tickets (`kausikorttimaar`)

Deep decode of `SUB kausikorttimaar` (`ILEX5.BAS:2507-2556`).
See also [ARENAS.md §8](ARENAS.md) for the formula pseudocode.

---

## 1. When does it run?

`kausikorttimaar` is called from the main round dispatch at
`ILEX5.BAS:1783-1791`:

```basic
SELECT CASE kiero(kr)
CASE 99
  kausikorttimaar            ' preseason idle rounds (no games)
CASE 4
  kausikorttimaar            ' preseason practice games
  gameday
  ...
```

The calendar (`KIERO.M2K`) has:

| Rows | `kiero` | Count | Phase                                         |
| ---- | ------- | ----- | --------------------------------------------- |
| 1-6  | 99      | **6** | Preseason — idle rounds, no games             |
| 7-10 | 4       | **4** | Preseason — practice games (harjoitusottelut) |
| 11+  | 1       |       | Regular season begins                         |

So `kausikorttimaar` runs **10 times during the preseason** — all
before the regular season starts. The 6 `kiero=99` rounds sell
tickets without games; the 4 `kiero=4` rounds sell tickets AND
play practice matches. Each invocation sells a fresh batch of `d`
tickets (accumulating via `kausik(xx) += d`), and pays the manager
`d × lhinta(sr) × 22` per batch.

The `× 22` payment covers 22 regular-season home games that are
**all still ahead** — perfectly logical timing.

The `kausik` counter is reset to 0 once per year in `SUB uusikausi`
(`ILEX5.BAS:7721`).

---

## 2. Who gets tickets?

The loop runs `FOR xx = 1 TO 48` — all 48 base league teams,
regardless of whether they have a human manager.

- **All teams** accumulate `kausik` (affects per-game seated
  availability in regular-season attendance).
- **Only teams with a coach** (`ohj(xx) <> 0`) book revenue
  (`raha(coach) += d * lhinta * 22`).
- AI teams with an assigned AI manager also get revenue.

---

## 3. The formula

```
remaining_seats = paikka(2, xx) * 100 - kausik(xx)
sin1 = (sed*2 + sedd + seddd) / 4              ' weighted 3-season position
c    = 110 / 85 / 50  by league (PHL/Div/Mut)
sin2 = 8 - sin1                                ' form surplus

if sin2 > 0:    ' good form
    d    = c ^ (1 + sin2/50)
    sin3 = 1 + (taso - 3) * (0.005 + sin2/200)
else:           ' poor form
    d    = c ^ (1 + sin2/100)
    sin3 = 1 + (taso - 3) * 0.005

d  = d ^ sin3                                  ' comfort tier multiplier
d *= 1 + mtaito(5, man) * 0.02                 ' manager attribute 5 (marketing?)
if has_coach: d *= 1 + (avg(3, coach) - 10)/50 ' coach charisma
d  = 0.95*d + 0.1*RND*d                        ' ±5% noise
d += INT(3*RND) - 1                             ' ±1 jitter
if d > remaining_seats: d = remaining_seats     ' cap

if has_coach:
    if boikotti(coach) > 0: d *= 0.8            ' fan boycott penalty
    raha(coach) += d * lhinta(sr) * 22          ' up-front payment for 22 home games

kausik(xx) += d
```

### Key scaling factors

| Factor                 | Effect                                                 | Source           |
| ---------------------- | ------------------------------------------------------ | ---------------- |
| League tier            | PHL base 110, Div 85, Mut 50                           | Hardcoded        |
| 3-season form (`sin1`) | Exponential scaling — good form compounds aggressively | `sed/sedd/seddd` |
| Comfort tier (`taso`)  | Multiplier; tier 6 is substantially better than tier 1 | `taso(xx)`       |
| Manager attribute 5    | ±6% range (attribute -3..+3 × 0.02)                    | `mtaito(5, man)` |
| Coach charisma         | `avg(3)` of 14 → +8%, of 6 → -8%                       | `avg(3, ohj)`    |
| Boycott                | -20% if `boikotti > 0`                                 | `boikotti(ohj)`  |
| Noise                  | ±5% band + ±1 integer jitter                           | `RND`            |

---

## 4. Interaction with gate revenue

Season-ticket holders affect gate revenue differently by round type:

### Regular season (`kiero = 1`)

```
seated_revenue = (ylm(2) - kausik) * lhinta(sr)   ' subtract season-ticket holders
```

Season-ticket holders already paid up front → they don't pay per game.
They DO occupy seats (counted in `ylm(2)`) but generate zero per-game
ticket revenue. Net effect: season tickets are pre-paid revenue, not
extra revenue.

### All other round types (`kiero ≠ 1`)

```
seated_revenue = ylm(2) * lhinta(sr)              ' everyone pays full price
```

`kausik` is NOT subtracted. Every spectator pays. Season-ticket
holders presumably buy a separate playoff/cup ticket.

### Attendance calculation (`ylmaar`)

In `SUB ylmaar`, for regular season (`kiero = 1`):

```
ylx(9,1) = min(base_attendance, paikka(2)*100 - kausik)  ' available seats
ylm(2)   = ylx(9,1) + kausik                             ' add season-ticket holders back
```

Season-ticket holders occupy their seats guaranteed; remaining seated
capacity is available for walk-up ticket sales. Standing is overflow.

---

## 5. `kiero=4` = preseason practice games

Previously misidentified as "pre-playoff" rounds. Your playtest
confirmed: money does NOT change during the playoff transition
rounds. `kiero=4` appears at calendar rows 7-10, **right after**
the 6 preseason `kiero=99` rows and **before** the regular season.

Playoff rounds are `kiero=41/43/45` (handled by `playoffplajays`,
NOT `gameday`). The `kiero=4` rounds call `gameday` — these are
preseason practice/training matches (harjoitusottelut).

The `× 22` payment is therefore completely sound: all 22 regular-
season home games are still ahead when the tickets are sold.

---

## 6. Port plan

Port `kausikorttimaar` as-is. The 10-pulse preseason window
(6 idle + 4 practice games) is clean design — no anomalies.

### State requirements

Add to `BaseTeam`:

- `seasonTickets: number` — maps to `kausik(t)`. Reset to 0 at
  season start. Accumulated by the season-ticket drive function.

The drive function should be a pure function
`(team, league, form, manager, coach, random) → { ticketsSold, revenue }`
called from the appropriate calendar phases.

---

## 7. Cross-references

- [ARENAS.md §8](ARENAS.md) — formula pseudocode
- [ARENAS.md §9](ARENAS.md) — gate revenue, `kausik` subtraction
- [ARENAS.md §7](ARENAS.md) — `ylmaar` attendance, `kausik` seat reservation
- [VARIABLES.md `kausik(t)`](VARIABLES.md) — variable declaration
- [VARIABLES.md `lhinta(1..3)`](VARIABLES.md) — ticket prices
- [ATTRIBUTES.md](ATTRIBUTES.md) — `mtaito(5)` marketing attribute
- [SUBS.md `kausikorttimaar`](SUBS.md) — one-liner summary

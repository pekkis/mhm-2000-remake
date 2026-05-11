# MHM 2000 — Arenas

Full decode of arena ownership, building/renovation, and the
attendance + gate-revenue pipeline. The arena system spans three
files: `MHM2K.BAS` (allocation + static table load), `ILES5.BAS` (the
utility-screen flow `areena` + `remppa`), and `ILEX5.BAS` (per-round
construction progression, gameday attendance and gate maths, season
tickets, the rare-event hooks).

Cross-refs throughout to [VARIABLES.md](VARIABLES.md),
[SUBS.md](SUBS.md), [DATA-FILES.md](DATA-FILES.md).

---

## 1. Data model

Two parallel state blocks: **persistent per-team** (every team in
the universe owns an arena, including AI/NHL/EHL squads) and
**transient per-human-manager** (a renovation/build project being
designed or in progress).

### 1.1 Per-team static state (`1..86`, where 1..48 are league teams)

Declared in `MHM2K.BAS:182-191`. Persisted in `savetus2.xxx` together
with the rest of the team record (`ILEX5.BAS:7311-7314`).

| Var            | Type            | Units / range                          | Meaning                                                                                                            |
| -------------- | --------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `haln(t)`      | STRING (1..48)  | freeform (`annanhal` caps at 26 chars) | Arena display name. Default `"<city> Areena"` or `"MHM 2000 Areena"` if the wizard input was empty.                |
| `taso(t)`      | INTEGER (1..86) | 1..6                                   | **Viihtyisyystaso** — comfort/amenity tier.                                                                        |
| `ppiste(t)`    | INTEGER (1..86) | ~0..1000s                              | **Tilapisteet** — abstract "space points" budget pool that the standing/seated/box slots are bought from.          |
| `paikka(1, t)` | INTEGER         | "hundreds of seats", i.e. `* 100`      | Standing-place capacity (`seisomapaikat`).                                                                         |
| `paikka(2, t)` | INTEGER         | "hundreds of seats", i.e. `* 100`      | Seated-place capacity (`istumapaikat`). UI everywhere multiplies by 100 before display.                            |
| `paikka(3, t)` | INTEGER         | 0 / 1                                  | Aitiot (luxury boxes / skyboxes) — boolean. Drives the sponsor multiplier (§6.1).                                  |
| `kotiot(t)`    | INTEGER         | home-game counter                      | Home games played this season (used by cup/playoff attendance baseline).                                           |
| `kausik(t)`    | INTEGER         | season-ticket count                    | Season-ticket subscribers carried this season. Reset to 0 in `uusikausi` (`ILEX5.BAS:7721`), refilled preseason.   |
| `ylek(t)`      | LONG            | total spectators this season           | Cumulative regular-season attendance. Used as the cup/playoff/tournament baseline. Reset in `uusikausi` (`:7711`). |

Initial values for the 86 teams come from `TEAMS.*` files: ppiste,
taso, paikka(1..3) are part of the per-team record (`MHM2K.BAS:899`,
`:1574`, `:1602`, `ILEX5.BAS:1767-1768`).

Special-case seed at world-gen: team 49+ (NHL Challenge entrants /
EHL imports) get hard-coded miniature arenas, e.g.
`MHM2K.BAS:2573-2579` for "Loimaan Kunnan Urheilukeskus" with
`ppiste=8, paikka=(6,2,0)`.

### 1.2 Per-human-manager project state (`1..plkm`)

Declared in `MHM2K.BAS:432-438` and `:510`. Persisted in `savetus2.xxx`
(`ILEX5.BAS:7266-7267`). Reset to 0 on team-swap (`ILEZ5.BAS:704`).

| Var                | Type    | Range          | Meaning                                                                                                                                                                                                                                                                 |
| ------------------ | ------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `potti(pv)`        | LONG    | money          | **Arena building fund** — the down-payment kitty. Funded by `SUB areena` transfers from `raha(pv)` and `sattuma` case 59. See [VARIABLES.md `potti()`](VARIABLES.md).                                                                                                   |
| `uppiste(pv)`      | INTEGER | 0..~1.1×ppiste | **Planned** new tilapisteet for the in-design upgrade.                                                                                                                                                                                                                  |
| `utaso(pv)`        | INTEGER | 1..6           | Planned comfort tier.                                                                                                                                                                                                                                                   |
| `upaikka(c, pv)`   | INTEGER | c=1..3         | Planned standing / seated / box slots (same units as `paikka`).                                                                                                                                                                                                         |
| `arkkitehti(pv)`   | INTEGER | 1..3           | Architect quality choice (cheap / mid / expensive). Affects new-build cost, permit-grant speed, permit-denial chance.                                                                                                                                                   |
| `rakennuttaja(pv)` | INTEGER | 1..3           | Builder quality choice (cheap / mid / expensive). Affects cost, construction speed (instalment count), accident risk.                                                                                                                                                   |
| `uhatapa(pv)`      | INTEGER | state encoding | **Construction state machine** — see §4. `0` = idle, `10..100` = permit phase (new-build only), `1001..1999` = build in progress, `2001..2999` = renovation in progress. The exact lo/hi value encodes both the chosen builder tier and the months-remaining countdown. |
| `mpv(pv)`          | LONG    | money / month  | **Monthly instalment** (`maksuerä per vuoro`) drawn from `potti(pv)` every round during construction.                                                                                                                                                                   |

---

## 2. Static reference tables

### 2.1 `DATA/ARENAS.M2K` — comfort-tier cost matrix

Loaded at `MHM2K.BAS:728-734` into `tila(slot 1..3, tier 1..6)`.

```
            tier1 tier2 tier3 tier4 tier5 tier6
seisoma  =     1     2     3     4     5     6     (points per 100 standing places)
istuma   =     4     5     6     7     8     9     (points per 100 seated places)
aitiot   =    -1    -1    -1    20    20    20     (-1 = unavailable, 20 = flat cost)
```

Interpretation (from `SUB remppa` cost loop `ILES5.BAS:413-419`):

```
spent = upaikka(1,pv) * tila(1, utaso(pv))      ' standing cost
      + upaikka(2,pv) * tila(2, utaso(pv))      ' seated cost
if upaikka(3,pv) = 1 then spent *= 1.2          ' boxes = +20% surcharge on top of slot costs
free  = uppiste(pv) - spent                     ' must be >= 0 to "fit"
```

So **boxes only become available at tier 4+**, and add a flat 20%
multiplier on the standing+seated cost. Higher comfort tiers make
every seat slot more expensive in tilapisteet — which is the only
way to motivate the player to ever buy the cheaper tiers.

### 2.2 `DATA/DATAX.M2K` — slot names (`paiknim(1..3)`)

Loaded at `MHM2K.BAS:783-786`. Records 1..3:

```
1  SEISOMAPAIKKOJA   (standing)
2  ISTUMAPAIKKOJA    (seated)
3  AITIOITA          (boxes)
```

### 2.3 `MHM2K.BAS` literals (no data file)

```
ppmaksu(1) = 20000       ' renovation: cost-per-tilapiste ( :457 )
ppmaksu(2) = 10000       ' new build:  cost-per-tilapiste ( :458 )

lhinta(1)  = 20          ' ticket price seated, PHL       ( :52 )
lhinta(2)  = 18          ' ticket price seated, Div       ( :53 )
lhinta(3)  = 15          ' ticket price seated, Mutasarja ( :54 )
                         ' standing tickets always *0.75
```

---

## 3. `SUB areena` — top-level arena screen (`ILES5.BAS:30-113`)

Entered via the utilities CHAIN (`mhm2k → ilex5 ──CHAIN(chainahdus=2)──→
iles5`). The header summarises the current hall and money state:

- **Top right:** `SALDO` = `raha(pv)`, `POTTI` = `potti(pv)`,
  `YHT.` = `raha + potti` (the combined buying power).
- **Left side:** `JÄÄHALLI: <haln>`, comfort tier `taso/6`, capacity
  breakdown via `paiknim()` × `paikka(c,team) × 100`.
- **Three menu rows** at lines 9..11 (`lay 131..133`):
  1. Move money into POTTI.
  2. Plan a **renovation** (`remppa 1`) — locked while a project is active.
  3. Plan a **new build** (`remppa 2`) — locked while a project is active.

If `uhatapa(pv) <> 0`, the lower half (line 18+) renders
"RAKENNUSPROSESSIN TILANNEKATSAUS" (status snapshot), branching on
the state-machine band:

| `uhatapa` band | Status text(s)                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| 10..100        | Architect-typed progress text (`X.MHM` rec 139/140/141 = `lay 138 + arkkitehti`) + `lax 159` (permit phase). |
| 1000..1999     | Builder-typed text + `lax 163` if `potti >= mpv` (on track) else `lax 164` (project paused — funds short).   |
| 2000..2999     | Same shape but `lax 167` / `lax 168` (renovation variants).                                                  |

Action 1 — "MÄÄRITÄ POTTIIN SIIRRETTÄVÄ SUMMA" (`:104-107`) — calls
`tarjousmaar 16, 1, 0, raha(pv)` which clamps `tarjous` to `[0, raha]`,
then `potti += tarjous; raha -= tarjous`. There is **no return path**
from potti back to raha; once money is committed to a build fund it
stays there until either spent on construction or wiped by a team swap.

---

## 4. `SUB remppa` — design wizard (`ILES5.BAS:364-546`)

Single SUB handles both renovation (`rampa=1`) and new-build
(`rampa=2`). Five edit fields navigated by `kurso 1..5`:

1. **TILAPISTEET** — buy more space points (`+`/`-` = ±10, `←`/`→` = ±1).
   For renovation only: clamped to `[ppiste(current), CINT(1.1 * ppiste)]`
   — you can upgrade by max **+10 %** in a single renovation. For a
   new build there's no upper cap and the lower bound is `> 20`.
2. **VIIHTYISYYSTASO** — comfort tier (1..6). Renovation lower-bounds
   at current tier (no comfort downgrades); new build starts at 1.
   3–4. **SEISOMAPAIKAT / ISTUMAPAIKAT** — sliders that step `upaikka(1|2)`.
   Renovation lower-bounds at current count, new build at 0; both upper-bound
   at 300 (so max 30 000 standing, 30 000 seated).
3. **AITIOT** — 0/1 toggle. For renovation must stay `>= current`.

Architect/builder picks are typed letters (a/b/c → `arkkitehti`,
digits 1/2/3 → `rakennuttaja`). For renovation the architect picker
is hidden (line 382 `IF rampa=2`); only the builder matters.

### 4.1 Project quote (`rahna`, `ILES5.BAS:465-475`)

```
if rampa = 1 (renovation):
    rahna = (uppiste - ppiste) * ppmaksu(1)        ' 20 000 per *new* point
    rahna += 1000 * uppiste                        ' + 1 000 per total point baseline
else (new build):
    rahna = uppiste * ppmaksu(2)                   ' 10 000 per point
    rahna *= 0.9 + arkkitehti * 0.05               ' arch 1/2/3 -> 0.95 / 1.00 / 1.05

rahna *= 0.9 + rakennuttaja * 0.05                 ' builder 1/2/3 -> 0.95 / 1.00 / 1.05
```

So a new build is ~half the per-point rate of a renovation **but** a
renovation only pays for the delta (plus a small baseline). Renovating
is cheaper when keeping most of the existing fabric, demolishing-and-
rebuilding makes sense for big jumps.

### 4.2 Greenlight conditions

Pressing ENTER triggers the project iff **all** of:

- `gnome >= 0` — the point-budget fits (standing + seated + box
  multiplier doesn't exceed `uppiste`).
- `potti(pv) >= 0.2 * rahna` — at least 20 % down payment ready in
  the fund.
- `uppiste(pv) > temp%` — strictly greater than current `ppiste`
  (renovation) or hard floor `20` (new build).

If all met, an `e/k` confirmation popup (`wnd 2`); on `e` the wizard
re-enters edit mode.

### 4.3 Project kickoff — set `uhatapa` + `mpv`

```
if rampa = 1 (renovation):
    uhatapa(pv) = 2030 / 2025 / 2020   ' builder 1/2/3 -> 30/25/20 months
    mpv(pv)     = rahna / (uhatapa - 2000)
else (new build):
    uhatapa(pv) = 10                   ' enter permit phase
    mpv(pv)     = rahna                ' total project cost stashed; redistributed when permit lands
```

So the cheap builder takes 30 monthly drawdowns for a renovation,
the expensive one 20 — and is also 5 % more expensive per round, but
construction-accident free (§4.4).

---

## 5. `SUB rstages` — per-round state machine (`ILEX5.BAS:5451-5525`)

Called once at the top of each playable round if `uhatapa(pv) <> 0`
(`ILEX5.BAS:308`). Dispatches on the `uhatapa` band:

### 5.1 Permit phase `10..100` — new build only

```
uhatapa(pv) += arkkitehti(pv)   ' +1/+2/+3 per round, faster with pricier architect
clamp to 100
c = INT(151 * RND)              ' 0..150
if c < uhatapa - 10:            ' probability rises from 0 % at 11 to ~60 % at 100
    ' submit for permit
    d = INT(101 * RND)
    if d < 60 - arkkitehti*20:  ' denial chance: 40 % / 20 % / 0 %
        permit denied, uhatapa = 10   ' restart planning from scratch
        print X.MHM rec 161
    else:
        permit granted, print rec 162
        uhatapa = 1090 / 1080 / 1070  ' builder 1/2/3 -> 90/80/70 months remaining
        mpv = mpv / (uhatapa - 1000)  ' rahna / months
```

Net effect: a cheap architect makes you wait longer for a permit
_and_ gives a 40 % denial chance per submission attempt. The
expensive architect cannot be denied. Architect cost difference is
±5 % of `rahna`. The `lax 159/160/161/162` lines render
architect-specific commentary from `X.MHM` rec 139..141 (one per tier).

### 5.2 Construction in progress `1001..1999` (build) or `2001..2999` (renovate)

```
if potti(pv) >= mpv(pv):
    potti -= mpv
    d = INT(100 * RND) + 1
    if d <= 3 - rakennuttaja(pv):    ' builder 1 = 2 %, 2 = 1 %, 3 = 0 %
        construction accident! X.MHM rec 165 (no other side effect — just narrative)
    if d >= 3 - rakennuttaja(pv):
        uhatapa -= 1                 ' advance one round closer to completion
else:
    project paused (nothing happens this round; areena status text shows rec 164/168)
```

So the per-round drawdown is `mpv`, the cheap builder has a 2 %
chance per round of an "accident" that costs a round (no extra
money — the dance is `d <= … OR d >= …`, never both, so on accident
no progress; on no-accident progress and no `mpv` lost since it was
deducted above the roll either way).

### 5.3 Completion `1000` (new build) / `2000` (renovation)

```
copy planned -> persistent:
    taso(u(pv))      = utaso(pv)
    ppiste(u(pv))    = uppiste(pv)
    for c = 1..3: paikka(c, u(pv)) = upaikka(c, pv)
uhatapa(pv) = 0

if new build:
    annanhal           ' name-your-arena prompt (SUB at ILEX5.BAS:569)
    lax 166            ' completion text
    lax 170 + INT(6 * RND)  ' one of 6 random celebration blurbs
else (renovation):
    lax 169
```

`annanhal` (`SUB ... ILEX5.BAS:569-595`) accepts up to 25 character
keystrokes, stores in `haln(u(pv))`; empty input defaults to
`"<city> Areena"`. The same SUB is also reused at new-game wizard
time for the initial naming prompt.

### 5.4 Team-swap escape hatch

When a manager swaps teams mid-project (`ILEZ5.BAS:706-713`):

```
if uhatapa(pv) <> 0:
    uhatapa(pv) = 0
    taso(new_team)      = utaso(pv)
    paikka(c, new_team) = upaikka(c, pv)   ' for c=1..3
    ppiste(new_team)    = uppiste(pv)
```

i.e. the in-progress plan is **forcibly completed and applied to the
new club for free**. Combined with `potti(pv) = 0` two lines above,
this is a small exploit window: you can plan a luxury arena for a
poor club, then jump to a rich club and the upgrade follows you
fully built. Not necessarily a bug — likely deliberate "you abandon
the project, the new owner finishes it" rationalisation.

---

## 6. Static use of arena state (cross-system hooks)

### 6.1 `tasomaar` strength clamp (`ILEZ5.BAS:1968-1970`)

```
if paikka(1, xx) + paikka(2, xx) < 40:   ' total capacity < 4000
    if tazo(xx) > 27: tazo(xx) = 27       ' team strength capped at 27
```

Small arenas drag the team's `tazo` ceiling down — the only direct
gameplay penalty for never upgrading.

### 6.2 Box bonus on sponsor offers (`ILEX5.BAS:6671`)

```
spp(qwe, cupex) = 0.9 + 0.05 * RND      ' base spread per sponsor slot
if paikka(3, u(pv)) = 1:
    spp(qwe, cupex) += 0.05              ' +5 percentage points across the board
```

Owning **aitiot** (boxes) bumps every sponsor payout multiplier by
0.05 — applied during sponsor-candidate generation in `SUB sponsorit`
(see [SPONSORS.md](SPONSORS.md)). Practically a flat ~5 % boost to all
20 payout slots of whichever sponsor you accept.

### 6.3 Special-event hooks (`sattuma`)

| Case    | Effect                                                                                                                                                                 |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 59      | `potti(pv) += rand(300_000..400_000)` — "concert promoter" windfall earmarked for the construction kitty. See [RANDOM-EVENTS.md](RANDOM-EVENTS.md).                    |
| 107/108 | `rahna = 30 * paikka(2, u(pv)) * 100` then `rah` (deposit) — paid event hire of the seated bowl: 30 mk per seat. Roughly a 60–90k payout for a typical 2–3k seat hall. |

### 6.4 Maine / morale & boycott modifiers

Attendance and season-ticket sales (§7, §8) both reach into the
manager-level flags:

- `boikotti(coach) > 0` → ticket revenue & attendance **× 0.8**.
- `kuume(coach) = 1` → attendance **× 1.2** ("fever / star coach").
- The coach's manager attribute `mtaito(5, …)` (presumably marketing
  / PR — see [ATTRIBUTES.md](ATTRIBUTES.md)) raises season-ticket
  conversion by `1 + mt × 0.02`.
- The coach's general avg `avg(3, coach)` shifts both `kausikorttimaar`
  and base attendance by `1 + (avg(3) - 10) / 50` — i.e. a star
  coach (avg 14) gives +8 %, a dud (avg 6) −8 %.

---

## 7. `SUB ylmaar` — per-match attendance (`ILEX5.BAS:8665-8800`)

Called from `SUB gamedayhaara` four times per round (`:1530, :1560,
:1625, :1659, :1705`) — once per match the human is invested in.
Dispatch on `kiero(kr)` (round-type code):

### 7.1 Regular season (`kiero = 1`)

```
sin1 = (sed(home)*2 + sedd + seddd) / 3        ' weighted 3-season avg position
ylx(2,1) = 12 - sed_or_s(home)                 ' "form" — home pos inverted
ylx(2,2) = 12 - sed_or_s(away)                 ' away inverted

' base, by series:
if sr(home) = 1 (PHL):
    ylx(1,1) = (2000 * (1 + (13 - sin1) * 0.04)) ^ (1 + (taso-3) * 0.015)
    ylx(2,*) uses 12-sed
elif sr(home) = 2 (Div):
    ylx(1,1) = (1000 * (1 + (23 - sin1) * 0.04)) ^ (1 + (taso-3) * 0.01)
    ylx(2,*) uses 24-sed in early rounds (ot<=3), 12-s afterwards
elif sr(home) = 3 (Mut):
    ylx(1,1) = (500 * (1 + (52 - sin1) * 0.04)) ^ (1 + (taso-3) * 0.01)
    only ylx(2,1) is set (12-s)

' coach charisma (avg of attribute 3)
if home has coach: ylx(1,1) *= 1 + (avg(3,coach) - 10) / 50

' form & strength modifiers, by series
ylx(3,1) = ylx(1,1) * (1 + ylx(2,1) * (0.06 | 0.05 | 0.04))
ylx(3,1) *= 1 + (ylx(2,2) - 4|6|8) * (0.07|0.06|0.05)

ylx(4,1) = 0.95 * ylx(3,1) + (0.1*RND) * ylx(3,1)     ' ±5 % noise
ylx(8,1) = ylx(4,1)
```

So PHL has the highest base (2000), Mutasarja the lowest (500); each
comfort tier above 3 multiplies the base exponentially (^0.015 / 0.01).
A 7-point gap between home league position and 13 amplifies by
~25 % per series-tier multiplier in form. Quality of opponent
matters: a top-3 visitor inflates attendance ~50 % vs a relegation
candidate in PHL.

### 7.2 Cup (`kiero = 2`)

```
if home in top-48: ylx(1,1) = 1.15 * (ylek / kotiot)   ' season avg, +15 %
else:               ylx(1,1) = (paikka(1) + paikka(2)) * 100 * 0.95  ' ~sellout
ylx(8,1) = 0.95 * ylx(1,1) + 0.1*RND*ylx(1,1)
```

Cup attendance is anchored to the team's running league average, so
the cup rises with form. Non-league entrants effectively sell out.

### 7.3 Play-out (`kiero = 3`)

```
if home in top-48: ylx(1,1) = ylek / kotiot
else:               ylx(1,1) = 100
ylx(1,1) *= 0.85 + cround * 0.15        ' grows by 15 %-pts per play-out round
ylx(2,c) = sr(team) (or 4 if non-league)
if home_tier < away_tier: ylx(8,1) = (Δ + 1) * base    ' upsets fill the hall
if home_tier > away_tier: ylx(8,1) = base / (Δ + 1)    ' uneven matchup empties it
if equal:                 ylx(8,1) = base
```

### 7.4 Practice games (`kiero = 4`)

```
ylx(1,c) = 5 - sr(team_c)          ' PHL=4, Div=3, Mut=2; 5 for top-66; 1 for 49..65
if home_tier == 1: base = 20
elif home_tier < 5: base = kausik(home)   ' season-ticket count is the floor
else:               base = 3000

b = ylx(1,2) - ylx(1,1)            ' tier delta (home perspective)
if b > 0: base = base ^ (1 + b * sr * 0.04)    ' face an upper-tier opponent: huge bump
if b < 0: base = base ^ (1 + b * (4-sr) * 0.04) ' face a lower one: shrinks
if b == 0: base *= 1 + (13 - s(away)) * 0.015  ' equal tier: scale by opp's pos
ylx(8,1) = 0.95 * base + 0.1*RND * base
```

### 7.5 Tournaments (`kiero = 42 / 44 / 46`)

```
if tempsr(home) < sr(home): ylx(1,1) = (0.7 + pround*0.05) * (ylek / 22)
else:                        ylx(1,1) = (1.0 + pround*0.20) * (ylek / 22)
ylx(8,1) = 0.95 * ylx(1,1) + 0.1*RND * ylx(1,1)
```

22 = canonical regular-season home-game count. So tournament base ≈
season's average gate, scaled by `pround` (tournament round).

### 7.6 Universal post-processing

```
if boikotti(coach) > 0: ylx(8,1) *= 0.8
if kuume(coach)   = 1:  ylx(8,1) *= 1.2

' cap to capacity and split between seated and standing
if kiero = 1:    ylx(9,1) = min(ylx(8,1), paikka(2)*100 - kausik)
else:            ylx(9,1) = min(ylx(8,1), paikka(2)*100)
ylx(10,1) = ylx(8,1) - ylx(9,1)         ' overflow -> standing

' final outputs
if kiero = 1:    ylm(2, home) = ylx(9,1) + kausik       ' add season tickets back
else:            ylm(2, home) = ylx(9,1)
                 ylm(1, home) = ylx(10,1)               ' standing
for c = 1..2:    cap ylm(c) at paikka(c) * 100          ' standing cap too

if kiero = 1:    ylek(home) += ylm(1) + ylm(2)          ' season cumulative
```

Notes:

- `ylm(2, …)` includes season-ticket holders in regular-season games
  (they occupy seats but pay nothing per-game; gate revenue maths
  in §9 subtracts them before applying `lhinta`).
- Standing tickets exist only as **seat overflow** — once the seated
  bowl is full, surplus fans go to standing. There's no logic that
  "prefers" standing; it's a strict waterfall.
- `ylek` (season cumulative) and `kotiot` (home-game count) only
  update for regular-season games — cup, playoff, tournament and
  exhibition attendance don't roll into the per-game-average that
  feeds them.
- `ERASE ylx` at the end — `ylx` is a SUB-local DIM, never persisted.

---

## 8. `SUB kausikorttimaar` — season-ticket drive (`ILEX5.BAS:2507-2556`)

Called from the main round dispatch (`:1787, :1789`) — fires on every
`kiero=99` (6 preseason idle rounds) and every `kiero=4` (4 preseason
practice-game rounds), so **10 times during the preseason**. All
10 pulses happen before the regular season begins. Each invocation
sells a fresh batch and pays the manager immediately. See
[SEASON-TICKETS.md](SEASON-TICKETS.md) for the full deep-dive.

For each of 48 league teams:

```
temp%   = paikka(2)*100 - kausik(xx)               ' seats still saleable
sin1    = (sed*2 + sedd + seddd) / 4               ' weighted 3-season pos
c       = 110 / 85 / 50 by sr (PHL/Div/Mut)
sin2    = 8 - sin1                                 ' success surplus

if sin2 > 0:
    d    = c ^ (1 + sin2/50)
    sin3 = 1 + (taso - 3) * (0.005 + sin2/200)
else:
    d    = c ^ (1 + sin2/100)
    sin3 = 1 + (taso - 3) * 0.005

d *= sin3
d *= 1 + mtaito(5, man) * 0.02                     ' coach attribute 5 bonus
if has coach: d *= 1 + (avg(3, coach) - 10) / 50   ' charisma
d  = 0.95*d + 0.1*RND*d
d += INT(3*RND) - 1                                ' ±1 jitter
if d > temp%: d = temp%                            ' cap at remaining seats

if has coach:
    if boikotti(coach) > 0: d *= 0.8
    raha(coach) += d * lhinta(sr) * 22             ' manager booked 22-game revenue
kausik(xx) += d
```

Key facts:

- The **manager is paid up-front** for every new season ticket: 22
  games × per-seat price, all dropped into `raha` immediately.
- `kausik` accumulates (`+=`) inside a single season — running both
  pre-season and pre-playoffs adds another sales pulse. Reset to 0
  in `uusikausi` (`ILEX5.BAS:7721`).
- The seated-cap math is in raw seats, **not hundreds** (`paikka(2)*100`).
- AI teams without a human coach also accumulate `kausik`, they just
  don't book revenue.

---

## 9. Gate revenue and ancillary income (`SUB report`, `ILEX5.BAS:5275-5345`)

After each match where the human team is the home side
(`koti(pv) = 1` and `temp% = 1` after series-mismatch guards), four
lines are added to the post-match financial summary:

```
LIPPUTULOT (ticket revenue):
    if kiero = 1 (regular season):
        seated  = (ylm(2) - kausik(home)) * lhinta(sr)
        standing = ylm(1)             * (lhinta(sr) * 0.75)
    else (cup/playoff/etc):
        seated  = ylm(2)              * lhinta(sr)
        standing = ylm(1)             * (lhinta(sr) * 0.75)
    rahna += seated + standing

RUOKA & JUOMA (F&B):
    sin1 = 0.75 + 0.1*RND
    rahna += sin1 * (ylm(1)+ylm(2)) * (3 + erik(2) * 2)

FANITUOTTEET (merch):
    sin1 = 0.45 + 0.1*RND
    rahna += sin1 * (ylm(1)+ylm(2)) * (4 - sr)        ' 3 mk/head PHL, 2 Div, 1 Mut

OTTELUMAKSU (match fee):
    rahna += sponso(20, pv)                            ' sponsor slot 20
```

- Standing tickets are priced at **75 % of seated** (regardless of
  series).
- Season-ticket holders **do not pay per-game** in regular season
  (subtracted via `(ylm(2) - kausik)`) — they paid up front in `kausikorttimaar`.
  In playoff / cup / tournament games they are not excluded (everyone pays).
- `erik(2, team)` is a per-team special-trait flag for F&B income
  (`erik(2)` bumps the per-head from 3 mk to 5/7/… as it grows).
- Merch decays with series: Mutasarja teams sell 1 mk/head, PHL 3 mk/head.
- `sponso(20, pv)` is the per-match sponsor fee — see [SPONSORS.md](SPONSORS.md).

### 9.1 League prize-pool funding

Inside `SUB ottpel` (`ILEX5.BAS:3697-3700`) the PHL series funnels
gate-revenue equivalents into the season prize pool `ppotti`:

```
if sr(home) = 1:
    ppotti += (lhinta(1) + 2) * ylm(2, home)            ' 22 mk × seated
    ppotti += (lhinta(1) + 2) * 0.8 * ylm(1, home)      ' 17.6 mk × standing
```

Distributed at season end via `POTTI.M2K` percentages to the top 11
(see [VARIABLES.md `ppotti`](VARIABLES.md)).

---

## 10. State machine summary

```
              ┌───────────────────────── new build (rampa=2) ─────────────────────────┐
              │                                                                       │
   IDLE ──────┤   uhatapa = 10 ──── permit phase ────▶ uhatapa = 1090/1080/1070       │
   uhatapa=0  │     +arkkitehti/round, perm-roll       (architect determined)         │
              │     denial → back to 10                builder slows draw rate        │
              │                                                                       │
              │             ┌─────────────────── construction ──────────────────┐     │
              │             │  every round: potti -= mpv; uhatapa -= 1 (98%)    │     │
              │             │  potti < mpv → pause                              │     │
              │             │  ←── 1090/1080/1070 ▶ 1000                        │     │
              │             └──────────┬───────────────────────────────────────┘     │
              │                        ▼                                              │
              │              uhatapa = 1000 → COMMIT (annanhal, copy u*→*, uhatapa=0) │
              └───────────────────────────────────────────────────────────────────────┘

              ┌───────────────────────── renovation (rampa=1) ───────────────────────┐
              │                                                                      │
   IDLE ──────▶ uhatapa = 2030/2025/2020  (no permit phase — instant construction)   │
              │   every round: potti -= mpv; uhatapa -= 1 (98%)                      │
              │   ←── 2030/2025/2020 ▶ 2000                                          │
              │   uhatapa = 2000 → COMMIT (no rename, copy u*→*, uhatapa=0)          │
              └──────────────────────────────────────────────────────────────────────┘

   Off-ramp: TEAM SWAP → forced COMMIT + potti=0 + uhatapa=0 (ILEZ5.BAS:704-712).
```

---

## 11. `X.MHM` records relevant to arenas

(All loaded via `lay`/`lax`/`leq` with the `(N-1)*500` byte offset
convention — see [DATA-FILES.md](DATA-FILES.md).)

| Rec      | Source label / use                                |
| -------- | ------------------------------------------------- |
| 131      | Areena menu row 1 — "siirrä rahaa pottiin"        |
| 132      | Areena menu row 2 — "hallin remontti"             |
| 133      | Areena menu row 3 — "uuden hallin suunnittelu"    |
| 136..138 | Builder descriptions (rakennuttaja 1..3)          |
| 139..141 | Architect descriptions (arkkitehti 1..3)          |
| 159      | Planning phase progress text                      |
| 160      | Permit submitted                                  |
| 161      | Permit denied                                     |
| 162      | Permit granted                                    |
| 163      | Construction in progress                          |
| 164      | Construction paused (potti empty, new build)      |
| 165      | Construction accident                             |
| 166      | New arena complete (precedes `annanhal`)          |
| 167      | Renovation in progress                            |
| 168      | Renovation paused (potti empty)                   |
| 169      | Renovation complete                               |
| 170..175 | 6× random celebration blurb on new-build complete |

Help screen: `qelp 4` (areena) and `qelp 22` (remppa) from
`HELP/4.HLP` and `HELP/22.HLP`.

---

## 12. Port notes (for future-us)

- **Slots are stored as hundreds in QB; the UI displays `* 100`.** Don't
  forget when porting — `paikka(1, t) = 6` means 600 seats, not 6.
- **Tilapisteet** is an abstract design-budget concept. We probably
  want to surface it 1:1 — it's the only knob that links comfort tier
  to capacity choices. Port `tila(slot, tier)` verbatim from
  `ARENAS.M2K`.
- **`uhatapa` is a state machine with parameter packing.** The "low 2
  digits" encode rounds-remaining; the "thousands digit" picks the
  phase (0=idle, 1=building, 2=renovating); the chosen builder
  determines the starting offset. For TS, prefer a discriminated
  union (`{ phase: "permit"|"building"|"renovating"|"idle", roundsRemaining: number, builderTier: 1|2|3, architectTier: 1|2|3 }`)
  and compute the equivalent of `uhatapa` only at save time, if at all.
- **The team-swap free-completion** is plausibly emergent rather than
  designed — flag for design review.
- **`ylmaar` randomness** uses a single `RND` per match for the ±5 %
  noise band; capture in `resolve`, snapshot the rolled count to the
  match payload. Don't recompute in `process`.
- **`kausikorttimaar` runs 10 times during the preseason** (6 idle rounds +
  4 practice-game rounds). All before the regular season. The `× 22`
  payment for 22 home games is perfectly timed. See [SEASON-TICKETS.md](SEASON-TICKETS.md).
- **Coach `mtaito(5, …)` and `avg(3, …)`** are referenced here without
  decoding what attribute slot 5 is — see [ATTRIBUTES.md](ATTRIBUTES.md).
  Provisional guess: slot 5 = marketing/PR (boosts season-ticket sales).
- **Sponsor box bonus is +0.05 flat on `spp(*, *)` multipliers**, not
  on the underlying offer. Apply at sponsor-candidate generation, not
  later.
- **Arena name caps at ~25 chars** (`annanhal` accepts 26 positions
  including the cursor — actual stored length is `kurso - 1`). UTF-8
  may need a longer limit when porting; the QB byte budget was
  cp850 and tight.

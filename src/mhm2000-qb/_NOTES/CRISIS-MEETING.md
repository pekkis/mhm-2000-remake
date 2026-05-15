# Crisis meeting (`SUB kriisipalaveri`) and the team captain (`kapu()`)

> Decode of `SUB kriisipalaveri` (`ILEX5.BAS:2747-2872`), the calling
> menu (`ILEX5.BAS:422`, `:4261-4264`), the three-option picker
> (`ILEX5.BAS:2747-2766`), the text catalog (`DATA/KR.MHM`, 35 records),
> and every captain (`kapu()`) call site across `ILEX5.BAS` / `ILEZ5.BAS`
> / `ILES5.BAS` / `MHM2K.BAS` / `MHM2K.BI`.
>
> **PORTED (2026-05-15).** Full implementation:
>
> - Pure resolve: [src/game/crisis-meeting.ts](../../game/crisis-meeting.ts) (all 3 option paths + no-captain)
> - XState actor: [src/machines/crisisMeeting.ts](../../machines/crisisMeeting.ts) (choosing → narrating → done)
> - UI: [src/components/CrisisActions.tsx](../../components/CrisisActions.tsx)
> - Data: [src/data/crisis.ts](../../data/crisis.ts) (three options, free), [src/data/mhm2000/crisis-meeting-texts.ts](../../data/mhm2000/crisis-meeting-texts.ts) (35 KR.MHM records)
> - Tests: [src/game/crisis-meeting.test.ts](../../game/crisis-meeting.test.ts) (36 tests covering all QB paths)
> - Effects: resolve returns `EventEffect[]` (incrementMorale + playerInjury), interpreted via `applyEffects` in game.ts onDone
> - Guard: `canCrisisMeeting` selector (morale ≤ -6, once-per-round, not bankrupt)

---

## TL;DR

When team morale collapses, the manager can call **one** of three
escalating intervention rituals per round. Each one consumes the
single-shot `kriisi = 0` flag, picks a baseline success probability
derived from the **captain's** age + leadership, perturbs it with the
manager's `mtaito(4, …)` (NEUVOKKUUS / _resourcefulness_), and applies
swingier morale deltas as the option gets harsher.

**No captain → no upside.** Calling the meeting with `kapu(pv) = 0`
prints a single shame line and applies a flat `−kurso` morale loss with
no roll, then exits.

The three options:

| `kurso` | Title (X.MHM 156–158)      | Format            |     Best case (Δmo) |            Worst case (Δmo) |
| ------- | -------------------------- | ----------------- | ------------------: | --------------------------: |
| 1       | `KRIISIPALAVERI`           | locker-room talk  |       +1 / +2 (RND) | 0 (only "talk failed" line) |
| 2       | `ALKOHOLITON SAUNAILTA`    | dry sauna evening | +2, +2, +2 = **+6** |         −1, −1, −1 = **−3** |
| 3       | `KALJAHUURUINEN SAUNAILTA` | wet sauna evening | +3, +3, +3 = **+9** |       −2 −2 −2 (−1) +injury |

Higher options ⇒ more rolls ⇒ bigger swings, both directions.

---

## Trigger conditions

The `K. KRIISI-TOIMENPITEET` menu item shows on the main per-manager
screen iff (`ILEX5.BAS:4261`):

```
mo(u(pv)) <= -6
mo(u(pv)) <> -66      ' team not in "kuollut" frozen state
kriisi = 0            ' single-shot per round
kiero(kr) <> 4        ' not training week
```

The hotkey `K` invokes it (`ILEX5.BAS:422`) with one extra guard:

```
konkurssi(pv) = 0     ' manager not bankrupt
```

`kriisi` is reset to 0 at the top of every round (`ILEX5.BAS:241`),
together with `jaynteh = 0`. So the meeting is **once per gameday per
human manager** — calling `kriisipalaveri` sets `kriisi = 1` and the
menu item disappears for the rest of the round.

---

## SUB kriisipalaveri — annotated

`ILEX5.BAS:2747-2872`. Step-by-step:

### 1. Three-option picker (lines 2747-2766)

```
leq 39                       ' Q.MHM rec 39: header text + CLS
lax 56                       ' X.MHM rec 56: prompt text
haahaa 66                    ' status-bar hint #66 ("ENTER:VALITSE  ESC:PERU")
kurso = 1
DO
  draw 3 menu rows (X.MHM 156, 157, 158) with kurso highlighted
  wnd 1 : ku 1, 1, 3         ' arrow-key vertical cursor 1..3
  IF me$ = ESC THEN EXIT SUB ' bail with no side effect
  IF me$ = ENTER THEN EXIT DO
LOOP
```

`leq` / `lax` / `lay` are 500-byte fixed-record `.MHM` text-print
helpers; see SUBS.md for `lt`. The three menu rows shown:

```
$nKRIISIPALAVERI
$nALKOHOLITON SAUNAILTA
$nKALJAHUURUINEN SAUNAILTA
```

(`X.MHM` records 156 / 157 / 158, decoded.)

### 2. Commit + captain lookup (lines 2767-2773)

```
klearstat 43                 ' clear status bar
LOCATE 12, 1
kriisi = 1                   ' single-shot lock
xx = kapu(pv)                ' captain's roster index (0 = none)
yy = INT(lpl(pv) * RND) + 1  ' random roster index for "@7" placeholder
                             ' (used only by KR.MHM rec 2 — option 1, no captain)
```

`xx` is the global cursor used by every `lt` placeholder substitution,
so any `@1` (player name) inside the printed `KR.MHM` records resolves
to the captain. `yy` likewise resolves `@7`-style "random teammate"
placeholders.

### 3. No-captain bail-out (lines 2774-2780)

```
IF xx = 0 THEN
  lt "kr", 0 + kurso          ' KR.MHM 0/1/2 — shame line per option
  a = -kurso : mor u(pv), a   ' morale -1 / -2 / -3
  pjn                         ' "press any key" page-turn
  EXIT SUB
END IF
```

`KR.MHM` records used:

- **0** — "Kapteenin puutteen ei voi ainakaan sanoa EDISTÄVÄN…
  Kriisipalaverisi jää tuloksettomaksi jo tältäkin pohjalta."
- **1** — dry sauna without captain: "Joukkueeltasi puuttuu jotain
  tärkeää - kapteeni nimittäin. Pelaajat kritisoivat saunaillassa
  omalaatuista johtamistoimintaasi varovaisin äänensävyin."
- **2** — wet sauna without captain: "$j@7$b kiteyttää yleisen
  mielipiteen näin: 'voitko sinä pälliaivo olla ihan hiljaa, ja nimittää
  $nkapteenin$b…'" (`@7` = the random teammate `yy`).

### 4. Captain success score `sin1` (lines 2782-2783)

```
sin1 = ((pel(xx, pv).age + pel(xx, pv).ldr ^ 1.3) / 50)
IF pel(xx, pv).psk < avg(1, pv) THEN sin1 = sin1 * (pel(xx, pv).psk / avg(1, pv))
```

Identical formula to `suosikki(2, …)` ranking (`ILEX5.BAS:7129-7130`,
`:2124-2125`) — the auto-captain pick. Components:

- `pel.age` linear (older captain = better).
- `pel.ldr ^ 1.3` superlinear leadership (`ldr` rolls 1..100 with a
  bell-curve peak around 50; defaults to 6 for editor-blank players).
- Divided by 50 to land in roughly `[0.5, 3.0]` for a competent captain.
- Penalty: if the captain is below team average skill, scale by
  `psk / avg(1, pv)` — a weak captain only gets partial credit.

`sin1` is then plugged into each option's success roll. `sin1` of ~1.0
means a "neutral" captain; >1.5 = clearly above-average; <0.5 = a token
captain who barely qualifies.

### 5. Option 1 — `KRIISIPALAVERI` (lines 2787-2793)

Locker-room talk. **One roll, captain-only.**

```
lt "kr", 4                            ' KR.MHM 4: setup line ("captain joins you")
PRINT
a = 50 + mtaito(4, man(u(pv))) * 10   ' base 50 ± 30 from manager attribute 4
a = a * sin1 ^ 2                      ' captain quality squared
IF 100 * RND < a THEN
  mor u(pv), INT(2 * RND) + 1         ' SUCCESS: +1 or +2 morale
  lt "kr", 5                          ' KR.MHM 5: success ("paineet helpottavat")
ELSE
  lt "kr", 6                          ' KR.MHM 6: failure ("ei vakuuta laisinkaan")
END IF
```

Success-probability examples (capped at 100 in the `100*RND` compare):

| `mtaito(4)` | `sin1` = 0.5 | 1.0 |  1.5 |  2.0 |
| ----------- | -----------: | --: | ---: | ---: |
| −3 (worst)  |           5% | 20% |  45% |  80% |
| 0 (neutral) |          13% | 50% | 100% | 100% |
| +3 (best)   |          20% | 80% | 100% | 100% |

Failure has **no morale penalty**. Option 1 is the safe baby-step:
worst case is "we wasted an evening".

### 6. Option 2 — `ALKOHOLITON SAUNAILTA` (lines 2795-2824)

Dry sauna. **Three independent rolls.**

```
CLS
lt "kr", 7                            ' KR.MHM 7: setup ("rented a sauna…")
PRINT
sin2 = (1 - sin1 ^ 1.5) * 100 + 30    ' captain-quality penalty roll threshold
```

#### Roll A — captain behavior (KR.MHM 8/9/10 vs 11/12/13)

```
SELECT CASE 100 * RND
CASE IS < sin2
  lt "kr", INT(3 * RND) + 9           ' captain misbehaves (KR 9/10/11) — wait, see below
  mor u(pv), -1
CASE ELSE
  lt "kr", INT(3 * RND) + 12          ' captain shines (KR 12/13/14) — see below
  mor u(pv), 2
END SELECT
```

⚠️ **Off-by-one trap.** QB `INT(3 * RND)` returns 0/1/2, so the actual
records read are:

- failure path: `KR.MHM` **9, 10, 11** ("locks himself in", "fetal
  position", "sits alone") — wait, rec 11 is the **success** "rohkaisten
  joukkuetovereitaan". Let me re-read… `INT(3 * RND) + 9` = 9, 10, 11.
  So the failure pool is recs **9, 10, 11**? Re-checking against the
  decoded text:
  - rec 8: "$j@1$b lukittautuu lasten osastolle" — locks self in
  - rec 9: "$j@1$b vajoaa yllättäen sikiöasentoon" — fetal position
  - rec 10: "$j@1$b istuu koko illan pukuhuoneen puolella yksinään" —
    isolation
  - rec 11: "$j@1$b on illan aikana elementissään: hän kulkee ympäriinsä
    rohkaisten…" — **shining**

  So `+ 9` reads 9/10/11 — that means the failure pool gets one
  borderline-positive record (11) mixed in, and the success branch
  (`+ 12`) reads 12/13/14: "tekee parhaansa", "kysytty mies",
  "kannustuspuhe valjuksi" (14 is the manager-failure line, not
  captain). **This is a QB indexing bug** — the file was clearly laid
  out 8/9/10 = bad, 11/12/13 = good — but the `+ 9` / `+ 12` shifts
  swap one record across the boundary on each side.

  When porting: replicate the bug verbatim or fix it cleanly, but
  document the choice. (The classic MHM stance is "preserve verbatim".)

#### Roll B — manager performance (KR.MHM 14/15/16)

```
SELECT CASE 100 * RND
CASE IS <= 20 - mtaito(4, man(u(pv))) * 5
  lt "kr", 15                         ' rec 15: "oma esiintymisesi jää valjuksi"
  mor u(pv), -1
CASE IS >= 80 - mtaito(4, man(u(pv))) * 5
  lt "kr", 16                         ' rec 16: "kiihkomielinen kannustuspuhe… nappiin"
  mor u(pv), 2
CASE ELSE
  lt "kr", 17                         ' rec 17: "kannustava puhe, ei nouse aatumaisiin sfääreihin"
END SELECT
```

`mtaito(4)` shifts both thresholds by ±15 percentage points:

| `mtaito(4)` | Bad < | Good ≥ | Neutral band |
| ----------- | ----: | -----: | -----------: |
| −3          |   35% |    95% |  35–95 (60%) |
| 0           |   20% |    80% |  20–80 (60%) |
| +3          |    5% |    65% |   5–65 (60%) |

Higher-skilled manager: less likely to bomb, more likely to wow.
Neutral band always 60% wide.

#### Roll C — captain absence (KR.MHM 18/19/20)

```
al 6                                  ' SUB al fat=6: try to find a player with ego > 15
                                      ' (60 attempts; lukka=0 if found, else lukka=1)
IF lukka = 0 THEN
  lt "kr", INT(3 * RND) + 18          ' recs 18/19/20: ego player skips/leaves the sauna
  mor u(pv), -1
END IF
```

`SUB al` (ILEX5.BAS:519) randomly picks 60 candidate players and tries
to find one matching the predicate; if found, sets `xx` to that
player's index and `lukka = 0`. fat=6 predicate: **`pel.ego > 15`**,
plus a `100*RND < (ego - 15) * 3` chance check (so `ego` 16 = 3% chance
to qualify, 20 = 15%, 30 = 45%). The "absent ego player" placeholder
`@1` is then the picked player, **not** the captain — `xx` was
overwritten by `al`. (Records 18–20 read as "the captain skips the
sauna", but the printed name comes from whoever `al` selected. This is
the original code's intent, since records 18–20 all use `@1` and
include phrases like "Minulla on muutakin tekemistä".)

If no high-ego player exists (or the chance check fails), no penalty.

#### Net Δmo for option 2

| Outcome           | Captain | Manager | Ego no-show | Δmo |
| ----------------- | :-----: | :-----: | :---------: | --: |
| Best              | shines  |   wow   |    none     |  +6 |
| Typical           | shines  |   meh   |    none     |  +2 |
| Mixed             |   bad   |   meh   |    none     |  −1 |
| Worst (penalties) |   bad   |  bomb   |   absence   |  −3 |

### 7. Option 3 — `KALJAHUURUINEN SAUNAILTA` (lines 2826-2867)

Wet sauna. **Up to four rolls, swingier penalties, possible injury.**

```
CLS
lt "kr", 8                            ' rec 8: setup (yes, this is the same intro as
                                      ' option 2 reads at +1 — confusing labels)
PRINT
```

⚠️ The intro records are also misaligned: option 2 prints rec 7
("VARMISTAT KALJAREKAN", which describes the **wet** sauna), option 3
prints rec 8 (the captain-locks-himself-in line, not an intro). The
intent was clearly recs 6=dry-intro, 7=wet-intro — but the SUB reads
**rec 7** for option 2 (`lt "kr", 7`) and **rec 8** for option 3
(`lt "kr", 8`). The dry-sauna intro at rec 6 ("Vuokraat saunan… enemmän
tai vähemmän karvaisia miehiä") is **never used by this SUB**. Either a
late editorial swap or a real off-by-one. Preserve verbatim.

#### Roll A — assistant manager (KR.MHM 21/22/23)

Only fires if `valb(1, pv) < 4` (KENTTÄPELAAJAVALMENNUS budget tier
< 4, i.e. cheap-coaching tiers 1/2/3).

```
IF valb(1, pv) < 4 THEN
  IF 100 * RND < (4 - valb(1, pv)) * 5 THEN
    lt "kr", INT(3 * RND) + 21        ' recs 21/22/23: assistant manager misbehaves
    mor u(pv), -1
    PRINT
  END IF
END IF
```

Probabilities:

| `valb(1, pv)` (coach budget) | Trigger chance |
| ---------------------------- | -------------: |
| 1 (cheapest)                 |            15% |
| 2                            |            10% |
| 3                            |             5% |
| 4 / 5                        |              0 |

A cheap assistant coach goes feral at the wet sauna. Three flavour
records (21 = drunken raging, 22 = pissing on the kiuas, 23 = arrived
already wasted).

#### Roll B — captain behavior (KR.MHM 24/25/26 vs 27/28/29)

```
sin2 = (1 - sin1 ^ 2) * 100 + 40      ' harsher than option 2
SELECT CASE 100 * RND
CASE IS < sin2
  lt "kr", INT(3 * RND) + 27          ' recs 27/28/29: captain ruins evening by drinking
  mor u(pv), -2                       ' DOUBLE penalty vs option 2
CASE ELSE
  lt "kr", INT(3 * RND) + 24          ' recs 24/25/26: captain shines
  mor u(pv), 3                        ' DOUBLE bonus vs option 2
END SELECT
```

`sin1 ^ 2` (vs `^1.5` in option 2) means a weak captain is much more
likely to crash here. `+ 40` baseline (vs `+ 30`) raises the threshold
floor: even a perfect captain (`sin1 = 2`) has `1 - 4 = -3, * 100 + 40
= -260` → 0% failure chance, but a `sin1 = 1` neutral captain gets
`(1-1)*100+40 = 40%` failure chance (vs option 2's `0*100+30 = 30%`).

#### Roll C — manager performance (KR.MHM 30/31/32)

Same shape as option 2 roll B, but harsher thresholds and bigger
penalties.

```
SELECT CASE 100 * RND
CASE IS <= 30 - mtaito(4, man(u(pv))) * 10
  lt "kr", 30                         ' rec 30: manager fails ("oma pärstäsi aiheuttaa kränää")
  mor u(pv), -2
CASE IS >= 70 - mtaito(4, man(u(pv))) * 10
  lt "kr", 31                         ' rec 31: manager wins ("ottavat sinut joukkoonsa")
  mor u(pv), 3
CASE ELSE
  lt "kr", 32                         ' rec 32: neutral
END SELECT
```

| `mtaito(4)` | Bad ≤ | Good ≥ | Neutral band |
| ----------- | ----: | -----: | -----------: |
| −3          |   60% |   100% | 60–100 (40%) |
| 0           |   30% |    70% |  30–70 (40%) |
| +3          |     0 |    40% |   0–40 (40%) |

`mtaito(4)` swings each threshold by ±30 percentage points (vs ±15 in
option 2). The neutral band stays 40% wide regardless.

#### Roll D — captain ego meltdown + possible injury (KR.MHM 33/34/35)

```
al 7                                  ' SUB al fat=7: ego>15, gnome=5 (vs 3 in fat=6)
                                      ' i.e. ~67% steeper qualifier slope
IF lukka = 0 THEN
  qwe = INT(3 * RND)                  ' 0, 1, or 2
  lt "kr", qwe + 33                   ' recs 33/34/35
  mor u(pv), -2
  IF qwe = 2 THEN                     ' rec 35: the brawl ending
    IF pel(xx, pv).inj = 0 THEN pel(xx, pv).inj = INT(5 * RND) + 3
                                      ' ⇒ 3..7 round injury for the rabble-rouser
    mor u(pv), -1                     ' extra morale hit
  END IF
END IF
```

Records 33/34/35 (decoded):

- 33 — "$j@1$b romahduttaa tunnelman kusipäisyydellään" (close call, no
  fight)
- 34 — "Saunailta menee pilalle" (verbal abuse, no fight)
- 35 — "Saunailta päättyy tappeluun" (the brawl) → `@1` gets a 3..7
  round real injury and the team eats an extra −1 morale.

`xx` here refers to **the player picked by `al 7`**, not the captain
(same as option 2 roll C).

#### Net Δmo for option 3

| Outcome                   |   A |   B |   C |       D | Total |
| ------------------------- | --: | --: | --: | ------: | ----: |
| Dream run                 |   0 |  +3 |  +3 |    none |    +9 |
| Quietly successful        |   0 |  +3 |   0 |    none |    +3 |
| Mixed bag                 |   0 |  -2 |   0 |    none |    −2 |
| Bad sauna                 |   0 |  -2 |  -2 |      -2 |    −6 |
| Worst case (cheap coach + |  -1 |  -2 |  -2 | -2 (-1) |    −8 |
| brawl + 3-7 round injury) |     |     |     |         |       |

---

## The captain (`kapu()`) — full role inventory

`kapu()` is a per-manager `INTEGER` array, one slot per managed team:

```
DIM kapu(1 TO plkm) AS INTEGER         ' MHM2K.BAS:501
COMMON SHARED automat() AS INTEGER, kapu() AS INTEGER, ...
                                       ' MHM2K.BI:130
```

Persisted in the save file (`ILEX5.BAS:7254`, `MHM2K.BAS:1266`).
Stores the **player's roster index** (1..32) within `pel(*, pv)`, not a
stable id — every roster mutation that shifts `pel` indices must also
shift `kapu`. Value `0` = no captain assigned.

### How a captain is set

Three paths:

1. **Manual** — pressing `C` on a contracted, line-rostered player in
   the roster screen (`ILEX5.BAS:2453`):

   ```
   IF me$ = "c" AND kapu(pv) <> sort(kurso) THEN kapu(pv) = sort(kurso)
   ```

   Hotkey hint shows in the status bar (`ILES5.BAS:166`,
   `ILEX5.BAS:1947`):

   ```
   IF pel(sort(kurso), pv).svu > 0 AND pel(sort(kurso), pv).ket > 0 THEN
     PRINT "C:KAPTEENI  ";
   ```

   So eligibility = **on contract** (`svu > 0`) **AND** assigned to a
   line slot (`ket > 0`).

2. **Auto-lineup** — `SUB automa` (`ILEX5.BAS:822`) at lines 892-896:

   ```
   IF automat(pv) = 1 THEN
     FOR zz = 1 TO 3
       IF pel(suosikki(2, zz, pv), pv).inj = 0 THEN
         kapu(pv) = suosikki(2, zz, pv): EXIT FOR
       END IF
     NEXT zz
   END IF
   ```

   Picks the highest-scoring uninjured player from
   `suosikki(2, 1..3, pv)` — the leadership ranking computed by `SUB
suoslis` (`ILEX5.BAS:7129-7130`) using the same
   `(age + ldr^1.3) / 50` formula as the crisis meeting itself.
   **Only fires when `automat(pv) = 1`** (manager has opted into
   auto-lineup); otherwise the manager's manual choice stands.

3. **Default** — at game start, `kapu()` is uninitialized (QB sets to
   0). Until the manager either picks one or enables `automat`, the
   team has no captain. Auto-set CPU teams: never — `automat` is a
   human-only flag.

### How a captain is cleared

Four paths, all defensive:

1. **`SUB ketjuchk`** (`ILEX5.BAS:2571-2582`) — runs after every roster
   change. If the captain is currently injured (`inj <> 0`), drops the
   captaincy:

   ```
   FOR zz = 1 TO lpl(pv)
     IF pel(zz, pv).inj <> 0 THEN
       IF kapu(pv) = zz THEN kapu(pv) = 0
       ...
     END IF
   NEXT zz
   ```

   So if the captain gets hurt, **the team is captainless until the
   manager re-picks**, even after the injury heals.

2. **`SUB klear`** (`ILEZ5.BAS:742-756`) — line-clear utility called
   from chain-management UI. **Always** clears `kapu(pv) = 0` regardless
   of whether the captain was the affected player. So clearing chains
   between seasons drops the captaincy as a side effect.

3. **`SUB poispelaaja (vp%, jp%)`** (`ILEX5.BAS:4875`,
   `ILEZ5.BAS:1733`) — remove-player from roster. Two-step:

   ```
   IF kapu(jp%) = vp% THEN kapu(jp%) = 0           ' captain was the removed player
   ...
   IF kapu(jp%) > vp% THEN kapu(jp%) = kapu(jp%) - 1
                                                    ' shift index down for survivor
   ```

   Both ILEX5 and ILEZ5 carry their own copy. Triggered by trades, free
   agents leaving, retirement, contract release, etc.

4. **No-captain crisis-meeting bail** — does **not** clear `kapu()`,
   just bails out (the captain is already 0 — that's the whole point).

### Where the captain shows up

Beyond the crisis meeting:

| Site                               | What                                     | How captain matters                                                 |
| ---------------------------------- | ---------------------------------------- | ------------------------------------------------------------------- |
| `ILEX5.BAS:669`                    | Per-team status panel                    | Lists "no captain" warning (`lay 16`) when `kapu(pv) = 0`           |
| `ILEX5.BAS:2123`                   | `suosikki` panel (favourites)            | Prints `"C "` next to the captain's row in the leadership-rank list |
| `ILEX5.BAS:5065`                   | Own roster screen                        | Prints `"C "` badge next to captain                                 |
| `ILEX5.BAS:5067`                   | Opponent roster screen                   | Prints `"C"` badge next to opponent's captain                       |
| `ILES5.BAS:166`                    | Status-bar hotkey hint                   | `"C:KAPTEENI  "` when player is eligible                            |
| `ILEX5.BAS:1947`                   | Status-bar hotkey hint (lineup)          | Same as above in alt menu state                                     |
| `ILEX5.BAS:2453`                   | Roster screen `C` keybind                | Manual captain assignment                                           |
| `ILEX5.BAS:894`                    | `SUB automa`                             | Auto-pick captain when `automat(pv) = 1`                            |
| `ILEX5.BAS:2574`                   | `SUB ketjuchk`                           | Clear captaincy if captain injured                                  |
| `ILEX5.BAS:4882, 4889`             | `SUB poispelaaja`                        | Clear/shift captaincy on roster removal                             |
| `ILEZ5.BAS:1740, 1747`             | `SUB poispelaaja` (between-seasons copy) | Same as above                                                       |
| `ILEZ5.BAS:755`                    | `SUB klear`                              | Always clears captaincy on chain wipe                               |
| `ILEX5.BAS:2771`                   | `SUB kriisipalaveri`                     | Captain quality drives meeting success                              |
| `ILEX5.BAS:7254`, `MHM2K.BAS:1266` | Save / load                              | Persisted per managed team                                          |

**No match-engine effect.** The captain is **not** read by `SUB ottpel`
or any chain-strength calculation. Captaincy is purely a meta-state for
crisis interventions, the status warning, and the UI badge — it does
**not** boost morale passively, **not** influence intensity, **not**
affect chain strength.

(Note: `STATUS.md:378` says ban code 18 is "spe=2 + captain". Reading
`ILEX5.BAS:2189` shows `pel.spe = 2 AND pel.ket > 0` — that's
"aggressive specialty AND on a line", **not** captain. STATUS.md is
slightly miswritten — `ket` ≠ `kapu`. Worth a follow-up correction in
that doc, out of scope here.)

### Auto-vs-manual interaction

If the manager **enables** auto-lineup mid-season, `SUB automa` runs
once and forcibly picks a captain from `suosikki(2)` — overwriting any
manual choice. If the manager **disables** auto-lineup, the
last-set captain sticks. There is no "respect manual override" flag.

The `automat(pv)` toggle is on the same screen as the lineup editor and
shown in the status panel (`ILEX5.BAS:675`):

```
LOCATE 38, 44: COLOR 14
IF automat(pv) = 0 THEN PRINT "EI" ELSE PRINT "ON"
```

---

## TS port mapping (sketch, not yet implemented)

A faithful port maps cleanly to existing patterns:

- **`GameContext.team[id].captain?: PlayerId`** — replace the index-based
  `kapu()` with a stable player id. `undefined` = no captain. Fix the
  index-shift bookkeeping by design.
- **Manual assign** — declarative event or direct command on
  `gameMachine` from the roster screen. Guard via a selector
  `canBeCaptain(playerId)` mirroring the QB `svu > 0 AND ket > 0` check.
- **Auto pick** — when `team.autoLineup === true`, after every lineup
  recompute, set `captain` to the highest-scoring uninjured player by
  `(age + ldr ** 1.3) / 50` (skill-penalised below team avg).
- **Cleanup hooks** — clear captain on injury (extend the
  injury-applying reducer), on removal (extend the player-leave
  reducer), and on chain wipe (when the user explicitly clears all
  lines).
- **Crisis meeting** — three-step XState compound state:
  1. `crisisMeeting.choosing` — UI shows the three options gated by
     the same predicate as the menu hint (`canCrisisMeeting`,
     `selectors.ts:460-477`, but with new MHM 2000 conditions
     `morale ≤ -6 ∧ morale ≠ -66 ∧ !meetingHeldThisRound ∧
!bankrupt ∧ kiero ≠ 4`).
  2. `crisisMeeting.resolving` — pure phase function consuming
     `(ctx, captainId, choice, RNG)` and returning a list of
     `EventEffect[]` (one per roll, each carrying its KR.MHM record id
     and morale delta). Random discipline: roll once, snapshot.
  3. `crisisMeeting.notifying` — feed the resulting events into the
     declarative event registry so they render through the existing
     event renderer with the cp850→UTF-8 KR.MHM strings.
- **Single-shot lock** — `roundFlags.crisisMeetingHeld: boolean`
  reset at round start (mirrors `kriisi = 0` at `ILEX5.BAS:241`).
- **No-captain branch** — first thing in resolving: if `captain ===
undefined`, emit one shame event with `Δmo = -choice` and short-circuit.

KR.MHM has 35 records (decoded count = 35, indices 0..34); preserve
verbatim including the `@1` placeholder for the captain (recs 8–13,
17–19, 23–28, 32–34) and `@7` for the random teammate (rec 2). The
QB indexing bugs in option 2 (`+ 9` / `+ 12`) and the option 2/3 intro
swap (rec 7 for dry, rec 8 for wet) should be **preserved verbatim** —
they're load-bearing weirdness. Document in code comments referencing
this note.

---

## File pointers

- `ILEX5.BAS:241` — `kriisi = 0` round reset
- `ILEX5.BAS:422` — `K` hotkey dispatch (with bankruptcy guard)
- `ILEX5.BAS:519` — `SUB al (fat%)` random-player picker
- `ILEX5.BAS:822-896` — `SUB automa`, captain auto-pick
- `ILEX5.BAS:1947` / `ILES5.BAS:166` — `C:KAPTEENI` hotkey hint
- `ILEX5.BAS:2453` — manual `C` keybind in roster
- `ILEX5.BAS:2571-2582` — `SUB ketjuchk`, drop captain on injury
- `ILEX5.BAS:2747-2872` — `SUB kriisipalaveri` (the dragon)
- `ILEX5.BAS:4261-4264` — `K. KRIISI-TOIMENPITEET` menu render
- `ILEX5.BAS:4875-4897` — `SUB poispelaaja` (in-season copy)
- `ILEX5.BAS:7129-7130` — `suosikki(2)` ranking formula (= crisis `sin1`)
- `ILEZ5.BAS:742-756` — `SUB klear`, force-clears `kapu()`
- `ILEZ5.BAS:1733-1755` — `SUB poispelaaja` (between-seasons copy)
- `MHM2K.BAS:501` / `MHM2K.BI:130` — `kapu()` declaration
- `DATA/KR.MHM` — 35 records of crisis-meeting prose (cp850)
- `DATA/X.MHM` rec 56, 156–158 — menu prompt + three option titles
- `DATA/Q.MHM` rec 39 — header text (cleared `leq 39`)

Cross-references in this folder:

- [ATTRIBUTES.md](ATTRIBUTES.md) — `mtaito(4)` "resourcefulness" (every
  call site, including the three crisis-meeting thresholds enumerated
  here)
- [VARIABLES.md](VARIABLES.md) — `ldr`, `kapu()`, `mo()` rows
- [GLOSSARY.md](GLOSSARY.md) — `kapteeni`, `kriisi(palaveri)`
- [LINEUPS.md](LINEUPS.md) — `SUB automa` deeper dive
- [SUBS.md](SUBS.md) — `kriisipalaveri`, `automa`, `ketjuchk`,
  `poispelaaja`, `klear` rows

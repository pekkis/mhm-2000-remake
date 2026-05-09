# Erikoistoimenpiteet — `erik()` system

> QB arrays: `erik(1..4, 1..48)`, `erikmak(0..4, 1..4)`,
> `erikmax(1..4)`, `erikalk(1..4)`

## What it is

Four per-**team** special measures, displayed and edited in the
"ERIKOISTOIMENPITEET" section of the Organisaatio screen
(ILEX5.BAS:3529–3610). Each team (`1..48`) has its own level for
each category. Human managers adjust levels via left/right arrow
keys; AI teams get initial values from `ORGA.M2K` based on team
strength tier and don't change them during the season.

**Keying: `erik(category, teamIndex)`** — team-indexed, not
manager-indexed. `u(pv)` maps manager `pv` → team index.

## The four categories

| #   | QB name           | Finnish UI label  | Levels          | Level labels (from Y.MHM)                                                                 |
| --- | ----------------- | ----------------- | --------------- | ----------------------------------------------------------------------------------------- |
| 1   | FANIRYHMÄ         | Faniryhmä         | 0–2 (3 options) | 0: Ei ole · 1: Kotiottelut · 2: Kaikki ottelut                                            |
| 2   | A-OIKEUDET        | A-oikeudet        | 0–2 (3 options) | 0: Ei alkoholia · 1: Keskikaljaa kaikille · 2: Täysi palvelu                              |
| 3   | PEKKIINI-DOUPPAUS | Pekkiini-douppaus | 0–2 (3 options) | 0: Ei sellaista · 1: Lievä · 2: DDR-tyylinen                                              |
| 4   | MATKUSTUSTAPA     | Matkustustapa     | 0–4 (5 options) | 0: Oma-aloitteinen · 1: Hippikupla · 2: Minibussi · 3: Luksusbussi · 4: Privaattisuihkari |

Source: `erikmax` from DATAX.M2K lines 109–112; level labels from
Y.MHM records 100–105 and 116–123; category names from Y.MHM
records 91–94.

## Data sources

### Static config (DATAX.M2K)

- **`erikmax(1..4)`** = `[2, 2, 2, 4]` — max level per category
- **`erikalk(1..4)`** = `[100, 103, 116, 119]` — Y.MHM record index
  for level-0 label text. UI shows `Y.MHM[erikalk(cat) + level]`.
- **`erikmak(0..4, 1..4)`** — cost-per-match matrix (negative =
  expense). Read as `FOR z=1 TO 4, FOR zz=0 TO 4`:

| Level | Cat 1 (Faniryhmä) | Cat 2 (A-oikeudet) | Cat 3 (Pekkiini) | Cat 4 (Matkustus) |
| ----- | ----------------: | -----------------: | ---------------: | ----------------: |
| 0     |                 0 |                  0 |                0 |            −1 000 |
| 1     |           −10 000 |             −3 000 |          −10 000 |            −4 000 |
| 2     |           −10 000 |             −6 000 |          −20 000 |            −9 000 |
| 3     |          (unused) |           (unused) |         (unused) |           −13 000 |
| 4     |          (unused) |           (unused) |         (unused) |           −20 000 |

UI shows: `STR$(-erikmak(erik(cat, team), cat)) + "/OTT."` — i.e. the
positive per-match cost.

### Initial values (ORGA.M2K)

On new game / season reset, `erik(1..4, team)` are loaded from
ORGA.M2K. Each row corresponds to a team strength tier (mapped via
`ORGASM.M2K`). First 4 columns = `erik(1..4)`:

```
tier 1:  0, 0, 0, 0   (weakest)
tier 2:  0, 0, 0, 1
tier 3:  0, 0, 0, 1
...
tier 12: 2, 2, 0, 3
tier 13: 2, 2, 0, 3   (strongest)
```

Human managers choose their own levels; AI teams keep the tier
defaults.

### Persistence (save/load)

Saved per team: `INPUT #1, erik(1,tt), erik(2,tt), erik(3,tt), erik(4,tt)`
(MHM2K.BAS:1333, ILEX5.BAS:7325).

## Gameplay effects

### Cat 1 — Faniryhmä (fan group)

**Match advantage (`etu`) boost.** In `SUB ottpel` (ILEX5.BAS:3715–3739):

```basic
' PHL (kiero=1):
IF erik(1, od(z)) >= z THEN etu(z) = etu(z) + .02
' z=1 (home) → level ≥ 1 gives +0.02
' z=2 (away) → level ≥ 2 gives +0.02 (= "kaikki ottelut")

' Division (kiero=2): same but only if od(z) < 49 (real team)
' Mutasarja (kiero=3): same
```

So:

- Level 0: no bonus
- Level 1 (kotiottelut): +0.02 etu at home
- Level 2 (kaikki ottelut): +0.02 etu at home AND away

**Cost:** Level 1 = −10 000/match at home only. Level 2 = −10 000/match
at home AND away (ILEX5.BAS:5258–5263 — level 2 charges on away too).

### Cat 2 — A-oikeudet (alcohol license)

**Revenue multiplier** for food & drink sales at home matches
(ILEX5.BAS:5324):

```basic
rahna = rahna + CLNG(sin1 * (ylm(1) + ylm(2)) * (3 + erik(2, u(pv)) * 2))
```

- Level 0: multiplier `3 + 0*2 = 3`
- Level 1: multiplier `3 + 1*2 = 5`
- Level 2: multiplier `3 + 2*2 = 7`

Higher alcohol license → more concession revenue. `sin1` is a random
factor `0.75 + 0.1*RND`. `ylm(1)+ylm(2)` = total spectator count.

**Cost:** 0 / −3 000 / −6 000 per match (home only).

**Events:** Event 63 (ILEX5.BAS:5873) checks `erik(2, u(pv)) <> 0`
to trigger an alcohol-related random event (spy/scandal).

### Cat 3 — Pekkiini-douppaus (doping)

**Strength bonus** to all three strength dimensions + PP/PK for
AI teams (ILEX5.BAS:3830–3835):

```basic
IF erik(3, zz) <> 0 THEN
  ode(1, z) = ode(1, z) + erik(3, zz)       ' goalie
  ode(2, z) = ode(2, z) + erik(3, zz) * 6   ' defence
  ode(3, z) = ode(3, z) + erik(3, zz) * 12  ' attack
  yw(zz)    = yw(zz)    + erik(3, zz) * 5   ' power play
  aw(zz)    = aw(zz)    + erik(3, zz) * 4   ' penalty kill
END IF
```

Also added to the per-player `zzra` pipeline (ILEX5.BAS:8546):

```basic
temp% = pel(ccc, pv).psk + pel(ccc, pv).plus + erik(3, u(pv))
```

So `erik(3)` is a flat bonus to every player's base value and
to the team's overall strength. Level 1 = small boost, level 2 =
large.

**Catch risk:** Major scandal if caught (ILEX5.BAS:5535–5610).
Probability = `erik(3) * 10` to `erik(3) * 22` percent depending
on competition type. Consequences: massive fine (−400K to −1M),
morale −55, stats zeroed. Effectively a match-fixing nuclear option.

**AI behavior:** AI teams can acquire doping out of **desperation**
(ILEX5.BAS:7810–7812) if their league standing `s(xx)` (sijoitus,
higher = worse) exceeds a threshold (tier-dependent: PHL >9, Div >8,
Mut >7) — i.e. teams sinking in the lower half of the table after
round 33. Worse standing → higher chance. ~40% chance to voluntarily
stop each round (line 7805). AI doping is also caught per-round
with `erik(3)*10` percent chance (7784–7786).

**Cost:** 0 / −10 000 / −20 000 per match.

### Cat 4 — Matkustustapa (travel mode)

**Match advantage (`etu`) boost for away team** in `SUB ottpel`
(ILEX5.BAS:3715, 3723, 3735):

```basic
etu(2) = etu(2) + .02 * erik(4, od(2))
```

- Level 0: +0.00
- Level 1: +0.02
- Level 2: +0.04
- Level 3: +0.06
- Level 4: +0.08

Only applies to the **away** team (`od(2)`). PHL, Division, and
Mutasarja all use this. Cup matches (`kiero=4`) and tournaments
don't.

**Cost:** −1 000 / −4 000 / −9 000 / −13 000 / −20 000 per match.
Always charged (home + away, ILEX5.BAS:5258).

**Leveling up:** `erik(4, xx)` auto-increments by 1 each playoff
round for AI teams (`ohj(xx)=0`), capped at 4
(ILEX5.BAS:4600–4601).

## Cost accounting (ILEX5.BAS:5255–5267)

Per-match financial impact, accumulated into `rahna2`:

```basic
' Always:
rahna2 = rahna2 + erikmak(erik(4, u(pv)), 4)       ' travel cost

' Away match:
IF erik(1, u(pv)) = 2 THEN                          ' fan group "all matches"
  rahna2 = rahna2 + erikmak(erik(1, u(pv)), 1)
END IF

' Home match:
IF erik(1, u(pv)) > 0 THEN                          ' fan group at home
  rahna2 = rahna2 + erikmak(erik(1, u(pv)), 1)
END IF
rahna2 = rahna2 + erikmak(erik(2, u(pv)), 2)        ' alcohol
rahna2 = rahna2 + erikmak(erik(3, u(pv)), 3)        ' doping
```

Note: fan group cost is conditional on home/away match and level.
Travel cost is always charged. Doping cost is always charged.
Alcohol cost is only charged on home matches.

## Organisaatio screen display (ILEX5.BAS:3529–3610)

The screen shows the BUDJETOINTI section on top (budget categories)
and ERIKOISTOIMENPITEET below. For each of the 4 categories:

- Category name (Y.MHM record `90 + cat`)
- Visual slider: filled/empty blocks for `0..erikmax(cat)`
- Level label (Y.MHM record `erikalk(cat) + level`)
- Cost display: `STR$(-erikmak(level, cat)) + "/OTT."`

Arrow keys left/right adjust `erik(cat, team)` between 0 and
`erikmax(cat)`.

## Port implications

- **`erik()` is team-keyed**, not manager-keyed. Mapped to `TeamServices`
  on team state. Type definitions + option data in
  [team-services.ts](../../data/mhm2000/team-services.ts).
- **Initial values** from ORGA.M2K ported to `orgaRows` in
  [budget.ts](../../data/mhm2000/budget.ts). Wired into
  `defaults.ts` (game seed) and `end-of-season.ts` (AI season reset)
  via `initialServicesForRankings()`.
- Categories 1, 2, 4 are clean gameplay features: fan support,
  alcohol revenue, travel comfort.
- Category 3 (doping) is the spicy one — see [DOPING.md](DOPING.md)
  for the full dual-path boost analysis, detection mechanics, and
  AI desperation-doping behavior.

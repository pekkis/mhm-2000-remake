# Travel — `erik(4)` / `team.services.travel`

QB variable: `erik(4, 1..48)` — per-team INTEGER, values 0–4.

---

## Levels

| Value | QB label          | TS label          | Away `etu` bonus | Cost/match |
| ----- | ----------------- | ----------------- | ---------------: | ---------: |
| 0     | Oma-aloitteinen   | Oma-aloitteinen   |            +0.00 |     −1 000 |
| 1     | Hippikupla        | Hippikupla        |            +0.02 |     −4 000 |
| 2     | Minibussi         | Minibussi         |            +0.04 |     −9 000 |
| 3     | Luksusbussi       | Luksusbussi       |            +0.06 |    −13 000 |
| 4     | Privaattisuihkari | Privaattisuihkari |            +0.08 |    −20 000 |

Formula: `etu(2) += 0.02 * erik(4, od(2))`.

At max travel (4), the away disadvantage shrinks from 0.85 → 0.93.

---

## Where it fires — per `kiero` / competition type

The travel bonus only applies to `etu(2)` (the **away team**).
The home team's `etu(1)` is never modified by travel.

| `kiero`  | TS competition       | Away baseline | Travel applies?                                                                   |
| -------- | -------------------- | :-----------: | --------------------------------------------------------------------------------- |
| 1        | PHL (league)         |     0.85      | **Yes** — unconditionally: `etu(2) += .02 * erik(4, od(2))`                       |
| 2        | EHL / Divisioona     |     0.85      | **Yes** — managed teams use their level; light teams (`od(2) >= 49`) get `0.02*4` |
| 3, 40–50 | Cup, Playoffs        |     0.85      | **Yes** — but only for managed teams (`od(2) < 49`)                               |
| 4        | Practice/training    |     0.95      | **No** — fixed etu, no service modifiers at all                                   |
| ELSE     | Neutral / tournament |     1.00      | **No** — both sides at 1.0, no home/away split                                    |

### Key observations

1. **PHL is the only case without a `< 49` guard.** All teams in PHL are
   managed base teams (1–24), so the guard is unnecessary. The other
   cases protect against light teams that have no `erik()` data.

2. **EHL gives light away teams a free max-travel bonus** (`0.02 * 4 = 0.08`).
   This represents foreign clubs arriving by charter. The condition is
   `od(2) < 49 AND ohj(od(2)) <> 0` for using the team's own level;
   the ELSE branch gives `0.02 * 4`.

3. **Cup and playoffs share the same `CASE 3, 40 TO 50` branch.** Despite
   cup (`kiero=4` in MHM 97) being `kiero=3` in MHM 2000 — the cup and
   playoff rounds are grouped together. Note: our current TS `cup.ts`
   returns `away: 0.85` but the QB `CASE 4` (`practice`) returns `0.95`.
   The TS mapping of cup ↔ kiero needs care — QB kiero=3 is cup, kiero=4
   is practice/training.

4. **Practice uses a smaller home advantage** (0.95 vs 0.85) and NO
   service modifiers at all. This is already correct in our TS
   `practice.ts` (`away: 0.95`).

5. **CASE ELSE (neutral)** sets both to 1.0 — no home/away split. This
   covers invitation tournaments (`turnauz <> 0`). Our TS `tournaments.ts`
   currently returns `away: 0.85` — **this is wrong**, should be `1.0`.

---

## Cost accounting

Travel cost is charged **every match** (home and away), not just away
matches. QB [ILEX5.BAS:5258]:

```basic
rahna2 = rahna2 + erikmak(erik(4, u(pv)), 4)       ' always
```

The `erikmak` table (negative = expense):

- Level 0: −1 000
- Level 1: −4 000
- Level 2: −9 000
- Level 3: −13 000
- Level 4: −20 000

---

## AI playoff auto-upgrade

At playoff start (`plots% = 1`), all AI teams (`ohj(xx) = 0`) get
their travel level bumped by 1, capped at 4:

```basic
' ILEX5.BAS:4600-4601
FOR xx = 1 TO 48
  IF ohj(xx) = 0 THEN
    erik(4, xx) = erik(4, xx) + 1
    IF erik(4, xx) > 4 THEN erik(4, xx) = 4
  END IF
NEXT xx
```

This fires **once** at playoff start, not per-round. It means AI
teams invest more in travel when the stakes are highest.

---

## Initial values (ORGA.M2K)

Travel level is seeded from the team's strength tier on new game /
season reset. Higher-tier teams start with better travel:

- Tier 1–2: 0 (weakest teams travel cheap)
- Tier 3–6: 1
- Tier 7–10: 2
- Tier 11–13: 3 (strongest teams start with luxury buses)

Human managers can change their level freely. AI teams keep the
tier default and only auto-upgrade at playoff start.

---

## Persistence

Saved per team in the save file alongside all other `erik` values:
`INPUT #1, erik(1,tt), erik(2,tt), erik(3,tt), erik(4,tt)`
(MHM2K.BAS:1333, ILEX5.BAS:7325).

---

## TS port — current state

- `team.services.travel` exists as `0 | 1 | 2 | 3 | 4` (team-services.ts).
- `homeAndAwayTeamAdvantages()` currently returns static values per
  competition — **does not incorporate travel**.
- The `simulateMatch` `computeEtu()` call goes through competition
  definitions that return bare `{ home: 1.0, away: 0.85 }`.

## TS port — design question

The travel bonus is team-specific, so it can't live inside
`homeAndAwayTeamAdvantages()` (which doesn't know about the teams).
Options:

1. **Apply in `simulateMatch` after `computeEtu()`** — a separate
   `applyTravelEtu()` helper, same pattern as `applyIntensityEtu()`.
   The competition definition provides a flag or method indicating
   whether travel applies (and the light-team default if relevant).

2. **Change `homeAndAwayTeamAdvantages` signature** to accept the
   teams — breaks the clean separation but puts all etu logic in one
   place.

3. **Add a `travelApplies: boolean` (or `awayTravelDefault: number`)
   field to `CompetitionDefinition`** — the match simulator reads it
   and applies the formula. Competition definitions declare whether
   travel matters and what the light-team fallback is.

Option 1 is simplest and follows the existing pattern (intensity
already works this way). Option 3 is cleanest long-term.

### Bugs found

- `tournaments.ts` returns `away: 0.85` but QB CASE ELSE gives `1.0`.
  **Should be `away: 1.0`** (neutral venue, no home advantage).

- The `cup.ts` etu values need verification against the kiero mapping.
  Cup is `kiero=3` in MHM 2000, which shares the `CASE 3, 40 TO 50`
  branch (home=1.0, away=0.85 + travel). Our TS `cup.ts` already
  returns `away: 0.85` which is correct as the **base** before travel.

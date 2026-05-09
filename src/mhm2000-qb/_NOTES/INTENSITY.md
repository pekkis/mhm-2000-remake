# Intensity (intensiteetti)

QB variable: `inte(1..plkm)` — per human-manager INTEGER, values 0/1/2.
Labels loaded from `DATAX.M2K` rows 38–40 into `intens(0..2)`:

| Value | Label    | English | Effect on `etu(z)` | Effect on `kun` (per playing player)           |
| ----- | -------- | ------- | ------------------ | ---------------------------------------------- |
| 0     | LAISKA   | lazy    | `etu -= 0.15`      | `kun += 1` (recovery even while playing)       |
| 1     | NORMAALI | normal  | no change          | no change (multi-line `ket>1` still does `−1`) |
| 2     | HURJA    | wild    | `etu += 0.10`      | `kun -= 2` (heavy fatigue)                     |

---

## Match strength effect (`ILEX5.BAS:3778-3780`)

```basic
IF ohj(od(z)) <> 0 THEN
  zz = ohj(od(z))
  ...
  IF kiero(kr) <> 4 AND turnauz = 0 THEN
    IF inte(zz) = 0 THEN etu(z) = etu(z) - .15
    ELSE IF inte(zz) = 2 THEN etu(z) = etu(z) + .1
  END IF
```

- `etu(z)` is the team's **advantage multiplier** for the match (starts at 1.0).
- Guard: `ohj(od(z)) <> 0` — only fires for **human-managed** teams.
- Guard: `kiero(kr) <> 4 AND turnauz = 0` — only in **league/cup play**, NOT in tournaments.
- AI teams have no intensity concept — they always play at an implicit "normaali".

---

## Condition tick (`ILEX5.BAS:1829-1838`)

```basic
IF mukax(pv) = 2 THEN              ' team played this round
  IF pel(xx, pv).ket > 0 THEN      ' player was assigned to a line
    SELECT CASE inte(pv)
    CASE 0                          ' LAISKA
      IF pel.age > 33 THEN a = 33 ELSE a = pel.age
      IF pel.kun < kuntomax(a) THEN pel.kun = pel.kun + 1
    CASE 2                          ' HURJA
      pel.kun = pel.kun - 2
    END SELECT
    IF pel.ket > 1 THEN pel.kun = pel.kun - 1   ' multi-line penalty (all intensities)
  END IF
END IF
```

Summary for a playing player (`ket > 0`):

- **LAISKA (0):** `kun += 1` (capped at `kuntomax`). Players _recover_ while playing lazy.
- **NORMAALI (1):** no explicit `kun` change from intensity. Only the multi-line `−1` applies if `ket > 1`.
- **HURJA (2):** `kun -= 2`. Brutal.
- On top of all: `ket > 1` always adds `−1` (playing on multiple lines).

For non-playing players (`ket = 0` or `mukax = 0`): `kun += 2` (rest recovery, capped). No intensity involvement.

---

## UI and constraints (`ILEX5.BAS:425-428, 2141-2144`)

### Controls

- Arrow Up: `inte(pv) += 1` (capped at 2).
- Arrow Down: `inte(pv) -= 1` (floored at 0).

### Lock: hangover

```basic
IF krapu(pv) <> 0 THEN inte(pv) = 1
```

When the team is in a hangover state (from the alcohol service event),
intensity is **forced to normaali** and the player cannot change it.
UI shows "LIIAN TIUKKA" (too tight / too hungover) as a hint.

### Reset: `SUB intejasopu` (`ILEX5.BAS:2140-2150`)

```basic
IF kiero(kr) = 98 OR kiero(kr) = 22 THEN inte(pv) = 1   ' break rounds → force normaali
IF pirtar(7) <> 1048 THEN inte(pv) = 0                   ' DRM check failed → force laiska
```

- On break rounds (`kiero = 98` or `kiero = 22`), intensity is reset to normaali.
- DRM anti-piracy: if the checksum fails, force laiska (permanent disadvantage). **Skip in port.**

### Season rollover (`ILEX5.BAS:7735`)

```basic
inte(pv) = 1
```

Reset to normaali at season start.

---

## AI behaviour

**AI teams have NO intensity variable.** The `inte()` array is `DIM inte(1 TO plkm)` (human managers only), and the match strength clause is gated by `ohj(od(z)) <> 0` (human-only).

However, there IS an AI-specific `etu` reduction that resembles "coasting":

### AI coasting mechanic (`ILEX5.BAS:3751-3762`)

```basic
IF kiero(kr) = 1 THEN                          ' League match only
  kotiot(od(1)) = kotiot(od(1)) + 1
  IF ot > 5 AND ot < 44 THEN                   ' Mid-season only (rounds 6–43)
    IF ohj(od(1)) = 0 THEN                     ' Home team is AI
      IF s(od(2)) - s(od(1)) >= 4 THEN         ' Away team ranked 4+ places LOWER
        zzz = (s(od(2)) - s(od(1)) - 3) * 7   ' Probability scales with gap
        IF INT(101 * RND) < zzz THEN etu(1) = etu(1) - .15
      END IF
    END IF
  END IF
END IF
```

**What it does:**

- **League only** (`kiero(kr) = 1`)
- **Mid-season only** (rounds 6–43; not early/late season)
- **AI home team only** (`ohj(od(1)) = 0`)
- **Trigger:** `s()` = sijoitus (standings position, 1=best). `s(od(2)) - s(od(1)) >= 4`
  means the away team is ranked 4+ places _worse_ than the home team. The AI home
  team is the **stronger** side.
- **Probability:** `(position_gap - 3) * 7`%. Gap=4 → 7%, gap=8 → 35%, gap=14 → 77%
- **Effect:** `etu(1) -= 0.15` — same magnitude as human LAISKA

**This IS "coasting from strength."** The strong AI home team that's comfortably
ahead in the standings has a growing chance of playing lazily against a weaker
visitor. The bigger the gap, the more likely. "Why try hard against a team ranked
10th when we're 2nd?"

It only checks `od(1)` (home team), so AI away teams never coast — they always
play at full effort when visiting.

### TS port implications

For the TS port:

1. **Faithful (intensity):** intensity is human-only; AI always plays at implicit normaali.
2. **Faithful (coasting):** implement the AI home-team coasting check as a separate
   `etu` modifier in match simulation — it's independent of the `inte` system.
3. **Extended (MHM 2001):** could give AI teams a deterministic intensity rule (based on
   morale, standings, or desperation). Consider as a later enhancement.

Start with options 1+2 (both faithful mechanics).

---

## Persistence

`inte(pv)` is saved/loaded per manager in the save file (`MHM2K.BAS:1265, ILEX5.BAS:7253`), positioned between `lpl(tt)` and `putki(1..5, tt)`.

---

## TS port plan

1. Add `intensity: 0 | 1 | 2` to team state (human teams only; AI defaults to 1).
2. Expose a `SET_INTENSITY` game machine event (same pattern as `SET_TEAM_SERVICE`).
3. In the match simulation (`simulate-match.ts`), apply the `etu` modifier: `−0.15` for 0, `+0.10` for 2.
4. In the post-match condition tick, apply the `kun` delta per intensity.
5. Lock to `1` when `hangover` tag is active on the team.
6. Reset to `1` at season start and on break rounds.
7. UI: slider or 3-button toggle on the action-phase main screen (same row as sopupeli toggle in the QB UI).

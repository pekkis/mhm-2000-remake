# Willful Deviations from the QB Original

> Gameplay and design decisions where we **intentionally diverge** from
> the MHM 2000 QuickBASIC source. Each entry documents the QB behavior,
> our deviation, the rationale, and whether it might need revisiting.

---

## 1. Goalie↔skater cross-assignment allowed

**QB behavior:** Hard-locked. Only goalies can be placed in the goalie
slot. Goalies cannot be placed in any skater slot. The UI prevents it
entirely — `SUB automa` never slots a goalie as a skater or vice versa.

**Our deviation:** Any player can be placed in any slot. Cross-assigned
players (goalie skating out, or skater in goal) resolve to
`MIN_EFFECTIVE_STRENGTH` (1) — a catastrophic mismatch penalty that
makes them the worst possible warm body on the ice, but still _a_ body.

**Rationale:** The hard lock was always frustrating. In edge cases
(injuries, tiny rosters, desperation) you should be able to put anyone
anywhere — you'll just suffer for it. The penalty is severe enough that
no sane manager would do it voluntarily, but the freedom exists.

**Lore justification:** A skill-1 player is literally "some guy who
can stand on skates." Even mutasarja's worst real players sit at 3–5,
so 1 is comfortably below the talent floor of any actual league.

**Revisit risk:** Low. The catastrophic penalty makes this
self-balancing. If match simulation later reveals exploits (e.g. a
goalie with skill 20 contributing _anything_ meaningful as a skater),
revisit the penalty to ensure it truly zeroes out their contribution.

**Files:** `src/services/lineup.ts` — `applyPositionPenalty()`,
`MIN_EFFECTIVE_STRENGTH`.

---

## 2. Effective strength floor: 0 → 1

**QB behavior:** `IF temp% < 0 THEN temp% = 0` (ILEX5.BAS:8569).
After all penalties (position, specialty, condition), negative values
are clamped to 0. A player can have effective strength 0.

**Our deviation:** `floorStrength()` clamps to `MIN_EFFECTIVE_STRENGTH`
(1) instead of 0. No player can have effective strength below 1.

**Rationale:** A player with strength 0 is indistinguishable from an
empty slot. If you're putting a warm body on the ice, they should
contribute _something_, however negligible. This also avoids potential
division-by-zero or zero-weight edge cases in the match engine's
goal-scorer attribution (`SUB pisteet` uses `hketju^2.5` / `pketju^2`
— a zero-strength line would never score, which is arguably correct
but feels wrong for a line that's physically on the ice).

**Revisit risk:** Medium. The `SUB pisteet` scoring attribution and
`SUB ottpel` match engine need to be checked when they port to confirm
that strength=1 doesn't produce weird edge cases vs the QB assumption
of strength≥0. The floor-at-0 behavior may have been intentional for
specific game-balance scenarios (e.g. a greedySurfer with base skill 1
and bad condition _should_ maybe be truly useless).

**Future rebalance:** MHM 2001 adds PÖKÄLESARJA (48 teams) below
mutasarja. When that happens, skill levels and `MIN_EFFECTIVE_STRENGTH`
need revisiting — the current floor of 1 sits safely below mutasarja's
3–5 talent floor, but a whole new tier of worse teams compresses that
gap. Note that the TASOT.M2K skill scale is **perfectly linear**
(attack = level × 4) — the exponential-feeling tier gaps come entirely
from the match engine's nonlinear consumption (`hketju^2.5`,
`pketju^2`), which naturally compresses bottom-tier differences. This
means extending TASOT downward for Pökälesarja should "just work" —
the nonlinear engine makes those sub-mutasarja teams barely
distinguishable from each other while still meaningfully worse.

**Files:** `src/services/lineup.ts` — `floorStrength()`,
`MIN_EFFECTIVE_STRENGTH`, `effectiveStrength()`.

---

## Template for new entries

```markdown
## N. Short title

**QB behavior:** What the original does and where (file:line).

**Our deviation:** What we do differently.

**Rationale:** Why.

**Revisit risk:** Low / Medium / High + what could go wrong.

**Files:** Affected source files.
```

import type { HiredPlayer } from "@/state/player";
import type { PlayerSpecialtyKey } from "@/data/player-specialties";
import type { Lineup } from "@/state/lineup";

/**
 * Lineup slot types for the position-penalty calculation.
 * Maps to QB `xxx` values in the `zzra` subroutine (ILEX5.BAS:8550-8558).
 *
 * - `"g"` — goalie slot (xxx=1). No penalty.
 * - `"d"` — defense slot, LD or RD (xxx=2). Non-D → ×0.7.
 * - `"lw"` / `"c"` / `"rw"` — position-specific forward (xxx=3/4/5).
 *   D in fwd slot → ×0.7, wrong forward type → −1.
 * - `"pkf"` — PK forward, position-generic (xxx=6).
 *   Goalie or D → ×0.7, any forward type → full.
 */
export type LineupSlot = "g" | "d" | "lw" | "c" | "rw" | "pkf";

/**
 * Applies the position penalty for a player in a given lineup slot.
 * Port of the `SELECT CASE xxx` block in QB `zzra` (ILEX5.BAS:8550-8558).
 *
 * Takes a pre-computed base value (typically `psk + plus + erik(3)`,
 * with `yvo`/`avo` added by the caller for PP/PK context) and returns
 * the position-adjusted value.
 */
export const applyPositionPenalty = (
  playerPosition: HiredPlayer["position"],
  slot: LineupSlot,
  baseValue: number
): number => {
  switch (slot) {
    case "g":
      // xxx=1: no position penalty (UI prevents non-goalies here)
      return baseValue;

    case "d":
      // xxx=2: non-defenseman in D slot → ×0.7
      return playerPosition !== "d" ? Math.trunc(0.7 * baseValue) : baseValue;

    case "lw":
    case "c":
    case "rw":
      // xxx=3/4/5: D in forward slot → ×0.7, wrong forward type → −1
      if (playerPosition === "d") {
        return Math.trunc(0.7 * baseValue);
      }
      if (playerPosition !== slot) {
        return baseValue - 1;
      }
      return baseValue;

    case "pkf":
      // xxx=6: goalie or D in PK forward slot → ×0.7, any fwd → full
      return playerPosition === "g" || playerPosition === "d"
        ? Math.trunc(0.7 * baseValue)
        : baseValue;
  }
};

/**
 * Applies the greedySurfer (spe=8, RAHANAHNE SURFFAAJA) specialty penalty.
 * Port of `IF pel(ccc, pv).spe = 8 THEN temp% = CINT(.7 * temp%)`
 * (ILEX5.BAS:8559).
 *
 * NOTE: QB uses CINT (round to nearest) here, NOT FIX (truncate).
 * CINT rounds half-to-even (banker's rounding), but at ×0.7 the .5
 * boundary is only hit when baseValue is a multiple of 10/7 ≈ 1.43 —
 * effectively never for integer psk values. Math.round is close enough
 * for the game's integer range.
 */
export const applySpecialtyPenalty = (
  specialty: PlayerSpecialtyKey | null,
  value: number
): number => {
  if (specialty === "greedySurfer") {
    return Math.round(0.7 * value);
  }
  return value;
};

/**
 * Applies the condition (kunto) penalty.
 * Port of `SELECT CASE pel(ccc, pv).kun` in QB `zzra` (ILEX5.BAS:8560-8568).
 *
 * Uses FIX (truncate toward zero) — matching QB semantics for
 * non-negative values, which is the only realistic case here since
 * `temp%` is floored at 0 afterward.
 *
 * | condition | multiplier |
 * |-----------|------------|
 * | >= 0      | 1.0 (none) |
 * | -1        | ×0.9       |
 * | -2        | ×0.7       |
 * | -3        | ×0.5       |
 * | < -3      | ×0.3       |
 */
export const applyConditionPenalty = (
  condition: number,
  value: number
): number => {
  if (condition >= 0) {
    return value;
  }
  if (condition === -1) {
    return Math.trunc(0.9 * value);
  }
  if (condition === -2) {
    return Math.trunc(0.7 * value);
  }
  if (condition === -3) {
    return Math.trunc(0.5 * value);
  }
  return Math.trunc(0.3 * value);
};

/**
 * Floors at zero.
 * Port of `IF temp% < 0 THEN temp% = 0` (ILEX5.BAS:8569).
 */
export const floorAtZero = (value: number): number => Math.max(0, value);

/**
 * Full `zzra` pipeline: computes effective strength for one player in one slot.
 * Port of SUB zzra (ILEX5.BAS:8545-8570).
 *
 * Caller provides a pre-computed `baseValue` (typically `psk + plus + erik(3)`,
 * with `yvo`/`avo` already added for PP/PK context).
 *
 * Steps in QB order:
 * 1. Position penalty  (SELECT CASE xxx, lines 8550-8558)
 * 2. Specialty penalty  (IF spe=8, line 8559)
 * 3. Condition penalty  (SELECT CASE kun, lines 8560-8568)
 * 4. Floor at 0         (IF temp%<0, line 8569)
 */
export const effectiveStrength = (
  baseValue: number,
  playerPosition: HiredPlayer["position"],
  slot: LineupSlot,
  specialty: PlayerSpecialtyKey | null,
  condition: number
): number =>
  floorAtZero(
    applyConditionPenalty(
      condition,
      applySpecialtyPenalty(
        specialty,
        applyPositionPenalty(playerPosition, slot, baseValue)
      )
    )
  );

// ---------------------------------------------------------------------------
// Auto-lineup builder — port of SUB automa (ILEX5.BAS:822-920)
// ---------------------------------------------------------------------------

export type AutoLineupMode = "gameday" | "potential";

/**
 * Sum of active performance modifiers (QB `plus`).
 * QB stores a single `plus`/`kest` pair; we allow multiple stacked effects.
 */
export const performanceModifier = (player: HiredPlayer): number =>
  player.effects.reduce(
    (sum, e) => sum + (e.type === "skill" ? e.amount : 0),
    0
  );

/**
 * Availability gate for auto-lineup assignment.
 * Port of QB `inj = 0 AND svu > 0 AND kun >= 0` (ILEX5.BAS:828).
 *
 * `svu > 0` is implicit — HiredPlayer always has a contract.
 * A player is available when they carry no blocking effects
 * (injury, suspension, strike, national-team absence) and
 * their condition is non-negative.
 */
export const isAvailable = (player: HiredPlayer): boolean =>
  player.effects.every((e) => e.type === "skill") && player.condition >= 0;

type Pool = "regular" | "pp" | "pk";

/**
 * Sort key for pool ranking (QB `verrokki` GOSUB, ILEX5.BAS:912-936).
 *
 * - Regular: `psk + plus` (extremelyFat spe=4 → 99).
 * - PP: `psk + yvo + plus` (no fat boost).
 * - PK: `psk + avo + plus` (no fat boost).
 */
const sortKey = (player: HiredPlayer, pool: Pool): number => {
  const plus = performanceModifier(player);
  switch (pool) {
    case "regular":
      return player.specialty === "extremelyFat" ? 99 : player.skill + plus;
    case "pp":
      return player.skill + player.powerplayMod + plus;
    case "pk":
      return player.skill + player.penaltyKillMod + plus;
  }
};

/**
 * Comparator: descending by pool sort key, tiebreak ascending by age.
 * Matches QB `verrokki`: when equal, younger (or same-age incumbent) wins.
 * JS `toSorted()` is stable, so equal-age players preserve roster order.
 */
const compareByPool =
  (pool: Pool) =>
  (a: HiredPlayer, b: HiredPlayer): number => {
    const diff = sortKey(b, pool) - sortKey(a, pool);
    if (diff !== 0) {
      return diff;
    }
    return a.age - b.age;
  };

/**
 * Filter eligible players of a given position and sort by pool ranking.
 */
const rankedByPosition = (
  eligible: readonly HiredPlayer[],
  position: HiredPlayer["position"],
  pool: Pool
): HiredPlayer[] =>
  eligible.filter((p) => p.position === position).toSorted(compareByPool(pool));

/**
 * Automatic lineup builder. Port of SUB automa (ILEX5.BAS:822-920).
 *
 * Fills all lineup slots with the best available players, sorted by
 * pool-specific rating. Players can appear in multiple pools (regular +
 * PP, regular + PK) — same as real hockey.
 *
 * QB algorithm:
 * 1. Pick best goalie (regular pool sort).
 * 2. Three pools (regular / PP / PK) × four positions (D / LW / C / RW):
 *    sort eligible players by pool-specific key, take top N.
 * 3. Map ranked arrays onto the lineup structure:
 *    - 3 defensive pairings (6 D from regular pool)
 *    - 4 forward lines (lines 1-3: LW/C/RW; line 4: LW/C only, no RW)
 *    - PP team: 2D + LW/C/RW from PP pool
 *    - PK team: 2D from PK pool + best PK LW + best PK C (no RW — `dad(5,6)=0`)
 *
 * @param mode `"gameday"` (default): skip injured / suspended / striking /
 *   absent / overtired players. `"potential"`: use all players.
 */
export const autoLineup = (
  players: readonly HiredPlayer[],
  mode: AutoLineupMode = "gameday"
): Lineup => {
  const eligible = mode === "potential" ? players : players.filter(isAvailable);

  // Goalie: best by regular pool sort (verrokki with zz=1)
  const goalies = rankedByPosition(eligible, "g", "regular");

  // Regular pool (zz=1)
  const regD = rankedByPosition(eligible, "d", "regular");
  const regLW = rankedByPosition(eligible, "lw", "regular");
  const regC = rankedByPosition(eligible, "c", "regular");
  const regRW = rankedByPosition(eligible, "rw", "regular");

  // PP pool (zz=2)
  const ppD = rankedByPosition(eligible, "d", "pp");
  const ppLW = rankedByPosition(eligible, "lw", "pp");
  const ppC = rankedByPosition(eligible, "c", "pp");
  const ppRW = rankedByPosition(eligible, "rw", "pp");

  // PK pool (zz=3) — no RW in PK (dad(5,6)=0)
  const pkD = rankedByPosition(eligible, "d", "pk");
  const pkLW = rankedByPosition(eligible, "lw", "pk");
  const pkC = rankedByPosition(eligible, "c", "pk");

  return {
    g: goalies[0]?.id,
    defensivePairings: [
      { ld: regD[0]?.id, rd: regD[1]?.id },
      { ld: regD[2]?.id, rd: regD[3]?.id },
      { ld: regD[4]?.id, rd: regD[5]?.id }
    ],
    forwardLines: [
      { lw: regLW[0]?.id, c: regC[0]?.id, rw: regRW[0]?.id },
      { lw: regLW[1]?.id, c: regC[1]?.id, rw: regRW[1]?.id },
      { lw: regLW[2]?.id, c: regC[2]?.id, rw: regRW[2]?.id },
      { lw: regLW[3]?.id, c: regC[3]?.id, rw: regRW[3]?.id }
    ],
    powerplayTeam: {
      ld: ppD[0]?.id,
      rd: ppD[1]?.id,
      lw: ppLW[0]?.id,
      c: ppC[0]?.id,
      rw: ppRW[0]?.id
    },
    penaltyKillTeam: {
      ld: pkD[0]?.id,
      rd: pkD[1]?.id,
      f1: pkLW[0]?.id,
      f2: pkC[0]?.id
    }
  };
};

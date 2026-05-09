import type { HiredPlayer } from "@/state/player";
import type { PlayerSpecialtyKey } from "@/data/player-specialties";
import type { Lineup } from "@/state/lineup";

/**
 * Lineup slot types for the position-penalty calculation.
 * Based on QB `xxx` values in `zzra` (ILEX5.BAS:8550-8558), extended
 * to allow any player in any slot.
 *
 * - `"g"` — goalie slot. Goalie → no penalty. Skater → catastrophic (→ 1).
 * - `"d"` — defense slot. Goalie → catastrophic (→ 1). Non-D skater → ×0.7.
 * - `"lw"` / `"c"` / `"rw"` — position-specific forward.
 *   Goalie → catastrophic (→ 1). D → ×0.7. Wrong forward type → −1.
 * - `"pkf"` — PK forward, position-generic.
 *   Goalie → catastrophic (→ 1). D → ×0.7. Any forward → full.
 *
 * **Gameplay deviation from QB:** the original hard-locked goalies to
 * the goalie slot and barred them from skating. We allow it — you just
 * get an effective strength of 1, which is the worst warm body on ice.
 */
export type LineupSlot = "g" | "d" | "lw" | "c" | "rw" | "pkf";

/** Minimum effective strength — the worst possible player on the ice. */
export const MIN_EFFECTIVE_STRENGTH = 1;

/**
 * Applies the position penalty for a player in a given lineup slot.
 * Based on `SELECT CASE xxx` in QB `zzra` (ILEX5.BAS:8550-8558),
 * extended for goalie↔skater cross-assignment.
 *
 * Catastrophic mismatches (goalie playing out, skater in goal) return
 * `MIN_EFFECTIVE_STRENGTH` directly — no further penalties can improve
 * or worsen the situation.
 */
export const applyPositionPenalty = (
  playerPosition: HiredPlayer["position"],
  slot: LineupSlot,
  baseValue: number
): number => {
  switch (slot) {
    case "g":
      // Goalie in goal → no penalty. Skater in goal → catastrophic.
      return playerPosition === "g" ? baseValue : MIN_EFFECTIVE_STRENGTH;

    case "d":
      // Goalie skating defense → catastrophic.
      if (playerPosition === "g") return MIN_EFFECTIVE_STRENGTH;
      // Non-D skater in D slot → ×0.7 (QB xxx=2).
      return playerPosition !== "d" ? Math.trunc(0.7 * baseValue) : baseValue;

    case "lw":
    case "c":
    case "rw":
      // Goalie skating forward → catastrophic.
      if (playerPosition === "g") return MIN_EFFECTIVE_STRENGTH;
      // D in forward slot → ×0.7 (QB xxx=3/4/5).
      if (playerPosition === "d") return Math.trunc(0.7 * baseValue);
      // Wrong forward type → −1.
      if (playerPosition !== slot) return baseValue - 1;
      return baseValue;

    case "pkf":
      // Goalie in PK forward → catastrophic.
      if (playerPosition === "g") return MIN_EFFECTIVE_STRENGTH;
      // D in PK forward → ×0.7 (QB xxx=6).
      return playerPosition === "d"
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
 * Ensures no effective strength drops below `MIN_EFFECTIVE_STRENGTH`.
 * The worst warm body on the ice is still *a* body on the ice.
 *
 * Replaces QB's `IF temp% < 0 THEN temp% = 0` (ILEX5.BAS:8569)
 * with a minimum of 1 — gameplay deviation from the original.
 */
export const floorStrength = (value: number): number =>
  Math.max(MIN_EFFECTIVE_STRENGTH, value);

/**
 * Full `zzra` pipeline: computes effective strength for one player in one slot.
 * Based on SUB zzra (ILEX5.BAS:8545-8570).
 *
 * Caller provides a pre-computed `baseValue` (typically `psk + plus + erik(3)`,
 * with `yvo`/`avo` already added for PP/PK context).
 *
 * Steps in QB order:
 * 1. Position penalty  (SELECT CASE xxx, lines 8550-8558)
 * 2. Specialty penalty  (IF spe=8, line 8559)
 * 3. Condition penalty  (SELECT CASE kun, lines 8560-8568)
 * 4. Floor at 1         (gameplay deviation: QB floors at 0)
 */
export const effectiveStrength = (
  baseValue: number,
  playerPosition: HiredPlayer["position"],
  slot: LineupSlot,
  specialty: PlayerSpecialtyKey | null,
  condition: number
): number =>
  floorStrength(
    applyConditionPenalty(
      condition,
      applySpecialtyPenalty(
        specialty,
        applyPositionPenalty(playerPosition, slot, baseValue)
      )
    )
  );

// ---------------------------------------------------------------------------
// Lineup appearances — derived `ket` (QB SUB kc, ILEX5.BAS:2559-2568)
// ---------------------------------------------------------------------------

/**
 * Counts how many **regular-line** slots each player occupies in the
 * lineup. Port of QB `SUB kc` (ILEX5.BAS:2559-2568), computed on
 * demand instead of stored on the player.
 *
 * **Only units 1–4 count** (3 full lines + line 4 forwards-only) plus
 * the goalie slot. PP (unit 5) and PK (unit 6) are **excluded** — a
 * player on line 1 + PP has appearances = 1, not 2.
 *
 * QB caps at 2 via the `ket < 2` guard in `SUB ketlaita`
 * (ILEX5.BAS:2640). Values above 2 indicate a lineup bug.
 *
 * Consumers:
 * - Fatigue: `ket > 1` → extra −1 condition per turn
 * - Assignment guard: `ket < 2` required to slot a player
 * - UI: 0 = bench (gray), 1 = one unit (yellow), 2 = two units (blue)
 * - Event targeting: `ket > 0` = "active player" for random picks
 */
export const lineupAppearances = (lineup: Lineup): Map<string, number> => {
  const counts = new Map<string, number>();

  const count = (id: string | null): void => {
    if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
  };

  // Goalie slot
  count(lineup.g);

  // Units 1–4: 3 full forward lines + line 4 (forwards only, no 4th D pair)
  for (const line of lineup.forwardLines) {
    count(line.lw);
    count(line.c);
    count(line.rw);
  }

  // Units 1–3: 3 defensive pairings
  for (const pair of lineup.defensivePairings) {
    count(pair.ld);
    count(pair.rd);
  }

  // PP (unit 5) and PK (unit 6) are intentionally excluded per QB kc.

  return counts;
};

// ---------------------------------------------------------------------------
// Lineup slot assignment — port of SUB ketlaita guard (ILEX5.BAS:2640)
// ---------------------------------------------------------------------------

/** Identifies a single assignable slot in the lineup. */
export type LineupTarget =
  | { unit: "g" }
  | { unit: "d"; index: number; side: "ld" | "rd" }
  | { unit: "f"; index: number; position: "lw" | "c" | "rw" };
// TODO: PP and PK targets when those views render.

/** Max regular-line appearances per player (QB `ket < 2` guard). */
const MAX_APPEARANCES = 2;

/**
 * Assigns a player to a lineup slot, enforcing the QB `ketlaita` guard:
 * a player may occupy at most `MAX_APPEARANCES` (2) regular-line slots.
 *
 * Mutates `lineup` in place (designed to run inside an immer `produce`).
 *
 * - Setting `playerId` to `null` clears the slot (always allowed).
 * - Assigning a player who already occupies `MAX_APPEARANCES` slots
 *   is rejected (returns `false`).
 * - Otherwise the slot is set and the function returns `true`.
 *
 * The caller is responsible for looking up the manager → team path
 * and running this inside `produce(context, (draft) => ...)`.
 */
export const assignPlayerToLineup = (
  lineup: Lineup,
  target: LineupTarget,
  playerId: string | null
): boolean => {
  // Clearing a slot is always allowed.
  if (playerId === null) {
    setSlot(lineup, target, null);
    return true;
  }

  // Guard: player may not exceed MAX_APPEARANCES across regular units.
  const appearances = lineupAppearances(lineup);
  const current = appearances.get(playerId) ?? 0;

  // If the player is already in the target slot, it's a no-op success.
  if (getSlot(lineup, target) === playerId) {
    return true;
  }

  if (current >= MAX_APPEARANCES) {
    return false;
  }

  setSlot(lineup, target, playerId);
  return true;
};

/** Read the player id currently occupying a lineup slot. */
const getSlot = (lineup: Lineup, target: LineupTarget): string | null => {
  switch (target.unit) {
    case "g":
      return lineup.g;
    case "d":
      return lineup.defensivePairings[target.index][target.side];
    case "f":
      return lineup.forwardLines[target.index][target.position];
  }
};

/** Write a player id into a lineup slot (mutates in place). */
const setSlot = (
  lineup: Lineup,
  target: LineupTarget,
  playerId: string | null
): void => {
  switch (target.unit) {
    case "g":
      lineup.g = playerId;
      break;
    case "d":
      lineup.defensivePairings[target.index][target.side] = playerId;
      break;
    case "f":
      lineup.forwardLines[target.index][target.position] = playerId;
      break;
  }
};

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

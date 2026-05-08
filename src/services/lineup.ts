import type { HiredPlayer } from "@/state/player";
import type { PlayerSpecialtyKey } from "@/data/player-specialties";

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

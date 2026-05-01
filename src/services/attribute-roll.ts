import { default as defaultRandom, type RandomService } from "./random";
import {
  legacyIndexByManagerAttribute,
  type ManagerAttributeKey,
  type ManagerAttributes
} from "@/data/managers";

/**
 * Faithful port of QB `FUNCTION tarko%(t0%, t1%, t2%, t3%)`
 * (`ILEX5.BAS:7433..7441`):
 *
 * ```basic
 * IF INT(100 * RND) + 1 < t3% + (mtaito(t1%, man(t0%)) * t2%) THEN
 *   tarko = 1
 * ELSE
 *   tarko = 0
 * END IF
 * ```
 *
 * Reads as: roll `1..100`, succeed iff
 * `roll < base + attributeValue * weight`. Note the comparison is
 * STRICT (`<`, not `<=`) — preserving this off-by-one is critical
 * to original game balance.
 *
 * The QB API takes a team index `t0` then dereferences `man(t0)` to
 * find the manager. In our model the manager is first-class, so the
 * TS API takes the attributes object directly. Translate at call
 * sites (e.g. `attributeRoll(team.manager.attributes, "luck", 15, 0)`).
 *
 * Use cases gleaned from `ILEX5.BAS`:
 *
 * | Call                                  | Meaning                                                         |
 * | ------------------------------------- | --------------------------------------------------------------- |
 * | `tarko(u(pv), 6, 15, 0)`              | luck × 15, no base — mafia shakedown resistance                 |
 * | `tarko(u(pv), 4, 50, 15)`             | resourcefulness × 50 + base 15 — mafia morality test            |
 * | `tarko(u(pv), 5, 30, 0)`              | charisma × 30 — mafia comply-extra-cash bonus check             |
 * | `tarko(u(pv), 5, 20, 50)`             | charisma × 20 + base 50 — generic threat-resistance roll        |
 * | `tarko(u(pv), 6, 12, 50)`             | luck × 12 + base 50 — generic luck check                        |
 *
 * Attribute range is −3..+3, so the effective probability for a
 * given (weight, base) pair spans
 * `clamp01((base − 3·weight − 1) / 100)` to
 * `clamp01((base + 3·weight − 1) / 100)`.
 *
 * RNG note: MHM 2000 QB uses `INT(100 * RND) + 1` everywhere — clean
 * uniform integers, NOT the biased rounding that the MHM 97 codebase
 * preserved as `cinteger`. Do NOT reach for `cinteger` from new
 * MHM 2000 code; use `random.integer(1, 100)` (or this service).
 */
export const createAttributeRollService = (
  random: RandomService = defaultRandom
) => {
  /**
   * Roll a manager's attribute against a base + weight threshold.
   * Returns true on success, false on failure. Pass any attribute
   * key — the legacy QB integer index is reconstructed internally
   * for documentation / debugging only; the actual lookup is by key.
   */
  const attributeRoll = (
    attributes: ManagerAttributes,
    attribute: ManagerAttributeKey,
    weight: number,
    base: number
  ): boolean => {
    const roll = random.integer(1, 100);
    const threshold = base + attributes[attribute] * weight;
    return roll < threshold;
  };

  /**
   * Compute the success probability of a roll without consuming
   * randomness. Useful for UI hints, AI evaluation, and tests.
   * Range clamped to [0, 1].
   */
  const attributeRollProbability = (
    attributes: ManagerAttributes,
    attribute: ManagerAttributeKey,
    weight: number,
    base: number
  ): number => {
    const threshold = base + attributes[attribute] * weight;
    // roll ∈ {1..100}; succeed iff roll < threshold ⇔ roll ≤ threshold − 1.
    // # of successful rolls = clamp(threshold − 1, 0, 100) → /100.
    const successful = Math.max(0, Math.min(100, threshold - 1));
    return successful / 100;
  };

  return { attributeRoll, attributeRollProbability };
};

const defaultService = createAttributeRollService();
export const attributeRoll = defaultService.attributeRoll;
export const attributeRollProbability =
  defaultService.attributeRollProbability;

/**
 * Re-export of the QB → key index map, for sites that mechanically
 * port code like `tarko(u(pv), 4, 50, 15)`. Prefer the string-key
 * form at new call sites.
 */
export { legacyIndexByManagerAttribute };

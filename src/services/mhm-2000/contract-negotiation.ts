/**
 * Pure logic for contract negotiations — port of QB `sopimusext` SUB
 * (ILEX5.BAS:6312-6588).
 *
 * State machine and UI live in src/machines/contractNegotiation.ts.
 * This module exports only pure, testable functions.
 */

import type { TeamBudget } from "@/data/mhm2000/budget";
import type { MarketPlayer } from "@/state/player";

// ─── Types ───────────────────────────────────────────────────────────────────

export type SpecialClause = "none" | "nhl" | "free-fire";

/** The negotiation willingness outcome computed from `a` and player state. */
export type WillingnessOutcome =
  | "refused" // a <= -4: categorically refuses
  | "unhappy" // -4 < a < -1: open but displeased
  | "neutral" // a = -1: slightly unhappy
  | "happy"; // a = 0: pleased to negotiate

/** Result of a single `NEGOTIATE` attempt. */
export type NegotiateAttemptResult =
  | { outcome: "accepted"; happy: boolean } // sin2 < sin1
  | { outcome: "rejected"; newThreshold: number }; // sin2 >= sin1, threshold updated

// ─── Core calculations ───────────────────────────────────────────────────────

/**
 * Port of the `a` calculation in `sopimusext` (ILEX5.BAS:6331-6335).
 *
 * `a = valb(b, pv) + valb(4, pv) + valb(5, pv) * 2 - neup.psk`
 * where b=2 for goalies, b=1 for skaters. Capped at 0 (can never be positive).
 *
 * Meaning: 0 = team has sufficient budget for this player;
 * negative = team is financially stretched.
 */
export function computeTeamNeedsRating(
  budget: TeamBudget,
  player: Pick<MarketPlayer, "position" | "skill">
): number {
  const coachingBudget =
    player.position === "g" ? budget.goalieCoaching : budget.coaching;
  const raw =
    coachingBudget + budget.health + budget.benefits * 2 - player.skill;
  return Math.min(0, raw);
}

/**
 * Willingness check — port of ILEX5.BAS:6337-6352.
 * Returns what the player's initial reaction would be.
 * (Zombies and greedy surfers skip this and go straight to negotiation.)
 */
export function checkWillingness(teamNeedsRating: number): WillingnessOutcome {
  if (teamNeedsRating <= -4) {
    return "refused";
  }
  if (teamNeedsRating < -1) {
    return "unhappy";
  }
  if (teamNeedsRating < 0) {
    return "neutral";
  }
  return "happy";
}

/**
 * Initial willingness threshold — port of `sopimus(2)` init (ILEX5.BAS:6350).
 *
 * `sopimus(2) = 85 - (a * 10) + (mtaito(5, u(pv)) * 5)`
 * Since a <= 0, -a*10 >= 0, so threshold >= 85.
 * Manager charisma (attribute 5) adds up to ±15 to threshold.
 */
export function computeWillingnessThreshold(
  teamNeedsRating: number,
  managerCharisma: number
): number {
  return 85 - teamNeedsRating * 10 + managerCharisma * 5;
}

/**
 * NHL option eligibility — port of ILEX5.BAS:6365-6376.
 *
 * Returns the minimum contract duration required for the NHL clause to be
 * offered. 0 = not eligible (player is 26+, or too low skill for their age).
 *
 * Example: `nhlOptionThreshold = 2` means the player can include an NHL
 * clause only if the contract is ≥ 2 years.
 */
export function computeNhlOptionThreshold(age: number, skill: number): number {
  if (age >= 26) {
    return 0;
  }
  if (age <= 20) {
    if (skill >= 13) {
      return 2;
    }
    if (skill >= 10) {
      return 3;
    }
    if (skill >= 8) {
      return 4;
    }
    return 0;
  }
  if (age <= 23) {
    if (skill >= 13) {
      return 2;
    }
    if (skill >= 11) {
      return 3;
    }
    if (skill >= 9) {
      return 4;
    }
    return 0;
  }
  if (age === 24) {
    if (skill >= 13) {
      return 2;
    }
    if (skill >= 12) {
      return 3;
    }
    return 0;
  }
  // age = 25
  if (skill >= 13) {
    return 2;
  }
  return 0;
}

/**
 * Player's asking salary for a given offer — port of `palkehd(2)` computation
 * (ILEX5.BAS:6425-6437).
 *
 * This is what the player thinks is fair given the current offer parameters.
 * The manager's offered salary (`palkehd(1)`) is then compared against this
 * to compute acceptance probability.
 */
export function computeAskingPrice(
  player: MarketPlayer,
  baseSalary: number,
  teamNeedsRating: number,
  duration: number,
  clause: SpecialClause,
  nhlOptionThreshold: number
): number {
  // palkehd(2) = rahna * (1 + (ego - 10) * 0.01)
  let asking = baseSalary * (1 + (player.ego - 10) * 0.01);
  // *= (1 + a * 0.1)  — a is negative, so this reduces asking price slightly
  asking *= 1 + teamNeedsRating * 0.1;
  // *= (1 + (26 - age) * 0.01 * (duration - 1))  — young players cost more for long deals
  asking *= 1 + (26 - player.age) * 0.01 * (duration - 1);
  // Free-fire clause: player demands premium
  if (clause === "free-fire") {
    asking *= 1.1 + 0.02 * player.leadership;
  }
  // Long contract without NHL clause (when clause is eligible): player demands premium
  if (
    nhlOptionThreshold > 0 &&
    duration >= nhlOptionThreshold &&
    clause !== "nhl"
  ) {
    asking *= 1 + 0.1 * (duration - nhlOptionThreshold + 1);
  }
  return asking;
}

/**
 * Acceptance probability — port of `sin1` computation (ILEX5.BAS:6438-6439).
 *
 * `sin1 = (mtaito(3) * 5) + 50 - (100 - ((ratio^3) * 100))`
 * where `ratio = offeredSalary / askingPrice`.
 *
 * sin1 is the threshold: if `100 * RND < sin1`, player accepts.
 * Ranges roughly from -100 (never accepts) to 200+ (certain accept).
 */
export function computeAcceptanceProbability(
  offeredSalary: number,
  askingPrice: number,
  managerNegotiation: number
): number {
  const ratio = offeredSalary / askingPrice;
  const cubed = ratio * ratio * ratio;
  return managerNegotiation * 5 + 50 - (100 - cubed * 100);
}

/**
 * One negotiation attempt — port of ILEX5.BAS:6516-6530 (`CASE 4` handler).
 *
 * @param acceptanceProbability - result of `computeAcceptanceProbability`
 * @param willingnessThreshold  - current `sopimus(2)` value
 * @param negotiationRound      - `d` counter (increments by 2 each attempt)
 * @param managerNegotiation    - `mtaito(3)` for threshold recovery
 * @param random01 - uniform [0, 1) from the caller's Random instance
 */
export function attemptNegotiation(
  acceptanceProbability: number,
  willingnessThreshold: number,
  negotiationRound: number,
  managerNegotiation: number,
  random01: number
): NegotiateAttemptResult {
  const sin2 = random01 * 100;

  if (sin2 < acceptanceProbability) {
    const happy = acceptanceProbability - sin2 > 50;
    return { outcome: "accepted", happy };
  }

  // QB: if sin1 < -10, immediately zero out sopimus(2)
  let newThreshold = willingnessThreshold;
  if (acceptanceProbability < -10) {
    newThreshold = 0;
  }

  // QB: sopimus(2) = sopimus(2) - d + INT(mtaito(3) * RND)
  // d has already been incremented by 2 before this call (we pass the new d).
  const recovery = Math.floor(managerNegotiation * random01);
  newThreshold = newThreshold - negotiationRound + recovery;

  return { outcome: "rejected", newThreshold };
}

/**
 * Adjust offered salary by ±1.5% per click, clamped to a minimum of 50.
 * Port of ILEX5.BAS:6493-6506.
 */
export function adjustSalary(
  current: number,
  direction: "up" | "down"
): number {
  if (direction === "up") {
    return Math.round(current + current * 0.015);
  }
  return Math.max(50, Math.round(current - current * 0.015));
}

/**
 * AI season-strategy distribution — port of QB `SUB valitsestrattie`
 * (the proxy/`mahd` lottery at [MHM2K.BAS:2470-2503](../mhm2000-qb/MHM2K.BAS) /
 * [ILEZ5.BAS:1990-2034](../mhm2000-qb/ILEZ5.BAS)).
 *
 * For every AI manager in PHL / Divisioona / Mutasarja, the original
 * computes a per-team "proxy(4)" — the team's mean of three component
 * ratios (goalie/defence/attack vs the competition averages over AI
 * teams only) — and uses it to look up a weighted lottery between the
 * three season strategies (`valm`):
 *
 *     1 = JURI SIMONOV     (autumn slump → spring peak)
 *     2 = KAIKKI PELIIN!   (front-loaded, fades)
 *     3 = TASAINEN PUURTO  (flat)
 *
 * Stronger teams skew toward SIMONOV — they can absorb the rough
 * autumn for a strong spring. Weaker teams spread their bets, with
 * KAIKKI PELIIN! peaking in the middle of the strength range as a
 * "go for it now" gamble.
 *
 * Light teams (NHL / European / amateur) never run through this
 * distribution — they're forced to TASAINEN PUURTO via the
 * `strategy:tasainen-puurto` tag on the shared Pier Paolo Proxy
 * Pasolini manager. Juri Simonov (manager id 33 in QB) is similarly
 * pinned to SIMONOV via the `strategy:simonov` tag — the QB hard-
 * codes that override at the same call site (`IF man = 33 THEN
 * mahd(1) = 100`).
 *
 * The per-component ratios `proxy(1..3)` are computed in the QB but
 * never read after `proxy(4)` is folded out of them. We mirror that:
 * we expose the average ratio only.
 */

import type { TeamStrength } from "@/data/levels";
import type { StrategyId } from "@/data/mhm2000/strategies";
import { calculateStrength } from "@/services/team";
import type { Manager, Team } from "@/state";
import { forcedStrategyForManager } from "@/data/mhm2000/strategies";
import type { Random } from "random-js";

/**
 * Lottery weights for the three strategies in QB `valm` order:
 * `[SIMONOV, KAIKKI_PELIIN, TASAINEN_PUURTO]`. Always sums to 100 in
 * the original table — kept that way for parity, but the rolling
 * helper does not assume it.
 */
export type StrategyWeights = readonly [number, number, number];

type StrategyBand = {
  /** Inclusive lower bound on `proxy(4)`. The first band uses `-Infinity`. */
  min: number;
  /** Exclusive upper bound on `proxy(4)`. The last band uses `+Infinity`. */
  max: number;
  weights: StrategyWeights;
};

/**
 * 1-1 port of the `SELECT CASE proxy(4, xx)` table at
 * [MHM2K.BAS:2477-2491](../mhm2000-qb/MHM2K.BAS).
 *
 * QB band boundaries are written with a `.0000001` cliff between
 * `<= X` and `X.0000001 TO Y` — a single-precision rounding artefact.
 * We model the same partitioning using strict `<` upper bounds, which
 * produces the same assignment for every realistic `proxy(4)` value.
 */
const STRATEGY_BANDS: readonly StrategyBand[] = [
  { min: -Infinity, max: 0.7, weights: [20, 40, 40] },
  { min: 0.7, max: 0.8, weights: [10, 40, 50] },
  { min: 0.8, max: 0.9, weights: [20, 30, 50] },
  { min: 0.9, max: 0.95, weights: [30, 10, 60] },
  { min: 0.95, max: 1.05, weights: [48, 4, 48] },
  { min: 1.05, max: 1.1, weights: [70, 1, 29] },
  { min: 1.1, max: 1.2, weights: [85, 0, 15] },
  { min: 1.2, max: Infinity, weights: [100, 0, 0] }
] as const;

/**
 * Per-component arithmetic mean of the supplied teams' realised
 * strengths. 1-1 with QB:
 *
 *     koko(1) = AVG(mw)   ' goalie
 *     koko(2) = AVG(pw)   ' defence
 *     koko(3) = AVG(hw)   ' attack
 *
 * Pass only the AI teams of one competition — the QB explicitly skips
 * human-controlled teams (`IF ohj(x(xx)) = 0 THEN ...`) when building
 * the average.
 *
 * Returns `undefined` when given an empty list — there is no sensible
 * "average of nothing" and the caller must handle it (in practice this
 * means "no AI teams in this competition, skip the distribution").
 */
export const competitionStrengthAverages = (
  teams: readonly Team[]
): TeamStrength | undefined => {
  if (teams.length === 0) {
    return undefined;
  }
  const total = teams.reduce(
    (acc, t) => {
      const s = calculateStrength(t);
      acc.goalie += s.goalie;
      acc.defence += s.defence;
      acc.attack += s.attack;
      return acc;
    },
    { goalie: 0, defence: 0, attack: 0 }
  );
  return {
    goalie: total.goalie / teams.length,
    defence: total.defence / teams.length,
    attack: total.attack / teams.length
  };
};

/**
 * Computes QB `proxy(4, xx)` — the team's mean per-component strength
 * ratio against the competition averages. A value of 1.0 means
 * "exactly average for this competition", 1.2 means "20% above
 * average", 0.7 means "30% below".
 *
 * 1-1 with QB at [MHM2K.BAS:2474-2477](../mhm2000-qb/MHM2K.BAS):
 *
 *     proxy(1) = mw / koko(1)
 *     proxy(2) = pw / koko(2)
 *     proxy(3) = hw / koko(3)
 *     proxy(4) = (proxy(1) + proxy(2) + proxy(3)) / 3
 *
 * Any zero average component triggers the safe fallback `1.0` (treated
 * as "exactly average") — the QB silently divides by zero in this
 * case, but a competition full of zero-strength teams isn't a real
 * scenario and shouldn't crash us.
 */
export const proxyRatio = (
  own: TeamStrength,
  average: TeamStrength
): number => {
  if (average.goalie === 0 || average.defence === 0 || average.attack === 0) {
    return 1;
  }
  return (
    (own.goalie / average.goalie +
      own.defence / average.defence +
      own.attack / average.attack) /
    3
  );
};

/**
 * Looks up the lottery weights for a given `proxy(4)` value. 1-1 with
 * the QB `SELECT CASE` table — see `STRATEGY_BANDS` above.
 */
export const strategyWeightsForProxy = (proxy: number): StrategyWeights => {
  for (const band of STRATEGY_BANDS) {
    if (proxy >= band.min && proxy < band.max) {
      return band.weights;
    }
  }
  // Unreachable: bands cover (-Infinity, +Infinity). Defensive fallback.
  return [0, 0, 100];
};

/**
 * Rolls a `StrategyId` from the supplied weights. 1-1 with QB:
 *
 *     gnome = INT((mahd(1) + mahd(2) + mahd(3)) * RND) + 1
 *     SELECT CASE gnome
 *       CASE 1 TO mahd(1):                           valm = 1
 *       CASE mahd(1)+1 TO mahd(1)+mahd(2):           valm = 2
 *       CASE mahd(1)+mahd(2)+1 TO total:             valm = 3
 *
 * `random.integer(1, total)` matches `INT(total * RND) + 1` for our
 * uniform RNG (closed interval, no biased rounding — mahd is a fresh
 * MHM 2000 mechanic, no `cinteger` baggage).
 */
export const rollStrategyFromWeights = (
  weights: StrategyWeights,
  random: Random
): StrategyId => {
  const [s1, s2, s3] = weights;
  const total = s1 + s2 + s3;
  if (total <= 0) {
    return 3;
  }
  const roll = random.integer(1, total);
  if (roll <= s1) {
    return 1;
  }
  if (roll <= s1 + s2) {
    return 2;
  }
  return 3;
};

/**
 * Top-level entry point: assigns a `StrategyId` to every AI team in a
 * single competition, honouring forced `strategy:*` manager tags
 * before falling back to the proxy/`mahd` lottery.
 *
 * Mirrors the QB outer `FOR a = 1 TO 3` competition loop and the
 * inner `FOR xx = 1 TO d` per-team roll. Light / human-managed teams
 * are not included by the caller — `season-start.ts` filters those
 * out before invoking us.
 *
 * Returns a fresh map keyed by `team.id` so the caller can apply the
 * picks back into the immer draft without touching the inputs.
 */
export const distributeAIStrategies = (
  aiTeamsInCompetition: readonly Team[],
  managers: Record<string, Manager>,
  random: Random
): Map<number, StrategyId> => {
  const picks = new Map<number, StrategyId>();
  if (aiTeamsInCompetition.length === 0) {
    return picks;
  }
  const averages = competitionStrengthAverages(aiTeamsInCompetition);
  if (!averages) {
    return picks;
  }
  for (const team of aiTeamsInCompetition) {
    const manager = team.manager ? managers[team.manager] : undefined;
    const forced = manager ? forcedStrategyForManager(manager.tags) : undefined;
    if (forced !== undefined) {
      picks.set(team.id, forced);
      continue;
    }
    const own = calculateStrength(team);
    const proxy = proxyRatio(own, averages);
    const weights = strategyWeightsForProxy(proxy);
    picks.set(team.id, rollStrategyFromWeights(weights, random));
  }
  return picks;
};

/**
 * Competition ids that carry `valm`-driven AI teams in MHM 2000.
 * Tracks the QB outer loop in `valitsestrattie`:
 *
 *     a = 1 → b=1,  c=12  → PHL        (12 teams)
 *     a = 2 → b=13, c=24  → Divisioona (12 teams)
 *     a = 3 → b=25, c=48  → Mutasarja  (24 teams)
 *
 * EHL / cup / tournaments / training do not have a season-arc
 * strategy concept (their participants come from these three pools
 * and reuse whatever `valm` was set there).
 */
export const STRATEGY_COMPETITION_IDS = [
  "phl",
  "division",
  "mutasarja"
] as const;

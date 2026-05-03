/**
 * MHM 2000 game service — thin façade over the MHM 2000 match engine.
 *
 * Mirrors the shape of [src/services/game.ts](../game.ts)'s
 * `GameService` (the inherited MHM 97 simulator) so the rest of the
 * app can swap engines without rewiring its call sites. Internally it
 * delegates to `simulateMatch` ([./simulate-match.ts](./simulate-match.ts)),
 * the faithful port of `SUB ottpel`
 * ([ILEX5.BAS:3709-4017](../../mhm2000-qb/ILEX5.BAS)).
 *
 * Scope right now: AI-vs-AI base teams only. Human-managed teams,
 * light teams (NHL / foreign / amateur), services, pranks, and
 * consumables are all TODO — see the long list in
 * `simulate-match.ts`.
 */
import defaultRandom, { type RandomService } from "@/services/random";
import {
  simulateMatch,
  type MatchContext,
  type MatchResult,
  type MatchSide
} from "@/services/mhm-2000/simulate-match";
import type { GameResult } from "@/types/competitions";

/**
 * Inputs for one MHM 2000 game simulation.
 *
 * Compared to the MHM 97 `GameInput`, this is much smaller:
 *
 *   - No `advantage` callback — home advantage is hard-coded into
 *     `etu` per round type (QB `SELECT CASE kiero(kr)`).
 *   - No `base()` / `moraleEffect()` / `overtime()` callbacks — the
 *     scoring divisors (30 / 60 / 120), the asymmetric morale tweak
 *     (`mo/125` vs `mo/155`), and the overtime rules are all baked
 *     into the engine, exactly as they are in QB. Per-competition
 *     variation comes from the `round.type` discriminator only.
 *   - No `competitionId` / `phaseId` strings — the QB `kiero(kr)`
 *     code carries the same information in a single integer.
 *
 * As more mechanics port in (services, consumables, pranks, league
 * comeback handicap, …) we expect to grow `MatchSide` and
 * `MatchContext`, never `MHM2000GameInput` itself.
 */
export type MHM2000GameInput = {
  home: MatchSide;
  away: MatchSide;
  context: MatchContext;
};

/**
 * Service surface. Same naming convention as
 * [src/services/game.ts](../game.ts)'s `GameService` so future call
 * sites read symmetrically.
 *
 * `simulate` returns the full `MatchResult` (richer than MHM 97's
 * `GameResult` — includes morale deltas the caller will want to apply
 * after the match). A `toGameResult` helper is provided for sites that
 * still consume the legacy `GameResult` shape.
 */
export type MHM2000GameService = {
  simulate: (game: MHM2000GameInput) => MatchResult;
};

/**
 * Convert an MHM 2000 match result down to the legacy `GameResult`
 * shape, dropping the morale deltas. Useful at any boundary that
 * still speaks the inherited shape (e.g. league standings code that
 * was originally written for MHM 97).
 */
export const toGameResult = (result: MatchResult): GameResult => ({
  home: result.homeGoals,
  away: result.awayGoals,
  overtime: result.overtime
});

export const createMHM2000GameService = (
  random: RandomService = defaultRandom
): MHM2000GameService => {
  const simulate = (game: MHM2000GameInput): MatchResult =>
    simulateMatch(game.home, game.away, game.context, random);

  return { simulate };
};

// Default instance using the app-wide random.
const defaultService = createMHM2000GameService(defaultRandom);

export const simulate = defaultService.simulate;

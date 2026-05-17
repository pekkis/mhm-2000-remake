import { domesticTeamsByCompetitionTier } from "@/machines/selectors";
import { competitionFromTier } from "@/services/competition";
import type { AITeam } from "@/state/game";
import type { GameContext } from "@/state/game-context";
import type { RoundRobinGroup } from "@/types/competitions";
import type { Random } from "random-js";

/**
 * AI team selection helpers for random events (`uutisia`).
 *
 * Ports two QB SUBs from `ILEX5.BAS`:
 *
 * ## `arpo(arf%)` (line 731)
 *
 * Picks a random domestic AI team. Two modes:
 *
 * | QB call    | Filter                              | TS function                    |
 * | ---------- | ----------------------------------- | ------------------------------ |
 * | `arpo 1`   | any AI team (`ohj(xx) = 0`)         | `getRandomAiTeam`              |
 * | `arpo 2`   | AI team with no active taut mult.   | `getRandomAITeamWithNoEffects` |
 *
 * QB loops forever until a match is found; we throw on empty pool instead.
 *
 * ## `arpol(cus%, ttt%, voiz%)` (line 747)
 *
 * League-filtered AI team selection. Four modes via `ttt%`:
 *
 * | QB call             | Mode | Filter                                     | TS function                           |
 * | ------------------- | ---- | ------------------------------------------ | ------------------------------------- |
 * | `arpol d, 1, voiz%` | 1    | random from league `d`, `tazo >= voiz%`    | `getRandomAiTeamFromLeagueByTier`     |
 * | `arpol d, 2, voiz%` | 2    | random from league `d`, `tazo <= voiz%`    | `getRandomAiTeamFromLeagueByTier`     |
 * | `arpol d, 3, voiz%` | 3    | first AI from standings top→`voiz%`        | `getRandomAiTeamFromLeagueByRanking`  |
 * | `arpol d, 4, voiz%` | 4    | first AI from standings bottom→`voiz%`     | `getRandomAiTeamFromLeagueByRanking`  |
 *
 * `cus%` = league (1=PHL, 2=1.div, 3=2.div). `lukka` output flag (0=found, 1=failed)
 * maps to our `AITeam | null` return type.
 *
 * Modes 1–2 retry up to 20 times in QB; our version filters the full pool (no false misses).
 * Modes 3–4 are deterministic within each group (first AI team in scan order).
 * For multi-group leagues (2.div), we pick randomly among group winners.
 */
export const createRandomEventsRandomizer = (random: Random) => {
  const getRandomAiTeam = (context: GameContext): AITeam => {
    const teams = context.teams
      .filter((t) => t.kind === "ai")
      .filter((t) => t.domestic === true);

    if (teams.length === 0) {
      throw new Error("Run out of AI teams...");
    }

    return random.pick(teams);
  };

  const getRandomAITeamWithNoEffects = (context: GameContext): AITeam => {
    const teams = context.teams
      .filter((t) => t.kind === "ai")
      .filter((t) => t.domestic === true)
      .filter((t) => !t.effects.some((e) => e.kind === "global"));

    if (teams.length === 0) {
      throw new Error("Run out of AI teams...");
    }

    return random.pick(teams);
  };

  type TierOptions = {
    tier: 1 | 2 | 3;
    minTier?: number;
    maxTier?: number;
  };

  const getRandomAiTeamFromLeagueByTier = (
    context: GameContext,
    options: TierOptions
  ): AITeam | null => {
    const { tier, minTier = -Infinity, maxTier = Infinity } = options;

    const teams = domesticTeamsByCompetitionTier(tier)(context)
      .filter((t) => t.kind === "ai")
      .filter((t) => {
        return t.tier >= minTier;
      })
      .filter((t) => {
        return t.tier <= maxTier;
      });

    if (teams.length === 0) {
      return null;
    }

    return random.pick(teams);
  };

  type RankingOptions = {
    tier: 1 | 2 | 3;
    threshold: number;
    from: "top" | "bottom";
  };

  const getRandomAiTeamFromLeagueByRanking = (
    context: GameContext,
    options: RankingOptions
  ): AITeam | null => {
    const { tier, threshold, from } = options;

    const comp = competitionFromTier(tier);
    const competition = context.competitions[comp];
    const groups = competition.phases[0].groups as RoundRobinGroup[];

    // QB arpol modes 3/4: scan standings from one end to a threshold rank.
    // Mode 3 (top):    FOR zz = 1  TO voiz% STEP  1  → ranks 1..threshold
    // Mode 4 (bottom): FOR zz = 12 TO voiz% STEP -1  → ranks threshold..last
    // Deterministic within each group: first AI team in scan order wins.
    // Across groups: random pick (PHL/1.div = 1 group = trivial,
    // mutasarja = 2 groups = coin flip between group winners).
    const candidates = groups
      .map((group) => {
        const slice =
          from === "top"
            ? group.stats.slice(0, threshold)
            : group.stats.slice(threshold - 1).toReversed();

        return slice
          .map((s) => context.teams[s.id])
          .find((t): t is AITeam => t.kind === "ai");
      })
      .filter((t): t is AITeam => t !== undefined);

    if (candidates.length === 0) {
      return null;
    }

    return random.pick(candidates);
  };

  return {
    getRandomAiTeam,
    getRandomAITeamWithNoEffects,
    getRandomAiTeamFromLeagueByTier,
    getRandomAiTeamFromLeagueByRanking
  };
};

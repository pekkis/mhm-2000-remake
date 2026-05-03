import defaultRandom from "./random";
import type { RandomService } from "./random";
import { entries, pipe } from "remeda";
import { getEffective, getEffectiveOpponent } from "@/services/effects";
import services from "@/data/services";
import type { Team } from "@/state/game";
import type {
  GameResult,
  GameFacts,
  GamedayAdvantage
} from "@/types/competitions";
import type { Manager } from "@/state/manager";

export type GameInput = {
  home: Team;
  away: Team;
  homeManager: Manager;
  awayManager: Manager;
  advantage: GamedayAdvantage;
  base: () => number;
  moraleEffect: (team: Team) => number;
  overtime: (result: GameResult) => boolean;
  competitionId: string;
  phaseId: number;
};

export type GameService = {
  simulate: (game: GameInput) => GameResult;
};

const createPlayOvertime =
  (r: RandomService) =>
  (
    homeStrength: number,
    awayStrength: number,
    result: GameResult
  ): GameResult => {
    let victor: "home" | "away" | null = null;
    do {
      const home = r.integer(0, homeStrength);
      const away = r.integer(0, awayStrength);

      if (home > away) {
        victor = "home";
      }

      if (home < away) {
        victor = "away";
      }
    } while (!victor);

    return {
      ...result,
      [victor]: result[victor] + 1,
      overtime: true
    };
  };

export const createGameService = (r: RandomService): GameService => {
  const playOvertime = createPlayOvertime(r);

  const simulate = (game: GameInput): GameResult => {
    const raw = { home: game.home, away: game.away };

    const managers = { home: game.homeManager, away: game.awayManager };

    const effective = {
      home: getEffectiveOpponent(getEffective(raw.home), raw.away),
      away: getEffectiveOpponent(getEffective(raw.away), raw.home)
    };

    const base = game.base;
    const overtime = game.overtime;

    const competitionId = game.competitionId;
    const phaseId = game.phaseId;

    const effects: Array<(team: Team, key: "home" | "away") => number> = [
      (team) => team.strength,
      (team) => game.moraleEffect(team),
      (team, key) => game.advantage[key](team),
      (team) => team.readiness
    ];

    const managerEffectValues: Record<string, number> = {};
    for (const key of ["home", "away"] as const) {
      const manager = managers[key];
      if (!manager || manager.kind === "ai") {
        managerEffectValues[key] = 0;
      } else {
        let total = 0;
        const svc = manager.services;
        for (const [k, s] of entries(svc)) {
          if (s) {
            total += services[k].effect(competitionId, phaseId);
          }
        }
        managerEffectValues[key] = total;
      }
    }

    const strengths = {
      home:
        effects.reduce((sum, e) => sum + e(effective.home, "home"), 0) +
        managerEffectValues.home,
      away:
        effects.reduce((sum, e) => sum + e(effective.away, "away"), 0) +
        managerEffectValues.away
    };

    const result: GameResult = {
      home: pipe(
        strengths.home,
        (s) => r.integer(0, s),
        (val) => val / base(),
        (val) => (val < 0 ? 0 : val),
        (number) => parseInt(number.toFixed(0), 10)
      ),
      away: pipe(
        strengths.away,
        (s) => r.integer(0, s),
        (val) => val / base(),
        (val) => (val < 0 ? 0 : val),
        (number) => parseInt(number.toFixed(0), 10)
      ),
      overtime: false
    };

    const needsOvertime = overtime(result);

    if (!needsOvertime) {
      return result;
    }

    return playOvertime(strengths.home, strengths.away, result);
  };

  return { simulate };
};

// Default instance using the app-wide random
const defaultGameService = createGameService(defaultRandom);

export const simulate = defaultGameService.simulate;

export const resultFacts = (
  result: GameResult,
  key: "home" | "away"
): GameFacts => {
  const theirKey = key === "home" ? "away" : "home";

  return {
    isWin: result[key] > result[theirKey],
    isDraw: result[key] === result[theirKey],
    isLoss: result[key] < result[theirKey]
  };
};

export const gameFacts = (
  game: { home: number; away: number; result?: GameResult },
  team: number
): GameFacts => {
  const isHome = team === game.home;
  const myKey = isHome ? "home" : "away";
  return resultFacts(game.result!, myKey);
};

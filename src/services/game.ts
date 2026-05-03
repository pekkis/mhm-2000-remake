import type { Team } from "@/state/game";
import type {
  GameResult,
  GameFacts,
  GamedayAdvantage
} from "@/types/competitions";
import type { Manager } from "@/state/game";

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

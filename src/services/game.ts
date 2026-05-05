import type { GameResult, GameFacts } from "@/types/competitions";

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

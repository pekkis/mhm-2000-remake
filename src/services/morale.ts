import type { GameFacts } from "@/types/competitions";

export const defaultMoraleBoost = (facts: GameFacts): number => {
  if (facts.isWin) {
    return 1;
  } else if (facts.isLoss) {
    return -1;
  }

  return 0;
};

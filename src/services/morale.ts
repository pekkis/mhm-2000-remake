import { Facts, DifficultyLevel, DifficultyLevels } from "../types/base";
import { max, min } from "ramda";
import difficultyLevels from "./difficulty-levels";

export const defaultMoraleBoost = (facts: Facts): number => {
  if (facts.isWin) {
    return 1;
  } else if (facts.isLoss) {
    return -1;
  }

  return 0;
};

export const normalizeMorale = (
  difficultyLevel: DifficultyLevels,
  morale: number
): number => {
  const dl = difficultyLevels[difficultyLevel];
  return max(dl.moraleMin, min(morale, dl.moraleMax));
};

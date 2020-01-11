import { Facts } from "../data/competitions/phl";

export const defaultMoraleBoost = (facts: Facts): number => {
  if (facts.isWin) {
    return 1;
  } else if (facts.isLoss) {
    return -1;
  }

  return 0;
};

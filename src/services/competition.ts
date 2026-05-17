import type { CompetitionId } from "@/types/competitions";

type CompetitionTier = 1 | 2 | 3;

export const competitionFromTier = (tier: CompetitionTier): CompetitionId => {
  if (tier === 1) {
    return "phl";
  }

  if (tier === 2) {
    return "division";
  }

  if (tier === 3) {
    return "mutasarja";
  }

  throw new Error("Invalid tier");
};

import { CRISIS_COST } from "@/data/constants";
import type { Team } from "@/state/game";
import type { Competition } from "@/types/competitions";

type CrisisResult = {
  amount: number;
  moraleGain: number;
};

const crisis = (
  team: Team,
  competitions: Record<string, Competition>
): CrisisResult => {
  const division = competitions.division;

  const amount = division.teams.includes(team.id)
    ? CRISIS_COST / 2
    : CRISIS_COST;

  return {
    amount,
    moraleGain: 4
  };
};

export default crisis;

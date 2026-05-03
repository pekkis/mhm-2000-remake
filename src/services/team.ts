import type { TeamStrength } from "@/data/levels";
import { rollTeamStrength } from "@/services/levels";
import type { Team } from "@/state";

export const calculateStrength = (team: Team): TeamStrength => {
  if (team.kind === "ai") {
    return team.strengthObj;
  }

  // @todo: this is just mock until we have implemented human team specific calculations!
  return rollTeamStrength(team.tier);
};

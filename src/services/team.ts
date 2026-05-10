import type { TeamStrength } from "@/data/levels";
import {
  calculateLineupStrength,
  calculatePenaltyKillStrength,
  calculatePowerPlayStrength
} from "@/services/lineup";
import type { Manager, Team } from "@/state";

/**
 * Compute the base `{ goalie, defence, attack }` triple for a team.
 *
 * - **AI teams:** read directly from `strengthObj` (TASOT.M2K-derived,
 *   set at season start by `tasomaar`).
 * - **Human teams:** computed from the actual roster + lineup via
 *   `calculateLineupStrength`, port of SUB voimamaar (ILEX5.BAS:8429-8490).
 */
export const calculateStrength = (team: Team): TeamStrength => {
  if (team.kind === "ai") {
    const { goalie, defence, attack } = team.strengthObj;
    const doping = team.services.doping;
    return {
      goalie: goalie + doping,
      defence: defence + doping * 6,
      attack: attack + doping * 12
    };
  }

  return calculateLineupStrength(
    team.lineup,
    team.players,
    team.services.doping
  );
};

/**
 * Power-play weight. QB `yw(team)` at ILEX5.BAS:8497-8540.
 *
 * - **AI teams:** approximation from base attack/defence stats:
 *   `yw = (hw / 3.3 + pw / 2.5) × (1 + mtaito(2) × 0.04)`
 * - **Human teams:** sum of effective strength for each PP slot
 *   (including per-player `yvo` bonuses), multiplied by the
 *   manager's special-teams attribute.
 */
export const calculateYw = (team: Team, manager: Manager): number => {
  const specialTeamsMult = 1 + manager.attributes.specialTeams * 0.04;

  if (team.kind === "ai") {
    const { defence, attack } = calculateStrength(team);
    const doping = team.services.doping;
    // QB adds erik(3)*5 AFTER the specialTeams multiplier.
    return (attack / 3.3 + defence / 2.5) * specialTeamsMult + doping * 5;
  }

  return (
    calculatePowerPlayStrength(
      team.lineup,
      team.players,
      team.services.doping
    ) * specialTeamsMult
  );
};

/**
 * Penalty-kill weight. QB `aw(team)` at ILEX5.BAS:8497-8540.
 *
 * - **AI teams:** approximation from base attack/defence stats:
 *   `aw = (hw / 4.4 + pw / 2.5) × (1 + mtaito(2) × 0.04)`
 * - **Human teams:** sum of effective strength for each PK slot
 *   (including per-player `avo` bonuses), multiplied by the
 *   manager's special-teams attribute.
 */
export const calculateAw = (team: Team, manager: Manager): number => {
  const specialTeamsMult = 1 + manager.attributes.specialTeams * 0.04;

  if (team.kind === "ai") {
    const { defence, attack } = calculateStrength(team);
    const doping = team.services.doping;
    // QB adds erik(3)*4 AFTER the specialTeams multiplier.
    return (attack / 4.4 + defence / 2.5) * specialTeamsMult + doping * 4;
  }

  return (
    calculatePenaltyKillStrength(
      team.lineup,
      team.players,
      team.services.doping
    ) * specialTeamsMult
  );
};

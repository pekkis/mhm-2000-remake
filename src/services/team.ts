import type { TeamStrength } from "@/data/levels";
import { calculateLineupStrength } from "@/services/lineup";
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
    return team.strengthObj;
  }

  return calculateLineupStrength(team.lineup, team.players);
};

/**
 * Power-play weight. QB `yw(team)` at ILEX5.BAS:328-329.
 *
 * For both AI and human teams this currently uses the approximation
 * formula derived from the base attack/defence stats:
 *
 *     yw = (hw / 3.3 + pw / 2.5) × (1 + mtaito(2) × 0.04)
 *
 * TODO: for human teams, compute from the actual PP lineup slots
 * with per-player `yvo` bonuses (QB voimamaar ILEX5.BAS:8497-8527).
 * The dedicated PP unit strength should replace the approximation
 * formula once the PP lineup → strength pipeline is wired.
 */
export const calculateYw = (team: Team, manager: Manager): number => {
  const { defence, attack } = calculateStrength(team);
  const specialTeamsMult = 1 + manager.attributes.specialTeams * 0.04;
  return (attack / 3.3 + defence / 2.5) * specialTeamsMult;
};

/**
 * Penalty-kill weight. QB `aw(team)` at ILEX5.BAS:328-329.
 *
 * Same approximation as `calculateYw` — see its docstring for the
 * TODO on human-team PP/PK lineup-based computation.
 */
export const calculateAw = (team: Team, manager: Manager): number => {
  const { defence, attack } = calculateStrength(team);
  const specialTeamsMult = 1 + manager.attributes.specialTeams * 0.04;
  return (attack / 4.4 + defence / 2.5) * specialTeamsMult;
};

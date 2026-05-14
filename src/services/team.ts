import type { TeamStrength } from "@/data/levels";
import {
  calculateLineupStrength,
  calculatePenaltyKillStrength,
  calculatePowerPlayStrength
} from "@/services/lineup";
import type { Manager, Team } from "@/state/game";
import { values } from "remeda";

/**
 * QB `sr(team)` — league tier 1=PHL, 2=Divisioona, 3=Mutasarja.
 *
 * Derives the tier from competition participation at runtime, not from
 * static ID ranges. Returns `undefined` for light teams (NHL/EHL/amateur)
 * that aren't part of the Pekkalandia ladder.
 *
 * Accepts any object per competition that has a `teams` array — works
 * with both `Competition` and `Draft<Competition>`.
 */
export const leagueTier = (
  teamId: number,
  competitions: {
    phl: { teams: number[] };
    division: { teams: number[] };
    mutasarja: { teams: number[] };
  }
): 1 | 2 | 3 | undefined => {
  if (competitions.phl.teams.includes(teamId)) {
    return 1;
  }
  if (competitions.division.teams.includes(teamId)) {
    return 2;
  }
  if (competitions.mutasarja.teams.includes(teamId)) {
    return 3;
  }
  return undefined;
};

/**
 * Mean charisma (`kar`) of a team's roster. QB `avg(3, ohj)`.
 *
 * - **Human teams:** arithmetic mean of all rostered players' `charisma`.
 * - **AI teams:** neutral 10 (QB default; AI rosters are synthetic).
 *
 * Returns 10 if the human team has an empty roster (shouldn't happen
 * in practice, but safe default).
 */
export const getAverageCharisma = (team: Team): number => {
  if (team.kind === "ai") {
    return 10;
  }
  const players = values(team.players);
  if (players.length === 0) {
    return 10;
  }
  return players.reduce((sum, p) => sum + p.charisma, 0) / players.length;
};

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

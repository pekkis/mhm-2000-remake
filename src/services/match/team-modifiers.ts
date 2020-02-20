import { Team } from "../../types/team";

export const moraleModifier = (team: Team, advantage: number) => {
  if (team.morale === 0) {
    return advantage;
  }

  if (team.morale > 0) {
    return advantage + team.morale / 155;
  }

  return advantage + team.morale / 125;
};

export const intensityModifier = (team: Team, advantage: number) => {
  if (team.intensity === 1) {
    return advantage;
  }

  if (team.intensity === 0) {
    return advantage - 0.15;
  }

  if (team.intensity === 2) {
    return advantage + 0.1;
  }

  throw new Error(`Invalid intensity value ${team.intensity}`);
};

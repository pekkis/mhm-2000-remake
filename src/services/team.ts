import teamData from "./data/teams";
import { values, find, map, prop, pipe, sortWith, ascend } from "ramda";
import { Team, TeamStrength } from "../types/team";
import levels from "./data/team-levels";

const isTeam = (team: Team | undefined): team is Team => {
  return team !== undefined;
};

export const nameToId = (name: string) => {
  const found = find(
    team => team.name.toLowerCase() === name.toLowerCase(),
    values(teamData)
  );

  if (!found) {
    throw new Error("Not found");
  }

  return found.id;
};

export const namesToIds = (names: string[]): string[] => {
  return map(nameToId, names);
};

export const teamSorter = sortWith<Team>([
  ascend(prop("name")),
  ascend(prop("id"))
]);

export const teamListByIds = (
  teamMap: { [key: string]: Team },
  ids: string[]
): Team[] => {
  return pipe(
    map<string, Team>(id => teamMap[id]),
    teamSorter
  )(ids);
};

export const teamLevelToStrength = (level: number): TeamStrength => {
  const data = levels[level - 1];
  if (!data) {
    throw new Error("Invalid team level");
  }

  return {
    g: data.g,
    d: data.d,
    a: data.a
  };
};

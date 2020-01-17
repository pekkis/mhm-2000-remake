import teamData from "./data/teams";
import { values, find, map, prop, pipe, sortWith, ascend } from "ramda";
import { Team } from "../types/team";

const isTeam = (team: Team | undefined): team is Team => {
  return team !== undefined;
};

export const namesToIds = (names: string[]): string[] => {
  const found = map(name => {
    return find(
      team => team.name.toLowerCase() === name.toLowerCase(),
      values(teamData)
    );
  }, names);

  const filtered: Team[] = found.filter(isTeam);

  if (filtered.length !== names.length) {
    throw new Error("Lenghts dont match");
  }

  return map(prop("id"), filtered);
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

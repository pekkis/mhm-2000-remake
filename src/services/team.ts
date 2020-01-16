import teamData from "../data/teams";
import { findIndex, values, find } from "ramda";

export const namesToIds = (names: string[]): string[] => {
  const found = names.map(name => {
    return find(team => team.name === name, values(teamData));
  });
};

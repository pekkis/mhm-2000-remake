import teamData, { rawTeamStats, StatsData, StatsDatas } from "./data/teams";
import {
  values,
  find,
  map,
  prop,
  pipe,
  sortWith,
  ascend,
  toPairs,
  fromPairs,
  reverse,
  range,
  filter,
  nth
} from "ramda";
import { Team, TeamStrength } from "../types/team";
import levels from "./data/team-levels";
import { TeamStatistic, Streak, SeasonStatistic } from "../types/stats";
import TeamStats from "../components/stats/ManagerStats";

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

const emptyStreak: Streak = {
  win: 0,
  draw: 0,
  loss: 0,
  noLoss: 0,
  noWin: 0
};

export const initialTeamStats = () =>
  pipe(
    (s: StatsDatas) => toPairs(s),
    map(([name, data]): [string, TeamStatistic] => {
      return [
        nameToId(name),
        {
          ranking: reverse(data.ranking),
          streak: emptyStreak
        }
      ];
    }),
    s => fromPairs(s)
  )(rawTeamStats);

export const initialSeasonStats = (): SeasonStatistic[] => {
  const teamStats = toPairs(initialTeamStats());

  return range(0, 3).map(season => {
    const seasonRankings: [string, number][] = map(
      ([id, ts]) => [id, ts.ranking[season]],
      teamStats
    );

    const filtered = filter(([id, ranking]) => ranking <= 3, seasonRankings);

    const sorter = sortWith([ascend(nth(1))]);

    const sorted = sorter(filtered);

    const teamIds = map(nth(0), sorted);

    return {
      medalists: teamIds as [string, string, string]
    };
  });
};

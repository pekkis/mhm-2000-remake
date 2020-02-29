import { v4 as uuid } from "uuid";
import slug from "slugify";
import teamList, {
  rawTeamStats,
  StatsData,
  StatsDatas,
  RawTeamData
} from "./data/teams";
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
  nth,
  indexBy,
  mapObjIndexed
} from "ramda";
import { mapIndexed } from "ramda-adjunct";
import {
  Team,
  TeamStrength,
  HumanControlledTeam,
  ComputerControlledTeam
} from "../types/team";
import levels from "./data/team-levels";
import { TeamStatistic, Streak, SeasonStatistic } from "../types/stats";
import TeamStats from "../components/stats/ManagerStats";

export const isTeam = (team: Team | undefined): team is Team => {
  return team !== undefined;
};

export const isHumanControlledTeam = (
  team: Team
): team is HumanControlledTeam => {
  return team.isHumanControlled;
};

export const isComputerControlledTeam = (
  team: Team
): team is ComputerControlledTeam => {
  return !team.isHumanControlled;
};

const createId = (team: RawTeamData) => {
  return (
    slug(team.name, { lower: true }) +
    "-" +
    uuid()
      .split("-")
      .shift()
  );
};

export const teamData = indexBy(
  prop("id"),
  mapIndexed(
    (team: RawTeamData): Team => ({
      ...team,
      id: createId(team),
      strength: {
        g: -1,
        d: -1,
        a: -1,
        pk: -1,
        pp: -1
      },
      morale: 0,
      isHumanControlled: false,
      effects: [],
      opponentEffects: [],
      readiness: 1,
      intensity: 1,
      organization: {
        benefits: 1,
        care: 1,
        coaching: 1,
        goalieCoaching: 1,
        juniorAcademy: 1
      }
    })
  )(teamList)
);

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
  return [
    {
      medalists: [nameToId("jokerit"), nameToId("tps"), nameToId("hpk")],
      presidentsTrophy: nameToId("jokerit"),
      ehlWinner: nameToId("jokerit"),
      relegated: {
        phl: [],
        division: []
      },
      promoted: {
        division: [],
        mutasarja: []
      }
    },
    {
      medalists: [nameToId("hifk"), nameToId("ilves"), nameToId("jokerit")],
      presidentsTrophy: nameToId("tps"),
      ehlWinner: nameToId("feldkirch"),
      relegated: {
        phl: [],
        division: []
      },
      promoted: {
        division: [],
        mutasarja: []
      }
    },
    {
      medalists: [nameToId("tps"), nameToId("hifk"), nameToId("hpk")],
      presidentsTrophy: nameToId("tps"),
      ehlWinner: nameToId("dynamo"),
      relegated: {
        phl: [nameToId("kalpa")],
        division: []
      },
      promoted: {
        division: [nameToId("pelicans")],
        mutasarja: []
      }
    }
  ];
};

export const normalizeMorale = (morale: number) => {
  return Math.max(-10, Math.min(10, morale));
};

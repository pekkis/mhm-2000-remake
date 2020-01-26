import {
  Schedule,
  CupCompetitionGroup,
  CupStats,
  Matchups,
  Matchup,
  CupTeamStat
} from "../types/base";
import {
  range,
  splitEvery,
  map,
  take,
  sum,
  pluck,
  values,
  flatten,
  filter
} from "ramda";
import random from "./random";
import { matchFacts } from "./match";

const cupScheduler = (matchups: Matchups): Schedule => {
  return [
    matchups.map(pair => ({
      home: pair[0],
      away: pair[1]
    })),
    matchups.map(pair => ({
      home: pair[1],
      away: pair[0]
    }))
  ];
};

export default cupScheduler;

export const cupMatchups = (numberOfTeams: number): Matchups => {
  const teams = range(0, numberOfTeams);
  random.shuffle<number>(teams);
  return splitEvery(2, teams) as Matchups;
};

const mapHomeAndAway = (matchup: Matchup, group: CupCompetitionGroup) => {
  const [home, away] = ["home", "away"].map(which => {
    const index = which === "home" ? 0 : 1;
    const teamIndex = matchup[index];

    const games = take(group.round, group.schedule)
      .map(pairings =>
        pairings.filter(p => p.away === teamIndex || p.home === teamIndex)
      )
      .flat();

    const facts = games.map(g => matchFacts(g, teamIndex));

    const stat: CupTeamStat = {
      index: teamIndex,
      id: group.teams[teamIndex],
      goalsFor: sum(pluck("goalsFor", facts)),
      goalsAgainst: sum(pluck("goalsAgainst", facts))
    };

    return stat;
  });

  return {
    home,
    away
  };
};

export const cupStats = (group: CupCompetitionGroup): CupStats => {
  return map(
    (matchup: Matchup) => mapHomeAndAway(matchup, group),
    group.matchups
  );
};

export const cupWinners = (group: CupCompetitionGroup): string[] => {
  const statsList = flatten(map(values, group.stats));

  const filtered = filter(sl => sl.goalsFor > sl.goalsAgainst, statsList);

  return pluck("id", filtered);
};

import { gameFacts } from "./game";
import {
  Matchups,
  Matchup,
  Schedule,
  ScheduleGame,
  ScheduleRound,
  PlayoffsCompetitionGroup,
  PlayoffTeamStat
} from "../types/base";
import { range, map, sortBy, prop } from "ramda";

const definePlayoffResults = (key: "wins" | "losses") => (
  group: PlayoffsCompetitionGroup
): PlayoffTeamStat[] => {
  const winsToAdvance = group.winsToAdvance;
  const allTeamStats = group.stats.map(stat => [stat.home, stat.away]).flat();
  return sortBy(
    prop("index"),
    allTeamStats.filter(m => m[key] === winsToAdvance)
  );
};

export const victors = definePlayoffResults("wins");

export const eliminated = definePlayoffResults("losses");

const mapHomeAndAway = (matchup: Matchup, group: PlayoffsCompetitionGroup) => {
  const [home, away] = ["home", "away"].map(which => {
    const index = which === "home" ? 0 : 1;
    const teamIndex = matchup[index];

    const games = group.schedule
      .map(pairings =>
        pairings.filter(p => p.away === teamIndex || p.home === teamIndex)
      )
      .flat();

    const facts = games.map(g => gameFacts(g, teamIndex));

    return {
      index: teamIndex,
      id: group.teams[teamIndex],
      wins: facts.filter(f => f.isWin).length,
      losses: facts.filter(f => f.isLoss).length
    };
  });

  return {
    home,
    away
  };
};

export const matchups = (group: PlayoffsCompetitionGroup) => {
  return map(
    (matchup: Matchup) => mapHomeAndAway(matchup, group),
    group.matchups
  );
};

const createGame = (matchup: Matchup, round: number): ScheduleGame => {
  const [first, second] = matchup;
  if (round % 2 !== 0) {
    return {
      home: first,
      away: second
    };
  }

  return {
    home: second,
    away: first
  };
};

const createRound = (matchups: Matchups, round: number): ScheduleRound => {
  return map(m => createGame(m, round), matchups);
};

const scheduler = (matchups: Matchups, winsToAdvance: number): Schedule => {
  const r = range(1, winsToAdvance * 2);
  return map(r => createRound(matchups, r), r);
};

export default scheduler;

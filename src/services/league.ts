import {
  RoundRobinCompetitionGroup,
  ScheduleGame,
  TournamentCompetitionGroup
} from "../types/base";
import {
  over,
  lensProp,
  sum,
  map,
  prop,
  sortWith,
  descend,
  ascend
} from "ramda";
import { LeagueTable, LeagueTableRow } from "../types/base";

const changedPoints = (points: number, isWin: boolean, isDraw: boolean) => {
  if (isWin) {
    return points + 2;
  }

  if (isDraw) {
    return points + 1;
  }

  return points;
};

const changedStats = (
  stats: LeagueTableRow,
  game: ScheduleGame,
  team: number
): LeagueTableRow => {
  if (!game.result) {
    throw new Error("Result is undefined");
  }

  const isHome = team === game.home;

  const myKey = isHome ? "home" : "away";
  const theirKey = isHome ? "away" : "home";

  // TODO: Replace with game facts!!!
  const isWin = game.result[myKey] > game.result[theirKey];
  const isDraw = game.result[myKey] === game.result[theirKey];
  const isLoss = game.result[myKey] < game.result[theirKey];

  return {
    ...stats,
    gamesPlayed: stats.gamesPlayed + 1,
    wins: !isWin ? stats.wins : stats.wins + 1,
    draws: !isDraw ? stats.draws : stats.draws + 1,
    losses: !isLoss ? stats.losses : stats.losses + 1,
    points: changedPoints(stats.points, isWin, isDraw),
    goalsFor: stats.goalsFor + game.result[myKey],
    goalsAgainst: stats.goalsAgainst + game.result[theirKey]
  };
};

export const groupStats = (
  group: RoundRobinCompetitionGroup | TournamentCompetitionGroup
) => {
  const stats = group.teams.map((id, index) => {
    const stats = group.schedule
      .map(round => round.filter(p => p.home === index || p.away === index))
      .flat()
      .filter(g => g.result)
      .reduce((stats, game) => changedStats(stats, game, index), {
        index,
        id,
        gamesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      } as LeagueTableRow);

    const penalties = group.penalties.filter(p => p.team === id);
    if (!penalties.length) {
      return stats;
    }

    // TODO: Make possible POSITIVE penalties!
    return over(
      lensProp("points"),
      points => {
        return points - sum(map(prop("points"), penalties));
      },
      stats
    );
  });

  return stats;
};

export const sortLeagueTable = sortWith<LeagueTableRow>([
  descend(prop("points")),
  descend(r => r.goalsFor - r.goalsAgainst),
  descend(prop("goalsFor")),
  descend(prop("wins")),
  ascend(prop("id"))
]);

const table = (
  group: RoundRobinCompetitionGroup | TournamentCompetitionGroup
): LeagueTable => {
  const unsorted = groupStats(group);
  return sortLeagueTable(unsorted);
};

export default table;

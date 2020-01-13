import { RoundRobinCompetitionGroup, ScheduleGame } from "../types/base";
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
) => {
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
    gamesPlayed: stats.gamesPlayed + 1,
    wins: !isWin ? stats.wins : stats.wins + 1,
    losses: !isLoss ? stats.losses : stats.losses + 1,
    points: changedPoints(stats.points, isWin, isDraw),
    goalsFor: stats.goalsFor + game.result[myKey],
    goalsAgainst: stats.goalsAgainst + game.result[theirKey]
  } as LeagueTableRow;
};

export const groupStats = (group: RoundRobinCompetitionGroup) => {
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
  ascend(prop("id")),
  descend(prop("wins")),
  descend(prop("goalsFor")),
  descend(r => r.goalsFor - r.goalsAgainst), // TODO: probably there is a saner way provided by Ramda...
  descend(prop("points"))
]);

const table = (group: RoundRobinCompetitionGroup): LeagueTable => {
  const unsorted = groupStats(group);
  return sortLeagueTable(unsorted);
};

export default table;

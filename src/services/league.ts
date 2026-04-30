import type { Group, Pairing, Penalty, TeamStat } from "@/types/competitions";

const changedPoints = (
  points: number,
  isWin: boolean,
  isDraw: boolean
): number => {
  if (isWin) {
    return points + 2;
  }

  if (isDraw) {
    return points + 1;
  }

  return points;
};

const changedStats = (
  stats: TeamStat,
  game: Pairing,
  team: number
): TeamStat => {
  const isHome = team === game.home;
  const result = game.result!;

  const my = isHome ? result.home : result.away;
  const their = isHome ? result.away : result.home;

  const isWin = my > their;
  const isDraw = my === their;
  const isLoss = my < their;

  return {
    ...stats,
    gamesPlayed: stats.gamesPlayed + 1,
    wins: isWin ? stats.wins + 1 : stats.wins,
    draws: isDraw ? stats.draws + 1 : stats.draws,
    losses: isLoss ? stats.losses + 1 : stats.losses,
    points: changedPoints(stats.points, isWin, isDraw),
    goalsFor: stats.goalsFor + my,
    goalsAgainst: stats.goalsAgainst + their
  };
};

export const groupStats = (group: Group): TeamStat[] => {
  const stats = group.teams.map((id, index) => {
    let stat: TeamStat = {
      index,
      id,
      gamesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
    };

    for (const round of group.schedule) {
      for (const game of round) {
        if (game.home !== index && game.away !== index) {
          continue;
        }
        if (!game.result) {
          continue;
        }
        stat = changedStats(stat, game, index);
      }
    }

    const penalties = (
      "penalties" in group ? group.penalties : []
    ) as Penalty[];
    for (const p of penalties) {
      if (p.team === id) {
        stat = { ...stat, points: stat.points + p.penalty };
      }
    }

    return stat;
  });

  return stats;
};

export const sortStats = (stats: TeamStat[]): TeamStat[] => {
  return stats.toSorted((a, b) => {
    // points desc
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // goal diff desc
    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;
    if (diffB !== diffA) {
      return diffB - diffA;
    }
    // goalsFor desc
    if (b.goalsFor !== a.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }
    // wins desc
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }
    // stable by id
    return a.id - b.id;
  });
};

const table = (group: Group): TeamStat[] => {
  const unsorted = groupStats(group);
  return sortStats(unsorted);
};

export default table;

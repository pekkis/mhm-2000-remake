const changedPoints = (points, isWin, isDraw, isLoss) => {
  if (isWin) {
    return points + 2;
  }

  if (isDraw) {
    return points + 1;
  }

  return points;
};

const changedStats = (stats, game, team) => {
  const isHome = team === game.get("home");

  const myKey = isHome ? "home" : "away";
  const theirKey = isHome ? "away" : "home";

  const isWin =
    game.getIn(["result", myKey]) > game.getIn(["result", theirKey]);

  const isDraw =
    game.getIn(["result", myKey]) === game.getIn(["result", theirKey]);

  const isLoss =
    game.getIn(["result", myKey]) < game.getIn(["result", theirKey]);

  return {
    gamesPlayed: stats.gamesPlayed + 1,
    wins: !isWin ? stats.wins : stats.wins + 1,
    draws: !isDraw ? stats.draws : stats.draws + 1,
    losses: !isLoss ? stats.losses : stats.losses + 1,
    points: changedPoints(stats.points, isWin, isDraw, isLoss),
    goalsFor: stats.goalsFor + game.getIn(["result", myKey]),
    goalsAgainst: stats.goalsAgainst + game.getIn(["result", theirKey])
  };
};

export const groupStats = group => {
  const stats = group.get("teams").map((id, index) => {
    return group
      .get("schedule")
      .map(round => round.filter(p => p.includes(index)))
      .flatten(true)
      .reduce(
        (stats, game) => {
          const result = game.get("result");
          if (!result) {
            return stats;
          }

          return {
            ...stats,
            ...changedStats(stats, game, index)
          };
        },
        {
          index,
          id,
          gamesPlayed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0
        }
      );
  });

  return stats;
};

export const sortStats = stats => {
  return stats
    .sortBy(t => t.id)
    .sortBy(t => -t.wins)
    .sortBy(t => -t.goalsFor)
    .sortBy(t => -(t.goalsFor - t.goalsAgainst))
    .sortBy(t => -t.points);
};

const table = group => {
  const unsorted = groupStats(group);
  return sortStats(unsorted);
};

export default table;

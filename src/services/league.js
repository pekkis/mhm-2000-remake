import { Map, List } from "immutable";

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

  return stats.merge({
    gamesPlayed: stats.get("gamesPlayed") + 1,
    wins: !isWin ? stats.get("wins") : stats.get("wins") + 1,
    draws: !isDraw ? stats.get("draws") : stats.get("draws") + 1,
    losses: !isLoss ? stats.get("losses") : stats.get("losses") + 1,
    points: changedPoints(stats.get("points"), isWin, isDraw, isLoss),
    goalsFor: stats.get("goalsFor") + game.getIn(["result", myKey]),
    goalsAgainst: stats.get("goalsAgainst") + game.getIn(["result", theirKey])
  });
};

export const groupStats = group => {
  const stats = group.get("teams").map((id, index) => {
    const stats = group
      .get("schedule")
      .map(round => round.filter(p => p.includes(index)))
      .flatten(true)
      .reduce(
        (stats, game) => {
          const result = game.get("result");
          if (!result) {
            return stats;
          }

          return changedStats(stats, game, index);
        },
        Map({
          index,
          id,
          gamesPlayed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0
        })
      );

    const afterPenalties = group
      .get("penalties", List())
      .filter(p => p.get("team") === id)
      .reduce((s, p) => {
        return s.update("points", points => points + p.get("penalty"));
      }, stats);

    console.log(afterPenalties);

    return afterPenalties;
  });

  return stats;
};

export const sortStats = stats => {
  return stats
    .sortBy(t => t.get("id"))
    .sortBy(t => -t.get("wins"))
    .sortBy(t => -t.get("goalsFor"))
    .sortBy(t => -(t.get("goalsFor") - t.get("goalsAgainst")))
    .sortBy(t => -t.get("points"));
};

const table = group => {
  console.log("CALCULATING TABLE FOR", group.toJS());
  const unsorted = groupStats(group);
  return sortStats(unsorted);
};

export default table;

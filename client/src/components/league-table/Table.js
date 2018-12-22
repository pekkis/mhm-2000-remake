import React from "react";

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

const Table = props => {
  const { teams, competition, phase } = props;

  const cteams = competition.get("teams").map(tid => teams.get(tid));
  const cphase = competition.getIn(["phases", phase]);

  const table = cphase
    .get("teams")
    .map((_, team) => {
      return cphase
        .get("schedule")
        .map(round => round.filter(p => p.includes(team)))
        .flatten(true)
        .reduce(
          (stats, game) => {
            const result = game.get("result");
            if (!result) {
              return stats;
            }

            return {
              ...stats,
              ...changedStats(stats, game, team)
            };
          },
          {
            id: team,
            gamesPlayed: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0
          }
        );
    })
    .sortBy(t => t.id)
    .sortBy(t => -(t.goalsFor - t.goalsAgainst))
    .sortBy(t => -t.wins)
    .sortBy(t => -t.points);

  return (
    <div>
      <table border="1">
        <thead>
          <tr>
            <th>Joukkue</th>
            <th>O</th>
            <th>V</th>
            <th>TP</th>
            <th>H</th>
            <th>TM</th>
            <th>-</th>
            <th>PM</th>
            <th>P</th>
          </tr>
        </thead>
        <tbody>
          {table.map(t => {
            return (
              <tr key={t.id}>
                <td>{cteams.getIn([t.id, "name"])}</td>
                <td>{t.gamesPlayed}</td>
                <td>{t.wins}</td>
                <td>{t.draws}</td>
                <td>{t.losses}</td>
                <td>{t.goalsFor}</td>
                <td>-</td>
                <td>{t.goalsAgainst}</td>
                <td>{t.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

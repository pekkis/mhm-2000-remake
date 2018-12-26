import React from "react";
import table from "../../services/league";

const Table = props => {
  const { players, teams, competition, phase } = props;

  const cteams = competition.get("teams").map(tid => teams.get(tid));

  const cphase = competition.getIn(["phases", phase]);
  const tbl = table(cphase).map(entry => {
    return {
      ...entry,
      playerControlled: players.map(p => p.get("team")).includes(entry.id)
    };
  });

  //

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
          {tbl.map(t => {
            return (
              <tr key={t.id}>
                <td>
                  {t.playerControlled ? (
                    <strong>{cteams.getIn([t.index, "name"])}</strong>
                  ) : (
                    cteams.getIn([t.index, "name"])
                  )}
                </td>
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

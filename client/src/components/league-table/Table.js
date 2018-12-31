import React from "react";
import table from "../../services/league";
import styled from "styled-components";

const TableRow = styled.tr`
  ${props =>
    props.dark &&
    `
    background-color: rgb(238, 238, 238)
  `}
`;

const Table = props => {
  const { players, teams, division } = props;

  // const cteams = competition.get("teams").map(tid => teams.get(tid));

  const colors = division.get("colors");

  const tbl = table(division).map(entry => {
    return {
      ...entry,
      playerControlled: players.map(p => p.get("team")).includes(entry.id)
    };
  });
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
          {tbl.map((t, i) => {
            return (
              <TableRow key={t.id} dark={colors.get(i) === "d"}>
                <td>
                  {t.playerControlled ? (
                    <strong>{teams.getIn([t.id, "name"])}</strong>
                  ) : (
                    teams.getIn([t.id, "name"])
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
              </TableRow>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

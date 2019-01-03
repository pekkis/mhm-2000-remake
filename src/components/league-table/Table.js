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

  const tbl = division.get("stats").map(entry => {
    return entry.set(
      "playerControlled",
      players.map(p => p.get("team")).includes(entry.get("id"))
    );
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
              <TableRow key={t.get("id")} dark={colors.get(i) === "d"}>
                <td>
                  {t.get("playerControlled") ? (
                    <strong>{teams.getIn([t.get("id"), "name"])}</strong>
                  ) : (
                    teams.getIn([t.get("id"), "name"])
                  )}
                </td>
                <td>{t.get("gamesPlayed")}</td>
                <td>{t.get("wins")}</td>
                <td>{t.get("draws")}</td>
                <td>{t.get("losses")}</td>
                <td>{t.get("goalsFor")}</td>
                <td>-</td>
                <td>{t.get("goalsAgainst")}</td>
                <td>{t.get("points")}</td>
              </TableRow>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

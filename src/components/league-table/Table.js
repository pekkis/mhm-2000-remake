import React from "react";
import styled from "styled-components";
import RTable from "../responsive-table/Table";
import Td from "../responsive-table/Td";

const TableRow = styled.tr`
  background-color: rgb(255, 255, 255);
  ${props =>
    props.dark &&
    `
    background-color: rgb(238, 238, 238)
  `}
`;

const Table = props => {
  const { managers, teams, division, isClone } = props;
  const colors = division.get("colors");
  const tbl = division.get("stats").map(entry => {
    return entry.set(
      "managerControlled",
      managers.map(p => p.get("team")).includes(entry.get("id"))
    );
  });

  return (
    <RTable isClone={isClone}>
      <thead>
        <tr>
          <th className="fixed">Joukkue</th>
          <th>O</th>
          <th>V</th>
          <th>TP</th>
          <th>H</th>
          <th>P</th>
          <th>TM</th>
          <th>-</th>
          <th>PM</th>
        </tr>
      </thead>
      <tbody>
        {tbl.map((t, i) => {
          return (
            <TableRow key={t.get("id")} dark={colors.get(i) === "d"}>
              <td className="fixed">
                {t.get("managerControlled") ? (
                  <strong>{teams.getIn([t.get("id"), "name"])}</strong>
                ) : (
                  teams.getIn([t.get("id"), "name"])
                )}
              </td>
              <td>{t.get("gamesPlayed")}</td>
              <td>{t.get("wins")}</td>
              <td>{t.get("draws")}</td>
              <td>{t.get("losses")}</td>
              <td>{t.get("points")}</td>
              <td>{t.get("goalsFor")}</td>
              <td>-</td>
              <td>{t.get("goalsAgainst")}</td>
            </TableRow>
          );
        })}
      </tbody>
    </RTable>
  );
};

export default Table;

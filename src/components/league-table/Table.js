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

const TableScroller = styled.div`
  position: relative;
  max-width: 600px;
  overflow: hidden;
  border: 1px solid #000;

  table {
    width: 100%;
    margin: auto;
    border-collapse: separate;
    border-spacing: 0;
  }
  th,
  td {
    padding: 5px 10px;
    border: 1px solid #000;
    background: #fff;
    white-space: nowrap;
    vertical-align: top;
  }
  thead,
  tfoot {
    background: #f9f9f9;
  }

  .name {
    width: 150px;
  }

  .clone {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
  .clone th,
  .clone td {
    visibility: hidden;
  }
  .clone td,
  .clone th {
    border-color: transparent;
  }
  .clone tbody th {
    visibility: visible;
    color: red;
  }
  .clone .fixed-side {
    border: 1px solid #000;
    background: #eee;
    visibility: visible;
  }
  .clone thead,
  .clone tfoot {
    background: transparent;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow: auto;
`;

const TableElm = props => {
  const { teams, colors, tbl, isClone } = props;

  const className = !isClone ? "main-table" : "main-table clone";

  return (
    <table border="0" className={className}>
      <thead>
        <tr>
          <th className="name fixed-side">Joukkue</th>
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
              <td className="name fixed-side">
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
              <td>{t.get("goalsFor")}</td>
              <td>-</td>
              <td>{t.get("goalsAgainst")}</td>
              <td>{t.get("points")}</td>
            </TableRow>
          );
        })}
      </tbody>
    </table>
  );
};

const Table = props => {
  const { managers, teams, division } = props;

  // const cteams = competition.get("teams").map(tid => teams.get(tid));

  const colors = division.get("colors");

  const tbl = division.get("stats").map(entry => {
    return entry.set(
      "managerControlled",
      managers.map(p => p.get("team")).includes(entry.get("id"))
    );
  });
  return (
    <TableScroller>
      <TableWrapper>
        <TableElm teams={teams} colors={colors} tbl={tbl} isClone={false} />
      </TableWrapper>
      <TableElm teams={teams} colors={colors} tbl={tbl} isClone={true} />
    </TableScroller>
  );
};

export default Table;

import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";
import RTable from "../responsive-table/Table";
import {
  RoundRobinCompetitionGroup,
  TournamentCompetitionGroup,
  MapOf
} from "../../types/base";
import { Team } from "../../types/team";
import { HumanManager } from "../../types/manager";
import TeamName from "../team/TeamName";

const TableRow = styled.tr`
  background-color: rgb(255, 255, 255);
  ${props =>
    props.dark &&
    `
    background-color: rgb(238, 238, 238)
  `}
`;

interface Props {
  division: RoundRobinCompetitionGroup | TournamentCompetitionGroup;
  teams: MapOf<Team>;
  managers: HumanManager[];
  isClone?: boolean;
}

const Table: FunctionComponent<Props> = ({
  managers,
  teams,
  division,
  isClone = false
}) => {
  const colors = division.colors;

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
        {division.stats.map((t, i) => {
          return (
            <TableRow key={t.id} dark={colors[i] === "d"}>
              <td className="fixed">
                <TeamName team={teams[t.id]} managers={managers} />
              </td>
              <td>{t.gamesPlayed}</td>
              <td>{t.wins}</td>
              <td>{t.draws}</td>
              <td>{t.losses}</td>
              <td>{t.points}</td>
              <td>{t.goalsFor}</td>
              <td>-</td>
              <td>{t.goalsAgainst}</td>
            </TableRow>
          );
        })}
      </tbody>
    </RTable>
  );
};

export default Table;

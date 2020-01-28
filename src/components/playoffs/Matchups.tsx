import React, { FunctionComponent } from "react";
import { HumanManager } from "../../types/manager";
import {
  MapOf,
  CompetitionGroup,
  PlayoffsCompetitionGroup
} from "../../types/base";
import { Team } from "../../types/team";
import TeamName from "../team/TeamName";

interface Props {
  group: PlayoffsCompetitionGroup;
  teams: MapOf<Team>;
  managers: HumanManager[];
  round: number;
}

const Matchups: FunctionComponent<Props> = props => {
  const { managers, teams, group } = props;

  const matches = group.stats;

  return (
    <table>
      <tbody>
        {matches.map((m, i) => {
          return (
            <tr key={i}>
              <td>
                <TeamName managers={managers} team={teams[m.home.id]} />
              </td>
              <td>-</td>
              <td>
                {" "}
                <TeamName managers={managers} team={teams[m.away.id]} />
              </td>
              <td>
                {m.home.wins}-{m.away.wins}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Matchups;

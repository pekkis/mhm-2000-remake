import React, { useState } from "react";
import Header from "./Header";
import HeaderedPage from "./ui/HeaderedPage";
import ManagerInfo from "./ManagerInfo";
import { Box } from "theme-ui";
import { Player } from "../types/player";
import {
  sortWith,
  ascend,
  prop,
  values,
  take,
  descend,
  range,
  indexBy
} from "ramda";
import { useSelector, useDispatch } from "react-redux";
import { MHMState } from "../ducks";
import PlayerList from "./transfer-market/PlayerList";
import { Route, Switch } from "react-router";
import PlayerInfo from "./transfer-market/PlayerInfo";
import {
  activeManager,
  requireManagersTeam,
  requireHumanManagersTeamObj,
  teamsContractedPlayers
} from "../services/selectors";
import Flag from "react-world-flags";
import { MANAGER_LINEUP_AUTOMATE } from "../ducks/manager";
import Lineup from "./lineup/Lineup";
import { isHumanControlledTeam } from "../services/team";
import { getKnownSkill } from "../services/player";

const positionSorts = {
  g: 1000,
  d: 2000,
  lw: 3000,
  c: 4000,
  rw: 5000
};

const LineupMenu = () => {
  const dispatch = useDispatch();

  const manager = useSelector(activeManager);
  const team = useSelector(requireHumanManagersTeamObj(manager.id));
  const players = useSelector(teamsContractedPlayers(team.id));

  const skillGetter = getKnownSkill(manager);

  const sorter = sortWith<Player>([
    ascend(p => positionSorts[p.position]),
    descend(prop("skill")),
    ascend(prop("lastName")),
    ascend(prop("firstName"))
  ]);

  const sortedPlayers = sorter(players);

  const playerMap = indexBy(prop("id"), sortedPlayers);

  return (
    <HeaderedPage>
      <Header back />

      <ManagerInfo details />

      <Box p={1}>
        <h2>Ketjukoostumus</h2>

        <button
          onClick={() => {
            dispatch({
              type: MANAGER_LINEUP_AUTOMATE,
              payload: { manager: manager.id }
            });
          }}
        >
          Automagisoi
        </button>

        <Lineup
          players={playerMap}
          lineup={team.lineup}
          skillGetter={skillGetter}
        />

        <table>
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Ikä</th>
              <th>Maa</th>
              <th>PP</th>
              <th>T</th>
              <th>kunto</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map(player => {
              return (
                <tr key={player.id}>
                  <td>
                    {player.lastName}, {player.firstName}.
                  </td>
                  <td>{player.age}</td>
                  <td>
                    <Flag code={player.country} height={16} /> {player.country}
                  </td>
                  <td>{player.position}</td>
                  <td>{player.skill}</td>
                  <td>{player.condition}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </HeaderedPage>
  );
};

export default LineupMenu;

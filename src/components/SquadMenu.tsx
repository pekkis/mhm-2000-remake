import React, { useState } from "react";
import Header from "./Header";
import HeaderedPage from "./ui/HeaderedPage";
import ManagerInfo from "./ManagerInfo";
import { Box } from "theme-ui";
import { Player } from "../types/player";
import { sortWith, ascend, prop, values, take, descend, range } from "ramda";
import { useSelector } from "react-redux";
import { MHMState } from "../ducks";
import PlayerList from "./transfer-market/PlayerList";
import { Route, Switch } from "react-router";
import PlayerInfo from "./transfer-market/PlayerInfo";
import {
  activeManager,
  requireManagersTeam,
  requireManagersTeamObj
} from "../services/selectors";
import Flag from "./ui/Flag";
import { getKnownSkill } from "../services/player";

const positionSorts = {
  g: 1000,
  d: 2000,
  lw: 3000,
  c: 4000,
  rw: 5000
};

const SquadMenu = () => {
  const manager = useSelector(activeManager);
  const team = useSelector(requireManagersTeamObj(manager.id));

  const playerMap = useSelector((state: MHMState) => state.player.players);
  const players = values(playerMap).filter(p => p.contract?.team === team.id);

  const sorter = sortWith<Player>([
    ascend(p => positionSorts[p.position]),
    descend(prop("skill")),
    ascend(prop("lastName")),
    ascend(prop("firstName"))
  ]);

  const sortedPlayers = sorter(players);

  const skillGetter = getKnownSkill(manager);

  return (
    <HeaderedPage>
      <Header back menu />

      <ManagerInfo details />

      <Box p={1}>
        <h2>Pelaajarinki</h2>

        <table>
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Ikä</th>
              <th>Maa</th>
              <th>PP</th>
              <th>T</th>
              <th>kunto</th>
              <th>perks</th>
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
                  <td>
                    {player.skill} <em>({skillGetter(player)})</em>
                  </td>
                  <td>{player.condition}</td>
                  <td>{JSON.stringify(player.perks)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </HeaderedPage>
  );
};

export default SquadMenu;

import { ascend, descend, indexBy, prop, sortWith } from "ramda";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Flag from "react-world-flags";
import { Box } from "theme-ui";
import { MANAGER_LINEUP_AUTOMATE } from "../ducks/manager";
import { getKnownSkill } from "../services/player";
import {
  activeManager,
  requireHumanManagersTeamObj,
  teamsContractedPlayers
} from "../services/selectors";
import { Player } from "../types/player";
import Header from "./Header";
import Lineup from "./lineup/Lineup";
import ManagerInfo from "./ManagerInfo";
import HeaderedPage from "./ui/HeaderedPage";

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

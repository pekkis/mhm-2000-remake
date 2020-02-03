import React, { useState } from "react";
import Header from "./Header";
import HeaderedPage from "./ui/HeaderedPage";
import ManagerInfo from "./ManagerInfo";
import Box from "./styled-system/Box";
import { Player } from "../types/player";
import { sortWith, ascend, prop, values, take, descend } from "ramda";
import { useSelector } from "react-redux";
import { MHMState } from "../ducks";
import Flag from "react-world-flags";

const TransferMarket = () => {
  const playerMap = useSelector((state: MHMState) => state.player.players);

  const playerList = values(playerMap);

  const filters = [
    (p: Player) => p.skill <= 12,
    (p: Player) => p.skill >= 8,
    (p: Player) => ["FI"].includes(p.country)
  ];

  const sorter = sortWith<Player>([
    descend(prop("skill")),
    ascend(prop("lastName")),
    ascend(prop("firstName"))
  ]);

  const filteredPlayers = filters.reduce(
    (players, filter) => players.filter(filter),
    playerList
  );

  const sortedPlayers = sorter(filteredPlayers);

  const page = take(100, sortedPlayers);

  return (
    <HeaderedPage>
      <Header back />

      <ManagerInfo details />

      <Box p={1}>
        <h2>Pelaajamarkkinat</h2>

        <table>
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Kansallisuus</th>
              <th>PP</th>
              <th>T</th>
            </tr>
          </thead>
          <tbody>
            {page.map(player => {
              return (
                <tr key={player.id}>
                  <td>
                    {player.lastName}, {player.firstName}.
                  </td>
                  <td>
                    <Flag code={player.country} height={16} /> {player.country}
                  </td>
                  <td>{player.position}</td>
                  <td>{player.skill}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </HeaderedPage>
  );
};

export default TransferMarket;

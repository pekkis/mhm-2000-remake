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

const playersPerPage = 100;

const TransferMarket = () => {
  const [page, setPage] = useState(0);

  const playerMap = useSelector((state: MHMState) => state.player.players);
  const playerList = values(playerMap).filter(p => !p.contract);

  const totalPages = Math.ceil(playerList.length / playersPerPage);

  console.log("TOTAL PAGES", totalPages);

  /*
  const filters = [
    (p: Player) => p.skill <= 12,
    (p: Player) => p.skill >= 8,
    (p: Player) => ["FI"].includes(p.country)
  ];
  */

  const filters = [];

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

  const pagedPlayers = sortedPlayers.slice(
    page * playersPerPage,
    page * playersPerPage + playersPerPage
  );

  return (
    <HeaderedPage>
      <Header back />

      <ManagerInfo details />

      <Box p={1}>
        <Switch>
          <Route
            exact
            path="/pelaajamarkkinat"
            render={() => {
              return (
                <PlayerList
                  totalPages={totalPages}
                  players={pagedPlayers}
                  setPage={setPage}
                />
              );
            }}
          />
          <Route
            exact
            path="/pelaajamarkkinat/:playerId"
            render={props => {
              const player = playerMap[props.match.params.playerId];
              return <PlayerInfo player={player} />;
            }}
          />
        </Switch>
      </Box>
    </HeaderedPage>
  );
};

export default TransferMarket;

import React from "react";
import { Switch, Route } from "react-router";
import styled from "styled-components";

import MainMenu from "./containers/MainMenuContainer";
import TransferMarket from "./containers/TransferMarketContainer";
import LeagueTables from "./containers/LeagueTablesContainer";
import DeveloperMenu from "./containers/DeveloperMenuContainer";
import SelectStrategy from "./containers/SelectStrategyContainer";
import Events from "./containers/EventsContainer";
import Gameday from "./containers/GamedayContainer";
import GamedayResults from "./containers/GamedayResultsContainer";
import CrisisActions from "./containers/CrisisActionsContainer";
import Arena from "./containers/ArenaContainer";
import Notifications from "./notifications/containers/NotificationsContainer";

const Phase = props => {
  const { turn } = props;

  switch (true) {
    case turn.get("phase") === "select-strategy":
      return <SelectStrategy />;

    case turn.get("phase") === "event":
      return <Events />;

    case turn.get("phase") === "gameday":
      return <Gameday />;

    case turn.get("phase") === "results":
      return <GamedayResults />;

    case turn.get("phase") === "action":
    case turn.get("phase") === "seed":
      return (
        <Switch>
          <Route exact path="/" component={MainMenu} />
          <Route exact path="/sarjataulukot" component={LeagueTables} />
          <Route exact path="/pelaajamarkkinat" component={TransferMarket} />
          <Route exact path="/kriisipalaveri" component={CrisisActions} />
          <Route exact path="/areena" component={Arena} />
          <Route exact path="/debug" component={DeveloperMenu} />
        </Switch>
      );

    default:
      console.log("turn", turn.toJS());
      return "laddare...";
  }
};

const Game = props => {
  const { className } = props;
  return (
    <div className={className}>
      <Phase {...props} />
      <Notifications />
    </div>
  );
};

export default styled(Game)``;

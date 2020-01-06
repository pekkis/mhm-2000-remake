import React from "react";
import { Switch, Route } from "react-router";
import styled from "styled-components";

import MainMenu from "./containers/MainMenuContainer";
import TransferMarket from "./containers/TransferMarketContainer";
import LeagueTables from "./containers/LeagueTablesContainer";
import DeveloperMenu from "./containers/DeveloperMenuContainer";
import SelectStrategy from "./containers/SelectStrategyContainer";
import Events from "./containers/EventsContainer";
import News from "./containers/NewsContainer";
import Gameday from "./containers/GamedayContainer";
import GamedayResults from "./containers/GamedayResultsContainer";
import CrisisActions from "./containers/CrisisActionsContainer";
import Arena from "./containers/ArenaContainer";
import Services from "./containers/ServicesContainer";
import Pranks from "./containers/PranksContainer";
import Notifications from "./notifications/containers/NotificationsContainer";
import ModalMenu from "./containers/ModalMenuContainer";
import ChampionshipBetting from "./containers/ChampionshipBettingContainer";
import Betting from "./containers/BettingContainer";
import EndOfSeason from "./containers/EndOfSeasonContainer";
import WorldChampionships from "./containers/WorldChampionshipsContainer";
import Stats from "./containers/StatsContainer";
import Invitations from "./containers/InvitationsContainer";
import Gala from "./containers/GalaContainer";

import calendar from "../data/calendar";

const Phase = props => {
  const { turn } = props;

  const calendarEntry = calendar.get(turn.get("round"));

  switch (true) {
    case turn.get("phase") === "select-strategy":
      return <SelectStrategy />;

    case turn.get("phase") === "championship-betting":
      return <ChampionshipBetting />;

    case turn.get("phase") === "event":
      return <Events />;

    case turn.get("phase") === "gala":
      return <Gala />;

    case turn.get("phase") === "news":
      return <News />;

    case turn.get("phase") === "gameday":
      return <Gameday />;

    case turn.get("phase") === "world-championships":
      return <WorldChampionships />;

    case turn.get("phase") === "end-of-season":
      return <EndOfSeason />;

    case turn.get("phase") === "results":
      return <GamedayResults />;

    case turn.get("phase") === "action":
      return (
        <Switch>
          <Route exact path="/" component={MainMenu} />
          <Route exact path="/sarjataulukot" component={LeagueTables} />
          <Route exact path="/pelaajamarkkinat" component={TransferMarket} />
          <Route exact path="/kriisipalaveri" component={CrisisActions} />
          <Route exact path="/erikoistoimenpiteet" component={Services} />
          <Route exact path="/areena" component={Arena} />
          <Route exact path="/jaynat" component={Pranks} />
          <Route exact path="/tilastot" component={Stats} />
          <Route exact path="/kutsut" component={Invitations} />
          <Route exact path="/veikkaus" component={Betting} />
          <Route exact path="/debug" component={DeveloperMenu} />
        </Switch>
      );

    default:
      console.log("turn", turn.toJS());
      return "laddare...";
  }
};

const Game = props => {
  const { className, menu } = props;
  return (
    <div className={className}>
      {menu && <ModalMenu />}
      <Phase {...props} />
      <Notifications />
    </div>
  );
};

export default styled(Game)``;

import React, { FunctionComponent } from "react";
import { Switch, Route } from "react-router";
import MainMenu from "./MainMenu";
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
import ModalMenu from "./ModalMenu";
import ChampionshipBetting from "./containers/ChampionshipBettingContainer";
import Betting from "./containers/BettingContainer";
import EndOfSeason from "./containers/EndOfSeasonContainer";
import WorldChampionships from "./containers/WorldChampionshipsContainer";
import Stats from "./containers/StatsContainer";
import Invitations from "./containers/InvitationsContainer";
import Gala from "./containers/GalaContainer";
import { useSelector } from "react-redux";
import { MHMState } from "../ducks";
import { Turn } from "../types/base";

interface Props {
  turn: Turn;
}

const Phase: FunctionComponent<Props> = props => {
  const { turn } = props;

  switch (true) {
    case turn.phase === "selectStrategy":
      return <SelectStrategy />;

    case turn.phase === "championshipBetting":
      return <ChampionshipBetting />;

    case turn.phase === "event":
      return <Events />;

    case turn.phase === "gala":
      return <Gala />;

    case turn.phase === "news":
      return <News />;

    case turn.phase === "gameday":
      return <Gameday />;

    case turn.phase === "worldChampionships":
      return <WorldChampionships />;

    case turn.phase === "endOfSeason":
      return <EndOfSeason />;

    case turn.phase === "results":
      return <GamedayResults />;

    case turn.phase === "action":
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
      console.log("turn", turn);
      return <span>laddare...</span>;
  }
};

const Game: FunctionComponent = () => {
  const menu = useSelector<MHMState, boolean>(state => state.ui.menu);
  const turn = useSelector<MHMState, Turn>(state => state.game.turn);

  return (
    <div>
      {menu && <ModalMenu />}
      <Phase turn={turn} />
      <Notifications />
    </div>
  );
};

export default Game;

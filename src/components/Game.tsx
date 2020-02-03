import React, { FunctionComponent } from "react";
import { Switch, Route } from "react-router";
import MainMenu from "./MainMenu";
import TransferMarket from "./TransferMarket";
import LeagueTables from "./LeagueTables";
import DeveloperMenu from "./DeveloperMenu";
import StrategyMenu from "./StrategyMenu";
import Events from "./Events";
import News from "./News";
import Gameday from "./Gameday";
import GamedayResults from "./GamedayResults";
import CrisisActions from "./CrisisActions";
import Arena from "./Arena";
import Services from "./Services";
import Pranks from "./Pranks";
import Notifications from "./notifications/Notifications";
import ModalMenu from "./ModalMenu";
import ChampionshipBetting from "./ChampionshipBetting";
import Betting from "./Betting";
import EndOfSeason from "./EndOfSeason";
import LoadingScreen from "./LoadingScreen";
import WorldChampionships from "./WorldChampionships";
import Stats from "./Stats";
import Invitations from "./Invitations";
import Gala from "./Gala";
import { useSelector } from "react-redux";
import { MHMState } from "../ducks";
import { Turn } from "../types/base";
import BudgetOrganizationMenu from "./BudgetOrganizationMenu";
import SponsorsMenu from "./SponsorsMenu";

interface Props {
  turn: Turn;
}

const Phase: FunctionComponent<Props> = props => {
  const { turn } = props;

  switch (true) {
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
          <Route exact path="/strategia" component={StrategyMenu} />
          <Route exact path="/sarjataulukot" component={LeagueTables} />
          <Route
            exact
            path="/budjetti/organisaatio"
            component={BudgetOrganizationMenu}
          />
          <Route exact path="/sponsorit" component={SponsorsMenu} />

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

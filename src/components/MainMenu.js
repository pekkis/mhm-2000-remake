import React from "react";
import TurnIndicator from "./game/TurnIndicator";

import Events from "./events/Events";
import News from "./news/News";
import { Link } from "react-router-dom";
import ButtonRow from "./form/ButtonRow";
import Button from "./form/Button";
import Situation from "./context-sensitive/Situation";
import PlayerInfo from "./player/PlayerInfo";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";

const MainMenu = props => {
  const {
    turn,
    advance,
    player,
    players,
    teams,
    competitions,
    resolveEvent,
    events,
    saveGame,
    quitToMainMenu,
    news
  } = props;

  return (
    <HeaderedPage>
      <Header />

      <PlayerInfo player={player} teams={teams} />

      <ButtonRow>
        <Button
          disabled={turn.get("phase") !== "action"}
          type="button"
          onClick={() => saveGame()}
        >
          Tallenna
        </Button>

        <Button type="button" onClick={() => quitToMainMenu()}>
          Lopeta!
        </Button>
      </ButtonRow>

      <TurnIndicator turn={turn} />

      <hr />

      <nav>
        <ul>
          <li>
            <Link to="/pelaajamarkkinat">Pelaajamarkkinat</Link>
          </li>
          <li>
            <Link to="/sarjataulukot">Sarjataulukot</Link>
          </li>
          <li>
            <Link to="/debug">Devausmenukka</Link>
          </li>
        </ul>
      </nav>

      <hr />

      <Situation player={player} competitions={competitions} teams={teams} />
      <hr />

      <News player={player} news={news} />

      <hr />

      <Events player={player} events={events} resolveEvent={resolveEvent} />
    </HeaderedPage>
  );
};

export default MainMenu;

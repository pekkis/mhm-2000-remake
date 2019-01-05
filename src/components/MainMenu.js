import React from "react";
import TurnIndicator from "./game/TurnIndicator";

import Events from "./events/Events";
import News from "./news/News";
import { Link } from "react-router-dom";
import ButtonRow from "./form/ButtonRow";
import Button from "./form/Button";
import Situation from "./context-sensitive/Situation";
import ManagerInfo from "./manager/ManagerInfo";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import MaxRound from "./ui/containers/MaxRoundContainer";
import {
  CRISIS_MORALE_MAX,
  CRISIS_DEADLINE,
  TRANSFER_DEADLINE
} from "../data/constants";

const MainMenu = props => {
  const {
    turn,
    manager,
    teams,
    competitions,
    resolveEvent,
    events,
    saveGame,
    quitToMainMenu,
    news
  } = props;

  const team = teams.get(manager.get("team"));

  return (
    <HeaderedPage>
      <Header>
        <h2>Päävalikko</h2>
      </Header>

      <ManagerInfo manager={manager} teams={teams} />

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
          {team.get("morale") <= CRISIS_MORALE_MAX && (
            <MaxRound max={CRISIS_DEADLINE}>
              <li>
                <Link to="/kriisipalaveri">Kriisipalaveri</Link>
              </li>
            </MaxRound>
          )}
          <MaxRound max={TRANSFER_DEADLINE}>
            <li>
              <Link to="/pelaajamarkkinat">Pelaajamarkkinat</Link>
            </li>
          </MaxRound>
          <li>
            <Link to="/sarjataulukot">Sarjataulukot</Link>
          </li>

          <li>
            <Link to="/areena">Areena</Link>
          </li>

          <li>
            <Link to="/erikoistoimenpiteet">Erikoistoimenpiteet</Link>
          </li>

          <li>
            <Link to="/jaynat">Jäynät</Link>
          </li>

          <li>
            <Link to="/debug">Devausmenukka</Link>
          </li>
        </ul>
      </nav>

      <hr />

      <Situation manager={manager} competitions={competitions} teams={teams} />
      <hr />

      <News manager={manager} news={news} />

      <hr />

      <Events manager={manager} events={events} resolveEvent={resolveEvent} />
    </HeaderedPage>
  );
};

export default MainMenu;

import React from "react";
import TurnIndicator from "./game/TurnIndicator";

import Events from "./events/Events";
import { Link } from "react-router-dom";
import Button from "./form/Button";
import Situation from "./context-sensitive/Situation";

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
    quitToMainMenu
  } = props;

  return (
    <div>
      <div>
        <Button type="button" onClick={() => advance()}>
          eteenpäin!
        </Button>

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
      </div>

      <h2>
        {player.get("name")} ({player.get("balance")} pks)
      </h2>

      <TurnIndicator turn={turn} />

      <hr />

      <nav>
        <ul>
          <li>
            <Link to="/pelaajamarkkinat">Pelaajamarkkinat</Link>
          </li>
        </ul>
      </nav>

      <hr />

      <Events player={player} events={events} resolveEvent={resolveEvent} />

      <hr />

      <Situation player={player} competitions={competitions} teams={teams} />
    </div>
  );
};

export default MainMenu;

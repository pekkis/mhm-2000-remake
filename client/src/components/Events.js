import React from "react";
import TurnIndicator from "./game/TurnIndicator";

import EventsList from "./events/Events";
import News from "./news/News";
import { Link } from "react-router-dom";
import ButtonRow from "./form/ButtonRow";
import Button from "./form/Button";
import Situation from "./context-sensitive/Situation";
import PlayerInfo from "./player/PlayerInfo";

const Events = props => {
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
    news,
    advanceEnabled
  } = props;

  return (
    <div>
      <PlayerInfo player={player} teams={teams} />
      <ButtonRow>
        <Button
          disabled={!advanceEnabled}
          type="button"
          onClick={() => advance()}
        >
          eteenpäin!
        </Button>
      </ButtonRow>

      <EventsList player={player} events={events} resolveEvent={resolveEvent} />
    </div>
  );
};

export default Events;

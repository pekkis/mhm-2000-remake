import React from "react";
import TurnIndicator from "./game/TurnIndicator";

import Events from "./events/Events";
import News from "./news/News";
import { Link } from "react-router-dom";
import Button from "./form/Button";
import Situation from "./context-sensitive/Situation";
import Table from "./league-table/Table";

const LeagueTables = props => {
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
    <div>
      {competitions
        .map(c => {
          return (
            <div key={c.get("id")}>
              <h2>{c.get("name")}</h2>
              <Table
                competition={c}
                players={players}
                teams={teams}
                phase={0}
              />
            </div>
          );
        })
        .toList()}
    </div>
  );
};

export default LeagueTables;

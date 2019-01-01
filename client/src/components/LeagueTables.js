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
      <h2>Sarjataulukot</h2>

      {competitions
        .map(c => {
          const phase = c.getIn(["phases", 0]);
          const groups = phase.get("groups");

          return (
            <div key={c.get("id")}>
              <h3>{c.get("name")}</h3>
              {groups.map((group, i) => {
                return (
                  <div key={i}>
                    <h4>{group.get("name")}</h4>
                    <Table division={group} players={players} teams={teams} />
                  </div>
                );
              })}
            </div>
          );
        })
        .toList()}
    </div>
  );
};

export default LeagueTables;

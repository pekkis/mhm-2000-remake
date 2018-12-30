import React from "react";
import TurnIndicator from "./game/TurnIndicator";

import Events from "./events/Events";
import News from "./news/News";
import { Link } from "react-router-dom";
import Button from "./form/Button";
import Situation from "./context-sensitive/Situation";

const DeveloperMenu = props => {
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
            <div>
              <h2>{c.get("name")}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Joukkue</th>
                    <th>Voima</th>
                  </tr>
                </thead>

                <tbody>
                  {c.get("teams").map(t => {
                    return (
                      <tr>
                        <td>{teams.get(t).get("name")}</td>
                        <td>{teams.get(t).get("strength")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })
        .toList()}
    </div>
  );
};

export default DeveloperMenu;

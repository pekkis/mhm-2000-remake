import React from "react";
import TurnIndicator from "./game/TurnIndicator";
import Table from "./league-table/Table";
import Events from "./events/Events";
import { Link } from "react-router-dom";
import Button from "./form/Button";

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
    saveGame
  } = props;

  return (
    <div>
      <div>
        <Button type="button" onClick={() => advance()}>
          eteenpäin!
        </Button>

        <Button type="button" onClick={() => saveGame()}>
          Tallenna
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

      {["phl", "division"].map(competition => {
        return (
          <div key={competition}>
            <h3>{competition}</h3>
            <Table
              players={players}
              competition={competitions.get(competition)}
              teams={teams}
              phase={0}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MainMenu;

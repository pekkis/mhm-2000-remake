import React from "react";
import TurnIndicator from "./game/TurnIndicator";
import Table from "./league-table/Table";

const App = props => {
  const { turn, advance, player, teams, competitions } = props;

  return (
    <div>
      <h1>MHM 97 Browser Edition</h1>

      <div>
        <button type="button" onClick={() => advance()}>
          eteenpäin!
        </button>
      </div>

      <h2>{player.get("name")}</h2>

      <TurnIndicator turn={turn} />

      <hr />

      {["phl", "division"].map(competition => {
        return (
          <div key={competition}>
            <h3>{competition}</h3>
            <Table
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

export default App;

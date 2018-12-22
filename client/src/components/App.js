import React from "react";
import TurnIndicator from "./game/TurnIndicator";

const App = props => {
  const { turn, advance, player } = props;

  return (
    <div>
      <h1>MHM 2000 Remake</h1>

      <h2>{player.get("name")}</h2>

      <TurnIndicator turn={turn} />

      <div>
        <button type="button" onClick={() => advance()}>
          eteenpäin!
        </button>
      </div>
    </div>
  );
};

export default App;

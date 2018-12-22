import React from "react";

const TurnIndicator = props => {
  const { turn } = props;
  return (
    <div>
      {turn.get("season")}, {turn.get("round")} / {turn.get("phase")}
    </div>
  );
};

export default TurnIndicator;

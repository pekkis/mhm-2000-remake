import React from "react";

const TurnIndicator = props => {
  const { turn } = props;
  return (
    <span>
      {turn.get("season")}, {turn.get("round")} / {turn.get("phase")}
    </span>
  );
};

export default TurnIndicator;

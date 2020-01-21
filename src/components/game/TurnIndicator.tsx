import React, { FunctionComponent } from "react";
import { Turn } from "../../types/base";

interface Props {
  turn: Turn;
}

const TurnIndicator: FunctionComponent<Props> = ({ turn }) => {
  return (
    <span>
      {turn.season}, {turn.round} / {turn.phase}
    </span>
  );
};

export default TurnIndicator;

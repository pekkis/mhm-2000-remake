import type { GameTurn } from "@/state/game";
import type { FC } from "react";

type TurnIndicatorProps = {
  turn: GameTurn;
};

const TurnIndicator: FC<TurnIndicatorProps> = ({ turn }) => {
  return (
    <span>
      {turn.season}, {turn.round}
    </span>
  );
};

export default TurnIndicator;

import type { FC } from "react";

type TurnIndicatorProps = {
  turn: { season: number; round: number; phase: string | undefined };
};

const TurnIndicator: FC<TurnIndicatorProps> = ({ turn }) => {
  return (
    <span>
      {turn.season}, {turn.round} / {turn.phase}
    </span>
  );
};

export default TurnIndicator;

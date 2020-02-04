import React, { FunctionComponent } from "react";
import { Player } from "../../types/player";

interface Props {
  player: Player;
}

const PlayerName: FunctionComponent<Props> = ({ player }) => {
  return (
    <span>
      {player.lastName}, {player.firstName}.
    </span>
  );
};

export default PlayerName;

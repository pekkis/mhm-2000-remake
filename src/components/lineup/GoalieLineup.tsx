import React, { FunctionComponent } from "react";
import { Player } from "../../types/player";
import { MapOf } from "../../types/base";
import PlayerSelect from "./PlayerSelect";

interface Props {
  players: MapOf<Player>;
  goalie?: string;
}

const GoalieLineup: FunctionComponent<Props> = ({ players, goalie }) => {
  if (!goalie) {
    return null;
  }

  return (
    <div>
      <PlayerSelect selected={goalie} players={players} position="g" />
    </div>
  );
};

export default GoalieLineup;

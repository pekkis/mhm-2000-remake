import React, { FunctionComponent } from "react";
import { Player } from "../../types/player";
import { MapOf } from "../../types/base";
import PlayerSelect from "./PlayerSelect";
import { Lineup } from "../../types/team";
import { path } from "ramda";

interface Props {
  current?: string;
  sortToPosition: string;
  players: MapOf<Player>;
  pathToPosition: (string | number)[];
  lineup: Lineup;
  assignToLineup: (
    pathToPosition: (string | number)[],
    playerId: string
  ) => void;
}

const PlayerLineup: FunctionComponent<Props> = ({
  assignToLineup,
  players,
  pathToPosition,
  lineup,
  sortToPosition
}) => {
  const player = path<string | undefined>(pathToPosition, lineup);

  return (
    <div>
      <PlayerSelect
        assignToLineup={assignToLineup}
        sortToPosition={sortToPosition}
        current={player}
        players={players}
        pathToPosition={pathToPosition}
        lineup={lineup}
      />
    </div>
  );
};

export default PlayerLineup;

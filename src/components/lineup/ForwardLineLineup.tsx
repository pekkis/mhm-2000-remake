import React, { FunctionComponent } from "react";
import { Player } from "../../types/player";
import { MapOf } from "../../types/base";
import { Lineup } from "../../types/team";
import PlayerLineup from "./PlayerLineup";

interface Props {
  lineNumber: number;
  players: MapOf<Player>;
  lineup: Lineup;
  assignToLineup: (
    pathToPosition: (string | number)[],
    playerId: string
  ) => void;
}

const ForwardLineLineup: FunctionComponent<Props> = ({
  players,
  lineNumber,
  lineup,
  assignToLineup
}) => {
  return (
    <div>
      <PlayerLineup
        players={players}
        lineup={lineup}
        sortToPosition="lw"
        pathToPosition={["a", lineNumber, "lw"]}
        assignToLineup={assignToLineup}
      />
      <PlayerLineup
        players={players}
        lineup={lineup}
        sortToPosition="c"
        pathToPosition={["a", lineNumber, "c"]}
        assignToLineup={assignToLineup}
      />
      <PlayerLineup
        players={players}
        lineup={lineup}
        sortToPosition="rw"
        pathToPosition={["a", lineNumber, "rw"]}
        assignToLineup={assignToLineup}
      />
    </div>
  );
};

export default ForwardLineLineup;

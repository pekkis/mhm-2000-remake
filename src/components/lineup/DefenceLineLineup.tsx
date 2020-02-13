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

const DefenceLineLineup: FunctionComponent<Props> = ({
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
        sortToPosition="ld"
        pathToPosition={["d", lineNumber, "ld"]}
        assignToLineup={assignToLineup}
      />
      <PlayerLineup
        players={players}
        lineup={lineup}
        sortToPosition="rd"
        pathToPosition={["d", lineNumber, "rd"]}
        assignToLineup={assignToLineup}
      />
    </div>
  );
};

export default DefenceLineLineup;

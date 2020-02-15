import React, { FunctionComponent } from "react";
import { Player } from "../../types/player";
import { MapOf } from "../../types/base";
import { Lineup } from "../../types/team";
import PlayerLineup from "./PlayerLineup";
import { SkillGetter } from "../../services/player";

interface Props {
  lineNumber: number;
  players: MapOf<Player>;
  lineup: Lineup;
  assignToLineup: (
    pathToPosition: (string | number)[],
    playerId: string
  ) => void;
  skillGetter: SkillGetter;
}

const DefenceLineLineup: FunctionComponent<Props> = ({
  players,
  lineNumber,
  lineup,
  assignToLineup,
  skillGetter
}) => {
  return (
    <div>
      <PlayerLineup
        skillGetter={skillGetter}
        players={players}
        lineup={lineup}
        sortToPosition="ld"
        pathToPosition={["d", lineNumber, "ld"]}
        assignToLineup={assignToLineup}
      />
      <PlayerLineup
        skillGetter={skillGetter}
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

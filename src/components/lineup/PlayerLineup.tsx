import React, { FunctionComponent } from "react";
import { Player } from "../../types/player";
import { MapOf } from "../../types/base";
import PlayerSelect from "./PlayerSelect";
import { Lineup } from "../../types/team";
import { path } from "ramda";
import { SkillGetter } from "../../services/player";

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
  skillGetter: SkillGetter;
}

const PlayerLineup: FunctionComponent<Props> = ({
  assignToLineup,
  players,
  pathToPosition,
  lineup,
  sortToPosition,
  skillGetter
}) => {
  const player = path<string | undefined>(pathToPosition, lineup);

  return (
    <PlayerSelect
      skillGetter={skillGetter}
      assignToLineup={assignToLineup}
      sortToPosition={sortToPosition}
      current={player}
      players={players}
      pathToPosition={pathToPosition}
      lineup={lineup}
    />
  );
};

export default PlayerLineup;

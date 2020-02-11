import React, { FunctionComponent } from "react";
import { Player } from "../../types/player";
import { sortPlayersForPosition } from "../../services/lineup";
import { MapOf } from "../../types/base";
import { values } from "ramda";
import { getDisplayName, getEffectiveSkillAs } from "../../services/player";
import { Lineup } from "../../types/team";

interface Props {
  lineup: Lineup;
  players: MapOf<Player>;
  allowPositions?: string[];
  current?: string;
  pathToPosition: (string | number)[];
  sortToPosition: string;
  assignToLineup: (
    pathToPosition: (string | number)[],
    playerId: string
  ) => void;
}

const PlayerSelect: FunctionComponent<Props> = ({
  players,
  sortToPosition,
  pathToPosition,
  assignToLineup,
  current,
  allowPositions = ["g", "d", "lw", "c", "rw"]
}) => {
  const sortedPlayers = sortPlayersForPosition(
    sortToPosition,
    allowPositions,
    values(players)
  );

  return (
    <select
      value={current}
      onBlur={e => {
        console.log("HELLUREI", e.currentTarget.value);
        assignToLineup(pathToPosition, e.currentTarget.value);
      }}
    >
      <option value="">-</option>
      {sortedPlayers
        .map(id => players[id])
        .map(player => {
          return (
            <option value={player.id} key={player.id}>
              {getDisplayName(player)} ({getEffectiveSkillAs("g", player)})
            </option>
          );
        })}
    </select>
  );
};

export default PlayerSelect;

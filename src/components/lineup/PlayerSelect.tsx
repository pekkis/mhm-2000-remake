import React, { FunctionComponent } from "react";
import { Player } from "../../types/player";
import { sortPlayersForPosition } from "../../services/lineup";
import { MapOf } from "../../types/base";
import { values } from "ramda";
import { getDisplayName, getEffectiveSkillAs } from "../../services/player";

interface Props {
  players: MapOf<Player>;
  position: string;
  allowPositions?: string[];
  selected?: string;
}

const PlayerSelect: FunctionComponent<Props> = ({
  players,
  position,
  selected,
  allowPositions = ["g", "d", "lw", "c", "rw"]
}) => {
  const sortedPlayers = sortPlayersForPosition(
    position,
    allowPositions,
    values(players)
  );

  return (
    <select>
      <option value="">-</option>
      {sortedPlayers
        .map(id => players[id])
        .map(player => {
          return (
            <option
              value={player.id}
              key={player.id}
              selected={selected === player.id}
            >
              {getDisplayName(player)} ({getEffectiveSkillAs("g", player)})
            </option>
          );
        })}
    </select>
  );
};

export default PlayerSelect;

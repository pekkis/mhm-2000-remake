import React, { FunctionComponent } from "react";
import { Player } from "../../types/player";
import {
  sortPlayersForPosition,
  isPlayerAssignableToLineup
} from "../../services/lineup";
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
  lineup,
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

  console.log("current", current);

  return (
    <select
      value={current}
      onChange={e => {
        console.log("HELLUREI", e.target.value);
        assignToLineup(pathToPosition, e.target.value);
      }}
    >
      <option value="">-</option>
      {sortedPlayers
        .map(id => players[id])
        .map(player => {
          const isAssignable = isPlayerAssignableToLineup(
            pathToPosition,
            lineup,
            player
          );

          return (
            <option disabled={!isAssignable} value={player.id} key={player.id}>
              {getDisplayName(player)} ({player.position},
              {getEffectiveSkillAs(sortToPosition, player)})
            </option>
          );
        })}
    </select>
  );
};

export default PlayerSelect;

import React, { FunctionComponent } from "react";
import { Player } from "../../types/player";
import { Lineup as LineupType } from "../../types/team";
import { getEmptyLineup, assignPlayerToLineup } from "../../services/lineup";
import { MapOf } from "../../types/base";
import PlayerLineup from "./PlayerLineup";
import { useDispatch, useSelector } from "react-redux";
import {
  ManagerLineupSetAction,
  MANAGER_LINEUP_SET
} from "../../ducks/manager";
import { activeManager } from "../../services/selectors";

interface Props {
  players: MapOf<Player>;
  lineup?: LineupType;
}

const Lineup: FunctionComponent<Props> = ({
  players,
  lineup = getEmptyLineup()
}) => {
  const dispatch = useDispatch();
  const manager = useSelector(activeManager);

  const assignToLineup = (
    pathToPosition: (string | number)[],
    playerId: string
  ) => {
    const newLineup = assignPlayerToLineup(
      pathToPosition,
      lineup,
      players[playerId] || undefined
    );

    console.log("ASSIGNADO", pathToPosition, playerId, lineup);
    console.log(newLineup, "lineup");

    dispatch<ManagerLineupSetAction>({
      type: MANAGER_LINEUP_SET,
      payload: {
        manager: manager.id,
        lineup: newLineup
      }
    });
  };

  return (
    <div>
      <PlayerLineup
        players={players}
        lineup={lineup}
        sortToPosition="g"
        pathToPosition={["g"]}
        assignToLineup={assignToLineup}
      />

      <PlayerLineup
        players={players}
        lineup={lineup}
        sortToPosition="ld"
        pathToPosition={["d", 0, "ld"]}
        assignToLineup={assignToLineup}
      />

      <div>{JSON.stringify(lineup)}</div>
    </div>
  );
};

export default Lineup;

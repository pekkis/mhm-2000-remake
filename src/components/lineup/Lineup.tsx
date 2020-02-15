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
import DefenceLineLineup from "./DefenceLineLineup";
import { range } from "ramda";
import ForwardLineLineup from "./ForwardLineLineup";
import { SkillGetter } from "../../services/player";

interface Props {
  players: MapOf<Player>;
  lineup?: LineupType;
  skillGetter: SkillGetter;
}

const Lineup: FunctionComponent<Props> = ({
  players,
  lineup = getEmptyLineup(),
  skillGetter
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
      <div>
        <PlayerLineup
          skillGetter={skillGetter}
          players={players}
          lineup={lineup}
          sortToPosition="g"
          pathToPosition={["g"]}
          assignToLineup={assignToLineup}
        />
      </div>

      {range(0, 3).map(lineNumber => (
        <DefenceLineLineup
          skillGetter={skillGetter}
          key={lineNumber}
          players={players}
          lineup={lineup}
          lineNumber={lineNumber}
          assignToLineup={assignToLineup}
        />
      ))}

      {range(0, 4).map(lineNumber => (
        <ForwardLineLineup
          skillGetter={skillGetter}
          key={lineNumber}
          players={players}
          lineup={lineup}
          lineNumber={lineNumber}
          assignToLineup={assignToLineup}
        />
      ))}

      <div>{JSON.stringify(lineup)}</div>
    </div>
  );
};

export default Lineup;

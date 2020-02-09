import React, { FunctionComponent } from "react";
import { Player } from "../../types/player";
import { Lineup as LineupType } from "../../types/team";
import { getEmptyLineup } from "../../services/lineup";
import GoalieLineup from "./GoalieLineup";
import { MapOf } from "../../types/base";

interface Props {
  players: MapOf<Player>;
  lineup?: LineupType;
}

const Lineup: FunctionComponent<Props> = ({
  players,
  lineup = getEmptyLineup()
}) => {
  return (
    <div>
      <GoalieLineup players={players} goalie={lineup.g} />

      <div>{JSON.stringify(lineup)}</div>
    </div>
  );
};

export default Lineup;

import React from "react";
import { amount } from "../../services/format";
import { getEffective } from "../../services/effects";

const PlayerInfo = props => {
  const { player, teams } = props;

  const team = getEffective(teams.get(player.get("team")));

  return (
    <div>
      <h2>{player.get("name")}</h2>

      <div>
        <strong>Rahaa: </strong>
        {amount(player.get("balance"))}
      </div>
      <div>
        <strong>Moraali: </strong>
        {team.get("morale")}
      </div>

      <div>
        <strong>Voima: </strong>
        {team.get("strength")}
      </div>
    </div>
  );
};

export default PlayerInfo;

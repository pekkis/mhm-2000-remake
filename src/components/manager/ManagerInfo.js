import React from "react";
import { amount } from "../../services/format";
import { getEffective } from "../../services/effects";

const ManagerInfo = props => {
  const { manager, teams } = props;

  const team = getEffective(teams.get(manager.get("team")));

  return (
    <div>
      <h2>{manager.get("name")}</h2>

      <div>
        <strong>Rahaa: </strong>
        {amount(manager.get("balance"))}
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

export default ManagerInfo;

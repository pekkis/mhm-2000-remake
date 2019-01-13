import React from "react";
import { amount } from "../services/format";
import { getEffective } from "../services/effects";
import Box from "./styled-system/Box";
import TurnIndicator from "./game/TurnIndicator";

const ManagerInfo = props => {
  const { manager, teams, turn, details } = props;

  const team = getEffective(teams.get(manager.get("team")));

  return (
    <Box p={1} bg="bar">
      <h2>{manager.get("name")}</h2>

      {details && (
        <>
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

          <div>
            <strong>Vuoro: </strong>
            <TurnIndicator turn={turn} />
          </div>
        </>
      )}
    </Box>
  );
};

ManagerInfo.defaultProps = {
  details: false
};

export default ManagerInfo;

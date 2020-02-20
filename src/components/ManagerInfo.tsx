import React, { FunctionComponent } from "react";
import { amount } from "../services/format";
import { getEffective } from "../services/effects";
import { Box } from "theme-ui";
import TurnIndicator from "./game/TurnIndicator";

import styled from "@emotion/styled";
import {
  activeManager,
  allTeamsMap,
  currentTurn,
  requireHumanManagersTeamObj,
  teamsContractedPlayers
} from "../services/selectors";
import { HumanManager } from "../types/manager";
import { MapOf, Turn } from "../types/base";
import { Team } from "../types/team";
import { useSelector } from "react-redux";
import {
  calculateStrengthFromLineup,
  getEmptyLineup
} from "../services/lineup";
import { getNominalSkill } from "../services/player";

const ManagerName = styled.h2`
  margin: 0;
`;

const Details = styled.div`
  margin-top: 1em;
  display: flex;
  flex-basis: 100%;
  flex-wrap: wrap;
  align-items: stretch;
`;

const Detail = styled.div`
  flex-shrink: 0;
  width: 50%;
  display: flex;
`;

const Title = styled.div`
  font-weight: bold;
  padding-right: 0.5em;
`;

const Value = styled.div``;

interface Props {
  details?: boolean;
}

const ManagerInfo: FunctionComponent<Props> = ({ details = false }) => {
  const manager: HumanManager = useSelector(activeManager);
  const turn: Turn = useSelector(currentTurn);

  const team = useSelector(requireHumanManagersTeamObj(manager.id));
  const players = useSelector(teamsContractedPlayers(team.id));

  if (!manager.team) {
    throw new Error("Manager has no team!");
  }

  // const team = getEffective(teams.get(manager.get("team")));

  const strength = calculateStrengthFromLineup(
    getNominalSkill,
    players,
    team.lineup || getEmptyLineup()
  );

  return (
    <Box p={1} bg="bar">
      <ManagerName>
        {manager.name}, {team.name}
      </ManagerName>

      {details && (
        <Details>
          <Detail>
            <Title>Voima</Title>
            <Value>{JSON.stringify(strength)}</Value>
          </Detail>

          <Detail>
            <Title>Moraali</Title>
            <Value>{team.morale}</Value>
          </Detail>

          <Detail>
            <Title>Raha</Title>
            <Value>{amount(manager.balance)}</Value>
          </Detail>

          <Detail>
            <Title>Vuoro</Title>
            <Value>
              <TurnIndicator turn={turn} />
            </Value>
          </Detail>
        </Details>
      )}
    </Box>
  );
};

ManagerInfo.defaultProps = {
  details: false
};

export default ManagerInfo;

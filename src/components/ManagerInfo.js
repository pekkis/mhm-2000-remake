import React from "react";
import { amount } from "../services/format";
import { getEffective } from "../services/effects";
import Box from "./styled-system/Box";
import TurnIndicator from "./game/TurnIndicator";

import styled from "styled-components";

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

const ManagerInfo = props => {
  const { manager, teams, turn, details } = props;

  const team = getEffective(teams.get(manager.get("team")));

  return (
    <Box p={1} bg="bar">
      <ManagerName>{manager.get("name")}</ManagerName>

      {details && (
        <Details>
          <Detail>
            <Title>Voima</Title>
            <Value>{team.get("strength")}</Value>
          </Detail>

          <Detail>
            <Title>Moraali</Title>
            <Value>{team.get("morale")}</Value>
          </Detail>

          <Detail>
            <Title>Raha</Title>
            <Value>{amount(manager.get("balance"))}</Value>
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

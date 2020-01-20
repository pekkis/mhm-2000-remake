import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { Team } from "../../types/team";
import { HumanManager } from "../../types/manager";

const Span = styled.span`
  ${props => props.humanControlled && `font-weight: bold;`}
`;

interface Props {
  team: Team;
  managers?: HumanManager[];
}

const TeamName: FunctionComponent<Props> = ({ team, managers = [] }) => {
  const humanControlled = managers.map(p => p.team).includes(team.id);
  return <Span humanControlled={humanControlled}>{team.name}</Span>;
};

export default TeamName;

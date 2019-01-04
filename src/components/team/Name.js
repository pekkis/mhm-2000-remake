import React from "react";
import styled from "styled-components";
import { List } from "immutable";

const Span = styled.span`
  ${props => props.humanControlled && `font-weight: bold;`}
`;

const Name = props => {
  const { team, managers } = props;

  const humanControlled = managers
    .map(p => p.get("team"))
    .includes(team.get("id"));

  return <Span humanControlled={humanControlled}>{team.get("name")}</Span>;
};

Name.defaultProps = {
  managers: List()
};

export default Name;

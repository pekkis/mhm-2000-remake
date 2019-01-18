import React from "react";
import styled, { css } from "styled-components";

const Tab = props => {
  const { title, className, onSelect } = props;
  return (
    <li
      className={className}
      onClick={() => {
        onSelect();
      }}
    >
      {title}
    </li>
  );
};

export default styled(Tab)`
  cursor: pointer;
  background-color: rgba(33, 33, 33, 0.3);
  padding: 1em;
  list-style-position: inside;
  list-style-type: none;
  margin: 0 0;
  padding: 0.5em 1em;

  ${props =>
    props.isSelected &&
    css`
      font-weight: bold;
    `}
`;

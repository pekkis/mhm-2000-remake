import styled, { css } from "styled-components";

const Button = styled.button`
  border: 1px solid rgb(99, 99, 99);
  border-radius: 5px;
  padding: 1em 2em;
  font-family: inherit;
  background-color: rgb(200, 200, 200);
  box-shadow: 0 3px rgba(0, 0, 0, 0.25);
  outline: none;

  &:hover {
    background-color: rgb(180, 180, 180);
    cursor: pointer;
  }

  ${props =>
    props.secondary &&
    css`
      background-color: rgb(255, 255, 255);

      &:hover {
        background-color: rgb(250, 250, 250);
      }
    `}

  &:active {
    box-shadow: 0 1px rgba(0, 0, 0, 0.25);
    transform: translateY(2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:active {
      box-shadow: 0 3px rgba(0, 0, 0, 0.25);
      transform: none;
    }
  }

  ${props =>
    props.terse &&
    css`
      padding: 1em;
    `}

  ${props =>
    props.block &&
    css`
      width: 100%;
      display: block;
    `}
`;

export default Button;

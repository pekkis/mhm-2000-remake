import styled from "styled-components";

const Button = styled.button`
  border: 1px solid rgb(99, 99, 99);
  border-radius: 5px;
  padding: 1em 2em;
  font-family: inherit;
  background-color: rgb(200, 200, 200);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover {
    background-color: rgb(180, 180, 180);
    cursor: pointer;
  }

  ${props =>
    props.block &&
    `width: 100%;
    display: block;
    margin: 1em 0;
  `}
`;

export default Button;

import React from "react";
import styled from "styled-components";
import Button from "./form/Button";

const Container = styled.header`
  background-color: rgb(133, 133, 133);
  padding: 1em;
  color: rgb(255, 255, 255);
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-basis: 100%;

  .title {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .advance {
    width: 100%;
    align-self: flex-end;
    text-align: right;
  }
`;

const Header = props => {
  const { advance, advanceEnabled } = props;

  return (
    <Container>
      <div className="title">
        <div>MHM 97</div>
      </div>
      <div className="advance">
        <Button disabled={!advanceEnabled} onClick={() => advance()}>
          Eteenpäin
        </Button>
      </div>
    </Container>
  );
};

export default Header;

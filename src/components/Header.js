import React from "react";
import styled from "styled-components";
import Button from "./form/Button";

const Container = styled.header`
  background-color: rgb(133, 133, 133);
  padding: 0.5em 0;
  color: rgb(255, 255, 255);
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-basis: 100%;
  z-index: 1000;

  .back {
    flex-grow: 2;
    padding: 0 0.5em;
  }

  .advance {
    align-self: flex-end;
    text-align: right;
    flex-grow: 3;
    padding: 0 0.5em;
  }
`;

const Header = props => {
  const { back, history, advance, advanceEnabled } = props;

  return (
    <Container>
      {back && (
        <div className="back">
          <Button block onClick={() => history.push("/")}>
            Takaisin
          </Button>
        </div>
      )}

      <div className="advance">
        <Button block disabled={!advanceEnabled} onClick={() => advance()}>
          Eteenpäin
        </Button>
      </div>
    </Container>
  );
};

Header.defaultProps = {
  back: false
};

export default Header;

import React from "react";
import styled from "styled-components";
import Button from "./form/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toggleMenu } from "../ducks/ui";

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

  .secondary {
    flex-shrink: 10;
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
  const {
    back,
    menu,
    history,
    advanceEnabled,
    advance,
    toggleMenu,
    forward
  } = props;

  return (
    <Container>
      {back && (
        <div className="advance">
          <Button block onClick={() => history.push("/")}>
            Päävalikkoon
          </Button>
        </div>
      )}

      {!back && (
        <>
          {menu && (
            <div className="secondary">
              <Button secondary onClick={() => toggleMenu()}>
                <FontAwesomeIcon icon={["fa", "bars"]} />
              </Button>
            </div>
          )}
          <div className="advance">
            <Button block disabled={!advanceEnabled} onClick={() => advance()}>
              {forward}
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

Header.defaultProps = {
  back: false,
  menu: false,
  forward: "Eteenpäin!"
};

export default Header;

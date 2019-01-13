import React from "react";
import styled from "styled-components";
import ActionMenu from "./containers/ActionMenuContainer";

const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;
`;

const MenuContents = styled.div`
  background-color: rgb(0, 0, 0);
  padding: 1em;
  color: rgb(255, 255, 255);
  width: 100%;
  border-radius: 1em;

  a:link,
  a:hover,
  a:visited {
    color: rgb(255, 255, 255);
  }

  ul {
    display: block;
    list-style-type: none;
    list-style-position: inside;
    margin: 0;
    padding: 0;
    text-align: center;

    li {
      margin: 0;
      padding: 0.5em 0;
    }
  }
`;

const ModalMenu = props => {
  return (
    <MenuContainer>
      <MenuContents>
        <ActionMenu />
      </MenuContents>
    </MenuContainer>
  );
};

export default ModalMenu;

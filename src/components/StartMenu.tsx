import React from "react";
import ButtonRow from "./form/ButtonRow";
import Button from "./form/Button";
import Box from "./styled-system/Box";
import ManagerForm from "./start-menu/ManagerForm";
import styled from "styled-components";
import title from "../assets/title.png";

const Menu = styled.div``;

const Contents = styled.div`
  h1 {
    margin: 0;
  }

  h2 {
    margin: 0;
    font-size: 1em;
  }
`;

const Centerer = styled.div`
  text-align: center;
`;

const StartMenu = props => {
  const {
    teams,
    competitions,
    className,
    startGame,
    manager,
    loadGame,
    starting,
    advance
  } = props;

  return (
    <main className={className} role="main">
      <Menu>
        <Contents>
          <Centerer>
            <img
              src={title}
              css={{
                maxWidth: "100%",
                display: "block"
              }}
            />
            <Box px={1} py={0}>
              <h1>MHM 2000</h1>
              <h2>
                Maailman paras jääkiekkomanagerisimulaatio, syntynyt uudelleen!
              </h2>
              <h2>build: {process.env.COMMIT_REF || "dev"}</h2>
            </Box>
          </Centerer>

          {!starting && (
            <Box p={1}>
              <Centerer>
                <ButtonRow>
                  <Button
                    tabindex="0"
                    onClick={() => {
                      startGame();
                    }}
                  >
                    Uusi peli
                  </Button>
                  <Button
                    tabindex="0"
                    onClick={() => {
                      loadGame();
                    }}
                  >
                    Lataa peli
                  </Button>
                </ButtonRow>
              </Centerer>
              <h3>Alkuperäinen suunnittelu & ohjelmointi</h3>
              <ul>
                <li>Mikko Forsström</li>
              </ul>
              <h3>Remaken suunnittelu & ohjelmointi</h3>
              <ul>
                <li>Mikko Forsström</li>
              </ul>
              <h3>Grafiikka</h3>
              <ul>
                <li>Santtu Huotilainen</li>
                <li>Mikko Forsström</li>
              </ul>
              <h3>Laadunvalvonta</h3>
              <ul>
                <li>X</li>
              </ul>
            </Box>
          )}

          {starting && (
            <Box p={1}>
              <ManagerForm
                teams={teams}
                competitions={competitions}
                manager={manager}
                advance={advance}
              />
            </Box>
          )}
        </Contents>
      </Menu>
    </main>
  );
};

export default styled(StartMenu)`
  margin: 0 auto;
  max-width: 600px;

  p {
    margin: 1em 0;
  }
`;

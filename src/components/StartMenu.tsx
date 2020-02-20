import React, { FunctionComponent, useCallback } from "react";
import ButtonRow from "./form/ButtonRow";
import Button from "./form/Button";
import { Box } from "theme-ui";
import ManagerForm from "./start-menu/ManagerForm";
import styled from "@emotion/styled";
import title from "../assets/title.png";
import { useSelector, useDispatch } from "react-redux";
import { MHMState } from "../ducks";
import { startGame, loadGame, advance } from "../ducks/game";
import {
  playableCompetitions,
  allTeams,
  allTeamsMap
} from "../services/selectors";
import { Team } from "../types/team";

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

const StartMenu: FunctionComponent = () => {
  /*
  state => ({
    started: state.meta.get("started"),
    turn: state.game.get("turn"),
    menu: state.ui.get("menu"),
    calendar: state.game.get("calendar")
  }),
  { startGame, loadGame }
  */

  const teams = useSelector(allTeamsMap);
  const competitions = useSelector(playableCompetitions);
  const starting = useSelector((state: MHMState) => state.game.starting);
  const dispatch = useDispatch();

  const teamStats = useSelector((state: MHMState) => state.stats.teams);

  return (
    <main
      css={{
        margin: "0 auto",
        maxWidth: "600px",

        p: {
          margin: "1em 0"
        }
      }}
      role="main"
    >
      <Menu>
        <Contents>
          <Centerer>
            <img
              alt="MHM 2000"
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
                    tabIndex={0}
                    onClick={() => {
                      dispatch(startGame());
                    }}
                  >
                    Uusi peli
                  </Button>
                  <Button
                    tabIndex={0}
                    onClick={() => {
                      dispatch(loadGame());
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
                stats={teamStats}
                teams={teams}
                competitions={competitions}
                dispatch={dispatch}
              />
            </Box>
          )}
        </Contents>
      </Menu>
    </main>
  );
};

export default React.memo(StartMenu);

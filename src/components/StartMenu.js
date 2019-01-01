import React from "react";
import ButtonRow from "./form/ButtonRow";
import Button from "./form/Button";
import PlayerForm from "./start-menu/PlayerForm";
import styled from "styled-components";

import title from "../assets/title.png";

const Menu = styled.div``;

const Contents = styled.div``;

const TitleImg = styled.img`
  width: 500px;
`;

const Centerer = styled.div`
  text-align: center;
`;

const StartMenu = props => {
  const { className, startGame, player, loadGame, starting, advance } = props;

  return (
    <div className={className}>
      <Menu>
        <Contents>
          <Centerer>
            <TitleImg src={title} />
            <h1>MHM 97 - maailman paras jääkiekkomanagerisimulaatio</h1>
          </Centerer>

          {!starting && (
            <div>
              <Centerer>
                <ButtonRow>
                  <Button
                    onClick={() => {
                      startGame();
                    }}
                  >
                    Uusi peli
                  </Button>
                  <Button
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
                <li>Teemu Nevalainen</li>
                <li>Mikko Forsström</li>
              </ul>
              <h3>Laadunvalvonta</h3>
              <ul>
                <li>Teemu Nevalainen</li>
                <li>Sami Helen</li>
                <li>A-P Nevalainen</li>
                <li>Antti Kettunen</li>
              </ul>
              <h3>v1.2 betatestaus</h3>
              <ul>
                <li>Henri Hokkanen</li>
                <li>Jussi Kniivilä </li>
                <li>Tony Herranen</li>
                <li>Antti Laakso</li>
                <li>Markus Lämsä</li>
                <li>Tomi Salmi</li>
                <li>Aleksi Ursin</li>
                <li>Ilmari Sandelin</li>
              </ul>
              <h3>Erityiskiitokset</h3>
              <ul>
                <li>Sami Ritola</li>
              </ul>
            </div>
          )}

          {starting && <PlayerForm player={player} advance={advance} />}
        </Contents>
      </Menu>
    </div>
  );
};

export default styled(StartMenu)`
  margin: 0 auto;
  max-width: 600px;

  p {
    margin: 1em 0;
  }
`;

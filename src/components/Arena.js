import React from "react";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import ManagerInfo from "./containers/ManagerInfoContainer";
import ButtonRow from "./form/ButtonRow";
import Button from "./form/Button";
import arenas from "../data/arenas";
import styled, { css } from "styled-components";
import { currency } from "../services/format";
import Box from "./styled-system/Box";

const ArenaHierarchy = styled.div``;

const Arena = styled.div`
  ${props =>
    props.current &&
    css`
      font-weight: bold;
    `}
`;

const Arenas = props => {
  const { manager, teams, improveArena } = props;

  const currentLevel = manager.getIn(["arena", "level"]);

  const nextLevel = arenas.get(currentLevel + 1);

  const canDo =
    currentLevel < 9 && manager.get("balance") >= nextLevel.get("price");

  return (
    <HeaderedPage>
      <Header back />

      <ManagerInfo details />

      <Box p={1}>
        <h2>Areena</h2>

        <ArenaHierarchy>
          <h3>Areenasi sijoitus areenahierarkiassa:</h3>

          {arenas
            .map((arena, level) => {
              return (
                <Arena current={level === currentLevel} key={arena.get("id")}>
                  {arena.get("name")}
                </Arena>
              );
            })
            .reverse()}
        </ArenaHierarchy>

        <ButtonRow>
          {nextLevel && (
            <Button
              block
              disabled={!canDo}
              onClick={() => {
                improveArena(manager.get("id"));
              }}
            >
              <div>Paranna halliolosuhteitasi</div>
              <div>{currency(nextLevel.get("price"))}</div>
            </Button>
          )}
        </ButtonRow>
      </Box>
    </HeaderedPage>
  );
};

export default Arenas;

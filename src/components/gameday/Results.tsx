import React from "react";
import styled from "@emotion/styled";
import TeamName from "../team/TeamName";
import { List } from "immutable";
import Game from "./Game";
import Box from "../styled-system/Box";

const Results = props => {
  const { className, teams, context, round, managers } = props;

  const pairings = context.getIn(["schedule", round], List()).filter((p, i) => {
    return p.get("result");
  });

  return (
    <Box my={1}>
      {pairings.map((pairing, i) => {
        return (
          <Game
            key={i}
            context={context}
            pairing={pairing}
            managers={managers}
            teams={teams}
          />
        );
      })}
    </Box>
  );
};

export default styled(Results)`
  max-width: 30em;
`;

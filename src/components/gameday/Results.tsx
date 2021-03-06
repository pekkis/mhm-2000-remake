import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";
import Game from "./Game";
import { Box } from "theme-ui";
import { HumanManager } from "../../types/manager";
import { MapOf, CompetitionGroup } from "../../types/base";
import { Team } from "../../types/team";

interface Props {
  context: CompetitionGroup;
  teams: MapOf<Team>;
  managers: HumanManager[];
  round: number;
}

const Results: FunctionComponent<Props> = props => {
  const { className, teams, context, round, managers } = props;

  const pairings = context.schedule[round];

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

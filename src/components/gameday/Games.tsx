import React, { FunctionComponent } from "react";
import competitionTypes from "../../services/competition-type";
import Game from "./Game";
import { Box } from "theme-ui";
import { CompetitionGroup, MapOf } from "../../types/base";
import { Team } from "../../types/team";
import { HumanManager } from "../../types/manager";

interface Props {
  context: CompetitionGroup;
  teams: MapOf<Team>;
  managers: HumanManager[];
  round: number;
}

const Games: FunctionComponent<Props> = props => {
  const { teams, context, round, managers } = props;

  const playMatchFunc = competitionTypes[context.type].playMatch;

  const pairings = context.schedule[round].filter((_, i) =>
    playMatchFunc(context, round, i)
  );

  return (
    <Box my={1}>
      {pairings.map((pairing, i) => {
        return (
          <Game
            key={i}
            context={context}
            pairing={pairing}
            teams={teams}
            managers={managers}
          />
        );
      })}
    </Box>
  );
};

export default Games;

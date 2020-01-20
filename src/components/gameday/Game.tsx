import React, { FunctionComponent } from "react";
import TeamName from "../team/TeamName";
import Row from "./Row";
import Team from "./Team";
import Separator from "./Separator";
import Result from "./Result";
import { HumanManager } from "../../types/manager";
import { Team as TeamType } from "../../types/team";
import { MapOf, CompetitionGroup, ScheduleGame } from "../../types/base";
import Score from "./Score";

interface Props {
  context: CompetitionGroup;
  teams: MapOf<TeamType>;
  managers: HumanManager[];
  pairing: ScheduleGame;
}

const Game: FunctionComponent<Props> = props => {
  const { context, pairing, teams, managers } = props;

  return (
    <Row>
      <Team>
        <TeamName
          managers={managers}
          team={teams[context.teams[pairing.home]]}
        />
      </Team>
      <Separator>-</Separator>
      <Team>
        <TeamName
          managers={managers}
          team={teams[context.teams[pairing.away]]}
        />
      </Team>
      <Result>
        {pairing.result && (
          <>
            <Score>{pairing.result.home}</Score>
            <Separator>-</Separator>
            <Score>{pairing.result.away}</Score>
          </>
        )}
      </Result>
    </Row>
  );
};

export default Game;

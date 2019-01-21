import React from "react";
import styled from "styled-components";
import TeamName from "../team/Name";

const Row = styled.div`
  display: flex;
  flex-basis: 100%;
`;

const Team = styled.div`
  width: 50%;
  overflow: hidden;
`;

const Separator = styled.div`
  padding: 0 1em;
`;

const Result = styled.div`
  width: 50%;
  flex-shrink: 2;
  display: flex;
`;

const Score = styled.div``;

const Game = props => {
  const { context, pairing, teams, managers } = props;
  return (
    <Row>
      <Team>
        <TeamName
          managers={managers}
          team={teams.get(context.getIn(["teams", pairing.get("home")]))}
        />
      </Team>
      <Separator>-</Separator>
      <Team>
        <TeamName
          managers={managers}
          team={teams.get(context.getIn(["teams", pairing.get("away")]))}
        />
      </Team>
      <Result>
        {pairing.get("result") && (
          <>
            <Score>{pairing.getIn(["result", "home"])}</Score>
            <Separator>-</Separator>
            <Score>{pairing.getIn(["result", "away"])}</Score>
          </>
        )}
      </Result>
    </Row>
  );
};

export default Game;

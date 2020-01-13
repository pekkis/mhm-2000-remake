import React, { FC, FunctionComponent } from "react";

import { List } from "immutable";
import Table from "./league-table/Table";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import Results from "./gameday/Results";
import Box from "./styled-system/Box";
import { MHMTurnDefinition } from "../types/base";

interface Props {
  calendarEntry: MHMTurnDefinition;
}

const GamedayResults: FunctionComponent<Props> = props => {
  const { managers, teams, competitions, calendarEntry } = props;

  const currentCompetitions = calendarEntry.gamedays.map(c =>
    competitions.get(c)
  );

  return (
    <HeaderedPage>
      <Header />
      <Box p={1}>
        <h2>Tulokset</h2>

        {currentCompetitions.map(competition => {
          const currentPhase = competition.getIn([
            "phases",
            competition.get("phase")
          ]);

          return (
            <div key={competition.get("name")}>
              {currentPhase.get("groups").map((group, groupIndex) => {
                const currentRound = group.get("round") - 1;

                return (
                  <div key={groupIndex}>
                    <h3>
                      {competition.get("name")}, {group.get("name")} [
                      {currentRound}]
                    </h3>

                    <Results
                      teams={teams}
                      context={group}
                      round={currentRound}
                      managers={managers}
                    />

                    {currentPhase.get("type") === "tournament" && (
                      <div>
                        <Table
                          division={group}
                          managers={managers}
                          teams={teams}
                        />
                      </div>
                    )}

                    <div />
                  </div>
                );
              })}
            </div>
          );
        })}
      </Box>
    </HeaderedPage>
  );
};

export default GamedayResults;
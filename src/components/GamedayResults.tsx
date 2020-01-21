import React, { FunctionComponent } from "react";
import Table from "./league-table/Table";
import Header from "./Header";
import HeaderedPage from "./ui/HeaderedPage";
import Results from "./gameday/Results";
import Box from "./styled-system/Box";
import { useSelector } from "react-redux";
import {
  currentCalendarEntry,
  allCompetitions,
  humanManagers,
  allTeamsMap
} from "../services/selectors";
import { CompetitionGroup, isTournamentCompetitionGroup } from "../types/base";

const GamedayResults: FunctionComponent = () => {
  const calendarEntry = useSelector(currentCalendarEntry);
  const competitions = useSelector(allCompetitions);
  const managers = useSelector(humanManagers);
  const teams = useSelector(allTeamsMap);

  const currentCompetitions = calendarEntry.gamedays.map(c => competitions[c]);

  return (
    <HeaderedPage>
      <Header />
      <Box p={1}>
        <h2>Tulokset</h2>

        {currentCompetitions.map(competition => {
          const currentPhase = competition.phases[competition.phase];

          return (
            <div key={competition.id}>
              {(currentPhase.groups as CompetitionGroup[]).map(
                (group, groupIndex) => {
                  const currentRound = group.round - 1;

                  return (
                    <div key={groupIndex}>
                      <h3>
                        {competition.name}, {group.name} [{currentRound}]
                      </h3>

                      <Results
                        teams={teams}
                        context={group}
                        round={currentRound}
                        managers={managers}
                      />

                      {isTournamentCompetitionGroup(group) && (
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
                }
              )}
            </div>
          );
        })}
      </Box>
    </HeaderedPage>
  );
};

export default GamedayResults;

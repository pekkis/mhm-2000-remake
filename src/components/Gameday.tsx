import React, { FunctionComponent } from "react";
import Table from "./league-table/Table";
import Header from "./Header";
import HeaderedPage from "./ui/HeaderedPage";
import Games from "./gameday/Games";
import { Box } from "theme-ui";
import { CompetitionGroup, isTournamentCompetitionGroup } from "../types/base";
import { useSelector } from "react-redux";
import {
  currentCalendarEntry,
  allCompetitions,
  humanManagers,
  allTeamsMap
} from "../services/selectors";

const Gameday: FunctionComponent = () => {
  const calendarEntry = useSelector(currentCalendarEntry);
  const competitions = useSelector(allCompetitions);
  const managers = useSelector(humanManagers);
  const teams = useSelector(allTeamsMap);

  const currentCompetitions = calendarEntry.gamedays.map(c => competitions[c]);

  return (
    <HeaderedPage>
      <Header />

      <Box p={1}>
        <h2>Pelipäivä</h2>

        {currentCompetitions.map(competition => {
          const currentPhase = competition.phases[competition.phase];

          return (
            <div key={competition.name}>
              {(currentPhase.groups as CompetitionGroup[]).map(
                (group, groupIndex) => {
                  const currentRound = group.round;

                  return (
                    <div key={groupIndex}>
                      <h3>
                        {competition.name}, {group.name} [{currentRound}]
                      </h3>

                      <Games
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

export default Gameday;

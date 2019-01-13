import React from "react";
import calendar from "../data/calendar";
import { List } from "immutable";
import Table from "./league-table/Table";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import Games from "./gameday/Games";
import Box from "./styled-system/Box";

const Gameday = props => {
  const { turn, managers, teams, competitions } = props;

  const calendarEntry = calendar.get(turn.get("round"));

  console.log("calendar entry", calendarEntry.toJS());

  const currentCompetitions = calendarEntry
    .get("gamedays", List())
    .map(c => competitions.get(c));

  return (
    <HeaderedPage>
      <Header />

      <Box p={1}>
        <h2>Pelipäivä</h2>

        {currentCompetitions.map(competition => {
          const currentPhase = competition.getIn([
            "phases",
            competition.get("phase")
          ]);

          return (
            <div key={competition.get("name")}>
              <h3>{competition.get("name")}</h3>
              {currentPhase.get("groups").map((group, groupIndex) => {
                const currentRound = group.get("round");

                return (
                  <div key={groupIndex}>
                    <h4>
                      {group.get("name")} [{currentRound}]
                    </h4>

                    <Games
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

export default Gameday;

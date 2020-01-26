import React from "react";
import Table from "./league-table/Table";
import Header from "./Header";
import HeaderedPage from "./ui/HeaderedPage";
import Box from "./styled-system/Box";
import { useSelector } from "react-redux";
import {
  humanManagers,
  allTeamsMap,
  weightedCompetitions
} from "../services/selectors";
import { CompetitionGroup, RoundRobinCompetitionGroup } from "../types/base";

const LeagueTables = props => {
  const managers = useSelector(humanManagers);
  const teams = useSelector(allTeamsMap);
  const competitions = useSelector(weightedCompetitions);

  return (
    <HeaderedPage>
      <Header back />
      <Box p={1}>
        <h2>Sarjataulukot</h2>

        {competitions
          .filter(c => c.phase >= 0)
          .map(c => {
            const phase = c.phases[0];

            if (phase.type !== "round-robin") {
              return null;
            }

            return (
              <div key={c.id}>
                <h3>{c.name}</h3>
                {(phase.groups as CompetitionGroup[]).map((group, i) => {
                  return (
                    <div key={i}>
                      <h4>{group.name}</h4>
                      <Table
                        division={group as RoundRobinCompetitionGroup}
                        managers={managers}
                        teams={teams}
                      />
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

export default LeagueTables;

import React from "react";
import Table from "./league-table/Table";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import Box from "./styled-system/Box";

const LeagueTables = props => {
  const { managers, teams, competitions } = props;

  return (
    <HeaderedPage>
      <Header back />
      <Box p={1}>
        <h2>Sarjataulukot</h2>

        {competitions
          .filter(c => c.get("phase") >= 0)
          .map(c => {
            const phase = c.getIn(["phases", 0]);
            const groups = phase.get("groups");

            return (
              <div key={c.get("id")}>
                <h3>{c.get("name")}</h3>
                {groups.map((group, i) => {
                  return (
                    <div key={i}>
                      <h4>{group.get("name")}</h4>
                      <Table
                        division={group}
                        managers={managers}
                        teams={teams}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })
          .toList()}
      </Box>
    </HeaderedPage>
  );
};

export default LeagueTables;

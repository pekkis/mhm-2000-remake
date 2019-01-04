import React from "react";
import Table from "./league-table/Table";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";

const LeagueTables = props => {
  const {
    turn,
    advance,
    manager,
    managers,
    teams,
    competitions,
    resolveEvent,
    events,
    saveGame,
    quitToMainMenu,
    news
  } = props;

  return (
    <HeaderedPage>
      <Header back />
      <h2>Sarjataulukot</h2>

      {competitions
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
                    <Table division={group} managers={managers} teams={teams} />
                  </div>
                );
              })}
            </div>
          );
        })
        .toList()}
    </HeaderedPage>
  );
};

export default LeagueTables;

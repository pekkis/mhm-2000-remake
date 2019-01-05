import React from "react";
import ManagerInfo from "./manager/ManagerInfo";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";

import pranks from "../data/pranks";

console.log(pranks, "pränks");

const Pranks = props => {
  const {
    manager,
    teams,
    selectPrankType,
    selectPrankVictim,
    executePrank
  } = props;

  return (
    <HeaderedPage>
      <Header back>
        <h2>Jäynät</h2>
      </Header>

      <ManagerInfo manager={manager} teams={teams} />

      <div>
        {pranks
          .map((prank, i) => {
            return <div key={i}>{prank.get("name")}</div>;
          })
          .toList()}
      </div>
    </HeaderedPage>
  );
};

export default Pranks;

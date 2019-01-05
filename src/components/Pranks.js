import React from "react";
import ManagerInfo from "./manager/ManagerInfo";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import Button from "./form/Button";

import SelectVictim from "./pranks/SelectVictim";
import SelectType from "./pranks/SelectType";
import ConfirmPrank from "./pranks/ConfirmPrank";

import pranks from "../data/pranks";

const Pranks = props => {
  const {
    competitions,
    manager,
    teams,
    selectPrankType,
    selectPrankVictim,
    executePrank,
    cancelPrank,
    prank
  } = props;

  const phl = competitions.get("phl");
  const division = competitions.get("division");

  const targetCompetition = phl.get("teams").includes(manager.get("team"))
    ? phl
    : division;

  switch (true) {
  }

  return (
    <HeaderedPage>
      <Header back>
        <h2>Jäynät</h2>
      </Header>

      <ManagerInfo manager={manager} teams={teams} />

      {!prank.get("type") && (
        <SelectType selectType={selectPrankType} cancel={cancelPrank} />
      )}

      {prank.get("type") && !prank.get("victim") && (
        <SelectVictim
          manager={manager}
          prank={prank}
          competition={targetCompetition}
          teams={teams}
          selectVictim={selectPrankVictim}
          cancel={cancelPrank}
        />
      )}

      {prank.get("type") && prank.get("victim") && (
        <ConfirmPrank manager={manager} prank={prank} execute={executePrank} />
      )}
    </HeaderedPage>
  );
};

export default Pranks;

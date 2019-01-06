import React from "react";
import ManagerInfo from "./manager/ManagerInfo";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import Button from "./form/Button";

import SelectVictim from "./pranks/SelectVictim";
import SelectType from "./pranks/SelectType";
import ConfirmPrank from "./pranks/ConfirmPrank";

import pranks from "../data/pranks";
import difficultyLevels from "../data/difficulty-levels";

const Pranks = props => {
  const {
    competitions,
    manager,
    teams,
    selectPrankType,
    selectPrankVictim,
    orderPrank,
    cancelPrank,
    prank
  } = props;

  const phl = competitions.get("phl");
  const division = competitions.get("division");

  const difficultyLevel = difficultyLevels.get(manager.get("difficulty"));

  const canDo =
    difficultyLevel.get("pranksPerSeason") > manager.get("pranksExecuted");

  const targetCompetition = phl.get("teams").includes(manager.get("team"))
    ? phl
    : division;

  return (
    <HeaderedPage>
      <Header back>
        <h2>Jäynät</h2>
      </Header>

      <ManagerInfo manager={manager} teams={teams} />

      {!canDo && (
        <p>
          Olet jo jäynäyttänyt {manager.get("pranksExecuted")} kertaa tällä
          kaudella. Nähdään ensi vuonna!
        </p>
      )}

      {!prank.get("type") && (
        <SelectType
          manager={manager}
          enabled={canDo}
          competition={targetCompetition.get("name")}
          selectType={selectPrankType}
          cancel={cancelPrank}
        />
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
        <ConfirmPrank manager={manager} prank={prank} execute={orderPrank} />
      )}
    </HeaderedPage>
  );
};

export default Pranks;

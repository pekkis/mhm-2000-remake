import React from "react";

import Events from "./events/Events";
import Situation from "./context-sensitive/Situation";
import ManagerInfo from "./containers/ManagerInfoContainer";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import Forward from "./context-sensitive/containers/ForwardContainer";
import Current from "./context-sensitive/containers/CurrentContainer";

import Box from "./styled-system/Box";

const MainMenu = props => {
  const {
    manager,
    teams,
    competitions,
    resolveEvent,
    events,
    interestingCompetitions
  } = props;

  return (
    <HeaderedPage>
      <Header menu forward={<Forward />} />

      <ManagerInfo details />

      <Box p={1}>
        <Current />

        <Situation
          manager={manager}
          competitions={competitions}
          interesting={interestingCompetitions}
          teams={teams}
        />

        <Events manager={manager} events={events} resolveEvent={resolveEvent} />
      </Box>
    </HeaderedPage>
  );
};

export default MainMenu;

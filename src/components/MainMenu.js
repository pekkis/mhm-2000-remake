import React from "react";

import Events from "./events/Events";
import News from "./news/News";
import Situation from "./context-sensitive/Situation";
import ManagerInfo from "./containers/ManagerInfoContainer";
import Header from "./containers/HeaderContainer";
import HeaderedPage from "./ui/HeaderedPage";
import Forward from "./context-sensitive/containers/ForwardContainer";

import Box from "./styled-system/Box";

const MainMenu = props => {
  const {
    manager,
    teams,
    competitions,
    resolveEvent,
    events,
    news,
    interestingCompetitions
  } = props;

  return (
    <HeaderedPage>
      <Header menu forward={<Forward />} />

      <ManagerInfo />

      <Box p={1}>
        <Situation
          manager={manager}
          competitions={competitions}
          interesting={interestingCompetitions}
          teams={teams}
        />
        <hr />

        <News manager={manager} news={news} />

        <hr />

        <Events manager={manager} events={events} resolveEvent={resolveEvent} />
      </Box>
    </HeaderedPage>
  );
};

export default MainMenu;

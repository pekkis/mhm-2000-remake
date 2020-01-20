import React, { FunctionComponent } from "react";

import Events from "./events/Events";
import Situation from "./context-sensitive/Situation";
import ManagerInfo from "./ManagerInfo";
import Header from "./Header";
import HeaderedPage from "./ui/HeaderedPage";
import Forward from "./context-sensitive/Forward";
import Current from "./context-sensitive/Current";

import Box from "./styled-system/Box";
import { useSelector, useDispatch } from "react-redux";
import { MHMState } from "../ducks";
import { HumanManager } from "../types/manager";
import {
  activeManager,
  interestingCompetitions,
  weightedCompetitions
} from "../services/selectors";

const MainMenu: FunctionComponent = () => {
  const manager = useSelector<MHMState, HumanManager>(activeManager);

  const interesting = useSelector(interestingCompetitions(manager.id));
  const competitions = useSelector(
    (state: MHMState) => state.competition.competitions
  );

  const teams = useSelector((state: MHMState) => state.team.teams);

  const events = useSelector((state: MHMState) => state.event.events);

  const dispatch = useDispatch();

  return (
    <HeaderedPage>
      <Header menu forward={<Forward />} />
      {/*<ManagerInfo details />*/}

      <Box p={1}>
        {/*<Current />*/}

        <Situation
          manager={manager}
          competitions={competitions}
          interesting={interesting}
          teams={teams}
        />

        {/*<Events manager={manager} events={events} resolveEvent={resolveEvent} />*/}
      </Box>
    </HeaderedPage>
  );
};

export default MainMenu;

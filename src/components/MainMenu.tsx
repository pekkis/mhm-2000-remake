import React, { FunctionComponent } from "react";

import Events from "./events/Events";
import Situation from "./context-sensitive/Situation";
import ManagerInfo from "./ManagerInfo";
import Header from "./Header";
import HeaderedPage from "./ui/HeaderedPage";
import Forward from "./fixed-bar/Forward";
import Current from "./context-sensitive/Current";

import { Box } from "theme-ui";
import { useSelector, useDispatch } from "react-redux";
import { MHMState } from "../ducks";
import { HumanManager } from "../types/manager";
import {
  selectActiveManager,
  interestingCompetitions,
  weightedCompetitions
} from "../services/selectors";
import FixedBar from "./fixed-bar/FixedBar";
import MenuButton from "./fixed-bar/MenuButton";
import ButtonRow from "./fixed-bar/ButtonRow";
import PrimaryButton from "./fixed-bar/PrimaryButton";

const MainMenu: FunctionComponent = () => {
  const manager = useSelector<MHMState, HumanManager>(selectActiveManager);

  const interesting = useSelector(interestingCompetitions(manager.id));
  const competitions = useSelector(
    (state: MHMState) => state.competition.competitions
  );

  const teams = useSelector((state: MHMState) => state.team.teams);

  const events = useSelector((state: MHMState) => state.event.events);

  const dispatch = useDispatch();

  console.log("hello");

  return (
    <HeaderedPage>
      <FixedBar>
        <ButtonRow>
          <MenuButton />
          <PrimaryButton>
            <Forward />
          </PrimaryButton>
        </ButtonRow>
      </FixedBar>

      <ManagerInfo details />

      <Box p={[1, 3]}>
        <Current />

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

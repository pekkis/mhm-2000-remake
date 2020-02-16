import { select, call, put } from "redux-saga/effects";

import { MapOf, CalendarEntry, SeasonStrategies } from "../../../types/base";
import { Manager, ComputerManager } from "../../../types/manager";
import {
  HumanControlledTeam,
  ComputerControlledTeam
} from "../../../types/team";
import {
  allHumanControlledTeams,
  allComputerControlledTeams,
  allManagersMap,
  currentCalendarEntry
} from "../../../services/selectors";
import { isComputerManager } from "../../../services/manager";
import aiService from "../../../services/ai";
import {
  ManagerSelectStrategyAction,
  MANAGER_SELECT_STRATEGY
} from "../../../ducks/manager";

function* doSelectStrategy(manager: ComputerManager) {
  const ai = aiService.getAi(manager.ai);
  const strategy: SeasonStrategies = yield call(ai.selectStrategy, manager);
  yield put<ManagerSelectStrategyAction>({
    type: MANAGER_SELECT_STRATEGY,
    payload: {
      manager: manager.id,
      strategy
    }
  });
}

export default function* aiActionPhase() {
  const managers: MapOf<Manager> = yield select(allManagersMap);

  const humanTeams: HumanControlledTeam[] = yield select(
    allHumanControlledTeams
  );

  const aiTeams: ComputerControlledTeam[] = yield select(
    allComputerControlledTeams
  );

  console.log(humanTeams, "HUMAN CONTROLLED TEAMS");
  console.log(aiTeams, "AI CONTROLLED TEAMS");

  for (const aiTeam of aiTeams) {
    const managerId = aiTeam.manager;
    if (!managerId) {
      throw new Error("Computer team has no manager");
    }

    const manager = managers[managerId];

    if (!isComputerManager(manager)) {
      throw new Error("Is not computer manager");
    }
    console.log(
      aiTeam.id,
      "will do its actions and",
      manager.name,
      "shall manage the team with AI",
      manager.ai
    );

    const currentEntry: CalendarEntry = yield select(currentCalendarEntry);

    const doActions = currentEntry?.ai?.actions || [];

    if (doActions.includes("selectStrategy")) {
      yield call(doSelectStrategy, manager);
    }
  }
}

import { select, call, all, putResolve } from "redux-saga/effects";
import {
  computerManagerByName,
  teamByName,
  computerManagers,
  allTeamsInCompetitions,
  allTeams
} from "../../services/selectors";
import { Team } from "../../types/team";
import { Manager, ComputerManager } from "../../types/manager";
import { hireManager, addManager } from "../manager";
import { sortBy, zip } from "ramda";
import random from "../../services/random";
import { ManagerAddManagerAction, MANAGER_ADD } from "../../ducks/manager";
import { createFillerManager } from "../../services/manager";

function* initializeRestOfTheManagers() {
  const teams: Team[] = yield select(allTeams);
  const teamsWithoutManager = teams.filter(t => !t.manager).map(t => t.id);

  for (const teamId of teamsWithoutManager) {
    const filler = createFillerManager();
    yield putResolve<ManagerAddManagerAction>({
      type: MANAGER_ADD,
      payload: filler
    });

    yield call(hireManager, filler, teamId);
  }
}

function* initializePlayableTeamsManagers() {
  // Juri Simonov always manages Kärpät in the beginning of the game :)
  const simonov: Manager = yield select(computerManagerByName("Juri Simonov"));
  const team: Team = yield select(teamByName("Kärpät"));
  yield call(hireManager, simonov, team.id);

  const teams: Team[] = yield select(
    allTeamsInCompetitions(["phl", "division", "mutasarja"])
  );

  const managers: ComputerManager[] = yield select(computerManagers);

  const playableTeamsWithoutManager = teams
    .filter(t => !t.manager)
    .map(t => t.id);
  const managersWithoutTeams = managers.filter(m => !m.team);

  const shuffledManagers = sortBy(
    () => random.real(1, 1000),
    managersWithoutTeams
  );

  const shuffledTeams = sortBy(
    () => random.real(1, 1000),
    playableTeamsWithoutManager
  );

  const pairs = zip<string, Manager>(shuffledTeams, shuffledManagers);

  yield all(
    pairs.map(pair => {
      return call(hireManager, pair[1], pair[0]);
    })
  );
}

export function* initializeManagers() {
  yield call(initializePlayableTeamsManagers);
  yield call(initializeRestOfTheManagers);
}

import {
  takeEvery,
  select,
  put,
  putResolve,
  call,
  all
} from "redux-saga/effects";
import { gameFacts } from "../services/game";
import competitionList from "../services/competitions";
import playerTypes from "../data/transfer-market";
import {
  managersTeam,
  managersTeamId,
  managersDifficulty,
  managerCompetesIn,
  managersArena,
  managerHasService,
  teamsMainCompetition,
  managersCurrentTeam,
  managerObject,
  teamById,
  managerById,
  requireManagersTeamObj,
  teamsContractedPlayers
} from "../services/selectors";
import { incrementMorale, incrementReadiness, incurPenalty } from "./team";
import { addNotification } from "./notification";
import crisis from "../data/crisis";
import difficultyLevels from "../services/difficulty-levels";
import arenas from "../data/arenas";
import { incrementStrength, decrementStrength } from "./team";
import { createId } from "../services/manager";
import uuid from "uuid";
import { Map } from "immutable";
import r from "../services/random";
import { addAnnouncement } from "./news";
import { amount as a } from "../services/format";
import { ManagerInput } from "../components/start-menu/ManagerForm";
import {
  Manager,
  HumanManager,
  ComputerManager,
  isHumanManager
} from "../types/manager";
import { DifficultyLevels, SeasonStrategies } from "../types/base";
import { ManagerAddManagerAction, MANAGER_ADD } from "../ducks/manager";
import { Team, TeamOrganization, Lineup } from "../types/team";
import {
  TeamRemoveManagerAction,
  TeamAddManagerAction,
  TEAM_REMOVE_MANAGER,
  TEAM_ADD_MANAGER,
  TeamSetStrategyAction,
  TEAM_SET_STRATEGY,
  TeamSetOrganizationAction,
  TEAM_SET_ORGANIZATION,
  TeamSetLineupAction,
  TEAM_SET_LINEUP
} from "../ducks/team";
import {
  repeat,
  sum,
  indexBy,
  range,
  over,
  lensProp,
  evolve,
  inc,
  values
} from "ramda";
import {
  createRandomPlayer,
  getBaseSalary,
  getRandomCountry,
  isForward,
  isDefenceman,
  normalizeAbility
} from "../services/player";
import { PlayerPosition, Player } from "../types/player";
import {
  PlayerCreatePlayerAction,
  PLAYER_CREATE_PLAYER
} from "../ducks/player";
import random from "../services/random";
import { AllCountries } from "../types/country";
import { PlayerGenerationInfo } from "../services/human-player-initializer";
import { generatePlayers } from "../services/human-team-initializer";
import lineupService from "../services/lineup";
import { isHumanControlledTeam } from "../services/team";
import strategyHandlers from "../services/strategies";

export function* automateLineup(managerId: string) {
  const manager: Manager = yield select(managerById(managerId));
  const team: Team = yield select(requireManagersTeamObj(manager.id));

  if (!isHumanControlledTeam(team)) {
    throw new Error("Team must be human controlled to automate lineups");
  }

  const players = yield select(teamsContractedPlayers(team.id));

  const lineup: Lineup = lineupService.automateLineup(players);

  yield put<TeamSetLineupAction>({
    type: TEAM_SET_LINEUP,
    payload: {
      team: team.id,
      lineup: lineup
    }
  });

  console.log("HELLUREI", lineup);
}

export function* setLineup(managerId: string, lineup: Lineup) {
  const manager: Manager = yield select(managerById(managerId));
  const team: Team = yield select(requireManagersTeamObj(manager.id));

  if (!isHumanControlledTeam(team)) {
    throw new Error("Team must be human controlled to set lineups");
  }

  yield put<TeamSetLineupAction>({
    type: TEAM_SET_LINEUP,
    payload: {
      team: team.id,
      lineup: lineup
    }
  });
}

export function* addManager(details: ManagerInput) {
  // const mainCompetition = yield select(teamsMainCompetition(details.team));

  const manager: HumanManager = {
    id: createId(details),
    name: details.name,
    difficultyLevel: parseInt(details.difficulty, 10) as DifficultyLevels,
    pranksExecuted: 0,
    balance: 0,
    isHuman: true,
    team: details.team,
    country: details.country,
    abilities: details.abilities
  };

  yield putResolve<ManagerAddManagerAction>({
    type: MANAGER_ADD,
    payload: manager
  });

  yield call(hireManager, manager, details.team);
}

export function* setActiveManager(managerId) {
  yield putResolve({
    type: "MANAGER_SET_ACTIVE",
    payload: managerId
  });
}

const assertTeam = (manager: Manager): string => {
  if (!manager.team) {
    throw new Error("Manager doesn't manage a team");
  }
  return manager.team;
};

export function* budgetOrganization(
  managerId: string,
  budget: TeamOrganization
) {
  const manager = yield select(managerObject(managerId));
  const team = assertTeam(manager);
  yield put<TeamSetOrganizationAction>({
    type: TEAM_SET_ORGANIZATION,
    payload: {
      team,
      organization: budget
    }
  });
}

export function* managerSelectStrategy(
  managerId: string,
  strategy: SeasonStrategies
) {
  const manager = yield select(managerObject(managerId));
  const team = assertTeam(manager);

  const strategyHandler = strategyHandlers[strategy];
  const readiness = strategyHandler.initialReadiness(manager);

  /*
  FOR xx = 1 TO 48
IF valm(xx) = 1 THEN tre(xx) = .945 ELSE IF valm(xx) = 2 THEN tre(xx) = 1.055 ELSE tre(xx) = 1
IF valm(xx) <> 3 THEN
tre(xx) = tre(xx) + (mtaito(1, man(xx)) * .007)
END IF
NEXT xx
*/

  yield put<TeamSetStrategyAction>({
    type: TEAM_SET_STRATEGY,
    payload: {
      team,
      strategy,
      readiness
    }
  });
}

export function* hireHumanManager(manager: HumanManager, team: Team) {
  console.log(team, "TEAM TO GENERATE");

  const players = generatePlayers(manager, team);

  yield put<PlayerCreatePlayerAction>({
    type: PLAYER_CREATE_PLAYER,
    payload: { players }
  });
}

export function* hireManager(manager: Manager, team: string) {
  const managersTeam: string | undefined = yield select(
    managersCurrentTeam(manager.id)
  );

  if (managersTeam) {
    yield putResolve<TeamRemoveManagerAction>({
      type: TEAM_REMOVE_MANAGER,
      payload: {
        team: managersTeam
      }
    });
  }

  yield putResolve<TeamAddManagerAction>({
    type: TEAM_ADD_MANAGER,
    payload: {
      team,
      manager: manager.id,
      isHuman: isHumanManager(manager)
    }
  });

  const teamObj: Team = yield select(teamById(team));

  if (isHumanManager(manager)) {
    yield call(hireHumanManager, manager, teamObj);
  }
}

export function* setBalance(managerId, amount) {
  return yield put({
    type: "MANAGER_SET_BALANCE",
    payload: {
      manager: managerId,
      amount
    }
  });
}

export function* renameArena(managerId, name) {
  return yield put({
    type: "MANAGER_RENAME_ARENA",
    payload: {
      manager: managerId,
      name
    }
  });
}

export function* incrementBalance(managerId: string, amount: number) {
  const manager = yield select(state =>
    state.manager.getIn(["managers", managerId])
  );
  if (!manager) {
    throw new Error("INVALID MANAGER");
  }

  return yield put({
    type: "MANAGER_INCREMENT_BALANCE",
    payload: {
      manager: managerId,
      amount
    }
  });
}

export function* decrementBalance(managerId, amount) {
  return yield call(incrementBalance, managerId, -amount);
}

export function* setExtra(manager, extra) {
  yield put({
    type: "MANAGER_SET_EXTRA",
    payload: {
      manager,
      extra
    }
  });
}

export function* setFlag(manager, flag, value) {
  yield put({
    type: "MANAGER_SET_FLAG",
    payload: {
      manager,
      flag,
      value
    }
  });
}

export function* crisisMeeting(action) {
  const { payload } = action;

  const difficulty = yield select(managersDifficulty(payload.manager));
  const team = yield select(managersTeam(payload.manager));
  const competitions = yield select(state => state.game.get("competitions"));

  const moraleBoost = difficultyLevels.getIn([difficulty, "moraleBoost"]);

  const crisisInfo = crisis(team, competitions);

  const moraleGain = crisisInfo.get("moraleGain") + moraleBoost;

  yield call(decrementBalance, payload.manager, crisisInfo.get("amount"));
  yield call(incrementMorale, team.get("id"), moraleGain);

  yield addNotification(
    payload.manager,
    `Psykologi valaa yhdessä managerin kanssa uskoa pelaajien mieliin. Moraali paranee (+${moraleGain}), ja joukkue keskittyy tuleviin haasteisiin uudella innolla!`
  );
}

export function* buyPlayer(action) {
  console.log("buy manager", action);

  const { payload } = action;

  const manager = yield select(state =>
    state.manager.getIn(["managers", payload.manager])
  );

  const playerType = playerTypes.get(payload.playerType);
  yield call(decrementBalance, manager.get("id"), playerType.get("buy"));

  const skillGain = playerType.get("skill")();
  yield call(incrementStrength, manager.get("team"), skillGain);

  yield call(
    addNotification,
    payload.manager,
    `Ostamasi pelaaja tuo ${skillGain} lisää voimaa joukkueeseen!`
  );
}

export function* setArenaLevel(manager, level) {
  yield put({
    type: "MANAGER_SET_ARENA_LEVEL",
    payload: {
      manager,
      level: Math.max(0, Math.min(9, level))
    }
  });
}

export function* improveArena(action) {
  const {
    payload: { manager }
  } = action;

  const currentArena = yield select(managersArena(manager));
  const nextArenaLevel = currentArena.get("level") + 1;

  const newArena = arenas.get(nextArenaLevel);

  yield decrementBalance(manager, newArena.get("price"));

  yield call(setArenaLevel, manager, newArena.get("id"));

  yield call(
    addNotification,
    manager,
    `Työmiehet käyttävät vallankumoukselllisia kvanttityövälineitä, ja rakennusurakka valmistuu alta aikayksikön!`
  );
}

export function* sellPlayer(action) {
  const {
    payload: { manager: managerId, playerType }
  } = action;

  console.log(managerId, playerType, "fihdh");

  const competesInPhl = yield select(managerCompetesIn(managerId, "phl"));

  const minStrength = competesInPhl ? 130 : 50;

  const team = yield select(managersTeam(managerId));

  if (team.get("strength") <= minStrength) {
    return yield call(
      addNotification,
      managerId,
      "Johtokunnan mielestä pelaajien myynti ei ole ratkaisu tämänhetkisiin ongelmiimme. Myyntilupa evätty.",
      "error"
    );
  }

  const playerDefinition = playerTypes.get(playerType);
  yield call(incrementBalance, managerId, playerDefinition.get("sell"));

  const skillGain = playerDefinition.get("skill")();
  yield call(decrementStrength, team.get("id"), skillGain);

  yield addNotification(
    managerId,
    `Myymäsi pelaaja vie ${skillGain} voimaa mukanaan!`
  );
}

export function* setInsuranceExtra(manager, value) {
  yield put({
    type: "MANAGER_SET_INSURANCE_EXTRA",
    payload: {
      manager,
      value
    }
  });
}

export function* incrementInsuranceExtra(manager, amount) {
  yield put({
    type: "MANAGER_INCREMENT_INSURANCE_EXTRA",
    payload: {
      manager,
      amount
    }
  });
}

export function* setService(manager, service, value) {
  yield put({
    type: "MANAGER_SET_SERVICE",
    payload: {
      manager,
      service,
      value
    }
  });
}

export function* toggleService(action) {
  const {
    payload: { manager, service }
  } = action;

  const currentService = yield select(managerHasService(manager, service));

  yield call(setService, manager, service, !currentService);
}

export function* afterGameday(competition, phase, groupId, round) {
  const managers = yield select(state => state.manager.get("managers"));

  const group = yield select(state =>
    state.game.getIn([
      "competitions",
      competition,
      "phases",
      phase,
      "groups",
      groupId
    ])
  );

  for (const [managerId, manager] of managers) {
    const managersIndex = group
      .get("teams")
      .findIndex(t => t === manager.get("team"));

    if (managersIndex === -1) {
      continue;
    }

    const game = group.getIn(["schedule", round]).find(pairing => {
      return pairing.includes(managersIndex);
    });

    if (!game) {
      continue;
    }

    if (!game.get("result")) {
      return;
    }

    const hasMicrophone = yield select(
      managerHasService(managerId, "microphone")
    );

    if (hasMicrophone) {
      if (["phl", "division"].includes(competition) && phase === 0) {
        const caught = r.bool(0.06);
        if (caught) {
          const amount = 50000;
          const pointDeduction = -4;
          yield all([
            call(
              addAnnouncement,
              managerId,
              `"Salainen" mikrofonisi vastustajan vaihtoaitiossa on paljastunut. Teidät tuomitaan __${a(
                amount
              )}__ pekan sakkoihin ja __${pointDeduction}__ pisteen menetykseen.`
            ),
            call(decrementBalance, managerId, amount),
            call(
              incurPenalty,
              competition,
              0,
              0,
              manager.get("team"),
              pointDeduction
            )
          ]);
        }
        /*
      - IF mikki = 1 AND sarja = 1 AND 100 \* RND < 6 THEN PRINT "Arh! Mikrofoni l”ytyy, ja saatte 50000 sakkoa ja 4 pisteen v„hennyksen!": p(u) = p(u) - 4: raha = raha - 50000
      */
      }
    }

    const facts = gameFacts(game, managersIndex);
    const team = yield select(managersTeamId(manager.get("id")));

    const amount = competitionList.getIn([competition, "gameBalance"])(
      phase,
      facts,
      manager
    );

    const moraleBoost = competitionList.getIn(
      [competition, "moraleBoost"],
      () => {
        console.log("MORALE BOOST MISSING", competition, phase);
        return 0;
      }
    )(phase, facts, manager);

    // console.log("MORALE BOOST", competition, phase, moraleBoost);

    const readinessBoost = competitionList.getIn(
      [competition, "readinessBoost"],
      () => {
        console.log("READINESS BOOST MISSING", competition, phase);
        return 0;
      }
    )(phase, facts, manager);

    // console.log("READINESS BOOST", competition, phase, readinessBoost);
    if (readinessBoost) {
      yield call(incrementReadiness, team, readinessBoost);
    }

    // const moraleBoost = getMoraleBoost(facts);

    if (moraleBoost) {
      yield call(incrementMorale, team, moraleBoost);
    }

    if (amount) {
      yield call(incrementBalance, manager.get("id"), amount);
    }
  }

  // console.log("äkshuun!", action);
}

export function* watchTransferMarket() {
  yield all([
    takeEvery("MANAGER_BUY_PLAYER", buyPlayer),
    takeEvery("MANAGER_SELL_PLAYER", sellPlayer)
  ]);
}

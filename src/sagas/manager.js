import {
  takeEvery,
  select,
  put,
  putResolve,
  call,
  all
} from "redux-saga/effects";
import { gameFacts } from "../services/game";
import competitionList from "../data/competitions";
import playerTypes from "../data/transfer-market";
import {
  managersTeam,
  managersTeamId,
  managersDifficulty,
  managerCompetesIn,
  managersArena,
  managerHasService
} from "../data/selectors";
import { incrementMorale } from "./team";
import { addNotification } from "./notification";
import crisis from "../data/crisis";
import difficultyLevels from "../data/difficulty-levels";
import arenas from "../data/arenas";
import { incrementStrength, decrementStrength } from "./team";

export function* hireManager(managerId, teamId) {
  const managersCurrentTeam = yield select(state =>
    state.manager.getIn(["managers", managerId, "team"])
  );

  // if (managersCurrentTeam) {
  yield all([
    putResolve({
      type: "TEAM_REMOVE_MANAGER",
      payload: {
        team: managersCurrentTeam
      }
    }),
    putResolve({
      type: "TEAM_ADD_MANAGER",
      payload: {
        team: teamId,
        manager: managerId
      }
    })
  ]);
  // }
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

export function* incrementBalance(managerId, amount) {
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

  for (const manager of managers) {
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

    const facts = gameFacts(game, managersIndex);

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

    console.log("MORALE BOOST", competition, phase, moraleBoost);

    // const moraleBoost = getMoraleBoost(facts);

    if (moraleBoost) {
      const team = yield select(managersTeamId(manager.get("id")));
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

import { put, call, select } from "redux-saga/effects";
import { ContractNegotiation } from "../types/player";
import uuid from "uuid";
import {
  PlayerContractInitiateAction,
  PLAYER_CONTRACT_INITIATE
} from "../ducks/player";
import { routerPush } from "./router";

import {
  denyBecauseBadOrganization,
  denyBecauseOfHarassment,
  acceptGrudgingly,
  acceptWithCaution,
  acceptGladly
} from "../services/contract";
import random from "../services/random";
import { Turn, MapOf } from "../types/base";
import {
  currentTurn,
  managerById,
  managersTeam,
  playerById,
  requireManagersTeamObj
} from "../services/selectors";
import { MHMState } from "../ducks";
import { values } from "ramda";
import { Team } from "../types/team";
import { Player } from "../types/player";

const organizationCheck = (player: Player, team: Team) => {
  const coachingAspect =
    player.position === "g" ? "goalieCoaching" : "coaching";

  const organizationValue =
    team.organization[coachingAspect] +
    team.organization.care +
    team.organization.benefits * 2;

  const playerOpinion = organizationValue - player.skill;

  if (playerOpinion <= -4) {
    return {
      respond: random.pick(denyBecauseBadOrganization),
      accept: false
    };
  }

  if (playerOpinion <= -2) {
    return {
      respond: random.pick(acceptGrudgingly),
      accept: true
    };
  }

  if (playerOpinion < 0) {
    return {
      respond: random.pick(acceptWithCaution),
      accept: true
    };
  }

  return {
    respond: random.pick(acceptGladly),
    accept: true
  };

  /*
IF neup.ppp = 1 THEN b = 2 ELSE b = 1
a = valb(b, pv) + valb(4, pv) + valb(5, pv) * 2 - neup.psk


IF a > 0 THEN a = 0

IF neup.spe < 30000 AND neup.spe <> 13 THEN
lax 50
PRINT
IF neup.neu = 1 THEN lentti 4, 2: pjn: GOTO warttina

IF yy = 1 THEN pel(xx, ote).neu = 1 ELSE bel(sortb(kurso)).neu = 1

IF a <= -4 THEN lentti 4, 1: pjn: GOTO warttina

IF a < -1 THEN lentti 4, 3 ELSE IF a < 0 THEN lentti 4, 4 ELSE lentti 4, 5

IF a < 0 THEN a = -a ELSE a = 0
*/
};

const denyNegotiationOffer = (
  respond: string,
  contract: Omit<ContractNegotiation, "respond" | "success" | "ongoing">
) => {
  return {
    ...contract,
    respond,
    ongoing: false,
    success: false
  };
};

const acceptNegotiationOffer = (
  respond: string,
  contract: Omit<ContractNegotiation, "respond" | "success" | "ongoing">
) => {
  return {
    ...contract,
    respond,
    ongoing: true,
    success: true
  };
};

const initialOffer = (
  manager,
  player,
  turn
): Omit<ContractNegotiation, "respond" | "success" | "ongoing"> => {
  return {
    id: uuid(),
    manager,
    player,
    turn,
    contract: {
      years: 1,
      salary: 1000,
      nhlOption: false,
      freeKickOption: false
    }
  };
};

export function* getInitialContractNegotiation(
  managerId: string,
  playerId: string
) {
  const turn: Turn = yield select(currentTurn);

  const raw = initialOffer(managerId, playerId, turn);

  const negotiations: MapOf<ContractNegotiation> = yield select(
    (state: MHMState) => state.player.negotiations
  );

  const previousNegotiation = values(negotiations).find(
    n =>
      n.player === playerId &&
      n.turn.season === turn.season &&
      n.turn.round === turn.round
  );

  if (previousNegotiation) {
    return denyNegotiationOffer(random.pick(denyBecauseOfHarassment), raw);
  }

  const team = yield select(requireManagersTeamObj(managerId));

  const player = yield select(playerById(playerId));

  const { respond, accept } = organizationCheck(player, team);

  if (!accept) {
    return denyNegotiationOffer(respond, raw);
  }

  return acceptNegotiationOffer(respond, raw);
}

export function* initiateContractNegotiation(
  managerId: string,
  playerId: string
) {
  const negotiation = yield call(
    getInitialContractNegotiation,
    managerId,
    playerId
  );

  yield put<PlayerContractInitiateAction>({
    type: PLAYER_CONTRACT_INITIATE,
    payload: {
      negotiation
    }
  });

  yield call(routerPush, `/sopimusneuvottelu/${negotiation.id}`);
}

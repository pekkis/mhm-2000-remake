import { put, call, select } from "redux-saga/effects";
import { ContractNegotiation, Contract } from "../types/player";
import { v4 as uuid } from "uuid";
import {
  PlayerContractInitiateAction,
  PLAYER_CONTRACT_INITIATE,
  PlayerContractRespondAction,
  PLAYER_CONTRACT_RESPOND,
  PLAYER_CONTRACT_SIGN,
  PlayerContractSignAction,
  PlayerContractEndAction,
  PLAYER_CONTRACT_END
} from "../ducks/player";
import { routerPush } from "./router";

import {
  denyProposalBecauseBadOrganization,
  denyProposalBecauseOfHarassment,
  acceptProposalGrudgingly,
  acceptProposalWithCaution,
  acceptProposalGladly,
  acceptContractGladly,
  acceptContractGrudgingly,
  denyContractBecauseInsulted,
  denyContractBecauseEndOfPatience,
  denyContractButContinueNegotiations,
  informManagerOfNHLAmbitions,
  readyToNegotiate,
  commentFreeKickOption
} from "../services/contract";
import random from "../services/random";
import { Turn, MapOf } from "../types/base";
import {
  selectCurrentTurn,
  managerById,
  managersTeam,
  playerById,
  requireManagersTeamObj
} from "../services/selectors";
import { MHMState } from "../ducks";
import { values } from "ramda";
import { Team } from "../types/team";
import { Player } from "../types/player";
import { Manager } from "../types/manager";
import {
  getInterestInNHL,
  getBaseSalary,
  getDesiredSalary
} from "../services/player";

const getOrganizationOpionion = (player: Player, team: Team) => {
  const coachingAspect =
    player.position === "g" ? "goalieCoaching" : "coaching";

  const organizationValue =
    team.organization[coachingAspect] +
    team.organization.care +
    team.organization.benefits * 2;

  const playerOpinion = organizationValue - player.skill;

  return playerOpinion;
};

const organizationCheck = (player: Player, team: Team, manager: Manager) => {
  const organizationOpinion = getOrganizationOpionion(player, team);

  const patience =
    85 +
    Math.min(organizationOpinion, 0) * 10 +
    manager.abilities.negotiation * 5;

  if (organizationOpinion <= -4) {
    return {
      patience,
      respond: random.pick(denyProposalBecauseBadOrganization),
      accept: false
    };
  }

  if (organizationOpinion <= -2) {
    return {
      patience,
      respond: random.pick(acceptProposalGrudgingly),
      accept: true
    };
  }

  if (organizationOpinion < 0) {
    return {
      patience,
      respond: random.pick(acceptProposalWithCaution),
      accept: true
    };
  }

  return {
    patience,
    respond: random.pick(acceptProposalGladly),
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

type PartialContract = Omit<
  ContractNegotiation,
  "respond" | "success" | "ongoing" | "patience"
>;

const denyNegotiationOffer = (
  respond: string[],
  patience: number,
  contract: PartialContract
): ContractNegotiation => {
  return {
    ...contract,
    patience,
    respond,
    ongoing: false,
    success: false
  };
};

const acceptNegotiationOffer = (
  respond: string[],
  patience: number,
  contract: PartialContract
): ContractNegotiation => {
  return {
    ...contract,
    patience,
    respond,
    ongoing: true,
    success: true
  };
};

const initialOffer = (
  manager: Manager,
  player: Player,
  team: Team,
  turn: Turn,
  context: string
): PartialContract => {
  return {
    id: uuid(),
    context,
    open: true,
    manager: manager.id,
    proposalsMade: 0,
    player: player.id,
    organizationOpinion: getOrganizationOpionion(player, team),
    turn,
    contract: {
      years: 1,
      yearsLeft: 1,
      team: team.id,
      salary: getBaseSalary(player),
      nhlOption: false,
      freeKickOption: false
    }
  };
};

export function* getInitialContractNegotiation(
  managerId: string,
  playerId: string,
  context: string
) {
  const turn: Turn = yield select(selectCurrentTurn);

  const manager: Manager = yield select(managerById(managerId));
  const team = yield select(requireManagersTeamObj(managerId));
  const player = yield select(playerById(playerId));

  const raw = initialOffer(manager, player, team, turn, context);

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
    return denyNegotiationOffer(
      [random.pick(denyProposalBecauseOfHarassment)],
      0,
      raw
    );
  }

  const { respond, patience, accept } = organizationCheck(
    player,
    team,
    manager
  );

  if (!accept) {
    return denyNegotiationOffer([respond], patience, raw);
  }

  const isInterestedInNHL = getInterestInNHL(player) > 0;
  const responds = isInterestedInNHL
    ? [
        respond,
        random.pick(informManagerOfNHLAmbitions),
        random.pick(readyToNegotiate)
      ]
    : [respond, random.pick(readyToNegotiate)];

  return acceptNegotiationOffer(responds, patience, raw);
}

export function* initiateContractNegotiation(
  managerId: string,
  playerId: string,
  context = "playerPage"
) {
  const negotiation = yield call(
    getInitialContractNegotiation,
    managerId,
    playerId,
    context
  );

  yield put<PlayerContractInitiateAction>({
    type: PLAYER_CONTRACT_INITIATE,
    payload: {
      negotiation
    }
  });

  yield call(routerPush, `/sopimusneuvottelu/${negotiation.id}`);
}

const acceptContract = (negotiation: ContractNegotiation, respond: string) => {
  return {
    ...negotiation,
    ongoing: false,
    success: true,
    proposalsMade: negotiation.proposalsMade + negotiation.proposalsMade + 1,
    respond: [...negotiation.respond, respond]
  };
};

const denyContractAndContinue = (
  negotiation: ContractNegotiation,
  patience: number,
  respond: string[]
) => {
  return {
    ...negotiation,
    patience,
    ongoing: true,
    success: false,
    proposalsMade: negotiation.proposalsMade + negotiation.proposalsMade + 1,
    respond: [...negotiation.respond, ...respond]
  };
};

const denyContractAndEnd = (
  negotiation: ContractNegotiation,
  patience: number,
  respond: string
) => {
  return {
    ...negotiation,
    patience,
    ongoing: false,
    success: false,
    proposalsMade: negotiation.proposalsMade + negotiation.proposalsMade + 1,
    respond: [...negotiation.respond, respond]
  };
};

const denyContract = (negotiation: ContractNegotiation, patience: number) => {
  if (patience < 30) {
    return denyContractAndEnd(
      negotiation,
      patience,
      random.pick(denyContractBecauseInsulted)
    );
  }

  if (patience < 50) {
    return denyContractAndEnd(
      negotiation,
      patience,
      random.pick(denyContractBecauseEndOfPatience)
    );
  }

  const responds = negotiation.contract.freeKickOption
    ? [
        random.pick(commentFreeKickOption),
        random.pick(denyContractButContinueNegotiations)
      ]
    : [random.pick(denyContractButContinueNegotiations)];

  return denyContractAndContinue(negotiation, patience, responds);
};

// sopimus(2) = sopimus(2) - d + INT(mtaito(3, u(pv)) * RND)

export function* contractSign(negotiationId: string) {
  const negotiation: ContractNegotiation = yield select(
    (state: MHMState) => state.player.negotiations[negotiationId]
  );

  yield put<PlayerContractSignAction>({
    type: PLAYER_CONTRACT_SIGN,
    payload: {
      playerId: negotiation.player,
      contract: negotiation.contract
    }
  });

  yield call(contractEndNegotiation, negotiationId);
}

export function* contractEndNegotiation(negotiationId: string) {
  console.log("HELLUREI");
  const negotiation: ContractNegotiation = yield select(
    (state: MHMState) => state.player.negotiations[negotiationId]
  );

  console.log("RETURN TO CONTEXT", negotiation.context);

  if (negotiation.context === "transferMarket") {
    yield call(routerPush, "/pelaajamarkkinat");
  }

  yield put<PlayerContractEndAction>({
    type: PLAYER_CONTRACT_END,
    payload: {
      negotiationId: negotiation.id
    }
  });
}

export function* contractNegotiationProposal(
  negotiationId: string,
  contract: Contract
) {
  const oldNegotiation: ContractNegotiation = yield select(
    (state: MHMState) => state.player.negotiations[negotiationId]
  );

  const currentNegotiation = {
    ...oldNegotiation,
    contract: contract
  };

  const manager: Manager = yield select(
    managerById(currentNegotiation.manager)
  );
  const team: Team = yield select(requireManagersTeamObj(manager.id));
  const player: Player = yield select(playerById(currentNegotiation.player));

  const desiredSalary = getDesiredSalary(player, currentNegotiation);
  console.log(desiredSalary, "DS");

  const difference = contract.salary / desiredSalary;
  const acceptLimit =
    manager.abilities.negotiation * 5 +
    50 -
    (100 - Math.pow(difference, 3) * 100);

  const acceptRand = random.real(0, 100);

  let nextNegotiation;
  if (acceptRand < acceptLimit) {
    const respond =
      acceptLimit - acceptRand >= 50
        ? random.pick(acceptContractGladly)
        : random.pick(acceptContractGrudgingly);

    nextNegotiation = acceptContract(currentNegotiation, respond);
  } else {
    let nextPatience;
    if (acceptLimit < -10) {
      nextPatience = 0;
    } else {
      const patienceDecrement = (currentNegotiation.proposalsMade + 1) * 2;
      const managerPatienceAlterer =
        random.real(0, 1) * manager.abilities.negotiation;

      nextPatience =
        currentNegotiation.patience -
        patienceDecrement +
        managerPatienceAlterer;
    }

    nextNegotiation = denyContract(currentNegotiation, nextPatience);
  }

  yield put<PlayerContractRespondAction>({
    type: PLAYER_CONTRACT_RESPOND,
    payload: {
      negotiation: nextNegotiation
    }
  });
}

import { nth } from "ramda";
import {
  all,
  call,
  cancel,
  select,
  take,
  takeLeading
} from "redux-saga/effects";
import {
  GameAdvanceRequestAction,
  GAME_ADVANCE_REQUEST
} from "../../ducks/game";
import {
  ManagerBudgetOrganizationAction,
  ManagerLineupAutomateAction,
  ManagerLineupSetAction,
  ManagerSelectIntensityAction,
  ManagerSelectStrategyAction,
  ManagerSponsorNegotiateAction,
  ManagerSponsorSetRequirementAction,
  MANAGER_BUDGET_ORGANIZATION,
  MANAGER_LINEUP_AUTOMATE,
  MANAGER_LINEUP_SET,
  MANAGER_SELECT_INTENSITY,
  MANAGER_SELECT_STRATEGY,
  MANAGER_SPONSOR_NEGOTIATE,
  MANAGER_SPONSOR_SET_REQUIREMENT
} from "../../ducks/manager";
import {
  PlayerContractEndRequestAction,
  PlayerContractInitiateRequestAction,
  PlayerContractProposeAction,
  PlayerContractSignRequestAction,
  PLAYER_CONTRACT_END_REQUEST,
  PLAYER_CONTRACT_INITIATE_REQUEST,
  PLAYER_CONTRACT_PROPOSE,
  PLAYER_CONTRACT_SIGN_REQUEST
} from "../../ducks/player";
import { humanManagers } from "../../services/selectors";
import { HumanManager } from "../../types/manager";
import aiActionPhase from "../ai/phase/action";
import { gameSave, setPhase } from "../game";
import {
  automateLineup,
  budgetOrganization,
  managerSelectStrategy,
  selectIntensity,
  setActiveManager,
  setLineup,
  setSponsorshipProposalRequirement,
  negotiateSponsorshipProposal
} from "../manager";
import {
  contractEndNegotiation,
  contractNegotiationProposal,
  contractSign,
  initiateContractNegotiation
} from "../player";

export default function* actionPhase() {
  const managers: HumanManager[] = yield select(humanManagers);

  const manager = nth(0, managers);
  if (!manager) {
    throw new Error("There is no manager");
  }
  yield call(setActiveManager, manager.id);
  yield call(setPhase, "action");

  const tasks = yield all([
    takeLeading<ManagerSelectStrategyAction>(MANAGER_SELECT_STRATEGY, function*(
      a
    ) {
      yield call(managerSelectStrategy, a.payload.manager, a.payload.strategy);
    }),

    takeLeading<ManagerLineupAutomateAction>(MANAGER_LINEUP_AUTOMATE, function*(
      a
    ) {
      yield call(automateLineup, a.payload.manager);
    }),

    takeLeading<ManagerLineupSetAction>(MANAGER_LINEUP_SET, function*(a) {
      yield call(setLineup, a.payload.manager, a.payload.lineup);
    }),

    takeLeading<ManagerBudgetOrganizationAction>(
      MANAGER_BUDGET_ORGANIZATION,
      function*(a) {
        yield call(budgetOrganization, a.payload.manager, a.payload.budget);
      }
    ),

    takeLeading<PlayerContractInitiateRequestAction>(
      PLAYER_CONTRACT_INITIATE_REQUEST,
      function*(a) {
        yield call(
          initiateContractNegotiation,
          a.payload.manager,
          a.payload.player,
          a.payload.context
        );
      }
    ),

    takeLeading<PlayerContractProposeAction>(PLAYER_CONTRACT_PROPOSE, function*(
      a
    ) {
      yield call(
        contractNegotiationProposal,
        a.payload.negotiationId,
        a.payload.contract
      );
    }),

    takeLeading<PlayerContractSignRequestAction>(
      PLAYER_CONTRACT_SIGN_REQUEST,
      function*(a) {
        yield call(contractSign, a.payload.negotiationId);
      }
    ),

    takeLeading<PlayerContractEndRequestAction>(
      PLAYER_CONTRACT_END_REQUEST,
      function*(a) {
        yield call(contractEndNegotiation, a.payload.negotiationId);
      }
    ),

    takeLeading<ManagerSelectIntensityAction>(
      MANAGER_SELECT_INTENSITY,
      function*(a) {
        yield call(selectIntensity, a.payload.manager, a.payload.intensity);
      }
    ),

    takeLeading<ManagerSponsorSetRequirementAction>(
      MANAGER_SPONSOR_SET_REQUIREMENT,
      function*(a) {
        yield call(
          setSponsorshipProposalRequirement,
          a.payload.manager,
          a.payload.proposalId,
          a.payload.requirement,
          a.payload.value
        );
      }
    ),

    takeLeading<ManagerSponsorNegotiateAction>(
      MANAGER_SPONSOR_NEGOTIATE,
      function*(a) {
        yield call(
          negotiateSponsorshipProposal,
          a.payload.manager,
          a.payload.proposalId
        );
      }
    ),

    takeLeading("GAME_SAVE_REQUEST", gameSave)
    /*
    takeEvery("MANAGER_TOGGLE_SERVICE", toggleService)
    fork(watchTransferMarket),
    takeEvery("MANAGER_CRISIS_MEETING", crisisMeeting),
    takeEvery("MANAGER_IMPROVE_ARENA", improveArena),


    takeEvery("PRANK_ORDER", orderPrank),
    takeEvery(INVITATION_ACCEPT_REQUEST, function*(action) {
      yield call(acceptInvitation, action.payload.manager, action.payload.id);
    }),
    takeEvery(BETTING_BET_REQUEST, function*(action) {
      const {
        payload: { manager, coupon, amount }
      } = action;
      yield call(bet, manager, coupon, amount);
    })
    */
  ]);

  yield take<GameAdvanceRequestAction>(GAME_ADVANCE_REQUEST);
  yield call(aiActionPhase);

  yield cancel(tasks);
}

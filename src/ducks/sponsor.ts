import { MapOf } from "../types/base";
import { SponsorshipDeal, SponsorshipProposal } from "../types/sponsor";
import {
  GameLoadStateAction,
  GameQuitToMainMenuAction,
  GAME_LOAD_STATE,
  GAME_QUIT_TO_MAIN_MENU
} from "./game";
import { addToMapFromList } from "./operations";
import { over, mergeLeft, lensPath, assocPath } from "ramda";

export interface SponsorState {
  deals: MapOf<SponsorshipDeal>;
  proposals: MapOf<SponsorshipProposal>;
}

const defaultState: SponsorState = {
  deals: {},
  proposals: {}
};

export const SPONSOR_CREATE_PROPOSALS = "SPONSOR_CREATE_PROPOSALS";
export const SPONSOR_UPDATE_PROPOSAL = "SPONSOR_ALTER_PROPOSAL";
export const SPONSOR_CREATE_DEAL = "SPONSOR_CREATE_DEAL";

export interface SponsorCreateProposalsAction {
  type: typeof SPONSOR_CREATE_PROPOSALS;
  payload: { proposals: SponsorshipProposal[] };
}

export interface SponsorCreateDealAction {
  type: typeof SPONSOR_CREATE_DEAL;
  payload: { deal: SponsorshipDeal };
}

export interface SponsorUpdateProposalAction {
  type: typeof SPONSOR_UPDATE_PROPOSAL;
  payload: { id: string; proposal: Partial<SponsorshipProposal> };
}

export interface SponsorUpdateProposalAction {
  type: typeof SPONSOR_UPDATE_PROPOSAL;
  payload: {
    id: string;
    proposal: Partial<SponsorshipProposal>;
  };
}

type SponsorActions =
  | GameLoadStateAction
  | GameQuitToMainMenuAction
  | SponsorCreateProposalsAction
  | SponsorUpdateProposalAction
  | SponsorCreateDealAction;

const sponsorReducer = (
  state: SponsorState = defaultState,
  action: SponsorActions
): SponsorState => {
  switch (action.type) {
    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case GAME_LOAD_STATE:
      return action.payload.sponsor;

    case SPONSOR_CREATE_PROPOSALS:
      return addToMapFromList(["proposals"], action.payload.proposals, state);

    case SPONSOR_UPDATE_PROPOSAL:
      return over(
        lensPath(["proposals", action.payload.id]),
        mergeLeft(action.payload.proposal),
        state
      );

    case SPONSOR_CREATE_DEAL:
      return assocPath(
        ["deals", action.payload.deal.id],
        action.payload.deal,
        state
      );

    default:
      return state;
  }
};

export default sponsorReducer;

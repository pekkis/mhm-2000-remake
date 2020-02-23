import { MapOf } from "../types/base";
import { SponsorshipDeal, SponsorshipProposal } from "../types/sponsor";
import {
  GameLoadStateAction,
  GameQuitToMainMenuAction,
  GAME_LOAD_STATE,
  GAME_QUIT_TO_MAIN_MENU
} from "./game";
import { addToMapFromList } from "./operations";

export interface SponsorState {
  deals: MapOf<SponsorshipDeal>;
  proposals: MapOf<SponsorshipProposal>;
}

const defaultState: SponsorState = {
  deals: {},
  proposals: {}
};

export const SPONSOR_CREATE_PROPOSALS = "SPONSOR_CREATE_PROPOSALS";

export interface SponsorCreateProposalsAction {
  type: typeof SPONSOR_CREATE_PROPOSALS;
  payload: { proposals: SponsorshipProposal[] };
}

type SponsorActions =
  | GameLoadStateAction
  | GameQuitToMainMenuAction
  | SponsorCreateProposalsAction;

const sponsorReducer = (
  state: SponsorState = defaultState,
  action: SponsorActions
) => {
  switch (action.type) {
    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case GAME_LOAD_STATE:
      return action.payload.team;

    case SPONSOR_CREATE_PROPOSALS:
      return addToMapFromList(["proposals"], action.payload.proposals, state);

    default:
      return state;
  }
};

export default sponsorReducer;

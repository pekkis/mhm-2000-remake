import { v4 as uuid } from "uuid";
import { Invitation } from "../types/base";

import {
  GAME_SEASON_START,
  GAME_DECREMENT_DURATIONS,
  GAME_CLEAR_EXPIRED,
  GAME_QUIT_TO_MAIN_MENU,
  GAME_LOAD_STATE
} from "./game";
import { assoc, over, lensProp, reject, map, evolve, dec } from "ramda";

export interface InvitationState {
  invitations: Invitation[];
}

const defaultState: InvitationState = {
  invitations: []
};

export const INVITATION_ACCEPT_REQUEST = "INVITATION_ACCEPT_REQUEST";
export const INVITATION_ADD = "INVITATION_ADD_INVITATION";
export const INVITATION_ACCEPT = "INVITATION_ACCEPT";
export const INVITATION_CLEAR = "INVITATION_CLEAR";

export const acceptInvitation = (manager, id) => {
  return {
    type: INVITATION_ACCEPT_REQUEST,
    payload: {
      manager,
      id
    }
  };
};

export default function invitationReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case GAME_LOAD_STATE:
      return payload.invitation;

    case INVITATION_ADD:
      return state.update("invitations", (invitations) =>
        invitations.push(Map(payload).set("id", uuid()))
      );

    case INVITATION_ACCEPT:
      return state.update("invitations", (invitations) => {
        return invitations
          .update(
            invitations.findIndex(
              (i) =>
                i.get("manager") === payload.manager &&
                i.get("id") === payload.id
            ),
            (invitation) => {
              return invitation.set("participate", true);
            }
          )
          .filter((i) => {
            return i.get("manager") !== payload.manager || i.get("participate");
          });
      });
    case GAME_SEASON_START:
      return assoc("invitations", [], state);

    case GAME_DECREMENT_DURATIONS:
      return over(
        lensProp("invitations"),
        map<Invitation, Invitation>((i) => {
          if (i.participate) {
            return i;
          }
          return evolve(
            {
              duration: dec
            },
            i
          );
        }),
        state
      );

    case GAME_CLEAR_EXPIRED:
      return over(
        lensProp("invitations"),
        reject<Invitation>((i) => i.participate || i.duration === 0),
        state
      );

    default:
      return state;
  }
}

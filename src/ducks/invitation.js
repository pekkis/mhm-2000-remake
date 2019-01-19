import { Map, List } from "immutable";
import uuid from "uuid";

const defaultState = Map({
  invitations: List()
});

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
    case "META_QUIT_TO_MAIN_MENU":
      return defaultState;

    case "META_GAME_LOAD_STATE":
      return payload.invitation;

    case INVITATION_ADD:
      return state.update("invitations", invitations =>
        invitations.push(Map(payload).set("id", uuid()))
      );

    case INVITATION_ACCEPT:
      console.log(action, "HAERIEWWFE");
      return state.update("invitations", invitations => {
        return invitations
          .update(
            invitations.findIndex(
              i =>
                i.get("manager") === payload.manager &&
                i.get("id") === payload.id
            ),
            invitation => {
              return invitation.set("participate", true);
            }
          )
          .filter(i => {
            return i.get("manager") !== payload.manager || i.get("participate");
          });
      });
    case INVITATION_CLEAR:
      return state.set("invitations", List());

    default:
      return state;
  }
}

import { Map, List } from "immutable";

const defaultState = Map({
  invitations: List()
});

export const INVITATION_ADD = "INVITATION_ADD_INVITATION";
export const INVITATION_ANSWER = "INVITATION_ANSWER";
export const INVITATION_CLEAR = "INVITATION_CLEAR";

export default function invitationReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case "META_QUIT_TO_MAIN_MENU":
      return defaultState;

    case "META_GAME_LOAD_STATE":
      return payload.invitation;

    case INVITATION_ADD:
      return state.update("invitations", invitations =>
        invitations.push(Map(payload))
      );

    case INVITATION_ANSWER:
      return state.updateIn(["invitations", payload.invitation], i =>
        i.merge({ participate: true })
      );

    case INVITATION_CLEAR:
      return state.set("invitations", List());

    default:
      return state;
  }
}

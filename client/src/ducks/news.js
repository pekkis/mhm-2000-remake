import { Map, List, fromJS } from "immutable";

const defaultState = Map({
  news: List()
});

export default function newsReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case "META_QUIT_TO_MAIN_MENU":
      return defaultState;

    case "META_GAME_LOAD_STATE":
      return fromJS(payload.news);

    case "NEWS_ADD":
      return state.update("news", news => news.push(payload));

    case "NEWS_CLEAR":
      return state.set("news", List());

    default:
      return state;
  }
}

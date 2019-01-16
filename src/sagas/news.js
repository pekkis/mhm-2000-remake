import { put } from "redux-saga/effects";

import { NEWS_ANNOUNCEMENT_ADD } from "../ducks/news";

export function* addAnnouncement(manager, announcement) {
  yield put({
    type: NEWS_ANNOUNCEMENT_ADD,
    payload: {
      manager,
      announcement
    }
  });
}

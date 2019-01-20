import { put } from "redux-saga/effects";

import { NEWS_ANNOUNCEMENT_ADD, NEWS_ADD } from "../ducks/news";

export function* addAnnouncement(manager, announcement) {
  yield put({
    type: NEWS_ANNOUNCEMENT_ADD,
    payload: {
      manager: manager.toString(),
      announcement
    }
  });
}

export function* addNews(news) {
  yield put({
    type: NEWS_ADD,
    payload: news
  });
}

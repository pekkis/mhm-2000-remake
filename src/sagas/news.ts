import { put } from "redux-saga/effects";

import { NEWS_ANNOUNCEMENT_ADD, NEWS_ADD } from "../ducks/news";

export function* addAnnouncement(manager: string, announcement: string) {
  yield put({
    type: NEWS_ANNOUNCEMENT_ADD,
    payload: {
      manager: manager.toString(),
      announcement
    }
  });
}

export function* addNews(news: string) {
  yield put({
    type: NEWS_ADD,
    payload: news
  });
}

import { select, call, put, take, takeEvery, cancel } from "redux-saga/effects";
import events from "../../data/events";
import r from "../../services/random";
import { resolveEvent, processEvents } from "../event";
import { OrderedMap, List } from "immutable";

// TODO:
/*
IF kr > 15 AND sarja = 1 AND s(u) < 5 AND s(z) < 5 THEN GOSUB sat68
*/

// DONE
/*

sat = CINT(335 * RND) + 1

IF sat = 300 THEN GOSUB sat1
IF sat = 1 OR sat = 2 THEN GOSUB sat2
IF sat = 56 OR sat = 57 OR sat = 174 THEN GOSUB sat3
IF sat = 79 OR sat = 144 THEN GOSUB sat4
IF sat = 122 OR sat = 178 THEN GOSUB sat5
IF sat = 5 OR sat = 38 THEN GOSUB sat6
IF sat = 66 OR sat = 44 THEN GOSUB sat7
IF sat = 294 OR sat = 58 THEN GOSUB sat8
IF sat = 14 OR sat = 25 THEN GOSUB sat9
IF sat = 83 OR sat = 84 THEN GOSUB sat10
IF sat = 105 OR sat = 298 THEN GOSUB sat11
IF sat = 274 OR sat = 218 THEN GOSUB sat12
IF sat = 4 OR sat = 233 THEN GOSUB sat13
IF sat = 17 OR sat = 156 THEN GOSUB sat14
IF sat = 123 OR sat = 213 THEN GOSUB sat15
IF sat = 81 OR sat = 293 THEN GOSUB sat16
IF sat = 47 OR sat = 77 THEN GOSUB sat17
IF sat = 166 OR sat = 299 THEN GOSUB sat18
IF sat = 96 OR sat = 69 THEN GOSUB sat19
IF sat = 100 OR sat = 200 THEN GOSUB sat20
IF sat = 301 OR sat = 138 THEN GOSUB sat21
IF sat = 146 THEN GOSUB sat22
IF sat = 111 OR sat = 43 THEN GOSUB sat23
IF sat = 306 OR sat = 307 THEN GOSUB sat24
IF sat = 303 OR sat = 320 THEN GOSUB sat25
IF sat = 249 OR sat = 182 THEN GOSUB sat26
IF sat = 6 OR sat = 65 THEN GOSUB sat27
IF sat = 172 OR sat = 239 THEN GOSUB sat28

*/

const eventsMap = OrderedMap(
  List.of(
    [1, "jaralahti"],
    [2, "jaralahti"],
    [300, "mauto"],
    [294, "pirka"],
    [58, "pirka"],
    [122, "kasino"],
    [178, "kasino"],
    [56, "kuralahti"],
    [57, "kuralahti"],
    [174, "kuralahti"],
    [79, "russianAgent"],
    [144, "russianAgent"],
    [5, "taxEvasion"],
    [38, "taxEvasion"],
    [66, "suddenDeath"],
    [44, "suddenDeath"],
    [14, "ralliala"],
    [25, "ralliala"],
    [83, "concert"],
    [84, "concert"],
    [105, "swedenTransfer"],
    [298, "swedenTransfer"],
    [274, "jarko"],
    [218, "jarko"],
    [4, "moreTaxes"],
    [233, "moreTaxes"],
    [17, "cleandrug"],
    [156, "cleandrug"],
    [123, "fortuneTeller"],
    [213, "fortuneTeller"],

    [81, "voodoo"],
    [293, "voodoo"],
    [47, "stalking"],
    [77, "stalking"],

    [166, "fanMerchandise"],
    [299, "fanMerchandise"],
    [96, "embezzlement"],
    [69, "embezzlement"],
    [100, "masotv"],
    [200, "masotv"],

    [301, "jobofferPHL"],
    [138, "jobofferPHL"],
    [146, "undqvist"],
    [111, "jobofferDivision"],
    [43, "jobofferDivision"],

    [306, "fever"],
    [307, "fever"],

    [303, "haanperaMarries"],
    [320, "haanperaMarries"],
    [249, "haanperaDivorce"],
    [182, "haanperaDivorce"],
    [6, "pempers"],
    [65, "pempers"],
    [172, "limpenius"],
    [239, "limpenius"],

    [319, "hasselgren"],
    [280, "hasselgren"],

    [150, "arilander"],
    [240, "arilander"],

    [30, "karijurri"],
    [70, "karijurri"],

    [90, "metterer"],
    [190, "metterer"]
  )
);

/*


IF sat = 319 OR sat = 280 THEN GOSUB sat29
IF sat = 150 OR sat = 240 THEN GOSUB sat30
IF sat = 30 OR sat = 70 THEN GOSUB sat31
IF sat = 90 OR sat = 190 THEN GOSUB sat32

IF sat = 39 THEN GOSUB sat33
IF sat = 115 THEN GOSUB sat34
IF sat = 183 THEN GOSUB sat35
IF sat = 24 THEN GOSUB sat36
IF sat = 61 THEN GOSUB sat37
IF sat = 310 THEN GOSUB sat38
IF sat = 311 THEN GOSUB sat39
IF sat = 312 THEN GOSUB sat40
IF sat = 313 THEN GOSUB sat42
IF sat = 314 OR sat = 208 THEN GOSUB sat41
IF sat = 53 OR sat = 252 THEN GOSUB sat43
IF sat = 74 OR sat = 107 THEN GOSUB sat44
IF sat = 147 OR sat = 318 THEN GOSUB sat45
IF sat = 203 OR sat = 204 THEN GOSUB sat46
IF sat = 185 OR sat = 245 THEN GOSUB sat47
IF sat = 135 OR sat = 215 THEN GOSUB sat48
IF sat = 45 OR sat = 55 THEN GOSUB sat49
IF sat = 127 OR sat = 272 THEN GOSUB sat50
IF sat = 54 THEN GOSUB sat51
IF sat = 285 THEN GOSUB sat52
IF sat = 263 THEN GOSUB sat53
IF sat = 317 THEN GOSUB sat54
IF sat = 126 THEN GOSUB sat55
IF sat = 218 THEN GOSUB sat56
IF sat = 277 THEN GOSUB sat57
IF sat = 267 THEN GOSUB sat58
IF sat = 106 THEN GOSUB sat59
IF sat = 268 THEN GOSUB sat60
IF sat = 321 THEN GOSUB sat61
IF sat = 328 THEN GOSUB sat63
IF sat = 322 THEN GOSUB sat64
IF sat = 323 THEN GOSUB sat65
IF sat = 324 THEN GOSUB sat66
IF sat = 325 THEN GOSUB sat67
IF sat = 326 THEN GOSUB sat69
IF sat = 327 THEN GOSUB sat70
IF sat = 279 THEN GOSUB sat71
IF sat = 334 OR sat = 335 THEN GOSUB sat72
IF sat = 331 OR sat = 206 THEN GOSUB sat73
IF sat = 332 OR sat = 102 THEN GOSUB sat74
IF sat = 333 OR sat = 175 THEN GOSUB sat75
IF sat = 209 THEN GOSUB sat76
IF sat = 177 THEN GOSUB sat77
IF sat = 224 THEN GOSUB sat78
IF sat = 136 THEN GOSUB sat79
IF sat = 305 THEN GOSUB sat80
IF sat = 221 THEN GOSUB sat81
IF sat = 244 THEN GOSUB sat82
IF sat = 241 THEN GOSUB sat83
IF sat = 222 THEN GOSUB sat84
IF sat = 235 THEN GOSUB sat85
IF sat = 210 THEN GOSUB sat86
IF sat = 179 THEN GOSUB sat87
IF sat = 114 THEN GOSUB sat88
IF sat = 137 THEN GOSUB sat89
IF sat = 168 THEN GOSUB sat90
IF sat = 110 THEN GOSUB sat91
IF sat = 262 THEN GOSUB sat92
IF sat = 124 THEN GOSUB sat93
IF sat = 234 THEN GOSUB sat94
*/

const getEventId = hardcoded => {
  const eventNumber = r.integer(1, 335);
  const eventId = eventsMap.get(eventNumber);
  return eventId;
};

export default function* eventPhase() {
  yield put({
    type: "GAME_SET_PHASE",
    payload: "event"
  });

  yield put({
    type: "UI_DISABLE_ADVANCE"
  });

  const manager = 0;

  // const key = eventsMap.last();

  const eventId = "metterer"; // getEventId();

  if (eventId) {
    yield call(events.get(eventId).create, { manager });
  }

  const autoresolveEvents = yield select(state =>
    state.event
      .get("events")
      .filterNot(e => e.get("resolved"))
      .filter(e => e.get("autoResolve"))
  );

  for (const [eventId, event] of autoresolveEvents) {
    const eventObj = events.get(event.get("eventId"));
    yield eventObj.resolve(event);
  }

  const resolver = yield takeEvery("EVENT_RESOLVE_REQUEST", resolveEvent);

  let unresolved;
  do {
    unresolved = yield select(state =>
      state.event
        .get("events")
        .filterNot(e => e.get("resolved"))
        .count()
    );

    if (unresolved) {
      yield take("EVENT_RESOLVE");
    }
  } while (unresolved);

  yield cancel(resolver);

  yield call(processEvents);

  yield put({
    type: "UI_ENABLE_ADVANCE"
  });

  yield take("GAME_ADVANCE_REQUEST");
}

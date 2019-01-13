import { Map, List } from "immutable";
import { select, call } from "redux-saga/effects";
import { managersTeamId, randomManager } from "../selectors";
import { amount as a } from "../../services/format";
import { addEvent, resolvedEvent } from "../../sagas/event";
import { incrementMorale, decrementMorale } from "../../sagas/team";
import { decrementBalance } from "../../sagas/manager";
import { cinteger } from "../../services/random";

const eventId = "boxing";

/*
sat82:
yyy = CINT(14 * RND) + 1
PRINT "Manageri "; lm(yyy); " haastaa sinut nyrkkeilyotteluun!"
satt82:
INPUT "Otatko haasteen vastaan (k/e) ? ", box$
IF box$ = "e" THEN PRINT "Selv„. "; lm(yyy); " haukkuu sinut julkisesti pelkuriksi ja n”rtiksi!": mo = mo - 7: RETURN
IF box$ = "k" THEN GOTO sattt82
GOTO satt82
sattt82:
box = CINT(4 * RND) + 1
IF box = 5 THEN PRINT "Ottelu p„„ttyy hienosti: tyrm„„t vastustajasi!": mo = mo + 10: RETURN
IF box = 4 THEN PRINT "Ottelu p„„ttyy hyv„ksesi tuomari„„nin!": mo = mo + 6: RETURN
IF box = 3 THEN PRINT "Ottelu p„„ttyy ratkaisemattomaan!": mo = mo + 4: RETURN
IF box = 2 THEN PRINT "Ottelu p„„ttyy tappioosi tuomari„„nill„!": mo = mo + 3: RETURN
IF box = 1 THEN PRINT "Ottelu p„„ttyy, kun "; lm(yyy); " tyrm„„ sinut!": PRINT "L„„k„rilasku kohoaa 10.000 pekkaan!": mo = mo + 1: raha = raha - 10000: RETURN

*/

const results = List.of(
  Map({
    text: data => `Ottelu päättyy hienosti: tyrmäät vastustajasi!`,
    moraleGain: 10
  }),
  Map({
    text: data => `Ottelu päättyy hyväksesi tuomariäänin!`,
    moraleGain: 6
  }),
  Map({
    text: data => `Ottelu päättyy tasapeliin!`,
    moraleGain: 4
  }),
  Map({
    text: data => `Ottelu päättyy tappioosi tuomariäänillä!`,
    moraleGain: 3
  }),
  Map({
    text: data =>
      `Ottelu päättyy, kun vastustajasi tyrmää sinut! Lääkärilasku kohoaa ${a(
        data.get("amount")
      )} pekkaan.`,
    moraleGain: 1
  })
);

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const random = yield select(randomManager());

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        otherManager: random.get("name"),
        resolved: false
      })
    );
  },

  options: data => {
    return Map({
      agree: `Otan haasteen vastaan. Nyrkkini on kova ja voittoni varma!`,
      disagree: `En ota haastetta vastaan. Aivoni ovat kovat, nyrkkini pehmeät.`
    });
  },

  resolve: function*(data, value) {
    data = data.merge({
      resolved: true,
      amount: 10000,
      agree: value === "agree",
      result: value === "agree" && cinteger(0, 4)
    });

    yield call(resolvedEvent, data);
  },

  render: data => {
    let t = List.of(
      `Manageri __${data.get(
        "otherManager"
      )}__ haastaa sinut nyrkkeilyotteluun! Otatko haasteen vastaan?`
    );

    if (!data.get("resolved")) {
      return t;
    }

    if (data.get("agree")) {
      const text = results.getIn([data.get("result"), "text"])(data);
      t = t.push(text);
    } else {
      t = t.push(
        `Selvä. __${data.get(
          "otherManager"
        )}__ haukkuu sinut julkisesti pelkuriksi ja _nörtiksi_!`
      );
    }

    return t;
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));

    const resultId = data.get("result");
    const result = results.get(resultId);

    if (data.get("agree")) {
      yield call(incrementMorale, team, result.get("moraleGain"));
      if (resultId === 4) {
        const amount = data.get("amount");
        yield call(decrementBalance, manager, amount);
      }
    } else {
      yield call(decrementMorale, team, 7);
    }
  }
};

export default event;

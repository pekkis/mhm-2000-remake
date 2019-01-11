import { Map, List, Range } from "immutable";
import { call, select } from "redux-saga/effects";
import { addEvent } from "../../sagas/event";
import { decrementStrength, incrementStrength } from "../../sagas/team";
import { randomTeamFrom, randomRankedTeam, randomManager } from "../selectors";
import { cinteger } from "../../services/random";

const eventId = "moneyTroubles";

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const phlTeam = yield select(randomRankedTeam("phl", 0, Range(9, 12)));
    const divTeam = yield select(
      randomTeamFrom("division", false, [], t => t.get("strength") > 95)
    );

    if (!phlTeam || !divTeam) {
      return;
    }

    const random = yield select(randomManager());

    yield call(
      addEvent,
      Map({
        eventId,
        manager,
        otherManager: random.get("name"),
        phlTeam: phlTeam.get("id"),
        phlTeamName: phlTeam.get("name"),
        divTeam: divTeam.get("id"),
        divTeamName: divTeam.get("name"),
        strengthTransfer: cinteger(0, 15) + 12,
        resolved: true
      })
    );
    return;
  },

  render: data => {
    let t = List.of(
      `Divisioonasta:

Manageri ${data.get("otherManager")} ja joukkueensa __${data.get(
        "divTeamName"
      )}__ pistävät tuulemaan! He ostavat rahavaikeuksiin joutuneelta liigajoukkueelta (__${data.get(
        "phlTeamName"
      )})__ heidän parhaat pelaajansa.`
    );

    return t;
  },

  process: function*(data) {
    const phlTeam = data.get("phlTeam");
    const divTeam = data.get("divTeam");
    const strengthTransfer = data.get("strengthTransfer");

    yield call(decrementStrength, phlTeam, strengthTransfer);
    yield call(incrementStrength, divTeam, strengthTransfer);
  }
};

export default event;

/*
sat67:
nnn = CINT(14 * RND) + 1
FOR xxx = 1 TO 12
IF s(xxx) > 9 AND xxx <> u THEN GOTO satt67
NEXT xxx
satt67:
FOR zzz = 1 TO 12
IF sd(zzz) < 6 AND vd(zzz) > 95 AND zzz <> u THEN GOTO sattt67
NEXT zzz
RETURN
sattt67:
PRINT "Divisioonasta:"
PRINT "Manageri "; lm(nnn); " ja joukkueensa "; ld(zzz)
PRINT "pist„v„t tuulemaan!! He ostavat rahavaikeuksiin joutuneelta"
PRINT "liigajoukkueelta ("; l(xxx); ") heid„n parhaat pelaajansa."
ggg = CINT(15 * RND) + 12
v(xxx) = v(xxx) - ggg
vd(zzz) = vd(zzz) + ggg
RETURN
*/

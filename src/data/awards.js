import { select, putResolve, put, call, all, fork } from "redux-saga/effects";
import {
  competition,
  playerWhoControlsTeam,
  allTeams,
  pekkalandianTeams,
  teamCompetesIn,
  teamsStrength,
  teamsPositionInRoundRobin,
  teamWasRelegated,
  teamWasPromoted
} from "./selectors";
import { victors, eliminated } from "../services/playoffs";
import { List, Map, Repeat } from "immutable";
import r from "../services/random";

const playsInPHLOrWasPromoted = function*(teamId) {
  const playsInPHL = yield select(teamCompetesIn(teamId, "phl"));
  if (!playsInPHL) {
    return yield select(teamWasPromoted(teamId));
  }

  const wasRelegated = yield select(teamWasRelegated(teamId));
  return !wasRelegated;
};

const playsInDivisionOrWasRelegated = function*(teamId) {
  const playsInDivision = yield select(teamCompetesIn(teamId, "division"));
  if (!playsInDivision) {
    return yield select(teamWasRelegated(teamId));
  }

  const wasPromoted = yield select(teamWasPromoted(teamId));
  return !wasPromoted;
};

const createRandom = (
  dieSize,
  requiredThrow,
  amountOfStrengthIncremented,
  isEligible = function*(teamId) {
    return true;
  },
  news
) => {
  return function*(teamId) {
    const team = yield select(state => state.game.getIn(["teams", teamId]));

    const canDo = yield call(isEligible, teamId);

    if (!canDo) {
      return;
    }

    const rand = r.integer(1, dieSize);
    if (rand < requiredThrow) {
      return;
    }
    yield all([
      putResolve({
        type: "TEAM_INCREMENT_STRENGTH",
        payload: {
          team: team.get("id"),
          amount: amountOfStrengthIncremented(team)
        }
      }),
      putResolve({
        type: "NEWS_ADD",
        payload: news(team)
      })
    ]);
  };
};

const randomEvents = List.of(
  createRandom(
    12,
    2,
    () => -199,
    function*(teamId) {
      const isEligible = yield call(playsInPHLOrWasPromoted, teamId);
      if (!isEligible) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      return strength > 400;
    },
    team => {
      return `__${team.get(
        "name"
      )}__ kaatuu sisäisiin riitoihin! Pelaajat kävelevät ulos!`;
    }
  ),
  createRandom(
    12,
    5,
    () => -70,
    function*(teamId) {
      const isEligible = yield call(playsInPHLOrWasPromoted, teamId);
      if (!isEligible) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      return strength > 300;
    },
    team => {
      return `__${team.get(
        "name"
      )}__ hajoaa totaalisesti ulkomaiden rahaseuroihin!`;
    }
  ),

  createRandom(
    12,
    6,
    () => -45,
    function*(teamId) {
      const isEligible = yield call(playsInPHLOrWasPromoted, teamId);
      if (!isEligible) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      return strength > 250;
    },
    team => {
      return `__${team.get("name")}__ menettää useita pelaajiaan ulkomaille.`;
    }
  ),

  createRandom(
    12,
    8,
    () => -15,
    function*(teamId) {
      const isEligible = yield call(playsInPHLOrWasPromoted, teamId);
      if (!isEligible) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      return strength > 210;
    },
    team => {
      return `__${team.get("name")}__ menettää joitakin pelaajiaan ulkomaille.`;
    }
  ),

  createRandom(
    1,
    1,
    () => -30,
    function*(teamId) {
      const isEligible = yield call(playsInPHLOrWasPromoted, teamId);
      if (!isEligible) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      const rank = yield select(teamsPositionInRoundRobin(teamId, "phl", 0));
      return strength > 200 && rank > 8;
    },
    team => {
      return `__${team.get(
        "name"
      )}__ ei päässyt play-offeihin ja myy pelaajiaan konkurssin uhatessa!!`;
    }
  ),

  createRandom(
    1,
    1,
    () => 20,
    function*(teamId) {
      const isEligible = yield call(playsInPHLOrWasPromoted, teamId);
      if (!isEligible) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      const rank = yield select(teamsPositionInRoundRobin(teamId, "phl", 0));
      if (rank === false) {
        return;
      }

      return strength < 160 && rank <= 8;
    },
    team => {
      return `__${team.get(
        "name"
      )}__:n  nuori joukkue saa rutkasti kokemusta play-offeista!`;
    }
  ),

  createRandom(
    12,
    5,
    () => 12,
    function*(teamId) {
      const isEligible = yield call(playsInPHLOrWasPromoted, teamId);
      if (!isEligible) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      return strength < 150;
    },
    team => {
      return `__${team.get(
        "name"
      )}__ saa uuden sponsorin joka ostaa joukkueelle uusia pelaajia!`;
    }
  ),

  createRandom(
    12,
    5,
    () => 23,
    function*(teamId) {
      const isEligible = yield call(playsInPHLOrWasPromoted, teamId);
      if (!isEligible) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      return strength < 135;
    },
    team => {
      return `__${team.get(
        "name"
      )}__ saa uuden, RIKKAAN sponsorin joka ostaa joukkueelle uusia pelaajia!`;
    }
  ),

  createRandom(
    22,
    16,
    () => 60,
    function*(teamId) {
      const isEligible = yield call(playsInPHLOrWasPromoted, teamId);
      if (!isEligible) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      return strength < 140;
    },
    team => {
      return `__${team.get(
        "name"
      )}__ lähtee tosissaan mukaan mestaruustaistoon rahan voimalla!`;
    }
  ),

  createRandom(
    12,
    7,
    () => -10,
    function*(teamId) {
      const isEligible = yield call(playsInPHLOrWasPromoted, teamId);
      if (!isEligible) {
        return false;
      }

      return true;
    },
    team => {
      return `__${team.get("name")}__:n veteraanipelaajia siirtyy eläkkeelle!`;
    }
  ),
  createRandom(
    12,
    7,
    () => 7,
    function*(teamId) {
      const isEligible = yield call(playsInPHLOrWasPromoted, teamId);
      if (!isEligible) {
        return false;
      }
      return true;
    },
    team => {
      return `__${team.get(
        "name"
      )}__:n juniorityö tuottaa lupaavan nuoren tähden!`;
    }
  ),
  createRandom(
    12,
    8,
    () => -r.integer(5, 20),
    function*(teamId) {
      const isEligible = yield call(playsInPHLOrWasPromoted, teamId);
      if (!isEligible) {
        return false;
      }
      return true;
    },
    team => {
      return `__${team.get(
        "name"
      )}__:n pelaajia siirtyy rahan perässä muualle!`;
    }
  ),
  createRandom(
    12,
    8,
    () => -r.integer(5, 20),
    function*(teamId) {
      const isEligible = yield call(playsInPHLOrWasPromoted, teamId);
      if (!isEligible) {
        return false;
      }
      return true;
    },
    team => {
      return `__${team.get("name")}__ kokee menetyksen, pelaajia siirtyy pois!`;
    }
  ),
  createRandom(
    32,
    27,
    () => 55,
    function*(teamId) {
      const isEligible = yield call(playsInPHLOrWasPromoted, teamId);
      if (!isEligible) {
        return false;
      }

      return true;
    },
    team => {
      return `__${team.get("name")}__ antaa rahan palaa kunnolla!`;
    }
  ),

  createRandom(
    12,
    5,
    () => -40,
    function*(teamId) {
      const playsInPHL = yield select(teamCompetesIn(teamId, "phl"));

      if (!playsInPHL) {
        return false;
      }

      const wasRelegated = yield select(teamWasRelegated(teamId));
      if (!wasRelegated) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      return strength > 160;
    },
    team => {
      return `Divisioonaan tippunut __${team.get(
        "name"
      )}__ menettää rutkasti pelaajiansa liigaan.`;
    }
  ),
  createRandom(
    12,
    7,
    () => -20,
    function*(teamId) {
      const playsInPHL = yield select(teamCompetesIn(teamId, "phl"));

      if (!playsInPHL) {
        return false;
      }

      const wasRelegated = yield select(teamWasRelegated(teamId));
      if (!wasRelegated) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      return strength > 130;
    },
    team => {
      return `Divisioonaan tippunut __${team.get(
        "name"
      )}__ menettää pelaajiansa liigaan.`;
    }
  ),
  createRandom(
    1,
    1,
    () => -20,
    function*(teamId) {
      const playsInDivision = yield select(teamCompetesIn(teamId, "division"));

      if (!playsInDivision) {
        return false;
      }

      const wasPromoted = yield select(teamWasPromoted(teamId));
      if (wasPromoted) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      return strength > 120;
    },
    team => {
      return `Nousua tavoitellut __${team.get(
        "name"
      )}__ ei onnistunut - pelaajat lähtevät!.`;
    }
  ),
  createRandom(
    1,
    1,
    () => -40,
    function*(teamId) {
      const playsInDivision = yield select(teamCompetesIn(teamId, "division"));

      if (!playsInDivision) {
        return false;
      }

      const wasPromoted = yield select(teamWasPromoted(teamId));
      if (wasPromoted) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      return strength > 140;
    },
    team => {
      return `Nousua tavoitellut __${team.get(
        "name"
      )}__ ei onnistunut - pelaajat lähtevät joukoittain!.`;
    }
  ),
  createRandom(
    12,
    8,
    () => 8,
    function*(teamId) {
      const isEligible = yield call(playsInDivisionOrWasRelegated, teamId);
      if (!isEligible) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      return strength < 82;
    },
    team => {
      return `__${team.get("name")}__ saa uuden sponsorin!.`;
    }
  ),
  createRandom(
    12,
    7,
    () => 13,
    function*(teamId) {
      const isEligible = yield call(playsInDivisionOrWasRelegated, teamId);
      if (!isEligible) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      return strength < 72;
    },
    team => {
      return `__${team.get("name")}__ saa uuden, hyvän sponsorin!.`;
    }
  ),
  createRandom(
    12,
    7,
    () => 16,
    function*(teamId) {
      const isEligible = yield call(playsInDivisionOrWasRelegated, teamId);
      if (!isEligible) {
        return false;
      }

      const strength = yield select(teamsStrength(teamId));
      return strength < 62;
    },
    team => {
      return `__${team.get("name")}__ saa uuden, loistavan sponsorin!.`;
    }
  ),
  createRandom(
    12,
    7,
    () => -15,
    function*(teamId) {
      const isEligible = yield call(playsInDivisionOrWasRelegated, teamId);
      if (!isEligible) {
        return false;
      }

      return true;
    },
    team => {
      return `Liigajoukkueet värväävät __${team.get("name")}__:n pelaajia!`;
    }
  ),
  createRandom(
    22,
    20,
    () => 45,
    function*(teamId) {
      const isEligible = yield call(playsInDivisionOrWasRelegated, teamId);
      if (!isEligible) {
        return false;
      }

      return true;
    },
    team => {
      return `__${team.get(
        "name"
      )}__ kuluttaa todella paljon rahaa! Uusia pelaajia ostetaan roimasti!`;
    }
  ),
  createRandom(
    12,
    7,
    () => -8,
    function*(teamId) {
      const isEligible = yield call(playsInDivisionOrWasRelegated, teamId);
      if (!isEligible) {
        return false;
      }

      return true;
    },
    team => {
      return `__${team.get("name")}__:n veteraanipelaajia lopettaa uransa.`;
    }
  ),
  createRandom(
    1,
    1,
    team => {
      return 45 - team.get("strength");
    },
    function*(teamId) {
      const strength = yield select(teamsStrength(teamId));
      return strength < 35;
    },
    team => {
      return `__${team.get(
        "name"
      )}__ on jo luopumassa sarjapaikastaan, mutta uusi omistaja pelastaa joukkueen viime hetkellä!`;
    }
  )
).map((r, i) => {
  r.id = i;
  return r;
});

/*

IF v(x) <= 35 THEN v(x) = 45: PRINT l(x); " on luopumassa sarjapaikasta kun uusi omistaja pelastaa joukkueen!"
IF vd(x) <= 35 THEN vd(x) = 45: PRINT ld(x); " on luopumassa sarjapaikasta kun uusi omistaja pelastaa joukkueen!"

IF 20 * RND > 10 THEN vd(x) = vd(x) - 15: PRINT "Liigajoukkueet v„rv„„v„t "; ld(x); ":n pelaajia!"
IF 20 * RND > 18 THEN vd(x) = vd(x) + 45: PRINT ld(x); " kuluttaa todella paljon rahaa! Uusia pelaajia ostetaan roimasti!"
IF 10 * RND > 5 THEN vd(x) = vd(x) - 8: PRINT ld(x); ":n veteraanipelaajia lopettaa uransa."


*/

const createAward = (amount, strength, news) => {
  return {
    news,
    data: team =>
      Map({
        id: team.get("id"),
        name: team.get("name"),
        amount,
        strength
      })
  };
};

const medalAwards = List.of(
  createAward(1500000, 29, data => {
    return `__${data.get("name")}__ nettoaa mestaruudestaan ${data.get(
      "amount"
    )} pekkaa!`;
  }),
  createAward(1000000, 19, data => {
    return `__${data.get("name")}__ nettoaa hopeastaan ${data.get(
      "amount"
    )} pekkaa!`;
  }),
  createAward(700000, 12, data => {
    return `__${data.get("name")}__ nettoaa pronssistaan ${data.get(
      "amount"
    )} pekkaa!`;
  }),
  createAward(500000, 10, data => {
    return `__${data.get("name")}__ nettoaa neljännestä sijastaan ${data.get(
      "amount"
    )} pekkaa!`;
  })
);

const roundRobinAwards = List.of(
  createAward(500000, 10, data => {
    return `__${data.get("name")}__ saa runkosarjan voitosta ${data.get(
      "amount"
    )} pekkaa!`;
  }),
  createAward(400000, 7, data => {
    return `__${data.get("name")}__ saa runkosarjan toisesta sijasta ${data.get(
      "amount"
    )} pekkaa!`;
  }),
  createAward(300000, 6, data => {
    return `__${data.get(
      "name"
    )}__ saa runkosarjan kolmannesta sijasta ${data.get("amount")} pekkaa!`;
  }),
  createAward(200000, 4, data => {
    return `__${data.get(
      "name"
    )}__ saa runkosarjan neljännestä sijasta ${data.get("amount")} pekkaa!`;
  }),

  Repeat(
    createAward(100000, 2, data => {
      return `__${data.get("name")}__ saa playoff-bonuksen, ${data.get(
        "amount"
      )} pekkaa!`;
    }),
    4
  ).toList()
).flatten(true);

const yieldAwards = function*(awards, to) {
  const teams = yield select(state => state.game.get("teams"));

  for (const [i, teamId] of to.entries()) {
    const award = awards.get(i);
    const team = teams.get(teamId);

    const player = yield select(playerWhoControlsTeam(teamId));
    const data = award.data(team);

    if (player) {
      yield putResolve({
        type: "PLAYER_INCREMENT_BALANCE",
        payload: {
          player: player.get("id"),
          amount: data.get("amount")
        }
      });
    } else {
      yield putResolve({
        type: "TEAM_INCREMENT_STRENGTH",
        payload: {
          team: data.get("id"),
          amount: data.get("strength")
        }
      });
    }

    yield putResolve({
      type: "NEWS_ADD",
      payload: award.news(data)
    });
  }
};

const award = function*() {
  const phl = yield select(competition("phl"));

  const finalPhase = phl.getIn(["phases", 3, "groups", 0]);

  const winners = victors(finalPhase);
  const losers = eliminated(finalPhase);

  const ranking = List.of(
    winners.first(),
    losers.first(),
    winners.last(),
    losers.last()
  ).map(r => r.get("id"));

  yield call(yieldAwards, medalAwards, ranking);

  const tableEntries = phl
    .getIn(["phases", 0, "groups", 0, "stats"])
    .map(t => t.get("id"))
    .take(8);

  yield call(yieldAwards, roundRobinAwards, tableEntries);
  const teams = yield select(pekkalandianTeams);

  for (const [, team] of teams.entries()) {
    for (const randomEvent of randomEvents) {
      yield call(randomEvent, team.get("id"));
    }
  }
};

export default award;

/*

IF v(x) > 400 AND 10 * RND > 1 THEN v(x) = v(x) - 199: PRINT l(x); " kaatuu sis„isiin riitoihin! Pelaajat k„velev„t ulos!"
IF v(x) > 300 AND 10 * RND < 7 THEN v(x) = v(x) - 70: PRINT l(x); " hajoaa totaalisesti ulkomaiden rahaseuroihin!"
IF v(x) > 250 AND 10 * RND > 5 THEN v(x) = v(x) - 45: PRINT l(x); " menett„„ useita pelaajiaan ulkomaille."
IF v(x) > 210 AND 10 * RND < 4 THEN v(x) = v(x) - 15: PRINT l(x); " menett„„ joitakin pelaajiaan ulkomaille."
IF v(x) > 200 AND 10 * RND < 8 AND s(x) > 8 AND s(x) < 12 THEN v(x) = v(x) - 30: PRINT l(x); " ei p„„ssyt play-offeihin ja myy pelaajiaan konkurssin uhatessa!"
IF v(x) < 160 AND s(x) < 9 THEN v(x) = v(x) + 20: PRINT l(x); ":n nuori joukkue saa rutkasti kokemusta Play-offeista!"
IF v(x) < 150 AND 10 * RND < 7 THEN v(x) = v(x) + 12: PRINT l(x); " saa uuden sponsorin joka ostaa joukkueelle uusia pelaajia!"
IF v(x) < 135 AND 10 * RND < 7 THEN v(x) = v(x) + 23: PRINT l(x); " saa uuden, RIKKAAN sponsorin joka ostaa joukkueelle uusia pelaajia!"
IF v(x) < 140 AND 20 * RND > 14 THEN v(x) = v(x) + 60: PRINT l(x); " l„htee tosissaan mukaan mestaruustaistoon rahan voimalla!"
IF 10 * RND < 5 THEN v(x) = v(x) - 10: PRINT l(x); ":n veteraanipelaajia siirtyy el„kkeelle."
IF 10 * RND > 5 THEN v(x) = v(x) + 7: PRINT l(x); ":n juniority” tuottaa lupaavan nuoren t„hden!"
IF 10 * RND > 7 THEN v(x) = v(x) - (CINT(15 * RND) + 5): PRINT l(x); ":n pelaajia siirtyy rahan per„ss„ muualle!"
IF 10 * RND > 7 THEN v(x) = v(x) - (CINT(15 * RND) + 5): PRINT l(x); " kokee menetyksen, pelaajia siirtyy pois!"
IF 30 * RND > 26 THEN v(x) = v(x) + 55: PRINT l(x); " antaa rahan palaa kunnolla!"

IF sd(x) = gagga AND vd(x) > 160 AND 10 * RND < 8 THEN vd(x) = vd(x) - 40: PRINT "Divisioonaan tippunut "; ld(x); " menett„„ rutkasti pelaajiansa liigaan."
IF sd(x) = gagga AND vd(x) > 130 AND 10 * RND < 6 THEN vd(x) = vd(x) - 20: PRINT "Divisioonaan tippunut "; ld(x); " menett„„ pelaajiansa liigaan."

IF vd(x) < 82 AND 10 * RND > 6 THEN vd(x) = vd(x) + 8: PRINT ld(x); " saa uuden sponsorin!"
IF vd(x) < 72 AND 10 * RND > 5 THEN vd(x) = vd(x) + 13: PRINT ld(x); " saa uuden, hyv„n sponsorin!"
IF vd(x) < 62 AND 10 * RND > 5 THEN vd(x) = vd(x) + 16: PRINT ld(x); " saa uuden, loistavan sponsorin!"



IF lamp = l(x) THEN PRINT l(x); " nettoaa mestaruudestaan 1.500.000 pekkaa!": raha = raha + 1500000: edus1 = u
IF lecond = l(x) THEN PRINT l(x); " nettoaa hopeastaan 1.000.000 pekkaa!": raha = raha + 1000000: edus2 = u
IF lonssi = l(x) THEN PRINT l(x); " nettoaa pronssistaan 700.000 pekkaa!": raha = raha + 700000: edus3 = u
IF leljas = l(x) THEN PRINT l(x); " nettoaa nelj„nnest„ sijastaan 500.000 pekkaa!": raha = raha + 500000
IF s(x) = 1 THEN PRINT l(x); " saa runkosarjan voitosta 500.000 pekkaa!": raha = raha + 500000
IF s(x) = 2 THEN PRINT l(x); " saa runkosarjan 2. sijastaan 400.000 pekkaa!": raha = raha + 400000
IF s(x) = 3 THEN PRINT l(x); " saa runkosarjan 3. sijastaan 300.000 pekkaa!": raha = raha + 300000
IF s(x) = 4 THEN PRINT l(x); " saa runkosarjan 4. sijastaan 200.000 pekkaa!": raha = raha + 200000
IF s(x) > 4 AND s(x) < 9 THEN PRINT l(x); " saa playoff-bonuksen, 100.000 pekkaa.": raha = raha + 10000

IF lamp = l(x) THEN PRINT l(x); " nettoaa mestaruudestaan 1.500.000 pekkaa!": v(x) = v(x) + 29: edus1 = x
IF lecond = l(x) THEN PRINT l(x); " nettoaa hopeastaan 1.000.000 pekkaa!": v(x) = v(x) + 19: edus2 = x
IF lonssi = l(x) THEN PRINT l(x); " nettoaa pronssistaan 700.000 pekkaa!": v(x) = v(x) + 12: edus3 = x
IF leljas = l(x) THEN PRINT l(x); " nettoaa nelj„nnest„ sijastaan 500.000 pekkaa!": v(x) = v(x) + 10
IF s(x) = 1 THEN PRINT l(x); " saa runkosarjan voitosta 500.000 pekkaa!": v(x) = v(x) + 10
IF s(x) = 2 THEN PRINT l(x); " saa runkosarjan 2. sijastaan 400.000 pekkaa!": v(x) = v(x) + 7
IF s(x) = 3 THEN PRINT l(x); " saa runkosarjan 3. sijastaan 300.000 pekkaa!": v(x) = v(x) + 6
IF s(x) = 4 THEN PRINT l(x); " saa runkosarjan 4. sijastaan 200.000 pekkaa!": v(x) = v(x) + 4
IF s(x) > 4 AND s(x) < 9 THEN PRINT l(x); " saa playoff-bonuksen, 100.000 pekkaa.": v(x) = v(x) + 2
*/

import { Map, List } from "immutable";
import r from "./random";
import { pipe } from "ramda";
import { getEffective, getEffectiveOpponent } from "../services/effects";
import services from "../data/services";

/*
mla(a) = mal(a) / ducka: mla(b) = mal(b) / ducka
mla(c) = mal(c) / ducka: mla(d) = mal(d) / ducka
mla(e) = mal(e) / ducka: mla(f) = mal(f) / ducka
mla(g) = mal(g) / ducka: mla(h) = mal(h) / ducka
mla(i) = mal(i) / ducka: mla(j) = mal(j) / ducka
mla(k) = mal(k) / ducka: mla(m) = mal(m) / ducka
gl(a) = CINT(mla(a)): gl(b) = CINT(mla(b))

mal(a) = CINT(v(a) * RND) + talg(a) + fucka
*/

const playOvertime = (strengths, result) => {
  const homeStrength = strengths.get("home");
  const awayStrength = strengths.get("away");

  let victor = null;
  do {
    const home = r.integer(0, homeStrength);
    const away = r.integer(0, awayStrength);

    if (home > away) {
      victor = "home";
    }

    if (home < away) {
      victor = "away";
    }
  } while (!victor);

  return result.update(victor, g => g + 1).set("ot", true);
};

export const simulate = game => {
  const raw = Map({
    home: game.get("home"),
    away: game.get("away")
  });

  const managers = Map({
    home: game.get("homeManager"),
    away: game.get("awayManager")
  });

  const teams = raw.map((obj, key, context) => {
    const otherKey = key === "home" ? "away" : "home";
    return getEffectiveOpponent(getEffective(obj), context.get(otherKey));
  });

  const base = game.get("base");
  const overtime = game.get("overtime");

  const competitionId = game.get("competitionId");
  const phaseId = game.get("phaseId");

  const effects = List.of(
    (team, i) => team.get("strength"),
    (team, i) => game.get("moraleEffect")(team),
    (team, i) => game.getIn(["advantage", i])(team),
    (team, i) => team.get("readiness")
  );

  const managerEffects = managers.map(manager => {
    if (!manager) {
      return List();
    }
    return manager
      .get("services")
      .filter(s => s)
      .map((s, k) => {
        return services.getIn([k, "effect"])(competitionId, phaseId);
      });
  });

  const strengthsX = teams.map((t, i) => {
    return effects.map(e => e(t, i));
  });

  console.log("strengthS", strengthsX.toList().toJS());
  console.log("MANAGER EFFECTS", managerEffects.toJS());

  const strengths = teams.map((t, i) => {
    return (
      effects.map(e => e(t, i)).reduce((r, s) => r + s, 0) +
      managerEffects.get(i).reduce((r, e) => r + e, 0)
    );
  });

  const result = strengths
    .map((strength, i) => {
      return pipe(
        strength => r.integer(0, strength),
        val => val / base(),
        val => (val < 0 ? 0 : val),
        number => parseInt(number.toFixed(0), 10)
      )(strength);
    })
    .set("overtime", false);

  const info = List.of("home", "away").map(i => {
    return Map({
      name: raw.getIn([i, "name"]),
      oStrength: raw.getIn([i, "strength"]),
      eStrength: teams.getIn([i, "strength"]),
      cStrength: strengths.get(i),
      goals: result.get(i)
    });
  });

  console.log(info.toJS());

  const needsOvertime = overtime(result);

  if (!needsOvertime) {
    return result;
  }

  // console.log("OVERTIME NEEDED, RESULT", result.toJS());
  const afterOvertime = playOvertime(strengths, result);
  // console.log("RESULT AFTER OVERTIME", afterOvertime.toJS());

  return afterOvertime;
};

export default {
  simulate
};

export const gameFacts = (game, team) => {
  const isHome = team === game.get("home");

  const myKey = isHome ? "home" : "away";
  const theirKey = isHome ? "away" : "home";

  const isWin =
    game.getIn(["result", myKey]) > game.getIn(["result", theirKey]);

  const isDraw =
    game.getIn(["result", myKey]) === game.getIn(["result", theirKey]);

  const isLoss =
    game.getIn(["result", myKey]) < game.getIn(["result", theirKey]);

  return {
    isWin,
    isDraw,
    isLoss
  };
};

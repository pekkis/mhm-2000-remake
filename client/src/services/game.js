import { Map } from "immutable";
import r from "./random";
import { compose, pipe } from "ramda";

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

const playOvertime = (homeStrength, awayStrength, result) => {
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
  // console.log("game to simulate", game.toJS());

  const homeTeam = game.get("home");
  const awayTeam = game.get("away");

  // console.log(homeTeam.toJS());

  const base = game.get("base");

  const overtime = game.get("overtime");

  // console.log("base", base);

  const homeStrength = pipe(
    team => team.get("strength"),
    game.getIn(["advantage", "home"])
    // ...homeTeam.get("effects").toArray()
  )(homeTeam);

  const awayStrength = pipe(
    team => team.get("strength"),
    game.getIn(["advantage", "away"])
    // ...awayTeam.get("effects").toArray()
  )(awayTeam);

  const goals = pipe(
    strength => r.integer(0, strength),
    val => val / base(),
    val => (val < 0 ? 0 : val),
    number => parseInt(number.toFixed(0), 10)
  );

  const result = Map({
    home: goals(homeStrength),
    away: goals(awayStrength),
    ot: false
  });

  const needsOvertime = overtime(result);

  if (!needsOvertime) {
    return result;
  }

  console.log("OVETIME NEEDED, RESULT", result.toJS());
  const afterOvertime = playOvertime(homeStrength, awayStrength, result);
  console.log("RESULT AFTER OVERTIME", afterOvertime.toJS());

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

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

const simulate = game => {
  // console.log("game to simulate", game.toJS());

  const homeTeam = game.get("home");
  const awayTeam = game.get("away");

  // console.log(homeTeam.toJS());

  const base = game.get("base");

  // console.log("base", base);

  const homeGoals = pipe(
    team => team.get("strength"),
    game.getIn(["advantage", "home"]),
    ...homeTeam.get("effects").toArray(),
    strength => r.integer(0, strength),
    val => val / base(),
    val => (val < 0 ? 0 : val),
    number => parseInt(number.toFixed(0), 10)
  );

  const awayGoals = pipe(
    team => team.get("strength"),
    game.getIn(["advantage", "away"]),
    ...awayTeam.get("effects").toArray(),
    strength => r.integer(0, strength),
    val => val / base(),
    val => (val < 0 ? 0 : val),
    number => parseInt(number.toFixed(0), 10)
  );

  const result = Map({
    home: homeGoals(homeTeam),
    away: awayGoals(awayTeam)
  });

  return result;
};

export default {
  simulate
};

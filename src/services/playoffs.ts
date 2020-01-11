import { Range, Map, List } from "immutable";
import { gameFacts } from "./game";
import {
  Matchups,
  Matchup,
  Schedule,
  ScheduleGame,
  ScheduleRound
} from "../data/competitions/phl";
import { range, map } from "ramda";

export const victors = phase => {
  const winsToAdvance = phase.get("winsToAdvance");

  const tussihovi = phase
    .get("stats")
    .map(m => List.of(m.get("home"), m.get("away")))
    .flatten(true);

  return tussihovi
    .filter(m => m.get("wins") === winsToAdvance)
    .sortBy(m => m.get("index"));
};

export const eliminated = phase => {
  const winsToAdvance = phase.get("winsToAdvance");

  const tussihovi = phase
    .get("stats")
    .map(m => List.of(m.get("home"), m.get("away")))
    .flatten(true);

  return tussihovi
    .filter(m => m.get("losses") === winsToAdvance)
    .sortBy(m => m.get("index"));
};

export const matchups = phase => {
  console.log("CALCULATING MATCHUPS FOR ", phase.toJS());
  const teams = phase.get("teams");

  return phase.get("matchups").map(matchup => {
    const [home, away] = ["home", "away"].map(which => {
      const index = which === "home" ? 0 : 1;

      const games = phase
        .get("schedule")
        .map(pairings => pairings.find(p => p.includes(matchup.get(index))))
        .filter(g => g.get("result"));
      // console.log(games, "games!");

      const facts = games.map(g => gameFacts(g, matchup.get(index)));

      // console.log(facts.toJS(), "the facts");

      return Map({
        index: matchup.get(index),
        id: teams.get(matchup.get(index)),
        wins: facts.filter(f => f.isWin).count(),
        losses: facts.filter(f => f.isLoss).count()
      });
    });

    return Map({
      home,
      away
    });
  });
};

const createGame = (matchup: Matchup, round: number): ScheduleGame => {
  const [first, second] = matchup;
  if (round % 2 !== 0) {
    return {
      home: first,
      away: second
    };
  }

  return {
    home: second,
    away: first
  };
};

const createRound = (matchups: Matchups, round: number): ScheduleRound => {
  return map(m => createGame(m, round), matchups);
};

const scheduler = (matchups: Matchups, winsToAdvance: number): Schedule => {
  const r = range(1, winsToAdvance * 2);
  return map(r => createRound(matchups, r), r);
};

export default scheduler;

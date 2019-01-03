import { Range, Map, List } from "immutable";
import { gameFacts } from "./game";

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

const scheduler = (matchups, winsToAdvance) => {
  return Range(1, winsToAdvance * 2)
    .map(r => {
      return matchups.map(matchup => {
        if (r % 2 !== 0) {
          return Map({
            home: matchup.get(0),
            away: matchup.get(1)
          });
        }

        return Map({
          home: matchup.get(1),
          away: matchup.get(0)
        });
      });
    })
    .toList();
};

export default scheduler;

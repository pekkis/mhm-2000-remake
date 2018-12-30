import { Range, Map, Seq, List } from "immutable";
import { gameFacts } from "./game";

export const victors = phase => {
  const winsToAdvance = phase.get("winsToAdvance");

  const tussihovi = matchups(phase)
    .map(m => List.of(m.home, m.away))
    .flatten(true);

  return tussihovi.filter(m => m.wins === winsToAdvance).sortBy(m => m.index);
};

export const eliminated = phase => {
  const winsToAdvance = phase.get("winsToAdvance");

  const tussihovi = matchups(phase)
    .map(m => List.of(m.home, m.away))
    .flatten(true);

  return tussihovi.filter(m => m.losses === winsToAdvance).sortBy(m => m.index);
};

export const matchups = phase => {
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

      return {
        index: matchup.get(index),
        id: teams.get(matchup.get(index)),
        wins: facts.filter(f => f.isWin).count(),
        losses: facts.filter(f => f.isLoss).count()
      };
    });

    return {
      home,
      away
    };
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

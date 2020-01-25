import { playMatch } from "./match";
import { Team } from "../types/team";
import { normalizeModifier } from "./player";
import { normalizeMorale } from "./morale";

test("returns a result", () => {
  const teamA: Team = {
    name: "Jäälosot",
    city: "Tussila",
    strength: {
      g: 10,
      d: 60,
      a: 120,
      pp: 50,
      pk: 40
    },
    isHumanControlled: false,
    country: "FI",
    id: "jaalosot",
    level: 0,
    morale: normalizeMorale(3, 20),
    strategy: "puurto",
    effects: [],
    opponentEffects: [],
    readiness: 1,
    intensity: 0
  };

  const teamB: Team = {
    name: "Mahtiankat",
    city: "Martinlaakso",
    strength: {
      g: 10,
      d: 60,
      a: 120,
      pp: 50,
      pk: 40
    },
    isHumanControlled: false,
    country: "FI",
    id: "mahtiankat",
    level: 0,
    morale: normalizeMorale(3, -200),
    strategy: "puurto",
    effects: [],
    opponentEffects: [],
    readiness: 1,
    intensity: 0
  };

  const o = playMatch({
    competition: {
      id: "phl",
      phase: 0,
      group: 0,
      round: 8
    },
    teams: {
      home: teamA,
      away: teamB
    }
  });

  expect(typeof o.result.home).toBe("number");
  expect(typeof o.result.away).toBe("number");

  console.log(o);
});

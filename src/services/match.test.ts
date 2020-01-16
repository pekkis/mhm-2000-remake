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
      a: 60
    },
    isHumanControlled: false,
    domestic: true,
    id: "jaalosot",
    level: 0,
    morale: normalizeMorale(3, 20)
  };

  const teamB: Team = {
    name: "Mahtiankat",
    city: "Martinlaakso",
    strength: {
      g: 10,
      d: 60,
      a: 60
    },
    isHumanControlled: false,
    domestic: true,
    id: "mahtiankat",
    level: 0,
    morale: normalizeMorale(3, -200)
  };

  const o = playMatch({
    competition: {
      id: "phl",
      phase: 0,
      group: 0
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

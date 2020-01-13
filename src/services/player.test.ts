import {
  createPlayer,
  createRandomPlayer,
  randomSkill,
  normalizeAbility,
  normalizeModifier
} from "./player";
import { range } from "ramda";
import { normalCountryIds } from "./country";
import { PlayableCountries } from "../types/country";

const countries = [
  "FI",
  "SE",
  "DE",
  "IT",
  "RU",
  "CZ",
  "EE",
  "LV",
  "CA",
  "US",
  "CH",
  "SK",
  "JP",
  "NO",
  "FR",
  "AT",
  "PL"
];

test("creates player", () => {
  const player = createPlayer(
    "Lohiposki",
    "Gaylord",
    20,
    "NO",
    "c",
    60,
    20,
    20,
    20,
    -3,
    -3
  );

  expect(typeof player.lastName).toBe("string");
  expect(typeof player.firstName).toBe("string");
  expect(player.firstName).toHaveLength(1);
});

test("creates random players", () => {
  const players = range(0, 1000).map(createRandomPlayer);

  players.forEach(player => {
    expect(typeof player.lastName).toBe("string");
    expect(typeof player.firstName).toBe("string");
    expect(player.firstName).toHaveLength(1);
    expect(countries).toContain(player.country);
  });
});

test("randomly generates skills", () => {
  normalCountryIds().forEach(c => {
    const skills = range(0, 500).map(() => {
      const skill = randomSkill(c as PlayableCountries);
      expect(skill).toBeGreaterThanOrEqual(1);
      expect(skill).toBeLessThanOrEqual(20);

      return skill;
    });

    // todo: calculate da stuff
  });

  // console.table(skills);
});

test("normalizes abilities to limits", () => {
  expect(normalizeAbility(21)).toEqual(20);
  expect(normalizeAbility(0)).toEqual(1);
  expect(normalizeAbility(1)).toEqual(1);
  expect(normalizeAbility(10)).toEqual(10);
  expect(normalizeAbility(20)).toEqual(20);
  expect(normalizeAbility(-1)).toEqual(1);
});

test("normalizes modifiers to limits", () => {
  expect(normalizeModifier(21)).toEqual(3);
  expect(normalizeModifier(0)).toEqual(0);
  expect(normalizeModifier(-5)).toEqual(-3);
});

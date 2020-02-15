import {
  createPlayer,
  createRandomPlayer,
  randomSkill,
  normalizeAbility,
  normalizeModifier,
  addEffectToPlayer,
  applyEffects,
  normalizeCondition
} from "./player";
import { range } from "ramda";
import { normalCountryIds } from "./country";
import { PlayableCountries } from "../types/country";
import { AttributePlayerEffect, ZombiePlayerEffect } from "../types/player";

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
  const players = range(0, 1000).map(() => createRandomPlayer());

  players.forEach(player => {
    expect(typeof player.lastName).toBe("string");
    expect(typeof player.firstName).toBe("string");
    expect(player.firstName).toHaveLength(1);
    expect(countries).toContain(player.country);
  });
});

test("randomly generates skills", () => {
  normalCountryIds().forEach(c => {
    range(0, 500).map(() => {
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

test("adds an effect to a player", () => {
  const player = createRandomPlayer({
    skill: 10
  });

  const effect: AttributePlayerEffect = {
    type: "attribute",
    duration: 3,
    payload: [{ attribute: "skill", amount: 3 }]
  };

  expect(player.effects).toEqual([]);

  const player2 = addEffectToPlayer(effect, player);

  expect(player2.effects).toEqual([effect]);
});

test("two effects stack up correctly", () => {
  const player = createRandomPlayer({
    skill: 10,
    charisma: 10
  });

  const effect: AttributePlayerEffect = {
    type: "attribute",
    duration: 3,
    payload: [{ attribute: "charisma", amount: 10 }]
  };

  const effect2: ZombiePlayerEffect = {
    type: "zombie",
    duration: -1
  };

  expect(player.effects).toEqual([]);

  const player2 = addEffectToPlayer(effect2, addEffectToPlayer(effect, player));

  expect(player2.effects).toEqual([effect, effect2]);

  const applied = applyEffects(player2);

  expect(applied.pp).toEqual(-3);
  expect(applied.pk).toEqual(-3);
  expect(applied.charisma).toEqual(11);
});

test("condition is normalized correctly", () => {
  const values = [
    [18, 6, 5],
    [18, 5, 5],
    [18, 4, 4],
    [18, 0, 0],
    [18, -6, -6],
    [18, -8, -7],
    [33, 6, 1],
    [33, -8, -7],
    [19, 5, 5],
    [20, 5, 5],
    [21, 5, 4],
    [38, 2, 1],
    [15, 6, 5]
  ];

  for (const [age, condition, expectedCondition] of values) {
    expect(normalizeCondition(age, condition)).toEqual(expectedCondition);
  }
});

import { createPlayer, createRandomPlayer, randomSkill } from "./player";
import { range } from "ramda";

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
    console.log(player);
    expect(typeof player.lastName).toBe("string");
    expect(typeof player.firstName).toBe("string");
    expect(player.firstName).toHaveLength(1);
    expect(countries).toContain(player.country);
  });
});

test.only("random skillzor", () => {
  const fi = randomSkill("FI");

  const ee = randomSkill("EE");

  console.table(fi);
  console.table(ee);
});

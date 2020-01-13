import { createPlayer, createRandomPlayer } from "./player";
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
  const player = createPlayer("Lohiposki", "Gaylord", "NO", "c");

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

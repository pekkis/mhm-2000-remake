import { namesToIds, initialTeamStats } from "./team";
import { toPairs } from "ramda";
import util from "util";

test("should return ids for teams", () => {
  const ids = namesToIds(["HIFK", "TPS", "ässät"]);
  expect(ids.length).toEqual(3);

  ids.forEach(id => {
    console.log(id);
    expect(typeof id).toBe("string");
  });
});

test("should throw if all are not mapped", () => {
  expect(() => namesToIds(["HIFK", "TPS", "Lipaisuankat"])).toThrowError();
});

test("stats", () => {
  const pairs = toPairs(initialTeamStats());

  expect(pairs.length).toBe(48);

  console.log(util.inspect(pairs, false, 999));
});

import { doubleNormalizedInt } from "./random";
import { range, reduce } from "ramda";

test("weird randomizing", () => {
  const randomized = range(0, 100000).map(() => doubleNormalizedInt(100));

  const reduced = reduce(
    (a, r) => {
      a[r] = a[r] ? a[r] + 1 : 1;
      return a;
    },
    {},
    randomized
  );

  expect(reduced).not.toHaveProperty("100");
  expect(reduced).toHaveProperty("0");
  expect(reduced).toHaveProperty("99");

  expect(reduced[0]).toBeLessThan(reduced[10]);
  expect(reduced[10]).toBeLessThan(reduced[20]);
  expect(reduced[20]).toBeLessThan(reduced[30]);
  expect(reduced[30]).toBeLessThan(reduced[40]);
  expect(reduced[40]).toBeLessThan(reduced[50]);
  expect(reduced[60]).toBeLessThan(reduced[50]);
  expect(reduced[70]).toBeLessThan(reduced[60]);
  expect(reduced[80]).toBeLessThan(reduced[70]);
  expect(reduced[90]).toBeLessThan(reduced[80]);
  expect(reduced[99]).toBeLessThan(reduced[90]);
});

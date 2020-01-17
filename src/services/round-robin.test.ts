import scheduler, { roundRobin } from "./round-robin";
import { flatten, uniq, reduce, forEachObjIndexed } from "ramda";
import { ScheduleRound, ScheduleGame } from "../types/base";

test("round robin for equal number of teams", () => {
  const rr = roundRobin(12);
  expect(rr.length).toBe(11);

  for (const round of rr) {
    const flatted = flatten(round);
    expect(flatted.length).toEqual(12);
    expect(uniq(flatted).length).toEqual(12);
  }
});

test("schedules", () => {
  const schedule = scheduler(12, 2);
  expect(schedule.length).toBe(44);

  const reduced = reduce(
    (a, round: ScheduleRound) => {
      return reduce(
        (a, pairing: ScheduleGame) => {
          if (!a[pairing.home]) {
            a[pairing.home] = {
              home: 1,
              away: 0
            };
          } else {
            a[pairing.home].home += 1;
          }

          if (!a[pairing.away]) {
            a[pairing.away] = {
              home: 0,
              away: 1
            };
          } else {
            a[pairing.away].away += 1;
          }
          return a;
        },
        a,
        round
      );
    },
    {},
    schedule
  );

  forEachObjIndexed((team: any) => {
    expect(team?.home).toEqual(22);
    expect(team?.away).toEqual(22);
  }, reduced);

  //console.log(schedule);
});

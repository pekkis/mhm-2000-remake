import { Range } from "immutable";
import scheduler, { roundRobin } from "./services/round-robin";

const x = 12;
const n = 8;

const r = scheduler(12, 2);

console.log(r.toJS());

// const r = roundRobin(x);

const lussi = Range(1, x + 1)
  .toList()
  .map(i => {
    return r.reduce(
      (counts, round) => {
        const pairing = round.find(pairing => pairing.includes(i));
        if (!pairing) {
          return counts;
        }

        if (pairing.get("home") === i) {
          return {
            home: counts.home + 1,
            away: counts.away
          };
        } else {
          return {
            home: counts.home,
            away: counts.away + 1
          };
        }
      },
      { home: 0, away: 0 }
    );
  });

console.log(lussi.toJS());

const poop = r.map(r => {
  return r.filter(x => x.includes(n));
});

// console.log("schedule length", schedule.count());

// console.log("s", rr);

console.log("p1", poop.toJS());

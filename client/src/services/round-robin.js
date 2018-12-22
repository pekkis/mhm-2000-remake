import { Map, List, Range, Repeat } from "immutable";

const DUMMY = -1;

const getRange = n => {
  const range = Range(0, n).toList();

  if (n % 2 === 0) {
    return range.toList();
  }

  return range.push(DUMMY).toList();
};

const reverser = roundRobin => {
  return roundRobin.map(round => round.map(pairing => pairing.reverse()));
};

const scheduler = (numberOfTeams, times) => {
  const rr = roundRobin(numberOfTeams);
  const schedule = rr.concat(reverser(rr));

  return Repeat(schedule, times)
    .flatten(true)
    .map(round => {
      return round.map(pairing => {
        return Map({
          home: pairing.get(0),
          away: pairing.get(1)
        });
      });
    })
    .toList();
};

export const roundRobin = numberOfTeams => {
  const px = getRange(numberOfTeams);
  const n = px.count();

  const rs = Range(0, n - 1).map((j, k, i) => {
    const ps = px
      .take(1)
      .concat(px.takeLast(j))
      .concat(px.slice(1, n - j))
      .toArray();

    const r = Range(0, n / 2)
      .map(i => List.of(ps[i], ps[n - 1 - i]))
      .filterNot(pair => pair.includes(DUMMY))
      .toList();

    return j % 2 ? r : r.map(pair => pair.reverse());
  });

  return rs.toList();
};

export default scheduler;

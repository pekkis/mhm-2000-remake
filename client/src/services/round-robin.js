import { List, Range } from "immutable";

const DUMMY = -1;

const getRange = n => {
  const range = Range(1, n + 1).toList();

  if (n % 2 === 0) {
    return range.toList();
  }

  return range.push(DUMMY).toList();
};

export default numberOfTeams => {
  const px = getRange(numberOfTeams);
  const n = px.count();

  console.log("n", n);

  // const ps = px.toArray();

  const rs = Range(0, n - 1).map(j => {
    const ps = px
      .take(1)
      .concat(px.takeLast(j))
      .concat(px.slice(1, n - j))
      .toArray();

    const r = Range(0, n / 2)
      .map(
        i => [ps[i], ps[n - 1 - i]] // insert pair as a match
      )
      .filterNot(pair => pair.includes(DUMMY))
      .toArray();

    return r;
  });

  /*
  const rs = Range(1, n).map(j => {
    const r = Range(0, n / 2)
      .map(i => {
        return [ps[i], ps[n - 1 - i]];
      })
      .filterNot(pair => pair.includes(DUMMY));

    // for (var i = 0; i < n / 2; i += 1) {}
    ps.splice(1, 0, ps.pop()); // permutate for next round

    return r;
  });
  */

  return rs.toJS();
};

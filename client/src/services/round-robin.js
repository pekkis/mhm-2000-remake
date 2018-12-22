import { List, Range } from "immutable";

const DUMMY = -1;

const getRange = n => {
  const range = Range(1, n + 1).toList();

  if (n % 2 === 0) {
    return [n, range.toArray()];
  }

  return [n + 1, range.push(DUMMY).toArray()];
};

export default numberOfTeams => {
  const [n, ps] = getRange(numberOfTeams);

  const rs = Range(1, n).map(j => {
    // const r = []; // create inner match array for round j

    const r = Range(0, n / 2)
      .map(
        i => [ps[i], ps[n - 1 - i]] // insert pair as a match
      )
      .filterNot(pair => pair.includes(DUMMY))
      .toArray();

    ps.splice(1, 0, ps.pop()); // permutate for next round

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

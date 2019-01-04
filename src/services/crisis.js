import { Map } from "immutable";

import { CRISIS_COST, CRISIS_MORALE_MAX } from "../data/constants";

const crisis = (team, competitions) => {
  const division = competitions.get("division");

  const amount = division.get("teams").includes(team.get("id"))
    ? CRISIS_COST / 2
    : CRISIS_COST;

  return Map({
    amount
  });
};

export default crisis;

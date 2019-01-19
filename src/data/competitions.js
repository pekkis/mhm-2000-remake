import { Map } from "immutable";

import ehl from "./competitions/ehl";
import phl from "./competitions/phl";
import division from "./competitions/division";

const competitions = Map({
  phl,
  division,
  ehl
}).sortBy(c => c.get("weight"));

export default competitions;

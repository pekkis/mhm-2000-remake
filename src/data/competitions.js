import { Map } from "immutable";

import ehl from "./competitions/ehl";
import phl from "./competitions/phl";
import division from "./competitions/division";

import tournaments from "./competitions/tournaments";

const competitions = Map({
  phl,
  division,
  ehl,
  tournaments
}).sortBy(c => c.get("weight"));

export default competitions;

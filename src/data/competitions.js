import { Map } from "immutable";

import ehl from "./competitions/ehl";
import phl from "./competitions/phl";
import division from "./competitions/division";
import mutasarja from "./competitions/mutasarja";
import tournaments from "./competitions/tournaments";

const competitions = Map({
  phl,
  division,
  mutasarja,
  ehl,
  tournaments
}).sortBy(c => c.get("weight"));

export default competitions;

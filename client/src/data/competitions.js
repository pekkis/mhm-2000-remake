import { OrderedMap } from "immutable";

import ehl from "./competitions/ehl";
import phl from "./competitions/phl";
import division from "./competitions/division";

const competitions = OrderedMap({
  phl,
  division,
  ehl
});

export default competitions;

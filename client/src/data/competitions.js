import { Map } from "immutable";
import rr from "../services/round-robin";

import phl from "./competitions/phl";
import division from "./competitions/division";

const competitions = Map({
  phl,
  division
});

export default competitions;

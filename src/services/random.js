import Random from "random-js";
import { Range, List } from "immutable";

const random = new Random(Random.engines.mt19937().autoSeed());

export default random;

export const cinteger = (min, max) => {
  return Math.round(random.real(min, max));
};

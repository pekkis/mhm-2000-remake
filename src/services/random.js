import { Random, browserCrypto } from "random-js";

const random = new Random(browserCrypto);

export default random;

export const cinteger = (min, max) => {
  return Math.round(random.real(min, max));
};

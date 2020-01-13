import { Random } from "random-js";

let crypto;
if (typeof window !== "undefined") {
  crypto = require("random-js").browserCrypto;
} else {
  crypto = require("random-js").nodeCrypto;
}

const random = new Random(crypto);

export default random;

export const doubleNormalizedInt = (max: number) => {
  return Math.floor((random.real(0, 1) * max + random.real(0, 1) * max) / 2);
};

export const cinteger = (min: number, max: number) => {
  return Math.round(random.real(min, max));
};

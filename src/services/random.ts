import {
  Random,
  MersenneTwister19937,
  browserCrypto,
  type Engine
} from "random-js";

export const createRandom = (seed: number) => {
  return createRandomWithEngine(MersenneTwister19937.seed(seed));
};

export const createRandomWithEngine = (engine: Engine): Random => {
  const random = new Random(engine);

  return random;
};

const appSeed = import.meta.env.VITE_RANDOM_SEED
  ? Number(import.meta.env.VITE_RANDOM_SEED)
  : undefined;

const engine =
  appSeed !== undefined ? MersenneTwister19937.seed(appSeed) : browserCrypto;

if (appSeed !== undefined) {
  console.log(`[random] deterministic mode, seed: ${appSeed}`);
}

const defaultService = createRandomWithEngine(engine);

export default defaultService;

export const cinteger = (min: number, max: number, random = defaultService) => {
  return Math.round(random.real(min, max));
};

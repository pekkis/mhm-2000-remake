import {
  Random,
  MersenneTwister19937,
  browserCrypto,
  type Engine
} from "random-js";

export type RandomService = {
  integer: (min: number, max: number) => number;
  real: (min: number, max: number) => number;
  bool: (percentage?: number) => boolean;
  pick: <T>(array: T[]) => T;
  /**
   * "Classic integer" — a deliberately biased random integer generator preserved
   * from the original 1995–97 QB codebase. Uses Math.round on a continuous
   * uniform [min, max) real, which gives the min and max values approximately
   * HALF the probability of interior values.
   *
   * For example, cinteger(0, 4) produces:
   *   0 → ~12.5%  (only [0, 0.5) rounds to 0)
   *   1 → ~25%    ([0.5, 1.5) rounds to 1)
   *   2 → ~25%    ([1.5, 2.5) rounds to 2)
   *   3 → ~25%    ([2.5, 3.5) rounds to 3)
   *   4 → ~12.5%  ([3.5, 4.0) rounds to 4)
   *
   * This is NOT a bug — it's a feature. The game balance depends on this
   * distribution. Use integer() for uniform distribution.
   */
  cinteger: (min: number, max: number) => number;
};

export const createRandom = (seed: number) => {
  return createRandomWithEngine(MersenneTwister19937.seed(seed));
};

export const createRandomWithEngine = (engine: Engine): RandomService => {
  const random = new Random(engine);
  return {
    integer: (min, max) => random.integer(min, max),
    real: (min, max) => random.real(min, max),
    bool: (percentage) =>
      percentage !== undefined ? random.bool(percentage) : random.bool(),
    pick: (array) => random.pick(array),
    cinteger: (min, max) => Math.round(random.real(min, max))
  };
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

export const cinteger = defaultService.cinteger;

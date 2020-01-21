import { SeasonStrategy, SeasonStrategies, ForEvery } from "../types/base";

const strategies: ForEvery<SeasonStrategies, SeasonStrategy> = {
  simonov: {
    id: "simonov",
    name: "Juri Simonov",
    description: `Joukkueen huippukunto ajoittuu play-offeihin. Koko kesä treenataan täysillä, ja sarjan alkuvaihessa "pojat" tuppaavat olemaan hiukan väsyneitä. Loppua kohden tahti kuitenkin paranee, ja play-offeissa tahti on hirmuinen!`,
    initialReadiness: () => -22,
    incrementReadiness: turn => {
      if (turn.round >= 54) {
        return 0;
      }
      return 1;
    }
  } as SeasonStrategy,
  kaikkipeliin: {
    id: "kaikkipeliin",
    name: "Kaikki peliin!",
    description: `Kaikki pistetään peliin heti sarjan alusta alkaen! Tahti on kova, mutta "pojat" hiipuvat kevättä kohden melkoisesti...`,
    initialReadiness: () => 24,
    incrementReadiness: turn => {
      if (turn.round >= 54) {
        return 0;
      }

      if (turn.round > 44) {
        return -2;
      }

      // IF allgo = 1 AND kr > 35 THEN tre = tre - 1
      // IF allgo = 1 AND kr > 40 THEN tre = tre - 1

      // TODO: alterations?
      return -1;
    }
  } as SeasonStrategy,
  puurto: {
    id: "puurto",
    name: "Tasainen puurto",
    description: `Tasainen puurto läpi koko kauden, ei pahempia heilahteluja.`,
    initialReadiness: () => 0,
    incrementReadiness: () => 0
  } as SeasonStrategy
};

export default strategies;

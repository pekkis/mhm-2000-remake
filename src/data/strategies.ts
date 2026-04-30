export type Strategy = {
  id: number;
  name: string;
  description: string;
  initialReadiness: () => number;
  incrementReadiness: (turn: { round: number }) => number;
};

const strategies: Strategy[] = [
  {
    id: 0,
    name: "Juri Simonov",
    description: `Joukkueen huippukunto ajoittuu play-offeihin. Koko kesä treenataan täysillä, ja sarjan alkuvaihessa "pojat" tuppaavat olemaan hiukan väsyneitä. Loppua kohden tahti kuitenkin paranee, ja play-offeissa tahti on hirmuinen!`,
    initialReadiness: () => -22,
    incrementReadiness: (turn) => {
      if (turn.round >= 54) {
        return 0;
      }
      return 1;
    }
  },
  {
    id: 1,
    name: "Kaikki peliin!",
    description: `Kaikki pistetään peliin heti sarjan alusta alkaen! Tahti on kova, mutta "pojat" hiipuvat kevättä kohden melkoisesti...`,
    initialReadiness: () => 24,
    incrementReadiness: (turn) => {
      if (turn.round >= 54) {
        return 0;
      }

      if (turn.round > 44) {
        return -2;
      }

      return -1;
    }
  },
  {
    id: 2,
    name: "Tasainen puurto",
    description: `Tasainen puurto läpi koko kauden, ei pahempia heilahteluja.`,
    initialReadiness: () => 0,
    incrementReadiness: () => 0
  }
];

export default strategies;

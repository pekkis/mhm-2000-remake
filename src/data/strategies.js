import { List } from "immutable";

const strategies = List.of(
  {
    id: 0,
    name: "Juri Simonov",
    description: `Joukkueen huippukunto ajoittuu play-offeihin. Koko kesä treenataan täysillä, ja sarjan alkuvaihessa "pojat" tuppaavat olemaan hiukan väsyneitä. Loppua kohden tahti kuitenkin paranee, ja play-offeissa tahti on hirmuinen!`
  },
  {
    id: 1,
    name: "Kaikki peliin!",
    description: `Kaikki pistetään peliin heti sarjan alusta alkaen! Tahti on kova, mutta "pojat" hiipuvat kevättä kohden melkoisesti...`
  },
  {
    id: 2,
    name: "Tasainen puurto",
    description: `Tasainen puurto läpi koko kauden, ei pahempia heilahteluja.`
  }
);

export default strategies;

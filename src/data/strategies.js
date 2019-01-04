import { List, Map } from "immutable";

/*
IF strateg$ = "1" THEN jursi = 1: tre = -22: GOTO edderog
IF strateg$ = "2" THEN allgo = 1: tre = 24: GOTO edderog
IF strateg$ = "3" THEN tre = 0: GOTO edderog
*/

const strategies = List.of(
  Map({
    id: 0,
    name: "Juri Simonov",
    description: `Joukkueen huippukunto ajoittuu play-offeihin. Koko kesä treenataan täysillä, ja sarjan alkuvaihessa "pojat" tuppaavat olemaan hiukan väsyneitä. Loppua kohden tahti kuitenkin paranee, ja play-offeissa tahti on hirmuinen!`,
    initialReadiness: () => -22,
    incrementReadiness: turn => {
      if (turn.get("round") >= 54) {
        return 0;
      }
      return 1;
    }
  }),
  Map({
    id: 1,
    name: "Kaikki peliin!",
    description: `Kaikki pistetään peliin heti sarjan alusta alkaen! Tahti on kova, mutta "pojat" hiipuvat kevättä kohden melkoisesti...`,
    initialReadiness: () => 24,
    incrementReadiness: turn => {
      if (turn.get("round") >= 54) {
        return 0;
      }

      if (turn.get("round") > 44) {
        return -2;
      }

      // IF allgo = 1 AND kr > 35 THEN tre = tre - 1
      // IF allgo = 1 AND kr > 40 THEN tre = tre - 1

      // TODO: alterations?
      return -1;
    }
  }),
  Map({
    id: 2,
    name: "Tasainen puurto",
    description: `Tasainen puurto läpi koko kauden, ei pahempia heilahteluja.`,
    initialReadiness: () => 0,
    incrementReadiness: () => 0
  })
);

export default strategies;

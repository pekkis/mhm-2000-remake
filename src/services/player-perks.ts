import { ForEvery } from "../types/base";
import { PlayerPerkNames, PlayerPerkService, Player } from "../types/player";
import { identity, evolve, always } from "ramda";

/*
1: "VALAA USKOA MUIHIN",
2: "RUMAN KIELENKÄYTÖN MESTARI",
3: "RUMA JA OUTO MIES",
4: "ÄÄRIMMÄISEN LIHAVA",
5: "POLIISI",
6: "SAMBA SOI!",
7: "HAMINAATOR",
8: "RAHANAHNE SURFFAAJA",
9: "AILAHTELEVAINEN",
10: "ISI MAKSAA JOS PELAA",
11: "KUULUU MAAGISEEN TUTKAPARIIN",
12: "AGITAATTORI",
13: "ZOMBI",
*/

export const legacyPerkMap = {
  1: "leader",
  2: "tikitalk",
  3: "weirdo",
  4: "fatso",
  5: "enforcer",
  6: "samba",
  7: "haminator",
  8: "surfer",
  9: "unpredictable",
  10: "pappaBetalar",
  11: "dynamicDuo",
  12: "agitator",
  13: "zombie"
};

export const playerPerksMap: ForEvery<PlayerPerkNames, PlayerPerkService> = {
  leader: {
    label: "Valaa uskoa muihin",
    addToPlayer: evolve({
      leadership: val => Math.max(val, 11)
    })
  },
  tikitalk: {
    label: "Ruman kielenkäytön mestari",
    addToPlayer: identity
  },
  weirdo: {
    label: "Ruma ja outo mies",
    addToPlayer: identity
  },
  fatso: {
    label: "Äärimmäisen lihava",
    addToPlayer: identity
  },
  enforcer: {
    label: "Poliisi",
    addToPlayer: identity
  },
  samba: {
    label: "Samba soi!",
    addToPlayer: identity
  },
  haminator: {
    label: "Haminator",
    addToPlayer: identity
  },
  surfer: {
    label: "Rahanahne surffaaja",
    addToPlayer: evolve({
      ego: val => Math.max(val, 11)
    })
  },
  unpredictable: {
    label: "Ailahtelevainen",
    addToPlayer: identity
  },
  pappaBetalar: {
    label: "Isi maksaa",
    addToPlayer: identity
  },
  dynamicDuo: {
    label: "Maaginen tutkapari",
    addToPlayer: identity
  },
  agitator: { label: "Agitaattori", addToPlayer: identity },
  zombie: {
    label: "Zombi",
    addToPlayer: evolve({
      skill: always(1),
      pp: always(-3),
      pk: always(-3),
      leadership: always(1),
      charisma: always(1)
    })
  }
};

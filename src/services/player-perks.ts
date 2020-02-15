import { ForEvery } from "../types/base";
import { PlayerPerkNames, Player } from "../types/player";
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

export interface PlayerPerkService {
  weight: number;
  label: string;
  addToPlayer: (player: Player) => Player;
  applyEffect: (player: Player) => Player;
}

export const playerPerksMap: ForEvery<PlayerPerkNames, PlayerPerkService> = {
  leader: {
    weight: 1000,
    applyEffect: (player: Player) => {
      return evolve(
        {
          skill: val => val * 0.7
        },
        player
      );
    },
    label: "Valaa uskoa muihin",
    addToPlayer: evolve({
      leadership: val => Math.max(val, 11)
    })
  },
  tikitalk: {
    weight: 1000,
    applyEffect: identity,
    label: "Ruman kielenkäytön mestari",
    addToPlayer: identity
  },
  weirdo: {
    weight: 1000,
    applyEffect: identity,
    label: "Ruma ja outo mies",
    addToPlayer: identity
  },
  fatso: {
    weight: 1000,
    applyEffect: identity,
    label: "Äärimmäisen lihava",
    addToPlayer: identity
  },
  enforcer: {
    weight: 1000,
    applyEffect: identity,
    label: "Poliisi",
    addToPlayer: identity
  },
  samba: {
    weight: 1000,
    applyEffect: identity,
    label: "Samba soi!",
    addToPlayer: identity
  },
  haminator: {
    weight: 1000,
    applyEffect: identity,
    label: "Haminator",
    addToPlayer: identity
  },
  surfer: {
    weight: 1000,
    applyEffect: identity,
    label: "Rahanahne surffaaja",
    addToPlayer: evolve({
      ego: val => Math.max(val, 11)
    })
  },
  unpredictable: {
    weight: 1000,
    applyEffect: identity,
    label: "Ailahtelevainen",
    addToPlayer: identity
  },
  pappaBetalar: {
    weight: 1000,
    applyEffect: identity,
    label: "Isi maksaa",
    addToPlayer: identity
  },
  dynamicDuo: {
    weight: 1000,
    applyEffect: identity,
    label: "Maaginen tutkapari",
    addToPlayer: identity
  },
  agitator: {
    label: "Agitaattori",
    addToPlayer: identity,
    weight: 1000,
    applyEffect: identity
  },
  zombie: {
    weight: 1000,
    applyEffect: identity,
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

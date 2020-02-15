import {
  PlayerEffect,
  Player,
  ZombiePlayerEffect,
  AttributePlayerEffect
} from "../types/player";
import { MapOf } from "../types/base";
import { evolve, always, indexBy, prop, mapObjIndexed } from "ramda";

export const isZombiePlayerEffect = (
  effect: PlayerEffect
): effect is ZombiePlayerEffect => {
  return effect.type === "zombie";
};

export const isAttributePlayerEffect = (
  effect: PlayerEffect
): effect is AttributePlayerEffect => {
  return effect.type === "attribute";
};

interface PlayerEffectService {
  weight: number;
  applyEffect: (effect: PlayerEffect, Player: Player) => Player;
}

export const playerEffectHandlers: MapOf<PlayerEffectService> = {
  zombie: {
    weight: 1000,
    applyEffect: (effect: PlayerEffect, player: Player) => {
      if (!isZombiePlayerEffect(effect)) {
        throw new Error("Expected zombie player effect");
      }

      return evolve(
        {
          pp: always(-3),
          pk: always(-3),
          leadership: always(1),
          charisma: always(1)
        },
        player
      );
    }
  },
  attribute: {
    weight: 2000,
    applyEffect: (effect: PlayerEffect, player: Player) => {
      if (!isAttributePlayerEffect(effect)) {
        throw new Error("Expected attribute player effect");
      }

      const evolver = effect.payload.reduce((obj, skill) => {
        obj[skill.attribute] = (val: number) => val + skill.amount;
        return obj;
      }, {});

      return evolve(evolver, player);
    }
  }
};

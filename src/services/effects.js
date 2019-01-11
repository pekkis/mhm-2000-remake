import isString from "lodash/isString";
import namedEffects from "../data/named-effects";

const affect = (target, source, field) => {
  const effects = source.get(field);
  return effects.reduce((obj, effect) => {
    console.log("effu", effect.toJS());

    const parameter = effect.get("parameter");

    const amount = effect.get("amount");
    if (isString(amount)) {
      console.log("PUUPPA FACKIN DOORE", amount);
      const namedEffect = namedEffects.get(amount);
      if (!namedEffect) {
        throw new Error(`Unknown named effect "${amount}"`);
      }
      return obj.updateIn(parameter, p => {
        return namedEffect(p, effect.get("extra"));
      });
    } else {
      return obj.updateIn(parameter, p => {
        return p + effect.get("amount");
      });
    }
  }, target);
};

export const getEffective = obj => {
  return affect(obj, obj, "effects");
};

export const getEffectiveOpponent = (obj, opponent) => {
  return affect(obj, opponent, "opponentEffects");
};

const affect = (target, source, field) => {
  const effects = source.get(field);
  return effects.reduce((obj, effect) => {
    const parameter = effect.get("parameter");
    return obj.updateIn(parameter, p => {
      return p + effect.get("amount");
    });
  }, target);
};

export const getEffective = obj => {
  return affect(obj, obj, "effects");
};

export const getEffectiveOpponent = (obj, opponent) => {
  return affect(obj, opponent, "opponentEffects");
};

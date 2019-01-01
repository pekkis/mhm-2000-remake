export const getEffective = obj => {
  const effects = obj.get("effects");
  return effects.reduce((obj, effect) => {
    const parameter = effect.get("parameter");
    return obj.updateIn(parameter, p => {
      return p + effect.get("amount");
    });
  }, obj);
};

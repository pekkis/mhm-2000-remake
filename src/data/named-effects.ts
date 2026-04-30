type NamedEffectFn = (
  current: number,
  extra: Record<string, unknown>
) => number;

const namedEffects: Record<string, NamedEffectFn> = {
  rally: (_morale, extra) => extra.rallyMorale as number
};

export default namedEffects;

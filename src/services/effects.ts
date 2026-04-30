import namedEffects from "@/data/named-effects";
import type { Team, TeamEffect } from "@/state/game";

const affect = (
  target: Team,
  source: Team,
  field: "effects" | "opponentEffects"
): Team => {
  const effects: TeamEffect[] = source[field];
  return effects.reduce((obj: Team, effect: TeamEffect) => {
    const key = effect.parameter[0] as keyof Team;
    const amount = effect.amount;

    if (typeof amount === "string") {
      const namedEffect = namedEffects[amount];
      if (!namedEffect) {
        throw new Error(`Unknown named effect "${amount}"`);
      }
      return {
        ...obj,
        [key]: namedEffect(obj[key] as number, effect.extra ?? {})
      };
    }

    return { ...obj, [key]: (obj[key] as number) + amount };
  }, target);
};

export const getEffective = (obj: Team): Team => {
  return affect(obj, obj, "effects");
};

export const getEffectiveOpponent = (obj: Team, opponent: Team): Team => {
  return affect(obj, opponent, "opponentEffects");
};

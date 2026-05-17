import type { GameContext } from "@/state/game-context";
import type { Draft } from "immer";
import { values } from "remeda";

export const decrementPlayerEffects = (draft: Draft<GameContext>) => {
  // player effects
  for (const team of draft.teams) {
    if (team.kind === "human") {
      for (const player of values(team.players)) {
        player.effects = player.effects.map((effect) => {
          if (
            effect.type === "injury" ||
            effect.type === "suspension" ||
            effect.type === "skill"
          ) {
            return {
              ...effect,
              duration: effect.duration - 1
            };
          }

          return effect;
        });
      }
    }
  }
};

export const expirePlayerEffects = (draft: Draft<GameContext>) => {
  for (const team of draft.teams) {
    if (team.kind === "human") {
      for (const player of values(team.players)) {
        player.tags = player.tags.filter((t) => !t.startsWith("irritated:"));

        player.effects = player.effects.filter((effect) => {
          if (
            effect.type === "injury" ||
            effect.type === "suspension" ||
            effect.type === "skill"
          ) {
            if (effect.duration === 0) {
              return false;
            }

            return true;
          }

          return true;
        });
      }
    }
  }
};

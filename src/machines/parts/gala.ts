import type { GameContext } from "@/state/game-context";
import type { Draft } from "immer";

export const runGala = (draft: Draft<GameContext>) => {
  const push = (line: string) => {
    draft.news.news.push(line);
  };

  push(`GALA HERE!!`);
};

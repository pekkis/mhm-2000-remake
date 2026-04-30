import { createActorRefContext } from "@/lib/createActorRefContext";
import { gameMachine } from "@/machines/game";
import type { ContextSelector } from "@/machines/selectors";

export const GameMachineContext = createActorRefContext(gameMachine);

/**
 * Read derived data from `gameMachine.context` using a `ContextSelector`.
 *
 * Thin wrapper over `GameMachineContext.useSelector` — the underlying
 * hook receives a snapshot, but our existing selector library is shaped
 * around plain `GameContext`. Components using these selectors don't
 * need to know about the snapshot wrapper.
 */
export const useGameContext = <T>(selector: ContextSelector<T>): T =>
  GameMachineContext.useSelector((snap) => selector(snap.context));

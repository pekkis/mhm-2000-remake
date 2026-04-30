import { createContext, useContext, type ReactNode } from "react";
import { useSelector as useXStateSelector } from "@xstate/react";
import type { ActorRefFrom, AnyStateMachine, SnapshotFrom } from "xstate";

/**
 * Lightweight equivalent of `@xstate/react`'s `createActorContext`, but for
 * actors that are *not* the root — typically children spawned/invoked inside
 * another machine. The caller is responsible for fetching the actor (via
 * `parent.system.get(...)` or similar) and passing it to `<Provider actor={...}>`.
 *
 * The Provider is dumb on purpose: render it only where the actor exists.
 */
export const createActorRefContext = <TMachine extends AnyStateMachine>(
  _machine: TMachine
) => {
  type Ref = ActorRefFrom<TMachine>;
  type Snapshot = SnapshotFrom<TMachine>;

  const Ctx = createContext<Ref | null>(null);

  const Provider = ({
    actor,
    children
  }: {
    actor: Ref;
    children: ReactNode;
  }) => <Ctx.Provider value={actor}>{children}</Ctx.Provider>;

  const useActorRef = (): Ref => {
    const ref = useContext(Ctx);
    if (!ref) {
      throw new Error(
        "createActorRefContext: missing Provider higher in the tree"
      );
    }
    return ref;
  };

  const useSelector = <T,>(
    selector: (snapshot: Snapshot) => T,
    compare?: (a: T, b: T) => boolean
  ): T =>
    useXStateSelector(
      useActorRef(),
      selector as (snapshot: unknown) => T,
      compare
    );

  return { Provider, useActorRef, useSelector };
};

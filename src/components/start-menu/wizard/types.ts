import type { ActorRefFrom } from "xstate";
import type { newGameMachine } from "@/machines/new-game";

export type WizardStepProps = {
  actor: ActorRefFrom<typeof newGameMachine>;
};

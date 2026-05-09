import { createActorContext } from "@xstate/react";
import { appMachine } from "@/machines/app";

export const AppMachineContext = createActorContext(appMachine, {
  id: "mhm2000"
});

import ManagerForm from "@/components/start-menu/ManagerForm";
import { AppMachineContext } from "@/context/app-machine-context";
import type { FC } from "react";

export const Starting: FC = () => {
  const app = AppMachineContext.useActorRef();

  const teams = AppMachineContext.useSelector(
    (state) => state.context.pending!.teams
  );

  const competitions = AppMachineContext.useSelector(
    (state) => state.context.pending!.competitions
  );

  return (
    <ManagerForm
      teams={teams}
      competitions={competitions}
      advance={(payload) => {
        app.send({ type: "ADD_MANAGER", payload });
      }}
    />
  );
};

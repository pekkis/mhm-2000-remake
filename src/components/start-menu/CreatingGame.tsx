/**
 * Routes the new-game wizard child actor's state to the right step
 * component. Each step component talks to the spawned wizard actor
 * directly via `useNewGameActor`.
 */

import type { FC } from "react";
import Box from "@/components/ui/Box";
import Stack from "@/components/ui/Stack";
import Heading from "@/components/ui/Heading";
import { AppMachineContext } from "@/context/app-machine-context";
import { useSelector } from "@xstate/react";
import type { ActorRefFrom } from "xstate";
import type { newGameMachine } from "@/machines/new-game";

import StepManagerCount from "@/components/start-menu/wizard/StepManagerCount";
import StepName from "@/components/start-menu/wizard/StepName";
import StepNationality from "@/components/start-menu/wizard/StepNationality";
import StepExperience from "@/components/start-menu/wizard/StepExperience";
import StepDifficulty from "@/components/start-menu/wizard/StepDifficulty";
import StepTeam from "@/components/start-menu/wizard/StepTeam";
import StepAttributes from "@/components/start-menu/wizard/StepAttributes";
import StepAskMore from "@/components/start-menu/wizard/StepAskMore";
import StepPeckingOrder from "@/components/start-menu/wizard/StepPeckingOrder";

type WizardActorRef = ActorRefFrom<typeof newGameMachine>;

const WizardSwitch: FC<{ actor: WizardActorRef }> = ({ actor }) => {
  const value = useSelector(actor, (s) => s.value);

  if (value === "pickManagerCount") {
    return <StepManagerCount actor={actor} />;
  }
  if (typeof value === "object" && "managerLoop" in value) {
    const sub = value.managerLoop;
    switch (sub) {
      case "name":
        return <StepName actor={actor} />;
      case "nationality":
        return <StepNationality actor={actor} />;
      case "experience":
        return <StepExperience actor={actor} />;
      case "difficulty":
        return <StepDifficulty actor={actor} />;
      case "team":
        return <StepTeam actor={actor} />;
      case "attributes":
        return <StepAttributes actor={actor} />;
    }
  }
  if (value === "askMore") {
    return <StepAskMore actor={actor} />;
  }
  if (value === "peckingOrder") {
    return <StepPeckingOrder actor={actor} />;
  }
  return null;
};

export const CreatingGame: FC = () => {
  // The wizard is `invoke`d on the app machine with `id: "newGame"`.
  // Reach in through `state.children` to get a typed handle.
  const wizard = AppMachineContext.useSelector(
    (state) => state.children.newGame as WizardActorRef | undefined
  );

  if (!wizard) {
    return (
      <Box textAlign="center">
        <Heading level={2}>Käynnistetään uutta peliä...</Heading>
      </Box>
    );
  }

  return (
    <Stack gap="md">
      <WizardSwitch actor={wizard} />
    </Stack>
  );
};

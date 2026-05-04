import type { FC } from "react";
import Stack from "@/components/ui/Stack";
import Cluster from "@/components/ui/Cluster";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Markdown from "@/components/Markdown";
import type { WizardStepProps } from "@/components/start-menu/wizard/types";
import { managerExperiences } from "@/data/mhm2000/manager-experience";
import {
  EXPERIENCE_HEADLINE,
  EXPERIENCE_INTRO
} from "@/data/mhm2000/wizard-strings";

const StepExperience: FC<WizardStepProps> = ({ actor }) => {
  return (
    <Stack gap="md">
      <Heading level={2}>{EXPERIENCE_HEADLINE}</Heading>
      <Markdown>{EXPERIENCE_INTRO}</Markdown>
      <Stack gap="sm">
        {managerExperiences.map((e) => (
          <Button
            key={e.id}
            onClick={() =>
              actor.send({ type: "SET_EXPERIENCE", experience: e.id })
            }
          >
            <strong>{e.name}</strong> — {e.description}
          </Button>
        ))}
      </Stack>
      <Cluster gap="sm">
        <Button secondary onClick={() => actor.send({ type: "BACK" })}>
          Edellinen
        </Button>
      </Cluster>
    </Stack>
  );
};

export default StepExperience;

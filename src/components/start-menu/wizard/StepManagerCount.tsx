import type { FC } from "react";
import Cluster from "@/components/ui/Cluster";
import Stack from "@/components/ui/Stack";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import type { WizardStepProps } from "@/components/start-menu/wizard/types";
import { MANAGER_COUNT_HEADLINE } from "@/data/mhm2000/wizard-strings";

const StepManagerCount: FC<WizardStepProps> = ({ actor }) => {
  return (
    <Stack gap="md">
      <Heading level={2}>{MANAGER_COUNT_HEADLINE}</Heading>
      <Paragraph>Yksi tai useampi pelaaja samalla koneella.</Paragraph>
      <Cluster gap="sm">
        {([1, 2, 3, 4] as const).map((n) => (
          <Button
            key={n}
            onClick={() => actor.send({ type: "SET_MANAGER_COUNT", count: n })}
          >
            {n}
          </Button>
        ))}
      </Cluster>
      <Cluster gap="sm">
        <Button secondary onClick={() => actor.send({ type: "CANCEL" })}>
          Takaisin valikkoon
        </Button>
      </Cluster>
    </Stack>
  );
};

export default StepManagerCount;

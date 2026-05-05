import type { FC } from "react";
import Stack from "@/components/ui/Stack";
import Cluster from "@/components/ui/Cluster";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import type { WizardStepProps } from "@/components/start-menu/wizard/types";
import { countriesArray } from "@/data/countries";
import { NATIONALITY_HEADLINE } from "@/data/mhm2000/wizard-strings";

const StepNationality: FC<WizardStepProps> = ({ actor }) => {
  return (
    <Stack gap="md">
      <Heading level={2}>{NATIONALITY_HEADLINE}</Heading>
      <Cluster gap="sm">
        {countriesArray.map((c) => (
          <Button
            key={c.iso}
            onClick={() =>
              actor.send({ type: "SET_NATIONALITY", nationality: c.iso })
            }
            secondary
          >
            {c.name}
          </Button>
        ))}
      </Cluster>
      <Cluster gap="sm">
        <Button secondary onClick={() => actor.send({ type: "BACK" })}>
          Edellinen
        </Button>
      </Cluster>
    </Stack>
  );
};

export default StepNationality;

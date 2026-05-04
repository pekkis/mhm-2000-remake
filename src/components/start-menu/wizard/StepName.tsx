import type { FC } from "react";
import { useState } from "react";
import { useSelector } from "@xstate/react";
import Stack from "@/components/ui/Stack";
import Cluster from "@/components/ui/Cluster";
import Heading from "@/components/ui/Heading";
import Field from "@/components/ui/form/Field";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/Input";
import Button from "@/components/ui/Button";
import type { WizardStepProps } from "@/components/start-menu/wizard/types";

const StepName: FC<WizardStepProps> = ({ actor }) => {
  const drafts = useSelector(actor, (s) => s.context.drafts.length);
  const [name, setName] = useState("");

  const submit = () => {
    const final = name.trim() || `Manageri ${drafts + 1}`;
    actor.send({ type: "SET_NAME", name: final });
  };

  return (
    <Stack gap="md">
      <Heading level={2}>Manageri {drafts + 1} — Nimi</Heading>
      <Field>
        <Label>Managerin nimi</Label>
        <Input
          block
          value={name}
          maxLength={21}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
      </Field>
      <Cluster gap="sm">
        <Button onClick={submit}>Eteenpäin</Button>
      </Cluster>
    </Stack>
  );
};

export default StepName;

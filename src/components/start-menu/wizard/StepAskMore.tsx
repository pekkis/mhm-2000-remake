import type { FC } from "react";
import { useSelector } from "@xstate/react";
import Stack from "@/components/ui/Stack";
import Cluster from "@/components/ui/Cluster";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Button from "@/components/ui/Button";
import type { WizardStepProps } from "@/components/start-menu/wizard/types";

const StepAskMore: FC<WizardStepProps> = ({ actor }) => {
  const drafts = useSelector(actor, (s) => s.context.drafts.length);
  const total = useSelector(actor, (s) => s.context.managerCount ?? 1);
  const canMore = drafts < total;

  return (
    <Stack gap="md">
      <Heading level={2}>Lisää manageri?</Heading>
      <Paragraph>
        Managereita lisätty: <strong>{drafts}</strong> / {total}
      </Paragraph>
      <Cluster gap="sm">
        {canMore && (
          <Button onClick={() => actor.send({ type: "ADD_MORE" })}>
            Lisää uusi manageri
          </Button>
        )}
        <Button onClick={() => actor.send({ type: "FINISH_ADDING" })}>
          Jatka eteenpäin
        </Button>
      </Cluster>
    </Stack>
  );
};

export default StepAskMore;

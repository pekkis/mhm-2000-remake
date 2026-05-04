import type { FC } from "react";
import Stack from "@/components/ui/Stack";
import Cluster from "@/components/ui/Cluster";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Markdown from "@/components/Markdown";
import type { WizardStepProps } from "@/components/start-menu/wizard/types";
import type { PeckingOrder } from "@/machines/new-game";
import {
  PECKING_ORDER_HEADLINE,
  PECKING_ORDER_LABELS,
  PECKING_ORDER_HELP
} from "@/data/mhm2000/wizard-strings";

const ORDERS: readonly PeckingOrder[] = [
  // Match the QB on-screen order (REILU / REALISTINEN / SATUNNAINEN —
  // worst-first, best-first, random; MHM2K.BAS:597-600).
  "worst-first",
  "best-first",
  "random"
];

const StepPeckingOrder: FC<WizardStepProps> = ({ actor }) => {
  return (
    <Stack gap="md">
      <Heading level={2}>{PECKING_ORDER_HEADLINE}</Heading>
      <Stack gap="sm">
        {ORDERS.map((id) => (
          <Stack key={id} gap="xs">
            <Button
              onClick={() =>
                actor.send({ type: "SET_PECKING_ORDER", order: id })
              }
            >
              {PECKING_ORDER_LABELS[id]}
            </Button>
            <Markdown>{PECKING_ORDER_HELP[id]}</Markdown>
          </Stack>
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

export default StepPeckingOrder;

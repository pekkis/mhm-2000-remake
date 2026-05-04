import type { FC } from "react";
import Stack from "@/components/ui/Stack";
import Cluster from "@/components/ui/Cluster";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Button from "@/components/ui/Button";
import type { WizardStepProps } from "@/components/start-menu/wizard/types";
import type { PeckingOrder } from "@/machines/new-game";

const ORDERS: { id: PeckingOrder; label: string; help: string }[] = [
  {
    id: "best-first",
    label: "Vahvin ensin",
    help: "Edelliskauden parhaat sijoitukset alkavat."
  },
  {
    id: "worst-first",
    label: "Heikoin ensin",
    help: "Edelliskauden heikoimmat sijoitukset alkavat."
  },
  {
    id: "random",
    label: "Satunnainen",
    help: "Reilu arpa joka kausi."
  }
];

const StepPeckingOrder: FC<WizardStepProps> = ({ actor }) => {
  return (
    <Stack gap="md">
      <Heading level={2}>Pelijärjestys</Heading>
      <Paragraph>
        Lasketaan uudelleen jokaisen kauden alussa. (Hate-ruutu — tulossa
        myöhemmin.)
      </Paragraph>
      <Stack gap="sm">
        {ORDERS.map((o) => (
          <Button
            key={o.id}
            onClick={() =>
              actor.send({ type: "SET_PECKING_ORDER", order: o.id })
            }
          >
            <strong>{o.label}</strong> — {o.help}
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

export default StepPeckingOrder;

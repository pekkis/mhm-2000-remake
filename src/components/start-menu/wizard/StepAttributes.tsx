import type { FC } from "react";
import { useMemo, useState } from "react";
import { useSelector } from "@xstate/react";
import Stack from "@/components/ui/Stack";
import Cluster from "@/components/ui/Cluster";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Button from "@/components/ui/Button";
import type { WizardStepProps } from "@/components/start-menu/wizard/types";
import type { ManagerAttributes, ManagerAttributeKey } from "@/data/managers";
import { characterPointsForDifficulty } from "@/machines/new-game";

const ATTRIBUTE_LABELS: Record<ManagerAttributeKey, string> = {
  strategy: "Strategiat",
  specialTeams: "Erikoistilanteet",
  negotiation: "Neuvottelutaito",
  resourcefulness: "Neuvokkuus",
  charisma: "Karisma",
  luck: "Onnekkuus"
};

const ATTRIBUTE_KEYS: readonly ManagerAttributeKey[] = [
  "strategy",
  "specialTeams",
  "negotiation",
  "resourcefulness",
  "charisma",
  "luck"
];

const ZERO_ATTRS: ManagerAttributes = {
  strategy: 0,
  specialTeams: 0,
  negotiation: 0,
  resourcefulness: 0,
  charisma: 0,
  luck: 0
};

const sumAbs = (attrs: ManagerAttributes): number =>
  ATTRIBUTE_KEYS.reduce((acc, k) => acc + Math.abs(attrs[k]), 0);

const StepAttributes: FC<WizardStepProps> = ({ actor }) => {
  const difficulty = useSelector(actor, (s) => s.context.current.difficulty);
  const pool = useMemo(
    () => (difficulty ? characterPointsForDifficulty(difficulty) : 0),
    [difficulty]
  );

  const [attrs, setAttrs] = useState<ManagerAttributes>(ZERO_ATTRS);
  const spent = sumAbs(attrs);
  const remaining = pool - spent;

  const adjust = (key: ManagerAttributeKey, delta: number) => {
    const current = attrs[key];
    const next = current + delta;
    if (next < -3 || next > 3) {
      return;
    }
    // Spending check: each tick costs |new| - |current|.
    const cost = Math.abs(next) - Math.abs(current);
    if (cost > remaining) {
      return;
    }
    setAttrs({ ...attrs, [key]: next });
  };

  const submit = () => {
    actor.send({ type: "SET_ATTRIBUTES", attributes: attrs });
  };

  return (
    <Stack gap="md">
      <Heading level={2}>Ominaisuudet</Heading>
      <Paragraph>
        Käytä luonteenpisteet (välillä −3..+3 per ominaisuus). Pisteitä
        jäljellä: <strong>{remaining}</strong> / {pool}.
      </Paragraph>
      <Stack gap="sm">
        {ATTRIBUTE_KEYS.map((k) => (
          <Cluster key={k} gap="sm" justify="space-between">
            <span>
              {ATTRIBUTE_LABELS[k]}:{" "}
              <strong>
                {attrs[k] >= 0 ? "+" : ""}
                {attrs[k]}
              </strong>
            </span>
            <Cluster gap="xs">
              <Button secondary terse onClick={() => adjust(k, -1)}>
                −
              </Button>
              <Button secondary terse onClick={() => adjust(k, 1)}>
                +
              </Button>
            </Cluster>
          </Cluster>
        ))}
      </Stack>
      <Cluster gap="sm">
        <Button onClick={submit} disabled={remaining !== 0}>
          Vahvista
        </Button>
        <Button secondary onClick={() => actor.send({ type: "BACK" })}>
          Edellinen
        </Button>
      </Cluster>
    </Stack>
  );
};

export default StepAttributes;

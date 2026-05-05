import type { FC } from "react";
import { useMemo, useState } from "react";
import { useSelector } from "@xstate/react";
import Stack from "@/components/ui/Stack";
import Cluster from "@/components/ui/Cluster";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Markdown from "@/components/Markdown";
import type { WizardStepProps } from "@/components/start-menu/wizard/types";
import type { ManagerAttributes, ManagerAttributeKey } from "@/data/managers";
import { characterPointsForDifficulty } from "@/machines/new-game";
import {
  ATTRIBUTES_INTRO,
  ATTRIBUTES_POINTS_LABEL,
  ATTRIBUTE_HELP,
  ATTRIBUTE_LABELS
} from "@/data/mhm2000/wizard-strings";

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

const signedSum = (attrs: ManagerAttributes): number =>
  ATTRIBUTE_KEYS.reduce((acc, k) => acc + attrs[k], 0);

const StepAttributes: FC<WizardStepProps> = ({ actor }) => {
  const difficulty = useSelector(actor, (s) => s.context.current.difficulty);
  const pool = useMemo(
    () => (difficulty ? characterPointsForDifficulty(difficulty) : 0),
    [difficulty]
  );

  const [attrs, setAttrs] = useState<ManagerAttributes>(ZERO_ATTRS);
  const [focused, setFocused] = useState<ManagerAttributeKey>("strategy");
  const remaining = pool - signedSum(attrs);

  const adjust = (key: ManagerAttributeKey, delta: number) => {
    const current = attrs[key];
    const next = current + delta;
    if (next < -3 || next > 3) {
      return;
    }
    // Positive delta costs a point; negative delta refunds one.
    if (delta > remaining) {
      return;
    }
    setFocused(key);
    setAttrs({ ...attrs, [key]: next });
  };

  const submit = () => {
    actor.send({ type: "SET_ATTRIBUTES", attributes: attrs });
  };

  return (
    <Stack gap="md">
      <Markdown>{ATTRIBUTES_INTRO}</Markdown>
      <Heading level={3}>
        {ATTRIBUTES_POINTS_LABEL}: <strong>{remaining}</strong> / {pool}
      </Heading>
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
              <Button
                secondary
                terse
                onClick={() => {
                  setFocused(k);
                  adjust(k, -1);
                }}
              >
                −
              </Button>
              <Button
                secondary
                terse
                onClick={() => {
                  setFocused(k);
                  adjust(k, 1);
                }}
              >
                +
              </Button>
            </Cluster>
          </Cluster>
        ))}
      </Stack>
      <Markdown>{ATTRIBUTE_HELP[focused]}</Markdown>
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

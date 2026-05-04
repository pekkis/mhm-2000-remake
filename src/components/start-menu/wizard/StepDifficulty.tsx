import type { FC } from "react";
import Stack from "@/components/ui/Stack";
import Cluster from "@/components/ui/Cluster";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Markdown from "@/components/Markdown";
import type { WizardStepProps } from "@/components/start-menu/wizard/types";
import {
  difficultyLevels as mhm2kDifficulty,
  type DifficultyLevelId
} from "@/data/mhm2000/difficulty-levels";
import {
  DIFFICULTY_HEADLINE,
  DIFFICULTY_HELP
} from "@/data/mhm2000/wizard-strings";

const StepDifficulty: FC<WizardStepProps> = ({ actor }) => {
  return (
    <Stack gap="md">
      <Heading level={2}>{DIFFICULTY_HEADLINE}</Heading>
      <Stack gap="sm">
        {mhm2kDifficulty.map((d) => (
          <Stack key={d.id} gap="xs">
            <Button
              onClick={() =>
                actor.send({
                  type: "SET_DIFFICULTY",
                  difficulty: d.id as DifficultyLevelId
                })
              }
            >
              <strong>{d.name}</strong> — luonteenpisteitä: {d.characterPoints}
            </Button>
            <Markdown>{DIFFICULTY_HELP[d.id - 1]!}</Markdown>
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

export default StepDifficulty;

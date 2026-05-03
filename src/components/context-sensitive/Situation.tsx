import type { FC } from "react";
import Streaks from "@/components/Streaks";
import type { Team } from "@/state/game";
import type { Manager } from "@/state/game";
import type { Competition } from "@/types/competitions";
import Box from "@/components/ui/Box";
import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";
import PhaseStatus from "@/components/context-sensitive/PhaseStatus";

type SituationProps = {
  competitions: Record<string, Competition>;
  interesting: string[];
  teams: Team[];
  manager: Manager;
};

const Situation: FC<SituationProps> = ({
  competitions,
  interesting,
  teams,
  manager
}) => {
  return (
    <Box>
      <Stack gap="md">
        <Heading level={2}>Tilannekatsaus</Heading>

        {interesting
          .map((i) => competitions[i])
          .map((competition) => {
            const phaseNo = competition.phase;
            const phase = competition.phases[phaseNo];

            return (
              <Box key={competition.id}>
                <Stack gap="md">
                  <Heading level={3}>{competition.name}</Heading>

                  <Streaks competition={competition.id} team={manager.team!} />

                  <PhaseStatus manager={manager} phase={phase} teams={teams} />
                </Stack>
              </Box>
            );
          })}
      </Stack>
    </Box>
  );
};

export default Situation;

import type { FC } from "react";
import Button from "@/components/ui/Button";
import Stack from "@/components/ui/Stack";
import type { Team } from "@/state/game";
import type { Manager } from "@/state/manager";
import type { Competition } from "@/types/competitions";
import Heading from "@/components/ui/Heading";

type SelectVictimProps = {
  competition: Competition;
  manager: Manager;
  selectVictim: (teamId: number) => void;
  teams: Team[];
  cancel: (...args: any[]) => void;
  prank?: unknown;
};

const SelectVictim: FC<SelectVictimProps> = ({
  competition,
  manager,
  selectVictim,
  teams,
  cancel
}) => {
  return (
    <Stack gap="sm">
      <Heading level={3}>Valitse uhrisi</Heading>
      <Stack>
        <Button secondary block onClick={cancel}>
          Peruuta jäynä
        </Button>

        {competition.teams
          .filter((teamId) => teamId !== manager.team)
          .map((teamId) => {
            return (
              <Button key={teamId} block onClick={() => selectVictim(teamId)}>
                {teams[teamId].name}
              </Button>
            );
          })}
      </Stack>
    </Stack>
  );
};

export default SelectVictim;

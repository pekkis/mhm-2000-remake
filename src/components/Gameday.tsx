import calendar from "@/data/calendar";
import Table from "./league-table/LeagueTable";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "./ui/AdvancedHeaderedPage";
import Games from "./gameday/Games";
import Box from "./ui/Box";
import { useGameContext } from "@/context/game-machine-context";
import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";

const Gameday = () => {
  const turn = useGameContext((ctx) => ctx.turn);
  const managers = useGameContext((ctx) => ctx.manager.managers);
  const teams = useGameContext((ctx) => ctx.teams);
  const competitions = useGameContext((ctx) => ctx.competitions);

  const calendarEntry = calendar[turn.round];

  const currentCompetitions = calendarEntry.gamedays.map(
    (c) => competitions[c]
  );

  return (
    <AdvancedHeaderedPage stickyMenu={<StickyMenu />}>
      <Stack gap="lg">
        <Heading level={2}>Pelipäivä</Heading>

        {currentCompetitions.map((competition) => {
          const currentPhase = competition.phases[competition.phase];

          return (
            <Stack key={competition.name} gap="md">
              {currentPhase.groups.map((group, groupIndex) => {
                const currentRound = group.round;

                return (
                  <Stack key={groupIndex}>
                    <Heading level={3}>
                      {competition.name}, {group.name}, kierros{" "}
                      {currentRound + 1} / {group.schedule.length}
                    </Heading>

                    <Games
                      teams={teams}
                      context={group}
                      round={currentRound}
                      managers={managers}
                    />

                    {currentPhase.type === "tournament" && (
                      <Box>
                        <Table
                          division={group}
                          managers={managers}
                          teams={teams}
                        />
                      </Box>
                    )}
                  </Stack>
                );
              })}
            </Stack>
          );
        })}
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default Gameday;

import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "./ui/AdvancedHeaderedPage";
import { getEffective } from "@/services/effects";
import { useGameContext } from "@/context/game-machine-context";
import { values } from "remeda";
import { Table, Td, Th } from "./ui/Table";
import Stack from "@/components/ui/Stack";
import Heading from "@/components/ui/Heading";

const DeveloperMenu = () => {
  const teams = useGameContext((ctx) => ctx.teams);
  const competitions = useGameContext((ctx) => ctx.competitions);

  return (
    <AdvancedHeaderedPage stickyMenu={<StickyMenu back />}>
      <Stack gap="lg">
        <Heading level={2}>Devausinfo</Heading>

        <Stack gap="md">
          {values(competitions).map((c) => {
            return (
              <Stack gap="sm" key={c.id}>
                <Heading level={3}>{c.name}</Heading>
                <Table>
                  <thead>
                    <tr>
                      <Th>Joukkue</Th>
                      <Th>O-voima</Th>
                      <Th>E-voima</Th>
                      <Th>E-moraali</Th>
                      <Th>E-valmius</Th>
                    </tr>
                  </thead>

                  <tbody>
                    {c.teams
                      .toSorted((a, b) => teams[b].strength - teams[a].strength)
                      .map((t) => {
                        const team = teams[t];
                        const e = getEffective(team);

                        return (
                          <tr key={team.id}>
                            <Td>{team.name}</Td>
                            <Td>{team.strength}</Td>
                            <Td>{e.strength}</Td>
                            <Td>{e.morale}</Td>
                            <Td>{e.readiness}</Td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default DeveloperMenu;

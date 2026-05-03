import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "./ui/AdvancedHeaderedPage";
import { getEffective } from "@/services/effects";
import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";
import { values } from "remeda";
import { Table, Td, Th } from "./ui/Table";
import Stack from "@/components/ui/Stack";
import Heading from "@/components/ui/Heading";
import Box from "@/components/ui/Box";
import strategies, { type StrategyId } from "@/data/mhm2000/strategies";

const fmt = (n: number) => n.toFixed(3);

const strategyName = (id: number): string => {
  if (id === 0) {
    return "—";
  }
  return strategies[id as StrategyId]?.name ?? `?(${id})`;
};

const DeveloperMenu = () => {
  const teams = useGameContext((ctx) => ctx.teams);
  const managers = useGameContext((ctx) => ctx.managers);
  const competitions = useGameContext((ctx) => ctx.competitions);

  const ctx = GameMachineContext.useSelector((snap) => snap.context);

  // Reverse lookup: only `team.manager` is reliably set; `manager.team`
  // exists only for the human manager who picked a slot in StartMenu.
  // Pier Paolo Proxy Pasolini is shared by every light team — list them all.
  const teamsByManager = teams.reduce<Record<string, typeof teams>>(
    (acc, team) => {
      if (team.manager === undefined) {
        return acc;
      }
      (acc[team.manager] ??= []).push(team);
      return acc;
    },
    {}
  );

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
                      <Th>Manageri</Th>
                      <Th>Strategia</Th>
                      <Th>E-moraali</Th>
                      <Th>P-valmius</Th>
                      <Th>E-valmius</Th>
                    </tr>
                  </thead>

                  <tbody>
                    {c.teams
                      .toSorted((a, b) => teams[b].tier - teams[a].tier)
                      .map((t) => {
                        const team = teams[t];
                        const e = getEffective(team);
                        const manager = team.manager
                          ? managers[team.manager]
                          : undefined;
                        const managerLabel = manager
                          ? `${manager.name} (${manager.kind})`
                          : "—";

                        return (
                          <tr key={team.name}>
                            <Td>{team.name}</Td>
                            <Td>{managerLabel}</Td>
                            <Td>{strategyName(team.strategy)}</Td>
                            <Td>{e.morale}</Td>
                            <Td>{fmt(team.readiness)}</Td>
                            <Td>{fmt(e.readiness)}</Td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </Stack>
            );
          })}
        </Stack>

        <Stack gap="sm">
          <Heading level={3}>Managerit</Heading>
          <Table>
            <thead>
              <tr>
                <Th>Nimi</Th>
                <Th>Tyyppi</Th>
                <Th>Joukkue</Th>
                <Th>Strategia</Th>
                <Th>Tagit</Th>
              </tr>
            </thead>
            <tbody>
              {values(managers)
                .toSorted((a, b) => a.name.localeCompare(b.name))
                .map((m) => {
                  const ownTeams = teamsByManager[m.id] ?? [];
                  const teamLabel =
                    ownTeams.length === 0
                      ? "—"
                      : ownTeams.length === 1
                        ? ownTeams[0].name
                        : `${ownTeams.length} joukkuetta`;
                  const strategyLabel =
                    ownTeams.length === 0
                      ? "—"
                      : ownTeams.length === 1
                        ? strategyName(ownTeams[0].strategy)
                        : "(useita)";
                  return (
                    <tr key={m.id}>
                      <Td>{m.name}</Td>
                      <Td>{m.kind}</Td>
                      <Td>{teamLabel}</Td>
                      <Td>{strategyLabel}</Td>
                      <Td>{m.tags.join(", ") || "—"}</Td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Stack>

        <Box>
          <Heading level={3}>Context</Heading>

          <pre>{JSON.stringify(ctx, undefined, 2)}</pre>
        </Box>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default DeveloperMenu;

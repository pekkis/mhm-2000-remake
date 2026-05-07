import ManagerInfo from "@/components/ManagerInfo";
import StickyMenu from "@/components/StickyMenu";
import AdvancedHeaderedPage from "@/components/ui/AdvancedHeaderedPage";
import Button from "@/components/ui/Button";
import Calendar from "@/components/ui/Calendar";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Stack from "@/components/ui/Stack";
import { Table, Td, Th } from "@/components/ui/Table";
import { useGameContext } from "@/context/game-machine-context";
import { marketPlayers } from "@/machines/selectors";
import type { MarketPlayer, Player } from "@/state/player";
import type { FC } from "react";
import { prop, sortBy, values } from "remeda";

const POSITION_ORDER: Record<Player["position"], number> = {
  g: 0,
  d: 1,
  lw: 2,
  c: 3,
  rw: 4
};

const playerSorter = sortBy<MarketPlayer[]>(
  [(p) => POSITION_ORDER[p.position], "asc"],
  [prop("skill"), "desc"],
  [prop("surname"), "asc"],
  [prop("initial"), "asc"]
);

const TransferMarketPage: FC = () => {
  const players = useGameContext(marketPlayers);

  const sortedPlayers = playerSorter(values(players));

  return (
    <AdvancedHeaderedPage
      stickyMenu={<StickyMenu back />}
      managerInfo={<ManagerInfo details />}
    >
      <Stack gap="lg">
        <Heading level={2}>Pelaajamarkkinat</Heading>

        <Calendar
          when={(c) => c.transferMarket}
          fallback={
            <Paragraph>
              Valitettavasti siirtoaika on umpeutunut. Tervetuloa takaisin ensi
              vuonna!
            </Paragraph>
          }
        >
          <Table>
            <thead>
              <tr>
                <Th>Nimi</Th>
                <Th>Pelipaikka</Th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player) => {
                return (
                  <tr key={player.id}>
                    <Td>
                      {player.surname}, {player.initial}.
                    </Td>
                    <Td>{player.position}</Td>
                    <Td>{player.nationality}</Td>
                    <Td>{player.skill}</Td>
                    <Button>neuvottele!</Button>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Calendar>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default TransferMarketPage;

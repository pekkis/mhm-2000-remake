import ManagerInfo from "@/components/ManagerInfo";
import StickyMenu from "@/components/StickyMenu";
import AdvancedHeaderedPage from "@/components/ui/AdvancedHeaderedPage";
import Calendar from "@/components/ui/Calendar";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Stack from "@/components/ui/Stack";
import { Table, Td, Th } from "@/components/ui/Table";
import { useGameContext } from "@/context/game-machine-context";
import { marketPlayers } from "@/machines/selectors";
import type { FC } from "react";
import { values } from "remeda";

const TransferMarketPage: FC = () => {
  const players = useGameContext(marketPlayers);

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
              </tr>
            </thead>
            <tbody>
              {values(players).map((player) => {
                return (
                  <tr key={player.id}>
                    <Td>{player.surname}</Td>
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

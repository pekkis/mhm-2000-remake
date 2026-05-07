import ManagerInfo from "@/components/ManagerInfo";
import StickyMenu from "@/components/StickyMenu";
import AdvancedHeaderedPage from "@/components/ui/AdvancedHeaderedPage";
import Button from "@/components/ui/Button";
import Calendar from "@/components/ui/Calendar";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Stack from "@/components/ui/Stack";
import { Table, Td, Th } from "@/components/ui/Table";
import { GameMachineContext, useGameContext } from "@/context/game-machine-context";
import { activeManager, marketPlayers } from "@/machines/selectors";
import type { MarketPlayer, Player } from "@/state/player";
import type { FC } from "react";
import { prop, sortBy, values } from "remeda";
import ContractNegotiationView from "./ContractNegotiationView";
import NegotiationResultView from "./NegotiationResultView";

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

const useActionSubState = () =>
  GameMachineContext.useSelector((snap) => {
    if (
      snap.matches({
        in_game: { executing_phases: { action: "negotiating" } }
      })
    ) {
      return "negotiating";
    }
    if (
      snap.matches({
        in_game: { executing_phases: { action: "showing_result" } }
      })
    ) {
      return "showing_result";
    }
    return "browsing";
  });

const TransferMarketBrowser: FC = () => {
  const players = useGameContext(marketPlayers);
  const manager = useGameContext(activeManager);
  const gameActor = GameMachineContext.useActorRef();

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
                <Th>Nat.</Th>
                <Th>Taito</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player) => {
                const alreadyNegotiated = player.tags.some(
                  (t) => t === `irritated:${manager.id}`
                );
                return (
                  <tr key={player.id}>
                    <Td>
                      {player.surname}, {player.initial}.
                    </Td>
                    <Td>{player.position}</Td>
                    <Td>{player.nationality}</Td>
                    <Td>{player.skill}</Td>
                    <Td>
                      <Button
                        disabled={alreadyNegotiated}
                        onClick={() =>
                          gameActor.send({
                            type: "NEGOTIATE_MARKET_PLAYER",
                            payload: {
                              managerId: manager.id,
                              playerId: player.id
                            }
                          })
                        }
                      >
                        {alreadyNegotiated ? "Ei puhu" : "Neuvottele!"}
                      </Button>
                    </Td>
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

const TransferMarketPage: FC = () => {
  const subState = useActionSubState();

  if (subState === "negotiating") {
    return <ContractNegotiationView />;
  }
  if (subState === "showing_result") {
    return <NegotiationResultView />;
  }
  return <TransferMarketBrowser />;
};

export default TransferMarketPage;

import ManagerInfo from "@/components/ManagerInfo";
import StickyMenu from "@/components/StickyMenu";
import AdvancedHeaderedPage from "@/components/page/AdvancedHeaderedPage";
import Button from "@/components/ui/Button";
import Calendar from "@/components/ui/Calendar";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Stack from "@/components/ui/Stack";
import { Table, Td, Th } from "@/components/ui/Table";
import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";
import {
  activeManager,
  hasCompletedAction,
  marketPlayers
} from "@/machines/selectors";
import type { MarketPlayer, Player } from "@/state/player";
import type { FC } from "react";
import { prop, sortBy, values } from "remeda";
import ContractNegotiationView from "./ContractNegotiationView";
import { Link } from "react-router-dom";

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
    return "browsing";
  });

const TransferMarketBrowser: FC = () => {
  const players = useGameContext(marketPlayers);
  const manager = useGameContext(activeManager);
  const gameActor = GameMachineContext.useActorRef();
  const budgetDone = useGameContext(hasCompletedAction(manager.id, "budget"));

  const sortedPlayers = playerSorter(values(players));

  return (
    <AdvancedHeaderedPage
      escTo="/"
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
          {!budgetDone && (
            <>
              <Paragraph>
                GSM-liittymäsi on valitettavasti suljettu, eikä toimiston faksi
                laula sulosointuja.{" "}
                <Link to="/budjetti">Budjetoinnin jälkeen</Link> sihteeri kyllä
                juoksee pankkiin maksamaan kaikki erääntyneet laskut!
              </Paragraph>
            </>
          )}
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
                        disabled={alreadyNegotiated || !budgetDone}
                        onClick={() =>
                          gameActor.send({
                            type: "NEGOTIATE_PLAYER",
                            payload: {
                              managerId: manager.id,
                              playerId: player.id,
                              kind: "market"
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
  return <TransferMarketBrowser />;
};

export default TransferMarketPage;

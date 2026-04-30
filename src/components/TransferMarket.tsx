import { useState } from "react";
import playerTypes from "@/data/transfer-market";
import Button from "./ui/Button";
import Stack from "./ui/Stack";
import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "./ui/AdvancedHeaderedPage";
import Calendar from "./ui/Calendar";
import { currency } from "@/services/format";
import ManagerInfo from "./ManagerInfo";
import Box from "./ui/Box";
import Paragraph from "./ui/Paragraph";
import Tabs from "./ui/Tabs";
import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";
import { activeManager, canSellPlayer } from "@/machines/selectors";
import Heading from "@/components/ui/Heading";

const TransferMarket = () => {
  const manager = useGameContext(activeManager);
  const canSell = useGameContext(canSellPlayer(manager.id));
  const gameActor = GameMachineContext.useActorRef();

  const balance = manager.balance;
  const [tab, setTab] = useState(0);

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
          <Tabs
            selected={tab}
            onSelect={setTab}
            items={[
              {
                title: "Osta pelaajia",
                content: () => (
                  <Stack>
                    {playerTypes.map((playerType, index) => {
                      return (
                        <Button
                          key={index}
                          onClick={() =>
                            gameActor.send({
                              type: "BUY_PLAYER",
                              payload: {
                                manager: manager.id,
                                playerType: index
                              }
                            })
                          }
                          block
                          disabled={balance < playerType.buy}
                        >
                          <Box>{playerType.description}</Box>
                          <Box>
                            <Box>{currency(playerType.buy)}</Box>
                          </Box>
                        </Button>
                      );
                    })}
                  </Stack>
                )
              },
              {
                title: "Myy pelaajia",
                content: () => (
                  <Stack>
                    {playerTypes.map((playerType, index) => {
                      return (
                        <Button
                          key={index}
                          onClick={() =>
                            gameActor.send({
                              type: "SELL_PLAYER",
                              payload: {
                                manager: manager.id,
                                playerType: index
                              }
                            })
                          }
                          block
                          disabled={!canSell}
                        >
                          <Box>{playerType.description}</Box>
                          <Box>
                            <strong>{currency(playerType.sell)}</strong>
                          </Box>
                        </Button>
                      );
                    })}
                  </Stack>
                )
              }
            ]}
          />
        </Calendar>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default TransferMarket;

import StickyMenu from "./StickyMenu";
import AdvancedHeaderedPage from "./ui/AdvancedHeaderedPage";
import ManagerInfo from "./ManagerInfo";
import Toggle from "@/components/ui/form/Toggle";
import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";
import { entries } from "remeda";

import services from "@/data/services";
import { activeManager } from "@/machines/selectors";
import Markdown from "@/components/Markdown";
import Stack from "@/components/ui/Stack";
import Heading from "@/components/ui/Heading";
import Box from "@/components/ui/Box";
import Cluster from "@/components/ui/Cluster";

const Services = () => {
  const manager = useGameContext(activeManager);
  const basePrices = useGameContext((ctx) => ctx.serviceBasePrices);
  const gameActor = GameMachineContext.useActorRef();

  console.log("MANAGER SERVICES", manager.services);

  return (
    <AdvancedHeaderedPage
      stickyMenu={<StickyMenu back />}
      managerInfo={<ManagerInfo details />}
    >
      <Stack gap="lg">
        <Heading level={2}>Erikoistoimenpiteet</Heading>

        <Stack gap="md">
          {entries(services).map(([key, service]) => {
            const basePrice = basePrices[key];
            return (
              <Box key={key}>
                <Cluster>
                  <Toggle
                    id={key}
                    checked={manager.services[key]}
                    onChange={() => {
                      gameActor.send({
                        type: "TOGGLE_SERVICE",
                        payload: { manager: manager.id, service: key }
                      });
                    }}
                  />
                  <Box>
                    <label htmlFor={key}>
                      <strong>{service.name}</strong>
                    </label>
                  </Box>
                </Cluster>

                <Markdown>
                  {service.description(service.price(basePrice, manager))}
                </Markdown>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </AdvancedHeaderedPage>
  );
};

export default Services;

import { amount } from "@/services/format";
import { getEffective } from "@/services/effects";
import Box from "./ui/Box";
import TurnIndicator from "./game/TurnIndicator";
import { useGameContext } from "@/context/game-machine-context";
import { activeManager } from "@/machines/selectors";

import * as styles from "./ManagerInfo.css";
import Centerer from "@/components/Centerer";
import Cluster from "@/components/ui/Cluster";
import Stack from "@/components/ui/Stack";

type ManagerInfoProps = {
  details?: boolean;
};

const ManagerInfo = ({ details = false }: ManagerInfoProps) => {
  const manager = useGameContext(activeManager);
  const teams = useGameContext((ctx) => ctx.teams);
  const turn = useGameContext((ctx) => ctx.turn);

  const team = getEffective(teams[manager.team!]);

  return (
    <Box p="md" bg="surfaceMuted">
      <Centerer>
        <Stack gap="lg">
          <Box>
            <h2 className={styles.managerName}>{manager.name}</h2>
          </Box>
          {details && (
            <Box>
              <Cluster gapInline="xl" gapBlock="sm">
                <Stack direction="row" gap="sm">
                  <div className={styles.title}>Moraali</div>
                  <div>{team.morale}</div>
                </Stack>

                <Stack direction="row" gap="sm">
                  <div className={styles.title}>Raha</div>
                  <div>{amount(manager.balance)}</div>
                </Stack>

                <Stack direction="row" gap="sm">
                  <div className={styles.title}>Vuoro</div>
                  <div>
                    <TurnIndicator turn={turn} />
                  </div>
                </Stack>
              </Cluster>
            </Box>
          )}
        </Stack>
      </Centerer>
    </Box>
  );
};

export default ManagerInfo;

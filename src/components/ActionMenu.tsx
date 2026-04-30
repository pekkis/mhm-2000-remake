import { Link } from "react-router-dom";
import { useSelector } from "@xstate/store-react";
import Calendar from "./ui/Calendar";
import Cluster from "./ui/Cluster";
import { getEffective } from "@/services/effects";
import { CRISIS_MORALE_MAX } from "@/data/constants";
import Button from "./ui/Button";
import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";
import { AppMachineContext } from "@/context/app-machine-context";
import { uiStore, type ThemePreference } from "@/stores/ui";
import { activeManager } from "@/machines/selectors";
import Stack from "@/components/ui/Stack";

const themeOptions: ReadonlyArray<{ value: ThemePreference; label: string }> = [
  { value: "system", label: "Järjestelmä" },
  { value: "light", label: "Vaalea" },
  { value: "dark", label: "Tumma" }
];

const ActionMenu = () => {
  const manager = useGameContext(activeManager);
  const teams = useGameContext((ctx) => ctx.teams);
  const appActor = AppMachineContext.useActorRef();
  const team = getEffective(teams[manager.team!]);
  const theme = useSelector(uiStore, (s) => s.context.theme);

  const canSave = GameMachineContext.useSelector((state) =>
    state.matches({ in_game: { executing_phases: "action" } })
  );

  const close = () => uiStore.send({ type: "closeMenu" });

  return (
    <Stack gap="md">
      <Stack gap="md">
        <Stack as="nav" gap="xs" align="center">
          <Link onClick={close} to="/">
            Päävalikko
          </Link>

          {team.morale <= CRISIS_MORALE_MAX && (
            <Calendar when={(c) => c.crisisMeeting}>
              <Link onClick={close} to="/kriisipalaveri">
                Kriisipalaveri
              </Link>
            </Calendar>
          )}

          <Calendar when={(c) => c.transferMarket}>
            <Link onClick={close} to="/pelaajamarkkinat">
              Pelaajamarkkinat
            </Link>
          </Calendar>

          <Link onClick={close} to="/sarjataulukot">
            Sarjataulukot
          </Link>

          <Link onClick={close} to="/areena">
            Areena
          </Link>

          <Link onClick={close} to="/erikoistoimenpiteet">
            Erikoistoimenpiteet
          </Link>

          <Calendar when={(c) => c.pranks}>
            <Link onClick={close} to="/jaynat">
              Jäynät
            </Link>
          </Calendar>

          <Link onClick={close} to="/tilastot">
            Tilastot
          </Link>

          <Calendar
            when={(e, _c, competitions) => {
              return e.gamedays.includes("phl") && competitions.phl.phase === 0;
            }}
          >
            <Link onClick={close} to="/veikkaus">
              Veikkaus
            </Link>
          </Calendar>

          <Link onClick={close} to="/debug">
            Devausmenukka
          </Link>
        </Stack>

        <Stack direction="row">
          <Button
            block
            disabled={!canSave}
            type="button"
            onClick={() => {
              appActor.send({ type: "SAVE_GAME" });
              close();
            }}
          >
            Tallenna
          </Button>

          <Button
            block
            type="button"
            secondary
            onClick={() => {
              appActor.send({ type: "QUIT" });
              close();
            }}
          >
            Lopeta!
          </Button>
        </Stack>
      </Stack>

      <Cluster gap="xs" justify="space-between">
        {themeOptions.map((opt) => (
          <Button
            key={opt.value}
            type="button"
            terse
            secondary={theme !== opt.value}
            onClick={() => uiStore.send({ type: "setTheme", theme: opt.value })}
          >
            {opt.label}
          </Button>
        ))}
      </Cluster>
    </Stack>
  );
};

export default ActionMenu;

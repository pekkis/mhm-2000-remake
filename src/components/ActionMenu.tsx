import { Link } from "react-router-dom";
import { useSelector } from "@xstate/store-react";
import Calendar from "./ui/Calendar";
import Cluster from "./ui/Cluster";
import { getEffective } from "@/services/effects";
import { CRISIS_MORALE_MAX } from "@/data/constants";
import Button from "./ui/Button";
import RadioGroup from "./ui/RadioGroup";
import Switch from "./ui/Switch";
import {
  GameMachineContext,
  useGameContext
} from "@/context/game-machine-context";
import { AppMachineContext } from "@/context/app-machine-context";
import { uiStore, type ThemePreference } from "@/stores/ui";
import { activeManager, hasCompletedAction } from "@/machines/selectors";
import Stack from "@/components/ui/Stack";

const themeOptions: ReadonlyArray<{ value: ThemePreference; label: string }> = [
  { value: "system", label: "Järjestelmä" },
  { value: "light", label: "Vaalea" },
  { value: "dark", label: "Tumma" }
];

const intensityOptions: ReadonlyArray<{
  value: "0" | "1" | "2";
  label: string;
}> = [
  { value: "0", label: "Laiska" },
  { value: "1", label: "Normaali" },
  { value: "2", label: "Hurja" }
];

const ActionMenu = () => {
  const manager = useGameContext(activeManager);
  const teams = useGameContext((ctx) => ctx.teams);
  const budgetDone = useGameContext(hasCompletedAction(manager.id, "budget"));
  const strategyDone = useGameContext(
    hasCompletedAction(manager.id, "strategy")
  );
  const betDone = useGameContext(
    hasCompletedAction(manager.id, "championshipBet")
  );
  const sponsorDone = useGameContext(hasCompletedAction(manager.id, "sponsor"));
  const appActor = AppMachineContext.useActorRef();
  const gameActor = GameMachineContext.useActorRef();
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

          <Link onClick={close} to="/pelaajat" title="a">
            Pelaajarinki
          </Link>

          <Link onClick={close} to="/kokoonpano" title="b">
            Ketjukokoonpano
          </Link>

          <Link onClick={close} to="/budjetti">
            Budjetointi {budgetDone ? "✓" : "○"}
          </Link>

          <Link onClick={close} to="/strategia">
            Strategia {strategyDone ? "✓" : "○"}
          </Link>

          <Link onClick={close} to="/mestariveikkaus">
            Mestariveikkaus {betDone ? "✓" : "○"}
          </Link>

          {sponsorDone ? (
            <Link onClick={close} to="/organisaatio">
              Sponsori ✓
            </Link>
          ) : (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                close();
                gameActor.send({
                  type: "START_SPONSOR_NEGOTIATION",
                  manager: manager.id
                });
              }}
            >
              Sponsorineuvottelut ○
            </a>
          )}

          <Link onClick={close} to="/organisaatio">
            Organisaatio
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

          <Calendar when={(c) => c.pranks}>
            <Link onClick={close} to="/jaynat">
              Jäynät
            </Link>
          </Calendar>

          <Link onClick={close} to="/tilastot">
            Tilastot
          </Link>

          <Link onClick={close} to="/playoffit">
            Playoffit
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
            Debug
          </Link>

          <Link onClick={close} to="/poc">
            POCcing page
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

      <RadioGroup
        options={intensityOptions}
        value={String(team.intensity) as "0" | "1" | "2"}
        onValueChange={(v) =>
          gameActor.send({
            type: "SET_INTENSITY",
            payload: {
              manager: manager.id,
              intensity: Number(v) as 0 | 1 | 2
            }
          })
        }
      />

      <Switch
        checked={team.fixMatch}
        onCheckedChange={(checked) =>
          gameActor.send({
            type: "SET_FIX_MATCH",
            payload: { manager: manager.id, fixMatch: checked }
          })
        }
        label="Sopupeli"
      />

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

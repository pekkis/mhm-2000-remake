import { Routes, Route } from "react-router-dom";

import MainMenu from "./MainMenu";
import LeagueTables from "./LeagueTables";
import DeveloperMenu from "./DeveloperMenu";
import SelectStrategy from "./SelectStrategy";
import Events from "./Events";
import News from "./News";
import Gameday from "./Gameday";
import GamedayResults from "./GamedayResults";
import CrisisActions from "./CrisisActions";
import Arena from "./Arena";
import Services from "./Services";
import Pranks from "./Pranks";
import Notifications from "./notifications/Notifications";
import ModalMenu from "./ModalMenu";
import ChampionshipBetting from "./ChampionshipBetting";
import Betting from "./Betting";
import EndOfSeason from "./EndOfSeason";
import WorldChampionships from "./WorldChampionships";
import Stats from "./Stats";
import Invitations from "./Invitations";
import Gala from "./Gala";
import { NotificationsContext } from "@/context/notifications-context";
import type { ActorRefFrom } from "xstate";
import type { notificationsMachine } from "@/machines/notifications";
import type { FC } from "react";
import { GameMachineContext } from "@/context/game-machine-context";
import PlayoffBracket from "@/components/PlayoffBracket";
import POCMenu from "@/components/POCMenu";
import TransferMarketPage from "@/components/transfer-market/TransferMarketPage";

type PhaseProps = {
  phase: string | undefined;
};

const useUiPhase = (): string | undefined => {
  return GameMachineContext.useSelector((state) => {
    if (state.matches({ in_game: { executing_phases: "action" } })) {
      return "action";
    }
    if (state.matches({ in_game: { executing_phases: "prank" } })) {
      return "prank";
    }
    if (
      state.matches({ in_game: { executing_phases: { gameday: "preview" } } })
    ) {
      return "gameday";
    }
    if (
      state.matches({ in_game: { executing_phases: { gameday: "results" } } })
    ) {
      return "results";
    }
    if (state.matches({ in_game: { executing_phases: "calculations" } })) {
      return "calculations";
    }
    if (state.matches({ in_game: { executing_phases: "event_creation" } })) {
      return "event_creation";
    }
    if (state.matches({ in_game: { executing_phases: "event" } })) {
      return "event";
    }
    if (state.matches({ in_game: { executing_phases: "news" } })) {
      return "news";
    }
    if (
      state.matches({ in_game: { executing_phases: "invitations_create" } })
    ) {
      return "invitations_create";
    }
    if (
      state.matches({
        in_game: {
          executing_phases: { start_of_season: "select_strategy" }
        }
      })
    ) {
      return "select_strategy";
    }
    if (
      state.matches({
        in_game: {
          executing_phases: { start_of_season: "championship_betting" }
        }
      })
    ) {
      return "championship_betting";
    }
    if (state.matches({ in_game: { executing_phases: "seed" } })) {
      return "seed";
    }
    if (state.matches({ in_game: { executing_phases: "gala" } })) {
      return "gala";
    }
    if (
      state.matches({
        in_game: {
          executing_phases: { end_of_season: "world_championships" }
        }
      })
    ) {
      return "world_championships";
    }
    if (
      state.matches({
        in_game: { executing_phases: { end_of_season: "review" } }
      })
    ) {
      return "end_of_season";
    }

    return undefined;
  });
};

const Phase: FC<PhaseProps> = ({ phase }) => {
  switch (true) {
    case phase === "select_strategy":
      return <SelectStrategy />;

    case phase === "championship_betting":
      return <ChampionshipBetting />;

    case phase === "event":
      return <Events />;

    case phase === "gala":
      return <Gala />;

    case phase === "news":
      return <News />;

    case phase === "gameday":
      return <Gameday />;

    case phase === "world_championships":
      return <WorldChampionships />;

    case phase === "end_of_season":
      return <EndOfSeason />;

    case phase === "results":
      return <GamedayResults />;

    case phase === "action":
      return (
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/sarjataulukot" element={<LeagueTables />} />
          <Route path="/pelaajamarkkinat" element={<TransferMarketPage />} />
          <Route path="/kriisipalaveri" element={<CrisisActions />} />
          <Route path="/erikoistoimenpiteet" element={<Services />} />
          <Route path="/areena" element={<Arena />} />
          <Route path="/jaynat" element={<Pranks />} />
          <Route path="/playoffit" element={<PlayoffBracket />} />
          <Route path="/tilastot" element={<Stats />} />
          <Route path="/kutsut" element={<Invitations />} />
          <Route path="/veikkaus" element={<Betting />} />
          <Route path="/debug" element={<DeveloperMenu />} />
          <Route path="/poc" element={<POCMenu />} />
        </Routes>
      );

    default:
      return "laddare...";
  }
};

const Game: FC = () => {
  const phase = useUiPhase();
  const gameActor = GameMachineContext.useActorRef();
  const notificationsActor = gameActor.system.get(
    "notifications"
  ) as ActorRefFrom<typeof notificationsMachine>;

  console.log("GAME", gameActor);

  return (
    <>
      <ModalMenu />
      <Phase phase={phase} />
      <NotificationsContext.Provider actor={notificationsActor}>
        <Notifications />
      </NotificationsContext.Provider>
    </>
  );
};

export default Game;

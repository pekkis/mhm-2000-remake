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
import Pranks from "./Pranks";
import Notifications from "./notifications/Notifications";
import ModalMenu from "./ModalMenu";
import Betting from "./Betting";
import EndOfSeason from "./EndOfSeason";
import WorldChampionships from "./WorldChampionships";
import Stats from "./Stats";
import Invitations from "./Invitations";
import Gala from "./Gala";
import ConfirmBudget from "./ConfirmBudget";
import SponsorNegotiationView from "./SponsorNegotiationView";
import { NotificationsContext } from "@/context/notifications-context";
import type { ActorRefFrom } from "xstate";
import type { notificationsMachine } from "@/machines/notifications";
import type { FC } from "react";
import { GameMachineContext } from "@/context/game-machine-context";
import PlayoffBracket from "@/components/PlayoffBracket";
import POCMenu from "@/components/POCMenu";
import TransferMarketPage from "@/components/transfer-market/TransferMarketPage";
import Players from "@/components/Players";
import Lineup from "@/components/Lineup";
import Organisaatio from "@/components/Organisaatio";

type PhaseProps = {
  phase: string | undefined;
};

const useUiPhase = (): string | undefined => {
  return GameMachineContext.useSelector((state) => {
    if (
      state.matches({
        in_game: { executing_phases: { action: "sponsorNegotiating" } }
      })
    ) {
      return "sponsorNegotiating";
    }
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
    if (state.matches({ in_game: { executing_phases: "mailbox" } })) {
      return "mailbox";
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

    case phase === "sponsorNegotiating":
      return <SponsorNegotiationView />;

    case phase === "action":
      return (
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/sarjataulukot" element={<LeagueTables />} />
          <Route path="/pelaajamarkkinat" element={<TransferMarketPage />} />
          <Route path="/kriisipalaveri" element={<CrisisActions />} />
          <Route path="/areena" element={<Arena />} />
          <Route path="/jaynat" element={<Pranks />} />
          <Route path="/playoffit" element={<PlayoffBracket />} />
          <Route path="/tilastot" element={<Stats />} />
          <Route path="/kutsut" element={<Invitations />} />
          <Route path="/veikkaus" element={<Betting />} />
          <Route path="/pelaajat" element={<Players />} />
          <Route path="/kokoonpano" element={<Lineup />} />
          <Route path="/organisaatio" element={<Organisaatio />} />
          <Route path="/budjetti" element={<ConfirmBudget />} />
          <Route path="/strategia" element={<SelectStrategy />} />
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

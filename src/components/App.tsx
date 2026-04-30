import StartMenu from "./StartMenu";
import Game from "./Game";
import { ErrorBoundary } from "react-error-boundary";
import type { FC } from "react";
import { AppMachineContext } from "@/context/app-machine-context";
import { GameMachineContext } from "@/context/game-machine-context";
import Paragraph from "./ui/Paragraph";

const ErrorFallback = () => (
  <div>
    <h1>Jokin meni pieleen. Voi örr!</h1>
    <Paragraph>Syynä lienee tieteelle tuntematon bugi.</Paragraph>
    <Paragraph>
      Virhe on toivottavasti jo lähetetty palvelimelle turvaan ja Pekkis näkee
      sen! Toivottavasti olit tallentanut, koska tästä ei toivuta!
    </Paragraph>
  </div>
);

const GameProvider: FC = () => {
  const gameRef = AppMachineContext.useSelector(
    (state) => state.context.gameRef
  );

  if (!gameRef) {
    return null;
  }

  return (
    <GameMachineContext.Provider actor={gameRef}>
      <Game />
    </GameMachineContext.Provider>
  );
};

const App: FC = () => {
  const playing = AppMachineContext.useSelector((state) => {
    return state.matches("playing");
  });

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {playing ? <GameProvider /> : <StartMenu />}
    </ErrorBoundary>
  );
};

export default App;

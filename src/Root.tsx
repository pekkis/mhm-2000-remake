import App from "./components/App";
import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";
import type { FC } from "react";
import { AppMachineContext } from "@/context/app-machine-context";

type Props = {};

const Root: FC<Props> = () => {
  return (
    <>
      <AppMachineContext.Provider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppMachineContext.Provider>
    </>
  );
};

export default Root;

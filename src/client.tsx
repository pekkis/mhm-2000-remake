import "@fontsource-variable/ibm-plex-sans/index.css";
import { createRoot } from "react-dom/client";
import Root from "./Root";
import { StrictMode } from "react";

const rootElement = document.getElementById("app");
if (!rootElement) {
  throw new Error("Oh noes, no root element be found!");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Root />
  </StrictMode>
);

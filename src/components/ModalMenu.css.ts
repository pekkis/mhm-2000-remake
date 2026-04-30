import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const dialog = style({
  // The native <dialog> centers itself when opened with showModal().
  // We just style the chrome.
  border: "none",
  padding: vars.space.md,
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.surfaceRaised,
  color: vars.color.text,
  boxShadow: vars.shadow.xl,
  width: "min(32rem, calc(100vw - 2rem))",
  maxHeight: "calc(100vh - 2rem)",
  overflow: "auto",

  selectors: {
    "&::backdrop": {
      backgroundColor: vars.color.backdrop,
      backdropFilter: "blur(2px)"
    }
  }
});

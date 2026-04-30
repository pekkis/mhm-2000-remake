import "normalize.css";
import { globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle(":root", {
  // Tells the browser we honor `prefers-color-scheme` and unlocks
  // `light-dark()` resolution used throughout `vars.color`.
  colorScheme: "light dark",
  fontSize: "16px",
  lineHeight: vars.lineHeight.normal,
  fontFamily: vars.fontFamily.body,
  // Tabular numerals so currencies, scores, and league tables line up
  // in columns. `cv11` selects the single-storey `a` variant which
  // reads better at small sizes — a Plex-specific touch.
  fontFeatureSettings: '"tnum", "cv11"',
  backgroundColor: vars.color.bg,
  color: vars.color.text
});

globalStyle("body", {
  margin: 0,
  padding: 0
});

globalStyle("h1", {
  fontSize: vars.fontSize["4xl"]
});

globalStyle("h2", {
  fontSize: vars.fontSize["2xl"]
});

globalStyle("h3", {
  fontSize: vars.fontSize.lg
});

globalStyle("h1, h2, h3, h4, h5, h6", {
  lineHeight: vars.lineHeight.tight,
  fontWeight: vars.fontWeight.semibold
});

globalStyle("form", {
  margin: 0,
  padding: 0
});

globalStyle("p", {
  margin: "1em 0"
});

globalStyle("a", {
  color: vars.color.accent
});

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" }
});

globalStyle(".spin", {
  animation: `${spin} 1s linear infinite`
});

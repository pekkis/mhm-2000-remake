import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const slider = style({
  inlineSize: "100%",
  blockSize: "6px",
  cursor: "pointer",
  accentColor: vars.color.accent
});

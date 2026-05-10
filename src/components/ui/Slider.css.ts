import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const root = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  inlineSize: "100%",
  blockSize: "1.25rem",
  userSelect: "none",
  touchAction: "none"
});

export const track = style({
  position: "relative",
  flexGrow: 1,
  blockSize: "4px",
  borderRadius: vars.radius.pill,
  background: vars.color.surfaceMuted
});

export const range = style({
  position: "absolute",
  blockSize: "100%",
  borderRadius: vars.radius.pill,
  background: vars.color.accent
});

export const thumb = style({
  display: "block",
  inlineSize: "1.25rem",
  blockSize: "1.25rem",
  borderRadius: vars.radius.pill,
  background: vars.color.bg,
  border: `2px solid ${vars.color.accent}`,
  boxShadow: vars.shadow.sm,
  cursor: "grab",
  transition: "box-shadow 150ms",
  selectors: {
    "&:hover": {
      boxShadow: vars.shadow.md
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: "2px"
    }
  }
});

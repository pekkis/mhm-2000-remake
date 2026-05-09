import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const trigger = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.sm,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.bg,
  padding: vars.space.xs,
  borderRadius: vars.radius.sm,
  fontFamily: "inherit",
  fontSize: "inherit",
  color: "inherit",
  cursor: "pointer",
  minInlineSize: "16rem"
});

export const content = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  background: vars.color.bg,
  padding: 0,
  maxBlockSize: "20rem",
  overflow: "auto",
  minInlineSize: "var(--radix-select-trigger-width)"
});

export const viewport = style({
  padding: vars.space.xs,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs
});

export const item = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  padding: vars.space.xs,
  cursor: "pointer",
  borderRadius: vars.radius.sm,
  outline: "none",
  userSelect: "none",
  selectors: {
    "&[data-highlighted]": {
      background: vars.color.surfaceMuted
    },
    "&[data-disabled]": {
      opacity: 0.4,
      cursor: "not-allowed"
    }
  }
});

export const positionTag = style({
  fontWeight: "bold",
  textTransform: "uppercase",
  minInlineSize: "1.5em",
  textAlign: "center"
});

export const playerName = style({
  flex: 1
});

export const skillValue = style({
  fontVariantNumeric: "tabular-nums",
  textAlign: "end",
  minInlineSize: "2em"
});

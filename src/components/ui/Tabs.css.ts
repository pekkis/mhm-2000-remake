import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const root = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md
});

// Segmented-control style tab strip. The wrapper paints the muted
// surface and the selected tab gets the elevated `surfaceRaised` +
// soft shadow so it reads as the active "page" of a notebook tab
// strip — consistent with the physical-button aesthetic.
export const list = style({
  display: "inline-flex",
  flexWrap: "wrap",
  alignSelf: "flex-start",
  maxInlineSize: "100%",
  gap: vars.space.xs,
  padding: vars.space.xs,
  backgroundColor: vars.color.surfaceMuted,
  borderRadius: vars.radius.md,
  borderWidth: vars.borderWidth.thin,
  borderStyle: "solid",
  borderColor: vars.color.border
});

const tabBase = style({
  appearance: "none",
  cursor: "pointer",
  border: "none",
  background: "transparent",
  paddingBlock: vars.space.xs,
  paddingInline: vars.space.md,
  borderRadius: vars.radius.sm,
  fontFamily: "inherit",
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  color: vars.color.textMuted,
  whiteSpace: "nowrap",
  transition: "background-color 120ms ease, color 120ms ease",
  selectors: {
    "&:hover": {
      color: vars.color.text
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: "2px"
    }
  }
});

export const tab = styleVariants({
  inactive: [tabBase],
  active: [
    tabBase,
    {
      backgroundColor: vars.color.surfaceRaised,
      color: vars.color.text,
      fontWeight: vars.fontWeight.semibold,
      boxShadow: vars.shadow.sm
    }
  ]
});

// Panel is a passive container — let consumers nest their own layout
// primitives inside it.
export const panel = style({});

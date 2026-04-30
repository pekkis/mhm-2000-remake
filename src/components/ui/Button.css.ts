import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const button = style({
  borderWidth: vars.borderWidth.thin,
  borderStyle: "solid",
  borderColor: vars.color.border,
  borderRadius: vars.radius.sm,
  paddingBlock: vars.space.md,
  paddingInline: vars.space.lg,
  fontFamily: "inherit",
  color: vars.color.text,
  backgroundColor: vars.color.surfaceMuted,
  boxShadow: vars.shadow.button,
  outline: "none",
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.border,
      cursor: "pointer"
    },
    "&:active": {
      boxShadow: vars.shadow.buttonActive,
      transform: "translateY(2px)"
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed"
    },
    "&:disabled:active": {
      boxShadow: vars.shadow.button,
      transform: "none"
    }
  }
});

export const secondary = style({
  backgroundColor: vars.color.surfaceRaised,
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.surface
    }
  }
});

export const terse = style({
  paddingInline: vars.space.md
});

export const block = style({
  inlineSize: "100%",
  display: "block"
});

import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

// Row backgrounds. Body sticky cells inherit these so scrolling content
// doesn't bleed through them (see Table.css.ts).
export const row = styleVariants({
  light: {
    backgroundColor: vars.color.surface
  },
  dark: {
    backgroundColor: vars.color.surfaceMuted
  }
});

export const managerRow = style({
  color: vars.color.accent,
  fontWeight: vars.fontWeight.semibold
});

export const points = style({
  fontWeight: vars.fontWeight.semibold
});

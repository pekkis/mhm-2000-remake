import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const mailRow = style({
  cursor: "pointer",
  selectors: {
    "&:hover td": {
      backgroundColor: vars.color.surfaceMuted
    }
  }
});

export const selectedRow = style({
  selectors: {
    "&& td": {
      backgroundColor: vars.color.surfaceMuted,
      fontWeight: vars.fontWeight.semibold
    }
  }
});

export const messagePane = style({
  padding: vars.space.md,
  borderBlockStart: `${vars.borderWidth.thin} solid ${vars.color.borderMuted}`,
  backgroundColor: vars.color.surface
});

export const fromLine = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm
});

export const answerBar = style({
  display: "flex",
  gap: vars.space.sm,
  paddingBlockStart: vars.space.md,
  borderBlockStart: `${vars.borderWidth.thin} solid ${vars.color.borderMuted}`
});

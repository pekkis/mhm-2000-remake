import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const root = style({
  display: "flex",
  alignItems: "flex-start",
  gap: vars.space.sm,
  padding: vars.space.md,
  borderRadius: vars.radius.md,
  borderWidth: vars.borderWidth.thin,
  borderStyle: "solid"
});

export const icon = style({
  flex: "none",
  fontSize: vars.fontSize.lg,
  // Vertically nudge the icon to sit on the cap-height of the first
  // line of text rather than the line box's top.
  marginBlockStart: "0.15em"
});

export const body = style({
  flex: "1 1 auto",
  minInlineSize: 0
});

// Each level pairs a tinted surface with a matching accent border and
// foreground icon. The status colors all come from semantic tokens so
// dark mode lands for free.
export const level = styleVariants({
  info: {
    backgroundColor: vars.color.surfaceMuted,
    borderColor: vars.color.info,
    color: vars.color.text
  },
  success: {
    backgroundColor: vars.color.surfaceMuted,
    borderColor: vars.color.success,
    color: vars.color.text
  },
  warning: {
    backgroundColor: vars.color.surfaceMuted,
    borderColor: vars.color.warning,
    color: vars.color.text
  },
  danger: {
    backgroundColor: vars.color.surfaceMuted,
    borderColor: vars.color.danger,
    color: vars.color.text
  }
});

export const iconColor = styleVariants({
  info: { color: vars.color.info },
  success: { color: vars.color.success },
  warning: { color: vars.color.warning },
  danger: { color: vars.color.danger }
});

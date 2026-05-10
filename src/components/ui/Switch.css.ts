import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const root = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.sm
});

export const track = style({
  position: "relative",
  inlineSize: "2.5rem",
  blockSize: "1.375rem",
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceMuted,
  cursor: "pointer",
  padding: 0,
  transition: "background 150ms",
  selectors: {
    "&[data-state=checked]": {
      background: vars.color.accent,
      borderColor: vars.color.accent
    }
  }
});

export const thumb = style({
  display: "block",
  inlineSize: "1rem",
  blockSize: "1rem",
  borderRadius: vars.radius.pill,
  background: vars.color.bg,
  boxShadow: vars.shadow.sm,
  transition: "transform 150ms",
  transform: "translateX(2px)",
  selectors: {
    "&[data-state=checked]": {
      transform: "translateX(1.25rem)"
    }
  }
});

export const label = style({
  fontSize: vars.fontSize.sm,
  userSelect: "none",
  cursor: "pointer"
});

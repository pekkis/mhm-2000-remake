import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const root = style({
  display: "flex",
  gap: vars.space.none,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  overflow: "hidden"
});

export const item = style({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: `${vars.space.xs} ${vars.space.sm}`,
  border: "none",
  background: vars.color.bg,
  color: vars.color.text,
  fontFamily: "inherit",
  fontSize: vars.fontSize.sm,
  cursor: "pointer",
  userSelect: "none",
  selectors: {
    "&[data-state=checked]": {
      background: vars.color.accent,
      color: vars.color.accentText
    },
    "& + &": {
      borderInlineStart: `1px solid ${vars.color.border}`
    }
  }
});

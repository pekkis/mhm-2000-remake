import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const root = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: vars.radius.pill,
  paddingInline: vars.space.xs,
  fontSize: vars.fontSize.xs,
  fontWeight: "bold",
  lineHeight: 1,
  minInlineSize: "1.5em",
  blockSize: "1.5em"
});

export const level = styleVariants({
  info: {
    backgroundColor: vars.color.info,
    color: vars.color.bg
  },
  success: {
    backgroundColor: vars.color.success,
    color: vars.color.bg
  },
  warning: {
    backgroundColor: vars.color.warning,
    color: vars.color.bg
  },
  danger: {
    backgroundColor: vars.color.danger,
    color: vars.color.bg
  }
});

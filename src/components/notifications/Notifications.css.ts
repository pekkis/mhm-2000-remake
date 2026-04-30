import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const notifications = style({
  position: "fixed",
  insetBlockStart: 0,
  insetInlineStart: 0,
  inlineSize: "100%",
  zIndex: vars.zIndex.toast
});

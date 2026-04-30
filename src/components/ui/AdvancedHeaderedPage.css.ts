import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const root = style({
  display: "flex",
  flexDirection: "column",
  minBlockSize: "100dvh"
});

export const content = style({
  flex: 1
});

export const stickyMenu = style({
  position: "sticky",
  insetBlockEnd: 0,
  zIndex: vars.zIndex.sticky
});

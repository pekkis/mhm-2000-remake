import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  backgroundColor: vars.color.surfaceMuted,
  padding: "0.5em 0",
  color: vars.color.text,
  position: "fixed",
  bottom: 0,
  right: 0,
  left: 0,
  display: "flex",
  flexBasis: "100%",
  zIndex: vars.zIndex.sticky
});

globalStyle(`${container} .secondary`, {
  flexShrink: 10,
  padding: "0 0.5em"
});

globalStyle(`${container} .advance`, {
  alignSelf: "flex-end",
  textAlign: "right",
  flexGrow: 3,
  padding: "0 0.5em"
});

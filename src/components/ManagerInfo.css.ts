import { style } from "@vanilla-extract/css";

export const managerName = style({
  margin: 0
});

export const details = style({
  marginTop: "1em",
  display: "flex",
  flexBasis: "100%",
  flexWrap: "wrap",
  alignItems: "stretch"
});

export const detail = style({
  flexShrink: 0,
  width: "50%",
  display: "flex"
});

export const title = style({
  fontWeight: "bold"
});

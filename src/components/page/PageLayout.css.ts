import { vars } from "@/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const root = style({
  border: "1px solid rgb(0 0 0)",
  display: "grid",
  minHeight: "100vh",
  gap: vars.space.md,

  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  gridTemplateRows: "auto",
  gridTemplateAreas: `
"sidebar main main main"
"sidebar main main main"
"sidebar main main main"
`
});

export const content = style({
  gridArea: "main"
});

export const managerInfo = style({
  gridArea: "manager-info"
});

export const sidebar = style({
  gridArea: "sidebar",
  alignSelf: "start"
});

import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const selectRoot = style({
  appearance: "base-select",
  border: `1px solid ${vars.color.border}`,
  background: vars.color.bg,
  padding: vars.space.xs,
  borderRadius: vars.radius.sm,
  fontFamily: "inherit",
  fontSize: "inherit",
  color: "inherit",
  cursor: "pointer",
  minInlineSize: "12rem",
});

globalStyle(`${selectRoot}::picker(select)`, {
  appearance: "base-select",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  background: vars.color.bg,
  padding: 0,
  maxBlockSize: "20rem",
  overflow: "auto",
});

export const option = style({
  padding: vars.space.xs,
  cursor: "pointer",
  selectors: {
    "&:hover, &:focus": {
      background: vars.color.surfaceMuted,
    },
    "&:checked": {
      fontWeight: "bold",
    },
  },
});

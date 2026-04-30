import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const scroller = style({
  width: "100%",
  overflowX: "auto",
  WebkitOverflowScrolling: "touch"
});

export const table = style({
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  fontVariantNumeric: "tabular-nums"
});

const cellBase = style({
  padding: `${vars.space.xs} ${vars.space.sm}`,
  whiteSpace: "nowrap",
  textAlign: "start",
  borderBlockEnd: `${vars.borderWidth.thin} solid ${vars.color.borderMuted}`
});

export const td = style([cellBase]);

export const th = style([
  cellBase,
  {
    backgroundColor: vars.color.surfaceMuted,
    fontWeight: vars.fontWeight.semibold,
    color: vars.color.textMuted
  }
]);

export const align = styleVariants({
  start: { textAlign: "start" },
  center: { textAlign: "center" },
  end: { textAlign: "end" }
});

// Sticky variants. Body sticky cells inherit the row background so scrolling
// content doesn't bleed through (tr backgrounds don't paint cells by default
// — the cell has to opt in). Header sticky cells already carry an opaque bg
// from `.th`, and outrank body sticky cells at intersections.
export const sticky = styleVariants({
  "inline-start": {
    position: "sticky",
    insetInlineStart: 0,
    zIndex: 2,
    boxShadow: `inset -1px 0 0 ${vars.color.borderMuted}`,
    selectors: {
      "tbody &": { backgroundColor: "inherit" },
      "thead &": { zIndex: 3 }
    }
  },
  "inline-end": {
    position: "sticky",
    insetInlineEnd: 0,
    zIndex: 2,
    boxShadow: `inset 1px 0 0 ${vars.color.borderMuted}`,
    selectors: {
      "tbody &": { backgroundColor: "inherit" },
      "thead &": { zIndex: 3 }
    }
  },
  "block-start": {
    position: "sticky",
    insetBlockStart: 0,
    zIndex: 1,
    selectors: {
      "tbody &": { backgroundColor: "inherit" }
    }
  }
});

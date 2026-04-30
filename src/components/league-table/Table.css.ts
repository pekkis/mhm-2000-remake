import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const scroller = style({
  // Horizontal scroll container so sticky cells have something to stick within.
  width: "100%",
  maxWidth: "600px",
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
  textAlign: "right",
  borderBottom: `${vars.borderWidth.thin} solid ${vars.color.borderMuted}`
});

export const th = style([
  cellBase,
  {
    backgroundColor: vars.color.surfaceMuted,
    fontWeight: vars.fontWeight.semibold,
    color: vars.color.textMuted,
    position: "sticky",
    insetBlockStart: 0,
    zIndex: 1
  }
]);

export const td = style([cellBase]);

// Sticky inline-start (team name) — left edge while horizontally scrolling.
const stickyStart = style({
  position: "sticky",
  insetInlineStart: 0,
  textAlign: "left",
  zIndex: 2,
  // Subtle hairline to hint there's content scrolling underneath.
  boxShadow: `inset -1px 0 0 ${vars.color.borderMuted}`
});

// Sticky inline-end (points) — right edge while horizontally scrolling.
const stickyEnd = style({
  position: "sticky",
  insetInlineEnd: 0,
  zIndex: 2,
  fontWeight: vars.fontWeight.semibold,
  boxShadow: `inset 1px 0 0 ${vars.color.borderMuted}`
});

// Body sticky cells inherit the row's background so scrolling cells don't
// bleed through. Header sticky cells already have their own solid background
// from `th`, so they don't need this.
const tdStickyBg = style({
  backgroundColor: "inherit"
});

export const thStart = style([th, stickyStart, { zIndex: 3 }]);
export const thEnd = style([th, stickyEnd, { zIndex: 3 }]);
export const tdStart = style([td, stickyStart, tdStickyBg]);
export const tdEnd = style([td, stickyEnd, tdStickyBg]);

// Row backgrounds. Sticky cells need an opaque background or the scrolling
// cells show through them.
export const row = styleVariants({
  light: {
    backgroundColor: vars.color.surface
  },
  dark: {
    backgroundColor: vars.color.surfaceMuted
  }
});

export const managerRow = style({
  color: vars.color.accent,
  fontWeight: vars.fontWeight.semibold
});

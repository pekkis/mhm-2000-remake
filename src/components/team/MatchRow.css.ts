import { style } from "@vanilla-extract/css";

// Both name columns claim half the available width and align toward the
// center dash. The score cell stays at its content width.
export const halfColumn = style({
  inlineSize: "50%"
});

// Fixed-width inline-block keeps the score cell's intrinsic content
// width constant so the dash column doesn't drift as scores grow from
// "2–1" to "13–11". Auto-layout tables size by content; the cell sees
// the same `min-content` every render.
export const scoreSlot = style({
  display: "inline-block",
  inlineSize: "4.5ch",
  textAlign: "end",
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums"
});

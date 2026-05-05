import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

/**
 * Horizontal scrolling container — one column per playoff round.
 * `align-items: stretch` forces all round columns to the same height
 * (set by the round with the most matchups), which makes the
 * `space-around` distribution in `.matchupsWrapper` visually align
 * across rounds like a real bracket.
 */
export const bracket = style({
  display: "flex",
  alignItems: "stretch",
  gap: vars.space.xl,
  overflowX: "auto",
  paddingBlockEnd: vars.space.sm
});

export const round = style({
  display: "flex",
  flexDirection: "column",
  minInlineSize: "180px",
  flex: "none"
});

export const roundHeader = style({
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.textMuted,
  textTransform: "uppercase",
  textAlign: "center",
  letterSpacing: "0.06em",
  paddingBlockEnd: vars.space.sm,
  marginBlockEnd: vars.space.sm,
  borderBlockEnd: `${vars.borderWidth.thin} solid ${vars.color.border}`
});

/**
 * Distributes matchups evenly over the full column height.
 * With 4 matchups → ~12.5 / 37.5 / 62.5 / 87.5 % positions.
 * With 2 matchups → 25 / 75 %.
 * With 1 matchup  → 50 %.
 * This gives the classic bracket staircase without any JS math.
 */
export const matchupsWrapper = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  flex: "1"
});

export const matchup = style({
  backgroundColor: vars.color.surface,
  borderRadius: vars.radius.md,
  border: `${vars.borderWidth.thin} solid ${vars.color.border}`,
  overflow: "hidden"
});

export const teamRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.xs,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  selectors: {
    "& + &": {
      borderBlockStart: `${vars.borderWidth.thin} solid ${vars.color.borderMuted}`
    }
  }
});

export const teamRowWinner = style({
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.success
});

export const teamRowEliminated = style({
  color: vars.color.textMuted
});

export const teamName = style({
  flex: "1",
  minInlineSize: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
});

export const teamScore = style({
  fontWeight: vars.fontWeight.bold,
  fontSize: vars.fontSize.sm,
  flexShrink: 0,
  minInlineSize: "1ch",
  textAlign: "end"
});

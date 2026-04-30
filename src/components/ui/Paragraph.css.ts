import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

// Default block rhythm between paragraphs, but no margin on the first
// or last so the paragraph doesn't push its container around. The
// classic "prose flow" pattern — paragraphs stack against each other,
// not against their parent's edges.
export const root = style({
  marginBlock: vars.space.md,
  selectors: {
    "&:first-child": { marginBlockStart: 0 },
    "&:last-child": { marginBlockEnd: 0 }
  }
});

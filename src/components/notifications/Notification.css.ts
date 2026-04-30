import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

// The notification stack is fixed to the top of the viewport and lands
// directly on top of `ManagerInfo`. To stop them blending we paint the
// toast in the brand accent (always-dark blue) and pair it with the
// inverse text token. The shadow lifts it off whatever is underneath.
export const notification = style({
  backgroundColor: vars.color.accent,
  color: vars.color.accentText,
  padding: vars.space.md,
  borderBlockEnd: `${vars.borderWidth.thin} solid ${vars.color.accentMuted}`,
  boxShadow: vars.shadow.md,
  cursor: "pointer"
});

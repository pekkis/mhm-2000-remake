import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

/**
 * Shared chrome for `<input>` and `<select>`. Owns border, padding,
 * focus ring and invalid state so both controls stay in lockstep.
 * Compose via `style([fieldChrome, …])`.
 */
export const fieldChrome = style({
  borderWidth: vars.borderWidth.thin,
  borderStyle: "solid",
  borderColor: vars.color.border,
  borderRadius: vars.radius.sm,
  padding: "0.5em",
  fontFamily: "inherit",
  fontSize: "inherit",
  color: vars.color.text,
  backgroundColor: vars.color.surfaceRaised,
  outline: "none",
  selectors: {
    "&:focus-visible": {
      borderColor: vars.color.accent,
      boxShadow: `0 0 0 3px ${vars.color.accent}40`
    },
    '&[aria-invalid="true"]': {
      borderColor: vars.color.danger
    },
    '&[aria-invalid="true"]:focus-visible': {
      boxShadow: `0 0 0 3px ${vars.color.danger}40`
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed"
    }
  }
});

export const block = style({
  inlineSize: "100%",
  display: "block"
});

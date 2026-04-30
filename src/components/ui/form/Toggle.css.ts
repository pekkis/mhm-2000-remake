import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const toggle = style({
  position: "relative",
  display: "inline-block",
  inlineSize: "50px",
  blockSize: "24px",
  verticalAlign: "middle"
});

export const input = style({
  position: "absolute",
  inlineSize: "1px",
  blockSize: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  border: 0
});

export const track = style({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.border,
  transition: "background-color 0.2s ease",
  cursor: "pointer",
  selectors: {
    [`${input}:checked + &`]: {
      backgroundColor: vars.color.accent
    },
    [`${input}:disabled + &`]: {
      opacity: 0.5,
      cursor: "not-allowed"
    },
    [`${input}:focus-visible + &`]: {
      boxShadow: `0 0 2px 3px ${vars.color.accent}`
    }
  },
  "::before": {
    content: '""',
    position: "absolute",
    top: "1px",
    left: "1px",
    inlineSize: "22px",
    blockSize: "22px",
    borderRadius: "50%",
    backgroundColor: vars.color.surfaceRaised,
    borderWidth: vars.borderWidth.thin,
    borderStyle: "solid",
    borderColor: vars.color.border,
    transition: "all 0.25s ease"
  }
});

globalStyle(`${input}:checked + ${track}::before`, {
  left: "27px",
  borderColor: vars.color.accent
});

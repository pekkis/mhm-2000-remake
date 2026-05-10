import { style, keyframes } from "@vanilla-extract/css";

const pulse = keyframes({
  "0%": { opacity: 0.4, transform: "scale(1.08)" },
  "100%": { opacity: 1, transform: "scale(1)" }
});

const shake = keyframes({
  "0%, 100%": { transform: "translateX(0)" },
  "15%": { transform: "translateX(-4px)" },
  "30%": { transform: "translateX(4px)" },
  "45%": { transform: "translateX(-3px)" },
  "60%": { transform: "translateX(3px)" },
  "75%": { transform: "translateX(-1px)" }
});

export const payoutPulse = style({
  animation: `${pulse} 0.4s ease-out`
});

export const haggleShake = style({
  animation: `${shake} 0.5s ease-out`
});

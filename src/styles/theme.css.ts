import { createGlobalTheme } from "@vanilla-extract/css";

/**
 * Raw color palette. Use sparingly — semantic tokens below are
 * preferred so dark mode and future re-skins land for free.
 */
const palette = {
  white: "#ffffff",
  black: "#0a0a0a",
  neutral50: "#f8fafc",
  neutral100: "#f1f5f9",
  neutral200: "#e2e8f0",
  neutral300: "#cbd5e1",
  neutral400: "#94a3b8",
  neutral500: "#64748b",
  neutral600: "#475569",
  neutral700: "#334155",
  neutral800: "#1e293b",
  neutral900: "#0f172a",
  blue500: "#007ce0",
  blue700: "#004175",
  red500: "#dc2626",
  red400: "#f87171",
  green500: "#16a34a",
  green400: "#4ade80",
  amber500: "#d97706",
  amber400: "#fbbf24"
} as const;

/**
 * `light-dark()` resolves at runtime from `color-scheme`. We set
 * `color-scheme: light dark` on `:root` (see `global.css.ts`) so the
 * browser picks the right value and respects `prefers-color-scheme`.
 */
const ld = (light: string, dark: string) => `light-dark(${light}, ${dark})`;

export const vars = createGlobalTheme(":root", {
  color: {
    // Surfaces
    bg: ld(palette.white, palette.neutral900),
    surface: ld(palette.neutral50, palette.neutral800),
    surfaceMuted: ld(palette.neutral100, palette.neutral700),
    surfaceRaised: ld(palette.white, palette.neutral800),
    // Foreground
    text: ld(palette.neutral900, palette.neutral50),
    textMuted: ld(palette.neutral600, palette.neutral300),
    textInverse: ld(palette.white, palette.neutral900),
    // Borders
    border: ld(palette.neutral200, palette.neutral700),
    borderMuted: ld(palette.neutral100, palette.neutral800),
    // Brand
    accent: palette.blue500,
    accentMuted: palette.blue700,
    accentText: palette.white,
    // Status
    success: ld(palette.green500, palette.green400),
    danger: ld(palette.red500, palette.red400),
    warning: ld(palette.amber500, palette.amber400),
    info: palette.blue500,
    // Modal/dialog backdrop tint. Same in both schemes — it's an
    // overlay over arbitrary content, not a surface itself.
    backdrop: "rgb(0 0 0 / 0.5)",
    // Transparent helper for explicit fallthroughs
    transparent: "transparent"
  },
  space: {
    none: "0",
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    "4xl": "6rem"
  },
  radius: {
    none: "0",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    pill: "9999px"
  },
  borderWidth: {
    none: "0",
    thin: "1px",
    thick: "2px",
    heavy: "4px"
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem"
  },
  lineHeight: {
    tight: "1.1",
    snug: "1.25",
    normal: "1.5",
    relaxed: "1.625"
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700"
  },
  fontFamily: {
    body: "'IBM Plex Sans Variable', sans-serif",
    mono: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
  },
  shadow: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    // Pressable physical-button shadows. Hard, no blur. `button` is
    // the resting state; `buttonActive` is the depressed state. The
    // 2px offset delta plus a `translateY(2px)` produces the press.
    button: "0 3px rgb(0 0 0 / 0.25)",
    buttonActive: "0 1px rgb(0 0 0 / 0.25)"
  },
  /**
   * Named z-index layers. Use these instead of bare numbers so the
   * stacking contract is in one place. Higher number = closer to the
   * user. Leave gaps so future layers slot in without renumbering.
   */
  zIndex: {
    base: "0",
    raised: "10",
    sticky: "100",
    overlay: "500",
    modal: "1000",
    toast: "1500",
    tooltip: "2000"
  }
});

/**
 * Breakpoints aren't part of `vars` — they're used by sprinkles
 * conditions and direct `@media` / `@container` queries. Keep these
 * in sync with `sprinkles.css.ts`.
 */
export const breakpoints = {
  mobile: "0px",
  tablet: "640px",
  desktop: "1024px",
  wide: "1280px"
} as const;

import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";
import { vars, breakpoints } from "./theme.css";

/**
 * Mobile-first responsive conditions. The default (mobile) is unwrapped;
 * `tablet` / `desktop` stack via `min-width` media queries. Component-
 * level adaptation should reach for container queries directly in CSS;
 * sprinkles only carries viewport-driven variants.
 */
const responsiveConditions = {
  mobile: {},
  tablet: { "@media": `screen and (min-width: ${breakpoints.tablet})` },
  desktop: { "@media": `screen and (min-width: ${breakpoints.desktop})` }
} as const;

const responsiveDefaults = {
  conditions: responsiveConditions,
  defaultCondition: "mobile",
  responsiveArray: ["mobile", "tablet", "desktop"]
} as const;

const spaceProperties = defineProperties({
  ...responsiveDefaults,
  properties: {
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    marginTop: vars.space,
    marginBottom: vars.space,
    marginLeft: vars.space,
    marginRight: vars.space,
    gap: vars.space,
    rowGap: vars.space,
    columnGap: vars.space
  },
  shorthands: {
    padding: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
    paddingX: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
    margin: ["marginTop", "marginBottom", "marginLeft", "marginRight"],
    marginX: ["marginLeft", "marginRight"],
    marginY: ["marginTop", "marginBottom"]
  }
});

const layoutProperties = defineProperties({
  ...responsiveDefaults,
  properties: {
    display: [
      "none",
      "block",
      "inline",
      "inline-block",
      "flex",
      "inline-flex",
      "grid",
      "inline-grid",
      "contents"
    ],
    flexDirection: ["row", "row-reverse", "column", "column-reverse"],
    flexWrap: ["nowrap", "wrap", "wrap-reverse"],
    alignItems: ["stretch", "start", "center", "end", "baseline"],
    justifyContent: [
      "start",
      "center",
      "end",
      "space-between",
      "space-around",
      "space-evenly"
    ],
    gridAutoFlow: ["row", "column", "dense"],
    gridTemplateColumns: {
      "1": "repeat(1, minmax(0, 1fr))",
      "2": "repeat(2, minmax(0, 1fr))",
      "3": "repeat(3, minmax(0, 1fr))",
      "4": "repeat(4, minmax(0, 1fr))",
      "6": "repeat(6, minmax(0, 1fr))",
      "12": "repeat(12, minmax(0, 1fr))"
    },
    width: ["auto", "100%", "fit-content", "min-content", "max-content"],
    maxWidth: ["100%", "fit-content"],
    height: ["auto", "100%"],
    overflow: ["visible", "hidden", "auto", "scroll", "clip"],
    position: ["static", "relative", "absolute", "fixed", "sticky"],
    zIndex: vars.zIndex,
    flex: ["none", "auto", "0", "1"]
  }
});

const colorProperties = defineProperties({
  properties: {
    color: vars.color,
    backgroundColor: vars.color,
    borderColor: vars.color
  }
});

const typographyProperties = defineProperties({
  properties: {
    fontSize: vars.fontSize,
    fontWeight: vars.fontWeight,
    lineHeight: vars.lineHeight,
    fontFamily: vars.fontFamily,
    textAlign: ["start", "center", "end", "justify", "left", "right"],
    textTransform: ["none", "uppercase", "lowercase", "capitalize"]
  }
});

const surfaceProperties = defineProperties({
  properties: {
    borderRadius: vars.radius,
    borderWidth: vars.borderWidth,
    borderStyle: ["none", "solid", "dashed", "dotted"],
    boxShadow: vars.shadow
  }
});

export const sprinkles = createSprinkles(
  spaceProperties,
  layoutProperties,
  colorProperties,
  typographyProperties,
  surfaceProperties
);

export type Sprinkles = Parameters<typeof sprinkles>[0];

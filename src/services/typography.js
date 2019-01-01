import Typography from "typography";

const typography = new Typography({
  includeNormalize: true,
  baseFontSize: "16px",
  baseLineHeight: 1.45,
  headerFontFamily: ["Maven Pro", "sans-serif"],
  bodyFontFamily: ["Maven Pro", "sans-serif"],
  googleFonts: [
    {
      name: "Maven Pro",
      styles: ["700"]
    },
    {
      name: "Maven Pro",
      styles: ["400", "400i", "700", "700i"]
    }
  ]
});

export default typography;

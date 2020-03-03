import { base } from "@theme-ui/presets";

const theme = {
  ...base,
  buttons: {
    primary: {
      // you can reference other values defined in the theme
      color: "white",
      bg: "primary",
      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.3
      }
    }
  }
};

export default theme;

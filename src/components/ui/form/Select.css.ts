import { style } from "@vanilla-extract/css";
import { fieldChrome } from "./field-chrome.css";

// Mid-gray chevron — readable in both light and dark schemes without
// having to fork the SVG. `%23` = URL-encoded `#`.
const chevron =
  "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%23808080' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M1 1.5l5 5 5-5'/%3E%3C/svg%3E\")";

export const select = style([
  fieldChrome,
  {
    appearance: "none",
    paddingInlineEnd: "2em",
    backgroundImage: chevron,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75em center",
    backgroundSize: "0.75em"
  }
]);

export { block } from "./field-chrome.css";

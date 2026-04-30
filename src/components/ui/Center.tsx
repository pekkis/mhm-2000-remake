import type { CSSProperties, FC, ReactNode } from "react";
import clsx from "clsx";
import * as styles from "./Center.css";

type CenterProps = {
  children?: ReactNode;
  className?: string;
  /**
   * Optional cap on inline size. Anything CSS accepts:
   * `"600px"`, `"60ch"`, `"min(100%, 800px)"`, …
   */
  maxInlineSize?: CSSProperties["maxInlineSize"];
};

/**
 * Centers a block horizontally via `margin-inline: auto`. Optionally
 * caps inline size so the centered block doesn't span the whole parent.
 *
 * Single concern. For aligning *children* along an axis use `<Stack>` /
 * `<Cluster>`; for content padding/background use `<Box>`.
 */
const Center: FC<CenterProps> = ({ children, className, maxInlineSize }) => (
  <div
    className={clsx(styles.root, className)}
    style={maxInlineSize !== undefined ? { maxInlineSize } : undefined}
  >
    {children}
  </div>
);

Center.displayName = "Center";

export default Center;

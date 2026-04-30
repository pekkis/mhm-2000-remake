import type { FC, ReactNode } from "react";
import clsx from "clsx";
import { sprinkles } from "@/styles/sprinkles.css";
import { vars } from "@/styles/theme.css";
import * as styles from "./Heading.css";

type FontSizeKey = keyof typeof vars.fontSize;
type FontWeightKey = keyof typeof vars.fontWeight;
type TextAlign = "start" | "center" | "end" | "justify";
type Level = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Default visual size per heading level. Mirrors the element-default
 * styles in `src/styles/global.css.ts` so `<Heading level={2}>` looks
 * the same as a bare `<h2>` does today.
 */
const sizeForLevel: Record<Level, FontSizeKey> = {
  1: "4xl",
  2: "2xl",
  3: "lg",
  4: "md",
  5: "sm",
  6: "xs"
};

type HeadingProps = {
  children?: ReactNode;
  className?: string;
  level: Level;
  size?: FontSizeKey;
  weight?: FontWeightKey;
  align?: TextAlign;
};

const tagForLevel: Record<Level, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6"
};

const Heading: FC<HeadingProps> = ({
  children,
  className,
  level,
  size,
  weight,
  align
}) => {
  const Tag = tagForLevel[level];
  const sprinkleClass = sprinkles({
    fontSize: size ?? sizeForLevel[level],
    ...(weight !== undefined && { fontWeight: weight }),
    ...(align !== undefined && { textAlign: align })
  });
  return (
    <Tag className={clsx(styles.root, sprinkleClass, className)}>
      {children}
    </Tag>
  );
};

Heading.displayName = "Heading";

export default Heading;

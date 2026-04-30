import type { FC, ReactNode } from "react";
import clsx from "clsx";
import { sprinkles } from "@/styles/sprinkles.css";
import { vars } from "@/styles/theme.css";

type SpaceKey = keyof typeof vars.space;
type Direction = "row" | "row-reverse" | "column" | "column-reverse";
type Align = "stretch" | "start" | "center" | "end" | "baseline";
type Justify =
  | "start"
  | "center"
  | "end"
  | "space-between"
  | "space-around"
  | "space-evenly";
type Wrap = "nowrap" | "wrap" | "wrap-reverse";

// Layout-appropriate semantic elements. No <a> / <button> / <input> on purpose:
// per-element prop typing isn't carried, so restrict to tags that take only
// generic block content.
type LayoutElement =
  | "div"
  | "section"
  | "article"
  | "nav"
  | "ul"
  | "ol"
  | "header"
  | "footer"
  | "main"
  | "aside"
  | "form";

type StackProps = {
  children?: ReactNode;
  className?: string;
  as?: LayoutElement;
  direction?: Direction;
  gap?: SpaceKey;
  align?: Align;
  justify?: Justify;
  wrap?: Wrap;
  inline?: boolean;
};

const Stack: FC<StackProps> = ({
  children,
  className,
  as: Element = "div",
  direction = "column",
  gap = "md",
  align,
  justify,
  wrap,
  inline = false
}) => {
  const sprinkleClass = sprinkles({
    display: inline ? "inline-flex" : "flex",
    flexDirection: direction,
    gap,
    ...(align !== undefined && { alignItems: align }),
    ...(justify !== undefined && { justifyContent: justify }),
    ...(wrap !== undefined && { flexWrap: wrap })
  });
  return (
    <Element className={clsx(sprinkleClass, className)}>{children}</Element>
  );
};

Stack.displayName = "Stack";

export default Stack;

import type { ElementType, FC, ReactNode } from "react";
import clsx from "clsx";
import { sprinkles } from "@/styles/sprinkles.css";
import { vars } from "@/styles/theme.css";

type SpaceKey = keyof typeof vars.space;
type ColorKey = keyof typeof vars.color;
type RadiusKey = keyof typeof vars.radius;
type TextAlign = "start" | "center" | "end" | "justify";
type Flex = "none" | "auto" | "0" | "1";

type BoxProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  p?: SpaceKey;
  px?: SpaceKey;
  py?: SpaceKey;
  m?: SpaceKey;
  mx?: SpaceKey;
  my?: SpaceKey;
  bg?: ColorKey;
  color?: ColorKey;
  radius?: RadiusKey;
  textAlign?: TextAlign;
  flex?: Flex;
};

const Box: FC<BoxProps> = ({
  as: Component = "div",
  children,
  className,
  p,
  px,
  py,
  m,
  mx,
  my,
  bg,
  color,
  radius,
  textAlign,
  flex
}) => {
  const sprinkleClass = sprinkles({
    ...(p !== undefined && { padding: p }),
    ...(px !== undefined && { paddingX: px }),
    ...(py !== undefined && { paddingY: py }),
    ...(m !== undefined && { margin: m }),
    ...(mx !== undefined && { marginX: mx }),
    ...(my !== undefined && { marginY: my }),
    ...(bg !== undefined && { backgroundColor: bg }),
    ...(color !== undefined && { color }),
    ...(radius !== undefined && { borderRadius: radius }),
    ...(textAlign !== undefined && { textAlign }),
    ...(flex !== undefined && { flex })
  });
  return <Component className={clsx(sprinkleClass, className)}>{children}</Component>;
};

Box.displayName = "Box";

export default Box;

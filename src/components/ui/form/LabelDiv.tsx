import type { FC, HTMLAttributes } from "react";
import clsx from "clsx";
import { labelDiv } from "./LabelDiv.css";

const LabelDiv: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => {
  return <div className={clsx(labelDiv, className)} {...rest} />;
};

export default LabelDiv;

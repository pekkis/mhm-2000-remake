import type { FC, LabelHTMLAttributes } from "react";
import clsx from "clsx";
import { label } from "./Label.css";

const Label: FC<LabelHTMLAttributes<HTMLLabelElement>> = ({
  className,
  ...rest
}) => {
  return <label className={clsx(label, className)} {...rest} />;
};

export default Label;

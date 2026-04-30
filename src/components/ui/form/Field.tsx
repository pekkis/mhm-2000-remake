import type { FC, HTMLAttributes } from "react";
import clsx from "clsx";
import { field } from "./Field.css";

const Field: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => {
  return <div className={clsx(field, className)} {...rest} />;
};

export default Field;

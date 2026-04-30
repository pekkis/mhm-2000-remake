import type { FC, SelectHTMLAttributes } from "react";
import clsx from "clsx";
import * as styles from "./Select.css";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  block?: boolean;
};

const Select: FC<SelectProps> = ({ block, className, ...rest }) => {
  return (
    <select
      className={clsx(styles.select, block && styles.block, className)}
      {...rest}
    />
  );
};

export default Select;

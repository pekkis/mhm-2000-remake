import type { FC, InputHTMLAttributes } from "react";
import clsx from "clsx";
import * as styles from "./Input.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  block?: boolean;
};

const Input: FC<InputProps> = ({ block, className, ...rest }) => {
  return (
    <input
      className={clsx(styles.input, block && styles.block, className)}
      {...rest}
    />
  );
};

export default Input;

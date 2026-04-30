import type { FC, ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import * as styles from "./Button.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  secondary?: boolean;
  terse?: boolean;
  block?: boolean;
};

const Button: FC<ButtonProps> = ({
  secondary,
  terse,
  block,
  className,
  ...rest
}) => {
  return (
    <button
      className={clsx(
        styles.button,
        secondary && styles.secondary,
        terse && styles.terse,
        block && styles.block,
        className
      )}
      {...rest}
    />
  );
};

export default Button;

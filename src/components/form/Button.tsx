import React, { FunctionComponent } from "react";
import { Button as TButton } from "theme-ui";

interface Props {
  full?: boolean;
  block?: boolean;
  terse?: boolean;
  variant?: string;
  disabled?: boolean;
}

const Button: FunctionComponent<Props &
  React.PropsWithoutRef<JSX.IntrinsicElements["button"]>> = ({
  full,
  block,
  terse,
  variant,
  disabled,
  ...props
}) => {
  return (
    <TButton
      {...props}
      disabled={disabled}
      variant={variant}
      sx={{
        width: block ? "full" : "auto"
      }}
    />
  );
};
export default Button;

import React, { ReactElement, FunctionComponent } from "react";

interface Props {
  isClone?: boolean;
  children: ReactElement;
}

const Table: FunctionComponent<Props> = ({
  isClone = false,
  children,
  ...rest
}) => {
  return (
    <table {...rest} className={isClone ? "clone" : undefined}>
      {children}
    </table>
  );
};

export default Table;

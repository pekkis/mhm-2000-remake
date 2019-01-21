import React from "react";

const Table = props => {
  const { isClone, children, ...rest } = props;
  return (
    <table {...rest} className={isClone ? "clone" : undefined}>
      {children}
    </table>
  );
};

Table.defaultProps = {
  isClone: false
};

export default Table;

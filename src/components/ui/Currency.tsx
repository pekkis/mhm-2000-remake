import React, { FunctionComponent } from "react";
import { currencyFormatter } from "../../services/format";

interface Props {
  value: number;
}

const Currency: FunctionComponent<Props> = ({ value }) => {
  return <span>{currencyFormatter.format(value)}</span>;
};

export default Currency;

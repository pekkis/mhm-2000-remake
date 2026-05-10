import type { FC } from "react";
import * as styles from "./Meter.css";

type Props = {
  value: number;
  min?: number;
  max?: number;
  low?: number;
  high?: number;
  optimum?: number;
  label?: string;
};

const Meter: FC<Props> = ({ value, min, max, low, high, optimum, label }) => {
  return (
    <meter
      className={styles.meter}
      value={value}
      min={min}
      max={max}
      low={low}
      high={high}
      optimum={optimum}
      aria-label={label}
    />
  );
};

export default Meter;

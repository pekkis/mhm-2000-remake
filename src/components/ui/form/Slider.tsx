import type { FC } from "react";
import * as styles from "./Slider.css";

type SliderProps = {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
};

const Slider: FC<SliderProps> = ({ min, max, step, value, onChange }) => {
  return (
    <input
      className={styles.slider}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
};

export default Slider;

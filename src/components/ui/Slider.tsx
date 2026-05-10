import * as RadixSlider from "@radix-ui/react-slider";
import * as styles from "./Slider.css";

type Props = {
  min: number;
  max: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
};

const Slider = ({ min, max, step = 1, value, onValueChange }: Props) => {
  return (
    <RadixSlider.Root
      className={styles.root}
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={([v]) => onValueChange(v)}
    >
      <RadixSlider.Track className={styles.track}>
        <RadixSlider.Range className={styles.range} />
      </RadixSlider.Track>
      <RadixSlider.Thumb className={styles.thumb} />
    </RadixSlider.Root>
  );
};

export default Slider;

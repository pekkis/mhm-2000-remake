import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import * as styles from "./RadioGroup.css";

type RadioGroupOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: ReadonlyArray<RadioGroupOption<T>>;
  value: T;
  onValueChange: (value: T) => void;
};

const RadioGroup = <T extends string>({
  options,
  value,
  onValueChange
}: Props<T>) => {
  return (
    <RadixRadioGroup.Root
      className={styles.root}
      value={value}
      onValueChange={onValueChange as (v: string) => void}
    >
      {options.map((opt) => (
        <RadixRadioGroup.Item
          key={opt.value}
          className={styles.item}
          value={opt.value}
        >
          {opt.label}
        </RadixRadioGroup.Item>
      ))}
    </RadixRadioGroup.Root>
  );
};

export default RadioGroup;

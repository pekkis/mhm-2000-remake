import * as RadixSwitch from "@radix-ui/react-switch";
import { useId } from "react";
import * as styles from "./Switch.css";

type Props = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
};

const Switch = ({ checked, onCheckedChange, label }: Props) => {
  const id = useId();

  return (
    <div className={styles.root}>
      <RadixSwitch.Root
        id={id}
        className={styles.track}
        checked={checked}
        onCheckedChange={onCheckedChange}
      >
        <RadixSwitch.Thumb className={styles.thumb} />
      </RadixSwitch.Root>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </div>
  );
};

export default Switch;

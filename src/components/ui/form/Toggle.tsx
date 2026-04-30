import type { FC } from "react";
import * as styles from "./Toggle.css";

type ToggleProps = {
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
};

const Toggle: FC<ToggleProps> = ({ id, checked, disabled, onChange }) => {
  return (
    <span className={styles.toggle}>
      <input
        className={styles.input}
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <label className={styles.track} htmlFor={id} />
    </span>
  );
};

export default Toggle;

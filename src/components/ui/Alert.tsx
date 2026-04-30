import type { FC, ReactNode } from "react";
import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle
} from "react-icons/fa";
import clsx from "clsx";
import * as styles from "./Alert.css";

export type AlertLevel = "info" | "success" | "warning" | "danger";

type AlertProps = {
  children: ReactNode;
  level?: AlertLevel;
  className?: string;
};

const iconForLevel: Record<AlertLevel, typeof FaInfoCircle> = {
  info: FaInfoCircle,
  success: FaCheckCircle,
  warning: FaExclamationTriangle,
  danger: FaTimesCircle
};

/**
 * Inline contextual alert. Use for situational hints, warnings or
 * confirmations that live inside a page (not for transient toasts —
 * those go through `<Notifications>`).
 */
const Alert: FC<AlertProps> = ({ children, level = "info", className }) => {
  const Icon = iconForLevel[level];
  return (
    <div
      role={level === "danger" || level === "warning" ? "alert" : "status"}
      className={clsx(styles.root, styles.level[level], className)}
    >
      <span className={clsx(styles.icon, styles.iconColor[level])}>
        <Icon aria-hidden />
      </span>
      <div className={styles.body}>{children}</div>
    </div>
  );
};

export default Alert;

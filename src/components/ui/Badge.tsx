import type { AlertLevel } from "@/components/ui/Alert";
import clsx from "clsx";
import type { FC, ReactNode } from "react";
import * as styles from "./Badge.css";

type Props = {
  children: ReactNode;
  level?: AlertLevel;
  className?: string;
};

const Badge: FC<Props> = ({ children, level = "info", className }) => (
  <span className={clsx(styles.root, styles.level[level], className)}>
    {children}
  </span>
);

export default Badge;

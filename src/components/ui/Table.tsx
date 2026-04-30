import type {
  CSSProperties,
  FC,
  ReactNode,
  ThHTMLAttributes,
  TdHTMLAttributes
} from "react";
import clsx from "clsx";
import * as styles from "./Table.css";

type StickyEdge = "inline-start" | "inline-end" | "block-start";
type Align = "start" | "center" | "end";

type TableProps = {
  children?: ReactNode;
  className?: string;
  // Optional cap so wide tables don't blow out their container.
  maxInlineSize?: CSSProperties["maxInlineSize"];
};

export const Table: FC<TableProps> = ({
  children,
  className,
  maxInlineSize
}) => (
  <div
    className={styles.scroller}
    style={maxInlineSize !== undefined ? { maxInlineSize } : undefined}
  >
    <table className={clsx(styles.table, className)}>{children}</table>
  </div>
);

type ThProps = Omit<ThHTMLAttributes<HTMLTableCellElement>, "align"> & {
  sticky?: StickyEdge;
  align?: Align;
};

export const Th: FC<ThProps> = ({ sticky, align, className, ...rest }) => (
  <th
    className={clsx(
      styles.th,
      sticky && styles.sticky[sticky],
      align && styles.align[align],
      className
    )}
    {...rest}
  />
);

type TdProps = Omit<TdHTMLAttributes<HTMLTableCellElement>, "align"> & {
  sticky?: StickyEdge;
  align?: Align;
};

export const Td: FC<TdProps> = ({ sticky, align, className, ...rest }) => (
  <td
    className={clsx(
      styles.td,
      sticky && styles.sticky[sticky],
      align && styles.align[align],
      className
    )}
    {...rest}
  />
);

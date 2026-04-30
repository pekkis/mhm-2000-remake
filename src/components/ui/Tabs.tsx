import { Activity, useId, useRef, type FC, type ReactNode } from "react";
import * as styles from "./Tabs.css";

export type TabItem = {
  title: string;
  content: () => ReactNode;
};

type TabsProps = {
  items: TabItem[];
  selected: number;
  onSelect: (index: number) => void;
  className?: string;
};

/**
 * Segmented-control tabs with proper ARIA `tablist`/`tab`/`tabpanel`
 * wiring. Configuration-driven (pass an `items` array) — no children
 * acrobatics, no `cloneElement`, no implicit prop injection.
 *
 * Panels are lazy-mounted on first visit and then kept alive via
 * React 19.2's `<Activity mode="hidden">`. The `content` factory for
 * a tab the user never opens is never called, and switching tabs
 * preserves the active panel's local state (form drafts, scroll,
 * nested tab selection) instead of remounting it.
 */
const Tabs: FC<TabsProps> = ({ items, selected, onSelect, className }) => {
  const baseId = useId();
  const safeSelected = Math.min(Math.max(selected, 0), items.length - 1);

  // Tracks which tabs have ever been visited. A ref (not state) is
  // enough: visiting a tab already triggers a re-render through
  // `selected` flipping, and we never want to read this during render
  // for any other tab than the current one.
  const visited = useRef<Set<number>>(new Set([safeSelected]));
  visited.current.add(safeSelected);

  return (
    <div className={className}>
      <div className={styles.root}>
        <div role="tablist" className={styles.list}>
          {items.map((item, index) => {
            const isActive = index === safeSelected;
            return (
              <button
                key={item.title}
                type="button"
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel-${index}`}
                tabIndex={isActive ? 0 : -1}
                className={isActive ? styles.tab.active : styles.tab.inactive}
                onClick={() => onSelect(index)}
              >
                {item.title}
              </button>
            );
          })}
        </div>

        {items.map((item, index) => {
          if (!visited.current.has(index)) {
            return null;
          }
          const isActive = index === safeSelected;
          return (
            <Activity key={index} mode={isActive ? "visible" : "hidden"}>
              <div
                role="tabpanel"
                id={`${baseId}-panel-${index}`}
                aria-labelledby={`${baseId}-tab-${index}`}
                hidden={!isActive}
                className={styles.panel}
              >
                {item.content()}
              </div>
            </Activity>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;

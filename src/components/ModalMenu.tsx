import { useEffect, useRef } from "react";
import { useSelector } from "@xstate/store-react";
import * as styles from "./ModalMenu.css";
import ActionMenu from "./ActionMenu";
import { uiStore } from "@/stores/ui";

const ModalMenu = () => {
  const open = useSelector(uiStore, (s) => s.context.menu);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      onClose={() => uiStore.send({ type: "closeMenu" })}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself, not its children)
        // closes the menu. Inner clicks bubble up but we filter by target.
        if (e.target === e.currentTarget) {
          uiStore.send({ type: "closeMenu" });
        }
      }}
    >
      <ActionMenu />
    </dialog>
  );
};

export default ModalMenu;

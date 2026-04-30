import type { FC, ReactNode } from "react";
import Centerer from "@/components/Centerer";
import * as styles from "./AdvancedHeaderedPage.css";
import Box from "@/components/ui/Box";

type Props = {
  stickyMenu?: ReactNode;
  children: ReactNode;
  managerInfo?: ReactNode;
};

const AdvancedHeaderedPage: FC<Props> = ({
  stickyMenu,
  children,
  managerInfo
}) => {
  return (
    <Box className={styles.root}>
      {managerInfo}
      <Box className={styles.content} my="md">
        <Centerer>
          <Box px="md">{children}</Box>
        </Centerer>
      </Box>

      {stickyMenu && <div className={styles.stickyMenu}>{stickyMenu}</div>}
    </Box>
  );
};

export default AdvancedHeaderedPage;

import type { FC, ReactNode } from "react";
import Centerer from "@/components/Centerer";
import * as styles from "./AdvancedHeaderedPage.css";
import Box from "@/components/ui/Box";
import ActionMenu from "@/components/ActionMenu";

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
      <Box className={styles.content} my="md">
        <Centerer>
          <Box px="md">{children}</Box>
        </Centerer>
      </Box>

      <Box className={styles.sidebar}>
        {stickyMenu}
        <Box>{managerInfo}</Box>
        <ActionMenu />
      </Box>
    </Box>
  );
};

export default AdvancedHeaderedPage;

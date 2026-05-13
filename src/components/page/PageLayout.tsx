import type { FC, ReactNode } from "react";
import Centerer from "@/components/Centerer";
import * as styles from "./PageLayout.css";
import Box from "@/components/ui/Box";
import Mailbox from "@/components/Mailbox";

type Props = {
  stickyMenu?: ReactNode;
  children: ReactNode;
  managerInfo?: ReactNode;
  sidebar?: ReactNode;
};

const PageLayout: FC<Props> = ({
  stickyMenu,
  children,
  managerInfo,
  sidebar
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
        {sidebar}

        <Mailbox />
      </Box>
    </Box>
  );
};

export default PageLayout;

import type { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "@mantine/hooks";
import Centerer from "@/components/Centerer";
import * as styles from "./AdvancedHeaderedPage.css";
import Box from "@/components/ui/Box";
import ActionMenu from "@/components/ActionMenu";

type Props = {
  stickyMenu?: ReactNode;
  children: ReactNode;
  managerInfo?: ReactNode;
  escTo?: string;
};

const AdvancedHeaderedPage: FC<Props> = ({
  stickyMenu,
  children,
  managerInfo,
  escTo
}) => {
  const navigate = useNavigate();
  useHotkeys(escTo ? [["Escape", () => navigate(escTo)]] : []);
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

import type { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "@mantine/hooks";
import ActionMenu from "@/components/ActionMenu";
import PageLayout from "@/components/page/PageLayout";

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
    <PageLayout
      stickyMenu={stickyMenu}
      managerInfo={managerInfo}
      sidebar={<ActionMenu />}
    >
      {children}
    </PageLayout>
  );
};

export default AdvancedHeaderedPage;

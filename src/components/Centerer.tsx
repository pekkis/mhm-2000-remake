import Center from "@/components/ui/Center";
import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Centerer: FC<Props> = ({ children }) => {
  return <Center maxInlineSize={1200}>{children}</Center>;
};

export default Centerer;

import Box from "@/components/ui/Box";
import Heading from "@/components/ui/Heading";
import Stack from "@/components/ui/Stack";
import type { FC, ReactNode } from "react";

type Props = {
  heading: string;
  children: ReactNode;
};

const PhaseStatusPhase: FC<Props> = ({ heading, children }) => {
  return (
    <Box>
      <Stack gap="sm">
        <Heading level={4}>{heading}</Heading>

        <Box>{children}</Box>
      </Stack>
    </Box>
  );
};

export default PhaseStatusPhase;

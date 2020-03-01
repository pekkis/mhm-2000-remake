import React, { FunctionComponent } from "react";
import { FinancialTransaction } from "../../types/base";
import { Box } from "theme-ui";

interface Props {
  transactions: FinancialTransaction[];
}

const FinancialReport: FunctionComponent<Props> = ({ transactions }) => {
  return (
    <Box bg="muted" p={3}>
      {JSON.stringify(transactions)}
    </Box>
  );
};

export default FinancialReport;

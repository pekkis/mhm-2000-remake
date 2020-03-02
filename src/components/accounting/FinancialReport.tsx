import React, { FunctionComponent } from "react";
import { FinancialTransaction } from "../../types/base";
import { Box } from "theme-ui";
import { groupBy, toPairs, sum } from "ramda";

interface Props {
  transactions: FinancialTransaction[];
}

const FinancialReport: FunctionComponent<Props> = ({ transactions }) => {
  const grouped = groupBy(t => t.category, transactions);

  const paired = toPairs(grouped).map(([category, transactions]) => {
    return {
      category,
      amount: sum(transactions.map(t => t.amount)),
      transactions
    };
  });

  console.log(paired);

  return (
    <Box bg="muted" p={3}>
      {JSON.stringify(transactions)}
    </Box>
  );
};

export default FinancialReport;

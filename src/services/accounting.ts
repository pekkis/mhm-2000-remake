import { FinancialTransactionCategory, ForEvery } from "../types/base";

interface FinancialTransactionService {}

export const accountingCategoryMap: ForEvery<
  FinancialTransactionCategory,
  FinancialTransactionService
> = {};

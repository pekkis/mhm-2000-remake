const decimalFormatter = new Intl.NumberFormat("fi-FI", {
  style: "decimal",
  currency: "EUR"
});

export const currencyFormatter = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR"
});

export const amount = (amount: number): string => {
  return `${decimalFormatter.format(amount)}`;
};

export const currency = (amount: number): string => {
  return currencyFormatter.format(amount);
};

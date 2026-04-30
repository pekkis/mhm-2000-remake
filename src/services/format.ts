const decimalFormatter = new Intl.NumberFormat("fi-FI", {
  style: "decimal",
  currency: "EUR"
});

export const amount = (amount: number) => {
  return `${decimalFormatter.format(amount)}`;
};

export const currency = (amount: number) => {
  return `${decimalFormatter.format(amount)} pekkaa`;
};

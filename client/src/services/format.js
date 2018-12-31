const decimalFormatter = new Intl.NumberFormat("fi-FI", {
  style: "decimal",
  currency: "EUR"
});

const currencyFormatter = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR"
});

export const amount = amount => {
  return `${decimalFormatter.format(amount)}`;
};

export const currency = amount => {
  return `${decimalFormatter.format(amount)} pekkaa`;
};

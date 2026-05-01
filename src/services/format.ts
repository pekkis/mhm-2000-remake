const decimalFormatter = new Intl.NumberFormat("fi-FI", {
  style: "decimal"
});

// Pekkalandia joined the EU between MHM 97 and MHM 2000, so the
// currency is now EUR. Integer-only display — the simulation never
// deals in cents.
const currencyFormatter = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
});

export const amount = (amount: number) => {
  return `${decimalFormatter.format(amount)}`;
};

export const currency = (amount: number) => {
  return currencyFormatter.format(amount);
};

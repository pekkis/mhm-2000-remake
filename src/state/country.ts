export type Country = {
  iso: string;
  name: string;
  strength: number | undefined;
};

export type CountryState = {
  countries: Record<string, Country>;
};

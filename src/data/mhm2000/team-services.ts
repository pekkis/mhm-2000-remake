type TeamServiceIdentifier = "fanGroup" | "alcoholSales" | "doping" | "travel";

type TeamServiceDefinition = {
  name: string;
  options: [
    {
      name: string;
      amount: number;
    }
  ];
};

export const teamServiceDefinitions: Record<
  TeamServiceIdentifier,
  TeamServiceDefinition
> = {
  // todo: fill.
};

export type TeamServiceIdentifier =
  | "fanGroup"
  | "alcoholSales"
  | "doping"
  | "travel";

export type TeamServiceOption = {
  label: string;
  costPerMatch: number;
};

export type TeamServiceDefinition = {
  name: string;
  options: readonly TeamServiceOption[];
};

export const teamServiceDefinitions: Record<
  TeamServiceIdentifier,
  TeamServiceDefinition
> = {
  fanGroup: {
    name: "Faniryhmä",
    options: [
      { label: "Ei ole", costPerMatch: 0 },
      { label: "Kotiottelut", costPerMatch: 10000 },
      { label: "Kaikki ottelut", costPerMatch: 10000 }
    ]
  },
  alcoholSales: {
    name: "A-oikeudet",
    options: [
      { label: "Ei alkoholia", costPerMatch: 0 },
      { label: "Keskikaljaa kaikille", costPerMatch: 3000 },
      { label: "Täysi palvelu", costPerMatch: 6000 }
    ]
  },
  doping: {
    name: "Pekkiini-douppaus",
    options: [
      { label: "Ei sellaista", costPerMatch: 0 },
      { label: "Lievä", costPerMatch: 10000 },
      { label: "DDR-tyylinen", costPerMatch: 20000 }
    ]
  },
  travel: {
    name: "Matkustustapa",
    options: [
      { label: "Oma-aloitteinen", costPerMatch: 1000 },
      { label: "Hippikupla", costPerMatch: 4000 },
      { label: "Minibussi", costPerMatch: 9000 },
      { label: "Luksusbussi", costPerMatch: 13000 },
      { label: "Privaattisuihkari", costPerMatch: 20000 }
    ]
  }
};

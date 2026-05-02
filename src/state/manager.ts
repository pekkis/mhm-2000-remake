import type { CountryIso } from "@/data/countries";
import type { ManagerAttributes } from "@/data/managers";

export type ManagerArena = {
  name: string;
  level: number;
};

export type ManagerServices = {
  coach: boolean;
  insurance: boolean;
  microphone: boolean;
  cheer: boolean;
};

export type Manager = HumanManager | AIManager;

export type AIManager = {
  id: string;
  kind: "ai";
  name: string;
  nationality: CountryIso;
  attributes: ManagerAttributes;
  team?: number;
};

export type HumanManager = {
  id: string;
  kind: "human";
  name: string;
  nationality: CountryIso;
  difficulty: number;
  attributes: ManagerAttributes;
  team?: number;
  balance: number;
  arena: ManagerArena;
  services: ManagerServices;
  pranksExecuted: number;
  extra: number;
  insuranceExtra: number;
  flags: Record<string, boolean>;
};

export type ManagerState = {
  active: string | undefined;
  managers: string[];
  // peckingOrder: string[]; maybe? or is the managers enough.
};

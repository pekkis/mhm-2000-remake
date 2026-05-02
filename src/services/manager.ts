import type { ManagerDefinition } from "@/data/managers";
import { createUniqueId } from "@/services/id";
import type { Manager } from "@/state/manager";

export const managerFromDefinition = (
  def: ManagerDefinition,
  i: number
): Manager => {
  return {
    id: i,
    uid: createUniqueId(),
    attributes: def.attributes,
    name: def.name,
    kind: "ai",
    nationality: def.nationality
  };
};

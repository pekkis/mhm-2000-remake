import type { ManagerDefinition } from "@/data/managers";
import { createUniqueId } from "@/services/id";
import type { Manager } from "@/state/game";

export const managerFromDefinition = (def: ManagerDefinition): Manager => {
  return {
    id: createUniqueId(),
    tags: def.tags,
    attributes: def.attributes,
    name: def.name,
    kind: "ai",
    nationality: def.nationality,
    difficulty: 2,
    stats: {
      games: {}
    }
  };
};

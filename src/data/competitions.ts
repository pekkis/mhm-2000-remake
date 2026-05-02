import ehl from "./competitions/ehl";
import phl from "./competitions/phl";
import division from "./competitions/division";
import mutasarja from "./competitions/mutasarja";
import tournaments from "./competitions/tournaments";
import cup from "./competitions/cup";
import practice from "./competitions/practice";
import type {
  CompetitionDefinition,
  CompetitionId
} from "@/types/competitions";

const competitionEntries: [CompetitionId, CompetitionDefinition][] = [
  ["phl", phl],
  ["division", division],
  ["mutasarja", mutasarja],
  ["ehl", ehl],
  ["tournaments", tournaments],
  ["cup", cup],
  ["practice", practice]
];

// Sort by weight (ascending) to match the original Immutable Map.sortBy behavior
const sorted = competitionEntries.toSorted(
  (a, b) => a[1].data.weight - b[1].data.weight
);

const competitions: Record<CompetitionId, CompetitionDefinition> =
  Object.fromEntries(sorted) as Record<CompetitionId, CompetitionDefinition>;

export default competitions;

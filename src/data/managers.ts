import type { CountryIso } from "@/data/countries";
import { legacyNationalityToIso } from "@/services/country";

/**
 * Six manager attributes, each in the inclusive range -3..+3. Mirrors
 * the QB `mtaito(1..6, manager)` array. Per-attribute meaning matches
 * the labels loaded from `DATAX.M2K` (records 23..28):
 *
 * | QB index | QB label         | Field             |
 * | -------- | ---------------- | ----------------- |
 * | 1        | STRATEGIAT       | `strategy`        |
 * | 2        | ERIKOISTILANTEET | `specialTeams`    |
 * | 3        | NEUVOTTELUTAITO  | `negotiation`     |
 * | 4        | NEUVOKKUUS       | `resourcefulness` |
 * | 5        | KARISMA          | `charisma`        |
 * | 6        | ONNEKKUUS        | `luck`            |
 *
 * In the QB code, human managers spend a budget of points on these
 * (`MHM2K.BAS:1480..1545`) — total point pool depends on difficulty.
 * CPU managers carry fixed values from `MANAGERS.M2K`.
 */
export type ManagerAttributes = {
  strategy: number;
  specialTeams: number;
  negotiation: number;
  resourcefulness: number;
  charisma: number;
  luck: number;
};

/**
 * Six-key tuple for `ManagerAttributes`. Matches QB array order
 * `mtaito(1..6, manager)` — index 1 = strategy, …, index 6 = luck.
 */
export type ManagerAttributeKey = keyof ManagerAttributes;

/**
 * Mapping from QB's 1-based attribute index to our string key. Used
 * by the attribute-roll service (`tarko`) and any code that ports
 * QB sites such as `mtaito(t1, man(t0))`.
 *
 * Keep order STABLE — QB call sites pass literal indices (4, 5, 6
 * are common) and changing this mapping would silently break every
 * morality / luck check.
 */
export const managerAttributeByLegacyIndex = [
  // index 0 unused (QB is 1-based)
  null,
  "strategy",
  "specialTeams",
  "negotiation",
  "resourcefulness",
  "charisma",
  "luck"
] as const satisfies readonly (ManagerAttributeKey | null)[];

/** Inverse of `managerAttributeByLegacyIndex` — for nicer call sites. */
export const legacyIndexByManagerAttribute = {
  strategy: 1,
  specialTeams: 2,
  negotiation: 3,
  resourcefulness: 4,
  charisma: 5,
  luck: 6
} as const satisfies Record<ManagerAttributeKey, number>;

/**
 * A computer-controlled manager identity that ships with the game.
 * Pre-built rosters live in `src/mhm2000-qb/DATA/MANAGERS.M2K` (54
 * rows × 7 lines: name+nationality, then six attribute values).
 */
export type ManagerDefinition = {
  id: number;
  name: string;
  /** ISO 3166-1 alpha-2 country code. */
  nationality: CountryIso;
  attributes: ManagerAttributes;
  tags: string[];
};

type RawManager = readonly [
  name: string,
  legacyNationality: number,
  strategy: number,
  specialTeams: number,
  negotiation: number,
  resourcefulness: number,
  charisma: number,
  luck: number
];

// Verbatim transcription of src/mhm2000-qb/DATA/MANAGERS.M2K. Names
// trimmed of QB's fixed-width padding; nationality is the legacy
// integer (translated to ISO below); the six trailing numbers are
// strategy, specialTeams, negotiation, resourcefulness, charisma, luck.
const raw: readonly RawManager[] = [
  ["Scotty Booman", 10, -2, -2, 2, 2, -1, 1],
  ["Ptr Srszrscen", 6, 1, -2, 0, -1, 3, -1],
  ["Karl Gustaf Bormann", 3, 0, 1, -1, 3, -2, -1],
  ["Fjatseslav Vandals", 8, -1, -1, 0, 0, 3, -1],
  ["Seter Ptastny", 12, -1, 2, -2, -1, 1, 1],
  ["Wurst Kaltheim", 16, 0, 0, 0, 1, 0, -1],
  ["Heinrich Heydrich", 3, -1, -1, 1, 1, -1, 1],
  ["Lennart Järvi", 7, 2, 2, -2, -1, 0, -1],
  ["Eriko Nondo", 13, -1, -1, -1, 1, 1, 1],
  ["Dave Queen", 9, 2, 2, -2, -2, 2, -2],
  ["Xavier Rated", 20, -2, -2, -1, -1, 3, 3],
  ["Juri Dorkaeff", 15, -1, 0, 0, 3, -1, -1],
  ["Tex Genderblender", 10, 2, -1, 1, 0, -2, 0],
  ["Blavio Friatore", 4, 0, 0, -3, 1, 1, 1],
  ["Clawsa Sykora", 6, 0, 0, 1, -1, 0, 0],
  ["Reijo Mustikka", 1, 0, 0, 0, 0, 0, 0],
  ["Wech Lalesa", 17, 1, 0, 0, 0, 0, -1],
  ["Per von Bachman", 1, -3, -3, -3, 3, 3, 3],
  ["Nykan Hågren", 2, 2, 2, -2, 0, -1, -1],
  ["Curt Lindman", 2, -1, 2, -1, 2, -1, -1],
  ["Sven Stenvall", 2, 0, -1, 0, 1, 0, 0],
  ["Kauno O. Pirr", 1, -1, -1, -1, -1, 2, 2],
  ["Fent Korsberg", 2, 2, 0, 0, -3, 1, 0],
  ["Marcó Harcimo", 1, 0, 0, 3, -2, -3, 2],
  ["Kari P.A. Sietilä", 1, 3, 3, 0, 2, 2, -3],
  ["Ara Hannuvirta", 1, 1, 1, 1, 1, 1, -3],
  ["SuPo Alhonen", 1, 0, 3, -2, -1, 0, 0],
  ["Juri Simonov Jr.", 5, 2, 2, 0, 0, -1, -3],
  ["Kannu Happanen", 1, 0, -2, -2, 2, 2, 0],
  ["Aimo SA Rummanen", 1, 0, 2, 0, -2, 0, 0],
  ["Hannes De Ansas", 1, 1, 1, 0, 0, -3, 1],
  ["Marty Saariganges", 1, 2, -1, 0, 3, -3, -1],
  ["Juri Simonov", 5, 3, 2, 2, 3, 3, -3],
  ["Carlos Numminen", 1, 1, 0, 1, -1, 1, -2],
  ["Micho Magelä", 7, 1, -1, -1, 1, 0, 0],
  ["Jannu Hortikka", 1, 2, 2, 0, 2, -3, -3],
  ["Franco M. Berg", 2, -1, -1, 1, -1, 3, -1],
  ["Tinjami Uhmanen", 1, 2, 1, -3, -2, 3, -1],
  ["Kai L. Sinisalko", 1, -2, -2, 1, 1, 1, 1],
  ["Tilhelm Well", 11, -1, 2, -1, -1, 2, -1],
  ["Hari Järkäle", 1, -2, 0, 2, -1, 1, 0],
  ["Amok R. Jekäläinen", 1, 1, 1, -1, -1, -1, 1],
  ["Limo Tahtinen", 1, 3, -3, 0, 1, 1, -2],
  ["Mint E. Pattikainen", 1, -3, 3, -2, 2, -2, 2],
  ["Jukka Palmu", 1, 1, 1, 1, -2, -1, 0],
  ["Tasili Vihonov", 5, 1, 3, -2, 1, -2, -1],
  ["Pekka Rautakallo", 1, -1, -1, 3, -2, 3, -2],
  ["Werkka Easterlund", 1, 1, 1, 1, -1, -1, -1],
  ["Imsohel Kone", 1, -2, -2, 3, 3, -1, -1],
  ["Um-Bongo Rabban", 19, 2, 2, -2, -2, 3, -3],
  ["Ronadlo", 18, 0, 3, -3, -3, 3, 0],
  ["Ari Keloranta", 1, 1, -1, 0, -1, 0, 1],
  ["Bonatoli Agdanov", 5, 3, 0, -1, -1, -1, 0],
  ["Qimbo Tondvist", 1, -1, 0, 0, -1, 1, 1]
];

const tagsByName: Record<string, string[]> = {
  "Juri Simonov": ["match_with_karpat"]
};

const managers: ManagerDefinition[] = raw.map(
  (
    [
      name,
      legacyNationality,
      strategy,
      specialTeams,
      negotiation,
      resourcefulness,
      charisma,
      luck
    ],
    index
  ) => ({
    id: index,
    name,
    nationality: legacyNationalityToIso(legacyNationality),
    attributes: {
      strategy,
      specialTeams,
      negotiation,
      resourcefulness,
      charisma,
      luck
    },
    tags: tagsByName[name] || []
  })
);

export default managers;

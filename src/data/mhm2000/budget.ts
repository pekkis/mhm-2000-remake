// MHM 2000 per-round budget — the five "money out" sliders the manager
// twiddles every round to decide how lavishly to fund the team.
//
// Sourced from QB:
//   - Cost cube `valbh(1..3, 1..5, 1..5) AS LONG` declared at
//     MHM2K.BAS:162, loaded from src/mhm2000-qb/DATA/BUDGET.M2K at
//     MHM2K.BAS:948-953:
//       FOR zzz = 1 TO 3            ' difficulty/tier
//         FOR zz = 1 TO 5           ' category
//           INPUT #1, valbh(zzz, zz, 1..5)   ' five spend levels
//   - Per-manager slider state `valb(1..5, 1..plkm) AS INTEGER`
//     declared at MHM2K.BAS:502, restored from save files at
//     MHM2K.BAS:1344 / 2012. Values 1..5; 1 = stingiest, 5 = most lavish.
//   - Editor UI: SUB `budget` at ILEX5.BAS:1104 (arrow-key cursor over
//     the five categories; LEFT/RIGHT change `valb(kurso, pv)`).
//     Print suffix at ILEX5.BAS:1124:
//       IF a < 5 THEN PRINT "/KR    " ELSE PRINT "/P/KR    "
//     i.e. cats 1..4 are "per round" (per kierros), cat 5 is
//     "per player per round".
//   - Per-round drain: SUB `rahanvelvoitteet` at ILEX5.BAS:5378 (and
//     pretty-printed at :5384):
//       IF qwe < 5
//         THEN rahna = rahna + valbh(vai(2, pv), qwe, valb(qwe, pv))
//         ELSE rahna = rahna + valbh(vai(2, pv), qwe, valb(qwe, pv)) * lpl(pv)
//     i.e. cats 1..4 add a flat negative cost; cat 5 multiplies by
//     `lpl(pv)` (roster size for manager pv). All BUDGET.M2K values are
//     stored as negative LONGs — they're already costs ready to add to
//     `raha(pv)`.
//   - Season summary uses the same formula at ILEX5.BAS:3563/3565/3571.
//
// Difficulty interaction:
//   - The first dimension of `valbh` is the **budget tier** `vai(2, pv)`,
//     not the raw difficulty `vai(1, pv)`. The mapping is set at
//     MHM2K.BAS:1815-1831:
//       vai(1)=1            -> vai(2)=1   (easy)
//       vai(1) in {2,3,4}   -> vai(2)=2   (medium)
//       vai(1)=5            -> vai(2)=3   (hard)
//     Three tiers, five difficulties — the middle three difficulties
//     all share the medium budget tier. See `BudgetTierId` and
//     `DifficultyLevel.budgetTier` in ./difficulty-levels.
//
// Category names: verbatim from src/mhm2000-qb/DATA/Y.MHM records 79..83
// (rendered by `lay 78 + a` in the editor). Per-level descriptions:
// verbatim from src/mhm2000-qb/DATA/X.MHM records 16..40 (rendered by
// `lax 15 + valb(kurso, pv) + (kurso - 1) * 5` at ILEX5.BAS:1138).
// Token mapping follows _NOTES/DATA-FILES.md "Porting tokens to
// Markdown": $b is body, $n / $f / $j -> **bold**.
//
// Indexing pitfall (worth recording): QB's `lt` SUB reads with
// `GET #1, 1 + (lukux% - 1) * 500`, so QB record N lives at byte
// `(N - 1) * 500`. A naive Python read of `data[N*500:(N+1)*500]` is
// off by one and shifts every category's descriptions forward by one
// spend level. Once that's corrected, the descriptions fit their
// categories cleanly: cat 1 talks about field coaches, cat 2 about
// goalies, cat 5 lvl 5 is the "nopeita naisia, halpoja autoja" maximum
// spend, etc. No drift.

import type { BudgetTierId } from "./difficulty-levels";
import type { TeamServices } from "@/state/game";

export type BudgetCategoryId = 1 | 2 | 3 | 4 | 5;
export type BudgetLevel = 1 | 2 | 3 | 4 | 5;

export type BudgetCategory = {
  /** `valb` first index. 1..5; matches Y.MHM record `78 + id`. */
  id: BudgetCategoryId;
  /** Verbatim Finnish name from Y.MHM record `78 + id`. */
  name: string;
  /**
   * Whether the per-round cost is multiplied by roster size `lpl(pv)`.
   * True only for category 5 (LUONTAISEDUT). All other categories are
   * a flat per-round cost regardless of how many players are signed.
   */
  perPlayer: boolean;
  /**
   * Five Finnish flavour blurbs, one per spend level (1..5), describing
   * what that level of spend buys you. Verbatim from X.MHM record
   * `15 + level + (id - 1) * 5`. Tokens converted to Markdown
   * (`$n…$b` -> `**…**`, `$j…$b` -> `**…**`, `$f…$b` -> `**…**`).
   * Description is independent of difficulty/tier — only cost varies.
   */
  descriptions: readonly [string, string, string, string, string];
};

/**
 * Verbatim Finnish category names from Y.MHM records 79..83.
 * 1: KENTTÄPELAAJAVALMENNUS — field-player coaching staff
 * 2: MAALIVAHTIVALMENNUS    — goalie coaching staff
 * 3: JUNIORITYÖ             — junior pipeline / youth development
 * 4: HUOLTO                 — medical & physio (literally "maintenance")
 * 5: LUONTAISEDUT           — fringe benefits / perks in kind (per player)
 */

export const budgetCategories: readonly BudgetCategory[] = [
  {
    id: 1,
    name: "KENTTÄPELAAJAVALMENNUS",
    perPlayer: false,
    descriptions: [
      "Tällä panostuksella saat erittäin kokemattoman, läpeensä **korruptoituneen** ja pahasti alkoholisoituneen apulaisvalmentajan, etkä ollenkaan katsomovalmentajaa.",
      "Tällä panostuksella avuksesi tulee **heppuli**, jonka vaikuttavin ominaisuus on valloittava pepsodent-hymy. Katsomovalmentajasi löytää kiikareillaan ainoastaan vastapuolen pelaajien tyttö/poikaystävät, mutta heitä sitten sitäkin enemmän.",
      "Tällä rahalla saat apulaisvalmentajan, joka piirtää fläppitaululleen **merkillisiä**, joskus jopa **toimivia** kuvioita (kaupan päälle 10 tussia) sekä katsomovalmentajan, joka sekoaa ajoittain ruveten tekemään töitä.",
      "Panostaessasi tämän verran avuksesi rientää **rutinoitunut** apulaisvalmentaja joka hoitaa hommansa eleettömästi. Katsomossa vastustaa kyttää yli 100 PHL-ottelun **veteraani**, jolle jääkiekko on tuttua joka osa-alueelta.",
      "Valtavalla panostuksella saat avuksesi vuosikymmenen NHL-kokemuksen omaavan entisen **supertähden**, jolle jääkiekko on kaikki kaikessa. Katsomovalmentajaksesi saapuu lahjomattomasti kaiken esille tonkiva, yleisesti pelätty ketku."
    ]
  },
  {
    id: 2,
    name: "MAALIVAHTIVALMENNUS",
    perPlayer: false,
    descriptions: [
      "Tällä panostuksella maalivahdeistasi huolehtii kokonaista kolme jääkiekko- ottelua (40-luvulla) elämänsä aikana nähnyt **Summan** veteraani, joka vastaa kymmentä venäläistä???",
      "Kun panostat näin paljon, veskareitasi tukemaan saapuu **salibandyn** ykkösdivisioonassa maalivahtina pelannut mies, jonka oma ura keskeytyi jo alta kolmekymppisenä kun meininki muuttui ammattimaiseksi.",
      "Tämä mies on **pelannut** jääkiekkoa! Hän oli Pietarsaaren Centers-IFK:n luottomaalivahteja heidän katastrofiin päättyneen divisioonakautensa aikana, ja senkin jälkeen alasarjoissa...",
      "Tämän miehen ura katkesi **loukkaantumiseen** juuri tähteyteen nousun kynnyksellä. Onneksi hänen asiantuntemuksensa on mahdollista ottaa käyttöön edes valmennuspuolella.",
      "Oliko tämä neuvostoliittolainen **virtuoosi** suuruuden päivinään 70-luvulla jopa parempi huin **Haminik Dosek**? Siinä kysymys, johon monet ovat ottaneet kantaa mutta johon emme koskaan saa vastausta..."
    ]
  },
  {
    id: 3,
    name: "JUNIORITYÖ",
    perPlayer: false,
    descriptions: [
      "Tällä rahalla saat junioripäälliköksesi oudon, pitkään **sadetakkiin** verhoutuneen hiipparin **Tiukukosken** suljetulta osastolta.",
      "Tällä panostuksella avuksesi rientää läheisestä lastentarhasta tarmokas **tätihenkilö**, jolla on vankka yli 20 vuoden kokemus lasten kaitsemisesta.",
      "Tämä mies vasta aloittelee **uraansa**, mutta hänessä on potentiaalia nousta vaikkapa historian suurimmaksi junioripäälliköksi.",
      "Kun panostat näin paljon, saat juniorityöhösi pomoksi **ammattilaisen** joka tietää tasan tarkkaan miten lahjakkaat junnut muutetaan PHL-jyriksi.",
      "Tämä mies on luonut supertähtiä, kun muut junioripäälliköt makasivat vielä **kapaloissa**. Hänet tunnetaan, häntä arvostetaan, ja hänen käsialaansa ovat niin **Kari Jurri**, **Nenä Teemules** kuin **Paki-Betteri Erg**:kin."
    ]
  },
  {
    id: 4,
    name: "HUOLTO",
    perPlayer: false,
    descriptions: [
      "Keskiafrikkalainen **poppamies** tuo tällä rahalla mukanaan jopa rumpunsa ja monta nuottikirjaa. Ne auttavat kaikkiin mahdollisiin vaivoihin!",
      "Ensimmäisessä maailmansodassa koeteltu lääkintämies on hyvä vaihtoehto! Hän osaa hoitaa **ampumahaavat**, jos ei vain ole unohtanut silmälasejaan ja hengityskonettaan pukusuojaan.",
      "Paikallisesta terveyskeskuksesta saa **napattua** kätevästi joukkueen palvelukseen nuoren yleislääkärin; hän tuo mukanaan paketin **Puranaa**.",
      "Tämä panostus tuo avuksesi **arkkiatrin**, joka hoitaa vaivan kuin vaivan tehokkaasti. Hän sitoo, paikkaa ja vaikkapa hellii, jos se suinkin vain edistää paranemisprosessia.",
      "Tällä panostuksella saat houkuteltua noin vuosikymmen sitten mysteerisesti kadonneen itäsaksalaisen tohtori **Mengelen** palaamaan ruotuun. Mies tuo mukanaan sekalaisen kasan lääkkeitä ja lääkkeenkaltaisia **substansseja**, jotka kursivat loukkaantuneet entistä ehommaksi alta aikayksikön."
    ]
  },
  {
    id: 5,
    name: "LUONTAISEDUT",
    perPlayer: true,
    descriptions: [
      "Pyh! Mitään **luontaisetuja** meillä ole, hoitakoon pelaajat itse asiansa.",
      "No voimme me **soppaa** harjoitusten jälkeen tarjota, ja pelin tuoksinassa joskus urheilujuomaa - muuta EI tipu.",
      "Pyrimme auttamaan pelaajia sopeutumisessa esim. hankkimalla heille **asunnon** paikkakunnalta. Vuokraa emme kuitenkaan maksa, emme missään nimessä.",
      "Luontaisetuihimme kuuluu asunto sekä luotettava 80-luvun **itäauto**. Teemme muutenkin kaikkemme, jotta pelaajat viihtyisivät joukkueessamme.",
      "Nopeita naisia, halpoja autoja, kumiruoskia ja käsirautoja! Mitä pelaaja haluaakaan, sen me hänelle annamme. Palkkalistoillamme on kokopäivätoimisena **psykiatri** joka auttaa sopeutumisvaikeuksissa, ja koko joukkueemme toimii pelaajien mielihalujen ehdoilla."
    ]
  }
];

/**
 * The full BUDGET.M2K cube, indexed `[tier - 1][category - 1][level - 1]`.
 *
 * Verbatim from src/mhm2000-qb/DATA/BUDGET.M2K — 15 rows of 5 LONGs.
 * All values are negative (they're costs). For category 5 the value is
 * cost-per-player; everywhere else it's a flat per-round cost.
 *
 *   Tier 1 (easy)  : flat -1k/-2k/-3k/-4k/-7k for cats 1..4;
 *                    perks 0/-50/-100/-200/-400 per player.
 *   Tier 2 (med)   : flat -1k/-2k/-4k/-7k/-11k for cats 1..4;
 *                    perks 0/-100/-200/-500/-1000 per player.
 *   Tier 3 (hard)  : flat -1k/-2k/-5k/-9k/-18k for cats 1..4;
 *                    perks 0/-200/-400/-700/-1200 per player.
 *
 * Note BUDGET.M2K writes the tier-3 perk row 0 as "-0" — a faithful
 * QB rendering of negative zero. We collapse it to plain `0`.
 */
export const budgetCosts: readonly (readonly (readonly [
  number,
  number,
  number,
  number,
  number
])[])[] = [
  // --- Tier 1 (easy / vai(2)=1) --------------------------------------
  [
    [-1000, -2000, -3000, -4000, -7000], // cat 1: KENTTÄPELAAJAVALMENNUS
    [-1000, -2000, -3000, -4000, -7000], // cat 2: MAALIVAHTIVALMENNUS
    [-1000, -2000, -3000, -4000, -7000], // cat 3: JUNIORITYÖ
    [-1000, -2000, -3000, -4000, -7000], // cat 4: HUOLTO
    [0, -50, -100, -200, -400] // cat 5: LUONTAISEDUT (per player)
  ],
  // --- Tier 2 (medium / vai(2)=2) ------------------------------------
  [
    [-1000, -2000, -4000, -7000, -11000],
    [-1000, -2000, -4000, -7000, -11000],
    [-1000, -2000, -4000, -7000, -11000],
    [-1000, -2000, -4000, -7000, -11000],
    [0, -100, -200, -500, -1000]
  ],
  // --- Tier 3 (hard / vai(2)=3) --------------------------------------
  [
    [-1000, -2000, -5000, -9000, -18000],
    [-1000, -2000, -5000, -9000, -18000],
    [-1000, -2000, -5000, -9000, -18000],
    [-1000, -2000, -5000, -9000, -18000],
    [0, -200, -400, -700, -1200]
  ]
];

/**
 * Look up a single category by id.
 */
export const budgetCategoryById = (id: BudgetCategoryId): BudgetCategory =>
  budgetCategories[id - 1];

/**
 * Resolve the per-round delta to `raha` for one category at one chosen
 * spend level, on a given budget tier and roster size. Already negative
 * — add it to the manager's bank balance directly.
 *
 * Mirrors the QB formula at ILEX5.BAS:5378:
 *   IF qwe < 5
 *     THEN rahna += valbh(vai(2, pv), qwe, valb(qwe, pv))
 *     ELSE rahna += valbh(vai(2, pv), qwe, valb(qwe, pv)) * lpl(pv)
 */
export const budgetCostPerRound = (
  tier: BudgetTierId,
  category: BudgetCategoryId,
  level: BudgetLevel,
  rosterSize: number
): number => {
  const base = budgetCosts[tier - 1][category - 1][level - 1];
  return budgetCategories[category - 1].perPlayer ? base * rosterSize : base;
};

/**
 * Sum of the per-round cost across all five categories for a given
 * (tier, slider-vector, roster size) combination. Equivalent to a full
 * pass through the `qwe = 1..5` loop in `SUB rahanvelvoitteet`.
 */
export const totalBudgetPerRound = (
  tier: BudgetTierId,
  levels: readonly [
    BudgetLevel,
    BudgetLevel,
    BudgetLevel,
    BudgetLevel,
    BudgetLevel
  ],
  rosterSize: number
): number =>
  levels.reduce(
    (sum, level, idx) =>
      sum +
      budgetCostPerRound(
        tier,
        (idx + 1) as BudgetCategoryId,
        level,
        rosterSize
      ),
    0
  );

export type BudgetCategoryName =
  | "coaching"
  | "goalieCoaching"
  | "juniors"
  | "health"
  | "benefits";

export const budgetCategoryMap: Record<BudgetCategoryName, BudgetCategory> = {
  coaching: budgetCategories[0],
  goalieCoaching: budgetCategories[1],
  juniors: budgetCategories[2],
  health: budgetCategories[3],
  benefits: budgetCategories[4]
} as const;

export type TeamBudget = Record<BudgetCategoryName, BudgetLevel>;

/**
 * Initial budget sliders per team, derived from average previous-season
 * ranking via ORGASM.M2K → ORGA.M2K.
 *
 * QB path (SUB `orgamaar`, MHM2K.BAS:1993-2015):
 *   d = orgasm(CINT((sed + sedd + seddd) / 3))
 *   FOR ww = 1 TO d: INPUT #1, erik(1..4), valb(1..5), c, raha: NEXT
 * The loop reads d rows from ORGA.M2K sequentially, overwriting each
 * iteration — so the final values come from row d.
 *
 * For AI teams (`ohj(ork%) = 0`) the QB code reads the same columns
 * into throwaway `rahna` variables, but the data IS there in ORGA.M2K
 * for every strength tier.
 */

/**
 * ORGASM.M2K — maps avg previous-season ranking (1..48) to an ORGA row
 * (1..13). Index 0 = ranking 1 (strongest), index 47 = ranking 48 (weakest).
 *
 * Verbatim from src/mhm2000-qb/DATA/ORGASM.M2K.
 */
const orgasmTable: readonly number[] = [
  13, 12, 12, 12, 11, 11, 11, 10, 10, 10, 9, 9, 9, 8, 8, 8, 7, 7, 7, 7, 6, 6, 6,
  6, 5, 5, 5, 5, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1
];

/**
 * Full ORGA.M2K row (1..13, weakest → strongest), 11 columns:
 *   cols 1–4:   `erik(1..4)` — initial team services (fanGroup / alcoholSales / doping / travel)
 *   cols 5–9:   `valb(1..5)` — initial budget slider levels
 *   col   10:   `c`          — number of initially-scouted players (random slots 2..17)
 *   col   11:   `raha`       — starting bank balance for human managers
 *
 * QB path (`SUB orgamaar`, MHM2K.BAS:2005-2013 / ILEZ5.BAS:1294-1300):
 *   INPUT #1, erik(1..4, ork%)
 *   INPUT #1, valb(1..5), c, raha(ohj)
 *   ...
 *   FOR ww = 1 TO c: skout(random 2..17) = 1: NEXT
 *   junnu(ohj) = valb(3) * 2
 *
 * Verbatim from src/mhm2000-qb/DATA/ORGA.M2K.
 */

type OrgaRow = {
  /** `erik(1..4)` — initial team service levels. */
  services: readonly [number, number, number, number];
  /** `valb(1..5)` — initial budget slider levels. */
  budget: readonly [
    BudgetLevel,
    BudgetLevel,
    BudgetLevel,
    BudgetLevel,
    BudgetLevel
  ];
  /** Number of randomly-scouted player slots (2..17) at game start. */
  scoutedCount: number;
  /** Starting bank balance (`raha`) for human managers. */
  startingBalance: number;
};

/** Column order: erik(1..4), valb(1..5), c, raha — verbatim from ORGA.M2K. */
const orgaRows: readonly OrgaRow[] = [
  {
    services: [0, 0, 0, 0],
    budget: [1, 1, 1, 1, 1],
    scoutedCount: 0,
    startingBalance: 100000
  }, // row 1  — weakest
  {
    services: [0, 0, 0, 1],
    budget: [1, 1, 1, 2, 1],
    scoutedCount: 0,
    startingBalance: 130000
  }, // row 2
  {
    services: [0, 0, 0, 1],
    budget: [2, 2, 1, 2, 1],
    scoutedCount: 0,
    startingBalance: 160000
  }, // row 3
  {
    services: [0, 0, 0, 1],
    budget: [2, 2, 2, 2, 2],
    scoutedCount: 1,
    startingBalance: 190000
  }, // row 4
  {
    services: [0, 0, 0, 1],
    budget: [2, 2, 2, 3, 2],
    scoutedCount: 1,
    startingBalance: 220000
  }, // row 5
  {
    services: [0, 0, 0, 2],
    budget: [2, 2, 2, 3, 2],
    scoutedCount: 2,
    startingBalance: 250000
  }, // row 6
  {
    services: [0, 1, 0, 2],
    budget: [3, 3, 3, 3, 3],
    scoutedCount: 2,
    startingBalance: 280000
  }, // row 7
  {
    services: [1, 1, 0, 2],
    budget: [3, 3, 3, 4, 3],
    scoutedCount: 3,
    startingBalance: 310000
  }, // row 8
  {
    services: [1, 1, 0, 2],
    budget: [4, 3, 3, 4, 3],
    scoutedCount: 3,
    startingBalance: 340000
  }, // row 9
  {
    services: [1, 1, 0, 3],
    budget: [4, 4, 4, 4, 3],
    scoutedCount: 4,
    startingBalance: 370000
  }, // row 10
  {
    services: [1, 2, 0, 3],
    budget: [4, 4, 4, 5, 4],
    scoutedCount: 5,
    startingBalance: 450000
  }, // row 11
  {
    services: [2, 2, 0, 3],
    budget: [4, 4, 4, 5, 4],
    scoutedCount: 6,
    startingBalance: 550000
  }, // row 12
  {
    services: [2, 2, 0, 3],
    budget: [5, 5, 5, 5, 5],
    scoutedCount: 7,
    startingBalance: 650000
  } // row 13 — strongest
];

/**
 * Derive initial budget sliders from the team's previous-season rankings
 * (sed/sedd/seddd). Mirrors QB's `orgamaar` lookup:
 *   avg = CINT((sed + sedd + seddd) / 3)
 *   orgaRow = orgasm(avg)
 *   valb(1..5) = ORGA.M2K row orgaRow, columns 5..9
 */
export const initialBudgetForRankings = (
  previousRankings: readonly [number, number, number]
): TeamBudget => {
  const row = orgaRowForRankings(previousRankings);
  const [coaching, goalieCoaching, juniors, health, benefits] = row.budget;
  return { coaching, goalieCoaching, juniors, health, benefits };
};

/**
 * Starting bank balance for a human manager taking over a team,
 * derived from team strength via ORGASM.M2K → ORGA.M2K column 11.
 *
 * Not zero — ranges from 100 000 (tier 1, weakest) to 650 000 (tier 13,
 * strongest). QB: `raha(ohj(ork%))` set in `SUB orgamaar`.
 */
export const initialBalanceForRankings = (
  previousRankings: readonly [number, number, number]
): number => orgaRowForRankings(previousRankings).startingBalance;

/**
 * Number of initially-scouted opponent player slots (2..17) at game start.
 * QB: `FOR ww = 1 TO c: skout(random 2..17) = 1: NEXT` in `SUB orgamaar`.
 */
export const initialScoutedCountForRankings = (
  previousRankings: readonly [number, number, number]
): number => orgaRowForRankings(previousRankings).scoutedCount;

/**
 * Initial team service levels, derived from team strength via
 * ORGASM.M2K → ORGA.M2K columns 1–4 (`erik(1..4)`).
 *
 * QB: `erik(1, ork%), erik(2, ork%), erik(3, ork%), erik(4, ork%)`
 * in `SUB orgamaar`. Maps to: fanGroup / alcoholSales / doping / travel.
 */
export const initialServicesForRankings = (
  previousRankings: readonly [number, number, number]
): TeamServices => {
  const [fanGroup, alcoholSales, doping, travel] =
    orgaRowForRankings(previousRankings).services;
  return { fanGroup, alcoholSales, doping, travel };
};

export const initialServicesForEliteForeignTeams = (): TeamServices => {
  return {
    alcoholSales: 2,
    doping: 0,
    fanGroup: 2,
    travel: 4
  };
};

export const initialServicesForAmateurTeams = (): TeamServices => {
  return {
    alcoholSales: 0,
    doping: 0,
    fanGroup: 0,
    travel: 0
  };
};

export const initialBudgetForAmateurTeams = (): TeamBudget => {
  return {
    benefits: 1,
    coaching: 1,
    goalieCoaching: 1,
    health: 1,
    juniors: 1
  };
};

export const initialBudgetForEliteForeignTeams = (): TeamBudget => {
  return {
    benefits: 5,
    coaching: 5,
    goalieCoaching: 5,
    health: 5,
    juniors: 5
  };
};

/** Shared ORGASM → ORGA row lookup. */
const orgaRowForRankings = (
  previousRankings: readonly [number, number, number]
): OrgaRow => {
  const avg = Math.round(
    (previousRankings[0] + previousRankings[1] + previousRankings[2]) / 3
  );
  const clamped = Math.max(1, Math.min(48, avg));
  const orgaRowIdx = orgasmTable[clamped - 1];
  return orgaRows[orgaRowIdx - 1];
};

// AUTO-GENERATED from src/mhm2000-qb/DATA/TEAMS.PLN. Do not hand-edit.
// Regenerate via /tmp/build_teams.py.

export type ArenaLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type Arena = {
  /**
   * Original Finnish arena name. Preserve verbatim. Only managed teams
   * (TEAMS.PLN) carry an arena name; light teams (TEAMS.NHL/FOR/ALA) load
   * just `paikka(1..3)` + `taso` and have no named arena in QB.
   */
  name?: string;
  /** taso(team) in QB — class tier 1..6. Unlocks box seating at level 4. */
  level: ArenaLevel;
  /**
   * paikka(1, team) — standing (seisomapaikat) capacity, in units of 100
   * spectators. Cheaper ticket (75 % of base price, ILEX5.BAS:5312-5313)
   * but worse for atmosphere/season-ticket sales (HELP/22.HLP).
   */
  standingCount: number;
  /**
   * paikka(2, team) — seated (istumapaikat) capacity, in units of 100
   * spectators. Full-price tickets and the cap on season-ticket holders
   * (`paikka(2) * 100 - kausik`, ILEX5.BAS:2511, 5312-5313).
   */
  seatedCount: number;
  /** paikka(3, team) — VIP-box section present. Only meaningful at level >= 4. */
  hasBoxes: boolean;
  /**
   * ppiste(team) — total arena value points. Derived at construction from
   *   (seated * unitCost.seated + standing * unitCost.standing)
   *   * (hasBoxes ? 1.2 : 1)
   * but stored explicitly because the renovate UI (uppiste) mutates an
   * arbitrary scratch value and bills the manager
   *   (uppiste - ppiste) * 20_000 mk
   * (QB ILES5.BAS:465). The diff is the source of truth, not the formula.
   */
  valuePoints: number;
};

export type LeagueTier = "phl" | "divisioona" | "mutasarja";

/**
 * A managed team (TEAMS.PLN) — one of the 48 base Finnish teams that carry
 * a manager, a roster, league standings, and full season state.
 */
export type ManagedTeamDefinition = {
  kind: "managed";
  /** 0-based id. Original QB indices were 1-based (1..48). */
  id: number;
  /** Original team name; cp850 → UTF-8. */
  name: string;
  /** Home city. */
  city: string;
  /** sr(team): 1=PHL, 2=Divisioona, 3=Mutasarja. */
  league: LeagueTier;
  /**
   * Final positions in the previous three seasons (sed/sedd/seddd in QB),
   * most recent first. League-global ranking 1..48.
   */
  previousRankings: [number, number, number];
  /**
   * tazo(team) — overall team-strength tier 1..58, indexed into materiax/lvl
   * tables to derive starting maz/puz/hyz weights and roster materia.
   */
  tier: number;
  arena: Arena;
};

/**
 * Origin of a `LightTeamDefinition`:
 *   - `"nhl"`     — TEAMS.NHL, 20 NHL teams, drawn 5 at a time as the EHL
 *                   foreign-champion bracket (`muutmestarit` in ILEZ5.BAS).
 *   - `"foreign"` — TEAMS.FOR, 70 European clubs, also drawn for EHL/cup
 *                   opposition.
 *   - `"amateur"` — TEAMS.ALA, 16 Finnish amateur sides loaded once at
 *                   startup into `l(71..86)` for the cup's early rounds.
 */
export type LightTeamOrigin = "nhl" | "foreign" | "amateur";

/**
 * A light (non-managed) team. No manager, no roster, no league standings —
 * just enough to participate in cup/EHL/tournament fixtures: a name, a
 * tier, and an arena (capacity drives gate revenue).
 */
export type LightTeamDefinition = {
  kind: "light";
  origin: LightTeamOrigin;
  /** 0-based id within `origin`. (No global id space — pair with `origin`.) */
  id: number;
  /** Original team name; cp850 → UTF-8. */
  name: string;
  /** Home city. */
  city: string;
  /** tazo(team) — overall team-strength tier (same scale as managed). */
  tier: number;
  /** Arena has no name (the source data files don't include one). */
  arena: Arena;
};

export type TeamDefinition = ManagedTeamDefinition | LightTeamDefinition;

/**
 * All 48 base teams from TEAMS.PLN, in the original QB order.
 * The QB code reads 12 PHL + 12 Divisioona + 24 Mutasarja teams; ordering
 * within each tier is meaningful (matches calendar / fixture generation).
 */
export const teams: ManagedTeamDefinition[] = [
  {
    kind: "managed",
    id: 0,
    name: "TPS",
    city: "Turku",
    league: "phl",
    previousRankings: [1, 5, 2],
    tier: 34,
    arena: {
      name: "Turkuhallin Nimihirviö Areena",
      level: 5,
      standingCount: 28,
      seatedCount: 90,
      hasBoxes: true,
      valuePoints: 1032
    }
  },
  {
    kind: "managed",
    id: 1,
    name: "HIFK",
    city: "Helsinki",
    league: "phl",
    previousRankings: [2, 1, 9],
    tier: 31,
    arena: {
      name: "Nordenskjöld Areena",
      level: 4,
      standingCount: 0,
      seatedCount: 80,
      hasBoxes: true,
      valuePoints: 672
    }
  },
  {
    kind: "managed",
    id: 2,
    name: "HPK",
    city: "Hämeenlinna",
    league: "phl",
    previousRankings: [3, 10, 3],
    tier: 33,
    arena: {
      name: "Rinkelinmäen Halli",
      level: 3,
      standingCount: 30,
      seatedCount: 20,
      hasBoxes: false,
      valuePoints: 210
    }
  },
  {
    kind: "managed",
    id: 3,
    name: "SaiPa",
    city: "Lappeenranta",
    league: "phl",
    previousRankings: [4, 7, 11],
    tier: 30,
    arena: {
      name: "Kisapuisto",
      level: 3,
      standingCount: 27,
      seatedCount: 25,
      hasBoxes: false,
      valuePoints: 231
    }
  },
  {
    kind: "managed",
    id: 4,
    name: "Jokerit",
    city: "Helsinki",
    league: "phl",
    previousRankings: [5, 3, 1],
    tier: 32,
    arena: {
      name: "Hjartwall Areena",
      level: 6,
      standingCount: 0,
      seatedCount: 137,
      hasBoxes: true,
      valuePoints: 1480
    }
  },
  {
    kind: "managed",
    id: 5,
    name: "Ilves",
    city: "Tampere",
    league: "phl",
    previousRankings: [6, 2, 4],
    tier: 31,
    arena: {
      name: "Hakametsän Areena",
      level: 4,
      standingCount: 12,
      seatedCount: 68,
      hasBoxes: false,
      valuePoints: 524
    }
  },
  {
    kind: "managed",
    id: 6,
    name: "Blues",
    city: "Espoo",
    league: "phl",
    previousRankings: [7, 4, 7],
    tier: 32,
    arena: {
      name: "ItäAuto Areena",
      level: 5,
      standingCount: 0,
      seatedCount: 74,
      hasBoxes: true,
      valuePoints: 710
    }
  },
  {
    kind: "managed",
    id: 7,
    name: "JYP",
    city: "Jyväskylä",
    league: "phl",
    previousRankings: [8, 11, 5],
    tier: 30,
    arena: {
      name: "Hippos",
      level: 3,
      standingCount: 26,
      seatedCount: 22,
      hasBoxes: false,
      valuePoints: 210
    }
  },
  {
    kind: "managed",
    id: 8,
    name: "Tappara",
    city: "Tampere",
    league: "phl",
    previousRankings: [9, 6, 8],
    tier: 33,
    arena: {
      name: "Hakametsän Jäähalli",
      level: 4,
      standingCount: 12,
      seatedCount: 68,
      hasBoxes: false,
      valuePoints: 524
    }
  },
  {
    kind: "managed",
    id: 9,
    name: "Ässät",
    city: "Pori",
    league: "phl",
    previousRankings: [10, 8, 6],
    tier: 30,
    arena: {
      name: "Isonmäen Hornankattila",
      level: 3,
      standingCount: 25,
      seatedCount: 40,
      hasBoxes: false,
      valuePoints: 315
    }
  },
  {
    kind: "managed",
    id: 10,
    name: "Lukko",
    city: "Rauma",
    league: "phl",
    previousRankings: [11, 9, 10],
    tier: 32,
    arena: {
      name: "Äijänsuon Areena",
      level: 4,
      standingCount: 29,
      seatedCount: 31,
      hasBoxes: false,
      valuePoints: 333
    }
  },
  {
    kind: "managed",
    id: 11,
    name: "Pelicans",
    city: "Lahti",
    league: "phl",
    previousRankings: [12, 14, 18],
    tier: 29,
    arena: {
      name: "Lahden Jäähalli",
      level: 3,
      standingCount: 21,
      seatedCount: 30,
      hasBoxes: false,
      valuePoints: 243
    }
  },
  {
    kind: "managed",
    id: 12,
    name: "KalPa",
    city: "Kuopio",
    league: "mutasarja",
    previousRankings: [48, 12, 12],
    tier: 21,
    arena: {
      name: "Niiralan Monttu",
      level: 2,
      standingCount: 28,
      seatedCount: 22,
      hasBoxes: false,
      valuePoints: 166
    }
  },
  {
    kind: "managed",
    id: 13,
    name: "Kärpät",
    city: "Oulu",
    league: "divisioona",
    previousRankings: [14, 13, 13],
    tier: 30,
    arena: {
      name: "Raksilan Jäähalli",
      level: 3,
      standingCount: 20,
      seatedCount: 56,
      hasBoxes: false,
      valuePoints: 396
    }
  },
  {
    kind: "managed",
    id: 14,
    name: "Hermes",
    city: "Kokkola",
    league: "divisioona",
    previousRankings: [15, 15, 14],
    tier: 25,
    arena: {
      name: "Kokkolahalli",
      level: 2,
      standingCount: 30,
      seatedCount: 10,
      hasBoxes: false,
      valuePoints: 110
    }
  },
  {
    kind: "managed",
    id: 15,
    name: "TuTo",
    city: "Turku",
    league: "divisioona",
    previousRankings: [16, 18, 15],
    tier: 27,
    arena: {
      name: "Kupittaan Kiekkokeskus",
      level: 3,
      standingCount: 33,
      seatedCount: 29,
      hasBoxes: false,
      valuePoints: 273
    }
  },
  {
    kind: "managed",
    id: 16,
    name: "FPS",
    city: "Forssa",
    league: "divisioona",
    previousRankings: [17, 20, 21],
    tier: 23,
    arena: {
      name: "Forssan Jäähalli",
      level: 2,
      standingCount: 20,
      seatedCount: 10,
      hasBoxes: false,
      valuePoints: 90
    }
  },
  {
    kind: "managed",
    id: 17,
    name: "Diskos",
    city: "Jyväskylä",
    league: "divisioona",
    previousRankings: [18, 22, 22],
    tier: 24,
    arena: {
      name: "Jyväskylä-halli",
      level: 3,
      standingCount: 26,
      seatedCount: 22,
      hasBoxes: false,
      valuePoints: 210
    }
  },
  {
    kind: "managed",
    id: 18,
    name: "Sport",
    city: "Vaasa",
    league: "divisioona",
    previousRankings: [19, 19, 16],
    tier: 27,
    arena: {
      name: "Vaasan Uusi Areena",
      level: 2,
      standingCount: 40,
      seatedCount: 6,
      hasBoxes: false,
      valuePoints: 110
    }
  },
  {
    kind: "managed",
    id: 19,
    name: "SaPKo",
    city: "Savonlinna",
    league: "divisioona",
    previousRankings: [20, 23, 19],
    tier: 22,
    arena: {
      name: "Savonlinnan Lato",
      level: 2,
      standingCount: 20,
      seatedCount: 8,
      hasBoxes: false,
      valuePoints: 80
    }
  },
  {
    kind: "managed",
    id: 20,
    name: "Jokipojat",
    city: "Joensuu",
    league: "divisioona",
    previousRankings: [21, 17, 20],
    tier: 24,
    arena: {
      name: "Mehtimäki",
      level: 2,
      standingCount: 30,
      seatedCount: 20,
      hasBoxes: false,
      valuePoints: 160
    }
  },
  {
    kind: "managed",
    id: 21,
    name: "KJT",
    city: "Järvenpää",
    league: "divisioona",
    previousRankings: [22, 16, 17],
    tier: 22,
    arena: {
      name: "Järvenpään Hökötys",
      level: 1,
      standingCount: 10,
      seatedCount: 10,
      hasBoxes: false,
      valuePoints: 50
    }
  },
  {
    kind: "managed",
    id: 22,
    name: "Ahmat",
    city: "Hyvinkää",
    league: "divisioona",
    previousRankings: [23, 24, 23],
    tier: 23,
    arena: {
      name: "Hyvinkään 'areena'",
      level: 2,
      standingCount: 15,
      seatedCount: 7,
      hasBoxes: false,
      valuePoints: 65
    }
  },
  {
    kind: "managed",
    id: 23,
    name: "Jääkotkat",
    city: "Uusikaupunki",
    league: "divisioona",
    previousRankings: [24, 21, 24],
    tier: 23,
    arena: {
      name: "Uudenkaupungin Halli",
      level: 2,
      standingCount: 12,
      seatedCount: 10,
      hasBoxes: false,
      valuePoints: 74
    }
  },
  {
    kind: "managed",
    id: 24,
    name: "Jukurit",
    city: "Mikkeli",
    league: "mutasarja",
    previousRankings: [28, 32, 36],
    tier: 18,
    arena: {
      name: "Mikkeli-keskus",
      level: 1,
      standingCount: 14,
      seatedCount: 5,
      hasBoxes: false,
      valuePoints: 34
    }
  },
  {
    kind: "managed",
    id: 25,
    name: "VG-62",
    city: "Naantali",
    league: "mutasarja",
    previousRankings: [35, 33, 41],
    tier: 17,
    arena: {
      name: "Muumimaailma",
      level: 1,
      standingCount: 10,
      seatedCount: 2,
      hasBoxes: false,
      valuePoints: 18
    }
  },
  {
    kind: "managed",
    id: 26,
    name: "Testicles",
    city: "Kivesjärvi",
    league: "mutasarja",
    previousRankings: [40, 39, 29],
    tier: 18,
    arena: {
      name: "Balls Areena",
      level: 1,
      standingCount: 10,
      seatedCount: 3,
      hasBoxes: false,
      valuePoints: 22
    }
  },
  {
    kind: "managed",
    id: 27,
    name: "SantaClaus",
    city: "Rovaniemi",
    league: "mutasarja",
    previousRankings: [39, 41, 37],
    tier: 16,
    arena: {
      name: "Napapiiri",
      level: 2,
      standingCount: 10,
      seatedCount: 3,
      hasBoxes: false,
      valuePoints: 35
    }
  },
  {
    kind: "managed",
    id: 28,
    name: "Ruiske",
    city: "Tiukukoski",
    league: "mutasarja",
    previousRankings: [37, 38, 27],
    tier: 19,
    arena: {
      name: "Diazepam Areena",
      level: 1,
      standingCount: 11,
      seatedCount: 3,
      hasBoxes: false,
      valuePoints: 23
    }
  },
  {
    kind: "managed",
    id: 29,
    name: "Lightning",
    city: "Kerava",
    league: "mutasarja",
    previousRankings: [34, 30, 42],
    tier: 18,
    arena: {
      name: "Keravan Kuoppa",
      level: 1,
      standingCount: 16,
      seatedCount: 2,
      hasBoxes: false,
      valuePoints: 24
    }
  },
  {
    kind: "managed",
    id: 30,
    name: "Nikkarit",
    city: "Riihimäki",
    league: "mutasarja",
    previousRankings: [31, 31, 34],
    tier: 18,
    arena: {
      name: "Riihimäen Jäähalli",
      level: 1,
      standingCount: 10,
      seatedCount: 3,
      hasBoxes: false,
      valuePoints: 22
    }
  },
  {
    kind: "managed",
    id: 31,
    name: "Salama",
    city: "Sompio",
    league: "mutasarja",
    previousRankings: [44, 44, 38],
    tier: 16,
    arena: {
      name: "Sompion Hoki-Senter",
      level: 1,
      standingCount: 8,
      seatedCount: 2,
      hasBoxes: false,
      valuePoints: 16
    }
  },
  {
    kind: "managed",
    id: 32,
    name: "Hait",
    city: "Nuuksio",
    league: "mutasarja",
    previousRankings: [33, 42, 32],
    tier: 17,
    arena: {
      name: "Nuuksion Jäähalli",
      level: 1,
      standingCount: 8,
      seatedCount: 2,
      hasBoxes: false,
      valuePoints: 16
    }
  },
  {
    kind: "managed",
    id: 33,
    name: "Mahti",
    city: "Mäntsälä",
    league: "mutasarja",
    previousRankings: [42, 36, 39],
    tier: 16,
    arena: {
      name: "Mäntsälän Tekojäärata",
      level: 1,
      standingCount: 7,
      seatedCount: 2,
      hasBoxes: false,
      valuePoints: 15
    }
  },
  {
    kind: "managed",
    id: 34,
    name: "Siat",
    city: "Syväri",
    league: "mutasarja",
    previousRankings: [29, 34, 25],
    tier: 19,
    arena: {
      name: "Itä-Karjala Areena",
      level: 1,
      standingCount: 14,
      seatedCount: 4,
      hasBoxes: false,
      valuePoints: 30
    }
  },
  {
    kind: "managed",
    id: 35,
    name: "Veto",
    city: "Töysä",
    league: "mutasarja",
    previousRankings: [45, 43, 40],
    tier: 17,
    arena: {
      name: "Yläasteen Kaukalo",
      level: 1,
      standingCount: 10,
      seatedCount: 2,
      hasBoxes: false,
      valuePoints: 18
    }
  },
  {
    kind: "managed",
    id: 36,
    name: "Ikirouta",
    city: "Inari",
    league: "mutasarja",
    previousRankings: [43, 48, 45],
    tier: 14,
    arena: {
      name: "Inarijärven Jää",
      level: 1,
      standingCount: 7,
      seatedCount: 2,
      hasBoxes: false,
      valuePoints: 15
    }
  },
  {
    kind: "managed",
    id: 37,
    name: "Jymy",
    city: "Sotkamo",
    league: "mutasarja",
    previousRankings: [46, 45, 47],
    tier: 13,
    arena: {
      name: "Sotkamon Pesismekka",
      level: 1,
      standingCount: 7,
      seatedCount: 2,
      hasBoxes: false,
      valuePoints: 15
    }
  },
  {
    kind: "managed",
    id: 38,
    name: "Hokki",
    city: "Salo",
    league: "mutasarja",
    previousRankings: [30, 26, 30],
    tier: 18,
    arena: {
      name: "3210 Areena",
      level: 1,
      standingCount: 10,
      seatedCount: 4,
      hasBoxes: false,
      valuePoints: 26
    }
  },
  {
    kind: "managed",
    id: 39,
    name: "Voitto",
    city: "Kangasala",
    league: "mutasarja",
    previousRankings: [32, 28, 43],
    tier: 18,
    arena: {
      name: "Kangasalareena",
      level: 1,
      standingCount: 7,
      seatedCount: 3,
      hasBoxes: false,
      valuePoints: 19
    }
  },
  {
    kind: "managed",
    id: 40,
    name: "Teurastus",
    city: "Porvoo",
    league: "mutasarja",
    previousRankings: [41, 40, 48],
    tier: 15,
    arena: {
      name: "Gore Areena",
      level: 1,
      standingCount: 10,
      seatedCount: 2,
      hasBoxes: false,
      valuePoints: 18
    }
  },
  {
    kind: "managed",
    id: 41,
    name: "KoMu HT",
    city: "Korsholm",
    league: "mutasarja",
    previousRankings: [47, 47, 44],
    tier: 14,
    arena: {
      name: "Korsholm Hockeyring",
      level: 1,
      standingCount: 6,
      seatedCount: 2,
      hasBoxes: false,
      valuePoints: 14
    }
  },
  {
    kind: "managed",
    id: 42,
    name: "Saappaat",
    city: "Nokia",
    league: "mutasarja",
    previousRankings: [38, 37, 35],
    tier: 17,
    arena: {
      name: "Nokian Kylpylä",
      level: 1,
      standingCount: 6,
      seatedCount: 3,
      hasBoxes: false,
      valuePoints: 18
    }
  },
  {
    kind: "managed",
    id: 43,
    name: "Aromi",
    city: "Valkeakoski",
    league: "mutasarja",
    previousRankings: [36, 35, 31],
    tier: 18,
    arena: {
      name: "Paperitehtaan Kellari",
      level: 1,
      standingCount: 6,
      seatedCount: 3,
      hasBoxes: false,
      valuePoints: 18
    }
  },
  {
    kind: "managed",
    id: 44,
    name: "Gepardit",
    city: "Klaukkala",
    league: "mutasarja",
    previousRankings: [27, 27, 28],
    tier: 22,
    arena: {
      name: "Klaukkalan Areena",
      level: 1,
      standingCount: 12,
      seatedCount: 4,
      hasBoxes: false,
      valuePoints: 28
    }
  },
  {
    kind: "managed",
    id: 45,
    name: "KooKoo",
    city: "Kouvola",
    league: "divisioona",
    previousRankings: [25, 25, 26],
    tier: 24,
    arena: {
      name: "Kouvolan Jäähalli",
      level: 3,
      standingCount: 22,
      seatedCount: 38,
      hasBoxes: false,
      valuePoints: 294
    }
  },
  {
    kind: "managed",
    id: 46,
    name: "HardCore",
    city: "Loimaa",
    league: "mutasarja",
    previousRankings: [26, 29, 33],
    tier: 22,
    arena: {
      name: "Granit Arena",
      level: 2,
      standingCount: 15,
      seatedCount: 5,
      hasBoxes: false,
      valuePoints: 55
    }
  },
  {
    kind: "managed",
    id: 47,
    name: "Turmio",
    city: "Kolari",
    league: "mutasarja",
    previousRankings: [48, 46, 46],
    tier: 13,
    arena: {
      name: "Lunastus Areena",
      level: 1,
      standingCount: 8,
      seatedCount: 2,
      hasBoxes: false,
      valuePoints: 16
    }
  }
];

/**
 * Per-seat-type per-level unit cost (QB tila(seatType, level), loaded from
 * ARENAS.M2K). -1 means the seat type is unavailable at that level.
 *
 * Used to compute an arena's overall ppiste value:
 *   ppiste = (seated * tila.seated + standing * tila.standing)
 *          * (hasBoxes ? 1.2 : 1)
 *
 * Upgrade cost (per QB ILES5.BAS:465): (newPpiste - oldPpiste) * 20_000 mk.
 */
export const arenaUnitCosts: Record<
  ArenaLevel,
  { standing: number; seated: number; box: number }
> = {
  1: { standing: 1, seated: 4, box: -1 },
  2: { standing: 2, seated: 5, box: -1 },
  3: { standing: 3, seated: 6, box: -1 },
  4: { standing: 4, seated: 7, box: 20 },
  5: { standing: 5, seated: 8, box: 20 },
  6: { standing: 6, seated: 9, box: 20 }
};

/** Total arena-value points (ppiste in QB). Pure derivation; matches the stored Arena.valuePoints for all 48 base teams. */
export const arenaValuePoints = (arena: Arena): number => {
  const cost = arenaUnitCosts[arena.level];
  const base =
    arena.standingCount * cost.standing + arena.seatedCount * cost.seated;
  return arena.hasBoxes ? Math.round(base * 1.2) : base;
};

/**
 * Verbatim Finnish wizard strings sourced from the QB data files.
 *
 * Per AGENTS.md "Preserve the prose": all user-visible Finnish strings
 * in the new-game flow are ported verbatim from the original cp850
 * `.MHM` records (or, where the QB code prints them as inline literals,
 * from the relevant `MHM2K.BAS` line).
 *
 * Token rewrite follows AGENTS.md "Porting tokens to Markdown": `$j…$b`
 * and `$n…$b` and `$f…$b` collapse to Markdown `**…**`. Surrounding
 * `$b` (body / reset) tokens are dropped. Render through `Markdown.tsx`
 * (or strip with `stripQbMarkdown` for plain-text surfaces like
 * <Heading>).
 */

/**
 * Strip Markdown bold markers (`**…**`) from a wizard string so it can
 * be rendered inside a heading or button label that doesn't accept
 * inline formatting. Plain-text only, no further cleanup.
 */
export const stripQbMarkdown = (s: string): string => s.replace(/\*\*/g, "");

// ---------------------------------------------------------------------------
// Step 1 — manager count
// ---------------------------------------------------------------------------

/** AL.MHM:1 — `lt "al", 1` at MHM2K.BAS:574. */
export const MANAGER_COUNT_HEADLINE = "VALITSE PELAAJIEN LUKUMÄÄRÄ";

// ---------------------------------------------------------------------------
// Step 2 — nationality
// ---------------------------------------------------------------------------

/** Inline literal at MHM2K.BAS:2347. */
export const NATIONALITY_HEADLINE = "VALITSE KANSALLISUUTESI";

// ---------------------------------------------------------------------------
// Step 3 — experience archetype
// ---------------------------------------------------------------------------

/** Inline literal at MHM2K.BAS:2370. */
export const EXPERIENCE_HEADLINE = "MANAGERINA OLET...";

/** X.MHM:200 — `lt "x", 200` at MHM2K.BAS:2367. */
export const EXPERIENCE_INTRO =
  "Kokemustasolla ei ole minkäänlaista vaikutusta pelin vaikeustasoon, kyse on manageripersoonasi aiemmasta urasta. **Uusi kasvo** merkitsee sitä, että urasi on vasta alkamassa, **Elävä legenda** on puolestaan manageroinut jo vuosikymmenien ajan.";

// ---------------------------------------------------------------------------
// Step 4 — difficulty
// ---------------------------------------------------------------------------

/** Inline literal at MHM2K.BAS:1792. */
export const DIFFICULTY_HEADLINE = "VALITSE VAIKEUSTASOSI";

/**
 * X.MHM:1..5 — `lt "x", kurso` at MHM2K.BAS:1804. Indexed by
 * `DifficultyLevelId - 1`.
 */
export const DIFFICULTY_HELP: readonly string[] = [
  // 1 — Nörttivatsa
  "Tämä aloittelijoille ja helpon menestyksen ystäville tarkoitettu taso tekee menestymisestä helppoa: sponsorit antavat kottikärryittäin rahaa, tietokoneen managerit rakastavat sinua ja kaikki on halpaa!",
  // 2 — Maitovatsa
  "Kynsiä ei tarvitse pureskella tätä vaikeustasoa käyttäessä. Pokaaleja ei kanneta sinulle hopeatarjottimella, vaan joudut itse hakemaan tarjottimen metrin päästä.",
  // 3 — Kahvivatsa
  "MHM 2000:n perustaso tarjoaa keskitasoista haastetta kaikin puolin: menestyksen eteen saa nähdä jo vähän vaivaakin.",
  // 4 — Haavavatsa
  "Vahvan elämyksen ystäville. Kaikki maksaa, sponsorit ovat pihejä ja tietokoneen managerit eivät pidä sinusta. Menestys on työn ja tuskan takana.",
  // 5 — Katarrivatsa
  "Tätä vaikeustasoa käyttäessäsi saat varautua ikävyyksiin kaikilla osa-alueilla: kukaan ei halua nähdä sinun menestyvän. Kaikki tekevät kaikkensa (!) kampittaakseen sinut."
] as const;

// ---------------------------------------------------------------------------
// Step 5 — team selection
// ---------------------------------------------------------------------------

/** Inline literal at MHM2K.BAS:1905. */
export const TEAM_HEADLINE = "VALITSE JOUKKUEESI (PELAAJAMATERIAALI)";

/** Inline literals at MHM2K.BAS:1907-1910. */
export const TEAM_GROUP_LABELS: Record<string, string> = {
  phl: "PHL",
  divisioona: "DIVISIOONA",
  mutasarja: "MUTASARJA"
};

/** Inline literal at MHM2K.BAS:1925. */
export const TEAM_CUSTOM_LABEL = "OMA JOUKKUE";

/** Inline literal at MHM2K.BAS:1936. */
export const TEAM_FIELD_CITY = "JOUKKUEEN KOTIKAUPUNKI";
/** Inline literal at MHM2K.BAS:1941. */
export const TEAM_FIELD_ARENA = "JOUKKUEEN AREENA";
/** Inline literal at MHM2K.BAS:1946. */
export const TEAM_FIELD_AMENITY = "VIIHTYISYYSTASO";

// ---------------------------------------------------------------------------
// Step 6 — attributes
// ---------------------------------------------------------------------------

/** AL.MHM:10 — `lt "al", 10` at MHM2K.BAS:1497. */
export const ATTRIBUTES_INTRO =
  "ON AIKA LUODA ITSELLESI MANAGERIPERSOONA. JOKAINEN MUUTOS TUO SIIHEN OMAT VAHVUUTENSA JA HEIKKOUTENSA, EIKÄ PERSOONAA VOI ENÄÄ JÄLKIKÄTEEN MUUTTAA, JOTEN VALITSE TARKASTI. (+3: **LOISTAVA**, 0: **KESKINKERTAINEN**, -3: **UMPISURKEA**)";

/** Inline literal at MHM2K.BAS:1507. */
export const ATTRIBUTES_POINTS_LABEL = "PISTEITÄ VAPAANA";

/**
 * X.MHM:62..67 — `lt "x", 61 + kurso` at MHM2K.BAS:1529. Per-attribute
 * help, ordered to match the QB `mtnimi(1..6)` / our `ManagerAttributeKey`:
 * strategy, specialTeams, negotiation, resourcefulness, charisma, luck.
 */
export const ATTRIBUTE_HELP = {
  strategy:
    "Tämä taito kertoo managerin **pitkän** tähtäimen valmennusosaamisen: sen merkitystä ei voi liiaksi korostaa. Kellään ei ole enää mukavaa, jos huolella laadittu harjoitusohjelma pettää kesken kauden.",
  specialTeams:
    "Ylivoima, alivoima, rangaistuslaukaukset ja yleensä mitä kummallisimmat erikoistilanteet kuuluvat tämän taidon piiriin. Ei tarvinne erikseen mainita, että erikoistilanteet **ratkaisevat** usein otteluja.",
  negotiation:
    "Manageri kohtaa urallaan monia neuvottelutilanteita, joissa hän tarvitsee tilanteesta riippuen erilaisia menetelmiä: kovuutta, mielistelyä, manipulointia ja niin edelleen. **Neuvottelutaito** pitää sisällään nämä kaikki.",
  resourcefulness:
    "Manageri ei voi välttyä kriisitilanteilta, ja kysymys kuuluukin: kuinka hän niistä **selviytyy**? Tähtipelaajien välillä on kismaa, tappioputki painaa moraalia, ja niin edelleen. Tällöin neuvokkuutta kaivataan!",
  charisma:
    "Maailma rakastaa karismaattista manageria. Pelaajat neuvottelevat hänen kanssaan mielellään, fanit rakastavat ja media palvoo häntä - kukaan ei tahdo hänelle pahaa eikä usko hänestä pahaa. Rujon, epämiellyttävän managerin elämä on ankeampaa, hän saa kerätä postiluukustaan rakkausrunojen sijasta **pommiuhkauksia**.",
  luck: "Jääkiekko on toki taitolaji, mutta kaikesta huolimatta myös managerin elämässä **tuurilla** on suuri merkitys... suuri, sen enempää täsmentämättä, luo epäonninen persoona niin saat selville kuinka suuri."
} as const;

/**
 * Inline literals at MHM2K.BAS:1512 — the six `mtnimi(1..6)` headings
 * the QB UI puts left of the -3..+3 strip. Drives the order of the
 * attribute rows in the wizard.
 */
export const ATTRIBUTE_LABELS = {
  strategy: "STRATEGIAT",
  specialTeams: "ERIKOISTILANTEET",
  negotiation: "NEUVOTTELUTAITO",
  resourcefulness: "NEUVOKKUUS",
  charisma: "KARISMA",
  luck: "ONNEKKUUS"
} as const;

// ---------------------------------------------------------------------------
// Step 7 — pecking order
// ---------------------------------------------------------------------------

/** Inline literal at MHM2K.BAS:594. */
export const PECKING_ORDER_HEADLINE = "VALITSE NOKKIMISJÄRJESTYS";

/**
 * AL.MHM:2..4 — `lt "al", 1 + zz` at MHM2K.BAS:599. Mapped to our
 * pecking-order ids per the QB `kurso → x` lookup at MHM2K.BAS:608:
 *   kurso = 1 (REILU)       → x44 (worst-first)
 *   kurso = 2 (REALISTINEN) → x45 (best-first)
 *   kurso = 3 (SATUNNAINEN) → x52 (random)
 */
export const PECKING_ORDER_LABELS = {
  "best-first": "REALISTINEN",
  "worst-first": "REILU",
  random: "SATUNNAINEN"
} as const;

/**
 * X.MHM:44/45/52 — help blurb shown beneath the highlighted option.
 */
export const PECKING_ORDER_HELP = {
  "worst-first":
    "Edellisellä kaudella **huonoiten** sijoittuneen joukkueen manageri on aina ensimmäisenä vuorossa.",
  "best-first":
    "Edellisellä kaudella **parhaiten** sijoittuneen joukkueen manageri on aina ensimmäisenä vuorossa.",
  random:
    "Vuorojärjestys **arvotaan** jokaisen kauden alussa uudestaan. Sijoituksilla ei väliä, täysin sattumanvarainen järjestys."
} as const;

// ---------------------------------------------------------------------------
// Per-manager loop heading
// ---------------------------------------------------------------------------

/** Inline literal at MHM2K.BAS:634 — `KIRJOITA NIMESI, MANAGERI N`. */
export const NAME_HEADLINE = (managerNumber: number): string =>
  `KIRJOITA NIMESI, MANAGERI ${managerNumber}`;

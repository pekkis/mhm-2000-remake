/**
 * Mood definition — one of 45 mood-swing performance modifier events.
 * Data from MUUDIT.M2K (values) + M.MHM (cp850-decoded narrative text).
 *
 * QB source: `dap` CASE 3 (ILEX5.BAS:1270-1277).
 * Selection: `muud = INT(45 * RND) + 1` — uniform random pick.
 * Guard: `lukka = 0 AND psk + amount > 0` — must not reduce skill to ≤ 0.
 * Duration formula (in resolve): `Math.floor(durationRange * random.next()) + durationBase + 1`.
 *
 * Display: `lax 120` header (positive) / `lax 121` (negative) + mood text.
 * The player's name is printed by the event renderer, not embedded in the text.
 */
export type MoodDefinition = {
  /** QB `mood(muud, 1)` — signed skill modifier. Positive = boost, negative = debuff. */
  amount: number;
  /** QB `mood(muud, 2)` — minimum component of the duration formula. */
  durationBase: number;
  /** QB `mood(muud, 3)` — random range component of the duration formula. */
  durationRange: number;
  /** Mood event narrative text from M.MHM, cp850 → UTF-8. QB color tokens converted to Markdown (bold/italic). */
  explanation: string;
};

/**
 * 45 mood events extracted from MUUDIT.M2K + M.MHM.
 *
 * Columns from MUUDIT.M2K: `amount, durationBase, durationRange`
 * Text from M.MHM: 500-byte fixed-width cp850 records, 1-indexed.
 *
 * Non-mood performance modifier sources (inline in their event definitions):
 *
 * B-tournament accept (ILEX5.BAS:3269-3270, `mmkisaalku`):
 *   amount = 1, duration = INT(10*RND) + 10 (10–19 rounds)
 *
 * B-tournament decline (ILEX5.BAS:3274-3275, `mmkisaalku`):
 *   amount = INT(3*RND) - 3 (-3..0), duration = INT(10*RND) + 10
 *
 * Contract accept (ILEX5.BAS:5894, `rstages` CASE 68/69, "k"):
 *   amount = 1, duration = 1000 (effectively permanent for a season)
 *
 * Contract forced (ILEX5.BAS:5894, `rstages` CASE 68/69, else):
 *   amount = -2, duration = 1000
 */
export const moodDefinitions: readonly MoodDefinition[] = [
  {
    amount: -1,
    durationBase: 5,
    durationRange: 8,
    explanation:
      "Hänen rakastettu mummonsa on **kuollut** saavutettuaan 85 vuoden kunnioitettavan iän."
  },
  {
    amount: 1,
    durationBase: 5,
    durationRange: 8,
    explanation:
      "Hänen ökyrikas sika-isoisänsä on **kuollut** jättäen ainoalle lapsenlapselleen todella mittavan perinnön."
  },
  {
    amount: -1,
    durationBase: 1,
    durationRange: 2,
    explanation:
      "Hänen urheiluautoonsa on tullut hallin parkkipaikalla **lommo** eikä kukaan suostu tunnustamaan syyllisyyttään..."
  },
  {
    amount: -2,
    durationBase: 3,
    durationRange: 6,
    explanation:
      "Hänen treffinsä **Landan** kanssa sujuivat huonommin kuin KUKAAN olisi edes osannut aavistaa..."
  },
  {
    amount: 2,
    durationBase: 3,
    durationRange: 6,
    explanation:
      "Hänen treffinsä **Landan** kanssa sujuivat paremmin kuin kukaan olisi etukäteen uskonut!"
  },
  {
    amount: -3,
    durationBase: 5,
    durationRange: 10,
    explanation: "Hänen pitkäaikainen ihmissuhteensa on **raunioitunut**..."
  },
  {
    amount: 2,
    durationBase: 4,
    durationRange: 8,
    explanation:
      "Hän on viimein (omien sanojensa mukaan) löytänyt unelmiensa **miehen**."
  },
  {
    amount: 2,
    durationBase: 4,
    durationRange: 8,
    explanation:
      "Hän on viimein (puheidensa mukaan) löytänyt elämänsä **naisen**."
  },
  {
    amount: 1,
    durationBase: 10,
    durationRange: 20,
    explanation:
      "Kaikki mihin hän näinä päivinä ryhtyy onnistuu maagisesti. 'Tämä on **korkeampien** voimien työtä!', pelaaja sanoo osoittaen taivaalle."
  },
  {
    amount: 1,
    durationBase: 4,
    durationRange: 6,
    explanation:
      "Blues-yhtye jossa hän soittaa on kovasti **nousussa**! 'Levytyssopimus ei ole kaukana', pelaaja iloitsee."
  },
  {
    amount: -1,
    durationBase: 4,
    durationRange: 6,
    explanation:
      "Miehen johtama rock-yhtye on **hajonnut** lopullisesti. 'Juuri kun läpimurto oli odotettavissa...', mies itkeä tihrustaa."
  },
  {
    amount: 6,
    durationBase: 1,
    durationRange: 8,
    explanation:
      "Hän taistelee kentällä **hurmioituneesti**...kukaan ei tiedä miksi, mutta hänen peliään on tällä hetkellä suorastaan ilo katsoa!!"
  },
  {
    amount: -4,
    durationBase: 1,
    durationRange: 8,
    explanation:
      "Mikään ei tunnu onnistuvan ja _mustat_ pilvet kerääntyvät miehen ylle..."
  },
  {
    amount: -1,
    durationBase: 7,
    durationRange: 14,
    explanation:
      "Ongelmat yksityiselämässä **heijastuvat** hänen tämänhetkisiin peliesityksiinsä ikävällä tavalla."
  },
  {
    amount: 1,
    durationBase: 7,
    durationRange: 14,
    explanation:
      "Hänellä menee hyvin hallin **ulkopuolella** ja tämä heijastuu hänen esityksiinsä kentällä."
  },
  {
    amount: -5,
    durationBase: 3,
    durationRange: 15,
    explanation:
      "Hän on käyttänyt liikaa **aineita**, ja maksaa nyt kalliin hinnan sekoiluistaan sekavan mielentilan muodosaa."
  },
  {
    amount: -1,
    durationBase: 20,
    durationRange: 40,
    explanation:
      "Hän kärsii oudosta **päänsärystä**. Se ei pysty pitämään miestä poissa kentiltä, mutta keskittyminen kärsii kun päässä jyskyttää jatkuvasti."
  },
  {
    amount: -1,
    durationBase: 10,
    durationRange: 30,
    explanation:
      "Hänen polvilumpionsa **muljahtelee** ikävästi edestakaisin... vaivaan ei ole muita lääkkeitä kuin aika."
  },
  {
    amount: 2,
    durationBase: 5,
    durationRange: 30,
    explanation:
      "Hän on löytänyt jostakin täysin uusia ulottuvuuksia peliinsä. Syötöt **napsuvat** lapaan ja laukaus lähtee kuin tykin piipusta!"
  },
  {
    amount: -2,
    durationBase: 10,
    durationRange: 50,
    explanation:
      "Hän on tullut hieman paranoidiseksi nähden **salaliittoja** kaikkialla ympärillään. Tämä vaikuttaa negatiivisesti miehen peliesityksiin. (Tiukukoski kutsuu?)"
  },
  {
    amount: -2,
    durationBase: 10,
    durationRange: 50,
    explanation:
      "Hän on tullut hieman hulluksi ja luulee olevansa **Elvis**. Hänen upouusi lannetaklaustyylinsä on varsin tehokas, mutta **lauluääni** ei vedä vertoja Kuninkaan vastaavalle."
  },
  {
    amount: -2,
    durationBase: 2,
    durationRange: 10,
    explanation:
      "Hänen taklausvoimansa ei ole enää totutun tasoista, sillä mies kärsii kipeistä **peräpukamista** eikä pysty käyttämään asettaan 100 prosentin teholla..."
  },
  {
    amount: 2,
    durationBase: 2,
    durationRange: 11,
    explanation:
      "Mies on kuin uudestisyntynyt ja taistelee härän lailla, löydettyään naisseuraa **Internetistä**."
  },
  {
    amount: 14,
    durationBase: 1,
    durationRange: 5,
    explanation:
      "Hänen päähänsä nuorena miehenä asennettu metallilevy on alkanut lähettää outoa **säteilyä**, joka antaa paitsi hänelle mahdollisuuden kuunnella joukkuekavereidensa kännykkäpuheluita, myös lisäpotkua luistimiin!"
  },
  {
    amount: -2,
    durationBase: 5,
    durationRange: 10,
    explanation:
      "Hänen manageri-isänsä on varastanut kaikki miehen rahat ja matkustanut **Bahia Felizin** aurinkoiseen ja leppeään ilmanalaan rentoutumaan!"
  },
  {
    amount: 2,
    durationBase: 2,
    durationRange: 4,
    explanation:
      "Hän on saanut **pimitettyä** koko tämän kauden palkan verottajalta ovelien yrityskytkösten ja säätiöittämisen avulla. Ehkä sillä, että itse rosmoparooni **Ari U. Koti** kuuluu miehen ystäväpiiriin, on jotain tekemistä ketkuilun kanssa?"
  },
  {
    amount: -1,
    durationBase: 30,
    durationRange: 60,
    explanation:
      "Hän kärsii pahasta IRC-addiktiosta, ja on aloittanut vieroitushoidon. Lähikuukausina odotettavissa rutkasti **kärttyisyyttä**."
  },
  {
    amount: -2,
    durationBase: 2,
    durationRange: 9,
    explanation:
      "Hän kärsii pahasta **unettomuudesta**. 'Kun nukahdan, näen hassuja unia **Hanna-Aisa Kermusesta**, enkä aio nukkua enää koskaan', hän sanoo, ja nappaa purkista kourallisen kofeiinipillereitä."
  },
  {
    amount: 1,
    durationBase: 3,
    durationRange: 14,
    explanation:
      "Hän nauttii jääkiekon pelaamisesta tällä hetkellä enemmän kuin mistään muusta, ja se **näkyy** kaukalossa!"
  },
  {
    amount: -1,
    durationBase: 1,
    durationRange: 4,
    explanation:
      "Hän on saanut tietää olevansa adoptio-lapsi. 'Missä ovatkaan oikeat **isi** ja **äiti**?', hän valittaa."
  },
  {
    amount: 1,
    durationBase: 3,
    durationRange: 6,
    explanation:
      "Hän on pitkän kolotuksen jälkeen viimein täysin terve, ja uskaltaa laittaa kaiken peliin - ainakin muutaman kierroksen ajan kunnes jokin paikka pettää jälleen..."
  },
  {
    amount: -3,
    durationBase: 1,
    durationRange: 2,
    explanation:
      "Hänen koiransa repi hänen rakkaimman **pehmolelunsa** riekaleiksi. '**Nalle** kuoli, voi voi voi!' pelaaja itkee, imien peukaloaan."
  },
  {
    amount: -5,
    durationBase: 1,
    durationRange: 4,
    explanation:
      "Hänen viikko sitten **myymiltään** mailta on löydetty timantteja. 'Tämä ei ole mahdollista, ei ole!' pelaaja mutisee kävellen ympyrää."
  },
  {
    amount: 3,
    durationBase: 1,
    durationRange: 4,
    explanation:
      "Hän on saanut **myytyä** hyvällä hinnalla tontin jonka valtio pian pakkolunastaa rakentaakseen uuden 12-kaistaisen moottoritien! 'Heh heh hee, mahtaapi se kahdeksanlapsinen suurperhe kohta pettyä', mies hykertelee."
  },
  {
    amount: -1,
    durationBase: 2,
    durationRange: 4,
    explanation:
      "Hänen rakastettu veljensä on alkanut pukeutua hameeseen: ei siinä muuten mitään, mutta tämän seurauksena veli ei enää mahdu **Turun Trojansien** jenkkifutisjoukkueeseen."
  },
  {
    amount: -1,
    durationBase: 1,
    durationRange: 1,
    explanation:
      "Hänen sisarensa on valittu **Nuuksion** kunnanvaltuustoon. 'Kuten minä, siskoni on _kommunisti_. Vielä päivä koittaa jolloin vapaus voittaa!', pelaaja uhoaa nyrkki nostettuna sosialistitervehdykseen."
  },
  {
    amount: -1,
    durationBase: 1,
    durationRange: 5,
    explanation:
      "Hän on osallistunut **Epäonnenruudut**-visailuun ja **munannut** itsensä totaalisesti koko kansan edessä!"
  },
  {
    amount: 1,
    durationBase: 1,
    durationRange: 5,
    explanation:
      "Hän on osallistunut **Epäonnenruudut**-visailuohjelmaan ja osoittanut valtaisaa yleistietoa; mies voitti itselleen lasikipon ja kolmen tuhannen markan arvoisen matkalahjakortin Ruotsinlaivalle. Onneksi olkoon!"
  },
  {
    amount: -2,
    durationBase: 3,
    durationRange: 6,
    explanation: "Hänellä on ongelmia **suorituskykynsä** kanssa. (?)"
  },
  {
    amount: 2,
    durationBase: 3,
    durationRange: 6,
    explanation:
      "Hänen avioliittonsa kukoistaa parantuneen **suorituskyvyn** ansiosta (?!)"
  },
  {
    amount: -1,
    durationBase: 1,
    durationRange: 5,
    explanation:
      "Hän joutui ylellisen elämäntapansa johdosta tekemään shampoo-mainoksen **Ol'Real**-yhtiölle, joka **ei** siis ole hyvä juttu."
  },
  {
    amount: 1,
    durationBase: 1,
    durationRange: 5,
    explanation:
      "Hän on onnistunut **raamikkaan** olemuksensa myötä saamaan sopimuksen valokuvaussessiosta **Bugo Hossin** leivissä."
  },
  {
    amount: -4,
    durationBase: 2,
    durationRange: 5,
    explanation:
      "Hän on vaipunut **masennukseen**. 'Elämäni on niin _synkkää_ ja pimeää', pelaaja valittaa."
  },
  {
    amount: 1,
    durationBase: 1,
    durationRange: 4,
    explanation:
      "Hän on aloittanut treenaamisen TV:stä tutun **Ultimate Gym**-hilavitkuttimen kanssa."
  },
  {
    amount: -2,
    durationBase: 5,
    durationRange: 8,
    explanation:
      "Hänen poikansa on päättänyt keskittyä täst'edes vain **jäätanssiin**, tai rusettiluisteluun kuten pelaaja itse lajin nimeää."
  }
];

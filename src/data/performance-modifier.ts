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
  /** Mood event narrative text from M.MHM, cp850 → UTF-8. Contains markup tokens ($b, $n, $j, $h, $d). */
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
      "$bHänen rakastettu mummonsa on $nkuollut$b saavutettuaan 85 vuoden kunnioitettavan iän."
  },
  {
    amount: 1,
    durationBase: 5,
    durationRange: 8,
    explanation:
      "$bHänen ökyrikas sika-isoisänsä on $nkuollut$b jättäen ainoalle lapsenlapselleen todella mittavan perinnön."
  },
  {
    amount: -1,
    durationBase: 1,
    durationRange: 2,
    explanation:
      "$bHänen urheiluautoonsa on tullut hallin parkkipaikalla $nlommo$b eikä kukaan suostu tunnustamaan syyllisyyttään..."
  },
  {
    amount: -2,
    durationBase: 3,
    durationRange: 6,
    explanation:
      "$bHänen treffinsä $jLandan$b kanssa sujuivat huonommin kuin KUKAAN olisi edes osannut aavistaa..."
  },
  {
    amount: 2,
    durationBase: 3,
    durationRange: 6,
    explanation:
      "$bHänen treffinsä $jLandan$b kanssa sujuivat paremmin kuin kukaan olisi etukäteen uskonut!"
  },
  {
    amount: -3,
    durationBase: 5,
    durationRange: 10,
    explanation: "$bHänen pitkäaikainen ihmissuhteensa on $nraunioitunut$b..."
  },
  {
    amount: 2,
    durationBase: 4,
    durationRange: 8,
    explanation:
      "$bHän on viimein (omien sanojensa mukaan) löytänyt unelmiensa $nmiehen$b."
  },
  {
    amount: 2,
    durationBase: 4,
    durationRange: 8,
    explanation:
      "$bHän on viimein (puheidensa mukaan) löytänyt elämänsä $nnaisen$b."
  },
  {
    amount: 1,
    durationBase: 10,
    durationRange: 20,
    explanation:
      "$bKaikki mihin hän näinä päivinä ryhtyy onnistuu maagisesti. 'Tämä on $nkorkeampien$b voimien työtä!', pelaaja sanoo osoittaen taivaalle."
  },
  {
    amount: 1,
    durationBase: 4,
    durationRange: 6,
    explanation:
      "$bBlues-yhtye jossa hän soittaa on kovasti $nnousussa$b! 'Levytyssopimus ei ole kaukana', pelaaja iloitsee."
  },
  {
    amount: -1,
    durationBase: 4,
    durationRange: 6,
    explanation:
      "$bMiehen johtama rock-yhtye on $nhajonnut$b lopullisesti. 'Juuri kun läpimurto oli odotettavissa...', mies itkeä tihrustaa."
  },
  {
    amount: 6,
    durationBase: 1,
    durationRange: 8,
    explanation:
      "$bHän taistelee kentällä $nhurmioituneesti$b...kukaan ei tiedä miksi, mutta hänen peliään on tällä hetkellä suorastaan ilo katsoa!!"
  },
  {
    amount: -4,
    durationBase: 1,
    durationRange: 8,
    explanation:
      "$bMikään ei tunnu onnistuvan ja $hmustat$b pilvet kerääntyvät miehen ylle..."
  },
  {
    amount: -1,
    durationBase: 7,
    durationRange: 14,
    explanation:
      "$bOngelmat yksityiselämässä $nheijastuvat$b hänen tämänhetkisiin peliesityksiinsä ikävällä tavalla."
  },
  {
    amount: 1,
    durationBase: 7,
    durationRange: 14,
    explanation:
      "$bHänellä menee hyvin hallin $nulkopuolella$b ja tämä heijastuu hänen esityksiinsä kentällä."
  },
  {
    amount: -5,
    durationBase: 3,
    durationRange: 15,
    explanation:
      "$bHän on käyttänyt liikaa $naineita$b, ja maksaa nyt kalliin hinnan sekoiluistaan sekavan mielentilan muodosaa."
  },
  {
    amount: -1,
    durationBase: 20,
    durationRange: 40,
    explanation:
      "$bHän kärsii oudosta $npäänsärystä$b. Se ei pysty pitämään miestä poissa kentiltä, mutta keskittyminen kärsii kun päässä jyskyttää jatkuvasti."
  },
  {
    amount: -1,
    durationBase: 10,
    durationRange: 30,
    explanation:
      "$bHänen polvilumpionsa $nmuljahtelee$b ikävästi edestakaisin... vaivaan ei ole muita lääkkeitä kuin aika."
  },
  {
    amount: 2,
    durationBase: 5,
    durationRange: 30,
    explanation:
      "$bHän on löytänyt jostakin täysin uusia ulottuvuuksia peliinsä. Syötöt $nnapsuvat$b lapaan ja laukaus lähtee kuin tykin piipusta!"
  },
  {
    amount: -2,
    durationBase: 10,
    durationRange: 50,
    explanation:
      "$bHän on tullut hieman paranoidiseksi nähden $nsalaliittoja$b kaikkialla ympärillään. Tämä vaikuttaa negatiivisesti miehen peliesityksiin. (Tiukukoski kutsuu?)"
  },
  {
    amount: -2,
    durationBase: 10,
    durationRange: 50,
    explanation:
      "$bHän on tullut hieman hulluksi ja luulee olevansa $jElvis$b. Hänen upouusi lannetaklaustyylinsä on varsin tehokas, mutta $nlauluääni$b ei vedä vertoja Kuninkaan vastaavalle."
  },
  {
    amount: -2,
    durationBase: 2,
    durationRange: 10,
    explanation:
      "$bHänen taklausvoimansa ei ole enää totutun tasoista, sillä mies kärsii kipeistä $nperäpukamista$b eikä pysty käyttämään asettaan 100 prosentin teholla..."
  },
  {
    amount: 2,
    durationBase: 2,
    durationRange: 11,
    explanation:
      "$bMies on kuin uudestisyntynyt ja taistelee härän lailla, löydettyään naisseuraa $nInternetistä$b."
  },
  {
    amount: 14,
    durationBase: 1,
    durationRange: 5,
    explanation:
      "$bHänen päähänsä nuorena miehenä asennettu metallilevy on alkanut lähettää outoa $nsäteilyä$b, joka antaa paitsi hänelle mahdollisuuden kuunnella joukkuekavereidensa kännykkäpuheluita, myös lisäpotkua luistimiin!"
  },
  {
    amount: -2,
    durationBase: 5,
    durationRange: 10,
    explanation:
      "$bHänen manageri-isänsä on varastanut kaikki miehen rahat ja matkustanut $jBahia Felizin$b aurinkoiseen ja leppeään ilmanalaan rentoutumaan!"
  },
  {
    amount: 2,
    durationBase: 2,
    durationRange: 4,
    explanation:
      "$bHän on saanut $npimitettyä$b koko tämän kauden palkan verottajalta ovelien yrityskytkösten ja säätiöittämisen avulla. Ehkä sillä, että itse rosmoparooni $jAri U. Koti$b kuuluu miehen ystäväpiiriin, on jotain tekemistä ketkuilun kanssa?"
  },
  {
    amount: -1,
    durationBase: 30,
    durationRange: 60,
    explanation:
      "$bHän kärsii pahasta IRC-addiktiosta, ja on aloittanut vieroitushoidon. Lähikuukausina odotettavissa rutkasti $nkärttyisyyttä$b."
  },
  {
    amount: -2,
    durationBase: 2,
    durationRange: 9,
    explanation:
      "$bHän kärsii pahasta $nunettomuudesta$b. 'Kun nukahdan, näen hassuja unia $jHanna-Aisa Kermusesta$b, enkä aio nukkua enää koskaan', hän sanoo, ja nappaa purkista kourallisen kofeiinipillereitä."
  },
  {
    amount: 1,
    durationBase: 3,
    durationRange: 14,
    explanation:
      "$bHän nauttii jääkiekon pelaamisesta tällä hetkellä enemmän kuin mistään muusta, ja se $nnäkyy$b kaukalossa!"
  },
  {
    amount: -1,
    durationBase: 1,
    durationRange: 4,
    explanation:
      "$bHän on saanut tietää olevansa adoptio-lapsi. 'Missä ovatkaan oikeat $nisi$b ja $näiti$b?', hän valittaa."
  },
  {
    amount: 1,
    durationBase: 3,
    durationRange: 6,
    explanation:
      "$bHän on pitkän kolotuksen jälkeen viimein täysin terve, ja uskaltaa laittaa kaiken peliin - ainakin muutaman kierroksen ajan kunnes jokin paikka pettää jälleen..."
  },
  {
    amount: -3,
    durationBase: 1,
    durationRange: 2,
    explanation:
      "$bHänen koiransa repi hänen rakkaimman $npehmolelunsa$b riekaleiksi. '$jNalle$b kuoli, voi voi voi!' pelaaja itkee, imien peukaloaan."
  },
  {
    amount: -5,
    durationBase: 1,
    durationRange: 4,
    explanation:
      "$bHänen viikko sitten $nmyymiltään$b mailta on löydetty timantteja. 'Tämä ei ole mahdollista, ei ole!' pelaaja mutisee kävellen ympyrää."
  },
  {
    amount: 3,
    durationBase: 1,
    durationRange: 4,
    explanation:
      "$bHän on saanut $nmyytyä$b hyvällä hinnalla tontin jonka valtio pian pakkolunastaa rakentaakseen uuden 12-kaistaisen moottoritien! 'Heh heh hee, mahtaapi se kahdeksanlapsinen suurperhe kohta pettyä', mies hykertelee."
  },
  {
    amount: -1,
    durationBase: 2,
    durationRange: 4,
    explanation:
      "$bHänen rakastettu veljensä on alkanut pukeutua hameeseen: ei siinä muuten mitään, mutta tämän seurauksena veli ei enää mahdu $jTurun Trojansien$b jenkkifutisjoukkueeseen."
  },
  {
    amount: -1,
    durationBase: 1,
    durationRange: 1,
    explanation:
      "$bHänen sisarensa on valittu $jNuuksion$b kunnanvaltuustoon. 'Kuten minä, siskoni on $dkommunisti$b. Vielä päivä koittaa jolloin vapaus voittaa!', pelaaja uhoaa nyrkki nostettuna sosialistitervehdykseen."
  },
  {
    amount: -1,
    durationBase: 1,
    durationRange: 5,
    explanation:
      "$bHän on osallistunut $jEpäonnenruudut$b-visailuun ja $nmunannut$b itsensä totaalisesti koko kansan edessä!"
  },
  {
    amount: 1,
    durationBase: 1,
    durationRange: 5,
    explanation:
      "$bHän on osallistunut $jEpäonnenruudut$b-visailuohjelmaan ja osoittanut valtaisaa yleistietoa; mies voitti itselleen lasikipon ja kolmen tuhannen markan arvoisen matkalahjakortin Ruotsinlaivalle. Onneksi olkoon!"
  },
  {
    amount: -2,
    durationBase: 3,
    durationRange: 6,
    explanation: "$bHänellä on ongelmia $nsuorituskykynsä$b kanssa. (?)"
  },
  {
    amount: 2,
    durationBase: 3,
    durationRange: 6,
    explanation:
      "$bHänen avioliittonsa kukoistaa parantuneen $nsuorituskyvyn$b ansiosta (?!)"
  },
  {
    amount: -1,
    durationBase: 1,
    durationRange: 5,
    explanation:
      "$bHän joutui ylellisen elämäntapansa johdosta tekemään shampoo-mainoksen $jOl'Real$b-yhtiölle, joka $nei$b siis ole hyvä juttu."
  },
  {
    amount: 1,
    durationBase: 1,
    durationRange: 5,
    explanation:
      "$bHän on onnistunut $nraamikkaan$b olemuksensa myötä saamaan sopimuksen valokuvaussessiosta $jBugo Hossin$b leivissä."
  },
  {
    amount: -4,
    durationBase: 2,
    durationRange: 5,
    explanation:
      "$bHän on vaipunut $nmasennukseen$b. 'Elämäni on niin $hsynkkää $bja pimeää', pelaaja valittaa."
  },
  {
    amount: 1,
    durationBase: 1,
    durationRange: 4,
    explanation:
      "$bHän on aloittanut treenaamisen TV:stä tutun $jUltimate Gym$b-hilavitkuttimen kanssa."
  },
  {
    amount: -2,
    durationBase: 5,
    durationRange: 8,
    explanation:
      "$bHänen poikansa on päättänyt keskittyä täst'edes vain $njäätanssiin$b, tai rusettiluisteluun kuten pelaaja itse lajin nimeää."
  }
];

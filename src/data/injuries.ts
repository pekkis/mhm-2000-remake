import type { BudgetLevel } from "@/data/mhm2000/budget";
import type { HiredPlayer } from "@/state/player";

/**
 * One injury "card" — the catalog entry, not a player's active
 * injury. Mapped 1:1 from QB `INJURIES.M2K` (45 severity rows) +
 * `I.MHM` (47 text records, last 2 are empty trailing slots).
 *
 * QB picks the injury via `lukka = INT(44*RND)+1` at
 * `ILEX5.BAS:5637` and looks up duration as
 * `loukka(lukka, valb(4, pv))` at `ILEX5.BAS:1259` — `valb(4, pv)`
 * is the manager's medical-budget slider 1..5 (HUOLTOTASO in
 * `LOUKKED.BAS`). The natural roll therefore reaches indices 1..44
 * only; index 45 has data but is unreachable, and indices 46..47
 * are empty trailing slots in I.MHM with no row in INJURIES.M2K.
 *
 * `duration` returning `-1` means **out for the rest of the
 * season** — the QB special-cases this at `ILEX5.BAS:1260` with
 * `IF gnome = -1 THEN lax 115 ELSE lax 116` (different
 * announcement prefix from Y.MHM). Cleared at season rollover.
 *
 * Frequency is NOT part of this catalog: the per-game roll is
 * `vai(4, pv) = 4 + difficulty * 2` % per lineup player and lives
 * with the difficulty config (phase 2 wiring).
 */
export type InjuryDefinition = {
  explanation: (player: HiredPlayer) => string;
  duration: (healthBudget: BudgetLevel) => number;
};

const byBudget =
  (b1: number, b2: number, b3: number, b4: number, b5: number) =>
  (level: BudgetLevel): number =>
    [b1, b2, b3, b4, b5][level - 1]!;

/**
 * The 47 injury slots, in the original QB order (array index +
 * 1 = QB `lukka` id). Texts decoded from cp850 I.MHM with QB
 * color codes (`$b`, `$n`, `$d`, `$j`, `$h`, `$a`) stripped.
 *
 * The texts use the pronoun "Hän" — they don't interpolate the
 * player name. The `player` parameter is kept on `explanation`
 * for the calling layer to prepend `${player.initial}. ${player.surname}`
 * framing if it wants to.
 */
export const injuries: readonly InjuryDefinition[] = [
  // 1 — groin / "Nyt meni isyys ja onni"
  {
    explanation: () =>
      "Kiekko osui häntä kipeästi nivusiin. 'Nyt meni isyys ja onni...voi voi voi', pelaaja valittaa kaksin kerroin maatessaan.",
    duration: byBudget(4, 3, 2, 2, 2)
  },
  // 2 — broken thumb
  {
    explanation: () =>
      "Vastustaja käytti mailaansa viikatteena - naps, hänen peukalonsa murtui.",
    duration: byBudget(7, 6, 6, 5, 5)
  },
  // 3 — mild concussion
  {
    explanation: () =>
      "Jytisevä laitataklaus lähetti hänet unten maille - tulos: lievä aivotärähdys.",
    duration: byBudget(5, 4, 4, 3, 3)
  },
  // 4 — knee tweak
  {
    explanation: () =>
      "Vastustajan taklaus muljautti hänen polveaan pahemman kerran.",
    duration: byBudget(8, 6, 6, 4, 4)
  },
  // 5 — sprained ankle
  {
    explanation: () =>
      "Hänen nilkkansa ei kestänyt äärimmäisen tiukkaa spurttia vastustajan päädyssä, seuraus: venähdys.",
    duration: byBudget(3, 3, 3, 3, 2)
  },
  // 6 — severe concussion
  {
    explanation: () =>
      "Järjetön, järkyttävä laitataklaus lähetti hänet toiseen ulottuvuuteen: vakava aivotärähdys pitää miehen pois kentiltä jonkin aikaa.",
    duration: byBudget(15, 14, 13, 11, 9)
  },
  // 7 — shoulder ('naksuu ja kitisee')
  {
    explanation: () =>
      "Hänellä on ongelmia olkapäänsä kanssa. 'Se naksuu ja kitisee' miekkonen tilittää.",
    duration: byBudget(2, 2, 2, 2, 2)
  },
  // 8 — pulled calf muscle
  {
    explanation: () => "Hänen pohjelihaksensa on sanalla sanoen revähtänyt.",
    duration: byBudget(8, 7, 6, 5, 4)
  },
  // 9 — dislocated jaw
  {
    explanation: () =>
      "Hänen leukaluunsa nyrjähti sijoiltaan armottoman purnauksen seurauksena. 'Huuhen ihah huva hutta hotkut hirjaimet huottavat haikeukhia' pelaaja selittää.",
    duration: byBudget(7, 6, 5, 5, 4)
  },
  // 10 — intimate-area itch
  {
    explanation: () =>
      "Hän kärsii ilkeästä intiimialueiden kutkasta. 'Mistä tällainen kirous on tullut jääköön hämärän peittoon' pelaaja sanoo. 'Mutta oloni on hirveä.'",
    duration: byBudget(2, 2, 2, 1, 1)
  },
  // 11 — confusing virus / can't tell teams apart
  {
    explanation: () =>
      "Hän on sairastunut salaperäiseen, sekavuutta aiheuttavaan virustautiin. Periaatteessa mies on pelikunnossa, mutta joukkueiden erottamisen toisistaan tuottaessa vaikeuksia näet parhaaksi lähettää hänet lasarettiin.",
    duration: byBudget(17, 16, 15, 14, 13)
  },
  // 12 — tennis elbow (from playing tennis, naturally)
  {
    explanation: () =>
      "Hän kärsii tenniskyynerpäästä pelattuaan vapaa-ajallaan liikaa - pystytkö jo arvaamaan??? - aivan oikein, tennistä.",
    duration: byBudget(6, 6, 5, 4, 4)
  },
  // 13 — wrist stiffness
  {
    explanation: () =>
      "Hänen ranteensa on mystisesti jäykistynyt. 'Pitäisiköhän harjoitella lämäriä?' pelaaja pohtii tilannetta.",
    duration: byBudget(9, 8, 7, 6, 5)
  },
  // 14 — full-body sprain from dodgy guru meditation
  {
    explanation: () =>
      "Hän on sairastunut kokokehon yleiseen nyrjähdykseen meditoituaan useiden tuntien ajan vähintäänkin epämääräisen gurun opettamilla metodeilla.",
    duration: byBudget(23, 22, 21, 18, 15)
  },
  // 15 — swollen feet from chitosan diet
  {
    explanation: () =>
      "Hänen jalkansa ovat jostain syystä turvonneet muodottomiksi - lääkäri epäilee liiallisen äyriäiskitosaanilla laihduttamisen ainakin osasyylliseksi tragediaan.",
    duration: byBudget(6, 5, 4, 4, 3)
  },
  // 16 — bruised left side
  {
    explanation: () =>
      "Hän sai kovan tällin vasempaan kylkeensä, ja röhöttää kotisohvalla hirmuisten tuskien runtelemana. 'Oi oi oi oi' hän valittaa.",
    duration: byBudget(4, 4, 4, 3, 3)
  },
  // 17 — puck to the mouth ('hammaflääkäri - fiinä oli fitten faatanallinen')
  {
    explanation: () =>
      "Kiekko osui häntä suuhun, ja toipuminen vie oman aikansa. 'Ei fe ofuma oikefahtaan fattunut, mutta hammaflääkäri - fiinä oli fitten faatanallinen kokemus' mies kertoo.",
    duration: byBudget(7, 7, 6, 6, 5)
  },
  // 18 — severed Achilles tendon (season-ender at low budgets)
  {
    explanation: () =>
      "Hänen akillesjänteensä silpoutui harmittoman oloisessa vahinkotilanteessa. Joukkueen lääkäri pudistaa päätänsä: 'Hänen kautensa on auttamatta pilalla.'",
    duration: byBudget(-1, -1, 48, 45, 42)
  },
  // 19 — broken femur ('Kappas, värejä' — multi-color in QB)
  {
    explanation: () =>
      "Hänen reisiluunsa katkesi, historian kenties jytisevimmän taklauksen infernaalisesta voimasta. 'Kappas, värejä' pelaaja kommentoi sairasvuoteeltaan, tuimassa morfiinitokkurassa.",
    duration: byBudget(41, 40, 39, 38, 37)
  },
  // 20 — multiple pain syndrome from acupuncture
  {
    explanation: () =>
      "Hän on sairastunut multippeliin kipuoireyhtymään. Tohtori epäilee laajamittaisella akupunktiohoidolla olevan osallisuutta syndrooman syntyyn.",
    duration: byBudget(14, 12, 10, 9, 8)
  },
  // 21 — pulled glute
  {
    explanation: () =>
      "Hänen pakaralihaksensa on venähtänyt - ylenmääräinen laitataklailu on vaatinut kauhistuttavan veronsa! 'En pysty edes istumaan' pelaaja kiroaa tilannetta.",
    duration: byBudget(6, 5, 5, 5, 4)
  },
  // 22 — appendicitis
  {
    explanation: () =>
      "Hänen umpilisäkkeensä on tulehtunut, ja se täytyy poistaa välittömästi. 'Minä en selviä tästä. Minä kuolen!', pelaaja itkee.",
    duration: byBudget(3, 3, 3, 3, 3)
  },
  // 23 — swollen brain → replaced with foam (1-game outage, of course)
  {
    explanation: () =>
      "Hänen aivonsa ovat turvonneet niihin kohdistuvan jatkuvan väkivallan johdosta. Hermokudos korvataan jääkiekkoilijoiden ammattitauteihin keskittyneen sairaalan rutiinitoimenpiteessä vaahtomuovilla, eikä monikaan huomaa eroa entiseen.",
    duration: byBudget(1, 1, 1, 1, 1)
  },
  // 24 — coffee ulcer ('Mustana sen juon tästedeskin')
  {
    explanation: () =>
      "Hän on saanut vatsahaavan liiasta kahvin kittaamisesta. 'Mustana olen aina kaffeni juonut, ja mustana sen juon tästedeskin. Vatsahaava ei minua pysäytä!' pelaaja uhoaa sairasvuoteellaan, espressokeittimen poristessa taustalla.",
    duration: byBudget(5, 4, 4, 4, 3)
  },
  // 25 — figure-skating crash-out (3.8, 4.0, 4.2, 4.5, 4.0)
  {
    explanation: () =>
      "Hän lensi ulos kaukalosta yrittäessään laitataklausta. Neloistulp- kolmoisaxel- yhdistelmästä huolimatta pisteitä ei paikalla olleilta taitoluistelutuomareilta herunut (3.8, 4.0, 4.2, 4.5, 4.0). Kenties alastulossa on vielä toivomisen varaa?",
    duration: byBudget(10, 10, 9, 9, 8)
  },
  // 26 — knee folded around the goalpost
  {
    explanation: () =>
      "Hän törmäsi rusahtaen maalitolppaan taittaen polvensa. 'Ei tätä enää kehtaa POLVEKSI kutsua' pelaaja toteaa kyynisesti, ja osoittaa sormella kummallisen näköistä ruumiinosaa jalkansa keskivaiheilla.",
    duration: byBudget(19, 17, 16, 15, 14)
  },
  // 27 — bleeding finger ('Sattuuuu, sattuuuuu!')
  {
    explanation: () =>
      "Hänen sormessaan on vertavuotava haava. 'Sattuuuu, sattuuuuu!', pelaaja huutaa shokissa ja tarpoo pikamarssia sairastuvalle.",
    duration: byBudget(2, 2, 2, 2, 1)
  },
  // 28 — prostate inflammation (Terveisiä Teukkikselle)
  {
    explanation: () =>
      "Jään kalsea kylmyys on saanut hänen eturauhasensa tulehtumaan. 'Kaikki juontaa nuoruudestani', pelaaja selittää lojuessaan lattialla kaksinkerroin. 'Kekkuloin talvella saunan jälkeen ulkona munasillani.' (Terveisiä Teukkikselle)",
    duration: byBudget(3, 3, 3, 3, 3)
  },
  // 29 — first piercing infection
  {
    explanation: () =>
      "Hänen ensimmäinen lävistyksensä on päättynyt surullisesti; korvalehdessä oleva tuore reikä on ruvennut märkimään. 'Tämä leikki loppuu nyt tähän!', pelaaja lupaa huuhdellessaan nikkelikorua alas pöntöstä.",
    duration: byBudget(3, 2, 2, 2, 1)
  },
  // 30 — flu (37 °C "fever")
  {
    explanation: () =>
      "Ankara 37 asteen flunssakuume on painanut hänet vuoteenomaksi. 'On todella voimaton olo' mies voivottelee.",
    duration: byBudget(4, 4, 3, 3, 2)
  },
  // 31 — drank window cleaner instead of sports drink
  {
    explanation: () =>
      "Hän joutui vatsahuuhteluun sekoitettuaan vahingossa urheilujuoma- ja lasinpesunestesammiot toisiinsa. 'Voivoivoivoi', hän itkee lekurin jynssättyä hänen sisuskalunsa puhtaiksi ekstrasuurella vessaharjalla.",
    duration: byBudget(10, 9, 8, 7, 6)
  },
  // 32 — crayfish-party salmonella quarantine (flat 30, budget can't help)
  {
    explanation: () =>
      "Toissakuukautiset rapujuhlat ovat saavuttaneet suuren finaalinsa: tämä mies istuu seuraavan puolivuotiskauden karanteenissa saatuaan puolikypsästä äyriäisestä ankaran salmonellan. 'Lapset, paistakaa ruokanne kypsäksi', hän varoittelee lasisermin takaa.",
    duration: byBudget(30, 30, 30, 30, 30)
  },
  // 33 — green-glowing in hospital (radiology mishap)
  {
    explanation: () =>
      "Hän makaa vihreänhohtoisena sairaalassa. 'Muistan vain, kuinka olin röntgen- laitteessa ja hoitaja lähti kaffelle', hän muistelee. 'Ja puff, seuraavaksi minulle annetaan sydänhierontaa.'",
    duration: byBudget(8, 7, 6, 5, 4)
  },
  // 34 — Spelstatzion / Ronadlok thumb tendinitis
  {
    explanation: () =>
      "Ilkeä jännetuppitulehdus on halvaannuttanut hänen molemmat peukalonsa; mies on pelannut liikaa Spelstatzionillansa. 'Pelasihan Ronadlokin', hän yrittää puolustella tekosiaan.",
    duration: byBudget(3, 2, 2, 2, 2)
  },
  // 35 — bungee jump from a Sweden ferry, no rope
  {
    explanation: () =>
      "Hän on suorittanut samulit: benjihypyn ruotsinlaivalta ilman köyttä. Sääli vain, että tämän seurauksena mies on vilustuttanut itsensä pahasti.",
    duration: byBudget(5, 5, 4, 3, 3)
  },
  // 36 — voluntary trip to Tiukukoski (psychiatric, flat 9)
  {
    explanation: () =>
      "Hän on lähtenyt omaehtoisesti Tiukukoskelle tarkkailtavaksi huomattuaan omien sanojensa mukaan itsessään 'joitakin varsin jännittäviä piirteitä'.",
    duration: byBudget(9, 9, 9, 9, 9)
  },
  // 37 — Ultimate Gym / Nuck Chorris infomercial mishap
  {
    explanation: () =>
      "Hän on satuttanut itsensä pahasti treenattuaan TV:stä tutulla Ultimate Gym - hilavitkuttimella. 'Sillä Nuck Chorriskin treenaa' pelaaja puolustelee menettelyään.",
    duration: byBudget(13, 12, 11, 10, 9)
  },
  // 38 — long hair caught in bus door
  {
    explanation: () =>
      "Hänen päänahassaan on vakava rasitusvamma: miehen pitkä tukka jäi linja-auton oven väliin hänen yrittäessään poistua kyseisen ajoneuvon kyydistä.",
    duration: byBudget(5, 4, 3, 3, 3)
  },
  // 39 — Pukukoppikamera reveal (flat 7, budget can't fix shame)
  {
    explanation: () =>
      "Surullisenkuuluisa Pukukoppikamera on iskenyt jälleen: mies lymyilee kotonaan ohjelman paljastettua hänen intiimialueensa koko kansalle. 'En tule ulos enää ikinä, se on vissi ja varma', pelaaja kuiskaa komeron perukoilta.",
    duration: byBudget(7, 7, 7, 7, 7)
  },
  // 40 — cabbage-roll cult diarrhea (the GURU's diet)
  {
    explanation: () =>
      "Hän kärsii akuutista ripulista: omituinen uskonlahko, johon pelaaja kuuluu, on käskenyt seuraajiaan syömään vain ja ainoastaan kaalikääryleitä seuraavan seitsemän kuukauden ajan. 'Ei hätiä mitiä, kyllä se tästä', pelaaja sanoo kaikesta huolimatta iloisena. 'Elimistöni pitää vain sopeutua GURUN viisaaseen ruokavalioon.'",
    duration: byBudget(6, 6, 6, 6, 5)
  },
  // 41 — mental breakdown after breakup (always season-ending)
  {
    explanation: () =>
      "Hän on romahtanut henkisesti pitkäaikaisen ihmissuhteen päätyttyä kirpaisevaan eroon, eikä pysty kuin pötköttämään pitkällään joko psykiatrin sohvalla tai kotona kymmenien vällyjen alla.",
    duration: byBudget(-1, -1, -1, -1, -1)
  },
  // 42 — clean-hit ulna fracture (always season-ending)
  {
    explanation: () =>
      "Vaikka häneen kohdistunut taklaus olikin täysin puhdas, ei miehen kyynärluu kestänyt syntynyttä painetta...naps, sen murtuminen on tosiasia.",
    duration: byBudget(-1, -1, -1, -1, -1)
  },
  // 43 — post-concussion syndrome (always season-ending)
  {
    explanation: () =>
      "Hän löi päänsä ilkeästi laitapleksiin, ja kärsii vakavasta aivotärähdyksen jälkitilasta... paluu kentille on kaukana tulevaisuudessa massiivisen kuntoutuksen takana, lääkäri toteaa puistellen päätään surullisena.",
    duration: byBudget(-1, -1, -1, -1, -1)
  },
  // 44 — PELAAJAN HOITELU victim-side. Prank #5 in JAYNAT.M2K
  //      (costs 70 000 mk). Forced at `ILEX5.BAS:2199`
  //      (`lukka = 44 : dap 1`) on a random lineup player of the
  //      team that was targeted by this prank. The flag travels as
  //      `jaynax(5, u(pv))` (team-index slot) and is resolved in
  //      `SUB jaynacheck` block 2. Not reachable from the
  //      post-match `INT(44*RND)+1` roll.
  {
    explanation: () =>
      "Joukko epämääräisiä gangstereita mukiloi hänet lunastuskuntoon käyttäen pesäpallo- ja sählymailoja. 'Kosta... kauhea... kohtaloni', pelaaja örisee vaihteeksi puoliksi tajuissaan.",
    duration: byBudget(14, 13, 12, 11, 10)
  },
  // 45 — POLIISI enforcer victim-side. Forced at `ILEX5.BAS:2209`
  //      (`lukka = 45 : dap 1`) on a random lineup player of the
  //      team that had an opposing enforcer (spe = 666) ordered
  //      against them. The flag travels as `jaynax(5, pv)`
  //      (manager-index slot, set at `ILEX5.BAS:2183`) and is
  //      resolved in `SUB jaynacheck` block 3. The enforcer
  //      himself eats a 7-game ban (ban code 17, PELKIEL.M2K).
  //      Not reachable from the post-match `INT(44*RND)+1` roll.
  {
    explanation: () =>
      "Vastustajan kolossimainen poliisi rusikoi hänet kuutioksi edellisen pelin kuumassa loppuratkaisussa. 'Äijä oli pikkuisen isompi kuin minä', pelaaja kertaa illan tapahtumia.",
    duration: byBudget(10, 9, 8, 7, 5)
  },
  // 46 — DEAD SLOT. I.MHM record 46 is empty (zero bytes of text)
  //      and INJURIES.M2K has no row for it. Included for parity
  //      with the I.MHM record count; never reachable.
  {
    explanation: () => "",
    duration: () => 0
  },
  // 47 — DEAD SLOT. Same story as 46 — empty I.MHM record, no
  //      severity row. Trailing leftover, possibly editor scratch.
  {
    explanation: () => "",
    duration: () => 0
  }
];

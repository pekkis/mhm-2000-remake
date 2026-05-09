/**
 * Ban definition — one of 18 pelikielto (game suspension) types.
 * Data from PELKIEL.M2K (durations) + PK.MHM (cp850-decoded narrative text).
 *
 * QB source: `dap` CASE 2 (ILEX5.BAS:1262-1266).
 * Duration is a static per-ban-code lookup: `gnome = pelki(lukka)`.
 * Stored on player as `inj = duration + 1000` (sentinel range 1001..1999).
 * Countdown: per turn `inj -= 1`; when `inj = 1000` → clears to 0.
 *
 * Triggers:
 *   - Post-match random roll (5% chance): codes 1–16 uniform random
 *     (ILEX5.BAS:5649-5650)
 *   - POLIISI prank (spe=666 enforcer): code 17 always
 *     (ILEX5.BAS:2183-2186)
 *   - Aggressive specialty (spe=2) + captain (ket>0): code 18, 2% chance
 *     (ILEX5.BAS:2190)
 */
export type BanDefinition = {
  /** Ban duration in rounds/games. QB `pelki(code)` from PELKIEL.M2K. */
  duration: number;
  /** Ban narrative text from PK.MHM, cp850 → UTF-8. QB color tokens converted to Markdown (bold/italic). */
  explanation: string;
};

/**
 * 18 ban definitions extracted from PELKIEL.M2K + PK.MHM.
 *
 * Codes 1–16: reachable via post-match random roll (`INT(16*RND)+1`).
 * Code 17: POLIISI prank enforcer path only.
 * Code 18: aggressive captain (spe=2 + ket>0) path only.
 */
export const banDefinitions: readonly BanDefinition[] = [
  {
    duration: 6,
    explanation:
      "Hän sai äkillisen raivokohtauksen kentällä, ja **keihästi** vastustajan melkolailla törkeästi. **Ilta-Pekkis** nimeää hänet 'Aikamme Gladiaattoriksi'."
  },
  {
    duration: 4,
    explanation:
      "Hän potkaisi vastustajaa rumasti **nivusiin**. 'Maatalousoppilaitokseen kastroitavaksi tuollainen sika', uhoaa **Ilta-Pekkis**."
  },
  {
    duration: 3,
    explanation:
      "Hän **sylkäisi** mällipaakkunsa erotuomarin silmään. 'Vahinkoja sattuu, mutta pitääkö ihmistä rankaista niistä?', hän ihmettelee."
  },
  {
    duration: 1,
    explanation:
      "Hän otti yhteen vastustajan kovanaaman kanssa pelirangaistuksen arvoisesti. 'Ja sain vielä **turpaani**', pelaaja harmittelee."
  },
  {
    duration: 1,
    explanation:
      "Hänen krediittinsä kymppien suhteen ovat loppuneet, ja automaattisena seuraamuksena hänen ylleen lankeaa **pakkoloma**."
  },
  {
    duration: 4,
    explanation:
      "Hän syyllistyi todella rumaan laitataklaukseen. 'Puhdas kuin vauvan **peppu**', kommentoi pelaaja tapahtumaa harteitaan kohauttaen."
  },
  {
    duration: 7,
    explanation:
      "Hänen paikallisen hammaslääkärin sponsoroima nyrkkinsä heilui taas kerran, lennättäen **purukalustoa** elämännesteen kera joka puolelle kaukaloa! 'Sain kenties pelikiellon', pelaaja toteaa, 'mutta bonukset ovat melkomoiset!'"
  },
  {
    duration: 2,
    explanation:
      "Hän taklasi viheliäisesti viheltäneen tuomarin vasten päätypleksiä, mikä oikein sille lasisilmälle olikin. Suihku kutsui miekkosta valtavien **aplodien** saattelemana."
  },
  {
    duration: 1,
    explanation:
      "Hän **läväisi** vastustajan maalivahtia mailalla päähän ankaran maalinedustalla tapahtuneen väännön jälkeen. 'Se löi minua ensin sääreen', pelaaja puolustelee tekoaan."
  },
  {
    duration: 1,
    explanation:
      "Tuomarin aina-niin-valppaat **lasisilmät** näkivät hänen otteissaan jotain mätää: raitapaita lätkäisi mukavan 2+5+20 minuutin jäähyn ties kuinka monesta samanaikaisesta vakavasta rikkeestä. 'Mitä mä oikein tein?', hämmentynyt pelaaja ihmettelee."
  },
  {
    duration: 2,
    explanation:
      "Vastustajan vikkeläkinttuinen hyökkääjä onnistui väistämään jytisevän taklauksen, tuomari valitettavasti ei. Vaikka kyseessä olikin puhdas vahinkotilanne, päätti tuomari **kostonhimossaan** passittaa pelaajan pukukopin puolelle."
  },
  {
    duration: 15,
    explanation:
      "Hän kävi vastustajan managerin kimppuun kesken pelin! Poliisi kärräsi miehen putkaan, ja hänen pelinsä ovat hetkeksi aikaa pelattu. Vastustajan manageri kommentoi: 'Täysin järjetön aggressio minua kohtaan. Onneksi järjestysmiehet pelastivat **henkeni**, elämäni rullasi jo filminä silmissäni!'"
  },
  {
    duration: 3,
    explanation:
      "Hänen pelihanskastaan löytyi rutiinitarkastuksessa hevosenkenkä. 'Lisäämään peliesitysten **painoarvoa**', pelaaja selittää sinulle nolona."
  },
  {
    duration: 1,
    explanation:
      "Mies pelasi jatkuvasi kuin mikäkin sika, ja sai lopulta ansionsa mukaan: 5 minuuttia väkivaltaisuudesta ja päälle **pelirangaistus**."
  },
  {
    duration: 13,
    explanation:
      "Hän takoi vastustajan vielä juniori-ikäisen pelaajan teho-osastolle keräämään voimia. Vastustajan manageri kommentoi: 'Sairasta. Vankilaan moinen **sosiopaatti**'. Pelaaja itse ei muista tapahtumista yhtään mitään, ja lähtee oma-aloitteisesti kärsimään pelikieltoaan **Tiukukoskelle**. 'En tiedä, mikä minuun meni', hän sanoo vilpittömästi pahoillaan tapahtuneesta."
  },
  {
    duration: 4,
    explanation:
      "Heti ottelun alusta kismaa alkoi kasaantua hänen ja erään vastustajan välille. Toisen erän puolivälissä tappelu lähetti kumpaisenkin suihkun puolelle, mutta tämäpä ei pojille riittänyt: he päättivät jatkaa **mittelöään** pukuhuoneessa. **Ilta-Pekkiksellä** on jälleen jytylööppi! (perustuu tositapahtumiin, Mal Davis #17 tule takaisin)"
  },
  {
    duration: 7,
    explanation:
      "Hän **rusikoi** erään vastustajan pelaajan vuodeosastolle lepäämään. Vastustajan manageri kommentoi: 'Tämänkaltainen ylhäältä kontrolloitu vastustajan tarkoituksellinen satuttaminen on saatava loppumaan. Toivon pelaajayhdistyksen puuttuvan asiaan välittömästi ja armottomasti.'"
  },
  {
    duration: 3,
    explanation:
      "Hän ei sanalla sanoen juurikaan pitänyt ottelun tuomarista, ja päätti lopulta avata **sanallisen** arkkunsa: '(sensuroitu) (sensuroitu)'"
  }
];

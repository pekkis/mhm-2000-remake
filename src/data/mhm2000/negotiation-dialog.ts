/**
 * Player dialog lines for contract negotiations.
 * Port of QB S4.MHM data file — `lentti 4, sano%` calls.
 *
 * QB markup → Markdown:
 *   $b → normal text (QB "bold white")
 *   $n → **bold** (QB yellow highlight on an emphasized word)
 *   $f → *italic* (QB dark-yellow, used for humorous / coarse words)
 *   @6 → @managerName placeholder (QB: current manager's name)
 *
 * Each key has exactly 6 variants (QB picks with `INT(6 * RND) + 1`).
 */

export type NegotiationDialogKey =
  | "refused" // sano%=1  — player refuses to negotiate (a <= -4)
  | "alreadyNegotiated" // sano%=2  — already talked this round (neu=1)
  | "unhappy" // sano%=3  — displeased but willing (-4 < a < -1)
  | "neutral" // sano%=4  — slight reservations (a = -1)
  | "happy" // sano%=5  — happy to negotiate (a = 0)
  | "nhlHint" // sano%=6  — NHL aspirations add-on (eligible + duration met)
  | "openingLine" // sano%=7  — first-round opening (d = 0)
  | "rejection" // sano%=8  — standard "not enough" rejection
  | "veryImpatient" // sano%=9  — sopimus(2) < 30, near walkout
  | "impatient" // sano%=10 — sopimus(2) < 50, patience fading
  | "acceptedOk" // sano%=11 — accepted normally (gnome=2)
  | "acceptedHappy" // sano%=12 — accepted very happily (gnome=3)
  | "freeFireComplaint" // sano%=13 — complains about free-fire clause
  | "zombieSound"; // sano%=14 — zombie / greedySurfer

export const negotiationDialog: Record<
  NegotiationDialogKey,
  readonly [string, string, string, string, string, string]
> = {
  refused: [
    "Kuules nyt, hyvä herra... En näe syytä saapua neuvotteluun, sillä en pysty näkemään itseäni joukkueessanne vaikka **mikä** olisi...",
    "On turhaa jatkaa keskustelua — haukkaisin ennemmin hatullisen *paskaa* kuin liittyisin joukkueeseenne...",
    "Olen pahoillani, mutta en ole valmis **edes** neuvottelemaan kanssanne sopimuksesta — joukkueessanne on nähdäkseni jotain mätää.",
    "Ette voi olla **tosissanne**? Te siis luulette, että minä voisin pelata joukkueessanne? Mitä te minua oikein pidätte, herra manageri? Kuulemiin.",
    "Maailmasta ei löydy tarpeeksi **mammonaa**, joka saisi minut harkitsemaan saapumista neuvotteluihin... En pidä teistä enkä joukkueestanne.",
    "En halua neuvotella kanssanne. Valitan, mutta sekä minä että te ainoastaan **hukkaisimme** aikaamme. Kenties ensi vuonna?"
  ],

  alreadyNegotiated: [
    "Juurihan soititte minulle, tiedustellen **samaa** asiaa. Lopettakaa heti, päätäni alkaa pian särkeä!",
    "Te ette sitten vähällä usko, vai? En ole valmis **jankkaamaan** samaa asiaa uudestaan ja uudestaan, ottakaa yhteyttä myöhemmin!",
    "Taas te? En ole valmis unohtamaan edellisen neuvottelutuokiomme **kariutumista**, ainakaan vielä... soitelkaa myöhemmin, kiitos.",
    "Mitä **pirua**? Älkää vainotko minua, tai hankin teille lähestymiskiellon. Olen tupaten täynnä neuvotteluja, ottakaa yhteys myöhemmin?",
    "Tämä on automaattinen puhelinvastaajani. Olen **uupunut** intensiivisistä neuvotteluista, soittakaa huomenna uudelleen.",
    "Olen imarreltu **jatkuvasta** kiinnostuksestanne, mutta haluan välillä levätäkin... Soittakaa myöhemmin uudelleen."
  ],

  unhappy: [
    "Heh, vai että **sopimusta**? En usko teidän voivan tarjota minulle mitään mainitsemisen arvoista, mutta kalenterissani on tyhjää, joten tarjoan teille mahdollisuuden esittää asianne — kunhan teette sen nopeasti.",
    "Puhun suoraan: koska minulla on aikaa, saavun neuvotteluihin, mutta jos haluatte nimeni papereihin, saatte luvan tarjota **kuuta** taivaalta.",
    "Enpä voisi sanoa, että liittyminen joukkueeseenne erityisesti **kiinnostaisi**, mutta tulenpahan neuvotteluihin... varaa kaffetta ja pullaa.",
    "Epäilen vahvasti neuvottelujemme **kariutuvan**, mutta tokihan aina neuvotella voi... ilmoitanpa vain heti kättelyssä, etten pidä organisaatiostanne.",
    "Kaipa minä voisin tulla, jos tietyt **reunaehdot** toteutuvat... Kuten se, että te maksatte taksin? Epäilen nimittäin vahvasti, etteivät neuvottelumme johda näkyviin tuloksiin.",
    "Jaa-a... En oikein tiedä... Toisaalta joukkueenne maine on varsin ikävä, mutta toisaalta **suurseurat**kin ovat olleet kovin hiljaa... Noh, josko kuitenkin vaivautuisin luvassa olevasta pettymyksestä huolimatta paikalle..."
  ],

  neutral: [
    "Tottahan toki saavun ehdottamiinne neuvotteluihin... vaikka organisaatiossanne onkin **parantamisen** varaa, ovat olosuhteet kelvolliset ja peliaikaakin pitäisi löytyä. Tapaamisiin!",
    "Ehdotuksenne ei ole kyllä **parhaimmasta** päästä, mutta silti parempi kuin muut huomiseksi sopineeni. Voitte odottaa minua saapuvaksi.",
    "Muutama yksityiskohta kieltämättä **mättää**, mutta uskon että pystymme ratkomaan ne jos tahtoa riittää... Puhukaamme lisää paikan päällä?",
    "Hmmm... kuulostaa, jos ei hyvältä niin ainakin **mielenkiintoiselta**. Tietyt piirteet toiminnassanne eivät toki miellytä minua, mutta kaikkea ei kai voi saadakaan... Voitte odottaa minua.",
    "Vaikka omaankin muutamia **ennakkoluuloja** organisaatiotanne kohtaan, olen valmis kuulemaan josko pystyisitte oikaisemaan mielipiteitäni?",
    "Ilman muuta saavun keskustelemaan kanssanne, huolimatta huhupuheista joita markkinoilla organisaatiostanne liikkuu. Toivottavasti pystytte kumoamaan ilkeät juorut, sillä pelipaikka joukkueessanne ei tunnu lainkaan **huonolta** ajatukselta."
  ],

  happy: [
    "Kieltämättä **houkutteleva** ehdotus, enkä näe esteitä yhteisymmärryksen syntymiselle. Varatkaa rahaa ja pelipaita numerolle 99 valmiiksi.",
    "Vastaan kysymykseenne kysymyksellä: miksi **EN** olisi valmis neuvottelemaan? Sanokaa vain paikka ja aika, niin saavun.",
    "Vaikka ydinvoimala räjähtäisi täyttäen maan säteilyllä, vaikka sataisi metrisiä rakeita, vaikka maa järisisi — voitte olettaa minun saapuvan ajallani neuvotteluun!",
    "Neuvottelemmeko **meillä** vai **teillä**? Mikä tahansa paikka on yhtä hyvä, sillä voin tunnustaa olevani varsin kiinnostunut.",
    "Neuvottelemmeko **nyt** vai heti? Mitä pikemmin, sen parempi, sillä uskon sopimuksen syntyvän alta aikayksikön!",
    "Vain **viisi** pientä minuuttia, ja olen siellä. ...tuut tuut tuut..."
  ],

  nhlHint: [
    "Tahtoisin muistuttaa herra manageria siitä, että tähtään edelleen NHL-kentille... Tehkää omat johtopäätöksenne.",
    "Tähdennän sitä, että tähtään Rapakon takaisille kunnian kentille, enkä ole sitä myöten valmis sitoutumaan pitkäksi aikaa.",
    "Muistakaa tarjouksia tehdessänne, että tähtään yhä NHL-jäille.",
    "Aikomuksenani ei ole pelata koko uraani Euroopassa... Pitäkää tämä mielessänne.",
    "Aion suunnata Amerikkaan niin pian kuin vain suinkin uskallan... Ymmärtänette, mitä tarkoitan?",
    "Vaikka suostuinkin neuvottelupöytään kanssanne, on NHL perimmäinen tavoitteeni... haluan vain, että tiedätte tämän."
  ],

  openingLine: [
    "Olen valmis ottamaan vastaan tarjouksenne...",
    "Anti tulla tarjousta, herra manageri... olen valmis kuuntelemaan.",
    "Kertokaa mietteenne, herra manageri... minä kuuntelen.",
    "Läväyttäkää pöytään paras tarjouksenne, kuuntelen korvat höröllä!",
    "Betainen kontrahti tänne näin — olen valmistautunut tarjouksiinne.",
    "Aloittakaamme neuvottelut, herra manageri."
  ],

  rejection: [
    "En voi hyväksyä sopimusehdotustanne **nykymuodossaan**. Teidän on pystyttävä parempaan, jos tahdotte nimimerkkini kontrahtiin.",
    "Viekää **lippulappusenne** pois ja keksikää jotain parempaa — tuollaisenaan en kontrahtiin nimeäni pistä.",
    "Ei onnistu, ei sitten millään. Tehkää tarvittavat **muutokset** ja katsotaan sitten uudestaan.",
    "Ei, ehdotuksenne ei ole **riittävän** miellyttävä. Kenties takataskussanne on parempaakin?",
    "Ilman muuta... **EI**. Voitte yliviivata ehdotuksestanne... hmm... tuon, tuon ja tuon. Uutta tarjousta pöytään, kiitos.",
    "Ei **kelpaa**. Parempaa on syytä olla luvassa, jos mielitte minua joukkueeseenne."
  ],

  veryImpatient: [
    "Pidättekö minua **aivokääpiönä**? Tämä neuvottelu loppuu tähän, ja naurettavat tarjouksenne voitte tunkea vaikka takapuoleenne.",
    "Ilmeisesti neuvottelukutsunne tarkoitus oli tehdä minusta **pilkkaa**. Toivonpa, että pilkka osuu vielä omaan nilkkaanne!",
    "Heh heh heh — vaikka tilanne onkin sinänsä **vakava**, en voi olla nauramatta tarjouksellenne. Kiitos kaffesta, näkemiin ja hyvää päivänjatkoa!",
    "Jaahas, tämä taitaakin **riittää** tältä päivältä. Jos olisin arvannut neuvottelun sujuvan tällä tavalla, olisin jättänyt tulematta.",
    "Oletteko ainoastaan **tyhmä** vai loukkaatteko minua tahallanne? Samapa se, neuvottelu loppuu kuitenkin tähän.",
    "Saanen puhua suoraan: tarjouksenne haisevat **pahalle**. Itse asiassa ne haisevat niin pahalle, että taidan lähteä samantien kotiin."
  ],

  impatient: [
    "En usko, että neuvottelun jatkuminen toisi **muutosta** tilanteeseen: vaatimukseni eivät miellytä teitä, eivätkä tarjouksenne miellytä minua. Siksipä onkin hyvä lopettaa tähän.",
    "Mielestäni emme ole **edenneet** vähään aikaan suuntaan taikka toiseen, joten näen parhaaksi kieltäytyä sopimuksesta.",
    "En epäile hyviä **tarkoitusperiänne** tai haluanne päästä molempia tyydyttävään lopputulokseen, mutta siitä huolimatta en suostu hyväksymään tarjouksianne.",
    "Olette kova kauppamies, mutta ette **riittävän** kova. En jaksa enää kiistellä mitättömistä yksityiskohdista kauempaa, vaan lähden kotiin.",
    "Olen nähnyt **tarpeeksi**: näkemyksemme eivät kohtaa toisiaan. Kenties on parempi lopettaa keskustelu ennen kuin negatiiviset tunteet nousevat pintaan.",
    "On ollut **miellyttävää** neuvotella kanssanne, mutta tarjouksenne eivät ole vakuuttaneet minua missään vaiheessa. Siksipä näenkin parhaaksi sanoa lopullisesti ei."
  ],

  acceptedOk: [
    "Olisin kieltämättä **toivonut** parempaa sopimusluonnosta, mutta kaikesta huolimatta olen päättänyt hyväksyä ehtonne. Ojentakaa sopimus, niin raapustan siihen puumerkkini.",
    "Olette taitava neuvottelija, @managerName. Tullessani tänne olin varma neuvottelun päättyvän ikävästi, mutta yllätitte minut positiivisella tavalla. Hyväksyn ehdotuksenne.",
    "Olen päättänyt **hyväksyä** ehtonne, mutta tähdennän että teen sen pitkin hampain epäsuotuisten olosuhteiden uhrina. Ojentakaa kontrahti, ennen kuin muutan mieleni.",
    "Olette periksiantamaton jankkaaja enkä ole täysin tyytyväinen ehtoihinne, mutta hyväksyn **silti** sopimuksenne. Miksi, sitä en osaa sanoa, mutta silti.",
    "Hyvä on, hyvä on! Lopettakaa örjyntänne tai pääni hajoaa. Tänne se kontrahti ja vähän **äkkiä**, minua pyörryttää.",
    "Noh, ei tämä nyt **aivan** ole sitä, mitä toivoin, mutta ilkeä taktiikkanne puree: ilmastoinnin kääntäminen pois päältä on kypsyttänyt minut ja olen valmis allekirjoittamaan."
  ],

  acceptedHappy: [
    "Kynä... valtakunta ja puoli prinsessaa kynästä! Kontrahti tänne ja sassiin, tahdon **allekirjoittaa** sen!",
    "Jii-haa! Hyvä manageri, olette juuri **onnistuneet** uuden pelaajan rekrytoinnissa. Ojentakaa sopimus.",
    "Hyväksyn tarjouksen, enkä häpeä myöntää että teen sen enemmän kuin mielelläni.",
    "En koe jatkoneuvotteluille olevan enää tarvetta, sillä olette ollut erittäin vakuuttava ja **hyväksyn** ehtonne.",
    "Hyvä manageri, saatte mitä **haluatte**... nimeni kontrahtiin. Kiitän kumartaen, ja liityn suurella ilolla ryhmäänne.",
    "Herra manageri, olemme päässeet **harmoniaan** ja saavuttaneet yhteisymmärryksen. Ojentakaa kontrahti sekä mustekynä."
  ],

  freeFireComplaint: [
    "Ymmärtänette, että työpaikkani vakauden kannalta ikävä pykälä vaatii **kompensaatiota** muodossa taikka toisessa?",
    "Onko teidän pakko **tuputtaa** minulle ärsyttäviä lisäpykäliänne?",
    "En suoraan sanottuna pidä ehdottamastanne **pykälästä**, joka mahdollistaa työsuhteen äkillisen loppumisen.",
    "Kirottu olkoon ehdottamanne **sopimuspykälä**... jos haluatte minun hyväksyvän sopimuksen, maksakaa enemmän.",
    "Ettekö luota **taitoihini**, vai miksi vaaditte vapaan irtisanomisen mahdollistavaa pykälää?",
    "Luuletteko, että hyväksyn ajamanne **fasistisen** lisäpykälän näin helpolla? Ei, ei, ja vielä kerran EI."
  ],

  zombieSound: [
    "Öööööhhh... gurgl, bargl... aaaaaahrf",
    "Aaaaahhhh.... gröööönt.... hröööööt....",
    "Äöörg... gröön... bl bl bl bl... aaah",
    "Ööööörg... ööööörg... ööööörgh... aaaargh...",
    "Gruuuh... yyyyh... zzzzzz... bröööt",
    "Pröööt... ööööööööööööööööög... aaaaaaaaaaaaaaaaaaaaagh"
  ]
};

/**
 * Pick a dialog line using a pre-rolled variant index (0..5).
 * @managerName is substituted if present; defaults to "herra manageri".
 */
export function getDialogLine(
  key: NegotiationDialogKey,
  variant: number,
  managerName = "herra manageri"
): string {
  return negotiationDialog[key][variant].replace("@managerName", managerName);
}

/**
 * Ported from `DATA/KR.MHM` (cp850 → UTF-8). 35 records, 1-indexed
 * to match QB's `lt "kr", N` addressing (1-based: `GET #1, 1 + (N-1)*500`).
 *
 * Original `$X` color tokens are converted to markdown:
 *   `$j…$b` → `**…**` (bold — yellow highlights: names, emphasis)
 *   `$n…$b` → `*…*`   (italic — red emphasis)
 *   `$f…$b` → `**…**` (bold — white numbers/stats)
 *   Bare `$b` at line start (default text color) → stripped
 *
 * Template placeholders:
 *   `@1` → `{captainName}` (or `{egoPlayerName}` in ego-player scenes,
 *          since QB's `xx` is overwritten by `SUB al`)
 *   `@7` → `{randomTeammateName}`
 *
 * IMPORTANT: KR.MHM record indexing is correctly 1-based. The
 * CRISIS-MEETING.md decode's claimed off-by-one bugs are wrong —
 * all 35 records align with the code. Verified 2025-05-15.
 */

const crisisMeetingTexts: Record<number, string> = {
  // ── No-captain bail-out (lt "kr", 0 + kurso) ──────────────────
  // kurso=1: meeting without captain
  1: "Kapteenin puutteen ei voi ainakaan sanoa EDISTÄVÄN joukkueen sisäistä hyvinvointia... Kriisipalaverisi jää tuloksettomaksi jo tältäkin pohjalta.",

  // kurso=2: dry sauna without captain
  2: "Joukkueeltasi puuttuu jotain tärkeää - kapteeni nimittäin. Pelaajat kritisoivat saunaillassa omalaatuista johtamistoimintaasi varovaisin äänensävyin.",

  // kurso=3: wet sauna without captain (@7 = random teammate)
  3: "Alkoholi saa pelaajiesi estot häviämään, ja kohtaat säälimätöntä kritiikkiä ja piruilua. **{randomTeammateName}** kiteyttää yleisen mielipiteen näin: 'voitko sinä pälliaivo olla ihan hiljaa, ja nimittää *kapteenin* jotta me pääsemme ratkomaan ongelmamme ihan vaan keskenämme.'",

  // ── Option 1: KRIISIPALAVERI ───────────────────────────────────
  // Setup (lt "kr", 4)
  4: "Kokoat joukkueen harjoitusten jälkeen pukukoppiin. Kapteeni **{captainName}** saapuu luoksesi, tiedustellen mistä on kysymys. Selität tilanteen, ja mies kertoo olevansa samaa mieltä. 'Poijaat, tällainen peli ei vetele!', aloitat raivoamisen kapteenisi tukemana.",

  // Success (lt "kr", 5)
  5: "Palaverin jälkeen paineet joukkueen sisällä helpottavat hieman, ja keskittyminen seuraavaan otteluun jatkuu onnellisempien tähtien alla.",

  // Failure (lt "kr", 6)
  6: "Kapteenisi ja sinun pitkä puheenvuoro ei vakuuta joukkuetta *laisinkaan*. Tilanne ei muutu suuntaan eikä toiseen, vaan valmistautuminen seuraavaan otteluun jatkuu apaattisissa merkeissä.",

  // ── Option 2: ALKOHOLITON SAUNAILTA — intro ───────────────────
  7: "Vuokraat saunan, tilaat bussin ja roudaat joukkueellisen enemmän tai vähemmän *karvaisia* miehiä nauttimaan löylyn antimista. Seuraavassa tiivistelmä illan tapahtumista:",

  // ── Option 3: KALJAHUURUINEN SAUNAILTA — intro ────────────────
  8: "Vuokraat saunan, tilaat bussin ja varmistat kaljarekan turvallisen telakoitumisen saunarakennukseen. Joukkueellinen karvaisia karjuja on valmis juomaan päänsä täyteen ja nauttimaan löylystä. Seuraavassa tiivistelmä illan tapahtumista:",

  // ── Option 2: captain FAILURE pool (lt "kr", INT(3*RND) + 9) ──
  9: "Joukkueen kapteeni, **{captainName}**, lukittautuu lasten osastolle eikä suostu tulemaan pois. 'Menkää pois, en *kestä* enää tällaista painetta!' hän huutaa sinulle oven läpi yrittäessäsi maanitella häntä muiden joukkoon.",

  10: "**{captainName}**, joukkueen kapteeni, vajoaa yllättäen *sikiöasentoon* kesken saunaillan. 'En halua olla kapteeni enää!' hän itkee. 'Vastuu on minulle liikaaaaaaaa!'",

  11: "Joukkueen kapteeni, **{captainName}**, istuu koko illan pukuhuoneen puolella yksinään. 'Olen niin *yksin* näiden kauheiden vaikeuksien keskellä', hän sanoo, ja pudistaa päätään. 'En taida jaksaa enää, ota kapteenius pois minulta tai laita minut myyntilistalle.'",

  // ── Option 2: captain SUCCESS pool (lt "kr", INT(3*RND) + 12) ─
  12: "Joukkueen kapteeni **{captainName}** on illan aikana elementissään: hän kulkee ympäriinsä rohkaisten joukkuetovereitaan ja luoden uskoa tulevaisuuteen!",

  13: "**{captainName}**, joukkueen kapteeni, tekee illan mittaan parhaansa poistaakseen ahdistuksen ja tuskan joukkuetovereidensa mielestä. Havaintojesi mukaan hän onnistuu siinä varsin mainiosti!",

  14: "Joukkueen kapteeni **{captainName}** on kysytty mies illan mittaan: joukkuetoverit purkavat *paineita* jutustelemalla hänen kanssaan. Mies nostaa peukalonsa osoittamaan kohti kattoa kävellessään ohitsesi.",

  // ── Option 2: manager performance (lt "kr", 15/16/17) ─────────
  15: "Oma esiintymisesi jää upeista puitteista huolimatta hyvin valjuksi. Yrität rohkaista poikia *mahtipontisella* puheella, mutta senat menevät sakaisin suussasi ja lopputulos on jotain aivan muuta kuin haluamasi. Omalaatuinen spektaakkeli aiheuttaa joukkueen keskuudessa vaimeaa mutinaa.",

  16: "Oma osuutesi, *kiihkomielinen* historiallisia totuuksia kajautteleva kannustuspuhe, onnistuu nappiin. Pelaajasi ovat puheesi jälkeen valmiita vaikkapa vyöryttämään johdollasi Karjalan kannaksen!",

  17: "Oma osuutesi, kannustava puhe, ei nouse *aatumaisiin* sfääreihin muttei kyllä pilaa pienestä onttoudestaan huolimatta tunnelmaa. Saat kohteliaat, lyhyet aplodit spektaakkelin päätteeksi.",

  // ── Option 2: ego player no-show (lt "kr", INT(3*RND) + 18) ───
  18: "**{egoPlayerName}** jättää saapumatta saunailtaan, mutta kännykkäsi piippaa tekstiviestin merkiksi: 'Minulla on muutakin tekemistä kuin keskustella Minusta riippumattomista ongelmista. Mutta hei, Minun *henkeni* on kanssanne aina!' Sanomattakin on selvää, ettei moinen mielenilmaus ole hyvä asia saunaillan onnistumisen kannalta.",

  19: "**{egoPlayerName}** ei saavu tilaisuuteen ollenkaan, mutta sähkeen mies sentään lähettää. 'Sori, etten voi olla paikalla mutta joukkueen ongelmat eivät ole Minun ongelmiani. Olen *Casinolla*, jos kiinnostaa.' Muut pelaajat kritisoivat miehen asennetta ankarin sanankääntein.",

  20: "**{egoPlayerName}** lähtee saunaillasta lähes välittömästi. 'Mitä Minä täällä tekisin, ei Minua *kiinnosta* joukkueen ongelmat. Minä pelaan ja saan rahaa, siinä kaikki. Ei Minulta voi vaatia läsnäoloa tällaisessa tilaisuudessa!' Tunnelma joukkueen keskuudessa romahtaa.",

  // ── Option 3: assistant coach misbehavior (lt "kr", INT(3*RND) + 21)
  21: "Apulaismanagerisi panos: mies *riehuu* kännissä kuin hullu ja rikkoo kaiken eteensä sattuvan. Uho on kova: 'stana, sää lennät pihalle kuin lheppäkheihäs ja mää oon uus managheri!' hän huutaa tökkien sinua sormellaan.",

  22: "Kesken parhaiden löylyjen apulaismanagerisi päättää, jurrissa kun on, lorauttaa aimo virtsamäärän suoraan *kiukaalle*. Se siitä saunomisesta sitten!",

  23: "Apulaismanagerisi saapuu tilaisuuteen jo valmiiksi humalassa, ja aloittaa samantien armottoman sikailun. Pelaajasi saavat pian tarpeekseen, ja mies saa *kyytiä* koko rahan edestä. Tunnelma on auttamattomasti pilalla.",

  // ── Option 3: captain SUCCESS pool (lt "kr", INT(3*RND) + 24) ─
  24: "Kapteenisi **{captainName}** pysyttelee koko illan viisaasti huomattavasti selvempänä kuin joukkuetoverinsa. Hän pyrkii jutustelemaan jokaisen kanssa yksitellen, ja onnistuu paineiden purkamisessa vallan mainiosti.",

  25: "Kapteenisi **{captainName}** onnistuu nostamaan yhteishenkeä huomattavasti illan aikana. Hän välttää sammumisen täpärästi ja jutustelee henkeviä joukkuetovereidensa kera.",

  26: "Paineet hellittävät hieman: kapteeni **{captainName}** nostattaa yhteishenkeä strippaamalla pöydän päällä. Hän heittää löylyä kuin aimo tekijä: lämpötila parhaimmillaan **130** astetta.",

  // ── Option 3: captain FAILURE pool (lt "kr", INT(3*RND) + 27) ─
  27: "Illan päätarkoitus, asioiden puiminen yhteistyössä kapteenisi kanssa, muodostuu ylitsepääsemättömäksi ongelmaksi. **{captainName}** sammuu pöydän alle, eikä hänen suustaan pääse kuin oksennusta.",

  28: "Kapteenisi **{captainName}** pilaa illan tunnelman osittain juomalla aivan liikaa viinaa. Hän muuttuu hieman aggressiiviseksi, ja aukoo päätään vastaantuleville. Pian muut huomaavat parhaaksi jättää miehen rauhaan.",

  29: "**{captainName}**, joukkueen kapteeni, pilaa meiningin sikamaisella käyttäytymisellään. Hän puklailee joka puolelle, juo toisten kaljat ja on muutenkin ilkeä. Tunnelma saunaillassa romahtaa auttamatta.",

  // ── Option 3: manager performance (lt "kr", 30/31/32) ─────────
  30: "Oma pärstäsi aiheuttaa illan aikana joukkueen keskuudessa kränää. Jostain syystä persoonasi ei miellytä ketään, vaan saat kohdata jupinaa ja piruilua. Läsnäoloasi ei suoraan sanottuna olisi kaivattu - tunnelma romahtaa.",

  31: "Pelaajasi ottavat sinut illan aikana joukkoonsa kuin yhden 'pojista', ja pian kuorolaulu raikaa kiukaan äärellä. Voi siis sanoa, että hoidit oman osuutesi vähintäänkin kunnialla.",

  32: "Saunailta ei muuta miksikään sitä tosiasiaa, että sinä olet manageri ja he ovat pelaajia. Kunnioittavan jähmeä asenne sinua kohtaan ei pilaa tunnelmaa, mutta ei myöskään nosta sitä.",

  // ── Option 3: ego player meltdown (lt "kr", INT(3*RND) + 33) ──
  33: "**{egoPlayerName}** romahduttaa tunnelman kusipäisyydellään. Hän uhoaa kännipäissään, syyttäen muita pelaajia kaikista ongelmista. Käsirysy on lähellä, mutta väliintulosi estää tappelun synnyn.",

  34: "Saunailta menee pilalle - syyllinen on **{egoPlayerName}**. Hänen egonsa ei kestä ongelmia, vaan hän keskittyy muiden rienaamiseen. Vihapuheet herättävät muiden pelaajien piilevät aggressiot, ja ainoastaan pikainen väliintulosi estää tappelun synnyn.",

  35: "Saunailta päättyy tappeluun - jos tapahtunutta voi edes tappeluksi kutsua. **{egoPlayerName}** piruiluineen sai v-käyrän nousemaan, ja kriittinen piste ylittyi reilusti. Joukkueen jäsenet kaivoivat **pesiskamppeet** naftaliinista, ja riidankylväjä sai köniinsä. Ambulanssi kiidättää kaverin lasaretin puolelle."
};

export default crisisMeetingTexts;

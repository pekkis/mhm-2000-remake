DECLARE SUB valitsestrattie ()
DECLARE SUB ku (kuz%, ku1%, ku2%)
DECLARE SUB wnd (sex%)
DECLARE SUB rela ()
DECLARE SUB gene ()
DECLARE SUB muutmestarit ()
DECLARE SUB maaritakarakter ()
DECLARE SUB hahaa (haha%)
DECLARE SUB pjn ()
DECLARE SUB qelp (qel%)
DECLARE SUB pirtar1 ()
DECLARE SUB pirtar2 ()
DECLARE SUB pirtar4 ()
DECLARE SUB pirtar5 ()
DECLARE SUB pirtar3 ()
DECLARE SUB pirtar6 ()
DECLARE SUB pirtar7 ()
DECLARE SUB orgamaar (ork%)
DECLARE SUB etsipel (fat%)
DECLARE SUB omajoukkue ()
DECLARE SUB lt (lue$, lukux%)
DECLARE SUB annanimihallille ()
DECLARE SUB tasomaar ()
DECLARE SUB historia ()
DECLARE SUB valitsekansallisuus ()
DECLARE SUB lataus ()
DECLARE SUB avaa ()
DECLARE SUB oppnas2 ()
DECLARE SUB exitus ()
DECLARE SUB tyhjennalokero ()
DECLARE SUB printident ()
DECLARE SUB piraatti ()
DECLARE SUB uusipelitop ()
DECLARE SUB topmaar ()
DECLARE SUB uusipeliman ()
DECLARE SUB alku2 ()
DECLARE SUB vihat ()
DECLARE SUB uusipeli ()
DECLARE SUB options ()
DECLARE SUB alku ()
DECLARE SUB mahmax ()
DECLARE SUB sarjamaaralku ()
DECLARE SUB palkmaar ()
DECLARE SUB colchk (colre%)
DECLARE SUB kuvax (tied$)
'$DYNAMIC
'$INCLUDE: 'mhm2k.bi'

ON ERROR GOTO errori

DIM lhinta(1 TO 3) AS LONG
lhinta(1) = 20
lhinta(2) = 18
lhinta(3) = 15
perusraha = 100
potenssi = 1.17
potenssiplus = .035
xvolisa = .05
johlisa = .02
karlisa = .015

DIM pirtar(1 TO 7) AS INTEGER

OPEN "register.200" FOR BINARY AS #1

GET #1, 6666, tempus
a = ASC(tempus) - 100

DIM regged(1 TO a) AS STRING * 1
DIM ragged(1 TO a) AS INTEGER
DIM krypted(1 TO a) AS STRING * 1

GET #1, 29907, tempus
DIM rando(1 TO ASC(tempus) - 47) AS INTEGER

FOR d = 1 TO UBOUND(rando)
GET #1, 17345 + (d * 23), tempus
rando(d) = ASC(tempus) - 69
NEXT d

GET #1, 16851 + rando(1), tempus
randox = 208 - ASC(tempus)

GET #1, 4497 + rando(2), tempus
randox2 = ASC(tempus) - 159

FOR b = 1 TO a
GET #1, 1 + (b - 1) * 70, regged(b)
NEXT b

FOR b = 1 TO a
GET #1, 3000 + rando(2) + (b - 1) * 58, krypted(b)
NEXT b
c = LBOUND(rando)
FOR b = 1 TO a
krypted(b) = CHR$(ASC(krypted(b)) - randox - randox2 - rando(c))
c = c + 1
IF c > UBOUND(rando) THEN c = LBOUND(rando)
NEXT b

beggar = 0
FOR b = 1 TO a
ragged(b) = ASC(regged(b))
beggar = beggar + ragged(b)
NEXT b
PRINT

FOR b = 1 TO UBOUND(rando)
me$ = me$ + LTRIM$(STR$(rando(b)))
NEXT b
beggar2 = VAL(me$)

PRINT beggar
PRINT beggar2
CLOSE #1

FOR b = 1 TO a
rekkax = rekkax + regged(b)
NEXT b

ver1 = "1.2 REKISTER™ITY"
SCREEN 13
kuvax ("mfpres")
IF beggar = beggar2 AND beggar <> 0 THEN pirtar1
kuvax ("mhm2000")
SCREEN 0: WIDTH 80, 25

DIM ident(1 TO 8) AS INTEGER
DIM nimmi(4, 8) AS STRING
IF rando(1) <> 0 THEN pirtar2
DIM jokke(4, 8) AS STRING
DIM tokke(4, 8) AS INTEGER
DIM cauzi(1 TO 8) AS INTEGER

DIM elake(31 TO 38) AS INTEGER
IF krypted(LBOUND(krypted)) = regged(LBOUND(regged)) THEN pirtar3
DIM anhooal(18 TO 25) AS INTEGER
DIM taulux(1 TO 5) AS STRING

DIM keisix(1 TO 7, 1 TO 100) AS INTEGER

DIM turnimi(1 TO 10) AS STRING
DIM pkolo(1 TO 4) AS INTEGER
DIM tfxt(1 TO 5, 1 TO 6) AS INTEGER
DIM pep(1 TO 3, 1 TO 3) AS pleioff
IF krypted(2) = regged(2) AND krypted(2) <> "" THEN pirtar4
DIM plex(1 TO 3, 1 TO 12) AS INTEGER
DIM pfxt(1 TO 3, 1 TO 5, 1 TO 3, 1 TO 12) AS INTEGER
DIM karki(1 TO 7) AS INTEGER
DIM sijo(1 TO 4, 1 TO 12) AS INTEGER
DIM tkutsux(1 TO 48) AS INTEGER
DIM sanam(1 TO 4) AS STRING
DIM jkolo(1 TO 4) AS INTEGER
DIM efxt(1 TO 6, 1 TO 4) AS INTEGER
DIM cup(1 TO 64) AS INTEGER
DIM leg(1 TO 86) AS INTEGER
DIM cupjouk(1 TO 7) AS INTEGER
DIM stvari(1 TO 12, 1 TO 4) AS INTEGER
DIM estvari(1 TO 4) AS INTEGER
DIM panknim(1 TO 3) AS STRING
DIM pankkor(1 TO 3) AS SINGLE
DIM valbh(1 TO 3, 1 TO 5, 1 TO 5) AS LONG
DIM materia(1 TO 20) AS STRING
DIM materiax(1 TO 58) AS INTEGER
DIM eri(1 TO 30) AS INTEGER
DIM rekord(1 TO 6) AS borzzi
DIM pisenj(1 TO 3) AS INTEGER
DIM pisenp(1 TO 3) AS INTEGER
DIM pisenohj(1 TO 3) AS INTEGER
DIM kuntomax(18 TO 33) AS INTEGER
DIM nousu(1 TO 3) AS INTEGER
DIM puto(1 TO 3) AS INTEGER
DIM pelki(1 TO 18) AS INTEGER
DIM loukka(1 TO 45, 1 TO 5) AS INTEGER
DIM mood(1 TO 45, 1 TO 3) AS INTEGER
DIM voittosumma(0 TO 12) AS LONG
DIM kuntox(1 TO 6) AS STRING * 1
DIM sedd(1 TO 48)  AS INTEGER
DIM seddd(1 TO 48) AS INTEGER
DIM sed(1 TO 48)  AS INTEGER

DIM haln(1 TO 48) AS STRING
DIM aktion(-9 TO 1) AS INTEGER

DIM od(1 TO 2) AS INTEGER
DIM ode(1 TO 3, 1 TO 2) AS SINGLE

DIM ppiste(1 TO 86) AS INTEGER
DIM taso(1 TO 86) AS INTEGER
DIM paikka(1 TO 3, 1 TO 86) AS INTEGER
DIM tila(1 TO 3, 1 TO 6) AS INTEGER

DIM paiknim(1 TO 3) AS STRING
DIM tkaus(1 TO 3, 1 TO 48) AS INTEGER
DIM tsaav(1 TO 5, 1 TO 48) AS INTEGER
DIM valm(1 TO 48)  AS INTEGER
DIM kunto(1 TO 10, 1 TO 48) AS INTEGER
DIM tre(1 TO 48)  AS SINGLE
DIM sr(1 TO 48)  AS INTEGER
DIM x(1 TO 48)  AS INTEGER
DIM s(1 TO 48)  AS INTEGER
DIM p(1 TO 48)  AS INTEGER
DIM gf(1 TO 48) AS INTEGER
DIM ga(1 TO 48)  AS INTEGER
DIM win(1 TO 48) AS INTEGER
DIM dra(1 TO 48)  AS INTEGER
DIM los(1 TO 48)  AS INTEGER
DIM kausik(1 TO 48) AS INTEGER
DIM kotiot(1 TO 48) AS INTEGER
IF beggar = beggar2 AND beggar <> 0 THEN pirtar5
DIM ylek(1 TO 48) AS LONG

DIM etu(1 TO 2) AS SINGLE
DIM momax(1 TO 5) AS INTEGER
DIM momin(1 TO 5) AS INTEGER

DIM ex(1 TO 20)  AS INTEGER
DIM egf(1 TO 20) AS INTEGER
DIM ega(1 TO 20) AS INTEGER
DIM ep(1 TO 20)  AS INTEGER
DIM es(1 TO 20)  AS INTEGER
DIM luotto(1 TO 3) AS LONG

DIM borssix(1 TO 9, 1 TO 17) AS INTEGER

DIM l(1 TO 86)  AS STRING * 10
DIM kk(1 TO 86)  AS STRING
DIM ohj(1 TO 86)  AS INTEGER
DIM mw(1 TO 86) AS INTEGER
DIM pw(1 TO 86) AS INTEGER
DIM hw(1 TO 86) AS INTEGER
DIM yw(1 TO 86) AS INTEGER
DIM aw(1 TO 86) AS INTEGER

DIM tx(1 TO 6) AS INTEGER
DIM ts(1 TO 6) AS INTEGER
DIM tero(1 TO 6) AS INTEGER
DIM tp(1 TO 6) AS INTEGER
DIM tnimi(1 TO 1) AS STRING
DIM elt(1 TO 6) AS INTEGER
DIM palki(1 TO 6) AS LONG


DIM jaynax(2 TO 7, 1 TO 86) AS INTEGER

DIM kansap(1 TO 22) AS STRING
DIM kansal(1 TO 22) AS STRING * 3
DIM mmsarja(1 TO 22) AS INTEGER
DIM maajomin(1 TO 22) AS INTEGER
DIM mmitali(1 TO 3, 1 TO 17) AS INTEGER
DIM virhe(1 TO 3) AS INTEGER

DIM intens(0 TO 2) AS STRING
DIM genre(1 TO 17) AS INTEGER
DIM krjn(23) AS STRING * 1

tt = -10

OPEN "data\kiero.m2k" FOR INPUT AS #1
DO UNTIL EOF(1)
INPUT #1, a, b, c
tt = tt + 1
LOOP
CLOSE #1
kierrosmax = tt
a = 0: b = 0: c = 0: d = 0

DIM kiero(-9 TO kierrosmax) AS INTEGER
DIM kiero2(-9 TO kierrosmax) AS INTEGER
DIM kiero3(-9 TO kierrosmax) AS INTEGER
DIM pelip(1 TO 5) AS STRING * 2

DIM jayna(1 TO 7) AS STRING
DIM jahinta(1 TO 7) AS LONG

DIM valms(1 TO 3) AS STRING
DIM tazo(1 TO 86) AS INTEGER
IF krypted(1) = regged(1) AND krypted(1) <> "" THEN pirtar6
DIM fxt(1 TO 12, 1 TO 44) AS INTEGER

RANDOMIZE TIMER

OPEN "data\alkurso.m2k" FOR INPUT AS #1
INPUT #1, kurso
CLOSE #1

alcus:

CLS
LOCATE 4, 1
COLOR 6
PRINT "REKISTER™ITYNYT: ";
COLOR 14
PRINT rekkax

FOR z = 1 TO 8
OPEN "game_" + LTRIM$(STR$(z)) + "\gameid.gam" FOR INPUT AS #1
INPUT #1, ident(z)
IF ident(z) <> 0 THEN
INPUT #1, cauzi(z)
FOR zz = 1 TO ident(z)
INPUT #1, nimmi(zz, z), jokke(zz, z), tokke(zz, z)
NEXT zz
END IF
CLOSE #1
NEXT z

LOCATE 1, 69: COLOR 15: PRINT "ÛÛÛÛÛÛÛÛÛÛÛ";
LOCATE 2, 69: COLOR 1: PRINT "ÛÛÛÛÛÛÛÛÛÛÛ";
LOCATE 3, 69: COLOR 15: PRINT "ÛÛÛÛÛÛÛÛÛÛÛ";
LOCATE 1, 72: COLOR 1: PRINT "ÛÛ";
LOCATE 3, 72: COLOR 1: PRINT "ÛÛ";

COLOR 14
LOCATE 9, 44: PRINT "ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»";
LOCATE 10, 44: PRINT "º                                 º";
LOCATE 11, 44: PRINT "º                                 º";
LOCATE 12, 44: PRINT "º                                 º";
LOCATE 13, 44: PRINT "º                                 º";
LOCATE 14, 44: PRINT "ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼";
COLOR 6
LOCATE 10, 45: PRINT "     MHM 2000 PUHELINTUKI:"
LOCATE 11, 45: PRINT "  (TEKSTIVIESTEIHIN EN VASTAA)"
COLOR 15: LOCATE 13, 45: PRINT "     0 5 0 - 3 0 2 8 0 3 0"

COLOR 7
LOCATE 15, 45: PRINT "MUISTA: JOS ALAREUNAN TOIMINTO-"
LOCATE 16, 45: PRINT "RIVILLŽ MAJAILEE '";
COLOR 15: PRINT "?"; : COLOR 7
PRINT "', PŽŽSET"
LOCATE 17, 45: PRINT "KYSYMYSMERKKIŽ PAINAMALLA OHJE-"
LOCATE 18, 45: PRINT "RUUTUUN! (ESIM. NYT)"


COLOR 5
LOCATE 19, 44: PRINT "ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»";
LOCATE 20, 44: PRINT "º                                 º";
LOCATE 21, 44: PRINT "º                                 º";
LOCATE 22, 44: PRINT "º                                 º";
LOCATE 23, 44: PRINT "º                                 º";
LOCATE 24, 44: PRINT "ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼";
COLOR 13
LOCATE 20, 45: PRINT "KAIKKI PELISSŽ ESIINTYVŽT HAHMOT";
LOCATE 21, 45: PRINT "OVAT FIKTIIVISIŽ, JA MAHDOLLISET";
LOCATE 22, 45: PRINT "VIITTAUKSET TODELLISIIN HENKIL™I-";
LOCATE 23, 45: PRINT "HIN TAHATTOMIA.";


LOCATE 1, 1
COLOR 7
PRINT "ÉÍËÍ»»   »ÉÍËÍ»  ÍÍ»ÉÍÍ»ÉÍÍ»ÉÍÍ» ";
PRINT "v";
PRINT ver1
PRINT "º º ºÌÍÍÍ¹º º º  ÉÍ¼º  ºº  ºº  º"
PRINT "º   ºº   ºº   º  ÈÍÍÈÍÍ¼ÈÍÍ¼ÈÍÍ¼"


LOCATE 6, 3
COLOR 2
PRINT "ÉÍÍÍÍÍÍÍÍËÍÍÍÍÍÍÍÍËÍÍÍÍÍÍÍÍËÍÍÍÍÍÍÍÍËÍÍÍÍÍÍÍÍËÍÍÍÍÍÍÍÍËÍÍÍÍÍÍÍÍËÍÍÍÍÍÍÍÍ»"
LOCATE , 3: PRINT "º        º        º        º        º        º        º        º        º"
LOCATE , 3: PRINT "ÌÍÍÍÍÍÍÍÍÊÍÍÍÍÍÍÍÍÊÍÍÍÍÍÍÍÍÊÍÍÍÍÍÍÍÍÊÍÍÍÍÍÍÍÍÊÍÍÍÍÍÍÍÍÊÍÍÍÍÍÍÍÍÊÍÍÍÍÍÍÍÍ¼"
LOCATE , 3: PRINT "ºÉÍ"
LOCATE , 3: PRINT "È¹"

DO
LOCATE 7, 2
FOR xx = 1 TO 8
IF ident(xx) = 0 THEN COLOR 8 ELSE COLOR 14
IF kurso = xx AND ident(xx) = 0 THEN COLOR , 7 ELSE IF kurso = xx THEN COLOR , 6 ELSE COLOR , 0
LOCATE , 4 + ((xx - 1) * 9)
PRINT "PAIKKA "; LTRIM$(STR$(xx));
COLOR , 0
NEXT xx

printident

hahaa 1

wnd 1
ku 2, 1, 8
IF me$ = "t" AND ident(kurso) > 0 THEN tyhjennalokero: GOTO alcus
IF me$ = "?" THEN qelp 99: GOTO alcus
IF me$ = CHR$(27) THEN exitus
IF me$ = CHR$(13) THEN EXIT DO
LOOP

OPEN "data\alkurso.m2k" FOR OUTPUT AS #1
WRITE #1, kurso
CLOSE #1

COLOR , 0
lokero = kurso

IF ident(lokero) = 0 THEN alku ELSE plkm = ident(kurso)

DIM graf(1 TO 44, 1 TO plkm) AS INTEGER
DIM otte(1 TO 4, 1 TO 2, 1 TO plkm) AS INTEGER
DIM mukc(1 TO plkm) AS INTEGER
DIM yvpelaa(1 TO plkm) AS INTEGER
DIM avpelaa(1 TO plkm) AS INTEGER
DIM mukax(1 TO plkm) AS INTEGER
DIM actiox(1 TO plkm) AS INTEGER
DIM suosikki(1 TO 3, 1 TO 3, 1 TO plkm) AS INTEGER
DIM jaynateh(1 TO plkm) AS INTEGER
DIM laina(1 TO 3, 1 TO plkm) AS LONG
DIM mafia(1 TO plkm) AS INTEGER
DIM sopim(1 TO plkm) AS INTEGER
DIM infos(1 TO plkm) AS INTEGER
DIM kuume(1 TO plkm) AS INTEGER
DIM u(1 TO plkm) AS INTEGER
DIM boikotti(1 TO plkm) AS INTEGER
DIM vuoro(1 TO plkm) AS INTEGER
DIM nimi(1 TO plkm) AS STRING
DIM vai(1 TO 4, 1 TO plkm) AS INTEGER
DIM raha(1 TO plkm) AS LONG
DIM mukp(1 TO plkm)  AS INTEGER
DIM pelbudget(1 TO plkm) AS LONG
DIM muke(1 TO plkm)  AS INTEGER
DIM automat(1 TO plkm) AS INTEGER
DIM erik(1 TO 4, 1 TO 48) AS INTEGER
DIM erikmak(0 TO 4, 1 TO 4) AS LONG
DIM erikmax(1 TO 4) AS INTEGER
DIM erikalk(1 TO 4) AS INTEGER
DIM treeni(1 TO plkm) AS INTEGER

DIM vsaldo(1 TO 4, 1 TO 3, 1 TO plkm) AS INTEGER
DIM saav(1 TO 7, 1 TO plkm) AS INTEGER
DIM saavtext(1 TO 7) AS STRING
DIM putki(1 TO 5, 1 TO plkm) AS INTEGER

DIM uppiste(1 TO plkm) AS INTEGER
DIM utaso(1 TO plkm) AS INTEGER
DIM upaikka(1 TO 3, 1 TO plkm) AS INTEGER
DIM uhatapa(1 TO plkm) AS INTEGER
DIM rakennuttaja(1 TO plkm) AS INTEGER
DIM arkkitehti(1 TO plkm) AS INTEGER
DIM mpv(1 TO plkm) AS LONG
DIM maine(1 TO plkm) AS LONG

DIM vast(1 TO plkm) AS INTEGER
DIM koti(1 TO plkm) AS INTEGER
DIM vieras(1 TO plkm) AS INTEGER

DIM krapu(1 TO plkm) AS INTEGER

DIM spx(1 TO 4, 1 TO plkm) AS INTEGER

DIM mukt(1 TO plkm) AS INTEGER

DIM uhka(1 TO plkm) AS INTEGER
DIM sovtap(1 TO plkm) AS INTEGER
DIM sopuhu(1 TO plkm) AS INTEGER
DIM junnu(1 TO plkm) AS INTEGER
DIM ppmaksu(1 TO 2) AS LONG

ppmaksu(1) = 20000
ppmaksu(2) = 10000


IF plkm > 1 THEN
DIM borsch(18 TO 17 + plkm - 1) AS INTEGER
END IF

DIM pel(1 TO 32, 1 TO plkm) AS pelaaja
DIM jel(1 TO 10, 1 TO plkm) AS pelaaja

DIM lpl(1 TO plkm) AS INTEGER
DIM lpj(1 TO plkm) AS INTEGER

DIM top(1 TO 48 - plkm, 1 TO 5) AS topp

DIM tauti(1 TO 3, 1 TO 48 - plkm) AS INTEGER
DIM tkest(1 TO 3, 1 TO 48 - plkm) AS INTEGER

DIM tautip(1 TO 48) AS SINGLE
DIM tautik(1 TO 48) AS INTEGER

DIM tox(1 TO 48) AS INTEGER

DIM mana(1 TO 48 + 6 + plkm) AS manaher
DIM mtnimi(1 TO 48 + 6 + plkm) AS STRING
DIM mtaito(1 TO 6, 1 TO 48 + 6 + plkm) AS INTEGER

DIM man(1 TO 48) AS INTEGER
DIM mo(1 TO 48) AS INTEGER
DIM ketju(1 TO 5, 1 TO 6, 1 TO plkm) AS INTEGER
DIM maa(1 TO 1, 1 TO plkm) AS INTEGER
DIM dad(1 TO 5, 1 TO 6) AS INTEGER

DIM pketju(1 TO 3, 1 TO plkm) AS INTEGER
DIM hketju(1 TO 4, 1 TO plkm) AS INTEGER

DIM skout(1 TO 17, 1 TO plkm) AS INTEGER
DIM skoutteja(1 TO plkm) AS INTEGER

DIM sponso(1 TO 20, 1 TO plkm) AS LONG
DIM spona(1 TO plkm) AS STRING


DIM kapu(1 TO plkm) AS INTEGER
DIM valb(1 TO 5, 1 TO plkm) AS INTEGER
DIM konkurssi(1 TO plkm) AS INTEGER
DIM inte(1 TO plkm) AS INTEGER

DIM avg(1 TO 3, 1 TO plkm) AS SINGLE

DIM veika(1 TO 12, 1 TO plkm) AS INTEGER

DIM potti(1 TO plkm) AS LONG

avaa

SELECT CASE ident(lokero)
CASE 0

oppnas2

sarjamaaralku
alku2
uusipeli
topmaar
uusipeliman
uusipelitop

valitsestrattie

FOR pv = 1 TO plkm
FOR xx = 1 TO lpl(pv)
neup = pel(xx, pv)
palkmaar
pel(xx, pv).sra = rahna
NEXT xx
NEXT pv

IF ohj(14) = 0 AND man(14) <> 33 THEN
FOR xx = 1 TO 48
IF man(xx) = 33 THEN EXIT FOR
NEXT xx
IF xx = 49 THEN
man(14) = 33
ELSE
SWAP man(xx), man(14)
END IF
END IF


vihat

CASE ELSE
COLOR , 0
CLS
COLOR 31
PRINT "ODOTA HETKINEN!"
lataus
END SELECT

ensintoinen = 1
ERASE nimmi, ident, jokke, tokke, regged, ragged, krypted, rando
IF beggar = beggar2 AND beggar2 <> 0 THEN pirtar7

CHAIN "ilex5"

errori:
piraatti

REM $STATIC
SUB alku
SCREEN 0: WIDTH 80, 43
a = 1

kurso = 1
hahaa 2
LOCATE 1, 1: lt "al", 1

DO
COLOR 15: LOCATE 3, 1: PRINT " 1 2 3 4"
LOCATE 5, 2
FOR zz = 1 TO 4
IF zz > 1 THEN COLOR 2: PRINT "°";
IF kurso = zz THEN COLOR 10, 0 ELSE COLOR 2, 0
IF kurso = zz THEN PRINT "²";  ELSE PRINT "°";
NEXT zz

wnd 1
ku 2, 1, 4
IF me$ = CHR$(13) THEN EXIT DO
LOOP
plkm = kurso

IF plkm > 1 THEN
kurso = 1
LOCATE 8, 1: COLOR 6, 0
PRINT "VALITSE NOKKIMISJŽRJESTYS"
DO
LOCATE 10, 1
FOR zz = 1 TO 3
IF kurso = zz THEN COLOR , 6 ELSE COLOR , 0
lt "al", 1 + zz
NEXT zz

COLOR , 0
FOR zz = 1 TO 2
LOCATE 13 + zz, 1: PRINT STRING$(80, " ");
NEXT zz

LOCATE 14, 1
IF kurso < 3 THEN lt "x", 43 + kurso ELSE lt "x", 52
wnd 1
ku 1, 1, 3
IF me$ = CHR$(13) THEN EXIT DO
LOOP
END IF
IF plkm = 1 THEN nokka = 1 ELSE nokka = kurso

END SUB

SUB alku2

DIM ntemp(21) AS STRING * 1
FOR pv = 1 TO plkm
sopim(pv) = 1

FOR ggg = 1 TO 21
ntemp(ggg) = ""
NEXT ggg

kurso = 1
COLOR , 0
CLS : COLOR 6
hahaa 4

LOCATE 1, 1: COLOR 6
PRINT "KIRJOITA NIMESI, MANAGERI ";
COLOR 14: PRINT LTRIM$(STR$(pv))

DO
FOR zz = 1 TO 21
LOCATE 3, zz + 1: PRINT ntemp(zz);
NEXT zz
LOCATE 3, kurso + 1: PRINT "Û"
wnd 1
IF ASC(me$) >= 33 AND kurso < 21 THEN ntemp(kurso) = me$: kurso = kurso + 1
IF me$ = CHR$(8) AND kurso > 1 THEN ntemp(kurso - 1) = "": kurso = kurso - 1
IF me$ = CHR$(32) AND kurso < 20 THEN ntemp(kurso) = " ": kurso = kurso + 1
IF me$ = CHR$(13) THEN EXIT DO
LOOP
mukka = kurso - 1

IF mukka = 0 THEN nimi(pv) = "Manageri " + LTRIM$(STR$(pv)): GOTO mulkerox

FOR zzz = 1 TO mukka
nimi(pv) = nimi(pv) + ntemp(zzz)
NEXT zzz

mulkerox:
mana(54 + pv).nam = nimi(pv)

COLOR 0, 0: LOCATE 3, kurso + 1: PRINT "Û"
IF mukka = 0 THEN LOCATE 3, 2: COLOR 14, 0: PRINT "Manageri "; LTRIM$(STR$(pv))

valitsekansallisuus
options
maaritakarakter


NEXT pv

ERASE ntemp
END SUB

SUB annanimihallille
kurso = 1
DIM ntemp(26) AS STRING * 1
haln(u(pv)) = ""
COLOR 6
LOCATE 9, 1: PRINT "NIMEŽ JŽŽHALLISI, MANAGERI ";
colchk 1
PRINT nimi(pv)
COLOR 14
DO
FOR zz = 1 TO 26
LOCATE 11, zz + 1: PRINT ntemp(zz);
NEXT zz
LOCATE 11, kurso + 1: PRINT "Û"
wnd 1
IF ASC(me$) >= 33 AND kurso < 26 THEN ntemp(kurso) = me$: kurso = kurso + 1
IF me$ = CHR$(8) AND kurso > 1 THEN ntemp(kurso - 1) = "": kurso = kurso - 1
IF me$ = CHR$(32) AND kurso < 25 THEN ntemp(kurso) = " ": kurso = kurso + 1
IF me$ = CHR$(13) THEN EXIT DO
LOOP
mukka = kurso - 1

IF mukka = 0 THEN haln(u(pv)) = "MHM 2000 Areena": GOTO mulkerooo

FOR zzz = 1 TO mukka
haln(u(pv)) = haln(u(pv)) + ntemp(zzz)
NEXT zzz

mulkerooo:
ERASE ntemp

END SUB

SUB avaa
CHDIR "data"

OPEN "aktion.m2k" FOR INPUT AS #1
FOR xx = -9 TO 1
INPUT #1, aktion(xx)
NEXT xx
CLOSE #1

OPEN "borssix.m2k" FOR INPUT AS #1
FOR xx = 1 TO 17
FOR xxx = 1 TO 9
INPUT #1, borssix(xxx, xx)
NEXT xxx
NEXT xx
CLOSE #1

OPEN "v_summat.m2k" FOR INPUT AS #1
FOR xx = 0 TO 12
INPUT #1, voittosumma(xx)
NEXT xx
CLOSE #1

OPEN "arenas.m2k" FOR INPUT AS #1
FOR xx = 1 TO 6
FOR xxx = 1 TO 3
INPUT #1, tila(xxx, xx)
NEXT xxx
NEXT xx
CLOSE #1

OPEN "keisit.m2k" FOR INPUT AS #1
FOR zzz = 1 TO 7
FOR zz = 1 TO 100
INPUT #1, keisix(zzz, zz)
NEXT zz
NEXT zzz
CLOSE #1

OPEN "karsa.m2k" FOR INPUT AS #1
FOR zz = 1 TO 6
INPUT #1, dad(3, zz), dad(4, zz), dad(5, zz), dad(1, zz), dad(2, zz)
NEXT zz
CLOSE #1

OPEN "pelkiel.m2k" FOR INPUT AS #1
FOR zz = 1 TO 18
INPUT #1, pelki(zz)
NEXT zz
CLOSE #1

OPEN "injuries.m2k" FOR INPUT AS #1
FOR zz = 1 TO 45
INPUT #1, loukka(zz, 1), loukka(zz, 2), loukka(zz, 3), loukka(zz, 4), loukka(zz, 5)
NEXT zz
CLOSE #1

OPEN "muudit.m2k" FOR INPUT AS #1
FOR zz = 1 TO 45
INPUT #1, mood(zz, 1), mood(zz, 2), mood(zz, 3)
NEXT zz
CLOSE #1

OPEN "tkutsu.m2k" FOR INPUT AS #1
FOR zz = 1 TO 48
INPUT #1, tkutsux(zz)
NEXT zz
CLOSE #1

OPEN "jaynat.m2k" FOR INPUT AS #1
FOR zz = 1 TO 7
INPUT #1, jayna(zz)
NEXT zz
FOR zz = 1 TO 7
INPUT #1, jahinta(zz)
NEXT zz
CLOSE #1

OPEN "datax.m2k" FOR INPUT AS #1
FOR zz = 1 TO 3
INPUT #1, paiknim(zz)
NEXT zz
FOR zz = 1 TO 10
INPUT #1, turnimi(zz)
NEXT zz
FOR zz = 1 TO 4
INPUT #1, taulux(zz)
NEXT zz
FOR zz = 1 TO 4
INPUT #1, sanam(zz)
NEXT zz
FOR zz = 1 TO 6
INPUT #1, mtnimi(zz)
NEXT zz
FOR zz = 1 TO 7
INPUT #1, saavtext(zz)
NEXT zz
FOR zz = 1 TO 3
INPUT #1, luotto(zz)
NEXT zz
FOR zz = 0 TO 2
INPUT #1, intens(zz)
NEXT zz
FOR zz = 1 TO 5
INPUT #1, pelip(zz)
NEXT zz
FOR zz = 1 TO 3
INPUT #1, valms(zz)
NEXT zz
FOR zz = 1 TO 23
INPUT #1, krjn(zz)
NEXT zz
FOR zz = 18 TO 33
INPUT #1, kuntomax(zz)
NEXT zz
FOR zz = 1 TO 5
INPUT #1, momax(zz), momin(zz)
NEXT zz
FOR z = 31 TO 38
INPUT #1, elake(z)
NEXT z
FOR z = 18 TO 25
INPUT #1, anhooal(z)
NEXT z
FOR z = 1 TO UBOUND(erikmax)
INPUT #1, erikmax(z)
NEXT z
FOR z = 1 TO UBOUND(erikmax)
INPUT #1, erikalk(z)
NEXT z
FOR z = 1 TO 4
FOR zz = 0 TO 4
INPUT #1, erikmak(zz, z)
NEXT zz
NEXT z
FOR z = 1 TO 6
INPUT #1, kuntox(z)
NEXT z
CLOSE #1




OPEN "pepdep.m2k" FOR INPUT AS #1
FOR tt = 1 TO 3
FOR zz = 1 TO 3
INPUT #1, pep(tt, zz).joukk, pep(tt, zz).voitt
NEXT zz
NEXT tt
FOR tt = 1 TO 4
INPUT #1, jkolo(tt)
NEXT tt
CLOSE #1

OPEN "fixture.m2k" FOR INPUT AS #1
FOR zz = 1 TO 44
FOR zzz = 1 TO 12
INPUT #1, fxt(zzz, zz)
NEXT zzz
NEXT zz

FOR qwe = 1 TO 3
FOR zz = 1 TO 3
FOR tt = 1 TO 5
FOR cupex = 1 TO pep(qwe, zz).joukk
INPUT #1, pfxt(zz, tt, qwe, cupex)
NEXT cupex
NEXT tt
NEXT zz
NEXT qwe
FOR zz = 1 TO 6
FOR tt = 1 TO 4
INPUT #1, efxt(zz, tt)
NEXT tt
NEXT zz
FOR zz = 1 TO 5
FOR tt = 1 TO 6
INPUT #1, tfxt(zz, tt)
NEXT tt
NEXT zz
FOR tt = 1 TO 4
INPUT #1, pkolo(tt)
NEXT tt
CLOSE #1

OPEN "plcup.m2k" FOR INPUT AS #1
INPUT #1, cuparpokerto
FOR zz = 1 TO 7
INPUT #1, cupjouk(zz)
NEXT zz
CLOSE #1

OPEN "teams.ala" FOR INPUT AS #1
FOR zz = 71 TO 86
INPUT #1, l(zz), kk(zz), tazo(zz), ppiste(zz), taso(zz), paikka(1, zz), paikka(2, zz), paikka(3, zz)
NEXT zz
CLOSE #1

OPEN "stvari.m2k" FOR INPUT AS #1
FOR zz = 1 TO 4
FOR zzz = 1 TO 12
INPUT #1, stvari(zzz, zz)
NEXT zzz
NEXT zz
FOR zz = 1 TO 4
INPUT #1, estvari(zz)
NEXT zz
CLOSE #1

OPEN "kiero.m2k" FOR INPUT AS #1
FOR zz = -9 TO kierrosmax
INPUT #1, kiero(zz), kiero2(zz), kiero3(zz)
NEXT zz
CLOSE #1

OPEN "materiax.m2k" FOR INPUT AS #1
FOR zz = 1 TO 58
INPUT #1, materiax(zz)
NEXT zz
CLOSE #1

OPEN "materia.m2k" FOR INPUT AS #1
FOR zz = 1 TO 20
INPUT #1, materia(zz)
NEXT zz
CLOSE #1

OPEN "kansat.m2k" FOR INPUT AS #1
FOR zz = 1 TO UBOUND(kansap)
INPUT #1, kansap(zz), kansal(zz), mmsarja(zz), maajomin(zz)
NEXT zz
CLOSE #1


FOR zz = 1 TO UBOUND(genre)
OPEN LTRIM$(STR$(zz)) + ".mhx" FOR INPUT AS #1
DO UNTIL EOF(1)
INPUT #1, temp$
genre(zz) = genre(zz) + 1
LOOP
CLOSE #1
NEXT zz

OPEN "budget.m2k" FOR INPUT AS #1
FOR zzz = 1 TO 3
FOR zz = 1 TO 5
INPUT #1, valbh(zzz, zz, 1), valbh(zzz, zz, 2), valbh(zzz, zz, 3), valbh(zzz, zz, 4), valbh(zzz, zz, 5)
NEXT zz
NEXT zzz
CLOSE #1

OPEN "panki.m2k" FOR INPUT AS #1
FOR zz = 1 TO 3
INPUT #1, panknim(zz), pankkor(zz)
NEXT zz
CLOSE #1


CHDIR ".."
END SUB

SUB colchk (colre%)
SELECT CASE colre%

CASE 1
SELECT CASE pv
CASE 1 TO 4
COLOR pkolo(pv)
END SELECT

CASE 2
FOR a = 1 TO plkm
IF nn = u(a) THEN COLOR pkolo(a)
NEXT a

CASE 3
FOR a = 1 TO plkm
IF mm = u(a) THEN COLOR pkolo(a)
NEXT a

CASE 4
SELECT CASE ccc
CASE 1 TO 4
COLOR pkolo(ccc)
END SELECT

END SELECT

END SUB

SUB etsipel (fat%)

FOR xxx = 1 TO lpl(pv)
IF pel(xxx, pv).ppp = fat% THEN EXIT FOR
NEXT xxx

jesboks:
FOR xx = 1 TO lpl(pv)
IF xxx <> xx THEN
IF pel(xx, pv).ppp = fat% AND pel(xx, pv).psk > pel(xxx, pv).psk THEN xxx = xx: GOTO jesboks
END IF
NEXT xx

xx = xxx
END SUB

SUB exitus
SCREEN 0: WIDTH 80, 25: COLOR 15, 0
CLS
lt "x", 89
PRINT
lt "x", 88
PRINT
lt "x", 87
COLOR 6: PRINT "               E-MAIL: ";
COLOR 14: PRINT "forster@mbnet.fi"
PRINT
lt "x", 86
SYSTEM
END SUB

SUB gene
skout(1, pv) = 1

a = CINT(pw(u(pv)) / 6)
b = CINT(hw(u(pv)) / 12)

FOR xx = 1 TO 20
IF INT(101 * RND) < 70 THEN nats = 1 ELSE nats = keisix(1, INT(100 * RND) + 1)
rela
pel(xx, pv) = blanko
pel(xx, pv).svu = INT(2 * RND)

IF xx < 3 THEN pel(xx, pv).ppp = 1 ELSE IF xx < 9 THEN pel(xx, pv).ppp = 2 ELSE IF xx < 13 THEN pel(xx, pv).ppp = 3 ELSE IF xx < 17 THEN pel(xx, pv).ppp = 4 ELSE pel(xx, pv).ppp = 5

SELECT CASE xx
CASE 1
pel(xx, pv).psk = mw(u(pv))
CASE 2
pel(xx, pv).psk = mw(u(pv)) - INT(3 * RND) - 1
CASE 3 TO 8
pel(xx, pv).psk = a
CASE 9 TO 20
pel(xx, pv).psk = b
END SELECT
NEXT xx

c = 0
d = 0

FOR qwe = 3 TO 8
c = c + pel(qwe, pv).psk
NEXT qwe

z = pw(u(pv)) - c
IF z < 0 THEN zz = -1 ELSE zz = 1

IF z <> 0 THEN
FOR zzz = 1 TO ABS(z)
cupex = INT(6 * RND) + 3
pel(cupex, pv).psk = pel(cupex, pv).psk + zz
NEXT zzz
END IF

FOR qwe = 9 TO 20
d = d + pel(qwe, pv).psk
NEXT qwe

z = hw(u(pv)) - d
IF z < 0 THEN zz = -1 ELSE zz = 1

IF z <> 0 THEN
FOR zzz = 1 TO ABS(z)
cupex = INT(12 * RND) + 9
pel(cupex, pv).psk = pel(cupex, pv).psk + zz
NEXT zzz
END IF


FOR xx = 21 TO 24
IF INT(101 * RND) < 70 THEN nats = 1 ELSE nats = keisix(1, INT(100 * RND) + 1)
rela
pel(xx, pv) = blanko

IF xx = 21 THEN pel(xx, pv).ppp = 2 ELSE IF xx = 22 THEN pel(xx, pv).ppp = 3 ELSE IF xx = 23 THEN pel(xx, pv).ppp = 4 ELSE pel(xx, pv).ppp = 5
pel(xx, pv).svu = 1
IF pel(xx, pv).ppp = 2 THEN pel(xx, pv).psk = a - INT(4 * RND) - 1 ELSE pel(xx, pv).psk = b - INT(4 * RND) - 1
IF pel(xx, pv).psk < 1 THEN pel(xx, pv).psk = 1
NEXT xx


IF a <= 7 THEN c = 3 ELSE IF a <= 9 THEN c = 5 ELSE c = 6

FOR d = 1 TO c
erwin:
z = INT(6 * RND) + 3
zz = INT(6 * RND) + 3
IF z = zz THEN GOTO erwin
IF pel(z, pv).psk = 1 THEN GOTO erwin
pel(z, pv).psk = pel(z, pv).psk - 1
pel(zz, pv).psk = pel(zz, pv).psk + 1
NEXT d

IF b <= 7 THEN c = 7 ELSE IF b <= 9 THEN c = 9 ELSE c = 11

FOR d = 1 TO c
erwin2:
z = INT(12 * RND) + 9
zz = INT(12 * RND) + 9
IF z = zz THEN GOTO erwin2
IF pel(z, pv).psk = 1 THEN GOTO erwin2
pel(z, pv).psk = pel(z, pv).psk - 1
pel(zz, pv).psk = pel(zz, pv).psk + 1
NEXT d
lpl(pv) = 24
END SUB

SUB hahaa (haha%)
SHARED ident() AS INTEGER, jokke() AS STRING, nimmi() AS STRING, kurso AS INTEGER

IF a = 0 THEN LOCATE 25, 1 ELSE LOCATE 43, 1

PRINT STRING$(78, " ");
IF a = 0 THEN LOCATE 25, 1 ELSE LOCATE 43, 1


COLOR 7
SELECT CASE haha%
CASE 1, 4, 5, 6
PRINT CHR$(17); CHR$(16); CHR$(18);
CASE 2
PRINT CHR$(17); CHR$(16);
CASE 3
PRINT CHR$(18);
END SELECT

COLOR 15
SELECT CASE haha%
CASE 1, 4
PRINT " ?";
END SELECT

COLOR 7
SELECT CASE haha%
CASE 1
PRINT "  ENTER:";
SELECT CASE ident(kurso)
CASE 0
PRINT "UUSI PELI";
CASE IS <> 0
PRINT "LATAA PELI  T:TYHJENNŽ PAIKKA";
END SELECT
PRINT "  ";
PRINT "ESC:PALUU SYSTEEMIIN";
CASE 2, 3, 4, 6
PRINT "  ENTER: VALITSE";
CASE 5
IF curso = 0 THEN PRINT "  ENTER: VALITSE";
END SELECT

END SUB

SUB historia
FOR zz = 1 TO 12
IF zz < 12 THEN tkaus(1, zz) = 3 ELSE tkaus(1, zz) = 0
IF zz = 12 THEN tkaus(2, zz) = 3
NEXT zz
FOR zz = 13 TO 24
IF zz = 13 THEN tkaus(1, zz) = 3 ELSE tkaus(1, zz) = 0
IF zz = 13 THEN tkaus(2, zz) = 0 ELSE tkaus(2, zz) = 3
NEXT zz
FOR zz = 25 TO 48
tkaus(3, zz) = 3
NEXT zz

FOR zz = 1 TO 48
IF sed(zz) < 4 THEN tsaav(sed(zz), zz) = tsaav(sed(zz), zz) + 1
IF sedd(zz) < 4 THEN tsaav(sedd(zz), zz) = tsaav(sedd(zz), zz) + 1
IF seddd(zz) < 4 THEN tsaav(seddd(zz), zz) = tsaav(seddd(zz), zz) + 1
NEXT zz

tsaav(4, 5) = 1


CHDIR "game_" + LTRIM$(STR$(lokero))
OPEN "1.sta" FOR OUTPUT AS #1
WRITE #1, 1997, 5, 0, 1, 0, 3, 0, 0, 0, "Jokerit   ", 0
WRITE #1, 1998, 2, 0, 6, 0, 5, 0, 0, 0, "Feldkirch ", 0
WRITE #1, 1999, 1, 0, 2, 0, 3, 0, 0, 0, "Dynamo    ", 0
CLOSE #1

OPEN "3.sta" FOR OUTPUT AS #1
WRITE #1, 1997, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
WRITE #1, 1998, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
WRITE #1, 1999, 12, 0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0
CLOSE #1

CHDIR ".."
END SUB

SUB ku (kuz%, ku1%, ku2%)
IF kuz% < 3 THEN kusek = kurso ELSE kusek = curso
SELECT CASE kuz%
CASE 1
IF me$ = CHR$(0) + CHR$(72) AND kurso > ku1% THEN kurso = kurso - 1
IF me$ = CHR$(0) + CHR$(80) AND kurso < ku2% THEN kurso = kurso + 1
CASE 2
IF me$ = CHR$(0) + CHR$(75) AND kurso > ku1% THEN kurso = kurso - 1
IF me$ = CHR$(0) + CHR$(77) AND kurso < ku2% THEN kurso = kurso + 1
CASE 3
IF me$ = CHR$(0) + CHR$(72) AND curso > ku1% THEN curso = curso - 1
IF me$ = CHR$(0) + CHR$(80) AND curso < ku2% THEN curso = curso + 1
CASE 4
IF me$ = CHR$(0) + CHR$(75) AND curso > ku1% THEN curso = curso - 1
IF me$ = CHR$(0) + CHR$(77) AND curso < ku2% THEN curso = curso + 1
END SELECT
END SUB

SUB kuvax (tied$)
OUT &H3C8, 0
FOR hukka = 0 TO 767
OUT &H3C9, 0
NEXT hukka
OPEN "pics\" + tied$ + ".pal" FOR INPUT AS #1
DIM vari%(767)
FOR pekkis = 0 TO 767
INPUT #1, vari%(pekkis)
NEXT pekkis
CLOSE
BLOAD "pics\" + tied$ + ".kuv"
OUT &H3C8, 0
FOR vittu = 0 TO 767
OUT &H3C9, vari%(vittu)
NEXT vittu
WHILE INKEY$ = "": WEND
END SUB

SUB lataus
WIDTH 80, 43
CHDIR "game_" + LTRIM$(STR$(lokero))

OPEN "savetus1.xxx" FOR INPUT AS #1
INPUT #1, emestari, nousu(1), nousu(2), nousu(3), puto(1), puto(2), puto(3), pelaa, ot, ki, lastbors, eot, pkr, kausi, kr, ekr, tietos, jaynteh, ppotti, arvsulk, kriisi, nokka, cround, leggi, mmnousu, mmputo, cupvoittaja, tv, saver%, savertype%, lm
FOR tt = 1 TO 7
INPUT #1, karki(tt)
NEXT tt
CLOSE #1

IF kiero(kr) = 4 THEN
DIM hott(1 TO 86) AS INTEGER
DIM hotte(1 TO 86) AS INTEGER
OPEN "hativati.xxx" FOR INPUT AS #1
FOR tt = 1 TO 86
INPUT #1, hott(tt), hotte(tt)
NEXT tt
CLOSE #1
END IF

OPEN "savetus2.xxx" FOR INPUT AS #1
FOR tt = 1 TO plkm
INPUT #1, lpj(tt), u(tt), vuoro(tt), nimi(tt), vai(1, tt), vai(2, tt), vai(3, tt), vai(4, tt), raha(tt), mukp(tt), muke(tt), lpl(tt), inte(tt), putki(1, tt), putki(2, tt), putki(3, tt), putki(4, tt), putki(5, tt), krapu(tt), uhka(tt), sovtap(tt),  _
kuume(tt), sopuhu(tt), potti(tt), sopim(tt), junnu(tt), laina(1, tt), laina(2, tt), laina(3, tt), mafia(tt), actiox(tt), jaynateh(tt), mukt(tt), mukc(tt), automat(tt), kapu(tt), utaso(tt), uppiste(tt), upaikka(1, tt), upaikka(2, tt), upaikka(3, tt), _
 uhatapa(tt), rakennuttaja(tt), arkkitehti(tt), mpv(tt), infos(tt), vast(tt), maine(tt), boikotti(tt), konkurssi(tt), treeni(tt)
FOR zz = 1 TO UBOUND(spx, 1)
INPUT #1, spx(zz, tt)
NEXT zz
FOR zz = 1 TO 3
FOR zzz = 1 TO 3
INPUT #1, suosikki(zz, zzz, tt)
NEXT zzz
NEXT zz
FOR zz = 1 TO 4
INPUT #1, otte(zz, 1, tt), otte(zz, 2, tt)
INPUT #1, vsaldo(zz, 1, tt), vsaldo(zz, 2, tt), vsaldo(zz, 3, tt)
NEXT zz
FOR zz = 1 TO 7
INPUT #1, saav(zz, tt)
NEXT zz
INPUT #1, maa(1, tt)
FOR zz = 1 TO 6
FOR qwe = 1 TO 5
INPUT #1, ketju(qwe, zz, tt)
NEXT qwe
NEXT zz
INPUT #1, spona(tt)
FOR zz = 1 TO 20
INPUT #1, sponso(zz, tt)
NEXT zz
NEXT tt
CLOSE #1

FOR tt = 1 TO plkm
OPEN "pel" + LTRIM$(STR$(tt)) + ".xxx" FOR RANDOM AS #1
FOR zz = 1 TO lpl(tt)
GET #1, zz, pel(zz, tt)
NEXT zz
CLOSE #1
OPEN "jel" + LTRIM$(STR$(tt)) + ".xxx" FOR RANDOM AS #1
FOR zz = 1 TO lpj(tt)
GET #1, zz, jel(zz, tt)
NEXT zz
CLOSE #1
NEXT tt

SHELL "copy savetus5.xxx borspel.tmp /y >nul"

OPEN "mmitali.xxx" FOR INPUT AS #1
FOR tt = 1 TO 17
INPUT #1, mmitali(1, tt), mmitali(2, tt), mmitali(3, tt)
NEXT tt
CLOSE #1

OPEN "savetus4.xxx" FOR INPUT AS #1
FOR tt = 1 TO 86
INPUT #1, l(tt), kk(tt), ohj(tt), mw(tt), pw(tt), hw(tt), tazo(tt), leg(tt), ppiste(tt), taso(tt), paikka(1, tt), paikka(2, tt), paikka(3, tt)
NEXT tt
FOR tt = 1 TO 48
INPUT #1, seddd(tt), sedd(tt), sed(tt), valm(tt), tre(tt), sr(tt), x(tt), s(tt), p(tt), gf(tt), ga(tt), win(tt), dra(tt), los(tt), tox(tt), tautip(tt), tautik(tt), haln(tt), kausik(tt), ylek(tt), kotiot(tt), mo(tt)
FOR zz = 1 TO 3
INPUT #1, tkaus(zz, tt)
NEXT zz
FOR zz = 1 TO 5
INPUT #1, tsaav(zz, tt)
NEXT zz
FOR zz = 2 TO 7
INPUT #1, jaynax(zz, tt)
NEXT zz
FOR zz = 1 TO 4
INPUT #1, erik(zz, tt)
NEXT zz
FOR zz = 1 TO 10
INPUT #1, kunto(zz, tt)
NEXT zz
NEXT tt
FOR tt = 1 TO 20
INPUT #1, ex(tt), egf(tt), ega(tt), ep(tt), es(tt)
NEXT tt
FOR tt = 1 TO plkm
FOR zz = 1 TO 5
INPUT #1, valb(zz, tt)
NEXT zz
NEXT tt
FOR zz = 1 TO 64
INPUT #1, cup(zz)
NEXT zz
FOR tt = 1 TO 6
INPUT #1, elt(tt)
NEXT tt
FOR tt = 1 TO 30
INPUT #1, eri(tt)
NEXT tt
CLOSE #1

OPEN "savetus6.xxx" FOR INPUT AS #1
FOR tt = 1 TO 48 - plkm
FOR zz = 1 TO 3
INPUT #1, tauti(zz, tt), tkest(zz, tt)
NEXT zz
FOR zz = 1 TO 5
INPUT #1, top(tt, zz).nam, top(tt, zz).gls, top(tt, zz).ass, top(tt, zz).age, top(tt, zz).nat
NEXT zz
NEXT tt
FOR tt = 1 TO plkm
FOR zz = 1 TO 17
INPUT #1, skout(zz, tt)
NEXT zz
FOR zz = 1 TO 12
INPUT #1, veika(zz, tt)
NEXT zz
NEXT tt
CLOSE #1

OPEN "savetus7.xxx" FOR INPUT AS #1
FOR tt = 1 TO 48 + 6 + plkm
INPUT #1, mana(tt).nam, mana(tt).nat
FOR zz = 1 TO 6
INPUT #1, mtaito(zz, tt)
NEXT zz
NEXT tt
FOR tt = 1 TO 48
INPUT #1, man(tt)
NEXT tt
FOR tt = 1 TO 6
INPUT #1, rekord(tt).na, rekord(tt).jo, rekord(tt).ma, rekord(tt).sy, rekord(tt).pi
NEXT tt
FOR tt = 1 TO 3
INPUT #1, pisenj(tt), pisenp(tt), pisenohj(tt)
NEXT tt
CLOSE #1

OPEN "graf.xxx" FOR INPUT AS #1
FOR tt = 1 TO plkm
FOR zz = 1 TO 44
INPUT #1, graf(zz, tt)
NEXT zz
NEXT tt
CLOSE #1

CHDIR ".."
ladattu = 1
END SUB

SUB lt (lue$, lukux%)
DIM teksti(1 TO 1) AS STRING * 500
OPEN "data\" + lue$ + ".mhm" FOR BINARY AS #1
GET #1, 1 + (CLNG(lukux%) - 1) * 500, teksti(1)
text = RTRIM$(teksti(1))
ERASE teksti
IF lue$ = "y" AND lukux% > 145 AND lukux% < 166 AND argle = 1 THEN LOCATE , 41 - LEN(text)
FOR e = 1 TO LEN(text)
IF MID$(text, e, 1) = "$" THEN
COLOR ASC(MID$(text, e + 1, 1)) - 96
e = e + 1
GOTO yyteri
END IF
IF MID$(text, e, 1) = "œ" THEN
SELECT CASE VAL(MID$(text, e + 1, 1))
CASE 1
PRINT RTRIM$(l(xx)); " ("; RTRIM$(mana(man(xx)).nam); ")";
CASE 2
PRINT RTRIM$(mana(man(xx)).nam); " ("; RTRIM$(l(xx)); ")";
CASE 3
PRINT RTRIM$(l(xx));
CASE 4
PRINT RTRIM$(mana(xx).nam);
CASE 5
PRINT RTRIM$(mana(man(xx)).nam);
CASE 6
PRINT RTRIM$(mana(man(yy)).nam);
CASE 7
PRINT RTRIM$(l(potku));
CASE 8
PRINT RTRIM$(mana(man(potku)).nam);
CASE 9
PRINT RTRIM$(mana(yy).nam);
CASE 0
PRINT RTRIM$(l(yy));
END SELECT
e = e + 1
GOTO yyteri
END IF
IF MID$(text, e, 1) = "@" THEN
SELECT CASE VAL(MID$(text, e + 1, 1))
CASE 0
PRINT
CASE 1
PRINT RTRIM$(pel(xx, pv).nam); " ("; LTRIM$(STR$(pel(xx, pv).age)); ","; pelip(pel(xx, pv).ppp); ","; LTRIM$(STR$(pel(xx, pv).psk)); ")";
CASE 2
PRINT RTRIM$(top(tox(xx), 1).nam);
CASE 3
PRINT kansap(xx);
CASE 4
IF rahna < 0 THEN PRINT LTRIM$(STR$(-rahna));  ELSE PRINT LTRIM$(STR$(rahna));
CASE 5
PRINT LTRIM$(STR$(gnome));
CASE 6
colchk 1
PRINT RTRIM$(mana(man(u(pv))).nam);
CASE 7
PRINT RTRIM$(pel(yy, pv).nam); " ("; LTRIM$(STR$(pel(yy, pv).age)); ","; pelip(pel(yy, pv).ppp); ","; LTRIM$(STR$(pel(yy, pv).psk)); ")";
END SELECT
e = e + 1
GOTO yyteri
END IF
IF MID$(text, e, 1) <> "$" AND MID$(text, e, 1) <> "œ" AND MID$(text, e, 1) <> "@" THEN PRINT MID$(text, e, 1);
IF lue$ <> "y" AND lue$ <> "st" THEN
IF POS(CSRLIN) > 65 AND MID$(text, e, 1) = " " THEN PRINT
END IF
yyteri:
NEXT e
CLOSE #1
IF lue$ <> "y" AND lue$ <> "st" THEN PRINT
END SUB

SUB maaritakarakter
kurso = 1

IF vai(1, pv) < 3 THEN
curso = (3 - vai(1, pv)) * 3
ELSE
curso = 0
END IF

CLS
LOCATE 1, 1
COLOR 6
PRINT "MANAGERI ";
colchk 1
PRINT RTRIM$(nimi(pv));
COLOR 6
PRINT "!"
PRINT
lt "al", 10

LOCATE 8, 27
COLOR 15
PRINT "-3 -2 -1 ñ0 +1 +2 +3"

DO
hahaa 5
LOCATE 8, 1
COLOR 6
PRINT "PISTEITŽ VAPAANA: ";
COLOR 15
PRINT LTRIM$(STR$(curso)); "   "
FOR xx = 1 TO 6
IF kurso = xx THEN COLOR , 6 ELSE COLOR , 0
LOCATE 8 + (xx * 2), 18 - LEN(mtnimi(xx))
COLOR 14: PRINT mtnimi(xx)
LOCATE 8 + (xx * 2), 27
FOR qwe = -3 TO 3
IF mtaito(xx, 54 + pv) = qwe THEN COLOR 10, 0 ELSE COLOR 2, 0
IF mtaito(xx, 54 + pv) = qwe THEN PRINT "²²";  ELSE PRINT "°°";
IF qwe < 3 THEN COLOR 2: PRINT "°";
NEXT qwe
NEXT xx


LOCATE 22, 1
COLOR 0, 0
FOR xx = 1 TO 8
PRINT STRING$(80, " ")
NEXT xx
LOCATE 22, 1
lt "x", 61 + kurso

wnd 1
ku 1, 1, 6

IF me$ = CHR$(0) + CHR$(75) THEN
IF mtaito(kurso, 54 + pv) > -3 THEN mtaito(kurso, 54 + pv) = mtaito(kurso, 54 + pv) - 1: curso = curso + 1
END IF

IF me$ = CHR$(0) + CHR$(77) THEN
IF mtaito(kurso, 54 + pv) < 3 AND curso > 0 THEN mtaito(kurso, 54 + pv) = mtaito(kurso, 54 + pv) + 1: curso = curso - 1
END IF

IF me$ = CHR$(13) AND curso = 0 THEN EXIT DO
LOOP


END SUB

SUB mahmax
nam = INT(genre(nats) * RND) + 1
OPEN "data\" + LTRIM$(STR$(nats)) + ".mhx" FOR INPUT AS #1
FOR gnome = 1 TO nam
INPUT #1, ptemp$
NEXT gnome
CLOSE #1
IF nats = 1 THEN krj$ = krjn(INT(16 * RND) + 1) ELSE krj$ = krjn(INT(23 * RND) + 1)
END SUB

SUB muutmestarit

ccc = 49

a = 1: b = 10: c = 3: GOSUB jez
a = 11: b = 18: c = 2: GOSUB jez
a = 19: b = 26: c = 3: GOSUB jez
a = 27: b = 34: c = 2: GOSUB jez
a = 35: b = 43: c = 2: GOSUB jez
a = 44: b = 46: c = 1: GOSUB jez
a = 47: b = 70: c = 4: GOSUB jez

gnome = INT(16 * RND) + 1
FOR zz = ccc TO ccc + 4
OPEN "data\teams.nhl" FOR INPUT AS #1
FOR zzz = 1 TO gnome
INPUT #1, l(zz), kk(zz), tazo(zz), ppiste(zz), taso(zz), paikka(1, zz), paikka(2, zz), paikka(3, zz)
NEXT zzz
gnome = gnome + 1
CLOSE #1
NEXT zz
EXIT SUB

jez:
qwe = b - a + 1
DIM tempera(1 TO qwe) AS INTEGER

d = 1
FOR gnome = a TO b
tempera(d) = gnome
d = d + 1
NEXT gnome

FOR gnome = 1 TO 1000
        d = INT(UBOUND(tempera) * RND) + 1
        e = INT(UBOUND(tempera) * RND) + 1
        IF d <> e THEN SWAP tempera(d), tempera(e)
NEXT gnome


FOR d = 1 TO c
OPEN "data\teams.for" FOR INPUT AS #1

FOR zzz = 1 TO tempera(d)
INPUT #1, l(ccc), kk(ccc), tazo(ccc), ppiste(ccc), taso(ccc), paikka(1, ccc), paikka(2, ccc), paikka(3, ccc)
tazo(ccc) = tazo(ccc) + INT(3 * RND) - 1
NEXT zzz
ccc = ccc + 1
CLOSE #1
NEXT d

ERASE tempera
RETURN

END SUB

SUB omajoukkue
max% = 1

kurso = max%
COLOR , 0: CLS
LOCATE 1, 1: COLOR 15: PRINT "MINKŽ JOUKKUEEN KORVAAT OMALLASI?"
COLOR 2
LOCATE 3, 1: PRINT "PHL";
LOCATE 18, 1: PRINT "MUTASARJA, LOHKO 1";
LOCATE 3, 41: PRINT "DIVISIOONA";
LOCATE 18, 41: PRINT "MUTASARJA, LOHKO 2";
DO

FOR zz = 1 TO 48
xx = x(zz)
IF zz < 13 THEN LOCATE 4 + zz, 1 ELSE IF zz < 25 THEN LOCATE 4 + zz - 12, 41 ELSE IF zz < 37 THEN LOCATE 4 + zz - 9, 1 ELSE LOCATE 4 + zz - 21, 41
IF (sed(xx) + sedd(xx) + seddd(xx)) / 3 >= a THEN COLOR 14 ELSE COLOR 8
IF ohj(xx) <> 0 THEN COLOR 8
IF kurso = zz THEN COLOR , 6 ELSE COLOR , 0
PRINT l(xx); " ("; materia(materiax(tazo(xx))); ")";
NEXT zz

COLOR , 0
FOR qwe = 1 TO 9
LOCATE qwe + 32, 1
PRINT STRING$(37, " ");
NEXT qwe

LOCATE 33, 1
COLOR 15
PRINT "JOUKKUEEN KOTIKAUPUNKI: ";
COLOR 7
PRINT kk(x(kurso))
LOCATE 35, 1
COLOR 15
PRINT "JOUKKUEEN AREENA"
LOCATE 36, 1
COLOR 7: PRINT "("; haln(x(kurso)); ")"
LOCATE 38, 1
COLOR 6
PRINT "VIIHTYISYYSTASO  ";
COLOR 14
PRINT LTRIM$(STR$(taso(x(kurso)))); "/6"
FOR qwe = 1 TO 2
COLOR 6
LOCATE , 1: PRINT paiknim(qwe);
LOCATE , 18
COLOR 14: PRINT LTRIM$(STR$(CLNG(paikka(qwe, x(kurso))) * 100))
NEXT qwe
COLOR 6
LOCATE , 1: PRINT paiknim(3);
LOCATE , 18
COLOR 14: IF paikka(3, x(kurso)) = 1 THEN PRINT "KYLLŽ" ELSE PRINT "EI"

wnd 1
IF kurso > 12 THEN
IF me$ = CHR$(0) + CHR$(75) THEN kurso = kurso - 12
END IF
IF kurso < 37 THEN
IF me$ = CHR$(0) + CHR$(77) THEN kurso = kurso + 12
END IF
IF kurso > 1 THEN
IF me$ = CHR$(0) + CHR$(72) THEN kurso = kurso - 1
END IF
IF kurso < 48 THEN
IF me$ = CHR$(0) + CHR$(80) THEN kurso = kurso + 1
END IF

IF me$ = CHR$(13) AND ohj(x(kurso)) = 0 AND (sed(x(kurso)) + sedd(x(kurso)) + seddd(x(kurso))) / 3 >= a THEN EXIT DO
LOOP

u(pv) = x(kurso)
ohj(u(pv)) = pv

DIM ntemp(26) AS STRING * 1
jepulisz:
me$ = ""
COLOR , 0: CLS
kurso = 1

COLOR 6
PRINT "NIMEŽ JOUKKUEESI, MANAGERI ";
colchk 1
PRINT nimi(pv)
COLOR 14
DO
FOR zz = 1 TO 26
LOCATE 3, zz + 1: PRINT ntemp(zz);
NEXT zz
LOCATE 3, kurso + 1: PRINT "Û"
wnd 1
IF ASC(me$) >= 33 AND kurso < 11 THEN ntemp(kurso) = me$: kurso = kurso + 1
IF me$ = CHR$(8) AND kurso > 1 THEN ntemp(kurso - 1) = "": kurso = kurso - 1
IF me$ = CHR$(32) AND kurso < 10 THEN ntemp(kurso) = " ": kurso = kurso + 1
IF me$ = CHR$(13) THEN EXIT DO
LOOP
COLOR , 0
LOCATE 3, kurso + 1: PRINT " "

mukka = kurso - 1

IF mukka = 0 THEN GOTO jepulisz
me$ = ""
FOR zzz = 1 TO mukka
me$ = me$ + ntemp(zzz)
NEXT zzz
l(u(pv)) = me$
ERASE ntemp

DIM ntemp(26) AS STRING * 1
kurso = 1

jepulisx:

COLOR 6: LOCATE 5, 1
PRINT "JOUKKUEESI KOTIKAUPUNKI, MANAGERI ";
colchk 1
PRINT nimi(pv)
COLOR 14
DO
FOR zz = 1 TO 26
LOCATE 7, zz + 1: PRINT ntemp(zz);
NEXT zz
LOCATE 7, kurso + 1: PRINT "Û"
wnd 1
IF ASC(me$) >= 33 AND kurso < 13 THEN ntemp(kurso) = me$: kurso = kurso + 1
IF me$ = CHR$(8) AND kurso > 1 THEN ntemp(kurso - 1) = "": kurso = kurso - 1
IF me$ = CHR$(32) AND kurso < 12 THEN ntemp(kurso) = " ": kurso = kurso + 1
IF me$ = CHR$(13) THEN EXIT DO
LOOP
LOCATE 7, kurso + 1: PRINT " "

mukka = kurso - 1

IF mukka = 0 THEN GOTO jepulisx

me$ = ""
FOR zzz = 1 TO mukka
me$ = me$ + ntemp(zzz)
NEXT zzz
kk(u(pv)) = me$

ERASE ntemp

annanimihallille

END SUB

SUB oppnas2
CHDIR "data"

OPEN "teams.pln" FOR INPUT AS #1
FOR ooo = 1 TO 48
INPUT #1, l(ooo), kk(ooo), sr(ooo), sed(ooo), sedd(ooo), seddd(ooo), tazo(ooo), ppiste(ooo), taso(ooo), paikka(1, ooo), paikka(2, ooo), paikka(3, ooo)
IF ooo < 49 THEN INPUT #1, haln(ooo)
NEXT ooo
CLOSE #1
FOR zz = 1 TO 7
karki(zz) = zz
NEXT zz

OPEN "managers.m2k" FOR INPUT AS #1
FOR xx = 1 TO 54
INPUT #1, mana(xx).nam, mana(xx).nat
FOR xxx = 1 TO 6
INPUT #1, mtaito(xxx, xx)
NEXT xxx
NEXT xx
CLOSE #1

CHDIR ".."
END SUB

SUB options

kurso = 3
LOCATE 30, 1
COLOR 6
PRINT "VALITSE VAIKEUSTASOSI"
DO
FOR z = 1 TO 5
IF kurso = z THEN COLOR 14, 6 ELSE COLOR 14, 0
LOCATE 31 + z, 2: lt "al", 4 + z
NEXT z
COLOR 12, 0
LOCATE 38, 1
FOR z = 1 TO 4
PRINT STRING$(78, " ")
NEXT z
LOCATE 38, 1
lt "x", kurso

wnd 1
ku 1, 1, 5
IF me$ = CHR$(13) THEN vai(1, pv) = kurso: EXIT DO
LOOP

vai(4, pv) = 4 + vai(1, pv) * 2

SELECT CASE vai(1, pv)
CASE 1
vai(2, pv) = 1
vai(3, pv) = 200

CASE 2
vai(2, pv) = 2
vai(3, pv) = 140

CASE 3
vai(2, pv) = 2
vai(3, pv) = 120

CASE 4
vai(2, pv) = 2
vai(3, pv) = 100

CASE 5
vai(2, pv) = 3
vai(3, pv) = 90

END SELECT

kurso = 1

carlosmoya:

sin1 = 0

IF otte(1, 1, pv) = 0 THEN sin2 = 0 ELSE sin2 = ((1 * vsaldo(1, 1, pv) + .5 * vsaldo(1, 2, pv)) / otte(1, 1, pv)) * 100
PRINT sin2

sin1 = sin1 + (otte(1, 1, pv) * .3) * (1 + ((sin2 - 50) * .004))

IF otte(2, 1, pv) = 0 THEN sin2 = 0 ELSE sin2 = ((1 * vsaldo(2, 1, pv) + .5 * vsaldo(2, 2, pv)) / otte(2, 1, pv)) * 100
PRINT sin2
sin1 = sin1 + (otte(2, 1, pv) * .2) * (1 + ((sin2 - 50) * .004))

IF otte(3, 1, pv) = 0 THEN sin2 = 0 ELSE sin2 = ((1 * vsaldo(3, 1, pv) + .5 * vsaldo(3, 2, pv)) / otte(3, 1, pv)) * 100
PRINT sin2
sin1 = sin1 + (otte(3, 1, pv) * .1) * (1 + ((sin2 - 50) * .004))

sin1 = sin1 + (otte(1, 2, pv) * 1)
sin1 = sin1 + (otte(2, 2, pv) * .6)
sin1 = sin1 + (otte(3, 2, pv) * .3)

sin1 = sin1 + otte(4, 1, pv) * 1
sin1 = sin1 + otte(4, 2, pv) * 10

sin1 = sin1 + saav(1, pv) * 20
sin1 = sin1 + saav(2, pv) * 15
sin1 = sin1 + saav(3, pv) * 10
sin1 = sin1 + saav(4, pv) * 20
sin1 = sin1 + saav(5, pv) * 10
sin1 = sin1 + saav(6, pv) * -10
sin1 = sin1 + saav(7, pv) * 15

sin1 = FIX(sin1)

SELECT CASE sin1
CASE 0 TO 6
a = 44
CASE 7 TO 12
a = 40
CASE 13 TO 18
a = 35
CASE 21 TO 30
a = 29
CASE 31 TO 50
a = 23
CASE 51 TO 80
a = 18
CASE 81 TO 110
a = 14
CASE 121 TO 150
a = 10
CASE 151 TO 200
a = 8
CASE 201 TO 300
a = 6
CASE 301 TO 400
a = 4
CASE 401 TO 500
a = 3
CASE IS >= 501
a = 1
END SELECT

COLOR , 0
CLS
hahaa 4

LOCATE 1, 1: COLOR 15: PRINT "VALITSE JOUKKUEESI (PELAAJAMATERIAALI)"
COLOR 2
LOCATE 3, 1: PRINT "PHL";
LOCATE 18, 1: PRINT "MUTASARJA, LOHKO 1";
LOCATE 3, 41: PRINT "DIVISIOONA";
LOCATE 18, 41: PRINT "MUTASARJA, LOHKO 2";

DO
FOR zz = 1 TO 48
xx = x(zz)
IF zz < 13 THEN LOCATE 4 + zz, 1 ELSE IF zz < 25 THEN LOCATE 4 + zz - 12, 41 ELSE IF zz < 37 THEN LOCATE 4 + zz - 9, 1 ELSE LOCATE 4 + zz - 21, 41
IF (sed(xx) + sedd(xx) + seddd(xx)) / 3 >= a THEN COLOR 14 ELSE COLOR 8
IF ohj(xx) <> 0 THEN COLOR 8
IF kurso = zz THEN COLOR , 6 ELSE COLOR , 0
PRINT l(xx);
PRINT " ("; materia(materiax(tazo(xx))); ")";
NEXT zz

LOCATE 33, 41
IF kurso = 49 THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT "OMA JOUKKUE";

COLOR , 0
FOR qwe = 1 TO 9
LOCATE qwe + 32, 1
PRINT STRING$(37, " ");
NEXT qwe

IF kurso < 49 THEN
LOCATE 33, 1
COLOR 15
PRINT "JOUKKUEEN KOTIKAUPUNKI: ";
COLOR 7
PRINT kk(x(kurso))
LOCATE 35, 1
COLOR 15
PRINT "JOUKKUEEN AREENA"
LOCATE 36, 1
COLOR 7: PRINT "("; haln(x(kurso)); ")"
LOCATE 38, 1
COLOR 6
PRINT "VIIHTYISYYSTASO  ";
COLOR 14
PRINT LTRIM$(STR$(taso(x(kurso)))); "/6"
FOR qwe = 1 TO 2
COLOR 6
LOCATE , 1: PRINT paiknim(qwe);
LOCATE , 18
COLOR 14: PRINT LTRIM$(STR$(CLNG(paikka(qwe, x(kurso))) * 100))
NEXT qwe
COLOR 6
LOCATE , 1: PRINT paiknim(3);
LOCATE , 18
COLOR 14: IF paikka(3, x(kurso)) = 1 THEN PRINT "KYLLŽ" ELSE PRINT "EI"
END IF

wnd 1
IF kurso > 12 THEN
IF me$ = CHR$(0) + CHR$(75) THEN kurso = kurso - 12
END IF
IF kurso < 37 THEN
IF me$ = CHR$(0) + CHR$(77) THEN kurso = kurso + 12
END IF
IF kurso > 1 THEN
IF me$ = CHR$(0) + CHR$(72) THEN kurso = kurso - 1
END IF
IF kurso < 49 THEN
IF me$ = CHR$(0) + CHR$(80) THEN kurso = kurso + 1
END IF

IF me$ = CHR$(13) AND kurso < 49 THEN
IF ohj(x(kurso)) = 0 AND (sed(x(kurso)) + sedd(x(kurso)) + seddd(x(kurso))) / 3 >= a THEN EXIT DO
END IF
IF me$ = CHR$(13) AND kurso = 49 THEN EXIT DO
IF me$ = "?" THEN qelp 19: GOTO carlosmoya

LOOP

IF kurso = 49 THEN
omajoukkue
EXIT SUB
END IF

u(pv) = x(kurso)
ohj(u(pv)) = pv

END SUB

SUB orgamaar (ork%)

DIM orgasm(1 TO 48) AS INTEGER
OPEN "data\orgasm.m2k" FOR INPUT AS #1
FOR b = 1 TO 48
INPUT #1, orgasm(b)
NEXT b
CLOSE #1

d = orgasm(CINT(((sed(ork%) + sedd(ork%) + seddd(ork%))) / 3))

OPEN "data\orga.m2k" FOR INPUT AS #1
FOR ww = 1 TO d
INPUT #1, erik(1, ork%), erik(2, ork%), erik(3, ork%), erik(4, ork%)

SELECT CASE ohj(ork%)
CASE 0
INPUT #1, rahna, rahna, rahna, rahna, rahna, rahna, rahna
CASE ELSE
INPUT #1, valb(1, ohj(ork%)), valb(2, ohj(ork%)), valb(3, ohj(ork%)), valb(4, ohj(ork%)), valb(5, ohj(ork%)), c, raha(ohj(ork%))
END SELECT
NEXT ww
CLOSE #1

IF ohj(ork%) <> 0 THEN
FOR ww = 2 TO 17
skout(ww, ohj(ork%)) = 0
NEXT ww

FOR ww = 1 TO c
pimpero:
b = INT(16 * RND) + 2
IF skout(b, ohj(ork%)) = 0 THEN skout(b, ohj(ork%)) = 1 ELSE GOTO pimpero
NEXT ww

junnu(ohj(ork%)) = valb(3, ohj(ork%)) * 2
END IF

ERASE orgasm

END SUB

SUB palkmaar
potenssix = potenssi + (neup.psk * potenssiplus)
sin1 = neup.psk ^ potenssix
rahna = CLNG(sin1 * perusraha)
IF neup.ppp <> 1 THEN
rahna = rahna * (1 + ((neup.avo + neup.yvo) * xvolisa))
END IF
rahna = rahna * (1 + ((-6 + neup.ldr) * johlisa))
rahna = rahna * (1 + ((-10 + neup.kar) * karlisa))
END SUB

SUB piraatti
CLOSE
CLS
lt "x", 48
COLOR 7
SYSTEM
END SUB

SUB pirtar1
pirtar(1) = 678
END SUB

SUB pirtar2
pirtar(2) = 432
END SUB

SUB pirtar3
pirtar(3) = 101
END SUB

SUB pirtar4
pirtar(4) = 723
END SUB

SUB pirtar5
pirtar(5) = 509
END SUB

SUB pirtar6
pirtar(6) = 993
END SUB

SUB pirtar7
pirtar(7) = 1048
END SUB

SUB pjn
IF a = 0 THEN LOCATE 25, 1 ELSE LOCATE 43, 1
COLOR 14: PRINT "PAINA JOTAKIN NŽPPŽINTŽ...";
WHILE INKEY$ = "": WEND
END SUB

SUB printident
SHARED ident() AS INTEGER, jokke() AS STRING, nimmi() AS STRING, kurso AS INTEGER, tokke() AS INTEGER

COLOR , 0
FOR zz = 1 TO 10
IF zz = 1 THEN zzz = 5 ELSE zzz = 4
LOCATE 9 + zz, zzz
PRINT STRING$(34, " ");
NEXT zz

LOCATE 10, 5
COLOR 7, 0
IF ident(kurso) = 0 THEN PRINT "TYHJŽ"; : EXIT SUB

LOCATE 10, 5
COLOR 7
PRINT LTRIM$(STR$(cauzi(kurso))); "-"; LTRIM$(STR$(cauzi(kurso) + 1))

FOR zz = 1 TO ident(kurso)
LOCATE 10 + zz + (zz - 1), 4
COLOR 2
PRINT "º";
COLOR 15
PRINT nimmi(zz, kurso)
LOCATE 11 + zz + (zz - 1), 4
COLOR 2
PRINT "º ";
COLOR 14
PRINT jokke(zz, kurso);
PRINT " ";
SELECT CASE tokke(zz, kurso)
CASE 1
PRINT "(PHL)";
CASE 2
PRINT "(1.DIVISIOONA)";
CASE 3
PRINT "(MUTASARJA)";
END SELECT
NEXT zz
END SUB

SUB qelp (qel%)
COLOR , 0
CLS : COLOR 7
OPEN "help\" + LTRIM$(STR$(qel%)) + ".hlp" FOR INPUT AS #1
DO UNTIL EOF(1)
LINE INPUT #1, text$
IF CSRLIN < 41 THEN PRINT text$ ELSE pjn: CLS : COLOR 7: PRINT text$
LOOP
CLOSE #1
pjn
END SUB

SUB rela
blanko.ppp = keisix(2, INT(100 * RND) + 1)
blanko.age = keisix(3, INT(100 * RND) + 1)
blanko.ego = keisix(4, INT(100 * RND) + 1)
blanko.ldr = keisix(5, INT(((100 * RND) + (100 * RND)) / 2) + 1)
blanko.kar = keisix(6, INT(((100 * RND) + (100 * RND)) / 2) + 1)
blanko.yvo = keisix(7, INT(100 * RND) + 1)
blanko.avo = keisix(7, INT(100 * RND) + 1)
mahmax
blanko.nam = krj$ + "." + ptemp$
blanko.nat = nats
END SUB

SUB sarjamaaralku

a = 0
b = 0
c = 0

FOR xx = 1 TO 48
IF sr(xx) = 1 THEN x(1 + a) = xx: a = a + 1
IF sr(xx) = 2 THEN x(13 + b) = xx: b = b + 1
IF sr(xx) = 3 THEN x(25 + c) = xx: c = c + 1
NEXT xx

FOR xx = 1 TO 1000
a = INT(24 * RND) + 25
b = INT(24 * RND) + 25
IF a <> b THEN SWAP x(a), x(b)
NEXT xx

naima:
FOR xx = 25 TO 35
FOR xxx = xx + 1 TO 36
IF sed(x(xx)) > sed(x(xxx)) THEN SWAP x(xxx), x(xx): GOTO naima
NEXT xxx
NEXT xx

naima2:
FOR xx = 37 TO 47
FOR xxx = xx + 1 TO 48
IF sed(x(xx)) > sed(x(xxx)) THEN SWAP x(xxx), x(xx): GOTO naima2
NEXT xxx
NEXT xx

END SUB

SUB tasomaar
DIM lvl(1 TO 80) AS tazzo

OPEN "data\tasot.m2k" FOR INPUT AS #1
FOR zz = 1 TO 58
INPUT #1, lvl(zz).maz, lvl(zz).puz, lvl(zz).hyz
NEXT zz
CLOSE #1

FOR zz = 1 TO 86
mw(zz) = lvl(tazo(zz)).maz
pw(zz) = lvl(tazo(zz)).puz
hw(zz) = lvl(tazo(zz)).hyz
mw(zz) = mw(zz) + INT(3 * RND) - 1
pw(zz) = pw(zz) + INT(5 * RND) - 2
hw(zz) = hw(zz) + INT(9 * RND) - 4

IF zz < 49 THEN orgamaar zz

NEXT zz

ERASE lvl
END SUB

SUB topmaar
toxik = 1
FOR zzz = 1 TO 48
IF ohj(zzz) = 0 THEN tox(zzz) = toxik: toxik = toxik + 1
NEXT zzz
COLOR 14

FOR zz = 1 TO 48 - plkm
FOR zzz = 1 TO 3
tauti(zzz, zz) = 0
tkest(zzz, zz) = 0
NEXT zzz
NEXT zz

FOR zz = 1 TO 48
tautip(zz) = 1
tautik(zz) = 0
NEXT zz
END SUB

SUB tyhjennalokero
SHARED kurso AS INTEGER

COLOR 7
LOCATE 25, 1: PRINT STRING$(79, " ");
LOCATE 25, 1: PRINT "HALUATKO TYHJENTŽŽ TALLENNUSPAIKAN? (K/E)";

wnd 2
IF me$ = "e" THEN EXIT SUB

CHDIR "game_" + LTRIM$(STR$(kurso))
KILL "*.*"
OPEN "gameid.gam" FOR OUTPUT AS #1
WRITE #1, "0"
CLOSE #1
CHDIR ".."
END SUB

SUB uusipeli

SHELL "copy brun45.exe game_" + LTRIM$(STR$(lokero))

saver% = 60
savertype% = 1
ki = 1
kr = kierrosmax
kausi = 1998

muutmestarit
historia

tasomaar

FOR pv = 1 TO plkm
gene
NEXT pv

END SUB

SUB uusipeliman

FOR zz = 1 TO 48
IF ohj(zz) = 0 THEN man(zz) = tox(zz)
NEXT zz

FOR z = 1 TO 500
xx = INT(48 * RND) + 1
xxx = INT(48 * RND) + 1
IF ohj(xx) = 0 AND ohj(xxx) = 0 AND xxx <> xx THEN SWAP man(xx), man(xxx)
NEXT z


FOR ggg = 1 TO plkm
man(u(ggg)) = 48 + 6 + ggg
NEXT ggg

END SUB

SUB uusipelitop
DIM reva(1 TO 48) AS INTEGER

FOR zz = 1 TO 48
reva(zz) = 1
NEXT zz

FOR zz = 1 TO 48 - plkm
FOR zzz = 1 TO 5
nats = keisix(1, INT(50 * RND) + 1)
mahmax
top(zz, zzz).nam = krj$ + "." + ptemp$
top(zz, zzz).age = keisix(3, 99 * RND + 1)
top(zz, zzz).nat = nats
NEXT zzz
NEXT zz


OPEN "data\tahdet.m2k" FOR INPUT AS #1

INPUT #1, cupex

FOR ww = 1 TO cupex

INPUT #1, qwe, me$, z, zz, zzz

SELECT CASE ohj(qwe)
CASE 0
top(tox(qwe), reva(qwe)).nam = me$
top(tox(qwe), reva(qwe)).nat = zz
top(tox(qwe), reva(qwe)).age = z
reva(qwe) = reva(qwe) + 1

CASE ELSE
pv = ohj(qwe)
etsipel zzz
pel(xx, pv).nam = me$
pel(xx, pv).nat = zz
pel(xx, pv).age = z

END SELECT

NEXT ww
CLOSE







ERASE reva
END SUB

SUB valitsekansallisuus
kurso = 1
LOCATE 6, 1
COLOR 6, 0: PRINT "VALITSE KANSALLISUUTESI"
DO
FOR zz = 1 TO 22
IF zz = kurso THEN COLOR 14, 6 ELSE COLOR 14, 0
IF zz < 15 THEN LOCATE 7 + zz, 2 ELSE LOCATE 7 + zz - 14, 15
7 PRINT kansap(zz);
NEXT zz
COLOR 1, 14
wnd 1
IF me$ = CHR$(0) + CHR$(72) AND kurso > 1 THEN kurso = kurso - 1
IF me$ = CHR$(0) + CHR$(80) AND kurso < 22 THEN kurso = kurso + 1
IF me$ = CHR$(0) + CHR$(75) AND kurso > 14 THEN kurso = kurso - 14
IF me$ = CHR$(0) + CHR$(77) AND kurso < 9 THEN kurso = kurso + 14
IF me$ = CHR$(13) THEN EXIT DO
LOOP

mana(54 + pv).nat = kurso

COLOR , 0
LOCATE 30, 1
lt "x", 200

kurso = 1
LOCATE 24, 1: COLOR 6, 0: PRINT "MANAGERINA OLET..."
DO
IF kurso = 1 THEN COLOR 14, 6 ELSE COLOR 14, 0
LOCATE 26, 2: PRINT "UUSI KASVO";
IF kurso = 2 THEN COLOR 14, 6 ELSE COLOR 14, 0
LOCATE 27, 2: PRINT "KOKENUT KONKARI";
IF kurso = 3 THEN COLOR 14, 6 ELSE COLOR 14, 0
LOCATE 28, 2: PRINT "ELŽVŽ LEGENDA";

wnd 1
ku 1, 1, 3
IF me$ = CHR$(13) THEN EXIT DO
LOOP

SELECT CASE kurso
CASE 1

CASE 2
otte(1, 1, pv) = 44 * 4
otte(1, 2, pv) = 16
vsaldo(1, 1, pv) = 74
vsaldo(1, 2, pv) = 17
vsaldo(1, 3, pv) = 85

otte(2, 1, pv) = 44 * 3
otte(2, 2, pv) = 20
vsaldo(2, 1, pv) = 83
vsaldo(2, 2, pv) = 8
vsaldo(2, 3, pv) = 41

otte(3, 1, pv) = 44 * 2
otte(3, 2, pv) = 16
vsaldo(3, 1, pv) = 59
vsaldo(3, 2, pv) = 6
vsaldo(3, 3, pv) = 23

saav(3, pv) = 1
saav(5, pv) = 2

CASE 3
otte(1, 1, pv) = 44 * 15
otte(1, 2, pv) = 93
vsaldo(1, 1, pv) = 343
vsaldo(1, 2, pv) = 84
vsaldo(1, 3, pv) = 233

otte(2, 1, pv) = 44 * 3
otte(2, 2, pv) = 20
vsaldo(2, 1, pv) = 83
vsaldo(2, 2, pv) = 8
vsaldo(2, 3, pv) = 41

otte(3, 1, pv) = 44 * 2
otte(3, 2, pv) = 16

otte(4, 1, pv) = 48
otte(4, 2, pv) = 3

vsaldo(3, 1, pv) = 59
vsaldo(3, 2, pv) = 6
vsaldo(3, 3, pv) = 23

saav(1, pv) = 3
saav(2, pv) = 3
saav(3, pv) = 2
saav(4, pv) = 1
saav(5, pv) = 2

END SELECT

COLOR , 0
FOR c = 30 TO 39
PRINT STRING$(80, " ");
NEXT c

END SUB

SUB valitsestrattie
ERASE sort
FOR a = 1 TO 3
IF a = 1 THEN b = 1: c = 12: d = 12 ELSE IF a = 2 THEN b = 13: c = 24: d = 12 ELSE b = 25: c = 48: d = 24
FOR zz = 1 TO plkm
IF sr(u(zz)) = a THEN d = d - 1
NEXT zz
DIM koko(1 TO 3) AS SINGLE
DIM proxy(1 TO 4, 1 TO d) AS SINGLE
DIM sort(1 TO d) AS INTEGER
DIM mahd(1 TO 3) AS INTEGER
temp% = 1
FOR xx = b TO c
IF ohj(x(xx)) = 0 THEN
koko(1) = koko(1) + mw(x(xx))
koko(2) = koko(2) + pw(x(xx))
koko(3) = koko(3) + hw(x(xx))
sort(temp%) = x(xx): temp% = temp% + 1
END IF
NEXT xx
FOR xx = 1 TO 3
koko(xx) = koko(xx) / d
NEXT xx
FOR xx = 1 TO d
proxy(1, xx) = mw(sort(xx)) / koko(1)
proxy(2, xx) = pw(sort(xx)) / koko(2)
proxy(3, xx) = hw(sort(xx)) / koko(3)
proxy(4, xx) = (proxy(1, xx) + proxy(2, xx) + proxy(3, xx)) / 3
SELECT CASE proxy(4, xx)
CASE IS <= .7
mahd(1) = 20: mahd(2) = 40: mahd(3) = 40
CASE .7000001 TO .8
mahd(1) = 10: mahd(2) = 40: mahd(3) = 50
CASE .8000001 TO .9
mahd(1) = 20: mahd(2) = 30: mahd(3) = 50
CASE .9000001 TO .95
mahd(1) = 30: mahd(2) = 10: mahd(3) = 60
CASE .9500001 TO 1.05
mahd(1) = 48: mahd(2) = 4: mahd(3) = 48
CASE 1.050001 TO 1.1
mahd(1) = 70: mahd(2) = 1: mahd(3) = 29
CASE 1.100001 TO 1.2
mahd(1) = 85: mahd(2) = 0: mahd(3) = 15
CASE IS >= 1.200001
mahd(1) = 100: mahd(2) = 0: mahd(3) = 0
END SELECT
IF man(sort(xx)) = 33 THEN mahd(1) = 100: mahd(2) = 0: mahd(3) = 0
gnome = INT((mahd(1) + mahd(2) + mahd(3)) * RND) + 1
SELECT CASE gnome
CASE 1 TO mahd(1)
valm(sort(xx)) = 1
CASE mahd(1) + 1 TO mahd(1) + mahd(2)
valm(sort(xx)) = 2
CASE mahd(1) + mahd(2) + 1 TO mahd(1) + mahd(2) + mahd(3)
valm(sort(xx)) = 3
END SELECT
NEXT xx
ERASE proxy, koko, sort, mahd
NEXT a
END SUB

SUB vihat
kurso = 0
COLOR , 0: CLS
COLOR 6
PRINT "TERVETULOA VIHARUUTUJEN PARIIN, JUONTAJANA ";
COLOR 14
PRINT "Y™VI™ PYYSALO!"
COLOR 6
PRINT "VALITSE YKSI SEURAAVISTA VIHAVAIHTOEHDOISTA!"
LOCATE 20, 1: COLOR 12: lt "x", 90
hahaa 6


DO
IF kurso = 0 THEN COLOR 9, 9 ELSE COLOR 9, 0
LOCATE 4, 1: PRINT "EN HALUA VIHATA...";

FOR zz = 1 TO 48
IF ohj(x(zz)) = 0 THEN COLOR 14 ELSE COLOR 8
IF kurso = zz AND ohj(x(zz)) = 0 THEN COLOR , 6 ELSE IF kurso = zz THEN COLOR , 7 ELSE COLOR , 0
IF zz < 13 THEN LOCATE 5 + zz, 1 ELSE IF zz < 25 THEN LOCATE 5 + zz - 12, 21 ELSE IF zz < 37 THEN LOCATE 5 + zz - 24, 41 ELSE LOCATE 5 + zz - 36, 61
PRINT RTRIM$(l(x(zz))); "-VIHA";
NEXT zz

wnd 1
IF kurso > 12 THEN
IF me$ = CHR$(0) + CHR$(75) THEN kurso = kurso - 12
END IF
IF kurso < 37 THEN
IF me$ = CHR$(0) + CHR$(77) THEN kurso = kurso + 12
END IF
IF kurso > 0 THEN
IF me$ = CHR$(0) + CHR$(72) THEN kurso = kurso - 1
END IF
IF kurso < 48 THEN
IF me$ = CHR$(0) + CHR$(80) THEN kurso = kurso + 1
END IF
IF me$ = CHR$(13) AND kurso = 0 THEN EXIT DO
IF kurso > 0 THEN
IF me$ = CHR$(13) AND ohj(x(kurso)) = 0 THEN EXIT DO
END IF
LOOP

IF kurso > 0 THEN
gnome = x(kurso)

l(gnome) = "Blackheads"
kk(gnome) = "Hirvikoski"
tazo(gnome) = 13
mw(gnome) = 6
pw(gnome) = 30
hw(gnome) = 56
sed(gnome) = 48
sedd(gnome) = 48
seddd(gnome) = 48

FOR zz = 1 TO 3
tkaus(zz, gnome) = 0
NEXT zz
tkaus(3, gnome) = 3

FOR zz = 1 TO 5
tsaav(zz, gnome) = 0
NEXT zz

ppiste(gnome) = 8
taso(gnome) = 1
paikka(1, gnome) = 6
paikka(2, gnome) = 2
paikka(3, gnome) = 0

haln(gnome) = "Loimaan Kunnan Urheilukeskus"

IF sr(gnome) = 1 THEN
sr(14) = 1
sr(45) = 2
END IF

IF sr(gnome) = 2 THEN
sr(45) = 2
END IF

sr(gnome) = 3
sarjamaaralku

END IF

COLOR , 0
CLS
COLOR 31: PRINT "ODOTA HETKINEN!"
END SUB

SUB wnd (sex%)
SELECT CASE sex%
CASE 1
me$ = "": WHILE me$ = "": me$ = INKEY$: WEND
CASE 2
me$ = "": DO UNTIL me$ = "k" OR me$ = "e": me$ = INKEY$: LOOP
END SELECT
END SUB


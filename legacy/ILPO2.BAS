DECLARE SUB automa ()
DECLARE SUB al (fat%)
DECLARE SUB colchk (colre%)
DECLARE SUB dap (dep%)
DECLARE SUB mor (mora%, morax%)
DECLARE SUB leq (fat%)
DECLARE SUB lax (fat%)
DECLARE SUB kc ()
DECLARE SUB lt (lue$, lukux%)
DECLARE SUB lay (fat%)
DECLARE SUB haahaa (haha%)
DECLARE SUB ku (kuz%, ku1%, ku2%)
DECLARE SUB lentti (kuka%, sano%)
DECLARE SUB maarpalk (jepulis$)
DECLARE SUB lux (fat%)
DECLARE SUB ketlaita ()
DECLARE SUB klear (fat%)
DECLARE SUB klearstat (fat%)
DECLARE SUB luz (fat%)
DECLARE SUB ont (ontto%)
DECLARE SUB pjn ()
DECLARE SUB printpel (fat%)
DECLARE SUB printket ()
DECLARE SUB poisjun ()
DECLARE SUB sortmaar ()
DECLARE SUB qelp (qel%)
DECLARE SUB rela ()
DECLARE SUB sopimusext (fat%)
DECLARE SUB protesti ()
DECLARE SUB wnd (ser%)
DECLARE SUB turnaus ()
DECLARE SUB xavier (fat%)
DECLARE FUNCTION tarko% (t0%, t1%, t2%, t3%)
DECLARE FUNCTION tarka% (jez%)
'$DYNAMIC
'$INCLUDE: 'mhm2k.bi'

REM $STATIC
SUB graph
leq 2
COLOR 2
PRINT "JOUKKUE: ";
COLOR 10
PRINT RTRIM$(l(u(pv))); " (";
PRINT taulux(sr(u(pv))); ")"
COLOR 14
FOR xxx = 12 TO 1 STEP -1
LOCATE 29 - (24 - (xxx * 2)), 1
PRINT LTRIM$(STR$(xxx));
NEXT xxx
LOCATE 31, 4
FOR xx = 1 TO 5
IF xx < 5 THEN d = 10 ELSE d = 4
FOR xxx = 1 TO d
IF xxx < 10 THEN PRINT LTRIM$(STR$(xxx));  ELSE PRINT "0";
IF xxx = 10 THEN
c = CSRLIN
d = POS(CSRLIN)
LOCATE c + 1, d - 1: PRINT LTRIM$(STR$(xx))
LOCATE c, d
END IF
NEXT xxx
NEXT xx
IF ot > 0 THEN
temp% = 1
FOR xx = 1 TO ot
IF krapu(pv) = 2 THEN a = INT(12 * RND) + 1 ELSE a = graf(xx, pv)
COLOR stvari(a, sr(u(pv)))
FOR xxx = 12 TO a STEP -1
LOCATE 30 - (24 - (xxx * 2)), xx + 3
IF temp% = 1 THEN PRINT CHR$(177);  ELSE PRINT CHR$(176);
LOCATE 29 - (24 - (xxx * 2)), xx + 3
IF temp% = 1 THEN PRINT CHR$(177);  ELSE PRINT CHR$(176);
NEXT xxx
IF temp% = 1 THEN temp% = 2 ELSE temp% = 1
NEXT xx
END IF
haahaa 26
DO
wnd 1
IF me$ = CHR$(27) THEN EXIT SUB
LOOP
END SUB

SUB haahaa (haha%)
COLOR 7, 0
IF haha% = 1 AND lukka = 1 THEN
LOCATE 42, 7
IF pel(sort(kurso), pv).kar < 17 THEN PRINT "K:PLASTIIKKAKIRURGI  ";
IF spx(2, pv) > 0 THEN PRINT "Z:ZOMBIPULVERI  ";
END IF
LOCATE 43, 1
SELECT CASE haha%
CASE 1, 2, 6, 7, 9, 10, 11, 14, 15, 16, 20, 13, 77, 8, 56, 46, 23, 71, 62, 21
PRINT CHR$(17); CHR$(16); CHR$(18);
CASE 3, 5, 33, 27, 66, 61
PRINT CHR$(18);
IF haha% = 3 AND plkm > 1 THEN PRINT CHR$(17); CHR$(16);
CASE 12
PRINT CHR$(17); CHR$(16);
END SELECT
SELECT CASE haha%
CASE 1, 2, 3, 4, 5, 6, 7, 10, 11, 16, 33, 27, 77, 49, 26, 46, 13, 23, 56, 21
COLOR 15: PRINT " ? ";
COLOR 7
CASE ELSE
PRINT " ";
END SELECT
SELECT CASE haha%
CASE 1
SELECT CASE lukka
CASE 1
PRINT "TAB:KETJUT  ";
IF lpj(pv) > 0 THEN PRINT "-:JUNIORIT  ";
PRINT "P:POTKUT  ";
IF pel(sort(kurso), pv).svu = 0 THEN PRINT "E:SOPIMUS  ";
IF pel(sort(kurso), pv).svu > 0 AND pel(sort(kurso), pv).ket > 0 THEN PRINT "C:KAPTEENI  ";
IF spx(1, pv) > 0 THEN PRINT "T:CCCP-TABLETTI  ";
CASE 2
PRINT "N:NOSTA KOKOONPANOON  P:POTKUT  ";
END SELECT
CASE 2
PRINT "TAB:PEL.RINKI  ^A:AUTOMAATT.  K:TYHJENNŽ  ^K:TYHJ.KAIKKI  ";
CASE 3
PRINT "O:OSTA  +/-:NOPEA VIERITYS  ";
CASE 56, 71, 16, 4, 23
PRINT "ENTER:VALITSE  ";
CASE 5
PRINT "ENTER:PALKKAA/EROTA KYKYJENETSIJŽ  ";
CASE 6
PRINT "ENTER:SUORITA JŽYNŽ  ";
CASE 62
PRINT "ENTER:MAINOSKATKO  ";
CASE 9
PRINT "ENTER:HYVŽKSY  ";
PRINT "I:ILTA-PEKKIKSEN ASIANTUNTIJARIVI  ";
CASE 10
IF u(pv) = karki(1) THEN PRINT "P:PHL-PYTTY  ";
IF u(pv) = emestari THEN PRINT "E:EHL-PYTTY  ";
IF u(pv) = cupvoittaja THEN PRINT "C:CUP-PYTTY  ";
CASE 12, 13, 15, 20, 66, 61
PRINT "ENTER:HYVŽKSY  ";
CASE 14
PRINT "ENTER:OSALLISTU TURNAUKSEEN  ";
CASE 27
PRINT "ESC:VALITSE";
CASE 77
PRINT "A,B,C  1,2,3  ";
IF potti(pv) >= .2 * rahna THEN PRINT "ENTER:HYVŽKSY SUUNNITELMA  ";
CASE 8
FOR qwe = 0 TO 3
IF kurso = qwe THEN COLOR 14, 6 ELSE COLOR 14, 0
IF qwe = 0 THEN PRINT "KALENTERI";  ELSE IF qwe = 1 THEN PRINT "RUNKOSARJAT";  ELSE IF qwe = 2 THEN PRINT "EHL";  ELSE PRINT "PEKKALANDIAN CUP";
COLOR , 0: PRINT "  ";
NEXT qwe
COLOR 7
END SELECT
SELECT CASE haha%
CASE 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 16, 21, 33, 26, 49, 46
PRINT "ESC:POIS";
CASE 9, 14, 20, 66, 77, 71
PRINT "ESC:PERUUTA";
END SELECT
END SUB

SUB harjotte (pkl%)
SELECT CASE pkl%
CASE 1
bantu:
a = INT(101 * RND)
SELECT CASE x(u(pv))
CASE 1 TO 12
IF a < 3 THEN b = 24: c = 25 ELSE IF a < 20 THEN b = 12: c = 13 ELSE IF a < 70 THEN b = 12: c = 1 ELSE b = 17: c = 49
CASE 13 TO 24
IF a < 15 THEN b = 24: c = 25 ELSE IF a < 30 THEN b = 15: c = 72 ELSE IF a < 85 THEN b = 12: c = 13 ELSE b = 12: c = 1
CASE 25 TO 48
IF a < 30 THEN b = 15: c = 72 ELSE IF a < 80 THEN b = 24: c = 25 ELSE b = 12: c = 13
END SELECT
xx = INT(b * RND) + c
IF xx < 49 THEN xx = x(xx)
IF ohj(xx) <> 0 THEN GOTO bantu
gnome = INT(4 * RND) + 1
leq 23
IF xx < 49 THEN lax 205 + INT(3 * RND) ELSE lax 208
wnd 2
IF me$ = "k" THEN
vast(pv) = xx
hott(pv * 2) = xx
SWAP hott(pv * 2), hott(pv * 2 - 1)
hotte(u(pv)) = 1
hotte(xx) = 1
END IF
CASE 2
DIM pks(1 TO 80) AS INTEGER
FOR xx = 1 TO 80
IF xx < 49 THEN pks(xx) = x(xx) ELSE IF xx < 66 THEN pks(xx) = xx ELSE pks(xx) = xx + 6
NEXT xx
kurso = 1
arabi:
leq 22
haahaa 71
LOCATE 3, 1: PRINT "PHL"
LOCATE 18, 1: PRINT "DIV"
LOCATE 3, 16: PRINT "MUT"
LOCATE 3, 31: PRINT "EHL"
LOCATE 3, 46: PRINT "MUUT"

LOCATE 34, 1: COLOR 6: PRINT "NEUVOTTELUAIKAA JŽLJELLŽ: ";
COLOR 14: PRINT LTRIM$(STR$(actiox(pv)))

DO
FOR xx = 1 TO 80
IF xx < 13 THEN LOCATE 4 + xx, 1 ELSE IF xx < 25 THEN LOCATE 7 + xx, 1 ELSE IF xx < 49 THEN LOCATE 4 + xx - 24, 16 ELSE IF xx < 66 THEN LOCATE 4 + xx - 48, 31 ELSE LOCATE 4 + xx - 65, 46
IF kurso = xx THEN COLOR , 6 ELSE COLOR , 0
IF ohj(pks(xx)) = pv OR hotte(pks(xx)) <> 0 THEN COLOR 8 ELSE COLOR 14
PRINT l(pks(xx));
NEXT xx
COLOR , 0
wnd 1
ku 1, 1, 80

IF me$ = CHR$(0) + CHR$(77) AND kurso <= 70 THEN kurso = kurso + 10
IF me$ = CHR$(0) + CHR$(75) AND kurso >= 11 THEN kurso = kurso - 10


IF me$ = CHR$(27) THEN ERASE pks: EXIT SUB
IF me$ = CHR$(13) AND actiox(pv) > 0 AND ohj(pks(kurso)) <> pv AND hotte(pks(kurso)) = 0 THEN EXIT DO
LOOP
actiox(pv) = actiox(pv) - 1

IF kurso < 49 THEN a = sed(pks(kurso)) ELSE IF kurso < 66 THEN a = -6 ELSE a = 60
b = INT(101 * RND) - (sed(u(pv)) - a) + mtaito(5, man(u(pv))) * 5
xx = pks(kurso)
CLS
IF xx < 49 THEN lax 209 ELSE lax 210
PRINT
SELECT CASE ohj(xx)
CASE 0
SELECT CASE b
CASE IS < 50
lentti 1, 24
pjn
GOTO arabi
CASE ELSE
lentti 1, 25
pjn
END SELECT
CASE IS <> 0
curso = 1
DO
LOCATE 6, 1
FOR z = 1 TO 2
IF curso = z THEN COLOR 14, 6 ELSE COLOR 14, 0
IF z = 1 THEN PRINT "EI" ELSE PRINT "KYLLŽ"
NEXT z
wnd 1
ku 3, 1, 2
IF me$ = CHR$(13) THEN EXIT DO
LOOP
IF curso = 1 THEN GOTO arabi
END SELECT
vast(pv) = pks(kurso)
hotte(u(pv)) = 1
hotte(vast(pv)) = 1
hotte(u(pv)) = 1
hott(pv * 2) = vast(pv)
IF ohj(vast(pv)) <> 0 THEN vast(ohj(vast(pv))) = u(pv)
ERASE pks
END SELECT

COLOR , 0
END SUB

SUB iaformaatio

sarana:
leq 21
haahaa 26
COLOR 7: LOCATE 21, 50: PRINT "TŽHDET";
FOR b = 1 TO 3
LOCATE 3 + (b - 1) * 8, 1: lay 64 + b
LOCATE 5 + ((b - 1) * 8), 1: lay 35
FOR xxx = 1 TO 3
LOCATE 6 + ((b - 1) * 8) + xxx, 1
xx = suosikki(b, xxx, pv): sivux = 1
printpel 8
LOCATE , 50
SELECT CASE b
CASE 1
sin1 = pel(xx, pv).kar * 2 + pel(xx, pv).psk * 2 + pel(xx, pv).pok

CASE 2
IF kapu(pv) = xx THEN PRINT "C ";
sin1 = ((pel(xx, pv).age + pel(xx, pv).ldr ^ 1.3) / 50)
IF pel(xx, pv).psk < avg(1, pv) THEN sin1 = sin1 * (pel(xx, pv).psk / avg(1, pv))

CASE 3
a = CINT((pel(xx, pv).psk + pel(xx, pv).ldr + pel(xx, pv).kar) / 10)
IF a = 0 THEN PRINT "­";  ELSE PRINT STRING$(a, "*")
END SELECT
NEXT xxx
NEXT b
DO
wnd 1
IF me$ = "?" THEN qelp 8: GOTO sarana
IF me$ = CHR$(27) THEN EXIT SUB
LOOP
END SUB

SUB intejasopu
IF kiero(kr) = 98 OR kiero(kr) = 22 THEN inte(pv) = 1
IF pirtar(7) <> 1048 THEN inte(pv) = 0
COLOR 14: LOCATE 3, 57
PRINT intens(inte(pv));
PRINT STRING$(10, " ");
IF krapu(pv) >= 1 THEN COLOR 8: LOCATE 5, 57: PRINT "LIIAN TIUKKA";
IF jaynax(2, u(pv)) = 0 THEN COLOR 14 ELSE COLOR 30
LOCATE 4, 57
PRINT "EI";
END SUB

SUB jaauniorit
DIM juns(2 TO 10, 1 TO 3) AS INTEGER
OPEN "data\junnut.m2k" FOR INPUT AS #1
FOR b = 2 TO 10
INPUT #1, juns(b, 1), juns(b, 2), juns(b, 3)
NEXT b
CLOSE #1

d = valb(3, pv) * 2 - junnu(pv)
IF d >= 6 THEN c = 2 ELSE IF d > 0 THEN c = 1 ELSE IF d = 0 THEN c = 0 ELSE IF d <= -6 THEN c = -2 ELSE c = -1
junnu(pv) = junnu(pv) + c

FOR xx = 1 TO juns(junnu(pv), 1) + INT(3 * RND) - 1
nats = 1
rela
jel(xx, pv) = blanko
jel(xx, pv).psk = juns(junnu(pv), 2) + INT(juns(junnu(pv), 3) * RND)
jel(xx, pv).age = 18
IF 100 * RND < 6 THEN jel(xx, pv).spe = 5
IF 100 * RND < 2 AND jel(xx, pv).spe = 0 THEN jel(xx, pv).spe = 8
NEXT xx
lpj(pv) = xx - 1
ERASE juns
END SUB

SUB jaynacheck (choko%)
IF choko% = 1 THEN GOSUB ripuli ELSE IF choko% = 2 THEN GOSUB skandalpl
IF choko% <> 0 THEN EXIT SUB

FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).spe = 666 THEN
jaynax(5, pv) = 1
lukka = 17
yy = vast(pv)
dap 2
END IF

IF pel(xx, pv).spe = 2 AND pel(xx, pv).ket > 0 THEN
IF INT(101 * RND) < 2 THEN lukka = 18: dap 2
END IF

NEXT xx

IF jaynax(5, u(pv)) = 1 THEN
al 1
IF lukka = 0 THEN
lukka = 44
dap 1
jaynax(5, u(pv)) = 0
END IF
END IF

FOR xxx = 1 TO plkm
IF vast(xxx) = u(pv) AND jaynax(5, xxx) = 1 THEN
jaynax(5, xxx) = 0
al 1
IF lukka = 0 THEN
lukka = 45
dap 1
END IF
END IF
NEXT xxx

IF jaynax(7, u(pv)) <> 0 THEN
xx = jaynax(7, u(pv))
jaynax(7, u(pv)) = 0
lux 13
mor u(pv), -15
END IF

FOR xx = 1 TO 48
IF ohj(xx) = 0 AND jaynax(7, xx) <> 0 THEN
jaynax(7, xx) = 0
mor xx, -55
lux 36
END IF
NEXT xx

IF jaynax(3, u(pv)) = 1 THEN GOSUB skandalpl
IF jaynax(6, u(pv)) = 1 THEN GOSUB ripuli
IF jaynax(4, u(pv)) = 1 THEN GOSUB vieroitus
EXIT SUB

skandalpl:
lax 59
PRINT
IF tarko(u(pv), 5, 15, 50) = 1 THEN
lax 60
mor u(pv), 10
ELSE
lax 61
mor u(pv), -10
END IF
jaynax(3, u(pv)) = 0
RETURN

ripuli:
lux 19
IF tarko(u(pv), 6, 15, 50) = 1 THEN lux 76 ELSE lux 77
FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).inj = 0 AND 100 * RND > 60 THEN pel(xx, pv).inj = 2
NEXT xx
jaynax(6, u(pv)) = 0
RETURN

vieroitus:
al 3
IF lukka = 0 THEN
gnome = INT(11 * RND) + 7
lax 118
pel(xx, pv).inj = gnome + 2000
END IF
jaynax(4, u(pv)) = 0
RETURN
END SUB

SUB joulutauko
DIM turnax(1 TO 86) AS INTEGER, lusmux(1 TO 10) AS INTEGER
FOR zz = 1 TO 10
lusmux(zz) = 1
NEXT zz
IF tietos > 0 THEN turnax(tietos) = 1
FOR zz = 1 TO plkm
turnax(u(zz)) = 1
NEXT zz
FOR qwe = 10 TO 1 STEP -1
maarpalk "jt" + LTRIM$(STR$(qwe))
tnimi(1) = turnimi(qwe)
naaturnaus = 0
FOR zz = 1 TO plkm
IF mukt(zz) = qwe THEN
turnax(u(zz)) = 1
tx(lusmux(qwe)) = u(zz)
lusmux(qwe) = lusmux(qwe) + 1
naaturnaus = 1
END IF
NEXT zz
IF qwe = 1 AND tietos > 0 THEN tx(1) = tietos: lusmux(qwe) = lusmux(qwe) + 1
FOR cupex = lusmux(qwe) TO 6
purppura:
a = INT(100 * RND) + 1
SELECT CASE qwe
CASE 10
b = INT(16 * RND) + 71
CASE 9
IF a < 25 THEN b = x(INT(24 * RND) + 25) ELSE b = INT(16 * RND) + 71
CASE 8
IF a < 70 THEN b = x(INT(24 * RND) + 25) ELSE b = INT(16 * RND) + 71
CASE 7
IF a < 25 THEN b = x(INT(12 * RND) + 12) ELSE b = x(INT(24 * RND) + 25)
CASE 6
IF a < 50 THEN b = x(INT(12 * RND) + 12) ELSE b = x(INT(24 * RND) + 25)
CASE 5
IF a < 20 THEN b = x(INT(12 * RND) + 1) ELSE b = x(INT(12 * RND) + 13)
CASE 4
IF a < 70 THEN b = x(INT(12 * RND) + 1) ELSE b = x(INT(12 * RND) + 5)
CASE 3
IF a < 50 THEN b = x(INT(12 * RND) + 1) ELSE b = INT(17 * RND) + 49
CASE 2
IF a < 40 THEN b = x(INT(5 * RND) + 1) ELSE b = INT(17 * RND) + 49
CASE 1
b = 64 + cupex
END SELECT
IF turnax(b) = 1 THEN GOTO purppura
turnax(b) = 1
tx(lusmux(qwe)) = b
lusmux(qwe) = lusmux(qwe) + 1
NEXT cupex
turnaus
NEXT qwe
tietos = 0
ERASE turnax, lusmux
END SUB

SUB katsoket
kurso = 1
curso = 1
vaihtis% = 0
tulkero:
CLS
COLOR 8, 0: LOCATE 2, 1: PRINT STRING$(80, "Ä");


haahaa 2
kc
b = 1: c = pelaa: GOSUB hulkko
LOCATE 3, 1
lay 41
DO
LOCATE 1, 1
FOR cupex = 1 TO 11
IF curso = cupex THEN COLOR 14, 6 ELSE COLOR 14, 0
SELECT CASE cupex
CASE 1 TO 5
IF cupex < 4 THEN PRINT "PP" + LTRIM$(STR$(cupex));  ELSE IF cupex = 4 THEN PRINT "PPYV";  ELSE PRINT "PPAV";
CASE 6 TO 11
IF cupex < 10 THEN PRINT "HK" + LTRIM$(STR$(cupex - 5));  ELSE IF cupex = 10 THEN PRINT "HKYV";  ELSE PRINT "HKAV";
END SELECT
IF cupex < 11 THEN COLOR , 0: PRINT "  ";
NEXT cupex
printket
IF pelaa > 0 THEN
b = kurso - 1: c = kurso + 1: GOSUB hulkko
END IF
wnd 1
COLOR , 0
IF me$ = "?" THEN qelp (2): GOTO tulkero
IF pelaa > 0 THEN
ketlaita
ku 4, 1, 11

IF curso = 5 AND gnome = 3 OR curso = 6 AND gnome = 2 THEN
COLOR , 0
FOR zz = 3 TO 42
LOCATE zz, 36: PRINT STRING$(44, " ");
NEXT zz
END IF

ku 1, 1, pelaa
IF me$ = "k" THEN klear 1: kc: b = 1: c = pelaa: GOSUB hulkko
IF me$ = "K" THEN klear 2: kc: b = 1: c = pelaa: GOSUB hulkko
IF me$ = "A" THEN klear 2: automa: kc: b = 1: c = pelaa: GOSUB hulkko
END IF
IF me$ = CHR$(27) THEN COLOR , 0: EXIT DO
IF me$ = CHR$(9) THEN COLOR , 0: vaihtis% = 2: EXIT DO
LOOP
EXIT SUB
hulkko:
FOR a = b TO c
IF a >= 1 AND a <= pelaa THEN
IF pel(sort2(a), pv).ket = 0 THEN COLOR 8: zra = 7 ELSE IF pel(sort2(a), pv).ket = 1 THEN COLOR 14: zra = 6 ELSE COLOR 9: zra = 1
LOCATE a + 4 + pel(sort2(a), pv).ppp - 1, 1
IF a = kurso THEN COLOR , zra ELSE COLOR , 0
printpel 6
END IF
NEXT a
RETURN
END SUB

SUB katsopel
sivux = 1
lukka = 1
kurso = 1
vaihtis% = 0
IF kr > 68 THEN sivmax% = 4 ELSE sivmax% = 3
dukka:
COLOR , 0
CLS
LOCATE 3, 1
lay 35
LOCATE , 50
lay 35 + sivux
LOCATE 1, 1
SELECT CASE lukka
CASE 1
COLOR 6: PRINT "P-RINKI "; : COLOR 14: PRINT l(u(pv));
COLOR 6: PRINT " P.B ";
COLOR 14: PRINT LTRIM$(STR$(pelbudget(pv))); "/O";
COLOR 6: PRINT "  K-IK ";
COLOR 14: PRINT USING "##.#"; avg(2, pv);
COLOR 6: PRINT "  K-TA ";
COLOR 14: PRINT USING "##.#"; avg(1, pv);
COLOR 6: PRINT "  K-KA ";
COLOR 14: PRINT USING "##.#"; avg(3, pv);

LOCATE , 72
COLOR 15
SELECT CASE sivux
CASE 1
PRINT "TILAST. "; CHR$(16)
CASE 2
PRINT "SOPIM. "; CHR$(17); CHR$(16)
CASE 3
PRINT "ERIK. ";
IF kr < 68 THEN PRINT CHR$(17) ELSE PRINT CHR$(17); CHR$(16)
CASE 4
PRINT "RUNKOS. "; CHR$(17)
END SELECT
LOCATE 4, 1
a = 1: b = lpl(pv): GOSUB mussolini
CASE 2
IF lpj(pv) = 1 THEN kurso = 1
COLOR 6: PRINT "A-JUNIOREIDEN PARHAIMMISTO "; : COLOR 14: PRINT l(u(pv))
a = 1: b = lpj(pv): GOSUB mussolini
END SELECT
DO
COLOR , 0
klearstat 42
haahaa 1
a = kurso - 1: b = kurso + 1: GOSUB mussolini
wnd 1
IF me$ = CHR$(27) THEN COLOR , 0: EXIT DO
IF me$ = CHR$(9) THEN COLOR , 0: vaihtis% = 1: EXIT DO
IF me$ = CHR$(0) + CHR$(75) AND sivux > 1 THEN sivux = sivux - 1: COLOR , 0: GOTO dukka
IF me$ = CHR$(0) + CHR$(77) AND sivux < sivmax% THEN sivux = sivux + 1: COLOR , 0: GOTO dukka
IF me$ = "?" THEN qelp (1): GOTO dukka
SELECT CASE lukka
CASE 1
ku 1, 1, lpl(pv)

IF pel(sort(kurso), pv).svu > 0 AND pel(sort(kurso), pv).inj = 0 THEN
IF me$ = "c" AND kapu(pv) <> sort(kurso) THEN kapu(pv) = sort(kurso): GOTO dukka
END IF
IF actiox(pv) > 0 THEN
IF me$ = "e" AND pel(sort(kurso), pv).svu = 0 THEN COLOR , 0: ote = pv: xx = sort(kurso): sopimusext 1: GOTO dukka
END IF

IF me$ = "z" AND pel(sort(kurso), pv).spe < 30000 AND spx(2, pv) > 0 THEN xavier 4: GOTO dukka
IF me$ = "t" AND spx(1, pv) > 0 THEN xavier 1: GOTO dukka
IF me$ = "k" AND pel(sort(kurso), pv).kar < 17 AND pel(sort(kurso), pv).inj = 0 THEN xavier 2: GOTO dukka
IF me$ = "p" AND lpl(pv) > 5 AND kr <= 68 AND pel(sort(kurso), pv).inj = 0 THEN xavier 3: GOTO dukka
IF me$ = "m" AND pel(sort(kurso), pv).spe = 5 THEN pel(sort(kurso), pv).spe = 666: me$ = ""
IF me$ = "m" AND pel(sort(kurso), pv).spe = 666 THEN pel(sort(kurso), pv).spe = 5: me$ = ""
IF me$ = CHR$(8) AND lpj(pv) > 0 THEN lukka = 2: kurso = 1: GOTO dukka
CASE 2
ku 1, 1, lpj(pv)
IF me$ = "n" AND lpl(pv) < 32 THEN
pel(lpl(pv) + 1, pv) = jel(kurso, pv): lpl(pv) = lpl(pv) + 1: sortmaar
IF kurso < lpj(pv) THEN
FOR smut = kurso TO lpj(pv) - 1
jel(smut, pv) = jel(smut + 1, pv)
NEXT smut
END IF
lpj(pv) = lpj(pv) - 1
kurso = 1
IF lpj(pv) = 0 THEN lukka = 1
GOTO dukka
END IF
IF me$ = CHR$(8) THEN lukka = 1: kurso = 1: GOTO dukka
IF me$ = "p" THEN poisjun: GOTO dukka
END SELECT
LOOP
EXIT SUB
mussolini:
SELECT CASE lukka
CASE 1
FOR xxx = a TO b
IF xxx >= 1 AND xxx <= lpl(pv) THEN
IF kurso = xxx THEN COLOR , 6 ELSE COLOR , 0
LOCATE xxx + 4 + pel(sort(xxx), pv).ppp - 1, 1
xx = sort(xxx): printpel 1
END IF
NEXT xxx
CASE 2
FOR xxx = a TO b
IF xxx >= 1 AND xxx <= lpj(pv) THEN
IF kurso = xxx THEN COLOR , 6 ELSE COLOR , 0
LOCATE xxx + 4, 1
xx = xxx: printpel 3
END IF
NEXT xxx
END SELECT
RETURN
END SUB

SUB kausikorttimaar
FOR xx = 1 TO 48
d = 0

temp% = paikka(2, xx) * 100 - kausik(xx)

sin1 = (sed(xx) * 2 + sedd(xx) + seddd(xx)) / 4


SELECT CASE sr(xx)
CASE 1
c = 110
CASE 2
c = 85
CASE 3
c = 50
END SELECT

sin2 = 8 - sin1

IF sin2 > 0 THEN
d = c ^ (1 + (sin2 / 50))
sin3 = 1 + ((taso(xx) - 3) * (.005 + (sin2 / 200)))
ELSE
d = c ^ (1 + (sin2 / 100))
sin3 = 1 + ((taso(xx) - 3) * .005)
END IF

d = d ^ sin3

d = d * (1 + (mtaito(5, man(xx)) * .02))

IF ohj(xx) <> 0 THEN
d = d * (1 + ((avg(3, ohj(xx)) - 10) / 50))
END IF

d = (.95 * d) + (.1 * RND) * d
d = d + INT(3 * RND) - 1

IF d > temp% THEN d = temp%

IF ohj(xx) <> 0 THEN
IF boikotti(ohj(xx)) > 0 THEN d = d * .8
raha(ohj(xx)) = raha(ohj(xx)) + d * (lhinta(sr(xx)) * 22)
END IF

kausik(xx) = kausik(xx) + d

NEXT xx
END SUB

SUB kc
FOR xx = 1 TO lpl(pv)
pel(xx, pv).ket = 0
IF maa(1, pv) = xx THEN pel(xx, pv).ket = pel(xx, pv).ket + 1
FOR qwe = 1 TO 5
FOR cupex = 1 TO 4
IF ketju(qwe, cupex, pv) = xx THEN pel(xx, pv).ket = pel(xx, pv).ket + 1
NEXT cupex
NEXT qwe
IF pel(xx, pv).ket = 0 AND pel(xx, pv).spe = 666 THEN pel(xx, pv).spe = 5
NEXT xx
END SUB

SUB ketjuchk
FOR zz = 1 TO lpl(pv)
IF pel(zz, pv).inj <> 0 THEN
IF kapu(pv) = zz THEN kapu(pv) = 0
IF maa(1, pv) = zz THEN maa(1, pv) = 0
FOR qwe = 1 TO 5
FOR cupex = 1 TO 6
IF ketju(qwe, cupex, pv) = zz THEN ketju(qwe, cupex, pv) = 0
NEXT cupex
NEXT qwe
END IF
NEXT zz

isobee:
FOR a = 1 TO 2
c = 0
IF ketju(1, a, pv) <> 0 AND ketju(2, a, pv) <> 0 THEN c = pel(ketju(1, a, pv), pv).psk + pel(ketju(1, a, pv), pv).psk
FOR b = a + 1 TO 3
d = 0
IF ketju(1, b, pv) <> 0 AND ketju(2, b, pv) <> 0 THEN d = pel(ketju(1, b, pv), pv).psk + pel(ketju(1, b, pv), pv).psk
IF d > c THEN
SWAP ketju(1, a, pv), ketju(1, b, pv)
SWAP ketju(2, a, pv), ketju(2, b, pv)
GOTO isobee
END IF
NEXT b
NEXT a

isobee2:
FOR a = 1 TO 3
c = 0
IF ketju(3, a, pv) <> 0 AND ketju(4, a, pv) <> 0 AND ketju(5, a, pv) <> 0 THEN c = pel(ketju(3, a, pv), pv).psk + pel(ketju(4, a, pv), pv).psk + pel(ketju(5, a, pv), pv).psk
FOR b = a + 1 TO 4
d = 0
IF ketju(3, b, pv) <> 0 AND ketju(4, b, pv) <> 0 AND ketju(5, b, pv) <> 0 THEN d = pel(ketju(3, b, pv), pv).psk + pel(ketju(4, b, pv), pv).psk + pel(ketju(5, b, pv), pv).psk
IF d > c THEN
SWAP ketju(3, a, pv), ketju(3, b, pv)
SWAP ketju(4, a, pv), ketju(4, b, pv)
SWAP ketju(5, a, pv), ketju(5, b, pv)
GOTO isobee2
END IF
NEXT b
NEXT a

FOR zz = 1 TO 3
avg(zz, pv) = 0
NEXT zz

FOR zz = 1 TO lpl(pv)
avg(1, pv) = avg(1, pv) + pel(zz, pv).psk
avg(2, pv) = avg(2, pv) + pel(zz, pv).age
avg(3, pv) = avg(3, pv) + pel(zz, pv).kar
NEXT zz

FOR zz = 1 TO 3
avg(zz, pv) = avg(zz, pv) / lpl(pv)
NEXT zz

haikka = 0
IF maa(1, pv) = 0 THEN haikka = 1
FOR qwe = 1 TO 5
FOR cupex = 1 TO 6
IF ketju(qwe, cupex, pv) = 0 AND dad(qwe, cupex) = 1 THEN haikka = 1: GOTO pienibee
NEXT cupex
NEXT qwe
pienibee:
END SUB

SUB ketlaita
IF pel(sort2(kurso), pv).svu > 0 AND pel(sort2(kurso), pv).ket < 2 THEN
SELECT CASE me$
CASE "z"
IF pel(sort2(kurso), pv).svu > 0 AND pel(sort2(kurso), pv).ppp = 1 THEN
maa(1, pv) = sort2(kurso)
END IF
CASE "q"
IF pel(sort2(kurso), pv).ppp <> 1 THEN
IF curso > 5 THEN
IF curso < 10 THEN temp% = curso - 5 ELSE IF curso = 10 THEN temp% = 5 ELSE temp% = 6
IF ketju(4, temp%, pv) <> sort2(kurso) AND ketju(5, temp%, pv) <> sort2(kurso) THEN ketju(3, temp%, pv) = sort2(kurso)
END IF
END IF
CASE "w"
IF pel(sort2(kurso), pv).ppp <> 1 THEN
IF curso > 5 THEN
IF curso < 10 THEN temp% = curso - 5 ELSE IF curso = 10 THEN temp% = 5 ELSE temp% = 6
IF ketju(3, temp%, pv) <> sort2(kurso) AND ketju(5, temp%, pv) <> sort2(kurso) THEN ketju(4, temp%, pv) = sort2(kurso)
END IF
END IF
CASE "e"
IF pel(sort2(kurso), pv).ppp <> 1 THEN
IF curso > 5 THEN
IF curso < 10 THEN temp% = curso - 5 ELSE IF curso = 10 THEN temp% = 5 ELSE temp% = 6
IF ketju(3, temp%, pv) <> sort2(kurso) AND ketju(4, temp%, pv) <> sort2(kurso) THEN ketju(5, temp%, pv) = sort2(kurso)
END IF
END IF
CASE "a"
IF pel(sort2(kurso), pv).ppp <> 1 THEN
IF curso < 6 THEN
IF curso < 4 THEN temp% = curso ELSE IF curso = 4 THEN temp% = 5 ELSE temp% = 6
IF ketju(2, temp%, pv) <> sort2(kurso) THEN ketju(1, temp%, pv) = sort2(kurso)
END IF
END IF
CASE "s"
IF pel(sort2(kurso), pv).ppp <> 1 THEN
IF curso < 6 THEN
IF curso < 4 THEN temp% = curso ELSE IF curso = 4 THEN temp% = 5 ELSE temp% = 6
IF ketju(1, temp%, pv) <> sort2(kurso) THEN ketju(2, temp%, pv) = sort2(kurso)
END IF
END IF
END SELECT
kc
printket
END IF
END SUB

SUB klear (fat%)
SELECT CASE fat%
CASE 1
SELECT CASE curso
CASE 1 TO 5
IF curso < 4 THEN c = curso ELSE IF curso = 4 THEN c = 5 ELSE c = 6
FOR cupex = 1 TO 2
ketju(cupex, c, pv) = 0
NEXT cupex
CASE ELSE
c = curso - 5
FOR cupex = 3 TO 5
ketju(cupex, c, pv) = 0
NEXT cupex
END SELECT
CASE 2
FOR c = 1 TO 6
FOR cupex = 1 TO 5
ketju(cupex, c, pv) = 0
NEXT cupex
NEXT c
maa(1, pv) = 0
END SELECT
END SUB

SUB klearstat (fat%)
FOR zzz = fat% TO 43
LOCATE zzz, 1: PRINT STRING$(80, " ");
NEXT zzz
LOCATE fat%, 1
END SUB

SUB komme (sano%)
kurso = 1
xxx = CSRLIN
DO
FOR zzzz = 0 TO 3
COLOR , 0
LOCATE xxx + zzzz, 1: PRINT STRING$(80, " ");
NEXT zzzz
LOCATE xxx, 1: COLOR 14, 6
lt "ko", (sano% - 1) * 5 + kurso
wnd 1
ku 1, 1, 5
IF me$ = CHR$(13) THEN EXIT DO
LOOP
COLOR 14, 0
LOCATE xxx, 1: lt "ko", (sano% - 1) * 5 + kurso
END SUB

SUB krapulapiirto
FOR zz = 1 TO 43
FOR zzz = 1 TO 80
a = INT(51 * RND)
COLOR INT(15 * RND) + 17
IF a = 1 THEN LOCATE zz, zzz: PRINT CHR$(1);  ELSE IF a = 2 THEN LOCATE zz, zzz: PRINT CHR$(2);
NEXT zzz
NEXT zz
END SUB

SUB kriisipalaveri
leq 39
lax 56
haahaa 66
kurso = 1
DO
LOCATE 8, 1
FOR zz = 1 TO 3
IF kurso = zz THEN COLOR , 6 ELSE COLOR , 0
lax 155 + zz
NEXT zz

COLOR , 0

wnd 1
ku 1, 1, 3
IF me$ = CHR$(27) THEN EXIT SUB
IF me$ = CHR$(13) THEN EXIT DO
LOOP

klearstat 43
LOCATE 12, 1

kriisi = 1
xx = kapu(pv)

yy = INT(lpl(pv) * RND) + 1
IF xx = 0 THEN
lt "kr", 0 + kurso
a = -kurso
mor u(pv), a
pjn
EXIT SUB
END IF

sin1 = ((pel(xx, pv).age + pel(xx, pv).ldr ^ 1.3) / 50)
IF pel(xx, pv).psk < avg(1, pv) THEN sin1 = sin1 * (pel(xx, pv).psk / avg(1, pv))

d = 0

SELECT CASE kurso
CASE 1
lt "kr", 4
PRINT
a = 50 + mtaito(4, man(u(pv))) * 10
a = a * sin1 ^ 2
IF 100 * RND < a THEN mor u(pv), INT(2 * RND) + 1: lt "kr", 5 ELSE lt "kr", 6

CASE 2
CLS
lt "kr", 7
PRINT
sin2 = (1 - sin1 ^ 1.5) * 100 + 30
SELECT CASE 100 * RND
CASE IS < sin2
lt "kr", INT(3 * RND) + 9
mor u(pv), -1
CASE ELSE
lt "kr", INT(3 * RND) + 12
mor u(pv), 2
END SELECT
PRINT
SELECT CASE 100 * RND
CASE IS <= 20 - mtaito(4, man(u(pv))) * 5
lt "kr", 15
mor u(pv), -1
CASE IS >= 80 - mtaito(4, man(u(pv))) * 5
lt "kr", 16
mor u(pv), 2
CASE ELSE
lt "kr", 17
END SELECT
PRINT
al 6
IF lukka = 0 THEN
lt "kr", INT(3 * RND) + 18
mor u(pv), -1
END IF

CASE 3
CLS
lt "kr", 8
PRINT
IF valb(1, pv) < 4 THEN
IF 100 * RND < (4 - valb(1, pv)) * 5 THEN
lt "kr", INT(3 * RND) + 21
mor u(pv), -1
PRINT
END IF
END IF
sin2 = (1 - sin1 ^ 2) * 100 + 40
SELECT CASE 100 * RND
CASE IS < sin2
lt "kr", INT(3 * RND) + 27
mor u(pv), -2
CASE ELSE
lt "kr", INT(3 * RND) + 24
mor u(pv), 3
END SELECT
PRINT
SELECT CASE 100 * RND
CASE IS <= 30 - mtaito(4, man(u(pv))) * 10
lt "kr", 30
mor u(pv), -2
CASE IS >= 70 - mtaito(4, man(u(pv))) * 10
lt "kr", 31
mor u(pv), 3
CASE ELSE
lt "kr", 32
END SELECT
PRINT
al 7
IF lukka = 0 THEN
qwe = INT(3 * RND)
lt "kr", qwe + 33
mor u(pv), -2
IF qwe = 2 THEN
IF pel(xx, pv).inj = 0 THEN pel(xx, pv).inj = INT(5 * RND) + 3
mor u(pv), -1
END IF
END IF

END SELECT

pjn
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

SUB kuitt
CLS
COLOR 15
PRINT "TAHDOTKO LOPETTAA? (K/E)"
wnd 2
IF me$ = "e" THEN EXIT SUB
SCREEN 0: WIDTH 80, 25: COLOR 15, 0
CLS
lax 89
PRINT
lax 88
PRINT
lax 87
COLOR 6: PRINT "               E-MAIL: ";
COLOR 14: PRINT "forster@dlc.fi"
PRINT
lax 86
SYSTEM
END SUB

SUB kuntopuntari (sar)
DIM kdata(1 TO 3, ((sar - 1) * 12) + 1 TO sar * 12) AS INTEGER
DIM ksij(1 TO 12) AS INTEGER

FOR xx = LBOUND(kdata, 2) TO UBOUND(kdata, 2)
kdata(3, xx) = 1
FOR xxx = 1 TO 10
IF kunto(xxx, x(xx)) = 1 OR kunto(xxx, x(xx)) = 4 THEN kdata(2, xx) = kdata(2, xx) + 2
IF kunto(xxx, x(xx)) = 2 OR kunto(xxx, x(xx)) = 5 THEN kdata(2, xx) = kdata(2, xx) + 1
NEXT xxx
NEXT xx

FOR xx = LBOUND(kdata, 2) TO UBOUND(kdata, 2) - 1
FOR xxx = xx + 1 TO UBOUND(kdata, 2)
SELECT CASE kdata(2, xx)
CASE IS > kdata(2, xxx)
kdata(3, xxx) = kdata(3, xxx) + 1
CASE IS < kdata(2, xxx)
kdata(3, xx) = kdata(3, xx) + 1
CASE kdata(2, xxx)
IF s(x(xx)) > s(x(xxx)) THEN kdata(3, xx) = kdata(3, xx) + 1 ELSE kdata(3, xxx) = kdata(3, xxx) + 1
END SELECT
NEXT xxx
NEXT xx

FOR xx = LBOUND(kdata, 2) TO UBOUND(kdata, 2)
ksij(kdata(3, xx)) = xx
NEXT xx




IF sar < 4 THEN LOCATE 3, 1 ELSE LOCATE 19, 1

FOR xx = 1 TO 12
xxx = ksij(xx)
od(1) = x(xxx)
COLOR stvari(xx, sar)
colchk 2

PRINT l(x(xxx)); "  ("; kk(x(xxx)); ")";

LOCATE , 30
FOR zz = 1 TO 10
IF kunto(zz, x(xxx)) <> 0 THEN PRINT kuntox(kunto(zz, x(xxx)));  ELSE PRINT " ";
NEXT zz

PRINT "  ";
PRINT LTRIM$(STR$(kdata(2, xxx)));
IF kdata(2, xxx) < 10 THEN PRINT "   (";  ELSE PRINT "  (";
PRINT LTRIM$(STR$(s(x(xxx)))); ")"

COLOR 8
IF sar = 1 AND xx = 8 OR sar = 1 AND xx = 11 THEN PRINT "ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ"
IF sar = 2 AND xx = 6 OR sar = 2 AND xx = 10 THEN PRINT "ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ"
IF sar = 3 AND xx = 6 OR sar = 4 AND xx = 6 THEN PRINT "ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ"

NEXT xx

ERASE kdata, ksij
END SUB

SUB kutsuturnaus
IF sed(u(pv)) < 49 THEN d = tkutsux(sed(u(pv))) ELSE d = 48
kurso = d
leq 12
LOCATE 16, 1: COLOR 6: PRINT "TURNAUKSEN KUVAUS"
DO
FOR zz = d TO 10
IF zz = kurso THEN COLOR 14, 6 ELSE COLOR 14, 0
LOCATE 2 + zz, 1: PRINT turnimi(zz)
NEXT zz
COLOR 12, 0
klearstat 18
haahaa 14
LOCATE 18, 1: lax 67 + kurso
wnd 1
ku 1, d, 10
IF me$ = CHR$(13) THEN mukt(pv) = kurso: EXIT DO
IF me$ = CHR$(27) THEN mukt(pv) = 0: EXIT DO
LOOP
END SUB

SUB kuva (tied$)
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

SUB lax (fat%)
lt "x", fat%
END SUB

SUB lay (fat%)
lt "y", fat%
END SUB

SUB lentti (kuka%, sano%)
lt "s" + LTRIM$(STR$(kuka%)), (sano% - 1) * 6 + INT(6 * RND) + 1
END SUB

SUB leq (fat%)
CLS
lt "q", fat%
PRINT
END SUB

SUB lex (fat%)
lt "v", fat%
PRINT
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
IF yy <= 48 THEN PRINT RTRIM$(mana(man(yy)).nam);
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

SUB lux (fat%)
lt "e", fat%
PRINT
END SUB

SUB luz (fat%)
lt "n", fat%
PRINT
END SUB

SUB maajoukkue
d = 0
leq 7
IF kr = 16 THEN
FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).psk >= maajomin(pel(xx, pv).nat) THEN
qwe = INT(100 * RND) + 1 + ((pel(xx, pv).psk - maajomin(pel(xx, pv).nat))) * 10
IF qwe > 50 THEN pel(xx, pv).mjo = 1
END IF
NEXT xx
END IF
IF kr <> 16 THEN
FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).mjo = 1 THEN
qwe = INT(100 * RND) + 1 + ((pel(xx, pv).psk + 1 - maajomin(pel(xx, pv).nat))) * 10
IF qwe > 50 THEN pel(xx, pv).mjo = 1 ELSE pel(xx, pv).mjo = 0
END IF
NEXT xx
END IF
FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).mjo = 1 AND pel(xx, pv).inj = 0 THEN
d = 1
COLOR 10
PRINT pel(xx, pv).nam; "  ";
PRINT kansap(pel(xx, pv).nat)
pel(xx, pv).inj = 9001
END IF
NEXT xx
IF d = 0 THEN COLOR 2: PRINT "KUKAAN JOUKKUEESI PELAAJISTA EI SAA KUTSUA."
pjn
END SUB

SUB maarpalk (jepulis$)
OPEN "data\" + jepulis$ + ".plx" FOR INPUT AS #1
FOR z = 1 TO 6
INPUT #1, palki(z)
NEXT z
CLOSE #1
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

SUB meanstuff
kurso = 1: oldkurso = 1
bekinado:
leq 36

IF jaynateh(pv) = 3 THEN lay 23: pjn: EXIT SUB

a = 1: b = 48: GOSUB dalailama
IF kr = 68 THEN jaynmax = 1 ELSE jaynmax = 7
COLOR 12: LOCATE 31, 1: lax 5 + oldkurso
haahaa 6
DO
a = kurso - 1: b = kurso + 1: GOSUB dalailama
FOR zz = 1 TO jaynmax
IF ohj(x(kurso)) <> 0 AND zz = 2 OR ohj(x(kurso)) = pv THEN COLOR 8 ELSE COLOR 14
IF oldkurso = zz THEN COLOR , 6 ELSE COLOR , 0
LOCATE 2 + zz, 41: PRINT jayna(zz)
NEXT zz
COLOR 6, 0
LOCATE 29, 1: PRINT "JOUKKUEEN MANAGERI: ";
COLOR 14
PRINT mana(man(x(kurso))).nam
wnd 1
IF me$ = "?" THEN qelp (6): GOTO bekinado
ku 1, 1, 48
IF me$ = CHR$(0) + CHR$(75) AND oldkurso > 1 THEN oldkurso = oldkurso - 1: klearstat 31: LOCATE 31, 1: COLOR 12: lax 5 + oldkurso: haahaa 6
IF me$ = CHR$(0) + CHR$(77) AND oldkurso < jaynmax THEN oldkurso = oldkurso + 1: klearstat 31: LOCATE 31, 1: COLOR 12: lax 5 + oldkurso: haahaa 6
IF me$ = CHR$(27) THEN EXIT DO
IF me$ = CHR$(13) THEN
d = 1
IF ohj(x(kurso)) <> 0 AND oldkurso = 2 THEN d = 0
IF ohj(x(kurso)) = pv THEN d = 0
IF d = 1 THEN
COLOR 6, 0
CLS
COLOR 15
PRINT jayna(oldkurso)
PRINT
IF raha(pv) < jahinta(oldkurso) * (4 - sr(x(kurso))) THEN
COLOR 6
PRINT "SINULLA EI OLE TARPEEKSI RAHAA! YRITŽ MY™HEMMIN UUDELLEEN!"
pjn
GOTO bekinado
END IF
COLOR 6
PRINT "Uhri: ";
COLOR 14: PRINT l(x(kurso)): COLOR 6: PRINT
PRINT "Hinta: ";
COLOR 14
PRINT LTRIM$(STR$(jahinta(oldkurso) * (4 - sr(x(kurso)))))
PRINT
COLOR 6
lax 136 + oldkurso
wnd 2
IF me$ = "e" THEN GOTO bekinado
raha(pv) = raha(pv) - jahinta(oldkurso) * (4 - sr(x(kurso)))
jaynteh = 1
SELECT CASE oldkurso
CASE 1
xx = u(pv): xxx = x(kurso)
jaynteh = 1
jaynateh(pv) = jaynateh(pv) + 1
protesti
CASE 2 TO 6
jaynax(oldkurso, x(kurso)) = 1
CASE 7
jaynax(oldkurso, x(kurso)) = u(pv)
END SELECT
EXIT DO
END IF
END IF
LOOP
EXIT SUB

dalailama:
FOR xx = a TO b
IF xx > 0 AND xx < 49 THEN
IF xx < 13 THEN LOCATE 2 + xx, 1 ELSE IF xx < 25 THEN LOCATE 2 + xx - 12, 15 ELSE IF xx < 37 THEN LOCATE 15 + xx - 24, 1 ELSE LOCATE 15 + xx - 36, 15
IF kurso = xx THEN COLOR , 6 ELSE COLOR , 0
IF ohj(x(xx)) = 0 THEN COLOR 14 ELSE COLOR 7
PRINT l(x(xx));
END IF
NEXT xx
RETURN
END SUB

SUB mmkisaalku
leq 6
d = 0
FOR xx = 1 TO lpl(pv)
IF mmsarja(pel(xx, pv).nat) = 2 AND pel(xx, pv).mjo = 1 AND pel(xx, pv).inj = 0 THEN
IF d = 0 THEN d = 1
lax 176
PRINT
wnd 2
SELECT CASE me$
CASE "k"
lax 177
PRINT
pel(xx, pv).inj = 9002
pel(xx, pv).plus = 1
pel(xx, pv).kest = INT(10 * RND) + 10
CASE "e"
lax 178
PRINT
pel(xx, pv).plus = INT(3 * RND) - 3
pel(xx, pv).kest = INT(10 * RND) + 10
END SELECT
END IF
NEXT xx
IF d = 0 THEN COLOR 2: PRINT "YKSIKŽŽN PELAAJISTASI EI OLE LŽHD™SSŽ KISOIHIN."
pjn
END SUB

SUB mmkisaloppu
CLS
mmx% = 2
lax 136
PRINT
COLOR 6: PRINT "..."
PRINT
DIM mmj(1 TO 7) AS INTEGER
b = 1
FOR a = 1 TO 17
IF mmsarja(a) = mmx% THEN mmj(b) = a: b = b + 1
NEXT a
DIM mmp(1 TO UBOUND(mmj)) AS INTEGER
DIM mmv(1 TO UBOUND(mmj)) AS INTEGER
DIM mms(1 TO UBOUND(mmj)) AS INTEGER
DIM mmrando(1 TO UBOUND(mmj)) AS INTEGER
DIM mmsij(1 TO UBOUND(mmj)) AS INTEGER
FOR a = 1 TO UBOUND(mmj)
mms(a) = 1
mmv(a) = maajomin(mmj(a))
mmrando(a) = a
NEXT a
FOR a = 1 TO 500
b = INT(UBOUND(mmj) * RND) + 1
c = INT(UBOUND(mmj) * RND) + 1
IF b <> c THEN SWAP mmrando(b), mmrando(c)
NEXT a
FOR a = 1 TO UBOUND(mmj) - 1
FOR b = a + 1 TO UBOUND(mmj)
xx = INT(4 * RND) + mmv(a)
xxx = INT(4 * RND) + mmv(b)
IF xx > xxx THEN mmp(a) = mmp(a) + 2 ELSE IF xx = xxx THEN mmp(a) = mmp(a) + 1: mmp(b) = mmp(b) + 1 ELSE mmp(b) = mmp(b) + 2
NEXT b
NEXT a
FOR a = 1 TO UBOUND(mmj) - 1
FOR b = a + 1 TO UBOUND(mmj)
SELECT CASE mmp(a)
CASE IS > mmp(b)
mms(b) = mms(b) + 1
CASE IS < mmp(b)
mms(a) = mms(a) + 1
CASE mmp(b)
IF mmrando(a) > mmrando(b) THEN mms(b) = mms(b) + 1 ELSE mms(a) = mms(a) + 1
END SELECT
NEXT b
NEXT a
FOR a = 1 TO UBOUND(mmj)
mmsij(mms(a)) = mmj(a)
NEXT a
lentti 1, 16
PRINT
COLOR 6: PRINT "..."
PRINT
mmnousu = mmsij(1)
xx = mmsij(1)
lentti 1, 17
PRINT
COLOR 6: PRINT "..."
PRINT
xx = mmsij(2)
lentti 1, 18
PRINT
COLOR 6: PRINT "..."
PRINT
lentti 1, 19
FOR pv = 1 TO plkm
FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).inj = 9002 THEN
pel(xx, pv).kun = pel(xx, pv).kun - 3
pel(xx, pv).inj = 0
END IF
IF mmsarja(pel(xx, pv).nat) = 2 AND pel(xx, pv).mjo = 1 THEN pel(xx, pv).mjo = 0
NEXT xx
NEXT pv
pjn
ERASE mmj, mmp, mmv, mms, mmrando, mmsij
END SUB

SUB mor (mora%, morax%)
mo(mora%) = mo(mora%) + morax%
END SUB

SUB muilutus (fat%)
SELECT CASE fat%
CASE 1
jaynax(5, xx) = 0
luz 51
CASE 2
jaynax(4, xx) = 0
luz 52
CASE 3
luz 54
END SELECT

zz = INT(2 * RND) + 2
IF zz = 2 THEN zzz = 3: zzzz = 1 ELSE zzz = 2: zzzz = -1
FOR d = zz TO zzz STEP zzzz

IF tarka(d) = 0 THEN
tauti(zz, tox(xx)) = -(INT(4 * RND) + 3)
tkest(zz, tox(xx)) = INT(4 * RND) + 3
EXIT FOR
END IF
NEXT d

END SUB

SUB mukachk
FOR c = 1 TO plkm
mukp(c) = 0
NEXT c
FOR qwe = 1 TO 3
FOR cupex = 1 TO pep(qwe, pround).joukk / 2
od(1) = plex(qwe, pfxt(pround, pkr, qwe, cupex * 2 - 1))
od(2) = plex(qwe, pfxt(pround, pkr, qwe, cupex * 2))

FOR a = 1 TO 2
IF ohj(od(a)) <> 0 THEN
IF a = 1 THEN b = 2 ELSE b = 1
IF pwin(od(a)) < 3 AND pwin(od(b)) < 3 THEN mukp(ohj(od(a))) = 1 ELSE mukp(ohj(od(a))) = 0
END IF
NEXT a

NEXT cupex
NEXT qwe
END SUB

SUB naytaott (nayk%)
SELECT CASE nayk%
CASE 4
s = 1
kolo = 12
LOCATE 3
FOR cupex = 1 TO 43 STEP 2
IF hott(cupex) <> 0 AND hott(cupex + 1) <> 0 THEN
od(1) = hott(cupex)
od(2) = hott(cupex + 1)
ont 2
END IF
NEXT cupex
CASE 1
s = 1
SELECT CASE kiero(kr)
CASE 1
LOCATE 3
FOR qwe = 1 TO 4
kolo = jkolo(qwe)
IF qwe = 1 THEN LOCATE 3 ELSE IF qwe = 2 THEN LOCATE 10 ELSE IF qwe = 3 THEN LOCATE 17 ELSE LOCATE 24
FOR cupex = 1 TO 6
od(1) = x(fxt(cupex * 2 - 1, ki) + (qwe - 1) * 12)
od(2) = x(fxt(cupex * 2, ki) + (qwe - 1) * 12)
ont 1
NEXT cupex
NEXT qwe
CASE 42, 44, 46
FOR qwe = 1 TO 3
kolo = jkolo(qwe)
IF qwe = 1 THEN LOCATE 3 ELSE IF qwe = 2 THEN LOCATE 10 ELSE LOCATE 16
FOR cupex = 1 TO pep(qwe, pround).joukk / 2
IF kiero(kr) = 46 AND cupex = 1 AND qwe = 1 THEN COLOR 14
IF kiero(kr) = 46 AND cupex = 2 AND qwe = 1 THEN COLOR 6
IF kiero(kr) = 46 AND cupex = 1 AND qwe = 2 THEN COLOR 12
IF pwin(plex(qwe, pfxt(pround, pkr, qwe, cupex * 2 - 1))) < 3 AND pwin(plex(qwe, pfxt(pround, pkr, qwe, cupex * 2))) < 3 THEN
od(1) = plex(qwe, pfxt(pround, pkr, qwe, cupex * 2 - 1))
od(2) = plex(qwe, pfxt(pround, pkr, qwe, cupex * 2))
ont 1
END IF
NEXT cupex
NEXT qwe
CASE 41, 43, 45, 47
LOCATE 3, 1: COLOR 12: PRINT "EI OTTELUITA"
LOCATE 12, 1: COLOR 4: PRINT "EI OTTELUITA"
END SELECT
CASE 2
s = 1
LOCATE 3
kolo = 12
SELECT CASE cround
CASE 1
IF cupoli = 1 THEN b = 1: c = 16 ELSE b = 17: c = 32
CASE ELSE
b = 1: c = cupjouk(cround) / 2
END SELECT
FOR xx = b TO c
COLOR 8
od(1) = cup(xx * 2 - 1)
od(2) = cup(xx * 2)
ont 2
NEXT xx
CASE 3
s = 1
LOCATE 2
kolo = 12
FOR qwe = 1 TO 5
PRINT
FOR cupex = 1 TO 2
od(1) = ex((efxt(ekr, cupex * 2 - 1)) + (qwe - 1) * 4)
od(2) = ex((efxt(ekr, cupex * 2)) + (qwe - 1) * 4): ont 2
NEXT cupex
NEXT qwe
END SELECT
END SUB

SUB nollaux
FOR xxx = 1 TO plkm
FOR xx = 1 TO 32
IF pel(xx, xxx).ppp <> 1 OR ot = 0 THEN
pel(xx, xxx).gls = 0
pel(xx, xxx).ass = 0
END IF
NEXT xx
NEXT xxx
FOR xx = 1 TO 48 - plkm
FOR xxx = 1 TO 5
top(xx, xxx).gls = 0
top(xx, xxx).ass = 0
NEXT xxx
NEXT xx
END SUB

SUB ont (ontto%)
LOCATE , s
FOR a = 1 TO 2
COLOR kolo
colchk a + 1
PRINT l(od(a));
IF ontto% = 1 THEN
PRINT " ("; LTRIM$(STR$(s(od(a)))); ")";
IF s(od(a)) < 10 THEN PRINT " ";
END IF
IF a = 1 THEN PRINT " - ";  ELSE PRINT
NEXT a

END SUB


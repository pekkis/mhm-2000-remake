DECLARE SUB borsinit (init%)
DECLARE SUB apulaisvalm ()
DECLARE SUB aaaargh ()
DECLARE SUB actionprint ()
DECLARE SUB annarahaa (arg%)
DECLARE SUB colchk (colre%)
DECLARE SUB mor (mora%, morax%)
DECLARE SUB mukachk ()
DECLARE SUB leq (fat%)
DECLARE SUB lax (fat%)
DECLARE SUB ketjuchk ()
DECLARE SUB kc ()
DECLARE SUB intejasopu ()
DECLARE SUB kuva (tied$)
DECLARE SUB lay (fat%)
DECLARE SUB haahaa (haha%)
DECLARE SUB ku (kuz%, ku1%, ku2%)
DECLARE SUB naytaott (nayk%)
DECLARE SUB klearstat (fat%)
DECLARE SUB krapulapiirto ()
DECLARE SUB nollaux ()
DECLARE SUB pjn ()
DECLARE SUB printpel (fat%)
DECLARE SUB poispelaaja (vp%, jp%)
DECLARE SUB pisteet ()
DECLARE SUB pesc ()
DECLARE SUB postia (posti%)
DECLARE SUB plajaytajoukkueet ()
DECLARE SUB sortmaar ()
DECLARE SUB qelp (qel%)
DECLARE SUB wnd (ser%)
DECLARE SUB tarjousmaar (koo1%, koo2%, pienin&, isoin&)
DECLARE SUB voimamaar ()
DECLARE SUB staulnayt (sar!, sty!, stx!, iso!)
DECLARE FUNCTION tarko% (t0%, t1%, t2%, t3%)
DECLARE FUNCTION tarka% (jez%)
'$DYNAMIC
'$INCLUDE: 'mhm2k.bi'

REM $STATIC
SUB organisaatio
kurso = 1

duccix:
rahna = 0
rahna2 = 0
leq 38
haahaa 10

COLOR 15
LOCATE 3, 1: PRINT "BUDJETOINTI"
LOCATE 18, 1: PRINT "ERIKOISTOIMENPITEET"
IF karki(1) = u(pv) THEN LOCATE 3, 41: PRINT "PHL-POKAALI ON HALLUSSAMME!"
IF emestari = u(pv) THEN LOCATE 5, 41: PRINT "EHL-PYTTY ON HALLUSSAMME!"
IF cupvoittaja = u(pv) THEN LOCATE 7, 41: PRINT "CUP-KANNU ON HALLUSSAMME!"

rahna = rahna + sponso(20, pv)
LOCATE 5, 1: COLOR 14
PRINT "OTTELUMAKSU";
LOCATE , 30: COLOR 10
PRINT sponso(20, pv)

COLOR 6
rahna = rahna + pelbudget(pv)
PRINT "PELAAJABUDJETTI";
LOCATE , 30: COLOR 2: PRINT pelbudget(pv)

IF laina(1, pv) <> 0 OR laina(2, pv) <> 0 OR laina(3, pv) <> 0 THEN
rahna = rahna - FIX(laina(1, pv) * pankkor(1) / 44 + laina(2, pv) * pankkor(2) / 44 + laina(3, pv) * pankkor(3) / 44)
COLOR 6
PRINT "KORKOMENOT";
LOCATE , 30: COLOR 2
PRINT -FIX(laina(1, pv) * pankkor(1) / 44 + laina(2, pv) * pankkor(2) / 44 + laina(3, pv) * pankkor(3) / 44)
END IF

IF skoutteja(pv) > 0 THEN
COLOR 6
rahna = rahna - CLNG(skoutteja(pv)) * 2000
PRINT "KYKYJENETSIJŽT";
LOCATE , 30: COLOR 2: PRINT -CLNG(skoutteja(pv)) * 2000
END IF

FOR qwe = 1 TO 5
IF qwe < 5 OR valb(qwe, pv) > 1 THEN
IF qwe < 5 THEN
rahna = rahna + valbh(vai(2, pv), qwe, valb(qwe, pv))
ELSE
rahna = rahna + valbh(vai(2, pv), qwe, valb(qwe, pv)) * lpl(pv)
END IF
COLOR 6
lay 79 + qwe
LOCATE , 30
COLOR 2
IF qwe < 5 THEN PRINT valbh(vai(2, pv), qwe, valb(qwe, pv)) ELSE PRINT valbh(vai(2, pv), qwe, valb(qwe, pv)) * lpl(pv)
END IF
NEXT qwe
COLOR 7: PRINT STRING$(37, "Ä")
LOCATE , 30
IF rahna < 0 THEN COLOR 2 ELSE COLOR 10
PRINT rahna

LOCATE 29, 1
lax 148

DO
FOR qwe = 1 TO 4
LOCATE 18 + qwe * 2, 1
IF kurso = qwe THEN COLOR 14, 6 ELSE COLOR 14, 0
lay 90 + qwe
LOCATE , 30
FOR cupex = 0 TO erikmax(qwe)
IF erik(qwe, u(pv)) = cupex THEN COLOR 10, 0: PRINT "²";  ELSE COLOR 2, 0: PRINT "°";
NEXT cupex
LOCATE , 36
lay erikalk(qwe) + erik(qwe, u(pv))
COLOR , 0: PRINT "        ";
LOCATE , 65
PRINT LTRIM$(STR$(-erikmak(erik(qwe, u(pv)), qwe))); "/OTT.    "
NEXT qwe
wnd 1
IF me$ = "?" THEN qelp (10): GOTO duccix
ku 1, 1, 4
IF kusek <> kurso THEN
klearstat 23
LOCATE 29, 1
IF kurso < 3 THEN lax 147 + kurso ELSE lax 149 + kurso
haahaa 10
END IF


IF me$ = CHR$(0) + CHR$(75) AND erik(kurso, u(pv)) > 0 THEN erik(kurso, u(pv)) = erik(kurso, u(pv)) - 1
IF me$ = CHR$(0) + CHR$(77) AND erik(kurso, u(pv)) < erikmax(kurso) THEN erik(kurso, u(pv)) = erik(kurso, u(pv)) + 1
IF me$ = "p" AND karki(1) = u(pv) THEN SCREEN 13: kuva ("pysti1"): SCREEN 0: WIDTH 80, 43: GOTO duccix
IF me$ = "e" AND emestari = u(pv) THEN SCREEN 13: kuva ("pysti2"): SCREEN 0: WIDTH 80, 43: GOTO duccix
IF me$ = "c" AND cupvoittaja = u(pv) THEN SCREEN 13: kuva ("pysti3"): SCREEN 0: WIDTH 80, 43: GOTO duccix

IF me$ = CHR$(27) THEN EXIT DO
LOOP
COLOR , 0
END SUB

SUB osto2
gnome = INT(10 * RND) + 1
oldkurso = kurso
xx = sortc(kurso)
LOCATE 40, 1: lay 145
tarjousmaar 40, 25, 0, raha(pv)
yy = u(borsch(curso))
ccc = ote: colchk 4

leq 8

LOCATE 4, 1
lay 35
LOCATE 6, 1
printpel 7
PRINT : PRINT
rahna = tarjous
lax 192
PRINT : PRINT
ccc = ote: colchk 4
lax 193
kurso = 2
DO
LOCATE 13, 1
FOR qwe = 1 TO 2
IF kurso = qwe THEN COLOR 14, 6 ELSE COLOR 14, 0
IF qwe = 1 THEN PRINT "TOTTA KAI!" ELSE PRINT "EN MISSŽŽN TAPAUKSESSA!"
NEXT qwe
wnd 1
ku 1, 1, 2
IF me$ = CHR$(13) AND kurso = 1 THEN EXIT DO
IF me$ = CHR$(13) AND kurso = 2 THEN kurso = oldkurso: EXIT SUB
LOOP
kurso = oldkurso
lpl(pv) = lpl(pv) + 1
pel(lpl(pv), pv) = pel(xx, ote)

pel(lpl(pv), pv).pok = 0
poispelaaja xx, ote
END SUB

SUB otmuut (fat%)
SELECT CASE fat%
CASE 1

FOR a = 1 TO 2
IF a = 1 THEN b = 2 ELSE b = 1

SELECT CASE gl(od(a))
CASE IS > gl(od(b))
win(od(a)) = win(od(a)) + 1
p(od(a)) = p(od(a)) + 2
IF a = 1 THEN kunto(1, od(a)) = 1 ELSE kunto(1, od(a)) = 4

CASE gl(od(b))
dra(od(a)) = dra(od(a)) + 1
p(od(a)) = p(od(a)) + 1
IF a = 1 THEN kunto(1, od(a)) = 2 ELSE kunto(1, od(a)) = 5

CASE IS < gl(od(b))
los(od(a)) = los(od(a)) + 1
IF a = 1 THEN kunto(1, od(a)) = 3 ELSE kunto(1, od(a)) = 6

END SELECT

gf(od(a)) = gf(od(a)) + gl(od(a))
ga(od(a)) = ga(od(a)) + gl(od(b))
NEXT a

CASE 2
egf(nn1) = egf(nn1) + gl(od(1))
egf(mm1) = egf(mm1) + gl(od(2))
ega(nn1) = ega(nn1) + gl(od(2))
ega(mm1) = ega(mm1) + gl(od(1))
IF gl(od(1)) > gl(od(2)) THEN ep(nn1) = ep(nn1) + 2 ELSE IF gl(od(1)) = gl(od(2)) THEN ep(nn1) = ep(nn1) + 1: ep(mm1) = ep(mm1) + 1 ELSE ep(mm1) = ep(mm1) + 2

CASE 3
IF gl(od(1)) > gl(od(2)) THEN pwin(od(1)) = pwin(od(1)) + 1 ELSE pwin(od(2)) = pwin(od(2)) + 1
IF sr(od(1)) = 1 THEN
ppotti = ppotti + (lhinta(1) + 2) * ylm(2, od(1))
ppotti = ppotti + ((lhinta(1) + 2) * .8) * ylm(1, od(1))
END IF

CASE 4
tero(nn1) = tero(nn1) + gl(od(1)) - gl(od(2))
tero(mm1) = tero(mm1) + gl(od(2)) - gl(od(1))
IF gl(od(1)) > gl(od(2)) THEN tp(nn1) = tp(nn1) + 2 ELSE IF gl(od(1)) = gl(od(2)) THEN tp(nn1) = tp(nn1) + 1: tp(mm1) = tp(mm1) + 1 ELSE tp(mm1) = tp(mm1) + 2
END SELECT
END SUB

SUB ottpel

SELECT CASE kiero(kr)
CASE 1
etu(1) = 1
etu(2) = .85
etu(2) = etu(2) + .02 * erik(4, od(2))
FOR z = 1 TO 2
IF erik(1, od(z)) >= z THEN etu(z) = etu(z) + .02
NEXT z

CASE 2
etu(1) = 1
etu(2) = .85
IF od(2) < 49 AND ohj(od(2)) <> 0 THEN etu(2) = etu(2) + .02 * erik(4, od(2)) ELSE etu(2) = etu(2) + .02 * 4
FOR z = 1 TO 2
IF od(z) < 49 THEN
IF erik(1, od(z)) >= z THEN etu(z) = etu(z) + .02
END IF
IF od(z) > 48 THEN etu(z) = etu(z) + .02
NEXT z

CASE 3, 40 TO 50
etu(1) = 1
etu(2) = .85
IF od(2) < 49 THEN
etu(2) = etu(2) + .02 * erik(4, od(2))
END IF
FOR z = 1 TO 2
IF od(z) < 49 THEN
IF erik(1, od(z)) >= z THEN etu(z) = etu(z) + .02
END IF
NEXT z

CASE 4
etu(1) = 1
etu(2) = .95

CASE ELSE
etu(1) = 1: etu(2) = 1
END SELECT

IF kiero(kr) = 1 THEN
kotiot(od(1)) = kotiot(od(1)) + 1

IF ot > 5 AND ot < 44 THEN
IF ohj(od(1)) = 0 THEN
IF s(od(2)) - s(od(1)) >= 4 THEN
zzz = (s(od(2)) - s(od(1)) - 3) * 7
IF INT(101 * RND) < zzz THEN etu(1) = etu(1) - .15
END IF
END IF
END IF
END IF

FOR z = 1 TO 2
ode(1, z) = mw(od(z))
ode(2, z) = pw(od(z))
ode(3, z) = hw(od(z))

IF od(z) < 49 THEN
IF mo(od(z)) < 0 THEN etu(z) = etu(z) + mo(od(z)) / 125 ELSE IF mo(od(z)) > 0 THEN etu(z) = etu(z) + mo(od(z)) / 155
END IF

IF ohj(od(z)) <> 0 THEN
zz = ohj(od(z))

etu(z) = etu(z) + treeni(zz) * .03

IF kiero(kr) <> 4 AND turnauz = 0 THEN
IF inte(zz) = 0 THEN etu(z) = etu(z) - .15 ELSE IF inte(zz) = 2 THEN etu(z) = etu(z) + .1
END IF

IF z = 1 THEN koti(zz) = 1 ELSE vieras(zz) = 1

IF spx(3, zz) <> 0 THEN
spx(3, zz) = 0
IF tarko(u(zz), 6, 10, 50) = 1 THEN
IF z = 1 THEN etu(2) = etu(2) - .2 ELSE etu(1) = etu(1) - .2
END IF
END IF

IF spx(4, zz) <> 0 THEN
spx(4, zz) = 0
IF tarko(u(zz), 6, 10, 50) = 1 THEN
etu(z) = etu(z) + .07
END IF
END IF

FOR xx = 1 TO lpl(zz)
IF turnauz = 0 THEN

IF pel(xx, zz).spe = 10 AND pel(xx, zz).ket > 0 THEN raha(zz) = raha(zz) + 10000
IF pel(xx, zz).spe = 4 AND pel(xx, zz).ket > 0 THEN ode(1, z) = 25

IF pel(xx, zz).inj > 1000 AND pel(xx, zz).inj < 2000 THEN
pel(xx, zz).inj = pel(xx, zz).inj - 1
IF pel(xx, zz).inj = 1000 THEN pel(xx, zz).inj = 0
END IF

IF pel(xx, zz).svu > 10000 THEN pel(xx, zz).svu = pel(xx, zz).svu - 1

IF kiero(kr) = 1 OR mukp(zz) = 1 THEN
IF pel(xx, zz).ket > 0 THEN
pel(xx, zz).pok = pel(xx, zz).pok + 1
pel(xx, zz).pot = pel(xx, zz).pot + 1
END IF
END IF
END IF
NEXT xx

END IF

IF ohj(od(z)) = 0 AND od(z) < 49 THEN
zz = od(z)
FOR d = 1 TO 3
ode(d, z) = ode(d, z) + tauti(d, tox(zz))
NEXT d
IF jaynax(6, zz) = 2 THEN ode(1, z) = 0: ode(2, z) = 0: ode(3, z) = 0: jaynax(6, zz) = 0

IF kiero(kr) = 1 THEN
IF erik(3, zz) <> 0 THEN
ode(1, z) = ode(1, z) + erik(3, zz)
ode(2, z) = ode(2, z) + erik(3, zz) * 6
ode(3, z) = ode(3, z) + erik(3, zz) * 12
yw(zz) = yw(zz) + erik(3, zz) * 5
aw(zz) = aw(zz) + erik(3, zz) * 4
END IF
END IF

END IF

zz = od(z)

IF zz < 49 THEN
yw(zz) = yw(zz) * tautip(zz)
aw(zz) = aw(zz) * tautip(zz)
yw(zz) = yw(zz) * tre(zz)
aw(zz) = aw(zz) * tre(zz)
END IF

yw(zz) = yw(zz) * etu(z)
aw(zz) = aw(zz) * etu(z)

FOR d = 1 TO 3
IF ode(d, z) < 0 THEN ode(d, z) = 0

IF zz < 49 THEN
ode(d, z) = ode(d, z) * tautip(zz)
ode(d, z) = ode(d, z) * tre(zz)
END IF

IF ode(d, z) <= 0 THEN
ylm(1, od(1)) = 0: ylm(2, od(1)) = 0
IF z = 1 THEN gl(od(2)) = 12: gl(od(1)) = 0 ELSE gl(od(1)) = 12: gl(od(2)) = 0
GOTO morttivertti
END IF

ode(d, z) = ode(d, z) * etu(z)

NEXT d

ode(1, z) = ode(1, z) / 30
ode(2, z) = ode(2, z) / 60
ode(3, z) = ode(3, z) / 120

NEXT z

otma = 1

SELECT CASE jaynax(2, od(1)) + jaynax(2, od(2))

CASE 0
FOR xx = 1 TO 15
voimalla = INT(10 * RND) + 1
IF voimalla > 2 THEN voimalla = 0
IF voimalla = 0 THEN GOSUB tvtilanne ELSE GOSUB yvtilanne
NEXT xx

CASE 2
ja(od(1)) = 1: ja(od(2)) = 1
gnome = 5 * RND
DO UNTIL gl(od(1)) = gnome AND gl(od(2)) = gnome
voimalla = INT(10 * RND) + 1
IF voimalla > 2 THEN voimalla = 0
IF voimalla = 0 THEN GOSUB tvtilanne ELSE GOSUB yvtilanne
LOOP

CASE 1
IF jaynax(2, od(1)) = 1 THEN b = 2: c = 1 ELSE b = 1: c = 2
gl(od(b)) = gl(od(b)) + 1
ww = od(b): www = od(c): pisteet
otma = otma + 1

FOR xx = 1 TO 14
voimalla = INT(10 * RND) + 1
IF voimalla > 2 THEN voimalla = 0
IF voimalla = 0 THEN GOSUB tvtilanne ELSE GOSUB yvtilanne
NEXT xx

END SELECT

sattans:
IF ohj(od(1)) = 0 THEN jaynax(2, od(1)) = 0
IF ohj(od(2)) = 0 THEN jaynax(2, od(2)) = 0
IF ja(od(1)) <> 0 OR ja(od(2)) <> 0 THEN GOTO morttivertti

SELECT CASE kiero(kr)
CASE 1, 2
IF gl(od(1)) = gl(od(2)) THEN gnome = 1: GOSUB jatkoaika
CASE 3
IF leggi = 2 THEN
IF leg(od(1)) + gl(od(1)) = leg(od(2)) + gl(od(2)) THEN gnome = 2: GOSUB jatkoaika
END IF
CASE 40 TO 50
IF gl(od(1)) = gl(od(2)) THEN gnome = 2: GOSUB jatkoaika
END SELECT

morttivertti:

IF turnauz = 0 THEN
FOR b = 1 TO 2
IF b = 1 THEN c = 2 ELSE c = 1
IF od(b) < 49 THEN
IF gl(od(b)) < gl(od(c)) THEN mor od(b), -1 ELSE IF gl(od(b)) > gl(od(c)) THEN mor od(b), 1
END IF
NEXT b
END IF
EXIT SUB

jatkoaika:
ja(od(1)) = 1: ja(od(1)) = 1

SELECT CASE gnome
CASE 1
FOR a = 1 TO 2
IF a = 1 THEN b = 1: c = 2 ELSE b = 2: c = 1
IF ode(3, b) * RND > ode(2, c) * RND THEN
IF ode(3, b) * RND > ode(1, c) * RND + ode(2, c) / 3 THEN
gl(od(b)) = gl(od(b)) + 1
ww = od(b): www = od(c): pisteet
otma = otma + 1
RETURN
END IF
END IF
NEXT a

CASE 2
DO
FOR a = 1 TO 2
IF a = 1 THEN b = 1: c = 2 ELSE b = 2: c = 1
IF ode(3, b) * RND > ode(2, c) * RND THEN
IF ode(3, b) * RND > ode(1, c) * RND + ode(2, c) / 3 THEN
gl(od(b)) = gl(od(b)) + 1
ww = od(b): www = od(c): pisteet
otma = otma + 1
RETURN
END IF
END IF
NEXT a
LOOP
END SELECT
RETURN

tvtilanne:
FOR a = 1 TO 2
IF a = 1 THEN b = 1: c = 2 ELSE b = 2: c = 1

IF jaynax(2, od(b)) = 1 AND jaynax(2, od(c)) = 0 THEN gnome = gl(od(c)) - 2
IF jaynax(2, od(b)) = 0 AND jaynax(2, od(c)) = 1 THEN gnome = 999
IF jaynax(2, od(b)) = 0 AND jaynax(2, od(c)) = 0 THEN gnome = 999

IF gl(od(b)) <= gnome THEN
IF ode(3, b) * RND > ode(2, c) * RND THEN
IF ode(3, b) * RND > ode(1, c) * RND + ode(2, c) / 3 THEN
gl(od(b)) = gl(od(b)) + 1
ww = od(b): www = od(c): pisteet
otma = otma + 1
END IF
END IF
END IF

NEXT a
RETURN

yvtilanne:
b = voimalla
IF b = 1 THEN c = 2 ELSE c = 1
IF jaynax(2, od(b)) = 1 AND jaynax(2, od(c)) = 0 THEN gnome = gl(od(c)) - 2
IF jaynax(2, od(b)) = 0 AND jaynax(2, od(c)) = 1 THEN gnome = 999
IF jaynax(2, od(b)) = 0 AND jaynax(2, od(c)) = 0 THEN gnome = 999
IF gl(od(b)) <= gnome THEN
testink = testink + 1
IF b = 1 THEN c = 2 ELSE c = 1
IF yw(od(b)) * RND > aw(od(c)) * RND THEN
IF yw(od(b)) * RND > (ode(1, c) * 15) + (ode(1, c) * 30) * RND THEN
gl(od(b)) = gl(od(b)) + 1
ww = od(b): www = od(c): pisteet
otma = otma + 1
testing = testing + 1
END IF

END IF
END IF

RETURN

END SUB

SUB ottul
FOR a = 1 TO 2
COLOR kolo
colchk a + 1
PRINT l(od(a)); " ";
COLOR kolo
IF a = 1 THEN PRINT " - ";  ELSE PRINT " ";
NEXT a

FOR a = 1 TO 2
colchk a + 1
IF gl(od(a)) < 10 AND a = 1 THEN PRINT " ";
PRINT LTRIM$(STR$(gl(od(a))));
IF gl(od(a)) < 10 AND a = 2 THEN PRINT " ";
COLOR kolo
IF a = 1 THEN PRINT " - ";  ELSE PRINT " ";
NEXT a
IF ja(od(1)) = 1 OR ja(od(2)) = 1 THEN PRINT "ja. ";  ELSE PRINT "    ";

COLOR 6
IF turnauz = 0 THEN
COLOR 6: PRINT "Yleis”„: ";
IF ylm(1, od(1)) + ylm(2, od(1)) = paikka(1, od(1)) * 100 + paikka(2, od(1)) * 100 THEN COLOR 14 ELSE COLOR 7
PRINT LTRIM$(STR$(ylm(1, od(1)) + ylm(2, od(1))));
END IF

IF kiero(kr) = 1 AND arvsulk = 0 THEN
IF qwe < 3 THEN
IF ja(od(1)) = 1 THEN tulos(cupex + ((qwe - 1) * 6)) = 2 ELSE IF gl(od(2)) > gl(od(1)) THEN tulos(cupex + ((qwe - 1) * 6)) = 3 ELSE tulos(cupex + ((qwe - 1) * 6)) = 1
LOCATE , 60: COLOR 7
IF tulos(cupex + ((qwe - 1) * 6)) = 1 THEN PRINT "1";  ELSE IF tulos(cupex + ((qwe - 1) * 6)) = 2 THEN PRINT "X";  ELSE PRINT "2";
FOR pv = 1 TO plkm
IF veika(1, pv) <> 0 THEN
LOCATE , 61 + (2 * pv): colchk 1
IF veika(cupex + ((qwe - 1) * 6), pv) = 1 THEN PRINT "1";  ELSE IF veika(cupex + ((qwe - 1) * 6), pv) = 2 THEN PRINT "X";  ELSE PRINT "2";
END IF
NEXT pv
PRINT
END IF
END IF
IF kiero(kr) <> 1 OR kiero(kr) = 1 AND arvsulk = 1 OR kiero(kr) = 1 AND qwe > 2 THEN PRINT

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

SUB pankki

kurso = 1
curso = 1

sulka:
leq 26

DO
FOR xxx = 1 TO 3
LOCATE 2 + xxx * 2, 1
IF curso = xxx THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT panknim(xxx);
LOCATE , 20: COLOR 6, 0
rahna = laina(xxx, pv)
lay 189
PRINT " / ";
PRINT LTRIM$(STR$(luotto(xxx) * (4 - sr(u(pv))))); " (";
PRINT LTRIM$(STR$(pankkor(xxx) * 100)); "%)"
NEXT xxx
rahna = laina(1, pv) + laina(2, pv) + laina(3, pv)
LOCATE 10, 34: lay 190

klearstat 13
haahaa 16

LOCATE 13, 1: lax 52 + curso


FOR xx = 1 TO 2
LOCATE 19, 1 + (xx - 1) * 20
IF xx = 1 AND laina(curso, pv) < luotto(curso) * (4 - sr(u(pv))) THEN COLOR 14 ELSE IF xx = 1 THEN COLOR 8
IF xx = 2 AND laina(curso, pv) > 0 THEN COLOR 14 ELSE IF xx = 2 THEN COLOR 8
IF kurso = xx THEN COLOR , 6 ELSE COLOR , 0
lay 190 + xx
NEXT xx

COLOR , 0
wnd 1
IF me$ = "?" THEN qelp (16): GOTO sulka

ku 2, 1, 2
ku 3, 1, 3

COLOR 14: LOCATE 23, 1

IF me$ = CHR$(13) AND kurso = 1 THEN
IF laina(curso, pv) < luotto(curso) * (4 - sr(u(pv))) THEN
PRINT panknim(curso);
lax 212
tarjousmaar 26, 1, 0, luotto(curso) * (4 - sr(u(pv))) - laina(curso, pv)
laina(curso, pv) = laina(curso, pv) + tarjous
raha(pv) = raha(pv) + tarjous
IF tarjous > 0 AND curso = 3 THEN mafia(pv) = 1
GOTO sulka
END IF
END IF

IF me$ = CHR$(13) AND kurso = 2 THEN
IF laina(curso, pv) > 0 THEN
PRINT panknim(curso);
lax 213
IF raha(pv) < laina(curso, pv) THEN rahna = raha(pv) ELSE rahna = laina(curso, pv)
tarjousmaar 26, 1, 0, rahna
laina(curso, pv) = laina(curso, pv) - tarjous
raha(pv) = raha(pv) - tarjous
GOTO sulka
END IF
END IF
IF me$ = CHR$(27) THEN EXIT SUB
LOOP

END SUB

SUB pesc
LOCATE 43, 1: COLOR 15: PRINT "PAINA ESC...";
DO
wnd 1
IF me$ = CHR$(27) THEN EXIT DO
LOOP
END SUB

SUB piirtox
voimamaar
IF kiero3(kr) = 3 AND mukt(pv) = 0 THEN postia 1
IF uhka(pv) > 0 AND kiero3(kr) <> 3 THEN postia 2
COLOR 8
LOCATE 1, 34: PRINT "ÉÍÍKAUSIÍÍ»";
LOCATE 2, 34: PRINT "º         º";
LOCATE 3, 34: PRINT "ÈÍÍÍÍÍÍÍÍÍ¼";
LOCATE 2, 35: COLOR 7: PRINT LTRIM$(STR$(kausi)); "-"; LTRIM$(STR$(kausi + 1));
LOCATE 43, 40: COLOR 15: PRINT "? "; : COLOR 7: PRINT CHR$(18); ":INTENS.  ^S:SOPUPELI  ^A:AUTOMAATTI";
apulaisvalm
COLOR 6
LOCATE 1, 47: PRINT "MANAGERI";
LOCATE 2, 46: PRINT "STRATEGIA";
LOCATE 3, 47: PRINT "INTENSIT.";
LOCATE 4, 47: PRINT "SOPUPELI";
LOCATE 5, 48: PRINT "MORAALI";
LOCATE 6, 50: PRINT "SALDO";

LOCATE 1, 57: colchk 1: PRINT nimi(pv);

IF raha(pv) < 0 THEN COLOR 2 ELSE COLOR 14
LOCATE 6, 57: PRINT LTRIM$(STR$(raha(pv)));

COLOR 14
LOCATE 2, 57: IF valm(u(pv)) <> 0 THEN PRINT valms(valm(u(pv)));  ELSE PRINT "EI VALITTU";
IF mo(u(pv)) < 0 THEN COLOR 2 ELSE COLOR 14
LOCATE 5, 57: PRINT LTRIM$(STR$(mo(u(pv))));
intejasopu
COLOR 6
LOCATE 1, 1
SELECT CASE kiero(kr)
CASE 3
PRINT "SEURAAVAT CUP-OTTELUT:"
naytaott 2
IF cround = 1 THEN COLOR 7: PRINT : PRINT "+/-"
CASE 99
PRINT "KESŽTAUKO"
CASE 4
IF vast(pv) <> 0 THEN
COLOR 12
PRINT RTRIM$(l(u(pv))); " - "; RTRIM$(l(vast(pv)))
END IF
CASE 98
PRINT "JOULUTAUKO"
CASE 97
PRINT "MAAJOUKKUETAUKO"
CASE 96
PRINT "VAPAA VIIKONLOPPU"
CASE 2
PRINT "SEURAAVAT EHL:N OTTELUT:"
naytaott 3
CASE 22
PRINT "EHL:N LOPPUTURNAUS"
CASE 1
PRINT "SEURAAVAT RUNKOSARJAOTTELUT:"
naytaott 1
CASE 42, 44, 46
PRINT "PHL:N PLAYOFF-OTTELUT:"
LOCATE 8, 1: PRINT "DIVISIOONAN PLAYOFF-OTTELUT:"
LOCATE 14, 1: PRINT "MUTASARJAN PLAYOFF-OTTELUT:"
naytaott 1
END SELECT
IF pirtar(1) <> 678 THEN SYSTEM
SELECT CASE kiero(kr)
CASE 42, 43, 44, 45, 46, 47
COLOR 6
SELECT CASE kiero(kr)
CASE 42, 43
LOCATE 27, 50: PRINT "1/4-FINAALIEN TILANTEET:"
CASE 44, 45
LOCATE 27, 50: PRINT "SEMIFINAALIEN TILANTEET:"
CASE 46, 47
LOCATE 27, 50: PRINT "FINAALIEN TILANTEET:"
END SELECT
LOCATE 29
FOR qwe = 1 TO 3
IF qwe = 1 THEN COLOR 12 ELSE IF qwe = 2 THEN COLOR 4 ELSE COLOR 5
FOR cupex = 1 TO pep(qwe, pround).joukk / 2
IF kiero(kr) > 45 AND cupex = 1 AND qwe = 1 THEN COLOR 14
IF kiero(kr) > 45 AND cupex = 2 AND qwe = 1 THEN COLOR 6
IF kiero(kr) > 45 AND cupex = 2 AND qwe = 1 THEN COLOR 12
LOCATE , 50
PRINT l(plex(qwe, pfxt(pround, 1, qwe, cupex * 2 - 1))); " - "; l(plex(qwe, pfxt(pround, 1, qwe, cupex * 2))); " "; LTRIM$(STR$(pwin(plex(qwe, pfxt(pround, 1, qwe, cupex * 2 - 1))))); " - "; LTRIM$(STR$(pwin(plex(qwe, pfxt(pround, 1, qwe, cupex * 2) _
))))
NEXT cupex
NEXT qwe
CASE ELSE
LOCATE 29, 48: COLOR 7: PRINT ".";
SELECT CASE infos(pv)
CASE 1
staulnayt 1, 29, 50, 0
staulnayt 2, 29, 66, 0
CASE 2
staulnayt 3, 29, 50, 0
staulnayt 4, 29, 66, 0
END SELECT
END SELECT
COLOR 7
LOCATE 9, 39: PRINT "*. OTTELUOHJELMAT";
LOCATE 11, 39: PRINT "0. PISTEP™RSSIT";
LOCATE 12, 39: PRINT "1. SARJATAULUKOT";
LOCATE 13, 39: PRINT "2. TILASTOKESKUS";
LOCATE 14, 39: PRINT "3. MENESTYSKŽYRŽ";
COLOR 10
LOCATE 16, 39: IF kiero(kr) = 1 AND arvsulk = 0 THEN PRINT "V. VEDONLY™NTI";
IF mo(u(pv)) <= -6 AND mo(u(pv)) <> -66 AND kriisi = 0 AND kiero(kr) <> 4 THEN
COLOR 30: LOCATE 18, 39: PRINT "K. KRIISI-"
LOCATE 19, 42: PRINT "TOIMENPITEET"
END IF
COLOR 14
IF kiero(kr) = 4 THEN
IF hotte(u(pv)) = 0 THEN LOCATE 18, 39: PRINT "H. HARJOITUS-": LOCATE 19, 42: PRINT "OTTELU"
END IF
LOCATE 9, 58: PRINT "S. SPONSORI";
LOCATE 10, 58: PRINT "P. PANKKILAITOKSET";
LOCATE 11, 58: PRINT "O. ORGANISAATIO";
LOCATE 12, 58: PRINT "I. JOUKKUE-INFO";
LOCATE 13, 58: PRINT "A. PELAAJARINKI";
LOCATE 14, 58: PRINT "B. KETJUKOKOONPANO";
IF kiero2(kr) = 1 THEN LOCATE 15, 58: PRINT "C. PELAAJAMARKKINAT";
LOCATE 16, 58: PRINT "D. JŽŽHALLI";
LOCATE 17, 58: PRINT "E. KYKYJENETSIJŽT";
IF kr <= 68 THEN LOCATE 18, 58: PRINT "F. JŽYNŽT";
IF plkm > 1 THEN LOCATE 19, 58: PRINT "T. TULONSIIRTO";
COLOR 2
LOCATE 21, 58: PRINT "!. TEKIJŽT"
IF ot < 45 AND vu = 1 THEN LOCATE 22, 58: PRINT "<. TALLENNA";
LOCATE 23, 57: PRINT "^X. ASETUKSET";
LOCATE 24, 57: PRINT "^Q. LOPETA";
LOCATE 43, 1: colchk 1
actionprint
IF krapu(pv) = 2 THEN krapulapiirto
COLOR 8: LOCATE 3, 37: PRINT clock$
IF tv <> 0 THEN
COLOR 14: LOCATE 27, 39: PRINT "TV-OTTELU: ";
COLOR 12
ccc = ohj(x(fxt(tv * 2 - 1, ki))): colchk 4
PRINT RTRIM$(l(x(fxt(tv * 2 - 1, ki))));
COLOR 12: PRINT " - ";
ccc = ohj(x(fxt(tv * 2, ki))): colchk 4
PRINT RTRIM$(l(x(fxt(tv * 2, ki))))
END IF
END SUB

SUB pisteet

DIM hent(1 TO 4) AS DOUBLE
DIM pent(1 TO 3) AS DOUBLE
DIM cketju(1 TO 5) AS INTEGER

SELECT CASE ohj(ww)
CASE IS <> 0
ww = ohj(ww)
maalix(otma, ww) = ww
GOSUB pelpisteet

CASE 0
IF ohj(www) <> 0 THEN
maali(otma, ohj(www)) = RTRIM$(l(ww))
IF voimalla <> 0 THEN yvoima(otma, ohj(www)) = 1
END IF

IF lm = 1 THEN GOSUB tietpisteet
END SELECT
ERASE pent, hent, cketju
EXIT SUB

pelpisteet:

SELECT CASE voimalla
CASE 0
FOR dl = 1 TO 4
hent(dl) = hketju(dl, ww) ^ 2.5
IF dl < 4 THEN pent(dl) = pketju(dl, ww) ^ 2
NEXT dl
cl = (hent(1) + hent(2) + hent(3) + hent(4)) * RND
dl = (pent(1) + pent(2) + pent(3)) * RND
SELECT CASE cl
CASE 0 TO hent(1)
b = 1
CASE hent(1) + 1 TO hent(1) + hent(2)
b = 2
CASE hent(1) + hent(2) + 1 TO hent(1) + hent(2) + hent(3)
b = 3
CASE hent(1) + hent(2) + hent(3) + 1 TO hent(1) + hent(2) + hent(3) + hent(4)
b = 4
END SELECT
FOR z = 3 TO 5
cketju(z) = ketju(z, b, ww)
NEXT z
SELECT CASE dl
CASE 0 TO pent(1)
b = 1
CASE pent(1) + 1 TO pent(1) + pent(2)
b = 2
CASE pent(1) + pent(2) + 1 TO pent(1) + pent(2) + pent(3)
b = 3
END SELECT
FOR z = 1 TO 2
cketju(z) = ketju(z, b, ww)
NEXT z

CASE ELSE
FOR z = 1 TO 5
cketju(z) = ketju(z, yvpelaa(ww), ww)
NEXT z

END SELECT

IF 100 * RND < 20 THEN b = INT(2 * RND) + 1 ELSE b = INT(3 * RND) + 3

IF lm = 1 THEN pel(cketju(b), ww).gls = pel(cketju(b), ww).gls + 1
maali(otma, ww) = pel(cketju(b), ww).nam
IF voimalla <> 0 THEN yvoima(otma, ww) = 1

IF ohj(www) <> 0 THEN
maali(otma, ohj(www)) = pel(cketju(b), ww).nam
IF voimalla <> 0 THEN yvoima(otma, ohj(www)) = 1
END IF

cl = INT(100 * RND) + 1
IF cl < 16 THEN dl = 0 ELSE IF cl < 65 THEN dl = 1 ELSE dl = 2

temp% = 0
FOR cl = 1 TO dl
dildo:
IF 100 * RND < 25 THEN z = INT(2 * RND) + 1 ELSE z = INT(3 * RND) + 3
IF z = b OR cketju(b) = cketju(z) OR cketju(z) = temp% THEN GOTO dildo

IF lm = 1 THEN pel(cketju(z), ww).ass = pel(cketju(z), ww).ass + 1
syotto(otma, cl, ww) = pel(cketju(z), ww).nam
IF ohj(www) <> 0 THEN syotto(otma, cl, ohj(www)) = pel(cketju(z), ww).nam
IF cl = 1 THEN temp% = cketju(z)
NEXT cl

RETURN

tietpisteet:
IF INT(101 * RND) > 60 THEN
nummi = INT(100 * RND) + 1
SELECT CASE nummi
CASE 1 TO 25
a = 1
CASE 26 TO 50
a = 2
CASE 51 TO 70
a = 3
CASE 71 TO 85
a = 4
CASE 86 TO 100
a = 5
END SELECT
top(tox(ww), a).gls = top(tox(ww), a).gls + 1
END IF
IF INT(101 * RND) > 60 THEN
nummi = INT(100 * RND) + 1
SELECT CASE nummi
CASE 1 TO 25
a = 1
CASE 26 TO 50
a = 2
CASE 51 TO 70
a = 3
CASE 71 TO 85
a = 4
CASE 86 TO 100
a = 5
END SELECT
top(tox(ww), a).ass = top(tox(ww), a).ass + 1
END IF
RETURN

END SUB

SUB pisteporssi (fat%)
CLS
kurso = fat%
DO
klearstat 1
haahaa 21
FOR b = 1 TO 3
COLOR , 0: PRINT "   ";
IF kurso = b THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT taulux(b);
COLOR , 0
NEXT b
orja = kurso
GOSUB isopenis
IF krapu(pv) = 2 THEN krapulapiirto
wnd 1
ku 2, 1, 3
IF me$ = CHR$(27) THEN EXIT SUB
LOOP
isopenis:
LOCATE 1, 1
FOR xxx = 1 TO 20
IF ppors(orja, xxx).pi = 0 THEN RETURN
COLOR 14: PRINT LTRIM$(STR$(xxx)); ". ";
IF xxx < 10 THEN PRINT " ";
COLOR 10
IF ohj(ppors(orja, xxx).jo) <> 0 THEN ccc = ohj(ppors(orja, xxx).jo): colchk 4
PRINT ppors(orja, xxx).na; "  ";
PRINT "("; kansal(ppors(orja, xxx).ka); ")"; "  ";
COLOR 2
IF ohj(ppors(orja, xxx).jo) <> 0 THEN ccc = ohj(ppors(orja, xxx).jo): colchk 4
PRINT l(ppors(orja, xxx).jo); "  ";
COLOR 7
IF ppors(orja, xxx).ma < 10 THEN PRINT " ";
PRINT LTRIM$(STR$(ppors(orja, xxx).ma));
PRINT "  +  ";
PRINT LTRIM$(STR$(ppors(orja, xxx).sy));
IF ppors(orja, xxx).sy < 10 THEN PRINT " ";
PRINT "  =  ";
COLOR 15
PRINT LTRIM$(STR$(ppors(orja, xxx).pi))
NEXT xxx
RETURN
END SUB

SUB pisteporssimaar

ERASE ppors
DIM ppors(1 TO 3, 1 TO 20) AS borzzi

FOR xx = 1 TO 48

SELECT CASE ohj(x(xx))
CASE IS <> 0

FOR xxx = lpl(ohj(x(xx))) TO 1 STEP -1
IF pel(xxx, ohj(x(xx))).ppp <> 1 THEN
FOR xxxx = 1 TO 19
SELECT CASE pel(xxx, ohj(x(xx))).gls + pel(xxx, ohj(x(xx))).ass
CASE IS < ppors(sr(x(xx)), xxxx).pi
gnome = 0
CASE IS > ppors(sr(x(xx)), xxxx).pi
gnome = 1
CASE ppors(sr(x(xx)), xxxx).pi
SELECT CASE pel(xxx, ohj(x(xx))).gls
CASE IS >= ppors(sr(x(xx)), xxxx).ma
gnome = 1
CASE ELSE
gnome = 0
END SELECT
END SELECT
IF gnome = 1 THEN
FOR xxxxx = 19 TO xxxx STEP -1
ppors(sr(x(xx)), xxxxx + 1) = ppors(sr(x(xx)), xxxxx)
NEXT xxxxx
ppors(sr(x(xx)), xxxx).na = pel(xxx, ohj(x(xx))).nam
ppors(sr(x(xx)), xxxx).ma = pel(xxx, ohj(x(xx))).gls
ppors(sr(x(xx)), xxxx).sy = pel(xxx, ohj(x(xx))).ass
ppors(sr(x(xx)), xxxx).pi = pel(xxx, ohj(x(xx))).gls + pel(xxx, ohj(x(xx))).ass
ppors(sr(x(xx)), xxxx).ka = pel(xxx, ohj(x(xx))).nat
ppors(sr(x(xx)), xxxx).jo = x(xx)
EXIT FOR
END IF
NEXT xxxx
END IF
NEXT xxx

CASE 0
FOR xxx = 5 TO 1 STEP -1
FOR xxxx = 1 TO 19

SELECT CASE top(tox(x(xx)), xxx).gls + top(tox(x(xx)), xxx).ass
CASE IS < ppors(sr(x(xx)), xxxx).pi
gnome = 0
CASE IS > ppors(sr(x(xx)), xxxx).pi
gnome = 1
CASE ppors(sr(x(xx)), xxxx).pi
SELECT CASE top(tox(x(xx)), xxx).gls
CASE IS >= ppors(sr(x(xx)), xxxx).ma
gnome = 1
CASE ELSE
gnome = 0
END SELECT
END SELECT
IF gnome = 1 THEN
FOR xxxxx = 19 TO xxxx STEP -1
ppors(sr(x(xx)), xxxxx + 1) = ppors(sr(x(xx)), xxxxx)
NEXT xxxxx
ppors(sr(x(xx)), xxxx).na = top(tox(x(xx)), xxx).nam
ppors(sr(x(xx)), xxxx).ma = top(tox(x(xx)), xxx).gls
ppors(sr(x(xx)), xxxx).sy = top(tox(x(xx)), xxx).ass
ppors(sr(x(xx)), xxxx).pi = top(tox(x(xx)), xxx).gls + top(tox(x(xx)), xxx).ass
ppors(sr(x(xx)), xxxx).ka = top(tox(x(xx)), xxx).nat
ppors(sr(x(xx)), xxxx).jo = x(xx)
EXIT FOR
END IF
NEXT xxxx
NEXT xxx

END SELECT
NEXT xx





END SUB

SUB pjn
LOCATE 43, 1
COLOR 14: PRINT "PAINA JOTAKIN NŽPPŽINTŽ...";
WHILE INKEY$ = "": WEND
END SUB

SUB plajaytajoukkueet
CLS
COLOR 14
SELECT CASE kiero(kr)
CASE 41
PRINT "JA NELJŽNNESFINAALEISSA OTTELUPARIT OVAT SEURAAVAT:"
CASE 43
PRINT "JA SEMIFINAALEISSA OTTELUPARIT OVAT SEURAAVAT:"
CASE 45
PRINT "JA FINAALEISSA OTTELUPARIT OVAT SEURAAVAT:"
END SELECT
PRINT
COLOR 12
FOR qwe = 1 TO 3
IF qwe = 1 THEN COLOR 12 ELSE IF qwe = 2 THEN COLOR 4 ELSE COLOR 5
IF qwe > 1 THEN PRINT
FOR cupex = 1 TO pep(qwe, pround).joukk / 2
IF cupex = 1 AND kiero(kr) = 45 AND qwe = 1 THEN COLOR 14
IF cupex = 2 AND kiero(kr) = 45 AND qwe = 1 THEN COLOR 6
IF cupex = 1 AND kiero(kr) = 45 AND qwe = 2 THEN COLOR 12
PRINT l(plex(qwe, pfxt(pround, 1, qwe, cupex * 2 - 1))); " - "; l(plex(qwe, pfxt(pround, 1, qwe, cupex * 2)))
NEXT cupex
NEXT qwe
END SUB

SUB playoffplajays (plots%)
SELECT CASE plots%
CASE 1
DIM pwin(1 TO 48) AS INTEGER
DIM rug(1 TO 32, 1 TO plkm) AS INTEGER
DIM rua(1 TO 32, 1 TO plkm) AS INTEGER
DIM pvoittaja(1 TO 6) AS borzzi
DIM supaplex(25 TO 48) AS INTEGER
DIM tempsr(1 TO 48) AS INTEGER
FOR xx = 1 TO 48
IF ohj(xx) = 0 THEN
erik(4, xx) = erik(4, xx) + 1
IF erik(4, xx) > 4 THEN erik(4, xx) = 4
END IF
tempsr(xx) = sr(xx)
NEXT xx
pround = 1
FOR zz = 1 TO 3
pvoittaja(zz) = ppors(zz, 1)
NEXT zz
FOR xx = 1 TO plkm
mukp(xx) = 0
FOR xxx = 1 TO lpl(xx)
rug(xxx, xx) = pel(xxx, xx).gls
rua(xxx, xx) = pel(xxx, xx).ass
NEXT xxx
NEXT xx
nollaux
pkr = 1
karki(1) = 0
karki(2) = 0
karki(3) = 0
FOR xx = 1 TO 3
nousu(xx) = 0
puto(xx) = 0
NEXT xx
FOR xx = 1 TO 48
pwin(xx) = 0
seddd(xx) = sedd(xx)
sedd(xx) = sed(xx)
sed(xx) = 0
NEXT xx
FOR qwe = 1 TO 2
FOR cupex = 1 TO pep(qwe, pround).joukk
plex(qwe, cupex) = sijo(qwe, cupex)
NEXT cupex
NEXT qwe
FOR xx = 25 TO 48
IF s(x(xx)) < 7 THEN supaplex(xx) = 1 ELSE supaplex(xx) = 13
NEXT xx
FOR a = 1 TO 2
IF a = 1 THEN b = 0: c = 7 ELSE b = 6: c = 13
FOR xx = 25 TO 47
FOR xxx = xx + 1 TO 48
IF s(x(xx)) > b AND s(x(xx)) < c AND s(x(xxx)) > b AND s(x(xxx)) < c THEN
SELECT CASE p(x(xx))
CASE IS > p(x(xxx))
supaplex(xxx) = supaplex(xxx) + 1
CASE IS < p(x(xxx))
supaplex(xx) = supaplex(xx) + 1
CASE p(x(xxx))
SELECT CASE gf(x(xx)) - ga(x(xx))
CASE IS > gf(x(xxx)) - ga(x(xxx))
supaplex(xxx) = supaplex(xxx) + 1
CASE IS < gf(x(xxx)) - ga(x(xxx))
supaplex(xx) = supaplex(xx) + 1
CASE gf(x(xxx)) - ga(x(xxx))
SELECT CASE gf(x(xx))
CASE IS >= gf(x(xxx))
supaplex(xxx) = supaplex(xxx) + 1
CASE IS < gf(x(xxx))
supaplex(xx) = supaplex(xx) + 1
END SELECT
END SELECT
END SELECT
END IF
NEXT xxx
NEXT xx
NEXT a
FOR xx = 25 TO 48
SELECT CASE s(x(xx))
CASE IS > 6
sed(x(xx)) = supaplex(xx) + 24
CASE IS < 7
plex(3, supaplex(xx)) = x(xx)
END SELECT
NEXT xx
FOR qwe = 1 TO 4
IF qwe < 4 THEN a = qwe ELSE a = 3
IF p(sijo(qwe, 1)) > pisenp(a) THEN
pisenp(a) = p(sijo(qwe, 1))
pisenj(a) = sijo(qwe, 1)
pisenohj(a) = ohj(sijo(qwe, 1))
END IF
NEXT qwe
FOR qwe = 1 TO 2
FOR cupex = pep(qwe, pround).joukk + 1 TO 12
sed(sijo(qwe, cupex)) = cupex + (qwe - 1) * 12
NEXT cupex
NEXT qwe
plajaytajoukkueet
PRINT
mukachk
FOR pv = 1 TO plkm
IF mukp(pv) = 1 THEN
annarahaa 5
sponso(13, pv) = 0
sponso(14, pv) = 0
sponso(15, pv) = 0
END IF
IF mukp(pv) = 0 THEN
annarahaa 11
annarahaa 12
annarahaa 13
sponso(1, pv) = 0
sponso(2, pv) = 0
sponso(3, pv) = 0
sponso(4, pv) = 0
sponso(5, pv) = 0
END IF
NEXT pv
pesc
CASE 3
DIM templex(1 TO 3, 1 TO 8) AS INTEGER
FOR qwe = 1 TO 3
IF qwe = 1 THEN xxx = 5 ELSE IF qwe = 2 THEN xxx = 16 ELSE xxx = 31
FOR cupex = 1 TO pep(qwe, pround).joukk
IF pwin(plex(qwe, cupex)) < 3 THEN sed(plex(qwe, cupex)) = xxx: xxx = xxx + 1
NEXT cupex
NEXT qwe
FOR qwe = 1 TO 3
IF qwe = 1 THEN xxx = 1 ELSE IF qwe = 2 THEN xxx = 2 ELSE xxx = 3
FOR cupex = 1 TO pep(qwe, pround).joukk
IF pwin(plex(qwe, cupex)) = 3 THEN templex(qwe, xxx) = plex(qwe, cupex): xxx = xxx + 1
NEXT cupex
NEXT qwe
templex(2, 1) = sijo(1, 12): sr(sijo(1, 12)) = 2
FOR cupex = 1 TO 2
templex(3, cupex) = sijo(2, cupex + 10): sr(sijo(2, cupex + 10)) = 3
NEXT cupex
pround = pround + 1
FOR qwe = 1 TO 3
FOR cupex = 1 TO pep(qwe, pround).joukk
plex(qwe, cupex) = templex(qwe, cupex)
NEXT cupex
NEXT qwe
plajaytajoukkueet
pkr = 1
FOR zz = 1 TO 48
pwin(zz) = 0
NEXT zz
mukachk
FOR pv = 1 TO plkm
IF mukp(pv) = 1 AND tempsr(u(pv)) = sr(u(pv)) THEN
sponso(12, pv) = 0
END IF
IF mukp(pv) = 1 AND tempsr(u(pv)) <> sr(u(pv)) THEN
annarahaa 14
END IF
IF mukp(pv) = 0 THEN
annarahaa 11
annarahaa 12
sponso(1, pv) = 0
sponso(2, pv) = 0
sponso(3, pv) = 0
sponso(4, pv) = 0
END IF
NEXT pv
pesc
ERASE templex
CASE 5
DIM templex(1 TO 3, 1 TO 4) AS INTEGER
xxx = 1
FOR cupex = 1 TO 4
IF pwin(plex(1, cupex)) = 3 THEN templex(1, xxx) = plex(1, cupex): xxx = xxx + 1
NEXT cupex
xxx = 3
FOR cupex = 1 TO 4
IF pwin(plex(1, cupex)) < 3 THEN templex(1, xxx) = plex(1, cupex): xxx = xxx + 1
NEXT cupex
FOR qwe = 2 TO 3
xxx = 1
FOR cupex = 1 TO pep(qwe, pround).joukk
IF pwin(plex(qwe, cupex)) = 3 THEN templex(qwe, xxx) = plex(qwe, cupex): xxx = xxx + 1
NEXT cupex
NEXT qwe
FOR qwe = 2 TO 3
IF qwe = 2 THEN xxx = 14 ELSE xxx = 27
FOR cupex = 1 TO pep(qwe, pround).joukk
IF pwin(plex(qwe, cupex)) < 3 THEN sed(plex(qwe, cupex)) = xxx: xxx = xxx + 1
NEXT cupex
NEXT qwe
FOR qwe = 1 TO 3
FOR cupex = 1 TO pep(qwe, pround + 1).joukk
plex(qwe, cupex) = templex(qwe, cupex)
NEXT cupex
NEXT qwe
pround = pround + 1
plajaytajoukkueet
pkr = 1
FOR zz = 1 TO 48
pwin(zz) = 0
NEXT zz
pesc
ERASE templex
END SELECT
END SUB

SUB poisjun
borsinit 1
IF lastbors < UBOUND(bel) THEN
bel(lastbors + 1) = jel(kurso, pv)
lastbors = lastbors + 1
END IF
IF kurso < lpj(pv) THEN
FOR smut = kurso TO lpj(pv) - 1
jel(smut, pv) = jel(smut + 1, pv)
NEXT smut
END IF
lpj(pv) = lpj(pv) - 1
kurso = 1
IF lpj(pv) = 0 THEN lukka = 1
borsinit 2
END SUB

SUB poisne
borsinit 1
temp% = 0
poskeen:
FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).svu = 0 THEN
IF temp% = 0 THEN
GOSUB huuskonen
END IF
temp% = 1
lax 96
GOSUB poisxe
GOTO poskeen
END IF
NEXT xx
PRINT
poskeen2:
FOR xx = 1 TO lpj(pv)
IF temp% = 0 THEN GOSUB huuskonen
temp% = 1
COLOR 10
PRINT RTRIM$(jel(xx, pv).nam); " ";
COLOR 2: PRINT "l„htee etsim„„n n„yt”npaikkaa maailmalta!"
IF lastbors < UBOUND(bel) THEN
bel(lastbors + 1) = jel(xx, pv)
bel(lastbors + 1).neu = 1
lastbors = lastbors + 1
END IF
NEXT xx
lpj(pv) = 0
IF temp% = 1 THEN pjn
aaaargh
FOR xx = lpl(pv) + 1 TO 32
pel(xx, pv) = blanko
NEXT xx
FOR xx = 1 TO 10
jel(xx, pv) = blanko
NEXT xx
borsinit 2
EXIT SUB
poisxe:
IF lastbors < UBOUND(bel) THEN
bel(lastbors + 1) = pel(xx, pv)
bel(lastbors + 1).pok = 0
bel(lastbors + 1).neu = 0
lastbors = lastbors + 1
END IF
poispelaaja xx, pv
RETURN
huuskonen:
leq 5
RETURN
END SUB

SUB poispel
poispelaaja xx, pv
sortmaar
ketjuchk
kc
END SUB

SUB poispelaaja (vp%, jp%)
IF maa(1, jp%) = vp% THEN maa(1, jp%) = 0
FOR qwe = 1 TO 5
FOR cupex = 1 TO 6
IF ketju(qwe, cupex, jp%) = vp% THEN ketju(qwe, cupex, jp%) = 0
NEXT cupex
NEXT qwe
IF kapu(jp%) = vp% THEN kapu(jp%) = 0
IF maa(1, jp%) > vp% THEN maa(1, jp%) = maa(1, jp%) - 1
FOR qwe = 1 TO 5
FOR cupex = 1 TO 6
IF ketju(qwe, cupex, jp%) > vp% THEN ketju(qwe, cupex, jp%) = ketju(qwe, cupex, jp%) - 1
NEXT cupex
NEXT qwe
IF kapu(jp%) > vp% THEN kapu(jp%) = kapu(jp%) - 1
IF vp% = lpl(jp%) THEN GOTO smutero
FOR smut = vp% + 1 TO lpl(jp%)
pel(smut - 1, jp%) = pel(smut, jp%)
NEXT smut
smutero:
IF kurso = lpl(jp%) THEN kurso = kurso - 1
lpl(jp%) = lpl(jp%) - 1
END SUB

SUB postia (posti%)
COLOR 20
LOCATE 40, 1: PRINT "ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍPOSTIA!ÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»";
LOCATE 41, 1: PRINT "º                                   º";
LOCATE 42, 1: PRINT "ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼";
LOCATE 41, 2: COLOR 12: PRINT "L: ";
IF posti% = 1 THEN PRINT "TURNAUSKUTSU" ELSE PRINT "RUSKEA KIRJEKUORI"
END SUB

SUB potk (potcu%)
DIM vapaa(1 TO 54) AS INTEGER
FOR qwe = 1 TO 48
IF ohj(qwe) = 0 THEN vapaa(man(qwe)) = 1
NEXT qwe
potku = potcu%
perverz:
yy = INT(54 * RND) + 1
IF vapaa(yy) = 1 THEN GOTO perverz
lax 122 + INT(6 * RND)
man(potku) = yy
PRINT
ERASE vapaa
END SUB

SUB printket
COLOR 14, 0
LOCATE 3, 36: PRINT "MV:"
LOCATE 3, 40
SELECT CASE maa(1, pv)
CASE 0
COLOR 4, 0
PRINT "-          "
LOCATE , 40: PRINT "                "
CASE ELSE
IF sort2(kurso) = maa(1, pv) THEN COLOR , 6 ELSE COLOR , 0
IF pel(maa(1, pv), pv).ppp = 1 THEN COLOR 14 ELSE COLOR 4
PRINT RIGHT$(pel(maa(1, pv), pv).nam, 11)
LOCATE , 40
PRINT LTRIM$(STR$(pel(maa(1, pv), pv).psk + pel(maa(1, pv), pv).plus + erik(3, u(pv)))); "] ";
IF pel(maa(1, pv), pv).gls = 0 OR pel(maa(1, pv), pv).ppp <> 1 THEN PRINT "-";  ELSE PRINT LEFT$(LTRIM$(STR$((pel(maa(1, pv), pv).gls / pel(maa(1, pv), pv).pot))), 3); " M/OTT.";
END SELECT

IF curso < 6 THEN gnome = 3 ELSE gnome = 2

FOR qwe = 1 TO 5
IF curso = qwe THEN COLOR 14, 6 ELSE COLOR 7, 0
IF qwe < 4 THEN xx = qwe ELSE IF qwe = 4 THEN xx = 5 ELSE xx = 6
LOCATE 7 + ((qwe - 1) * gnome), 36
IF qwe < 4 THEN PRINT "P" + LTRIM$(STR$(qwe)) + ":" ELSE IF qwe = 4 THEN PRINT "PY:" ELSE PRINT "PA:"
FOR zz = 1 TO 2
LOCATE 7 + ((qwe - 1) * gnome), 40 + (zz - 1) * 14
SELECT CASE ketju(zz, xx, pv)
CASE 0
COLOR 4, 0: PRINT "-          "
IF curso < 6 THEN LOCATE 8 + ((qwe - 1) * gnome), 40 + (zz - 1) * 14: PRINT "               "
CASE ELSE
IF curso = qwe THEN COLOR 14, 0 ELSE COLOR 7, 0
IF sort2(kurso) = ketju(zz, xx, pv) THEN COLOR , 6 ELSE COLOR , 0
PRINT RIGHT$(pel(ketju(zz, xx, pv), pv).nam, 11)
IF curso < 6 THEN
LOCATE 8 + ((qwe - 1) * gnome), 40 + (zz - 1) * 14
IF xx < 4 THEN PRINT LTRIM$(STR$(pel(ketju(zz, xx, pv), pv).psk + pel(ketju(zz, xx, pv), pv).plus + erik(3, u(pv)))); "] ";  ELSE IF xx = 5 THEN PRINT LTRIM$(STR$(pel(ketju(zz, xx, pv), pv).psk + pel(ketju(zz, xx, pv), pv).plus + pel(ketju(zz, xx,  _
pv), pv).yvo + erik(3, u(pv)))); "] ";  ELSE PRINT LTRIM$(STR$(pel(ketju(zz, xx, pv), pv).psk + pel(ketju(zz, xx, pv), pv).plus + pel(ketju(zz, xx, pv), pv).avo + erik(3, u(pv)))); "] ";
PRINT LTRIM$(STR$(pel(ketju(zz, xx, pv), pv).gls)); "+"; LTRIM$(STR$(pel(ketju(zz, xx, pv), pv).ass)); "="; LTRIM$(STR$(pel(ketju(zz, xx, pv), pv).gls + pel(ketju(zz, xx, pv), pv).ass))


END IF

END SELECT
NEXT zz
NEXT qwe

IF curso < 6 THEN gnome = 2: zzz = 23 ELSE gnome = 3: zzz = 18

FOR qwe = 6 TO 11
IF curso = qwe THEN COLOR 14, 6 ELSE COLOR 7, 0
IF qwe < 10 THEN xx = qwe - 5 ELSE IF qwe = 10 THEN xx = 5 ELSE xx = 6
LOCATE zzz + ((qwe - 6) * gnome), 36
IF qwe < 10 THEN PRINT "H" + LTRIM$(STR$(qwe - 5)) + ":" ELSE IF qwe = 10 THEN PRINT "HY:" ELSE PRINT "HA:"
FOR zz = 3 TO 5
IF zz <> 5 OR qwe <> 11 THEN
LOCATE zzz + ((qwe - 6) * gnome), 40 + (zz - 3) * 14
SELECT CASE ketju(zz, xx, pv)
CASE 0
COLOR 4, 0: PRINT "-          "
IF curso > 5 THEN LOCATE zzz + 1 + ((qwe - 6) * gnome), 40 + (zz - 3) * 14: PRINT "             "
CASE ELSE
IF curso = qwe THEN COLOR 14, 0 ELSE COLOR 7, 0
IF sort2(kurso) = ketju(zz, xx, pv) THEN COLOR , 6 ELSE COLOR , 0
PRINT RIGHT$(pel(ketju(zz, xx, pv), pv).nam, 11)
IF curso > 5 THEN
LOCATE zzz + 1 + ((qwe - 6) * gnome), 40 + (zz - 3) * 14
IF xx < 5 THEN PRINT LTRIM$(STR$(pel(ketju(zz, xx, pv), pv).psk + pel(ketju(zz, xx, pv), pv).plus + erik(3, u(pv)))); "] ";  ELSE IF xx = 5 THEN PRINT LTRIM$(STR$(pel(ketju(zz, xx, pv), pv).psk + pel(ketju(zz, xx, pv), pv).plus + pel(ketju(zz, xx,  _
pv), pv).yvo + erik(3, u(pv)))); "] ";  ELSE PRINT LTRIM$(STR$(pel(ketju(zz, xx, pv), pv).psk + pel(ketju(zz, xx, pv), pv).plus + pel(ketju(zz, xx, pv), pv).avo + erik(3, u(pv)))); "] ";
PRINT LTRIM$(STR$(pel(ketju(zz, xx, pv), pv).gls)); "+"; LTRIM$(STR$(pel(ketju(zz, xx, pv), pv).ass)); "="; LTRIM$(STR$(pel(ketju(zz, xx, pv), pv).gls + pel(ketju(zz, xx, pv), pv).ass))
END IF
END SELECT
END IF
NEXT zz
NEXT qwe





END SUB

SUB printpel (fat%)
SELECT CASE fat%
CASE 1, 8
neup = pel(xx, pv)
CASE 2
neup = pel(xx, borsch(curso))
CASE 3
neup = jel(xx, pv)
CASE 5
neup = bel(sortb(xx))
CASE 6
neup = pel(sort2(a), pv)
CASE 7
neup = pel(xx, ote)
END SELECT
IF fat% <> 6 THEN COLOR 10
IF fat% = 1 OR fat% = 2 OR fat% = 3 OR fat% = 8 THEN GOSUB klohma
LOCATE , 1
IF fat% = 6 THEN PRINT RIGHT$(neup.nam, 11);  ELSE PRINT neup.nam;
IF fat% <> 6 THEN LOCATE , 15: PRINT kansal(neup.nat);
IF fat% = 6 THEN LOCATE , 13 ELSE LOCATE , 19
IF fat% = 5 THEN
IF skout(neup.nat, pv) <> 1 THEN PRINT "??"; : EXIT SUB
END IF
PRINT pelip(neup.ppp);
IF fat% = 6 THEN LOCATE , 16 ELSE LOCATE , 22
PRINT LTRIM$(STR$(neup.age)); "  ";
IF fat% <> 6 THEN
LOCATE , 25: PRINT LTRIM$(STR$(neup.ldr)); "  ";
LOCATE , 28: PRINT LTRIM$(STR$(neup.kar)); "  ";
END IF
IF fat% = 6 THEN LOCATE , 20 ELSE LOCATE , 33
IF fat% <> 6 THEN COLOR 7
IF fat% = 1 OR fat% = 3 OR fat% = 6 OR fat% = 8 THEN pluss = neup.plus + erik(3, u(pv)) ELSE pluss = 0
IF fat% = 1 OR fat% = 3 OR fat% = 8 THEN
IF pluss < 0 THEN COLOR 8 ELSE IF pluss = 0 THEN COLOR 7 ELSE COLOR 15
END IF
IF fat% = 1 OR fat% = 6 THEN
IF krapu(pv) <> 0 THEN
PRINT CHR$(1); CHR$(2);
GOTO kraapula
END IF
END IF
PRINT LTRIM$(STR$(neup.psk + pluss)); "  ";
kraapula:
IF neup.ppp <> 1 THEN
IF fat% = 6 THEN LOCATE , 23 ELSE LOCATE , 36
PRINT STR$(neup.yvo); "  ";
IF fat% = 6 THEN LOCATE , 26 ELSE LOCATE , 39
PRINT STR$(neup.avo); "  ";
END IF
IF fat% = 5 AND neup.ppp = 1 THEN COLOR , 0: PRINT "      ";
IF fat% = 1 OR fat% = 3 OR fat% = 8 OR fat% = 2 THEN GOSUB klohma
IF fat% = 5 OR fat% = 7 OR fat% = 66 THEN EXIT SUB
IF fat% <> 6 THEN
LOCATE , 44
IF neup.inj = 0 THEN
SELECT CASE fat%
CASE 1
IF kapu(pv) = xx THEN PRINT "C"; " ";
CASE 2
IF kapu(borsch(curso)) = xx THEN PRINT "C";
END SELECT
END IF
IF neup.inj <> 0 THEN
SELECT CASE neup.inj
CASE IS < 1000
PRINT "LO ";
IF neup.inj = -1 THEN PRINT "??";  ELSE PRINT LTRIM$(STR$(neup.inj));
CASE 1001 TO 1999
PRINT "PK ";
PRINT LTRIM$(STR$(neup.inj - 1000));
CASE 2001 TO 2999
PRINT "VI ";
PRINT LTRIM$(STR$(neup.inj - 2000));
CASE 3333
PRINT "LAKKO";
CASE IS > 9000
PRINT "MJ ";
END SELECT
END IF
END IF
IF fat% = 8 THEN EXIT SUB
IF fat% <> 1 AND fat% <> 3 THEN sivux = 1
SELECT CASE sivux
CASE 1
IF fat% = 6 THEN LOCATE , 30 ELSE LOCATE , 50
IF neup.kun < 0 THEN COLOR 1 ELSE COLOR 15
PRINT STR$(neup.kun);
IF fat% = 6 THEN EXIT SUB
GOSUB klohma
LOCATE , 54
PRINT LTRIM$(STR$(neup.pok));
LOCATE , 59
PRINT LTRIM$(STR$(neup.pot));
IF fat% <> 2 THEN
IF neup.ppp <> 1 THEN
IF neup.gls < 10 THEN LOCATE , 65 ELSE LOCATE , 64
PRINT LTRIM$(STR$(neup.gls));
PRINT " + ";
PRINT LTRIM$(STR$(neup.ass));
LOCATE , 71
PRINT "= ";
PRINT LTRIM$(STR$(neup.gls + neup.ass));
END IF
IF fat% = 1 AND neup.ppp = 1 THEN
LOCATE , 65
IF neup.pot = 0 THEN PRINT "-";  ELSE PRINT LEFT$(LTRIM$(STR$((neup.gls / neup.pot))), 3); " M/OTT.";
END IF
END IF
IF neup.spe = 5 AND neup.ket > 0 AND fat% = 1 THEN COLOR 8: LOCATE , 77: PRINT "(M)";
IF neup.spe = 666 AND neup.ket > 0 AND fat% = 1 THEN COLOR 15: LOCATE , 77: PRINT "(M)";
IF fat% <> 1 AND fat% <> 3 THEN
LOCATE , 70
PRINT LTRIM$(STR$(neup.svu));
IF neup.nhl < 0 THEN PRINT "N";  ELSE IF neup.nhl = 1 THEN PRINT "VP";  ELSE IF neup.nhl = 2 THEN PRINT "+1";
LOCATE , 72
PRINT LTRIM$(STR$(neup.sra));
END IF
CASE 2
LOCATE , 50
SELECT CASE neup.svu
CASE IS < 98
PRINT LTRIM$(STR$(neup.svu));
IF neup.nhl < 0 THEN PRINT "N";  ELSE IF neup.nhl = 1 THEN PRINT "VP";  ELSE IF neup.nhl = 2 THEN PRINT "+1";
LOCATE , 55
PRINT LTRIM$(STR$(neup.sra));
LOCATE , 63
SELECT CASE neup.lah
CASE 96
PRINT "P™RSSI";
CASE 97
PRINT "NHL";
CASE 98
PRINT "KOTIMAA";
CASE 99
PRINT "ELŽKE";
END SELECT
CASE IS > 10000
PRINT "MIETTII";
CASE 666
PRINT "LAINASSA";
END SELECT
CASE 3
LOCATE , 50
SELECT CASE neup.spe
CASE IS >= 30000
lay 54
CASE 1 TO 7, 9 TO 13
lay 41 + neup.spe
CASE 8
IF neup.pok > 30 THEN lay 41 + neup.spe
END SELECT
CASE 4
LOCATE , 50
IF pel(xx, pv).ppp <> 1 THEN
IF rug(xx, pv) < 10 THEN PRINT " ";
PRINT LTRIM$(STR$(rug(xx, pv)));
PRINT " + ";
PRINT LTRIM$(STR$(rua(xx, pv)));
IF rua(xx, pv) < 10 THEN PRINT " ";
PRINT " = ";
PRINT LTRIM$(STR$(rug(xx, pv) + rua(xx, pv)))
END IF
END SELECT
EXIT SUB
klohma:
IF neup.inj = 0 THEN
IF neup.ket = 0 THEN COLOR 10 ELSE COLOR 14
ELSE
COLOR 4
END IF
RETURN
END SUB


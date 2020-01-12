DECLARE SUB al (fat%)
DECLARE SUB annanhal ()
DECLARE SUB arvox (arvob%)
DECLARE SUB arpo (arf%)
DECLARE SUB dap (dep%)
DECLARE SUB erikoisp (fuk%)
DECLARE SUB mor (mora%, morax%)
DECLARE SUB leq (fat%)
DECLARE SUB lax (fat%)
DECLARE SUB lt (lue$, lukux%)
DECLARE SUB lay (fat%)
DECLARE SUB haahaa (haha%)
DECLARE SUB ku (kuz%, ku1%, ku2%)
DECLARE SUB lentti (kuka%, sano%)
DECLARE SUB komme (sano%)
DECLARE SUB jaynacheck (choko%)
DECLARE SUB lux (fat%)
DECLARE SUB klearstat (fat%)
DECLARE SUB krapulapiirto ()
DECLARE SUB kuntopuntari (sar!)
DECLARE SUB lex (fat%)
DECLARE SUB luz (fat%)
DECLARE SUB mahmax ()
DECLARE SUB pjn ()
DECLARE SUB palkmaar ()
DECLARE SUB printpel (fat%)
DECLARE SUB poispelaaja (vp%, jp%)
DECLARE SUB pesc ()
DECLARE SUB potk (potcu%)
DECLARE SUB staulmaar ()
DECLARE SUB qelp (qel%)
DECLARE SUB rela ()
DECLARE SUB protesti ()
DECLARE SUB rah ()
DECLARE SUB sex (stondis%)
DECLARE SUB wnd (ser%)
DECLARE SUB staulnayt (sar!, sty!, stx!, iso!)
DECLARE SUB staulnaytehl ()
DECLARE FUNCTION tarko% (t0%, t1%, t2%, t3%)
DECLARE FUNCTION tarka% (jez%)
'$DYNAMIC
'$INCLUDE: 'mhm2k.bi'

REM $STATIC
SUB protesti
a = 0: b = 0
CLS
lax 119
PRINT
PRINT "SYYTTŽJŽ: ";
COLOR 14: PRINT RTRIM$(l(xx));
PRINT " ("; RTRIM$(mana(man(xx)).nam); ")"
PRINT : COLOR 2
PRINT "SYYTETTY: ";
COLOR 14
PRINT RTRIM$(l(xxx));
PRINT " ("; RTRIM$(mana(man(xxx)).nam); ")"
PRINT
FOR zz = 1 TO 11
COLOR 7
PRINT "JŽSEN "; LTRIM$(STR$(zz)); ": ";
d = INT(100 * RND) + 1
COLOR 15
IF d <= 50 + (mtaito(5, man(xx)) * 5) - (mtaito(5, man(xxx)) * 5) THEN PRINT "PUOLESTA": b = b + 1 ELSE PRINT "VASTAAN": a = a + 1
PRINT
NEXT zz
IF b < a THEN xx = xx ELSE xx = xxx
p(xx) = p(xx) - 2
mo(xx) = mo(xx) - 2
IF b < a THEN lax 184 ELSE lax 185
staulmaar
pjn
END SUB

SUB qelp (qel%)
COLOR , 0
CLS
COLOR 7
OPEN "help\" + LTRIM$(STR$(qel%)) + ".hlp" FOR INPUT AS #1
DO UNTIL EOF(1)
LINE INPUT #1, text$
IF CSRLIN < 41 THEN PRINT text$ ELSE pjn: CLS : COLOR 7: PRINT text$
LOOP
CLOSE #1
pjn
END SUB

SUB rah
raha(pv) = raha(pv) + rahna
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

SUB report
IF gl(u(pv)) > gl(vast(pv)) THEN tuloste = 1
IF gl(u(pv)) = gl(vast(pv)) THEN tuloste = 2
IF gl(u(pv)) < gl(vast(pv)) THEN tuloste = 3

putki(tuloste, pv) = putki(tuloste, pv) + 1
FOR a = 1 TO 3
IF a <> tuloste THEN putki(a, pv) = 0
NEXT a
IF putki(3, pv) > 0 THEN putki(4, pv) = 0: putki(5, pv) = putki(5, pv) + 1
IF putki(1, pv) > 0 THEN putki(5, pv) = 0: putki(4, pv) = putki(4, pv) + 1
IF putki(2, pv) > 0 THEN putki(5, pv) = putki(5, pv) + 1: putki(4, pv) = putki(4, pv) + 1

rahna = 0
rahna2 = 0

IF vieras(pv) = 1 THEN
rahna2 = rahna2 + erikmak(erik(4, u(pv)), 4)
IF erik(1, u(pv)) = 2 THEN rahna2 = rahna2 + erikmak(erik(1, u(pv)), 1)
END IF

IF koti(pv) = 1 THEN
IF erik(1, u(pv)) > 0 THEN rahna2 = rahna2 + erikmak(erik(1, u(pv)), 1)
rahna2 = rahna2 + erikmak(erik(2, u(pv)), 2)
END IF

rahna2 = rahna2 + erikmak(erik(3, u(pv)), 3)

rahna = rahna + rahna2

gorea:
leq 18
LOCATE 1, 45
PRINT "TALOUSKATSAUS";
COLOR 7: LOCATE 3, 1
PRINT l(u(pv)); " - "; l(vast(pv));
PRINT " ";
IF koti(pv) = 1 THEN PRINT "(K)";  ELSE PRINT "(V)";
PRINT gl(u(pv)); " - "; gl(vast(pv));
IF ja(u(pv)) <> 0 THEN PRINT " ja." ELSE PRINT
COLOR 6: LOCATE 5, 1
IF koti(pv) = 1 THEN
PRINT "YLEIS™Ž: ";
COLOR 14
PRINT LTRIM$(STR$(ylm(1, u(pv)) + ylm(2, u(pv))))
PRINT
END IF
COLOR 6

LOCATE 7, 1
FOR a = 1 TO 5
IF putki(a, pv) > 1 THEN
gnome = putki(a, pv): lt "ptk", a
END IF
NEXT a

LOCATE 3
temp% = 0
IF koti(pv) = 1 THEN temp% = 1
IF sr(u(pv)) = 1 THEN
IF kiero(kr) = 42 OR kiero(kr) = 44 OR kiero(kr) = 46 THEN temp% = 0
END IF

IF temp% = 1 THEN


COLOR 14: LOCATE , 45
PRINT "LIPPUTULOT";
LOCATE , 70: COLOR 10
SELECT CASE kiero(kr)
CASE 1
PRINT CLNG((ylm(2, u(pv)) - kausik(u(pv))) * lhinta(sr(u(pv))) + ylm(1, u(pv)) * (lhinta(sr(u(pv))) * .75))
rahna = rahna + (ylm(2, u(pv)) - kausik(u(pv))) * lhinta(sr(u(pv))) + ylm(1, u(pv)) * (lhinta(sr(u(pv))) * .75)
CASE ELSE
PRINT CLNG(ylm(2, u(pv)) * lhinta(sr(u(pv))) + ylm(1, u(pv)) * (lhinta(sr(u(pv))) * .75))
rahna = rahna + ylm(2, u(pv)) * lhinta(sr(u(pv))) + ylm(1, u(pv)) * (lhinta(sr(u(pv))) * .75)
END SELECT

END IF

IF koti(pv) = 1 THEN

sin1 = .75 + (.1 * RND)
rahna = rahna + CLNG((sin1 * (ylm(1, u(pv)) + ylm(2, u(pv))) * (3 + (erik(2, u(pv)) * 2))))
COLOR 14: LOCATE , 45
PRINT "RUOKA & JUOMA";
LOCATE , 70
COLOR 10: PRINT CLNG((sin1 * (ylm(1, u(pv)) + ylm(2, u(pv))) * (3 + (erik(2, u(pv)) * 2))))

sin1 = .45 + (.1 * RND)
rahna = rahna + CLNG((sin1 * (ylm(1, u(pv)) + ylm(2, u(pv))) * (4 - (sr(u(pv))))))
COLOR 14: LOCATE , 45
PRINT "FANITUOTTEET";
LOCATE , 70
COLOR 10: PRINT CLNG((sin1 * (ylm(1, u(pv)) + ylm(2, u(pv))) * (4 - (sr(u(pv))))))

END IF

IF kiero(kr) <> 4 THEN
rahna = rahna + sponso(20, pv)
LOCATE , 45: COLOR 14
PRINT "OTTELUMAKSU";
LOCATE , 70: COLOR 10
PRINT sponso(20, pv)
END IF

IF kiero(kr) <> 4 THEN
rahna = rahna + pelbudget(pv)
COLOR 6: LOCATE , 45
PRINT "PELAAJABUDJETTI";
LOCATE , 70: COLOR 2: PRINT pelbudget(pv)
END IF

IF kiero(kr) = 1 THEN
COLOR 6: LOCATE , 45
IF laina(1, pv) > 0 OR laina(2, pv) > 0 OR laina(3, pv) > 0 THEN
PRINT "KORKOMENOT";
LOCATE , 70: COLOR 2
PRINT -FIX(laina(1, pv) * pankkor(1) / 44 + laina(2, pv) * pankkor(2) / 44 + laina(3, pv) * pankkor(3) / 44)
rahna = rahna - FIX(laina(1, pv) * pankkor(1) / 44 + laina(2, pv) * pankkor(2) / 44 + laina(3, pv) * pankkor(3) / 44)
END IF
END IF

IF kiero(kr) = 1 AND skoutteja(pv) > 0 THEN
COLOR 6: LOCATE , 45
PRINT "KYKYJENETSIJŽT";
LOCATE , 70: COLOR 2: PRINT -CLNG(skoutteja(pv)) * 2000
rahna = rahna - CLNG(skoutteja(pv)) * 2000
END IF
IF rahna2 <> 0 THEN
COLOR 6: LOCATE , 45: PRINT "ERIKOISTOIMENPITEET";
LOCATE , 70: COLOR 2: PRINT LTRIM$(STR$(rahna2))
END IF

IF kiero(kr) = 1 THEN
FOR qwe = 1 TO 5
IF qwe < 5 OR valb(qwe, pv) <> 1 THEN
IF qwe < 5 THEN rahna = rahna + valbh(vai(2, pv), qwe, valb(qwe, pv)) ELSE rahna = rahna + valbh(vai(2, pv), qwe, valb(qwe, pv)) * lpl(pv)
LOCATE , 45
COLOR 6
lay 79 + qwe
LOCATE , 70
COLOR 2
IF qwe < 5 THEN PRINT LTRIM$(STR$(valbh(vai(2, pv), qwe, valb(qwe, pv)))) ELSE PRINT LTRIM$(STR$(valbh(vai(2, pv), qwe, valb(qwe, pv)) * lpl(pv)))
END IF
NEXT qwe
END IF

LOCATE , 45: COLOR 7: PRINT STRING$(33, "Ä")
LOCATE , 70
IF rahna < 0 THEN COLOR 2 ELSE COLOR 10
PRINT rahna

IF raha(pv) >= 0 THEN rah ELSE konkurssi(pv) = konkurssi(pv) + 1

IF lm = 1 THEN
IF maa(1, pv) <> 0 THEN
IF pel(maa(1, pv), pv).ppp = 1 THEN
pel(maa(1, pv), pv).gls = pel(maa(1, pv), pv).gls + gl(vast(pv))
END IF
END IF
END IF
IF kiero(kr) = 1 THEN
vsaldo(sr(u(pv)), tuloste, pv) = vsaldo(sr(u(pv)), tuloste, pv) + 1
END IF

xxx = 0
IF kiero(kr) = 1 THEN
IF sovtap(pv) = 1 THEN
sovtap(pv) = 0
IF tuloste <> 3 THEN
sopuhu(pv) = sopuhu(pv) + 1
seuraus% = INT(100 * RND) + 1
SELECT CASE seuraus%
CASE IS < 50
jaynax(5, u(pv)) = 1
CASE 50 TO 80
jaynax(6, u(pv)) = 1
CASE 81 TO 100
jaynax(3, u(pv)) = 1
jaynax(5, u(pv)) = 1
jaynax(6, u(pv)) = 1
END SELECT
END IF
END IF
END IF
LOCATE 11, 1

zz = 1
DO WHILE maali(zz, pv) <> ""
IF maalix(zz, pv) = pv THEN COLOR 10 ELSE COLOR 7
PRINT RTRIM$(maali(zz, pv)); " ";
IF yvoima(zz, pv) = 1 THEN PRINT "yv." ELSE PRINT
IF maalix(zz, pv) = pv THEN COLOR 2 ELSE COLOR 8
IF syotto(zz, 1, pv) <> "" THEN
PRINT " ("; RTRIM$(syotto(zz, 1, pv));
SELECT CASE syotto(zz, 2, pv)
CASE ""
PRINT ")"
CASE ELSE
PRINT ","; RTRIM$(syotto(zz, 2, pv)); ")"
END SELECT
END IF
zz = zz + 1
LOOP

pjn

END SUB

SUB rstages
SELECT CASE uhatapa(pv)
CASE 10 TO 100
IF uhatapa(pv) < 100 THEN uhatapa(pv) = uhatapa(pv) + arkkitehti(pv)
IF uhatapa(pv) > 100 THEN uhatapa(pv) = 100
c = INT(151 * RND)
IF c < uhatapa(pv) - 10 THEN
leq 5
lay 138 + arkkitehti(pv)
lax 160
PRINT
COLOR 6
PRINT "RAKENNUSLUPA ";
COLOR 14
d = INT(101 * RND)
SELECT CASE d
CASE IS < 60 - (arkkitehti(pv) * 20)
PRINT "EVŽTŽŽN."
PRINT
lay 138 + arkkitehti(pv)
lax 161
uhatapa(pv) = 10
CASE ELSE
PRINT "MY™NNETŽŽN."
PRINT
lay 138 + arkkitehti(pv)
lax 162
IF rakennuttaja(pv) = 1 THEN uhatapa(pv) = 1090 ELSE IF rakennuttaja(pv) = 2 THEN uhatapa(pv) = 1080 ELSE uhatapa(pv) = 1070
mpv(pv) = CLNG(mpv(pv) / (uhatapa(pv) - 1000))
END SELECT
pesc
END IF
CASE 1001 TO 1999, 2001 TO 2999
IF potti(pv) >= mpv(pv) THEN
potti(pv) = potti(pv) - mpv(pv)
d = INT(100 * RND) + 1
IF d <= 3 - rakennuttaja(pv) THEN
leq 5
lay 135 + rakennuttaja(pv)
lax 165
pesc
END IF
IF d >= 3 - rakennuttaja(pv) THEN uhatapa(pv) = uhatapa(pv) - 1
END IF
CASE 1000
leq 5
lay 135 + rakennuttaja(pv)
lax 166
LOCATE 6, 1
COLOR 15
PRINT "NIMEŽ UUSI, ULJAS AREENASI!"
annanhal
taso(u(pv)) = utaso(pv)
ppiste(u(pv)) = uppiste(pv)
FOR qwe = 1 TO 3
paikka(qwe, u(pv)) = upaikka(qwe, pv)
NEXT qwe
uhatapa(pv) = 0
LOCATE 11, 1
arpo 1
lax 170 + INT(6 * RND)
pesc
CASE 2000
leq 5
lay 135 + rakennuttaja(pv)
lax 169
taso(u(pv)) = utaso(pv)
ppiste(u(pv)) = uppiste(pv)
FOR qwe = 1 TO 3
paikka(qwe, u(pv)) = upaikka(qwe, pv)
NEXT qwe
uhatapa(pv) = 0
pesc
END SELECT
END SUB

SUB sattuma
leq 32

IF konkurssi(pv) > 0 THEN
IF konkurssi(pv) < 5 THEN lt "konkka", konkurssi(pv) ELSE lt "konkka", 5
PRINT
END IF

IF erik(3, u(pv)) <> 0 THEN

SELECT CASE kiero(kr)
CASE 1
IF INT(101 * RND) < erik(3, u(pv)) * 10 THEN

rahna = -1000000
rah
mor u(pv), -55
lax 41
PRINT

p(u(pv)) = 0
gf(u(pv)) = 0
ga(u(pv)) = ot * 20
win(u(pv)) = 0
dra(u(pv)) = 0
los(u(pv)) = ot

FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).ppp <> 1 THEN
pel(xx, pv).gls = 0
pel(xx, pv).ass = 0
END IF
NEXT xx

END IF

CASE 2
IF INT(101 * RND) < erik(3, u(pv)) * 15 THEN
rahna = -500000
rah
mor u(pv), -55
lax 43
PRINT
FOR xx = 1 TO 20
IF ohj(ex(xx)) = pv THEN EXIT FOR
NEXT xx
ep(xx) = 0
egf(xx) = 0
ega(xx) = eot * 20
muke(pv) = 0
yy = 70 + pv
ex(xx) = yy
END IF

CASE 3
IF INT(101 * RND) < erik(3, u(pv)) * 20 THEN
rahna = -400000
rah
mor u(pv), -55
lax 215
PRINT leggi
SELECT CASE leggi
CASE 1
leg(u(pv)) = 0
leg(vast(pv)) = 20
CASE 2
FOR xx = 1 TO UBOUND(tempcup)
IF cup(xx) = vast(pv) OR cup(xx) = u(pv) THEN EXIT FOR
NEXT xx
IF cup(xx) = u(pv) THEN cup(xx) = vast(pv)
END SELECT
END IF

CASE 42, 44, 46
IF INT(101 * RND) < erik(3, u(pv)) * 22 THEN
rahna = -1000000
rah
mor u(pv), -55
lax 42
PRINT
pwin(u(pv)) = 0
pwin(vast(pv)) = 3
FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).ppp <> 1 THEN
pel(xx, pv).gls = 0
pel(xx, pv).ass = 0
END IF
NEXT xx
END IF
END SELECT
END IF

IF kiero(kr) = 1 THEN
IF tv <> 0 THEN
IF ohj(x(fxt(tv * 2 - 1, ki))) = pv OR ohj(x(fxt(tv * 2, ki))) = pv THEN
rahna = 20000
lax 49
rah
PRINT
lentti 1, tuloste + 12
xxx = CSRLIN: komme 10 - tuloste
PRINT
END IF
END IF
END IF


IF INT(101 * RND) < vai(4, pv) THEN
al 1
IF lukka = 0 THEN
lukka = INT(44 * RND) + 1
dap 1
END IF
END IF

IF INT(101 * RND) < 20 THEN
dap 3
END IF

IF INT(101 * RND) < 5 THEN
al 1
IF lukka = 0 THEN
lukka = INT(16 * RND) + 1
dap 2
END IF
END IF

jaynacheck 0

IF kiero(kr) = 1 THEN
dat% = INT(521 * RND) + 1

COLOR 2
SELECT CASE dat%

CASE 444
rahna = -66666
arpo 0
lux 84
wnd 2
IF me$ = "k" THEN spx(2, pv) = spx(2, pv) + 1: rah: lex 56 ELSE lex 57

CASE 222, 226
sex 1
IF lukka = 0 THEN lux 45: skout(xx, pv) = 0


CASE 1, 2
lux 1
temp% = CSRLIN
pjn
LOCATE temp%, 1: lex 1

CASE 3, 4, 5
IF tarko(u(pv), 6, 15, 50) = 1 THEN mor u(pv), 2: lux 2

CASE 6, 7
rahna = 5000
lux 3
wnd 2
IF me$ = "k" THEN lex 2 ELSE rah: lex 3

CASE 8, 9, 10
IF tarko(u(pv), 5, 15, 50) = 1 THEN rahna = 35000: rah: lux 4

CASE 11, 12, 13, 14, 15, 16
IF tarko(u(pv), 6, 15, 50) = 0 THEN
rahna = -50000: rah: lux 5
ELSE
rahna = 50000: rah: lux 6
END IF

CASE 17, 18, 19, 20, 21, 22
IF tarko(u(pv), 6, 15, 50) = 1 THEN
rahna = 20000: rah: lux 7
ELSE
rahna = -20000: rah: lux 8
END IF

CASE 25
IF raha(pv) > 500000 AND tarko(u(pv), 6, 15, 50) = 0 THEN
raha(pv) = raha(pv) - .1 * raha(pv)
lux 9
END IF

CASE 26, 27, 28
rahna = 10000: rah
lux 10
IF tarko(u(pv), 5, 10, 50) = 1 THEN lux 70 ELSE lux 71


CASE 29, 30
IF tautip(u(pv)) = 1 THEN
tautik(u(pv)) = 2: tautip(u(pv)) = .8
al 0
IF tarko(u(pv), 5, 10, 100) = 1 THEN
lux 11
wnd 2
IF me$ = "k" THEN krapu(pv) = 2: mor u(pv), 3: lex 4 ELSE krapu(pv) = 1: lex 5
ELSE
krapu(pv) = 1
lux 72
END IF
END IF

CASE 31, 32
IF tarko(u(pv), 6, 15, 100) = 1 THEN
rahna = -39999
lux 12
wnd 2
IF me$ = "k" THEN
spx(1, pv) = spx(1, pv) + 1
rah
lex 6
IF tarko(u(pv), 5, 30, 0) = 1 THEN PRINT : lux 73: spx(1, pv) = spx(1, pv) + 1
ELSE
lex 7
END IF
END IF

CASE 33, 34
arpo 1
jaynax(7, u(pv)) = xx

CASE 35
rahna = 100000 * (4 - sr(u(pv)))
lux 14
wnd 2
IF me$ = "k" THEN
IF tarko(u(pv), 6, 15, 50) = 1 THEN rah: lex 8 ELSE rahna = -rahna: rah: lex 9
ELSE
IF tarko(u(pv), 6, 15, 50) = 1 THEN lex 11 ELSE lex 10
END IF

CASE 36
rahna = -10000
lux 15
wnd 2
IF me$ = "k" THEN spx(3, pv) = 1: rah: lex 12 ELSE lex 13

CASE 37
rahna = -10000
lux 16
wnd 2
IF me$ = "k" THEN spx(4, pv) = 1: rah: lex 14 ELSE lex 15

CASE 38, 39, 40
rahna = 15000
lux 17
rah
IF tarko(u(pv), 5, 20, 100) = 1 THEN mor u(pv), 3: lux 74 ELSE mor u(pv), -3: lux 75

CASE 41
IF tarko(u(pv), 6, 20, 50) = 1 THEN rahna = CLNG(100000 * RND) + 1: rah: lux 18

CASE 42
jaynacheck 1

CASE 43, 44, 45
arpo 1: lux 20: wnd 2
IF me$ = "k" THEN verk% = xx

CASE 46, 47
rahna = 125000
lux 21
wnd 2
IF me$ = "e" THEN
arpo 1
lex 47
ELSE
rah
IF tarko(u(pv), 3, 15, 70) = 1 THEN mor u(pv), 4: lux 78 ELSE mor u(pv), -4: lux 79
END IF


CASE 48, 49
rahna = 100000
lux 22
wnd 2
IF me$ = "e" THEN
lex 16
ELSE
IF tarko(u(pv), 3, 10, 50) = 1 THEN rah: lex 18 ELSE raha = -raha: rah: lex 17
END IF

CASE 50, 51
IF tautip(u(pv)) = 1 THEN
lux 23
komme 12
PRINT
IF kurso > 3 THEN
IF kurso = 4 THEN gnome = 3 ELSE gnome = 8
lux 76 + kurso
tautip(u(pv)) = .9
tautik(u(pv)) = gnome + 1
END IF
END IF

CASE 52
arpo 1
nats = 1: mahmax
COLOR 10: PRINT krj$; "."; ptemp$;
lux 24
IF tarko(u(pv), 5, 15, 100) = 0 THEN mor u(pv), -55: lux 83 ELSE lux 82
wnd 2
IF me$ = "k" THEN lentti 3, 11

CASE 53, 54, 55
IF kiero(kr) = 1 THEN
IF ohj(vast(pv)) = 0 THEN
xx = vast(pv): xxx = u(pv)
lux 25
pjn
protesti
EXIT SUB
END IF
END IF

CASE 56, 57, 58
lux 26
wnd 2
IF me$ = "e" THEN
lex 48
ELSE
IF tarko(u(pv), 6, 10, 50) = 1 THEN
mor u(pv), 4: lex 19
ELSE
lex 20
IF tarko(u(pv), 5, 15, 50) = 1 THEN lex 49 ELSE mor u(pv), -4: lex 50
END IF
END IF


CASE 59
IF tarko(u(pv), 6, 15, 50) = 1 THEN
rahna = CLNG(100000 * RND) + 300000
potti(pv) = potti(pv) + rahna
lux 27
END IF

CASE 60, 61, 62
lux 28
arvox 3
COLOR 10: PRINT text

CASE 63
IF erik(2, u(pv)) <> 0 THEN
lux 69
wnd 2
IF me$ = "k" THEN lex 45 ELSE lex 46
END IF

CASE 64, 65
lukka = 1
al 8
IF lukka = 0 THEN mor u(pv), -7: lux 30

CASE 66, 67
al 0
lux 31
IF tarko(u(pv), 5, 20, 100) = 1 THEN lex 51 ELSE mor u(pv), -8: lex 52

CASE 68, 69
al 9
IF lukka = 0 THEN
lux 32
wnd 2
IF me$ = "k" THEN pel(xx, pv).sra = pel(xx, pv).sra * 1.1: pel(xx, pv).plus = 1: pel(xx, pv).kest = 1000: lex 21 ELSE pel(xx, pv).plus = -2: pel(xx, pv).kest = 1000: lex 22
END IF

CASE 70, 71
IF kuume(pv) = 0 AND sr(u(pv)) < 3 AND tarko(u(pv), 6, 10, 50) = 1 AND tarko(u(pv), 5, 10, 50) = 1 THEN
IF sr(u(pv)) = 1 THEN lux 33 ELSE lux 34
kuume(pv) = 1
END IF

CASE 72, 73, 74
IF sopuhu(pv) <= 10 AND sovtap(pv) = 0 THEN
rahna = 100000 * (4 - (sr(u(pv))))
lux 35
wnd 2
IF me$ = "k" THEN rah: sovtap(pv) = 1: lex 23 ELSE lex 24
END IF

CASE 77, 78, 79
IF tarko(u(pv), 5, 10, 50) = 1 THEN
lux 37
mor u(pv), 3
ELSE
lux 38
mor u(pv), -5
END IF

CASE 81, 82, 182
IF kiero2(kr) = 1 AND lpl(pv) < 32 THEN
sex 1
IF lukka = 0 THEN
lux 39
wnd 2
IF me$ = "e" THEN
lex 25
ELSE
lex 26
lpl(pv) = lpl(pv) + 1
nats = xx: xx = lpl(pv)
rela
neup = blanko
neup.psk = 8 * RND + 2 + mtaito(6, man(u(pv))) * RND
IF neup.psk < 1 THEN neup.psk = 1
neup.svu = 1
palkmaar
neup.sra = .75 * rahna
pel(xx, pv) = neup
END IF
END IF
END IF

CASE 83, 84
lux 40
wnd 2
IF me$ = "e" THEN
arvox 5: PRINT text
ELSE
IF tarko(u(pv), 3, 15, 50) = 1 THEN lex 27 ELSE lex 28
END IF

CASE 85, 86
arpo 1
lux 41
wnd 2
IF me$ = "k" THEN arvox 5: PRINT text

CASE 87
IF tarko(u(pv), 5, 25, 0) = 1 THEN
arvox 1
COLOR 10: PRINT text;
COLOR 2: PRINT ", kuuluisa kirjailija, hahmottelee uutta teostaan:"
arvox 2
COLOR 14: PRINT text;
COLOR 2: PRINT " on kirjan nimi, ja se kertoo sinun el„m„st„si!"
END IF

CASE 88, 89
sex 0
IF lukka = 0 AND tarko(u(pv), 6, 10, 50) = 1 THEN
lux 43
wnd 2
IF me$ = "k" THEN skout(xx, pv) = 1: lex 30 ELSE lex 31
END IF

CASE 90, 91
IF kiero2(kr) = 1 THEN
lux 44
wnd 2
lex 32
END IF

CASE 92
jaynacheck 2

CASE 93, 155
IF kiero2(kr) = 1 AND tarko(u(pv), 6, 10, 50) = 1 THEN
fat% = INT(17 * RND) + 1
erikoisp fat%
END IF

CASE 94, 95, 96, 97, 98, 99
arpo 1
IF tarko(u(pv), 5, 15, 50) = 1 THEN mor u(pv), 1: lux 47 ELSE mor u(pv), -1: lux 46

CASE 100
rahna = -90000
gnome = INT(8 * RND) + 2
al 1
IF lukka = 0 AND tarko(u(pv), 6, 20, 50) = 0 THEN
lux 48
wnd 2
IF me$ = "k" THEN rah: lex 33 ELSE pel(xx, pv).inj = 1000 + gnome: lex 34
END IF

CASE 101, 102
al 10
IF lukka = 0 THEN
IF tarko(u(pv), 6, 15, 50) = 1 THEN lux 50: pel(xx, pv).psk = pel(xx, pv).psk + 1 ELSE lux 49: pel(xx, pv).psk = pel(xx, pv).psk - 1
END IF

CASE 103, 104
IF kiero2(kr) = 1 AND sr(u(pv)) = 1 AND lpl(pv) < 32 AND tarko(u(pv), 5, 10, 50) = 1 THEN
DIM takko(1 TO 1) AS lakko
OPEN "data\lakko.mhz" FOR RANDOM AS #1
GET #1, INT(21 * RND) + 1, takko(1)
CLOSE #1
COLOR 10: PRINT RTRIM$(takko(1).nami); " ("; pelip(takko(1).lelu.ppp); ") ";
lux 51
wnd 2
IF me$ = "e" THEN
lax 145
ELSE
lax 144
lpl(pv) = lpl(pv) + 1
pel(lpl(pv), pv) = takko(1).lelu
END IF
ERASE takko
END IF

CASE 105, 106
IF kiero2(kr) = 0 THEN
IF tarko(u(pv), 1, 20, 50) = 1 THEN
tre(u(pv)) = tre(u(pv)) + .02
lux 53
ELSE
tre(u(pv)) = tre(u(pv)) - .02
lux 52
END IF
END IF

CASE 107, 108
IF tarko(u(pv), 4, 10, 50) = 1 THEN
rahna = 30 * CLNG(paikka(2, u(pv))) * 100
rah
lux 54
END IF

CASE 109, 110
rahna = 350000
al 11
IF kiero2(kr) = 1 AND lukka = 0 THEN
lux 55
wnd 2
IF me$ = "e" THEN
lex 35
ELSE
lex 36
poispelaaja xx, pv
rah
END IF
END IF

CASE 111, 112, 113
lux 56

CASE 114, 115
al 12
IF lukka = 0 THEN
lux 57
wnd 2
IF me$ = "e" THEN lex 37 ELSE pel(xx, pv).svu = pel(xx, pv).svu + 1: lex 38
END IF

CASE 116, 117
al 13
IF lukka = 0 THEN
lux 58
wnd 2
IF me$ = "e" THEN lex 39 ELSE pel(xx, pv).svu = pel(xx, pv).svu + 1: lex 40
END IF

CASE 118, 119
al 14
IF lukka = 0 THEN pel(xx, pv).lah = 0: lux 59

CASE 120, 121
al 15
IF lukka = 0 THEN
lux 60
wnd 2
IF me$ = "e" THEN lex 41 ELSE pel(xx, pv).svu = 1: lex 42
END IF

CASE 122, 123
al 16
IF lukka = 0 THEN
lux 61
wnd 2
IF me$ = "e" THEN lex 43 ELSE pel(xx, pv).svu = 1: lex 44
END IF

CASE 124, 125
al 17
IF lukka = 0 THEN pel(xx, pv).lah = 0: lux 62

CASE 126, 127, 141
IF sr(u(pv)) = 1 THEN
IF kiero2(kr) = 1 AND tarko(u(pv), 6, 12, 50) = 1 THEN erikoisp 28
END IF

CASE 128, 129, 130
IF sr(u(pv)) = 1 THEN
IF kiero2(kr) = 1 AND tarko(u(pv), 6, 12, 50) = 1 THEN erikoisp 29
END IF

CASE 135, 136, 137
IF tarko(u(pv), 5, 20, 50) = 1 THEN uhka(pv) = 2 ELSE uhka(pv) = 1

CASE 138
IF kiero2(kr) = 1 THEN
erikoisp 30
END IF

CASE 148, 149
IF mafia(pv) = 1 THEN
IF tarko(u(pv), 4, 50, 15) = 0 THEN mor u(pv), -8: lux 63
END IF

CASE 150, 151, 160, 161
IF mafia(pv) = 1 AND tarko(u(pv), 6, 15, 0) = 0 THEN sovtap(pv) = 1: lux 64

CASE 152, 159
IF mafia(pv) = 1 THEN
arvox 4
COLOR 10: PRINT text;
lux 65
wnd 2
IF me$ = "e" THEN
lex 53
jaynax(6, u(pv)) = 1
jaynax(5, u(pv)) = 1
jaynax(3, u(pv)) = 1
ELSE
rahna = 99999
lex 54
IF tarko(u(pv), 5, 30, 0) = 1 THEN rah: lex 55
END IF
END IF

CASE 500, 501
al 4
IF lukka = 0 THEN pel(xx, pv).spe = 8: lux 66

CASE 502, 503
al 5
IF lukka = 0 THEN pel(xx, pv).ego = 20: lux 67


CASE 504, 505
al 8
IF lukka = 0 THEN pel(xx, pv).ego = 1: lux 68

END SELECT
END IF

IF CSRLIN = 3 THEN lay 27

pjn
END SUB

SUB scoutit
kurso = 2
alkusco:
leq 35
haahaa 5
DO
FOR xx = 2 TO 17
IF kurso = xx THEN COLOR 14, 6 ELSE COLOR 14, 0
LOCATE xx * 2, 1
PRINT kansap(xx);
LOCATE , 13: PRINT "("; CHR$(64 + mmsarja(xx)); ")";
LOCATE , 20: IF skout(xx, pv) = 1 THEN COLOR 10, 0 ELSE COLOR 2, 0
IF skout(xx, pv) = 1 THEN PRINT "YHTEYS PELAA              ";
IF skout(xx, pv) > 1 THEN PRINT "TUTKIMUS MENEILLŽŽN ("; LTRIM$(STR$(skout(xx, pv) - 1)); " KRS)"
IF skout(xx, pv) = 0 THEN PRINT "EI MIEHITYSTŽ                ";
COLOR 14
NEXT xx
wnd 1
IF me$ = "?" THEN qelp (5): GOTO alkusco
ku 1, 2, 17
IF me$ = CHR$(27) THEN COLOR , 0: EXIT DO
IF me$ = CHR$(13) THEN
IF skout(kurso, pv) = 0 THEN skout(kurso, pv) = 41 ELSE skout(kurso, pv) = 0
END IF
LOOP
END SUB

SUB sex (stondis%)
lukka = 1
FOR z = 1 TO 20
xx = INT(16 * RND) + 2
IF skout(xx, pv) = stondis% THEN lukka = 0: EXIT FOR
NEXT z
END SUB

SUB skandal
jaynax(3, xx) = 0
luz 35
IF tarko(xx, 5, 15, 50) = 1 THEN
mor xx, 55
ELSE
mor xx, -55
potk xx
END IF
END SUB

SUB skreensaver
SELECT CASE savertype%
CASE 1
DO WHILE INKEY$ = ""
FOR zz = 1 TO 43
FOR zzz = 1 TO 80
a = INT(100 * RND) + 1
COLOR (INT(15 * RND) + 1)
IF a = 1 THEN LOCATE zz, zzz: PRINT CHR$(1);
IF a = 2 THEN LOCATE zz, zzz: PRINT CHR$(2);
NEXT zzz
NEXT zz
LOOP

CASE 2
SCREEN 12
frukka:
COLOR INT(15 * RND) + 1
sin1 = TIMER
a = INT(631 * RND) + 1
b = INT(471 * RND) + 50
c = a + 10
d = b + 10
DO WHILE INKEY$ = ""
LINE (a, b)-(c, d)
a = a + INT(3 * RND) - 1
b = b + INT(3 * RND) - 1
c = c + INT(3 * RND) - 1
d = d + INT(3 * RND) - 1
IF TIMER - sin1 > 2 THEN GOTO frukka
LOOP
SCREEN 0: WIDTH 80, 43
CASE 3
drukis:
CLS
sin1 = TIMER
a = INT(43 * RND) + 1
b = INT(73 * RND) + 1
COLOR INT(15 * RND) + 1
LOCATE a, b: PRINT "MHM 2000";
DO WHILE INKEY$ = ""
IF TIMER - sin1 > 2 THEN GOTO drukis
LOOP

END SELECT

END SUB

SUB snayt
kurso = sr(u(pv))
curso = 1
petterijarvinen:
CLS
DO
klearstat 1
haahaa 21
FOR b = 1 TO 4
COLOR , 0: PRINT "   ";
IF kurso = b THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT taulux(b);
NEXT b
COLOR , 0
LOCATE 1, 1
IF kurso < 4 THEN
IF curso = 1 THEN PRINT "SARJATAULUKKO, ";  ELSE PRINT "KUNTOPUNTARI, ";
PRINT sanam(kurso)
IF kurso = 3 THEN
LOCATE 17, 1
IF curso = 1 THEN PRINT "SARJATAULUKKO, ";  ELSE PRINT "KUNTOPUNTARI, ";
PRINT sanam(4)
END IF

END IF
COLOR 8
SELECT CASE kurso
CASE 1
IF curso = 1 THEN staulnayt 1, 3, 1, 1 ELSE kuntopuntari 1
CASE 2
IF curso = 1 THEN staulnayt 2, 3, 1, 1 ELSE kuntopuntari 2
CASE 3
IF curso = 1 THEN staulnayt 3, 3, 1, 1: staulnayt 4, 19, 1, 1 ELSE kuntopuntari 3: kuntopuntari 4

CASE 4
staulnaytehl
END SELECT
wnd 1
ku 2, 1, 4
ku 3, 1, 2
IF me$ = "?" THEN qelp 21: GOTO petterijarvinen
IF me$ = CHR$(27) THEN EXIT SUB
LOOP
END SUB

SUB sopimusext (fat%)

yy = fat%

DIM palkehd(1 TO 2) AS LONG
DIM sopimus(1 TO 2) AS LONG
DIM optio(1 TO 2) AS INTEGER

cl = kurso
dl = curso

actiox(pv) = actiox(pv) - 1

leq 15
lay 35
LOCATE 5, 1
IF yy = 1 THEN printpel 7 ELSE printpel 5
LOCATE 7, 1

IF neup.ppp = 1 THEN b = 2 ELSE b = 1
a = valb(b, pv) + valb(4, pv) + valb(5, pv) * 2 - neup.psk


IF a > 0 THEN a = 0

IF neup.spe < 30000 AND neup.spe <> 13 THEN
lax 50
PRINT
IF neup.neu = 1 THEN lentti 4, 2: pjn: GOTO warttina

IF yy = 1 THEN pel(xx, ote).neu = 1 ELSE bel(sortb(kurso)).neu = 1

IF a <= -4 THEN lentti 4, 1: pjn: GOTO warttina

IF a < -1 THEN lentti 4, 3 ELSE IF a < 0 THEN lentti 4, 4 ELSE lentti 4, 5

IF a < 0 THEN a = -a ELSE a = 0

sopimus(2) = 85 - (a * 10) + (mtaito(5, u(pv)) * 5)

pjn
END IF

palkmaar

curso = 1
sopimus(1) = 1
optio(1) = 0
palkehd(1) = rahna
d = 0
c = 0
gnome = 0

SELECT CASE neup.age
CASE IS >= 26
optio(2) = 0
CASE 18, 19, 20
IF neup.psk >= 13 THEN optio(2) = 2 ELSE IF neup.psk >= 10 THEN optio(2) = 3 ELSE IF neup.psk >= 8 THEN optio(2) = 4 ELSE optio(2) = 0
CASE 21, 22, 23
IF neup.psk >= 13 THEN optio(2) = 2 ELSE IF neup.psk >= 11 THEN optio(2) = 3 ELSE IF neup.psk >= 9 THEN optio(2) = 4 ELSE optio(2) = 0
CASE 24
IF neup.psk >= 13 THEN optio(2) = 2 ELSE IF neup.psk >= 12 THEN optio(2) = 3 ELSE optio(2) = 0
CASE 25
IF neup.psk >= 13 THEN optio(2) = 2 ELSE optio(pv) = 0
END SELECT

davor1:
leq 34
lay 35
LOCATE 5, 1
IF yy = 1 THEN printpel 7 ELSE printpel 5

LOCATE 7, 1: lay 24

LOCATE 22, 1: COLOR 7: PRINT STRING$(80, "Ä");

DO
klearstat 43: haahaa 23

LOCATE 9, 1

IF neup.spe >= 30000 OR neup.spe = 13 THEN
gnome = 2
IF c = 0 THEN lentti 4, 14

ELSE
IF c = 0 THEN
SELECT CASE d
CASE 0
lentti 4, 7
CASE ELSE
IF gnome = 2 THEN lentti 4, 11: GOTO davor2
IF gnome = 3 THEN lentti 4, 12: GOTO davor2

IF sopimus(2) < 30 THEN lentti 4, 9: gnome = 1: GOTO davor2
IF sopimus(2) < 50 THEN lentti 4, 10: gnome = 1: GOTO davor2

lentti 4, 8: PRINT
IF optio(2) <> 0 AND sopimus(1) >= optio(2) THEN lentti 4, 6: PRINT
IF optio(1) = 2 THEN lentti 4, 13: PRINT

END SELECT
END IF
END IF
davor2:
c = 1

FOR zzz = 25 TO 40
LOCATE zzz, 41: PRINT STRING$(35, " ");
NEXT zzz

LOCATE 25

palkehd(2) = rahna * (1 + ((-10 + neup.ego) * .01))
palkehd(2) = palkehd(2) * (1 + (a * .1))
palkehd(2) = palkehd(2) * (1 + ((26 - neup.age) * .01) * (sopimus(1) - 1))
IF optio(1) = 2 THEN
palkehd(2) = palkehd(2) * (1.1 + (.02 * neup.ldr))
END IF
IF sopimus(1) >= optio(2) THEN
END IF
IF optio(2) > 0 THEN
IF sopimus(1) >= optio(2) AND optio(1) <> 1 THEN
palkehd(2) = palkehd(2) * (1 + (.1 * (sopimus(1) - optio(2) + 1)))
END IF
END IF
sin1 = palkehd(1) / palkehd(2)
sin1 = (mtaito(3, u(pv)) * 5) + 50 - (100 - ((sin1 ^ 3) * 100))
FOR xxx = 1 TO 3
LOCATE 24 + (xxx - 1) * 4, 1
IF curso = xxx THEN COLOR , 6 ELSE COLOR , 0
lay 16 + xxx

SELECT CASE xxx
CASE 1
FOR zz = 1 TO 4
LOCATE 26, 1 + (zz - 1) * 3
IF sopimus(1) = zz THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT LTRIM$(STR$(zz))
NEXT zz
CASE 2
LOCATE 30, 1
FOR zz = 0 TO 2
IF optio(1) = zz THEN COLOR , 6 ELSE COLOR , 0
IF zz = 1 AND sopimus(1) = 1 THEN COLOR 8 ELSE COLOR 14
IF zz = 0 THEN PRINT "EI";  ELSE IF zz = 1 THEN PRINT "NHL-PYKŽLŽ";  ELSE PRINT "'VAPAAPOTKU'";
IF zz < 3 THEN COLOR , 0: PRINT "   ";
NEXT zz
CASE 3
LOCATE 34, 1
COLOR 14, 6
PRINT LTRIM$(STR$(palkehd(1)));
COLOR 14, 0: PRINT "  ";
END SELECT
NEXT xxx
LOCATE 37, 1
IF curso = 4 THEN COLOR , 6 ELSE COLOR , 0
IF gnome = 0 THEN COLOR 15 ELSE COLOR 8
lay 20
LOCATE 38, 1
IF curso = 5 THEN COLOR 15, 6 ELSE COLOR 15, 0
lay 21
IF gnome > 1 THEN
LOCATE 40, 1
IF curso = 6 THEN COLOR 15, 6 ELSE COLOR 31, 0
lay 22
END IF

COLOR , 0

wnd 1
IF gnome > 1 THEN ku 3, 1, 6 ELSE ku 3, 1, 5

IF gnome = 0 OR neup.spe = 13 OR neup.spe >= 30000 THEN
IF me$ = CHR$(0) + CHR$(75) THEN
SELECT CASE curso
CASE 1
IF sopimus(1) > 1 THEN sopimus(1) = sopimus(1) - 1
CASE 2
IF optio(1) > 0 THEN optio(1) = optio(1) - 1
CASE 3
palkehd(1) = palkehd(1) - (.015 * palkehd(1))
IF palkehd(1) < 50 THEN palkehd(1) = 50
END SELECT
END IF

IF me$ = CHR$(0) + CHR$(77) THEN
SELECT CASE curso
CASE 1
IF sopimus(1) < 4 THEN sopimus(1) = sopimus(1) + 1
CASE 2
IF optio(1) < 2 THEN optio(1) = optio(1) + 1
CASE 3
IF palkehd(1) THEN palkehd(1) = palkehd(1) + (.015 * palkehd(1))
END SELECT
END IF
END IF

IF me$ = CHR$(13) THEN

SELECT CASE curso
CASE 3
IF gnome < 2 THEN palkehd(1) = rahna
CASE 4
IF gnome = 0 THEN
c = 0
d = d + 2

sin2 = 100 * RND
IF sin2 < sin1 THEN
IF sin1 - sin2 > 50 THEN gnome = 3 ELSE gnome = 2
GOTO davor1
END IF

IF sin1 < -10 THEN sopimus(2) = 0

sopimus(2) = sopimus(2) - d + INT(mtaito(3, u(pv)) * RND)

GOTO davor1
END IF

CASE 5
IF gnome <> 1 THEN
klearstat 43
LOCATE 43, 1
lay 25
wnd 2
IF me$ = "k" THEN GOTO warttina
END IF
IF gnome = 1 THEN GOTO warttina

CASE 6
EXIT DO

END SELECT
END IF


IF me$ = "?" THEN qelp 12: c = 0: GOTO davor1
LOOP


SELECT CASE yy
CASE 1
pel(xx, ote).svu = sopimus(1)
IF optio(1) = 0 THEN pel(xx, ote).nhl = 0 ELSE IF optio(1) = 1 THEN pel(xx, ote).nhl = -2 ELSE IF optio(1) = 2 THEN pel(xx, ote).nhl = 1 ELSE pel(xx, ote).nhl = 2
IF pel(xx, ote).nhl = -2 AND pel(xx, ote).svu = 1 THEN pel(xx, ote).nhl = 0
pel(xx, ote).sra = palkehd(1)
pel(xx, ote).neu = 0
IF ote <> pv THEN
lpl(pv) = lpl(pv) + 1
pel(lpl(pv), pv) = pel(xx, ote)
poispelaaja xx, ote
END IF

GOTO warttina

CASE 2
lpl(pv) = lpl(pv) + 1
neup.svu = sopimus(1)
neup.sra = palkehd(1)
IF optio(1) = 0 THEN neup.nhl = 0 ELSE IF optio(1) = 1 THEN neup.nhl = -2 ELSE IF optio(1) = 2 THEN neup.nhl = 1 ELSE neup.nhl = 2
IF neup.nhl = -2 AND neup.svu = 1 THEN neup.nhl = 0
pel(lpl(pv), pv) = neup
IF sortb(xx) < lastbors THEN
FOR smut = sortb(xx) + 1 TO lastbors
bel(smut - 1) = bel(smut)
NEXT smut
END IF
lastbors = lastbors - 1
END SELECT

warttina:
ERASE palkehd, sopimus, optio
kurso = cl
curso = dl
END SUB

SUB sortbors (paddy%)
lb = 0
SELECT CASE paddy%
CASE 1
IF skout(curso, pv) = 1 THEN
FOR z = 1 TO 5
FOR zz = 20 TO 1 STEP -1
FOR zzzz = 1 TO lastbors
IF bel(zzzz).nat = curso AND bel(zzzz).ppp = z AND bel(zzzz).psk = zz THEN lb = lb + 1: sortb(lb) = zzzz
NEXT zzzz
NEXT zz
NEXT z
ELSE
FOR zzzz = 1 TO lastbors
IF bel(zzzz).nat = curso THEN lb = lb + 1: sortb(lb) = zzzz
NEXT zzzz
END IF
CASE 2
sortero = 1
FOR zz = 1 TO 5
FOR ccc = 20 TO 1 STEP -1
FOR z = 1 TO lpl(borsch(curso))
IF pel(z, borsch(curso)).ppp = zz AND pel(z, borsch(curso)).psk = ccc THEN sortc(sortero) = z: sortero = sortero + 1
NEXT z
NEXT ccc
NEXT zz
END SELECT
END SUB

SUB sortmaar
ERASE sort
ERASE sort2
pelaa = 0
FOR zz = 1 TO lpl(pv)
IF pel(zz, pv).inj = 0 THEN pelaa = pelaa + 1
NEXT zz
DIM sort(1 TO lpl(pv)) AS INTEGER
IF pelaa > 0 THEN DIM sort2(1 TO pelaa) AS INTEGER
a = 1: b = 1: pelbudget(pv) = 0
FOR z = 1 TO 5
FOR zz = 20 TO 1 STEP -1
FOR zzz = 1 TO lpl(pv)
IF z = 1 AND zz = 20 AND pel(zzz, pv).svu > 0 THEN pelbudget(pv) = pelbudget(pv) - pel(zzz, pv).sra
IF pel(zzz, pv).ppp = z AND pel(zzz, pv).psk = zz THEN
sort(a) = zzz: a = a + 1
IF pel(zzz, pv).inj = 0 THEN sort2(b) = zzz: b = b + 1
END IF
NEXT zzz
NEXT zz
NEXT z
END SUB

SUB sponsorit
argle = 1

DIM spo(1 TO 3) AS STRING
DIM spr(1 TO 3, 1 TO 20) AS LONG
DIM sexx(1 TO 3, 1 TO 4) AS INTEGER
DIM seks(1 TO 4) AS INTEGER
DIM spn(1 TO 3) AS INTEGER
DIM sph(1 TO 3) AS INTEGER
DIM spp(1 TO 3, 1 TO 20) AS SINGLE


IF sr(u(pv)) = 1 THEN seks(1) = 4 ELSE seks(1) = 0
IF sr(u(pv)) > 1 THEN seks(2) = 3 ELSE seks(2) = 0
seks(3) = 3
IF muke(pv) = 1 THEN seks(4) = 3 ELSE seks(4) = 0

sin1 = 49 - ((sed(u(pv)) + sedd(u(pv)) + seddd(u(pv))) / 3)

FOR qwe = 1 TO UBOUND(spo)
spn(qwe) = 0: sph(qwe) = 1
OPEN "data\spondata.m2k" FOR INPUT AS #1
FOR cupex = 1 TO INT(93 * RND) + 1
INPUT #1, spo(qwe)
NEXT cupex
CLOSE #1

FOR cupex = 1 TO 20
spp(qwe, cupex) = .9 + .05 * RND
IF paikka(3, u(pv)) = 1 THEN spp(qwe, cupex) = spp(qwe, cupex) + .05
NEXT cupex
NEXT qwe


FOR qwe = 1 TO 3
FOR cupex = 1 TO 4
sexx(qwe, cupex) = 1
NEXT cupex
NEXT qwe


curso = 1
kurso = 1
alkuspo:
leq 1
DO
klearstat 3
haahaa 56

temp% = 0
FOR qwe = 1 TO 3
IF sph(qwe) = 0 THEN temp% = temp% + 1
NEXT qwe

IF spn(curso) = 0 THEN

FOR d = 1 TO 20
spr(curso, d) = 0
NEXT d

spr(curso, 20) = 20000 * (1 + (sin1 * .07)) * CSNG((vai(3, pv) / 100))

SELECT CASE sexx(curso, 1)
CASE 2

spr(curso, 5) = spr(curso, 20) * 3

spr(curso, 13) = -1.2 * spr(curso, 5)
spr(curso, 14) = .3 * spr(curso, 13)
spr(curso, 15) = .4 * spr(curso, 13)

CASE 3
spr(curso, 1) = 5 * spr(curso, 20)
spr(curso, 2) = 4.5 * spr(curso, 20)
spr(curso, 3) = 4 * spr(curso, 20)
spr(curso, 4) = 3.5 * spr(curso, 20)

spr(curso, 12) = -.8 * spr(curso, 1)
spr(curso, 13) = .3 * spr(curso, 12)
spr(curso, 14) = .2 * spr(curso, 12)
spr(curso, 15) = .1 * spr(curso, 12)

CASE 4
spr(curso, 1) = 8 * spr(curso, 20)
spr(curso, 2) = 7 * spr(curso, 20)
spr(curso, 3) = 6 * spr(curso, 20)

spr(curso, 11) = -1 * spr(curso, 1)
spr(curso, 12) = .2 * spr(curso, 11)
spr(curso, 13) = .18 * spr(curso, 11)
spr(curso, 14) = .16 * spr(curso, 11)
spr(curso, 15) = .14 * spr(curso, 11)

END SELECT

SELECT CASE sexx(curso, 2)
CASE 2
spr(curso, 5) = 3 * spr(curso, 20)
spr(curso, 10) = 1.5 * spr(curso, 20)
spr(curso, 13) = -1.2 * spr(curso, 5)
IF sr(u(pv)) = 2 THEN spr(curso, 14) = .3 * spr(curso, 13)
IF sr(u(pv)) = 2 THEN spr(curso, 15) = .4 * spr(curso, 13)
CASE 3
spr(curso, 10) = 8 * spr(curso, 20)
spr(curso, 13) = -.1 * spr(curso, 10)
spr(curso, 19) = -.75 * spr(curso, 10)
IF sr(u(pv)) = 2 THEN spr(curso, 14) = .25 * spr(curso, 19)
IF sr(u(pv)) = 2 THEN spr(curso, 15) = .5 * spr(curso, 19)
END SELECT

SELECT CASE sexx(curso, 3)
CASE 2
spr(curso, 7) = 1.25 * spr(curso, 20)
spr(curso, 17) = -1.5 * spr(curso, 7)
CASE 3
spr(curso, 6) = 2.5 * spr(curso, 20)
spr(curso, 7) = 1.5 * spr(curso, 20)
spr(curso, 16) = -6 * spr(curso, 7)
spr(curso, 17) = -2 * spr(curso, 7)
END SELECT

SELECT CASE sexx(curso, 4)
CASE 2
spr(curso, 9) = 3.5 * spr(curso, 20)
spr(curso, 18) = -.9 * spr(curso, 9)
CASE 3
spr(curso, 8) = 8 * spr(curso, 20)
spr(curso, 18) = -.9 * spr(curso, 8)
END SELECT

FOR cupex = 1 TO 20
spr(curso, cupex) = spr(curso, cupex) * spp(curso, cupex)
NEXT cupex

END IF

LOCATE 3, 1
COLOR 6
PRINT "JOUKKUE: ";
COLOR 14
PRINT RTRIM$(l(u(pv))); " (";
PRINT taulux(sr(u(pv))); ")"
LOCATE 5, 1
COLOR 6
PRINT "SPONSORIEHDOKAS ";
FOR qwe = 1 TO 3
IF curso = qwe THEN COLOR 14, 6 ELSE COLOR 8, 0
PRINT LTRIM$(STR$(qwe));
COLOR , 0: PRINT "  ";
NEXT qwe
COLOR 7: LOCATE , 30: PRINT spo(curso)

LOCATE 8
FOR qwe = 1 TO 19
IF spr(curso, qwe) <> 0 THEN
LOCATE CSRLIN + 1
IF qwe < 11 THEN COLOR 14, 0 ELSE COLOR 6, 0
lay 145 + qwe
PRINT "  ";
IF qwe < 11 THEN COLOR 10, 0 ELSE COLOR 2, 0
PRINT spr(curso, qwe);
END IF
NEXT qwe

LOCATE 7
COLOR 14
lay 165
PRINT "  ";
COLOR 10, 0
PRINT spr(curso, 20); " (YHT. "; LTRIM$(STR$(spr(curso, 20) * 44)); ")"
COLOR 15, 0
LOCATE 25, 1: PRINT "VŽHIMMŽISTAVOITTEET,"
FOR qwe = 1 TO 4
COLOR 15, 0
LOCATE 27, 1 + (qwe - 1) * 18
IF seks(qwe) <> 0 THEN
IF qwe = 1 THEN PRINT "PHL" ELSE IF qwe = 2 THEN PRINT "DIV & MUT" ELSE IF qwe = 3 THEN PRINT "CUP" ELSE PRINT "EHL"
END IF
FOR cupex = 1 TO seks(qwe)
IF sexx(curso, qwe) = cupex THEN
IF spn(curso) = 0 THEN COLOR 14, 6 ELSE COLOR 14, 0
ELSE
COLOR 8, 0
END IF

LOCATE 28 + cupex, 1 + (qwe - 1) * 18
IF qwe = 1 THEN PRINT LTRIM$(STR$(cupex)); ": "; : lay 169 + cupex ELSE PRINT CHR$(64 + ((qwe - 2) * 3) + cupex); ": "; : lay 173 + ((qwe - 2) * 3) + cupex
NEXT cupex
NEXT qwe
FOR qwe = 1 TO 2
LOCATE 34 + qwe, 1
IF kurso = qwe THEN COLOR , 6 ELSE COLOR , 0
IF qwe = 1 AND spn(curso) <> -1 AND temp% <> 2 THEN COLOR 14 ELSE IF qwe = 1 THEN COLOR 8
IF qwe = 2 AND sph(curso) = 1 THEN COLOR 14 ELSE IF qwe = 2 THEN COLOR 8
lay 182 + qwe
NEXT qwe

COLOR , 0
wnd 1
ku 4, 1, 3
ku 1, 1, 2

IF spn(curso) = 0 THEN
IF ASC(me$) > 48 AND ASC(me$) < 53 THEN
IF seks(1) >= ASC(me$) - 48 THEN sexx(curso, 1) = ASC(me$) - 48
END IF
FOR d = 2 TO 4
IF ASC(me$) > (96 + ((d - 2) * 3)) AND ASC(me$) < (100 + ((d - 2) * 3)) THEN
IF seks(d) >= ASC(me$) - (96 + ((d - 2) * 3)) THEN sexx(curso, d) = ASC(me$) - (96 + ((d - 2) * 3))
END IF
NEXT d
END IF

IF me$ = "?" THEN qelp 56: GOTO alkuspo

IF me$ = CHR$(13) THEN
SELECT CASE kurso
CASE 1
IF spn(curso) <> -1 AND temp% <> 2 THEN

IF tarko(u(pv), 3, 5, 97 - (spn(curso) * 5)) = 0 THEN
spn(curso) = -1
sph(curso) = 0

FOR qwe = 1 TO 20
spr(curso, qwe) = 0
NEXT qwe
END IF

IF spn(curso) <> -1 THEN
spn(curso) = spn(curso) + 1

FOR qwe = 1 TO 20
IF spr(curso, qwe) > 0 THEN
IF tarko(u(pv), 3, 0, 50) = 1 THEN spr(curso, qwe) = spr(curso, qwe) + (.015 + .01 * RND) * spr(curso, qwe)
END IF
NEXT qwe
END IF
END IF
CASE 2
IF sph(curso) = 1 THEN
EXIT DO
END IF

END SELECT
END IF




LOOP
spona(pv) = spo(curso)
FOR qwe = 1 TO 20
sponso(qwe, pv) = spr(curso, qwe)
NEXT qwe
ERASE spo, spr, sexx, seks, spn, sph, spp
END SUB

SUB sporvagen
argle = 1
erkkimerkki:
leq 20
haahaa 49
IF kr >= -8 THEN
LOCATE 3, 20
COLOR 6
PRINT "JOUKKUE: ";
COLOR 10
PRINT RTRIM$(l(u(pv))); " (";
PRINT taulux(sr(u(pv))); ")"
LOCATE 5, 19
COLOR 6
PRINT "SPONSORI: ";
COLOR 7: PRINT spona(pv)
LOCATE 8
FOR qwe = 1 TO 19
IF sponso(qwe, pv) <> 0 THEN
LOCATE CSRLIN + 1
IF qwe < 11 THEN COLOR 14, 0 ELSE COLOR 6, 0
lay 145 + qwe
PRINT "  ";
IF qwe < 11 THEN COLOR 10, 0 ELSE COLOR 2, 0
PRINT sponso(qwe, pv);
END IF
NEXT qwe
COLOR 14
LOCATE 7
lay 165
PRINT "  ";
COLOR 10, 0
PRINT sponso(20, pv); " (YHT. "; LTRIM$(STR$(sponso(20, pv) * 44)); ")"
END IF
IF krapu(pv) = 2 THEN krapulapiirto
DO
wnd 1
IF me$ = "?" THEN qelp 9: GOTO erkkimerkki
IF me$ = CHR$(27) THEN EXIT DO
LOOP
END SUB

SUB staulehlmaar
FOR xx = 1 TO 20
es(xx) = 1
NEXT xx
FOR fuk% = 1 TO 5
FOR xx = fuk% * 4 - 3 TO fuk% * 4 - 1
FOR xxx = xx + 1 TO fuk% * 4

SELECT CASE ep(xx)
CASE IS > ep(xxx)
es(xxx) = es(xxx) + 1
CASE IS < ep(xxx)
es(xx) = es(xx) + 1
CASE ep(xxx)
SELECT CASE egf(xx) - ega(xx)
CASE IS > egf(xxx) - ega(xxx)
es(xxx) = es(xxx) + 1
CASE IS < egf(xxx) - ega(xxx)
es(xx) = es(xx) + 1
CASE egf(xxx) - ega(xxx)
IF egf(xx) >= egf(xxx) THEN es(xxx) = es(xxx) + 1 ELSE es(xx) = es(xx) + 1
END SELECT
END SELECT
NEXT xxx
NEXT xx
NEXT fuk%
END SUB

SUB staulmaar
FOR xx = 1 TO 48
s(xx) = 1
NEXT xx
FOR a = 1 TO 4
FOR xx = (a - 1) * 12 + 1 TO (a - 1) * 12 + 11
FOR xxx = xx + 1 TO (a - 1) * 12 + 12
SELECT CASE p(x(xx))
CASE IS > p(x(xxx))
s(x(xxx)) = s(x(xxx)) + 1
CASE IS < p(x(xxx))
s(x(xx)) = s(x(xx)) + 1
CASE p(x(xxx))
SELECT CASE gf(x(xx)) - ga(x(xx))
CASE IS > gf(x(xxx)) - ga(x(xxx))
s(x(xxx)) = s(x(xxx)) + 1
CASE IS < gf(x(xxx)) - ga(x(xxx))
s(x(xx)) = s(x(xx)) + 1
CASE gf(x(xxx)) - ga(x(xxx))
IF gf(x(xx)) >= gf(x(xxx)) THEN s(x(xxx)) = s(x(xxx)) + 1 ELSE s(x(xx)) = s(x(xx)) + 1
END SELECT
END SELECT
NEXT xxx
NEXT xx
NEXT a
FOR qwe = 1 TO 4
FOR cupex = 1 TO 12
sijo(qwe, s(x(cupex + (qwe - 1) * 12))) = x(cupex + (qwe - 1) * 12)
NEXT cupex
NEXT qwe
IF ot >= 1 AND ot < 45 THEN
FOR xx = 1 TO plkm
graf(ot, xx) = s(u(xx))
NEXT xx
END IF
END SUB


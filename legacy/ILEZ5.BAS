DECLARE SUB kuva (tied$)
DECLARE SUB qelp (qel%)
DECLARE SUB valitsestrattie ()
DECLARE SUB managerisiirrot ()
DECLARE SUB mmkisaloppu ()
DECLARE SUB endseason ()
DECLARE SUB pelaajasiirrot ()
DECLARE SUB orgamaar (ork%)
DECLARE SUB tasomaar ()
DECLARE SUB gene ()
DECLARE SUB klearstat (fat%)
DECLARE SUB haahaa (haha%)
DECLARE SUB muutmestarit ()
DECLARE SUB omasopimus ()
DECLARE SUB ketjuchk ()
DECLARE SUB kc ()
DECLARE SUB poispelaaja (vp%, jp%)
DECLARE SUB poispel ()
DECLARE SUB palkmaar ()
DECLARE SUB mahmax ()
DECLARE SUB rela ()
DECLARE SUB borsinit (init%)
DECLARE SUB aaargh ()
DECLARE SUB sortmaar ()
DECLARE SUB klear (fat%)
DECLARE SUB tasomuut ()
DECLARE SUB alkukevat ()
DECLARE SUB annarahaa (arg%)
DECLARE SUB sarjamaar ()
DECLARE SUB ku (kuz%, ku1%, ku2%)
DECLARE SUB wnd (sex%)
DECLARE SUB maajoukkue ()
DECLARE SUB komme (sano%)
DECLARE SUB tmankom (sano%)
DECLARE SUB pjn ()
DECLARE SUB colchk (colre%)
DECLARE SUB lentti (kuka%, sano%)
DECLARE SUB lt (lue$, lukux%)
'$DYNAMIC
'$INCLUDE: 'mhm2k.bi'

RANDOMIZE TIMER


CLS
IF ensintoinen = 0 THEN RUN "mhm2k"
ver$ = "1.2 REKISTER™ITY"
IF ver1 <> ver$ THEN CLS : COLOR 15, 0: PRINT "YHTEENSOPIMATTOMAT VERSIOT!": SYSTEM

FOR pv = 1 TO plkm
klear 2
NEXT pv

endseason
kr = kr + 1
CHAIN "ilex5"

REM $STATIC
SUB aaargh
IF lpl(pv) < 5 THEN
FOR xxx = lpl(pv) + 1 TO 5
nats = 1
rela
pel(xxx, pv) = blanko
pel(xxx, pv).svu = 1
pel(xxx, pv).psk = INT(2 * RND) + 1
neup = pel(xxx, pv)
palkmaar
pel(xxx, pv).sra = rahna
lpl(pv) = lpl(pv) + 1
NEXT xxx
END IF
END SUB

SUB alkukevat
DIM muutoz(1 TO 32) AS INTEGER
DIM vaat(1 TO 20, 1 TO 3) AS INTEGER
DIM vaat2(18 TO 25, 1 TO 3) AS INTEGER
DIM vaat3(29 TO 35, 1 TO 3) AS INTEGER
DIM vaat4(1 TO 20) AS INTEGER

OPEN "data\muutos.m2k" FOR INPUT AS #1
FOR xx = 1 TO 20
INPUT #1, vaat(xx, 1), vaat(xx, 2), vaat(xx, 3)
NEXT xx
FOR xx = 18 TO 25
INPUT #1, vaat2(xx, 1), vaat2(xx, 2), vaat2(xx, 3)
NEXT xx
FOR xx = 29 TO 35
INPUT #1, vaat3(xx, 1), vaat3(xx, 2), vaat3(xx, 3)
NEXT xx
CLOSE #1

FOR pv = 1 TO plkm
FOR xx = 1 TO lpl(pv)
pel(xx, pv).neu = 0
IF pel(xx, pv).svu < 50 THEN pel(xx, pv).svu = pel(xx, pv).svu - 1
NEXT xx
NEXT pv

FOR vu = 1 TO plkm
pv = vuoro(vu)
sortmaar

CLS

FOR xx = 1 TO lpl(pv)
muutoz(xx) = 0

IF pel(xx, pv).spe <> 13 THEN

SELECT CASE pel(xx, pv).age
CASE 18 TO 25
IF pel(xx, pv).pot > pel(xx, pv).psk * 2 * tempsr(u(pv)) THEN
a = pel(xx, pv).age
b = INT(100 * RND) + 1
IF b >= vaat2(a, 3) THEN muutoz(xx) = muutoz(xx) + 3 ELSE IF b >= vaat2(a, 2) THEN muutoz(xx) = muutoz(xx) + 2 ELSE IF b >= vaat2(a, 1) THEN muutoz(xx) = muutoz(xx) + 1
END IF
CASE IS >= 29
IF pel(xx, pv).age <= 35 THEN a = pel(xx, pv).age ELSE a = 35
b = INT(100 * RND) + 1
IF b >= vaat3(a, 1) THEN muutoz(xx) = muutoz(xx) - 3 ELSE IF b >= vaat3(a, 2) THEN muutoz(xx) = muutoz(xx) - 2 ELSE IF b >= vaat3(a, 3) THEN muutoz(xx) = muutoz(xx) - 1
END SELECT

SELECT CASE pel(xx, pv).pot
CASE 0
muutoz(xx) = muutoz(xx) - (INT(.4 * pel(xx, pv).psk))
CASE 1 TO pel(xx, pv).psk * tempsr(u(pv)) - 1
muutoz(xx) = muutoz(xx) - (INT(.2 * pel(xx, pv).psk))
END SELECT

IF pel(xx, pv).ppp > 1 THEN
IF pel(xx, pv).ppp = 2 THEN sin1 = .66 ELSE sin1 = 1
IF tempsr(u(pv)) = 1 THEN sin2 = 1 ELSE IF tempsr(u(pv)) = 2 THEN sin2 = 1.5 ELSE sin2 = 2
b = rug(xx, pv) + rua(xx, pv) + pel(xx, pv).gls + pel(xx, pv).ass
IF b >= vaat(pel(xx, pv).psk, 3) * sin1 * sin2 THEN muutoz(xx) = muutoz(xx) + 3 ELSE IF b >= vaat(pel(xx, pv).psk, 2) * sin1 * sin2 THEN muutoz(xx) = muutoz(xx) + 2 ELSE IF b >= vaat(pel(xx, pv).psk, 1) * sin1 * sin2 THEN muutoz(xx) = muutoz(xx) + 1

END IF

a = 100 * RND
IF a < 10 THEN muutoz(xx) = muutoz(xx) - 1 ELSE IF a > 91 THEN muutoz(xx) = muutoz(xx) + 1

IF pel(xx, pv).psk + muutoz(xx) < 1 THEN muutoz(xx) = muutoz(xx) + (1 - muutoz(xx))

IF pel(xx, pv).psk + muutoz(xx) > 20 THEN
muutoz(xx) = muutoz(xx) - ((pel(xx, pv).psk + muutoz(xx)) - 20)
END IF
END IF

NEXT xx

CLS
lt "q", 13
PRINT
FOR xxx = 1 TO lpl(pv)
xx = sort(xxx)
LOCATE xxx + 1 + pel(xx, pv).ppp, 1
COLOR 14: PRINT pel(xx, pv).nam;
LOCATE , 16
PRINT pelip(pel(xx, pv).ppp); " (";
PRINT LTRIM$(STR$(pel(xx, pv).age)); ")";
COLOR 7
LOCATE , 25: PRINT LTRIM$(STR$(pel(xx, pv).psk));
IF muutoz(xx) > 0 THEN COLOR 15 ELSE IF muutoz(xx) = 0 THEN COLOR 7 ELSE COLOR 8
LOCATE , 28: PRINT "---> ";
PRINT LTRIM$(STR$(pel(xx, pv).psk + muutoz(xx)))
NEXT xxx
pjn

FOR xx = 1 TO lpl(pv)
pel(xx, pv).psk = pel(xx, pv).psk + muutoz(xx)
IF pel(xx, pv).spe <> 13 THEN pel(xx, pv).age = pel(xx, pv).age + 1
NEXT xx
aaargh

CLS
lt "q", 14
PRINT
jeps:
rahna = 100000
FOR xx = 1 TO lpl(pv)

IF pel(xx, pv).lah >= 96 THEN
SELECT CASE pel(xx, pv).lah
CASE 96
IF pel(xx, pv).svu = 0 THEN
lt "x", pel(xx, pv).lah + 10: PRINT
borsinit 1
bel(lastbors + 1) = pel(xx, pv)
lastbors = lastbors + 1
borsinit 2
poispel
GOTO jeps
END IF
CASE 97
IF pel(xx, pv).svu = 0 OR pel(xx, pv).nhl = -1 THEN
lt "x", pel(xx, pv).lah + 10: PRINT
poispel
GOTO jeps
END IF
CASE 98, 99
IF pel(xx, pv).svu = 0 THEN
lt "x", pel(xx, pv).lah + 10: PRINT
poispel
GOTO jeps
END IF
END SELECT
END IF

NEXT xx
IF CSRLIN = 3 THEN COLOR 2: PRINT "Ei tapahtumia."
pjn

NEXT vu
ERASE rug, rua, vaat, vaat2, vaat3, vaat4

borsinit 1
FOR xx = 1 TO lastbors
bel(xx).pot = 0
bel(xx).pok = 0
bel(xx).gls = 0
bel(xx).ass = 0
bel(xx).kun = 0
bel(xx).inj = 0
bel(xx).lah = 0
bel(xx).plus = 0
bel(xx).kest = 0
NEXT xx
borsinit 2
END SUB

SUB annarahaa (arg%)
argle = 0
IF sponso(arg%, pv) <> 0 THEN
colchk 1
PRINT nimi(pv);
COLOR 6
PRINT ", ";
lt "y", 145 + arg%
PRINT ": ";
IF sponso(arg%, pv) < 0 THEN COLOR 2 ELSE COLOR 10
PRINT LTRIM$(STR$(sponso(arg%, pv)))
PRINT
raha(pv) = raha(pv) + sponso(arg%, pv)
IF arg% <> 7 THEN sponso(arg%, pv) = 0
END IF
END SUB

SUB borsinit (init%)
SELECT CASE init%
CASE 1
DIM bel(1 TO 500) AS pelaaja
OPEN "game_" + LTRIM$(STR$(lokero)) + "\borspel.tmp" FOR RANDOM AS #1
FOR qwe = 1 TO lastbors
GET #1, qwe, bel(qwe)
NEXT qwe
CLOSE #1
CASE 2
OPEN "game_" + LTRIM$(STR$(lokero)) + "\borspel.tmp" FOR RANDOM AS #1
FOR qwe = 1 TO lastbors
PUT #1, qwe, bel(qwe)
NEXT qwe
CLOSE #1
ERASE bel
END SELECT
END SUB

SUB colchk (colre%)
SELECT CASE colre%
CASE 1
SELECT CASE pv
CASE 1 TO 4
COLOR pkolo(pv)
END SELECT
CASE 2, 3
FOR nn = 1 TO plkm
IF od(colre% - 1) = u(nn) THEN COLOR pkolo(nn)
NEXT nn
CASE 4
SELECT CASE ccc
CASE 1 TO 4
COLOR pkolo(ccc)
END SELECT
END SELECT
END SUB

SUB endseason
FOR zz = 1 TO 3
pvoittaja(zz + 3) = ppors(zz, 1)
NEXT zz
IF pwin(plex(1, 1)) = 3 THEN sed(plex(1, 1)) = 1: sed(plex(1, 2)) = 2
IF pwin(plex(1, 1)) < 3 THEN sed(plex(1, 2)) = 1: sed(plex(1, 1)) = 2
IF pwin(plex(1, 3)) = 3 THEN sed(plex(1, 3)) = 3: sed(plex(1, 4)) = 4
IF pwin(plex(1, 3)) < 3 THEN sed(plex(1, 4)) = 3: sed(plex(1, 3)) = 4
IF pwin(plex(2, 1)) = 3 THEN sed(plex(2, 1)) = 12: sr(plex(2, 1)) = 1: sed(plex(2, 2)) = 13
IF pwin(plex(2, 2)) = 3 THEN sed(plex(2, 2)) = 12: sr(plex(2, 2)) = 1: sed(plex(2, 1)) = 13
xxx = 23
FOR cupex = 1 TO 4
IF pwin(plex(3, cupex)) = 3 THEN sed(plex(3, cupex)) = xxx: xxx = xxx + 1: sr(plex(3, cupex)) = 2
NEXT cupex
xxx = 25
FOR cupex = 1 TO 4
IF pwin(plex(3, cupex)) < 3 THEN sed(plex(3, cupex)) = xxx: xxx = xxx + 1
NEXT cupex
a = 1: b = 1: c = 2: d = 2
FOR xx = 1 TO 48
tkaus(tempsr(x(xx)), x(xx)) = tkaus(tempsr(x(xx)), x(xx)) + 1
FOR qwe = 1 TO 3
IF sed(x(xx)) = qwe THEN tsaav(qwe, x(xx)) = tsaav(qwe, x(xx)) + 1: EXIT FOR
NEXT qwe
IF sr(x(xx)) < tempsr(x(xx)) AND sr(x(xx)) = 1 THEN nousu(a) = x(xx): a = a + 1
IF sr(x(xx)) > tempsr(x(xx)) AND sr(x(xx)) = 2 THEN puto(b) = x(xx): b = b + 1
IF sr(x(xx)) < tempsr(x(xx)) AND sr(x(xx)) = 2 THEN nousu(c) = x(xx): c = c + 1
IF sr(x(xx)) > tempsr(x(xx)) AND sr(x(xx)) = 3 THEN puto(d) = x(xx): d = d + 1
NEXT xx
FOR xx = 1 TO plkm
FOR xxx = 1 TO 3
IF sed(u(xx)) = xxx THEN saav(xxx, xx) = saav(xxx, xx) + 1
NEXT xxx
NEXT xx
FOR qwe = 1 TO 3
IF nousu(qwe) <> 0 THEN
IF ohj(nousu(qwe)) <> 0 THEN saav(5, ohj(nousu(qwe))) = saav(5, ohj(nousu(qwe))) + 1
END IF
IF puto(qwe) <> 0 THEN
IF ohj(puto(qwe)) <> 0 THEN saav(6, ohj(puto(qwe))) = saav(6, ohj(puto(qwe))) + 1
END IF
NEXT qwe
FOR xx = 1 TO 12
FOR xxx = 1 TO 7
IF sed(x(xx)) = xxx THEN karki(xxx) = x(xx)
NEXT xxx
NEXT xx

IF ohj(karki(1)) <> 0 THEN SCREEN 13: kuva ("pysti1"): SCREEN 0: WIDTH 80, 43

alkuxxx:
CLS
lt "x", 91
PRINT
lentti 1, 1
lentti 2, 1
PRINT
lentti 1, 2
lentti 2, 2
PRINT : COLOR 6: PRINT "...": PRINT
lentti 1, 20
PRINT
lentti 3, 2
PRINT
COLOR 31: PRINT CHR$(14); " "; CHR$(14); " "; CHR$(14)
PRINT
lentti 3, 3
pjn
CLS
lentti 1, 3
lentti 2, 3
PRINT : COLOR 6: PRINT "PISTEP™RSSIEN VOITTAJAT:": PRINT
FOR zz = 1 TO 6
COLOR 7
IF ohj(pvoittaja(zz).jo) <> 0 THEN
ccc = ohj(pvoittaja(zz).jo): colchk 4
END IF
IF zz < 4 THEN PRINT "RUNKOSARJA, ";  ELSE PRINT "PLAY-OFFIT, ";
IF zz < 4 THEN PRINT taulux(zz);  ELSE PRINT taulux(zz - 3);
LOCATE , 30
PRINT pvoittaja(zz).na;
LOCATE , 46
PRINT " ("; RTRIM$(l(pvoittaja(zz).jo)); ") ";
LOCATE , 61
PRINT LTRIM$(STR$(pvoittaja(zz).ma)); " + "; LTRIM$(STR$(pvoittaja(zz).sy)); " = "; LTRIM$(STR$(pvoittaja(zz).pi));
IF pvoittaja(zz).pi <= rekord(zz).pi THEN PRINT  ELSE LOCATE , 76: COLOR 14: PRINT "(E)": rekord(zz) = pvoittaja(zz)
IF temp% = 1 THEN temp% = 2 ELSE temp% = 1
NEXT zz
COLOR 6: PRINT : PRINT "...": PRINT
lentti 1, 4
lentti 2, 4
PRINT
COLOR 31: PRINT STRING$(3, CHR$(14))
PRINT
COLOR 6: PRINT "KUKAN LEVYRAATI:"
lentti 3, 1
PRINT
COLOR 6: PRINT "..."
pjn
CLS
IF nousu(1) <> 0 THEN
lentti 2, 7
xx = nousu(1)
lt "x", 180
PRINT
IF ohj(xx) = 0 THEN tmankom 4 ELSE xxx = CSRLIN: komme 4
PRINT
COLOR 6: PRINT "...": PRINT
pjn
CLS
END IF
lentti 1, 5
xx = karki(3)
lt "x", 181
PRINT
lentti 1, 6
PRINT
IF ohj(xx) = 0 THEN tmankom 1 ELSE xxx = CSRLIN: komme 1
PRINT : COLOR 6: PRINT "...": PRINT
lentti 1, 7
xx = karki(2)
lt "x", 182
PRINT
IF ohj(xx) = 0 THEN tmankom 2 ELSE xxx = CSRLIN: komme 2
PRINT
COLOR 6: PRINT "..."
PRINT
lentti 2, 5
PRINT
xx = karki(1)
lt "x", 183
IF ohj(xx) = 0 THEN
tmankom 3
ELSE
xxx = CSRLIN
komme 3
END IF
PRINT
FOR qwe = 1 TO 3
COLOR 6: PRINT saavtext(qwe); ": ";
COLOR 14: PRINT l(karki(qwe)); "  ";
NEXT qwe
PRINT : PRINT : COLOR 6: PRINT "...": PRINT
lentti 1, 8
lentti 2, 6
pjn
FOR pv = 1 TO plkm
maajoukkue
NEXT pv
mmkisaloppu
DIM osuus(1 TO 11) AS SINGLE, sijotmp(1 TO 48) AS INTEGER
OPEN "data\potti.m2k" FOR INPUT AS #1
FOR z = 1 TO 11
INPUT #1, osuus(z)
NEXT z
CLOSE #1
sarjamaar
FOR xx = 1 TO 48
sijotmp(sed(xx)) = xx
NEXT xx
CLS
COLOR 15: PRINT "LOPULLINEN KUNNIATAULUKKO ON:"
FOR qwe = 1 TO 48
IF qwe < 13 THEN LOCATE 2 + qwe, 1 ELSE IF qwe < 25 THEN LOCATE 2 + qwe - 12, 31 ELSE LOCATE 2 + qwe - 24, 51
COLOR 7: PRINT LTRIM$(STR$(qwe)); ". ";
COLOR jkolo(sr(sijotmp(qwe))), 0
ccc = ohj(sijotmp(qwe)): colchk 4
IF qwe < 10 THEN PRINT " ";
PRINT l(sijotmp(qwe));
PRINT "  ";
COLOR 14
IF tempsr(sijotmp(qwe)) > sr(sijotmp(qwe)) THEN PRINT CHR$(24)
IF tempsr(sijotmp(qwe)) < sr(sijotmp(qwe)) THEN PRINT CHR$(25)
IF qwe < 12 THEN PRINT "("; LTRIM$(STR$(FIX(osuus(qwe) * ppotti))); ")";
IF ohj(sijotmp(qwe)) <> 0 AND qwe < 12 THEN raha(ohj(sijotmp(qwe))) = raha(ohj(sijotmp(qwe))) + FIX(osuus(qwe) * ppotti)
NEXT qwe
LOCATE 16, 1
FOR pv = 1 TO plkm
IF sed(u(pv)) < 4 THEN
annarahaa sed(u(pv))
sponso(11, pv) = 0
END IF
IF sed(u(pv)) = 4 THEN
annarahaa 4
annarahaa 11
END IF
IF sr(u(pv)) < tempsr(u(pv)) THEN
annarahaa 10
sponso(19, pv) = 0
END IF
IF sr(u(pv)) >= tempsr(u(pv)) THEN annarahaa 19
IF sr(u(pv)) > tempsr(u(pv)) THEN annarahaa 15
NEXT pv
pjn
ERASE osuus, sijotmp

FOR zz = 1 TO plkm
OPEN "game_" + LTRIM$(STR$(lokero)) + "\stat." + LTRIM$(STR$(zz)) FOR APPEND AS #1
WRITE #1, kausi + 1, u(zz), 44, win(u(zz)), dra(u(zz)), los(u(zz)), gf(u(zz)), ga(u(zz)), p(u(zz)), s(u(zz)), tempsr(u(zz)), tempsr(u(zz)) - sr(u(zz)), sed(u(zz))
CLOSE #1
NEXT zz
OPEN "game_" + LTRIM$(STR$(lokero)) + "\1.sta" FOR APPEND AS #1
WRITE #1, kausi + 1, karki(1), ohj(karki(1)), karki(2), ohj(karki(2)), karki(3), ohj(karki(3)), cupvoittaja, ohj(cupvoittaja), l(emestari), ohj(emestari)
CLOSE #1
OPEN "game_" + LTRIM$(STR$(lokero)) + "\3.sta" FOR APPEND AS #1
WRITE #1, kausi + 1
FOR qwe = 1 TO 3
WRITE #1, nousu(qwe)
IF nousu(qwe) <> 0 THEN WRITE #1, ohj(nousu(qwe)) ELSE WRITE #1, 0
WRITE #1, puto(qwe)
IF puto(qwe) <> 0 THEN WRITE #1, ohj(puto(qwe)) ELSE WRITE #1, 0
NEXT qwe
CLOSE #1
FOR zz = 1 TO 6
OPEN "game_" + LTRIM$(STR$(lokero)) + "\2" + LTRIM$(STR$(zz)) + ".sta" FOR APPEND AS #1
WRITE #1, kausi + 1, pvoittaja(zz).na, pvoittaja(zz).jo, pvoittaja(zz).ma, pvoittaja(zz).sy, pvoittaja(zz).pi, ohj(pvoittaja(zz).jo)
CLOSE #1
NEXT zz
OPEN "game_" + LTRIM$(STR$(lokero)) + "\" + LTRIM$(STR$(kausi)) + ".tbl" FOR OUTPUT AS #1
FOR qwe = 1 TO 4
FOR xxx = 1 TO 12
xx = sijo(qwe, xxx)
WRITE #1, xx, p(xx), ohj(xx)
NEXT xxx
NEXT qwe
CLOSE #1
FOR xx = 1 TO plkm
OPEN "game_" + LTRIM$(STR$(lokero)) + "\" + LTRIM$(STR$(kausi)) + ".gr" + LTRIM$(STR$(xx)) FOR OUTPUT AS #1
WRITE #1, tempsr(u(xx))
FOR xxx = 1 TO 44
WRITE #1, graf(xxx, xx)
NEXT xxx
CLOSE #1
NEXT xx

alkukevat

managerisiirrot

CLS

FOR xxx = 1 TO 48
xx = x(xxx)
IF ohj(xx) = 0 THEN
tasomuut
tasomaar
orgamaar xx
END IF
NEXT xxx

FOR vu = 1 TO plkm
pv = vuoro(vu)
sopim(pv) = sopim(pv) - 1
IF sopim(pv) = 0 THEN omasopimus
NEXT vu

muutmestarit
FOR xx = 45 TO 86
tasomaar
NEXT xx

pelaajasiirrot
valitsestrattie

ERASE pwin, pvoittaja, supaplex, tempsr

END SUB

SUB gene
DIM tempp(1 TO lpl(pv)) AS pelaaja
FOR zz = 1 TO lpl(pv)
tempp(zz) = pel(zz, pv)
NEXT zz
last% = lpl(pv)
skout(1, pv) = 1
a = CINT(pw(ccc) / 6)
b = CINT(hw(ccc) / 12)
FOR xx = 1 TO 20
IF INT(101 * RND) < 70 THEN nats = 1 ELSE nats = keisix(1, INT(100 * RND) + 1)
rela
pel(xx, pv) = blanko
pel(xx, pv).svu = INT(2 * RND)
IF xx < 3 THEN pel(xx, pv).ppp = 1 ELSE IF xx < 9 THEN pel(xx, pv).ppp = 2 ELSE IF xx < 13 THEN pel(xx, pv).ppp = 3 ELSE IF xx < 17 THEN pel(xx, pv).ppp = 4 ELSE pel(xx, pv).ppp = 5
SELECT CASE xx
CASE 1
pel(xx, pv).psk = mw(ccc)
CASE 2
pel(xx, pv).psk = mw(ccc) - INT(3 * RND) - 1
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
z = pw(ccc) - c
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
z = hw(ccc) - d
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
IF pel(xx, pv).psk < 0 THEN pel(xx, pv).psk = 1
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

IF b <= 7 THEN c = 7 ELSE IF b <= 9 THEN c = 10 ELSE c = 13

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

FOR xxx = 1 TO lpl(pv)
neup = pel(xxx, pv)
palkmaar
pel(xxx, pv).sra = rahna
NEXT xxx

DIM tmx(1 TO 3) AS INTEGER
FOR b = 1 TO 15
IF b < 4 THEN tmx(b) = b + 2
IF b > 3 THEN
c = INT(3 * RND) + 1
d = INT(3 * RND) + 1
IF c <> d THEN SWAP tmx(c), tmx(d)
END IF
NEXT b
FOR b = 1 TO 3
d = 0
FOR c = 1 TO lpl(pv)
IF pel(c, pv).ppp = tmx(b) THEN
SELECT CASE d
CASE 0
d = c
CASE ELSE
IF pel(c, pv).psk > pel(d, pv).psk THEN d = c
END SELECT
END IF
NEXT c
pel(d, pv).nam = top(tox(ccc), b).nam
pel(d, pv).age = top(tox(ccc), b).age
pel(d, pv).nat = top(tox(ccc), b).nat
NEXT b
ERASE tmx
FOR b = 1 TO 3
d = 0
FOR c = 1 TO last%
IF tempp(c).ppp > 2 AND tempp(c).nam <> "QQQQQQQQQQQQQ" THEN
SELECT CASE d
CASE 0
d = c
CASE 1
IF tempp(c).psk > tempp(d).psk THEN d = c
END SELECT
END IF
NEXT c
top(tox(ccc), b).nam = tempp(d).nam
top(tox(ccc), b).age = tempp(d).age
top(tox(ccc), b).nat = tempp(d).nat
tempp(d).nam = "QQQQQQQQQQQQQ"
NEXT b
ERASE tempp
FOR b = 4 TO 5
nats = keisix(1, INT(100 * RND) + 1)
rela
top(tox(ccc), b).nam = blanko.nam
top(tox(ccc), b).age = blanko.age
top(tox(ccc), b).nat = blanko.nat
NEXT b
SWAP tox(ccc), tox(u(pv))
SWAP ohj(ccc), ohj(u(pv))
SWAP man(ccc), man(u(pv))
SWAP u(pv), ccc
laina(1, pv) = 0
laina(2, pv) = 0
laina(3, pv) = 0
potti(pv) = 0

IF uhatapa(pv) <> 0 THEN
uhatapa(pv) = 0
taso(ccc) = utaso(pv)
FOR xx = 1 TO 3
paikka(xx, ccc) = upaikka(xx, pv)
NEXT xx
ppiste(ccc) = uppiste(pv)
END IF

xx = ccc
tasomuut
tasomaar


END SUB

SUB haahaa (haha%)
COLOR 7, 0
LOCATE 43, 1
SELECT CASE haha%
CASE 15
PRINT CHR$(17); CHR$(16); CHR$(18);
END SELECT
SELECT CASE haha%
CASE 15
COLOR 15: PRINT " ? ";
COLOR 7
CASE ELSE
PRINT " ";
END SELECT
SELECT CASE haha%
CASE 15
PRINT "ENTER:HYVŽKSY  ";
END SELECT
END SUB

SUB klear (fat%)
SELECT CASE fat%
CASE 1
a = curso: b = curso
CASE 2
a = 1: b = 6
END SELECT
FOR c = a TO b
FOR cupex = 1 TO 5
ketju(cupex, c, pv) = 0
NEXT cupex
NEXT c
IF fat% = 2 THEN maa(1, pv) = 0
kapu(pv) = 0
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

SUB lentti (kuka%, sano%)
lt "s" + LTRIM$(STR$(kuka%)), (sano% - 1) * 6 + INT(6 * RND) + 1
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

SUB maajoukkue
d = 0
CLS
lt "q", 7
PRINT
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

SUB mahmax
nam = INT(genre(nats) * RND) + 1
OPEN "data\" + LTRIM$(STR$(nats)) + ".mhx" FOR INPUT AS #1
FOR gnome = 1 TO nam
INPUT #1, ptemp$
NEXT gnome
CLOSE #1
IF nats = 1 THEN krj$ = krjn(INT(16 * RND) + 1) ELSE krj$ = krjn(INT(23 * RND) + 1)
END SUB

SUB managerisiirrot
DIM vapaa(1 TO 54) AS INTEGER

GOSUB hassulasse

CLS
lt "q", 27
PRINT

FOR xxx = 1 TO 48
xx = x(xxx)
IF ohj(xx) = 0 THEN
a = 20
IF 100 * RND < a THEN
pillu:
yy = INT(54 * RND) + 1
IF vapaa(yy) = 1 THEN GOTO pillu
COLOR jkolo(sr(xx)), 0
PRINT l(xx); " ";
COLOR 8
PRINT RTRIM$(mana(man(xx)).nam); " (";
PRINT kansal(mana(man(xx)).nat); ")";
COLOR 14
PRINT " --> ";
man(xx) = yy
GOSUB hassulasse
COLOR 7
PRINT RTRIM$(mana(man(xx)).nam); " (";
PRINT kansal(mana(man(xx)).nat); ")"
PRINT
END IF
END IF
NEXT xxx
IF CSRLIN = 3 THEN COLOR 2: PRINT "EI UUTISIA..."
pjn
ERASE vapaa
EXIT SUB

hassulasse:
FOR qwe = 1 TO 54
vapaa(qwe) = 0
NEXT qwe

FOR qwe = 1 TO 48
IF ohj(qwe) = 0 THEN vapaa(man(qwe)) = 1
NEXT qwe
RETURN

END SUB

SUB mmkisaloppu
mmx% = 1
CLS
DIM mmj(1 TO 10) AS INTEGER
lt "x", 147
PRINT
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

FOR a = 1 TO 1500
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

lentti 1, 21
PRINT
lentti 1, 28
PRINT
COLOR 6: PRINT "LOPULLINEN KUNNIATAULUKKO"
PRINT
FOR xx = 1 TO 10
IF xx = 1 THEN COLOR 15, 0 ELSE IF xx = 10 THEN COLOR 8 ELSE COLOR 7, 0
PRINT kansap(mmsij(xx))
IF xx < 4 THEN mmitali(xx, mmsij(xx)) = mmitali(xx, mmsij(xx)) + 1
IF xx = 10 THEN mmputo = mmsij(xx)
NEXT xx
PRINT
COLOR 14, 0: PRINT kansap(mmputo);
COLOR 7: PRINT " <--> ";
COLOR 14, 0: PRINT kansap(mmnousu)
PRINT
xx = mmsij(1)
lentti 1, 29

SWAP mmsarja(mmputo), mmsarja(mmnousu)
pjn
ERASE mmj, mmp, mmv, mms, mmrando, mmsij
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

SUB omasopimus
DIM tarjo(1 TO 10) AS INTEGER
DIM kiinnos(1 TO 10) AS INTEGER
DIM tarjv(1 TO 10) AS INTEGER
DIM tarjv2(1 TO 10) AS INTEGER

DIM varattu(1 TO 48) AS INTEGER

sin1 = 0

IF otte(1, 1, pv) = 0 THEN sin2 = 0 ELSE sin2 = ((1 * vsaldo(1, 1, pv) + .5 * vsaldo(1, 2, pv)) / otte(1, 1, pv)) * 100
sin1 = sin1 + (otte(1, 1, pv) * .3) * (1 + ((sin2 - 50) * .004))
IF otte(2, 1, pv) = 0 THEN sin2 = 0 ELSE sin2 = ((1 * vsaldo(2, 1, pv) + .5 * vsaldo(2, 2, pv)) / otte(2, 1, pv)) * 100
sin1 = sin1 + (otte(2, 1, pv) * .2) * (1 + ((sin2 - 50) * .004))
IF otte(3, 1, pv) = 0 THEN sin2 = 0 ELSE sin2 = ((1 * vsaldo(3, 1, pv) + .5 * vsaldo(3, 2, pv)) / otte(3, 1, pv)) * 100
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

tarjo(1) = u(pv)

IF a < 6 THEN tarjox% = 9 ELSE IF a < 23 THEN tarjox% = 7 ELSE IF a < 40 THEN tarjox% = 5 ELSE tarjox% = 3

FOR zz = 2 TO tarjox%

FOR zzz = 1 TO 300
xx = INT(48 * RND) + 1
IF (sed(xx) + sedd(xx) + seddd(xx)) / 3 >= a AND ohj(xx) = 0 AND varattu(xx) = 0 THEN EXIT FOR
NEXT zzz
IF zzz = 51 THEN EXIT FOR

varattu(xx) = 1
tarjo(zz) = xx
tarjv(zz) = INT(3 * RND) + 1

NEXT zz

FOR xx = 1 TO zz
kiinnos(xx) = 1
tarjv(xx) = INT(4 * RND) + 1
IF tarjv(xx) = 4 THEN tarjv2(xx) = 4 ELSE tarjv2(xx) = INT((5 - tarjv(xx)) * RND) + tarjv(xx)

NEXT xx

zz = zz - 1
curso = 1
kurso = 1

omaalku:
CLS
lt "q", 16

DO

FOR xx = 1 TO zz
IF tarjo(xx) = u(pv) THEN LOCATE 2 + xx, 1 ELSE LOCATE 3 + xx, 1
IF curso = xx THEN COLOR , 6 ELSE COLOR , 0
IF kiinnos(xx) = 1 THEN COLOR 14 ELSE COLOR 8
PRINT RTRIM$(l(tarjo(xx))); " (";
IF sr(tarjo(xx)) = 1 THEN PRINT "PHL)";  ELSE IF sr(tarjo(xx)) = 2 THEN PRINT "DIV)";  ELSE PRINT "MUT)";
NEXT xx

COLOR , 0
klearstat 15
haahaa 15
LOCATE 15, 1


xx = tarjo(curso)
COLOR 6
lt "y", 185: PRINT " ";
PRINT LTRIM$(STR$(sed(xx))); ", "; LTRIM$(STR$(sedd(xx))); ", "; LTRIM$(STR$(seddd(xx)))
PRINT
lt "y", 186: PRINT " ";
PRINT LTRIM$(STR$(taso(xx))); ", ";
PRINT LTRIM$(STR$(paikka(1, xx) * 100 + paikka(2, xx) * 100))
PRINT
lt "y", 187: PRINT " ";
COLOR 14: IF curso = 1 THEN PRINT "JOS JOKU TIETŽŽ, NIIN SINŽ" ELSE PRINT materia(materiax(tazo(xx)))
PRINT
lt "y", 188

LOCATE 21
IF kurso > tarjv2(curso) THEN kurso = tarjv2(curso)
IF kurso < tarjv(curso) THEN kurso = tarjv(curso)

FOR zzz = tarjv(curso) TO tarjv2(curso)
IF kurso = zzz THEN COLOR 14, 6 ELSE COLOR 14, 0
LOCATE , 19: PRINT LTRIM$(STR$(zzz))
NEXT zzz

COLOR , 0

wnd 1
IF me$ = "?" THEN qelp 19: GOTO omaalku

ku 2, tarjv(curso), tarjv2(curso)
ku 3, 1, zz

IF me$ = CHR$(13) AND kiinnos(curso) = 1 THEN EXIT DO

LOOP

IF curso <> 1 THEN
ccc = tarjo(curso)
gene
xx = u(pv)
orgamaar xx


END IF
sopim(pv) = kurso
ERASE tarjo, kiinnos, tarjv, tarjv2, varattu
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

SUB pelaajasiirrot
tremor:

CLS
lt "q", 29
PRINT

FOR xxx = 1 TO 48
xx = x(xxx)
IF ohj(xx) = 0 THEN
FOR zz = 1 TO 5

IF top(tox(xx), zz).age >= 31 THEN
IF top(tox(xx), zz).age > 38 THEN a = 38 ELSE a = top(tox(xx), zz).age

IF 100 * RND <= elake(a) THEN
IF zz = 1 THEN COLOR 15 ELSE IF zz < 4 THEN COLOR 7 ELSE COLOR 8
PRINT top(tox(xx), zz).nam; " (";
PRINT LTRIM$(STR$(top(tox(xx), zz).age)); ")  ";
COLOR jkolo(sr(xx))
PRINT l(xx); "  "
top(tox(xx), zz).nam = "QQQQQQQQQQQQQ"
END IF
END IF
NEXT zz
END IF
NEXT xxx

FOR xx = 1 TO 48
IF ohj(xx) = 0 THEN
FOR zz = 1 TO 5
top(tox(xx), zz).age = top(tox(xx), zz).age + 1
NEXT zz
END IF
NEXT xx

pjn
CLS
lt "q", 30
PRINT

daavid:
gnome = 0
FOR xx = 1 TO 48
IF ohj(xx) = 0 THEN
FOR zz = 1 TO 5
IF top(tox(xx), zz).nam = "QQQQQQQQQQQQQ" THEN gnome = 1
NEXT zz
END IF
NEXT xx

IF gnome = 1 THEN

FOR xxx = 1 TO 48
xx = x(xxx)

IF ohj(xx) = 0 THEN

FOR zz = 1 TO 5

IF top(tox(xx), zz).nam = "QQQQQQQQQQQQQ" THEN

a = 99 * RND + 1

SELECT CASE sr(xx)
CASE 1
SELECT CASE a
CASE 1 TO 15
FOR zzz = zz + 1 TO 5
top(tox(xx), zzz - 1) = top(tox(xx), zzz)
NEXT zzz
nats = 1: rela
top(tox(xx), 5).nam = blanko.nam
top(tox(xx), 5).nat = 1
top(tox(xx), 5).age = 18

COLOR 8
PRINT top(tox(xx), 5).nam; " (18)";
COLOR 7
LOCATE , 30
PRINT RTRIM$(l(xx)); " A";
COLOR 14
LOCATE , 50
COLOR 14: PRINT "-->";
LOCATE , 55
COLOR jkolo(sr(xx))
PRINT l(xx)

CASE 16 TO 40
d = x(INT(12 * RND) + 1)
IF ohj(d) = 0 THEN
IF top(tox(d), zz).nam <> "QQQQQQQQQQQQQ" THEN
SWAP top(tox(d), zz), top(tox(xx), zz)
IF zz = 1 THEN COLOR 15 ELSE IF zz < 4 THEN COLOR 7 ELSE COLOR 8
PRINT top(tox(xx), zz).nam; " (";
PRINT LTRIM$(STR$(top(tox(xx), zz).age)); ")";
LOCATE , 30
COLOR jkolo(sr(d))
PRINT l(d);
LOCATE , 50
COLOR 14: PRINT "-->";
LOCATE , 55
COLOR jkolo(sr(xx))
PRINT l(xx)
END IF
END IF

CASE 41 TO 60
FOR zzz = zz + 1 TO 5
top(tox(xx), zzz - 1) = top(tox(xx), zzz)
NEXT zzz

d = x(INT(12 * RND) + 13)
b = INT(2 * RND) + 1

IF ohj(d) = 0 THEN
IF top(tox(d), b).nam <> "QQQQQQQQQQQQQ" THEN

SWAP top(tox(d), b), top(tox(xx), 5)

IF b = 1 THEN COLOR 15 ELSE IF b < 4 THEN COLOR 7 ELSE COLOR 8
PRINT top(tox(xx), 5).nam; " (";
PRINT LTRIM$(STR$(top(tox(xx), 5).age)); ")";

LOCATE , 30
COLOR jkolo(sr(d))
PRINT l(d);
LOCATE , 50
COLOR 14: PRINT "-->";
LOCATE , 55
COLOR jkolo(sr(xx))
PRINT l(xx)
END IF
END IF

CASE 61 TO 75
FOR zzz = zz + 1 TO 5
top(tox(xx), zzz - 1) = top(tox(xx), zzz)
NEXT zzz

d = x(INT(24 * RND) + 25)
b = 1
IF ohj(d) = 0 THEN
IF top(tox(d), b).nam <> "QQQQQQQQQQQQQ" THEN

SWAP top(tox(d), b), top(tox(xx), 5)

IF b = 1 THEN COLOR 15 ELSE IF b < 4 THEN COLOR 7 ELSE COLOR 8
PRINT top(tox(xx), 5).nam; " (";
PRINT LTRIM$(STR$(top(tox(xx), 5).age)); ")";
LOCATE , 30
COLOR jkolo(sr(d))
PRINT l(d);
LOCATE , 50
COLOR 14: PRINT "-->";
LOCATE , 55
COLOR jkolo(sr(xx))
PRINT l(xx)
END IF
END IF

CASE 76 TO 88
b = INT(16 * RND) + 2
nats = b: rela
top(tox(xx), zz).nam = blanko.nam
top(tox(xx), zz).age = blanko.age
top(tox(xx), zz).nat = blanko.nat

IF zz = 1 THEN COLOR 15 ELSE IF zz < 4 THEN COLOR 7 ELSE COLOR 8
PRINT top(tox(xx), zz).nam; " (";
PRINT LTRIM$(STR$(top(tox(xx), zz).age)); ")";

LOCATE , 30
COLOR 7: PRINT kansap(b);
LOCATE , 50
COLOR 14: PRINT "-->";
LOCATE , 55
COLOR jkolo(sr(xx))
PRINT l(xx)

CASE 89 TO 100

FOR zzz = zz + 1 TO 5
top(tox(xx), zzz - 1) = top(tox(xx), zzz)
NEXT zzz

nats = 1: rela
top(tox(xx), 5).nam = blanko.nam
top(tox(xx), 5).age = blanko.age
top(tox(xx), 5).nat = blanko.nat

END SELECT

CASE 2
SELECT CASE a
CASE 1 TO 20
FOR zzz = zz + 1 TO 5
top(tox(xx), zzz - 1) = top(tox(xx), zzz)
NEXT zzz
nats = 1: rela
top(tox(xx), 5).nam = blanko.nam
top(tox(xx), 5).nat = 1
top(tox(xx), 5).age = 18
COLOR 8
PRINT top(tox(xx), 5).nam; " (18)";
COLOR 7
LOCATE , 30
PRINT RTRIM$(l(xx)); " A";
COLOR 14
LOCATE , 50
COLOR 14: PRINT "-->";
LOCATE , 55
COLOR jkolo(sr(xx))
PRINT l(xx)

CASE 21 TO 40
d = x(INT(12 * RND) + 13)
IF ohj(d) = 0 THEN
IF top(tox(d), zz).nam <> "QQQQQQQQQQQQQ" THEN
SWAP top(tox(d), zz), top(tox(xx), zz)

IF b = 1 THEN COLOR 15 ELSE IF b < 4 THEN COLOR 7 ELSE COLOR 8
PRINT top(tox(xx), zz).nam; " (";
PRINT LTRIM$(STR$(top(tox(xx), zz).age)); ")";

LOCATE , 30
COLOR jkolo(sr(d))
PRINT l(d);
LOCATE , 50
COLOR 14: PRINT "-->";
LOCATE , 55
COLOR jkolo(sr(xx))
PRINT l(xx)
END IF
END IF

CASE 41 TO 60
FOR zzz = zz + 1 TO 5
top(tox(xx), zzz - 1) = top(tox(xx), zzz)
NEXT zzz

d = x(INT(24 * RND) + 25)
b = INT(2 * RND) + 1

IF ohj(d) = 0 THEN
IF top(tox(d), b).nam <> "QQQQQQQQQQQQQ" THEN
SWAP top(tox(d), b), top(tox(xx), 5)
IF b = 1 THEN COLOR 15 ELSE IF b < 4 THEN COLOR 7 ELSE COLOR 8
PRINT top(tox(xx), 5).nam; " (";
PRINT LTRIM$(STR$(top(tox(xx), 5).age)); ")";
LOCATE , 30
COLOR jkolo(sr(d))
PRINT l(d);
LOCATE , 50
COLOR 14: PRINT "-->";
LOCATE , 55
COLOR jkolo(sr(xx))
PRINT l(xx)
END IF
END IF

CASE 61 TO 70
b = INT(16 * RND) + 2
nats = b: rela
top(tox(xx), zz).nam = blanko.nam
top(tox(xx), zz).age = blanko.age
top(tox(xx), zz).nat = blanko.nat

IF zz = 1 THEN COLOR 15 ELSE IF zz < 4 THEN COLOR 7 ELSE COLOR 8
PRINT top(tox(xx), zz).nam; " (";
PRINT LTRIM$(STR$(top(tox(xx), zz).age)); ")";

LOCATE , 30
COLOR 7: PRINT kansap(b);
LOCATE , 50
COLOR 14: PRINT "-->";
LOCATE , 55
COLOR jkolo(sr(xx))
PRINT l(xx)

CASE 71 TO 80
d = x(INT(12 * RND) + 1)
b = INT(2 * RND) + 4

IF ohj(d) = 0 THEN
IF top(tox(d), b).nam <> "QQQQQQQQQQQQQ" THEN

SWAP top(tox(d), b), top(tox(xx), zz)
IF zz = 1 THEN COLOR 15 ELSE IF zz < 4 THEN COLOR 7 ELSE COLOR 8
PRINT top(tox(xx), zz).nam; " (";
PRINT LTRIM$(STR$(top(tox(xx), zz).age)); ")";
LOCATE , 30
COLOR jkolo(sr(d))
PRINT l(d);
LOCATE , 50
COLOR 14: PRINT "-->";
LOCATE , 55
COLOR jkolo(sr(xx))
PRINT l(xx)
END IF
END IF

CASE 81 TO 100
FOR zzz = zz + 1 TO 5
top(tox(xx), zzz - 1) = top(tox(xx), zzz)
NEXT zzz
nats = 1: rela
top(tox(xx), 5).nam = blanko.nam
top(tox(xx), 5).age = blanko.age
top(tox(xx), 5).nat = blanko.nat

END SELECT

CASE 3
SELECT CASE a
CASE 1 TO 30
FOR zzz = zz + 1 TO 5
top(tox(xx), zzz - 1) = top(tox(xx), zzz)
NEXT zzz
nats = 1: rela
top(tox(xx), 5).nam = blanko.nam
top(tox(xx), 5).nat = 1
top(tox(xx), 5).age = 18
COLOR 8
PRINT top(tox(xx), 5).nam; " (18)";
COLOR 7
LOCATE , 30
PRINT RTRIM$(l(xx)); " A";
COLOR 14
LOCATE , 50
COLOR 14: PRINT "-->";
LOCATE , 55
COLOR jkolo(sr(xx))
PRINT l(xx)

CASE 31 TO 70
d = x(INT(24 * RND) + 25)
IF ohj(d) = 0 THEN
IF top(tox(d), zz).nam <> "QQQQQQQQQQQQQ" THEN

SWAP top(tox(d), zz), top(tox(xx), zz)
IF zz = 1 THEN COLOR 15 ELSE IF zz < 4 THEN COLOR 7 ELSE COLOR 8
PRINT top(tox(xx), zz).nam; " (";
PRINT LTRIM$(STR$(top(tox(xx), zz).age)); ")";
LOCATE , 30
COLOR jkolo(sr(d))
PRINT l(d);
LOCATE , 50
COLOR 14: PRINT "-->";
LOCATE , 55
COLOR jkolo(sr(xx))
PRINT l(xx)
END IF
END IF

CASE 71 TO 100
FOR zzz = zz + 1 TO 5
top(tox(xx), zzz - 1) = top(tox(xx), zzz)
NEXT zzz

nats = 1: rela
top(tox(xx), 5).nam = blanko.nam
top(tox(xx), 5).age = blanko.age
top(tox(xx), 5).nat = blanko.nat

END SELECT
END SELECT

END IF
NEXT zz
END IF
NEXT xxx

GOTO daavid
END IF

goljat:

FOR xx = 1 TO 48
IF ohj(xx) = 0 THEN
a = INT(4 * RND) + 1
SWAP top(tox(xx), a), top(tox(xx), a + 1)
END IF
NEXT xx

pjn

END SUB

SUB pjn
LOCATE 43, 1
COLOR 14: PRINT "PAINA JOTAKIN NŽPPŽINTŽ...";
WHILE INKEY$ = "": WEND
END SUB

SUB poispel
poispelaaja xx, pv
sortmaar
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

SUB sarjamaar
FOR xx = 1 TO 48
x(sed(xx)) = xx
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

SUB sortmaar
ERASE sort
ERASE sort2
pelaa = 0
FOR ooo = 1 TO lpl(pv)
IF pel(ooo, pv).inj = 0 THEN pelaa = pelaa + 1
NEXT ooo
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

SUB tasomaar
DIM lvl(1 TO 58) AS tazzo
OPEN "data\tasot.m2k" FOR INPUT AS #1
FOR zz = 1 TO 58
INPUT #1, lvl(zz).maz, lvl(zz).puz, lvl(zz).hyz
NEXT zz
CLOSE #1
IF ohj(xx) = 0 THEN
mw(xx) = lvl(tazo(xx)).maz
pw(xx) = lvl(tazo(xx)).puz
hw(xx) = lvl(tazo(xx)).hyz
mw(xx) = mw(xx) + INT(3 * RND) - 1
pw(xx) = pw(xx) + INT(5 * RND) - 2
hw(xx) = hw(xx) + INT(9 * RND) - 4
END IF
ERASE lvl
END SUB

SUB tasomuut
IF xxx < 13 THEN LOCATE xxx, 1 ELSE IF xxx < 25 THEN LOCATE xxx - 12, 41 ELSE IF xxx < 37 THEN LOCATE xxx - 9, 1 ELSE LOCATE xxx - 21, 41

IF tempsr(xx) > sr(xx) THEN COLOR 15 ELSE IF tempsr(xx) < sr(xx) THEN COLOR 8 ELSE COLOR 7

temp% = 0

sin1 = (sed(xx) + sedd(xx) + seddd(xx)) / 3

SELECT CASE tempsr(xx)

CASE sr(xx)

SELECT CASE sr(xx)
CASE 1
SELECT CASE sin1
CASE 1
temp% = 36
CASE 1.000001 TO 2
temp% = 35
CASE 2.000001 TO 3
temp% = 34
CASE 3.000001 TO 4
temp% = 33
CASE 4.000001 TO 6
temp% = 32
CASE 6.000001 TO 8
temp% = 31
CASE 8.000001 TO 11
temp% = 30
CASE 11.00001 TO 13
temp% = 29
CASE ELSE
temp% = 28
END SELECT
CASE 2
SELECT CASE sin1
CASE IS <= 13.5
temp% = 28
CASE 13.50001 TO 15
temp% = 27
CASE 15.00001 TO 17
temp% = 26
CASE 17.00001 TO 19
temp% = 25
CASE 19.00001 TO 21
temp% = 24
CASE 21.00001 TO 23
temp% = 23
CASE 23.00001 TO 25
temp% = 22
CASE ELSE
temp% = 21
END SELECT

CASE 3
SELECT CASE sin1
CASE IS <= 26
temp% = 22
CASE 26.00001 TO 28
temp% = 21
CASE 28.00001 TO 31
temp% = 20
CASE 31.00001 TO 34
temp% = 19
CASE 34.00001 TO 37
temp% = 18
CASE 37.00001 TO 40
temp% = 17
CASE 40.00001 TO 43
temp% = 16
CASE 43.00001 TO 46
temp% = 15
CASE ELSE
temp% = 14
END SELECT
END SELECT

CASE IS > sr(xx)
SELECT CASE sr(xx)
CASE 1
SELECT CASE sin1
CASE IS <= 15
temp% = tazo(xx) + INT(2 * RND) + 1
CASE ELSE
temp% = tazo(xx)
END SELECT
CASE 2
SELECT CASE sin1
CASE IS <= 27
temp% = tazo(xx) + INT(2 * RND) + 1
CASE ELSE
temp% = tazo(xx)
END SELECT
END SELECT

CASE IS < sr(xx)
SELECT CASE sr(xx)
CASE 2
IF tazo(xx) > 31 THEN temp% = 31 ELSE temp% = tazo(xx)
IF 100 * RND < (sin1 * 2) THEN temp% = temp% - 2
CASE 3
IF tazo(xx) > 24 THEN temp% = 24 ELSE temp% = tazo(xx)
IF 200 * RND < (sin1 * 2) THEN temp% = temp% - 2
END SELECT
END SELECT

a = INT(90 * RND) + 1

SELECT CASE a
CASE 1 TO 30 + (mtaito(3, man(xx)) * 8)
temp% = temp% + 1
CASE 31 + (mtaito(3, man(xx)) * 8) TO 60 + (mtaito(3, man(xx)) * 8)
temp% = temp%
CASE IS >= 61 + (mtaito(3, man(xx)) * 8)
temp% = temp% - 1
END SELECT

IF paikka(1, xx) + paikka(2, xx) < 40 THEN
IF temp% > 27 THEN temp% = 27
END IF

tazo(xx) = temp%

END SUB

SUB tmankom (sano%)
lt "tk", (sano% - 1) * 6 + INT(6 * RND) + 1
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

SUB wnd (sex%)
SELECT CASE sex%
CASE 1
me$ = "": WHILE me$ = "": me$ = INKEY$: WEND
CASE 2
me$ = "": DO UNTIL me$ = "k" OR me$ = "e": me$ = INKEY$: LOOP
END SELECT
END SUB


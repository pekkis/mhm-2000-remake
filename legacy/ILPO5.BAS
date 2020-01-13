DECLARE SUB borsinit (init%)
DECLARE SUB automa ()
DECLARE SUB aaaargh ()
DECLARE SUB colchk (colre%)
DECLARE SUB arpo (arf%)
DECLARE SUB arpol (cus%, ttt%, voiz%)
DECLARE SUB cupohjelma (clurk%)
DECLARE SUB euromaar ()
DECLARE SUB mor (mora%, morax%)
DECLARE SUB leq (fat%)
DECLARE SUB lax (fat%)
DECLARE SUB lt (lue$, lukux%)
DECLARE SUB lay (fat%)
DECLARE SUB haahaa (haha%)
DECLARE SUB ku (kuz%, ku1%, ku2%)
DECLARE SUB lentti (kuka%, sano%)
DECLARE SUB klearstat (fat%)
DECLARE SUB krapulapiirto ()
DECLARE SUB luz (fat%)
DECLARE SUB muilutus (fat%)
DECLARE SUB ont (ontto%)
DECLARE SUB nollaux ()
DECLARE SUB pjn ()
DECLARE SUB poispel ()
DECLARE SUB printpel (fat%)
DECLARE SUB ottpel ()
DECLARE SUB ottul ()
DECLARE SUB otmuut (fat%)
DECLARE SUB pesc ()
DECLARE SUB potk (potcu%)
DECLARE SUB staulmaar ()
DECLARE SUB qelp (qel%)
DECLARE SUB protesti ()
DECLARE SUB rah ()
DECLARE SUB skandal ()
DECLARE SUB wnd (ser%)
DECLARE SUB tarjousmaar (koo1%, koo2%, pienin&, isoin&)
DECLARE SUB voimamaar ()
DECLARE SUB staulturmaar ()
DECLARE SUB taut (jop!, jupp%)
DECLARE SUB teet (jup%, jupp%, juppp%)
DECLARE FUNCTION tarko% (t0%, t1%, t2%, t3%)
DECLARE FUNCTION tarka% (jez%)
'$DYNAMIC
'$INCLUDE: 'mhm2k.bi'

REM $STATIC
SUB staulnayt (sar, sty, stx, iso)
LOCATE sty
FOR xx = 1 TO 12
od(1) = sijo(sar, xx)
COLOR stvari(xx, sar)
colchk 2
SELECT CASE iso
CASE 0
LOCATE , stx: PRINT l(sijo(sar, xx));
LOCATE , stx + 10: PRINT p(sijo(sar, xx))
CASE 1
LOCATE , stx: PRINT l(sijo(sar, xx));
LOCATE , stx + 12: PRINT "("; kk(sijo(sar, xx)); ")";
LOCATE , stx + 27
PRINT LTRIM$(STR$(ot));
IF win(sijo(sar, xx)) < 10 THEN grr% = 32 ELSE grr% = 31
LOCATE , stx + grr%: PRINT LTRIM$(STR$(win(sijo(sar, xx))));
LOCATE , stx + 35: PRINT LTRIM$(STR$(dra(sijo(sar, xx))));
LOCATE , stx + 38: PRINT LTRIM$(STR$(los(sijo(sar, xx))));
SELECT CASE gf(sijo(sar, xx))
CASE IS < 10
grr% = 45
CASE 10 TO 99
grr% = 44
CASE ELSE
grr% = 43
END SELECT
LOCATE , stx + grr%: PRINT LTRIM$(STR$(gf(sijo(sar, xx))));
LOCATE , stx + 47: PRINT "-";
LOCATE , stx + 49: PRINT LTRIM$(STR$(ga(sijo(sar, xx))));
LOCATE , stx + 57: PRINT LTRIM$(STR$(p(sijo(sar, xx))));

LOCATE , stx + 61
FOR zz = 1 TO 10
IF kunto(zz, sijo(sar, xx)) <> 0 THEN PRINT kuntox(kunto(zz, sijo(sar, xx)));  ELSE PRINT " ";
NEXT zz
PRINT

END SELECT
IF iso = 1 THEN
COLOR 8
IF sar = 1 AND xx = 8 OR sar = 1 AND xx = 11 THEN LOCATE , stx: PRINT "ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ"
IF sar = 2 AND xx = 6 OR sar = 2 AND xx = 10 THEN LOCATE , stx: PRINT "ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ"
IF sar = 3 AND xx = 6 OR sar = 4 AND xx = 6 THEN LOCATE , stx: PRINT "ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ"
END IF
NEXT xx
IF krapu(pv) = 2 AND iso = 1 THEN krapulapiirto
EXIT SUB
END SUB

SUB staulnaytehl
COLOR 15: LOCATE 1, 60
PRINT "EHL:N TAULUKOT, ";
LOCATE 2, 60
PRINT LTRIM$(STR$(eot)); "/6 OTTELUA";
LOCATE 1, 1
FOR qwe = 1 TO 5
COLOR 14: PRINT "LOHKO "; LTRIM$(STR$(qwe))
PRINT
www = CSRLIN - 1
COLOR 8: LOCATE www + 2: PRINT STRING$(43, "Ä");
FOR cupex = 1 TO 4
temp% = cupex + (qwe - 1) * 4
COLOR estvari(es(temp%))
IF es(temp%) = 1 THEN s = 0 ELSE s = 1
IF ohj(ex(temp%)) <> 0 THEN ccc = ohj(ex(temp%)): colchk 4
LOCATE www + es(temp%) + s, 1
PRINT l(ex(temp%)); "  ("; kk(ex(temp%)); ")";
LOCATE , 30: PRINT egf(temp%); "-"; ega(temp%);
LOCATE , 40: PRINT ep(temp%)
NEXT cupex
LOCATE www + 7
NEXT qwe
IF krapu(pv) = 2 THEN krapulapiirto
END SUB

SUB staulturmaar
FOR xx = 1 TO 6
ts(xx) = 1
NEXT xx
FOR xx = 1 TO 5
FOR xxx = xx + 1 TO 6
SELECT CASE tp(xx)
CASE IS > tp(xxx)
ts(xxx) = ts(xxx) + 1
CASE IS < tp(xxx)
ts(xx) = ts(xx) + 1
CASE tp(xxx)
IF tero(xx) >= tero(xxx) THEN ts(xxx) = ts(xxx) + 1 ELSE ts(xx) = ts(xx) + 1
END SELECT
NEXT xxx
NEXT xx
PRINT
FOR xx = 1 TO 6
od(1) = tx(xx)
IF ts(xx) = 1 THEN COLOR 14 ELSE COLOR 2
colchk 2
IF tkr < 6 THEN LOCATE 7 + ts(xx), 1 ELSE LOCATE 2 + ts(xx), 1
PRINT l(tx(xx)); " ("; kk(tx(xx)); ")";
LOCATE , 35: PRINT tero(xx);
LOCATE , 41: PRINT tp(xx);
IF tkr < 6 THEN
PRINT
ELSE
LOCATE , 45: PRINT "("; LTRIM$(STR$(CLNG(palki(ts(xx))))); ")"
IF ohj(tx(xx)) <> 0 THEN raha(ohj(tx(xx))) = raha(ohj(tx(xx))) + palki(ts(xx))
END IF
NEXT xx
END SUB

SUB suosikitchk
FOR b = 1 TO 3
FOR c = 1 TO 3
suosikki(b, c, pv) = 0
NEXT c
NEXT b
FOR zz = 1 TO 3
FOR xx = 1 TO lpl(pv)
SELECT CASE zz
CASE 1
sin1 = pel(xx, pv).kar * 2 + pel(xx, pv).psk * 2 + pel(xx, pv).pok
CASE 2
sin1 = ((pel(xx, pv).age + pel(xx, pv).ldr ^ 1.3) / 50)
IF pel(xx, pv).psk < avg(1, pv) THEN sin1 = sin1 * (pel(xx, pv).psk / avg(1, pv))

CASE 3
sin1 = pel(xx, pv).psk + pel(xx, pv).ldr + pel(xx, pv).kar
END SELECT
GOSUB wyvern
NEXT xx
NEXT zz
EXIT SUB
wyvern:
FOR zzz = 1 TO 3
SELECT CASE suosikki(zz, zzz, pv)
CASE 0
suosikki(zz, zzz, pv) = xx
RETURN
CASE ELSE
SELECT CASE zz
CASE 1
sin2 = pel(suosikki(zz, zzz, pv), pv).kar * 2 + pel(suosikki(zz, zzz, pv), pv).psk * 2 + pel(suosikki(zz, zzz, pv), pv).pok
CASE 2
sin2 = ((pel(suosikki(zz, zzz, pv), pv).age + pel(suosikki(zz, zzz, pv), pv).ldr ^ 1.3) / 50)
IF pel(suosikki(zz, zzz, pv), pv).psk < avg(1, pv) THEN sin2 = sin2 * (pel(suosikki(zz, zzz, pv), pv).psk / avg(1, pv))
CASE 3
sin2 = pel(suosikki(zz, zzz, pv), pv).psk + pel(suosikki(zz, zzz, pv), pv).ldr + pel(suosikki(zz, zzz, pv), pv).kar
END SELECT
IF sin1 > sin2 THEN
FOR z = 3 TO zzz + 1 STEP -1
suosikki(zz, z, pv) = suosikki(zz, z - 1, pv)
NEXT z
suosikki(zz, zzz, pv) = xx
RETURN
END IF
END SELECT
NEXT zzz
RETURN
END SUB

SUB suunnitelma
leq 19
FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).spe <> 13 AND pel(xx, pv).lah = 0 THEN

IF pel(xx, pv).age >= 31 AND pel(xx, pv).svu < 5 AND pel(xx, pv).psk < 15 THEN
IF pel(xx, pv).age > 38 THEN a = 38 ELSE a = pel(xx, pv).age
IF INT(100 * RND) + 1 <= elake(a) THEN
lax 111: PRINT
pel(xx, pv).lah = 99
END IF
END IF

IF pel(xx, pv).nat <> 1 AND pel(xx, pv).kar < 10 AND pel(xx, pv).svu < 5 THEN
IF INT(100 * RND) + 1 < (10 - pel(xx, pv).kar) * 3 THEN
lax 112: PRINT
pel(xx, pv).lah = 98
END IF
END IF

IF pel(xx, pv).psk >= maajomin(1) AND pel(xx, pv).age < 26 THEN
IF INT(100 * RND) + 1 <= anhooal(pel(xx, pv).age) + ((pel(xx, pv).psk - maajomin(1)) * 10) AND pel(xx, pv).svu < 5 THEN
lax 113: PRINT
pel(xx, pv).lah = 97

END IF
END IF

IF pel(xx, pv).ppp = 1 THEN b = 2 ELSE b = 1
a = valb(b, pv) + valb(4, pv) + valb(5, pv) * 2 - pel(xx, pv).psk
IF a <= -4 THEN
lax 114: PRINT
pel(xx, pv).lah = 96
END IF

END IF

NEXT xx

IF CSRLIN = 3 THEN lay 26
pesc

johnholmes:
FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).nhl = -1 AND pel(xx, pv).lah = 97 THEN
leq 5
lax 83
poispel
pjn
GOTO johnholmes
END IF
NEXT xx


FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).nhl = -2 THEN pel(xx, pv).nhl = -1
NEXT xx
END SUB

SUB tallennus
CLS
COLOR 6
PRINT "ODOTA, TALLENNAN TILANNETTA"

CHDIR "game_" + LTRIM$(STR$(lokero))
OPEN "gameid.gam" FOR OUTPUT AS #1
WRITE #1, plkm, kausi
FOR tt = 1 TO plkm
WRITE #1, nimi(tt), l(u(tt)), sr(u(tt))
NEXT tt
CLOSE #1
OPEN "savetus1.xxx" FOR OUTPUT AS #1
WRITE #1, emestari, nousu(1), nousu(2), nousu(3), puto(1), puto(2), puto(3), pelaa, ot, ki, lastbors, eot, pkr, kausi, kr, ekr, tietos, jaynteh, ppotti, arvsulk, kriisi, nokka, cround, leggi, mmnousu, mmputo, cupvoittaja, tv, saver%, savertype%, lm
FOR tt = 1 TO 7
WRITE #1, karki(tt)
NEXT tt
CLOSE #1
IF kiero(kr) = 4 THEN
OPEN "hativati.xxx" FOR OUTPUT AS #1
FOR tt = 1 TO 86
WRITE #1, hott(tt), hotte(tt)
NEXT tt
CLOSE #1
END IF
OPEN "savetus2.xxx" FOR OUTPUT AS #1
FOR tt = 1 TO plkm
WRITE #1, lpj(tt), u(tt), vuoro(tt), nimi(tt), vai(1, tt), vai(2, tt), vai(3, tt), vai(4, tt), raha(tt), mukp(tt), muke(tt), lpl(tt), inte(tt), putki(1, tt), putki(2, tt), putki(3, tt), putki(4, tt), putki(5, tt), krapu(tt), uhka(tt), sovtap(tt),  _
kuume(tt), sopuhu(tt), potti(tt), sopim(tt), junnu(tt), laina(1, tt), laina(2, tt), laina(3, tt), mafia(tt), actiox(tt), jaynateh(tt), mukt(tt), mukc(tt), automat(tt), kapu(tt), utaso(tt), uppiste(tt), upaikka(1, tt), upaikka(2, tt), upaikka(3, tt), _
 uhatapa(tt), rakennuttaja(tt), arkkitehti(tt), mpv(tt), infos(tt), vast(tt), maine(tt), boikotti(tt), konkurssi(tt), treeni(tt)
FOR zz = 1 TO UBOUND(spx, 1)
WRITE #1, spx(zz, tt)
NEXT zz
FOR zz = 1 TO 3
FOR zzz = 1 TO 3
WRITE #1, suosikki(zz, zzz, tt)
NEXT zzz
NEXT zz
FOR zz = 1 TO 4
WRITE #1, otte(zz, 1, tt), otte(zz, 2, tt)
WRITE #1, vsaldo(zz, 1, tt), vsaldo(zz, 2, tt), vsaldo(zz, 3, tt)
NEXT zz
FOR zz = 1 TO 7
WRITE #1, saav(zz, tt)
NEXT zz
WRITE #1, maa(1, tt)
FOR zz = 1 TO 6
FOR qwe = 1 TO 5
WRITE #1, ketju(qwe, zz, tt)
NEXT qwe
NEXT zz
WRITE #1, spona(tt)
FOR zz = 1 TO 20
WRITE #1, sponso(zz, tt)
NEXT zz
NEXT tt
CLOSE #1
FOR tt = 1 TO plkm
OPEN "pel" + LTRIM$(STR$(tt)) + ".xxx" FOR RANDOM AS #1
FOR zz = 1 TO lpl(tt)
PUT #1, zz, pel(zz, tt)
NEXT zz
CLOSE #1
OPEN "jel" + LTRIM$(STR$(tt)) + ".xxx" FOR RANDOM AS #1
FOR zz = 1 TO lpj(tt)
PUT #1, zz, jel(zz, tt)
NEXT zz
CLOSE #1
NEXT tt
OPEN "borspel.tmp" FOR BINARY AS #1
OPEN "savetus5.xxx" FOR BINARY AS #2
rahna = 1
DO WHILE NOT EOF(1)
GET #1, rahna, kopsa
PUT #2, rahna, kopsa
rahna = rahna + 1
LOOP
CLOSE
OPEN "mmitali.xxx" FOR OUTPUT AS #1
FOR tt = 1 TO 17
WRITE #1, mmitali(1, tt), mmitali(2, tt), mmitali(3, tt)
NEXT tt
CLOSE #1
OPEN "savetus4.xxx" FOR OUTPUT AS #1
FOR tt = 1 TO 86
WRITE #1, l(tt), kk(tt), ohj(tt), mw(tt), pw(tt), hw(tt), tazo(tt), leg(tt), ppiste(tt), taso(tt), paikka(1, tt), paikka(2, tt), paikka(3, tt)
NEXT tt
FOR tt = 1 TO 48
WRITE #1, seddd(tt), sedd(tt), sed(tt), valm(tt), tre(tt), sr(tt), x(tt), s(tt), p(tt), gf(tt), ga(tt), win(tt), dra(tt), los(tt), tox(tt), tautip(tt), tautik(tt), haln(tt), kausik(tt), ylek(tt), kotiot(tt), mo(tt)
FOR zz = 1 TO 3
WRITE #1, tkaus(zz, tt)
NEXT zz
FOR zz = 1 TO 5
WRITE #1, tsaav(zz, tt)
NEXT zz
FOR zz = 2 TO 7
WRITE #1, jaynax(zz, tt)
NEXT zz
FOR zz = 1 TO 4
WRITE #1, erik(zz, tt)
NEXT zz
FOR zz = 1 TO 10
WRITE #1, kunto(zz, tt)
NEXT zz
NEXT tt
FOR tt = 1 TO 20
WRITE #1, ex(tt), egf(tt), ega(tt), ep(tt), es(tt)
NEXT tt
FOR tt = 1 TO plkm
FOR zz = 1 TO 5
WRITE #1, valb(zz, tt)
NEXT zz
NEXT tt
FOR zz = 1 TO 64
WRITE #1, cup(zz)
NEXT zz
FOR tt = 1 TO 6
WRITE #1, elt(tt)
NEXT tt
FOR tt = 1 TO 30
WRITE #1, eri(tt)
NEXT tt
CLOSE #1
OPEN "savetus6.xxx" FOR OUTPUT AS #1
FOR tt = 1 TO 48 - plkm
FOR zz = 1 TO 3
WRITE #1, tauti(zz, tt), tkest(zz, tt)
NEXT zz
FOR zz = 1 TO 5
WRITE #1, top(tt, zz).nam, top(tt, zz).gls, top(tt, zz).ass, top(tt, zz).age, top(tt, zz).nat
NEXT zz
NEXT tt
FOR tt = 1 TO plkm
FOR zz = 1 TO 17
WRITE #1, skout(zz, tt)
NEXT zz
FOR zz = 1 TO 12
WRITE #1, veika(zz, tt)
NEXT zz
NEXT tt
CLOSE #1
OPEN "savetus7.xxx" FOR OUTPUT AS #1
FOR tt = 1 TO 48 + 6 + plkm
WRITE #1, mana(tt).nam, mana(tt).nat
FOR zz = 1 TO 6
WRITE #1, mtaito(zz, tt)
NEXT zz
NEXT tt
FOR tt = 1 TO 48
WRITE #1, man(tt)
NEXT tt
FOR tt = 1 TO 6
WRITE #1, rekord(tt).na, rekord(tt).jo, rekord(tt).ma, rekord(tt).sy, rekord(tt).pi
NEXT tt
FOR tt = 1 TO 3
WRITE #1, pisenj(tt), pisenp(tt), pisenohj(tt)
NEXT tt
CLOSE #1
OPEN "graf.xxx" FOR OUTPUT AS #1
FOR tt = 1 TO plkm
FOR zz = 1 TO 44
WRITE #1, graf(zz, tt)
NEXT zz
NEXT tt
CLOSE #1
CHDIR ".."
END SUB

SUB tarjousmaar (koo1%, koo2%, pienin&, isoin&)
tarjous = pienin&
COLOR 12
DO
LOCATE koo1%, koo2%: COLOR 7: PRINT CHR$(17); CHR$(16); CHR$(18); "  ";
COLOR 14: PRINT LTRIM$(STR$(tarjous)); "        ";
wnd 1
IF me$ = CHR$(0) + CHR$(72) THEN tarjous = tarjous + 10000
IF me$ = CHR$(0) + CHR$(80) THEN tarjous = tarjous - 10000
IF me$ = CHR$(0) + CHR$(75) THEN tarjous = tarjous - 100000
IF me$ = CHR$(0) + CHR$(77) THEN tarjous = tarjous + 100000

IF tarjous > 0 AND tarjous > isoin& THEN tarjous = isoin&
IF tarjous < pienin& THEN tarjous = pienin&

IF me$ = CHR$(13) THEN EXIT DO
LOOP
END SUB

FUNCTION tarka% (jez%)
IF tauti(jez%, tox(xx)) = 0 THEN tarka = 0 ELSE tarka = 1
END FUNCTION

SUB tarkistanhlc
tietos = 0
FOR xx = 1 TO 5
IF ohj(karki(xx)) = 0 THEN tietos = karki(xx): EXIT SUB
IF ohj(karki(xx)) <> 0 AND mukt(ohj(karki(xx))) = 1 THEN EXIT SUB
IF xx > 1 THEN
IF ohj(karki(xx)) <> 0 THEN
pv = ohj(karki(xx))
leq 4
wnd 2
IF me$ = "k" THEN mukt(pv) = 1: EXIT SUB
END IF
END IF
NEXT xx
END SUB

FUNCTION tarko% (t0%, t1%, t2%, t3%)

IF INT(100 * RND) + 1 < t3% + (mtaito(t1%, man(t0%)) * t2%) THEN
tarko = 1
ELSE
tarko = 0
END IF

END FUNCTION

SUB taut (jop, jupp%)
tautip(xx) = jop
tautik(xx) = jupp% + 1
END SUB

SUB teet (jup%, jupp%, juppp%)
tauti(jup%, tox(xx)) = jupp%
tkest(jup%, tox(xx)) = juppp% + 1
END SUB

SUB tmankom (sano%)
lt "tk", (sano% - 1) * 6 + INT(6 * RND) + 1
END SUB

SUB tremaar
FOR xx = 1 TO 48
IF valm(xx) = 1 THEN tre(xx) = .945 ELSE IF valm(xx) = 2 THEN tre(xx) = 1.055 ELSE tre(xx) = 1
IF valm(xx) <> 3 THEN
tre(xx) = tre(xx) + (mtaito(1, man(xx)) * .007)
END IF
NEXT xx
END SUB

SUB tulevatottelut
s = 1
kurso = 0
alastaro:
CLS
IF kurso = 1 THEN d = ki: c = 44: b = ki ELSE d = ekr: c = 6: b = ekr
COLOR 14
DO
haahaa 8
SELECT CASE kurso
CASE 0
LOCATE 1, 1
FOR xx = LBOUND(kiero) TO UBOUND(kiero)
xxx = xx + 10
IF xxx <= 40 THEN LOCATE xxx, 1 ELSE IF xxx <= 80 THEN LOCATE xxx - 40, 31 ELSE LOCATE xxx - 80, 61
SELECT CASE kiero(xx)
CASE 4, 99, 96, 97, 98, 41, 43, 45, 47, 48
COLOR 8
CASE 2, 22
IF muke(pv) = 1 THEN COLOR 7 ELSE COLOR 8
CASE 3
IF mukc(pv) = 1 THEN COLOR 7 ELSE COLOR 8
CASE ELSE
COLOR 7
END SELECT
IF kr = xx THEN COLOR 15, 0
SELECT CASE kiero(xx)
CASE 4, 99
PRINT "KESŽTAUKO";
CASE 1
PRINT "RUNKOSARJA";
CASE 2
PRINT "EHL";
CASE 3
PRINT "CUP";
CASE 96
PRINT "VAPAA VIIKONLOPPU";
CASE 97
PRINT "MAAJOUKKUETAUKO";
CASE 98
PRINT "JOULUTAUKO";
CASE 22
PRINT "EHL:N LOPPUTURNAUS";
CASE 41, 43, 45
PRINT "PLAYOFF-PLŽJŽYTYS";
CASE 42, 44, 46
PRINT "PLAY-OFFIT";
CASE 47
PRINT "JUHLAGAALA";
CASE 48
PRINT "KAUSI LOPPUU";
CASE ELSE
PRINT kiero(xx);
END SELECT
NEXT xx


CASE 1
IF kr < 68 THEN
COLOR 6: LOCATE 1, 60
PRINT "KIERROS "; LTRIM$(STR$(d)); "/44  "
COLOR 14
LOCATE 2, 60: PRINT STRING$(10, " ")
LOCATE 2, 60: IF d = ki THEN PRINT "(SEURAAVA)"
FOR qwe = 1 TO 4
kolo = jkolo(qwe)
IF qwe = 1 THEN LOCATE 3 ELSE IF qwe = 2 THEN LOCATE 12 ELSE IF qwe = 3 THEN LOCATE 21 ELSE LOCATE 30
FOR cupex = 1 TO 6
od(1) = x(fxt(cupex * 2 - 1, d) + (qwe - 1) * 12)
od(2) = x(fxt(cupex * 2, d) + (qwe - 1) * 12): ont 1
NEXT cupex
NEXT qwe
END IF
CASE 2
IF ekr < 7 THEN
COLOR 6: LOCATE 1, 60
PRINT "KIERROS "; LTRIM$(STR$(d)); "/6 "
COLOR 14
LOCATE 2, 60: PRINT STRING$(10, " ")
LOCATE 2, 60: IF d = ekr THEN PRINT "(SEURAAVA)"
LOCATE 2
kolo = 12
FOR qwe = 1 TO 5
PRINT
FOR cupex = 1 TO 2
od(1) = ex((efxt(d, cupex * 2 - 1)) + (qwe - 1) * 4)
od(2) = ex((efxt(d, cupex * 2)) + (qwe - 1) * 4)
ont 2
NEXT cupex
NEXT qwe
END IF
CASE 3
LOCATE 1, 1
IF cround > 0 AND cround < 7 THEN cupohjelma 0
IF cround = 0 THEN COLOR 15: PRINT "OTTELUPAREJA EI ARVOTTU"
END SELECT
wnd 1
ku 2, 0, 3
IF kusek <> kurso THEN GOTO alastaro
IF me$ = CHR$(0) + CHR$(72) AND d - 1 >= b THEN d = d - 1
IF me$ = CHR$(0) + CHR$(80) AND d + 1 <= c THEN d = d + 1
IF me$ = CHR$(27) THEN EXIT DO
LOOP
END SUB

SUB tulonsiirto
kurso = 1
DIM kenelle(1 TO plkm - 1) AS INTEGER
a = 1
FOR b = 1 TO plkm
IF pv <> b THEN
kenelle(a) = b: a = a + 1
END IF
NEXT b
raiskaus:
leq 37
haahaa 20
LOCATE 3, 1: PRINT "SALDO: ";
COLOR 14: PRINT LTRIM$(STR$(raha(pv)))
DO
FOR a = 1 TO plkm - 1
LOCATE 4 + (a * 2), 1
IF kurso = a THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT RTRIM$(l(u(kenelle(a)))); " ("; nimi(kenelle(a)); ")"
NEXT a
wnd 1
ku 1, 1, plkm - 1
IF me$ = CHR$(27) THEN ERASE kenelle: COLOR , 0: EXIT SUB
IF me$ = CHR$(13) THEN EXIT DO
LOOP
LOCATE 14, 1: COLOR 15, 0: PRINT "MŽŽRITŽ SIIRRETTŽVŽ SUMMA"
tarjousmaar 16, 2, 0, raha(pv)
raha(pv) = raha(pv) - tarjous
raha(kenelle(kurso)) = raha(kenelle(kurso)) + tarjous
GOTO raiskaus
END SUB

SUB turnaus
turnauz = 1
tkr = 1
FOR xx = 1 TO 6
tero(xx) = 0
tp(xx) = 0
NEXT xx
paluutul:
FOR xx = 1 TO 6
gl(tx(xx)) = 0
ja(tx(xx)) = 0
NEXT xx
IF naaturnaus = 1 THEN
CLS
COLOR 6
PRINT tnimi(1); ", "; LTRIM$(STR$(tkr)); ". KIERROS"
LOCATE 3
s = 1
kolo = 12
FOR cupex = 1 TO 3
od(1) = tx(tfxt(tkr, cupex * 2 - 1))
od(2) = tx(tfxt(tkr, cupex * 2))
ont 2
NEXT cupex
pjn
CLS
COLOR 6: PRINT "TULOKSET OVAT SEURAAVAT:": PRINT : kolo = 12
END IF
FOR cupex = 1 TO 3
nn1 = tfxt(tkr, cupex * 2 - 1)
od(1) = tx(tfxt(tkr, cupex * 2 - 1))
mm1 = tfxt(tkr, cupex * 2)
od(2) = tx(tfxt(tkr, cupex * 2))
ottpel
IF naaturnaus = 1 THEN ottul
otmuut 4
NEXT cupex
IF naaturnaus = 1 THEN
staulturmaar
LOCATE 15
pjn
END IF
tkr = tkr + 1
IF tkr < 6 THEN GOTO paluutul
CLS
COLOR 6
PRINT tnimi(1); ", LOPULLINEN TILANNE"
staulturmaar
LOCATE 9
pjn
turnauz = 0
END SUB

SUB tyytyma
borsinit 1
temp% = 0

indiana:
FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).svu = 0 AND pel(xx, pv).spe <> 13 THEN

IF pel(xx, pv).psk = 1 THEN b = 2 ELSE b = 1
a = valb(b, pv) + valb(4, pv) + valb(5, pv) * 2 - pel(xx, pv).psk

IF a <= -4 THEN

IF temp% = 0 THEN
leq 5
temp% = 1
END IF

lax 97
PRINT

IF lastbors < UBOUND(bel) THEN
bel(lastbors + 1) = pel(xx, pv)
bel(lastbors + 1).pok = 0
bel(lastbors + 1).neu = 1
lastbors = lastbors + 1
poispel
GOTO indiana
END IF
END IF
END IF

NEXT xx

IF temp% = 1 THEN pjn
aaaargh
borsinit 2
END SUB

SUB uusikausi
ppotti = 0
eri(30) = 0
eri(29) = 0
eri(28) = 0
ekr = 1
eot = 0
kr = -9
cround = 0
ki = 1
ot = 0
kausi = kausi + 1
FOR xx = 1 TO 48
mo(xx) = mtaito(4, man(xx))
tautip(xx) = 1
tautik(xx) = 0
ylek(xx) = 0
kotiot(xx) = 0
IF ohj(xx) <> 0 THEN valm(xx) = 0
tre(xx) = 1
gf(xx) = 0
ga(xx) = 0
p(xx) = 0
win(xx) = 0
dra(xx) = 0
los(xx) = 0
kausik(xx) = 0
FOR z = 1 TO 10
kunto(z, xx) = 0
NEXT z
NEXT xx
FOR pv = 1 TO plkm
IF sr(u(pv)) < 3 THEN infos(pv) = 1 ELSE infos(pv) = 2
IF laina(3, pv) = 0 AND mafia(pv) = 1 THEN
IF 100 * RND < 30 THEN mafia(pv) = 0
END IF
mukp(pv) = 0
muke(pv) = 0
mukt(pv) = 0
kuume(pv) = 0
inte(pv) = 1
jaynateh(pv) = 0
FOR xx = 1 TO 32
pel(xx, pv).inj = 0
pel(xx, pv).kun = 0
pel(xx, pv).plus = 0
pel(xx, pv).kest = 0
pel(xx, pv).pot = 0
NEXT xx
NEXT pv
nollaux
FOR z = 1 TO 3
FOR xx = 1 TO 48 - plkm
tauti(z, xx) = 0
tkest(z, xx) = 0
NEXT xx
NEXT z
euromaar
FOR xx = 1 TO 48
cup(xx) = xx
NEXT xx
FOR xx = 1 TO 16
cup(xx + 48) = 70 + xx
NEXT xx

xxx = 1
IF nokka = 1 OR nokka = 3 THEN a = 48: b = 1: c = -1 ELSE a = 1: b = 48: c = 1
FOR xx = a TO b STEP c
IF ohj(x(xx)) <> 0 THEN vuoro(xxx) = ohj(x(xx)): xxx = xxx + 1
NEXT xx

IF nokka = 3 THEN
FOR zz = 1 TO 50
xx = INT(plkm * RND) + 1
xxx = INT(plkm * RND) + 1
IF xx <> xxx THEN SWAP vuoro(xx), vuoro(xxx)
NEXT zz
END IF

END SUB

SUB uutisia
CLS
lax 128
LOCATE 3, 1

IF kiero(kr) = 1 THEN
FOR xx = 1 TO 48
IF ohj(xx) = 0 THEN
IF erik(3, xx) <> 0 THEN
IF 100 * RND < erik(3, xx) * 10 THEN
erik(3, xx) = 0
luz 25
potk xx
p(xx) = 0: gf(xx) = 0: ga(xx) = 20 * ot: win(xx) = 0: dra(xx) = 0: los(xx) = ot
FOR xxx = 1 TO 5
top(tox(xx), xxx).gls = 0
top(tox(xx), xxx).ass = 0
NEXT xxx
mor (xx), -55
END IF
END IF
END IF
NEXT xx
END IF


FOR xx = 1 TO 48

IF ohj(xx) = 0 AND erik(3, xx) <> 0 THEN
IF INT(100 * RND) + 1 < 40 THEN erik(3, xx) = 0
END IF

IF ot > 33 THEN
IF sr(xx) = 1 THEN a = 9 ELSE IF sr(xx) = 2 THEN a = 8 ELSE a = 7
IF ohj(xx) = 0 AND s(xx) > a AND erik(3, xx) = 0 THEN
IF 500 * RND < s(xx) THEN
IF INT(101 * RND) < s(xx) * 2 THEN erik(3, xx) = 2 ELSE erik(3, xx) = 1
END IF
END IF
END IF

NEXT xx

FOR a = 1 TO plkm
IF jaynax(5, a) = 1 AND ohj(vast(a)) = 0 THEN
jaynax(5, a) = 0
xx = vast(a)
muilutus 3
END IF
NEXT a

FOR xx = 1 TO 48
IF ohj(xx) = 0 AND jaynax(3, xx) = 1 THEN skandal
IF ohj(xx) = 0 AND jaynax(5, xx) = 1 THEN muilutus 1
IF ohj(xx) = 0 AND jaynax(4, xx) = 1 THEN muilutus 2
IF ohj(xx) = 0 AND jaynax(6, xx) = 1 THEN
luz 53
jaynax(6, xx) = 2
END IF
NEXT xx

IF verk% <> 0 THEN xx = verk%: luz 39: verk% = 0

FOR zzz = 1 TO 48
xx = x(zzz)
IF ohj(xx) = 0 THEN
IF 100 * RND < 6 THEN
z = INT(100 * RND) + 1
IF z < 10 THEN a = 1 ELSE IF z < 51 THEN a = 2 ELSE a = 3

IF tarka(a) = 0 THEN
lt "n", 64 + a
PRINT
IF a = 1 THEN b = -(INT(2 * RND) + 1) ELSE IF a = 2 THEN b = -(INT(5 * RND) + 1) ELSE b = -(INT(10 * RND) + 1)
teet a, b, INT(8 * RND) + 1
END IF
END IF
END IF
NEXT zzz

FOR zzz = 1 TO 2
dat% = INT(570 * RND) + 1

SELECT CASE dat%

CASE 1 TO 6
arpo 2
IF tarko(xx, 1, 20, 50) = 1 THEN
luz 1
taut 1.1, INT(6 * RND) + 6
ELSE
luz 2
taut .9, INT(6 * RND) + 6
IF tarko(xx, 5, 20, 50) = 0 THEN potk xx
END IF

CASE 7 TO 8
arpo 1
IF tarka(3) = 0 AND tarko(xx, 6, 20, 50) = 0 THEN
luz 3
teet 3, -10, INT(5 * RND) + 3
END IF

CASE 9
arpo 2
IF tarko(xx, 6, 20, 80) = 0 THEN taut .85, 1000: luz 4

CASE 10 TO 11
arpo 1
IF tarko(xx, 4, 20, 50) = 0 THEN mor xx, -55: luz 5

CASE 12 TO 13
arpol 1, 1, 33
IF lukka = 0 AND tautip(xx) = 1 THEN
IF tarko(xx, 4, 20, 50) = 0 THEN
taut .9, INT(7 * RND) + 4: mor xx, -10: luz 6
IF tarko(xx, 5, 20, 50) = 0 THEN potk xx
END IF
END IF

CASE 14
arpo 1
IF tarko(xx, 6, 20, 50) = 0 THEN tre(xx) = tre(xx) - .05: luz 7

CASE 15 TO 16
IF kiero2(kr) = 1 THEN
arpo 1
IF tarko(xx, 6, 15, 50) = 1 AND tarko(xx, 3, 20, 50) = 1 THEN hw(xx) = hw(xx) + INT(5 * RND) + 4: luz 8
END IF

CASE 17
IF kiero2(kr) = 1 THEN
arpo 1
IF tarko(xx, 6, 15, 50) = 1 AND tarko(xx, 3, 20, 50) = 1 THEN mw(xx) = mw(xx) + INT(2 * RND) + 1: luz 9
END IF

CASE 18 TO 19
IF kiero2(kr) = 1 THEN
arpo 1
IF tarko(xx, 6, 15, 50) = 1 AND tarko(xx, 3, 20, 50) = 1 THEN pw(xx) = pw(xx) + INT(3 * RND) + 2: luz 10
END IF

CASE 20 TO 21
IF kr > 13 AND kiero2(kr) = 1 THEN
arpol 1, 4, 11
IF lukka = 0 THEN
IF tarko(xx, 3, 30, 20) = 0 THEN
yy = xx
arpol 2, 3, 3
IF lukka = 0 THEN
IF tarko(xx, 3, 30, 20) = 1 THEN
luz 11
potk yy
IF mw(xx) < mw(yy) THEN
mw(xx) = mw(yy): mw(yy) = mw(yy) - (INT(2 * RND) + 1)
END IF
xxx = INT(4 * RND) + 3
pw(xx) = pw(xx) + xxx
pw(yy) = pw(yy) - xxx
xxx = INT(7 * RND) + 4
hw(xx) = hw(xx) + xxx
hw(yy) = hw(yy) - xxx
END IF
END IF
END IF
END IF
END IF

CASE 22 TO 24
arpo 1
IF tarko(xx, 4, 20, 50) = 1 THEN mor xx, 55: luz 12

CASE 25
arpol 1, 1, 34
IF lukka = 0 AND tautip(xx) = 1 AND tarko(xx, 4, 40, 100) = 0 THEN
taut .9, 1000
mor xx, -55
luz 13
potk xx
END IF

CASE 26 TO 27
arpol 1, 1, 30
IF lukka = 0 AND tarko(xx, 6, 20, 50) = 0 THEN pw(xx) = pw(xx) - INT(3 * RND) - 1: luz 14

CASE 28 TO 29
arpol 1, 1, 30
IF lukka = 0 AND tarko(xx, 6, 20, 50) = 0 THEN hw(xx) = hw(xx) - INT(5 * RND) - 2: luz 15

CASE 30 TO 31
arpo 2
IF tarko(xx, 6, 20, 50) = 0 THEN taut .85, INT(6 * RND) + 5: mor xx, -10: luz 16

CASE 31 TO 33
IF kiero2(kr) = 1 THEN
arpol 1, 1, 20
IF lukka = 0 AND tarko(xx, 6, 20, 50) = 1 THEN hw(xx) = hw(xx) + INT(3 * RND) + 2: luz 17
END IF

CASE 34 TO 35
IF kiero2(kr) = 1 THEN
arpol 1, 1, 26
IF lukka = 0 AND tarko(xx, 4, 20, 50) = 0 THEN hw(xx) = hw(xx) - INT(3 * RND) - 2: luz 18
END IF

CASE 36 TO 37
IF kiero2(kr) = 1 THEN
arpol 1, 1, 26
IF lukka = 0 AND tarko(xx, 4, 20, 50) = 0 THEN pw(xx) = pw(xx) - INT(2 * RND) - 2: luz 19
END IF

CASE 38
IF kiero2(kr) = 1 THEN
arpol 1, 1, 26
IF lukka = 0 AND tarko(xx, 4, 20, 50) = 0 THEN mw(xx) = mw(xx) - 1: luz 20
END IF

CASE 39 TO 40
arpo 2
luz 21
taut .8, INT(10 * RND) + 2
mor xx, -55
IF tarko(xx, 5, 30, 0) = 0 THEN potk xx

CASE 41 TO 43
IF kiero2(kr) = 1 THEN
arpo 1
IF tarko(xx, 3, 10, 50) = 1 THEN hw(xx) = hw(xx) + INT(4 * RND) + 1: luz 22
END IF

CASE 44 TO 45
arpol 1, 2, 30
IF lukka = 0 AND tautip(xx) = 1 THEN
IF tarko(xx, 4, 20, 50) = 1 THEN mor xx, 55: luz 23
END IF

CASE 46 TO 47
arpol 1, 1, 10
yy = xx
gore:
arpol 1, 1, 10
IF xx = yy THEN GOTO gore
luz 24
mor xx, -10
mor yy, -10
pw(xx) = pw(xx) - INT(1 * RND) - 1
pw(yy) = pw(yy) - INT(1 * RND) - 1
hw(xx) = hw(xx) - INT(1 * RND) - 2
hw(yy) = hw(yy) - INT(1 * RND) - 2
zz = yy
IF tarko(xx, 5, 20, 50) = 0 THEN potk xx
IF tarko(zz, 5, 20, 50) = 0 THEN potk zz

CASE 48 TO 50
arpo 1
IF tarko(xx, 5, 40, 80) = 0 THEN mor xx, -6: luz 26: potk xx

CASE 51 TO 53
arpo 2
luz 27
taut .93, INT(3 * RND) + 1

CASE 54 TO 60
arpo 2
IF tarko(xx, 6, 20, 50) = 0 THEN
taut .95, INT(5 * RND) + 2: luz 28
ELSE
taut 1.05, INT(6 * RND) + 3: luz 30
END IF

CASE 61
arpo 2
IF tarko(xx, 5, 15, 50) = 0 THEN luz 29: potk xx: mor xx, -55

CASE 62 TO 63
arpo 1
luz 31
pw(xx) = pw(xx) + INT(3 * RND) - 1
hw(xx) = hw(xx) + INT(5 * RND) - 2

CASE 64 TO 67
IF protu% = 0 THEN
d = INT(3 * RND) + 1
arpol d, 1, 1
yy = xx
hmm:
arpol d, 1, 1
IF xx = yy THEN GOTO hmm
luz 68
prot1% = xx
prot2% = yy
protu% = 1
END IF

CASE 68 TO 69
arpo 1
luz 32

CASE 70 TO 71
arpo 2
luz 33
taut .75, 1

CASE 72 TO 73
arpo 1
IF tarko(xx, 3, 20, 50) = 1 THEN
mor xx, 6
luz 69
ELSE
mor xx, -6
luz 34
IF tarko(xx, 5, 10, 90) = 0 THEN potk xx
END IF

CASE 74
arpo 1
skandal

CASE 75
arpo 1
IF tarko(xx, 6, 10, 50) = 0 THEN mor xx, -3: luz 36

CASE 76
arpo 1
IF tarko(xx, 6, 20, 50) = 0 THEN
luz 37
potk xx
mor xx, -5
ELSE
luz 70
IF tarko(xx, 5, 20, 50) = 0 THEN luz 71: potk xx
END IF


CASE 77 TO 80
arpo 1
luz 38
IF tarko(xx, 6, 20, 50) = 1 OR tautip(xx) <> 1 THEN
luz 72
ELSE
gnome = INT(4 * RND) + 1
taut .9, gnome
luz 73
END IF

CASE 81 TO 86
arpo 1
IF tarko(xx, 6, 20, 50) = 0 THEN luz 39 ELSE luz 40

CASE 87 TO 93
DIM vapaa(1 TO 54) AS INTEGER
FOR qwe = 1 TO 48
IF ohj(qwe) = 0 THEN vapaa(man(qwe)) = 1
NEXT qwe
suoli:
xx = INT(54 * RND) + 1
IF vapaa(xx) = 1 THEN GOTO suoli
ERASE vapaa
IF 100 * RND < 35 THEN luz 43 ELSE luz 41

CASE 94 TO 95
yy = INT(54 * RND) + 1
hmme:
xx = INT(54 * RND) + 1
IF xx = yy THEN GOTO hmme
luz 42

CASE 96 TO 97
arpo 1
luz 44

CASE 98 TO 103
arpo 1
IF tarko(xx, 5, 15, 50) = 1 THEN mor xx, 2: luz 45 ELSE mor xx, -2: luz 46


CASE 104
arpol 1, 1, 1
IF lukka = 0 THEN
IF tarko(xx, 5, 20, 50) = 1 THEN
luz 48
mor xx, 2
ELSE
luz 47
potk xx
mor xx, -5
END IF
END IF

CASE 105 TO 106
arpo 1
luz 49
IF tarko(xx, 5, 20, 50) = 1 THEN
luz 74
ELSE
luz 75
mor xx, -3
potk xx
END IF

CASE 107
arpo 1
luz 50
IF tarko(xx, 4, 20, 50) = 1 THEN
mor xx, 3
luz 76
ELSE
mor xx, -3
luz 77
IF tarko(xx, 5, 20, 20) = 0 THEN luz 78: potk xx
END IF

CASE 108
arpo 1
muilutus 1

CASE 109
arpo 1
muilutus 2

CASE 110 TO 114
arpo 1
jaynax(2, xx) = 1

CASE 115 TO 116
arpo 1
IF tarko(xx, 1, 20, 50) = 1 AND kiero2(kr) = 0 THEN
luz 55
tre(xx) = tre(xx) + .02
ELSE
luz 56
tre(xx) = tre(xx) - .02
END IF

CASE 117 TO 118
arpo 1
luz 57

CASE 119 TO 120
IF kiero2(kr) = 0 THEN
arpol 2, 1, 28
IF lukka = 0 THEN
luz 58
IF tarko(xx, 4, 20, 50) = 1 THEN
staulmaar
mor sijo(1, 12), -55
luz 79
ELSE
luz 80
END IF
END IF
END IF

CASE 121 TO 122
IF ohj(karki(1)) = 0 THEN
xx = karki(1)
luz 59
mor xx, INT(5 * RND) - 2
END IF

CASE 123
arpo 1
luz 60

CASE 124 TO 125
arpo 1
luz 61
IF tarko(xx, 5, 20, 50) = 1 THEN luz 81 ELSE luz 82

CASE 126 TO 127
arpo 1
luz 62
IF tarko(xx, 5, 20, 50) = 1 THEN luz 83 ELSE luz 84

CASE 128 TO 129
arpol 1, 1, 1
yy = xx
dulek:
arpol 1, 1, 1
IF xx = yy THEN GOTO dulek
luz 64
d = INT(2 * RND) + 1
LOCATE CSRLIN - 1, 1: COLOR 7
PRINT RTRIM$(top(tox(xx), d).nam);
COLOR 8: PRINT " <--> ";
COLOR 7: PRINT top(tox(yy), d).nam: PRINT
SWAP top(tox(xx), d), top(tox(yy), d)

CASE 130 TO 131
IF arvsulk = 0 THEN
luz 63
arvsulk = 1
END IF

CASE 132
xx = INT(24 * RND) + 1
jaynax(5, xx) = 1

CASE 133
xx = INT(24 * RND) + 1
jaynax(6, xx) = 1

CASE 134
xx = INT(24 * RND) + 1
jaynax(4, xx) = 1

CASE 135
xx = INT(24 * RND) + 1
jaynax(3, xx) = 1

CASE 136 TO 137
IF maajomin(9) = 13 THEN
maajomin(9) = maajomin(9) + 2
luz 85
ELSE
maajomin(9) = maajomin(9) - 2
luz 86
END IF

CASE 138 TO 139
IF maajomin(10) = 13 THEN
maajomin(10) = maajomin(10) + 2
luz 87
ELSE
maajomin(10) = maajomin(10) - 2
luz 88
END IF



END SELECT

NEXT zzz
IF CSRLIN = 3 THEN lay 28
pjn

IF protu% = 1 THEN xx = prot1%: xxx = prot2%: protu% = 0: protesti

END SUB

SUB valitsestrat
kurso = 1
aanusaukko:
leq 10
DO
FOR zz = 1 TO 3
LOCATE 2 + zz, 1
IF kurso = zz THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT valms(zz);
NEXT zz
COLOR , 0
klearstat 8
haahaa 27
LOCATE 8, 1: lax 12 + kurso
wnd 1
ku 1, 1, 3
IF me$ = "?" THEN qelp 27: GOTO aanusaukko
IF me$ = CHR$(27) THEN EXIT DO
LOOP
valm(u(pv)) = kurso
END SUB

SUB vastmaar
SELECT CASE kiero(kr)
CASE 1
FOR qwe = 1 TO 4
FOR cupex = 1 TO 6
IF u(pv) = x(fxt(cupex * 2 - 1, ki) + (qwe - 1) * 12) THEN vast(pv) = x(fxt(cupex * 2, ki) + (qwe - 1) * 12)
IF u(pv) = x(fxt(cupex * 2, ki) + (qwe - 1) * 12) THEN vast(pv) = x(fxt(cupex * 2 - 1, ki) + (qwe - 1) * 12)
NEXT cupex
NEXT qwe
CASE 2
IF muke(pv) <> 0 THEN
FOR qwe = 1 TO 5
FOR cupex = 1 TO 2
IF ex((efxt(ekr, cupex * 2 - 1)) + (qwe - 1) * 4) = u(pv) THEN vast(pv) = ex((efxt(ekr, cupex * 2)) + (qwe - 1) * 4)
IF ex((efxt(ekr, cupex * 2)) + (qwe - 1) * 4) = u(pv) THEN vast(pv) = ex((efxt(ekr, cupex * 2 - 1)) + (qwe - 1) * 4)
NEXT cupex
NEXT qwe
END IF
CASE 3
IF mukc(pv) <> 0 THEN
FOR cupex = 1 TO cupjouk(cround) / 2
IF cup(cupex * 2 - 1) = u(pv) THEN vast(pv) = cup(cupex * 2)
IF cup(cupex * 2) = u(pv) THEN vast(pv) = cup(cupex * 2 - 1)
NEXT cupex
END IF
CASE 42, 44, 46
IF mukp(pv) <> 0 THEN
FOR qwe = 1 TO 3
FOR cupex = 1 TO pep(qwe, pround).joukk / 2
IF plex(qwe, pfxt(pround, pkr, qwe, cupex * 2 - 1)) = u(pv) THEN vast(pv) = plex(qwe, pfxt(pround, pkr, qwe, cupex * 2))
IF plex(qwe, pfxt(pround, pkr, qwe, cupex * 2)) = u(pv) THEN vast(pv) = plex(qwe, pfxt(pround, pkr, qwe, cupex * 2 - 1))
NEXT cupex
NEXT qwe
END IF
END SELECT
END SUB

SUB vedonlyonti
kurso = 1
CLS
COLOR 6: PRINT "ARVAUKSEN SUPER-ISOVETO";
LOCATE 29, 1: COLOR 14: lax 47
haahaa 9
FOR zz = 1 TO 12
veika(zz, pv) = 1
NEXT zz
DO
FOR qwe = 1 TO 2
FOR cupex = 1 TO 6
zz = (qwe - 1) * 6 + cupex
LOCATE 1 + zz * 2, 1
COLOR jkolo(qwe), 0
PRINT l(x(fxt(cupex * 2 - 1, ki) + (qwe - 1) * 12)); " - "; l(x(fxt(cupex * 2, ki) + (qwe - 1) * 12));
LOCATE , 30
IF zz = kurso THEN COLOR 14, 6 ELSE COLOR 14, 0
IF veika(zz, pv) = 1 THEN PRINT "1";  ELSE IF veika(zz, pv) = 2 THEN PRINT "X";  ELSE PRINT "2";
NEXT cupex
NEXT qwe
COLOR , 0
wnd 1
ku 1, 1, 12
IF me$ = CHR$(0) + CHR$(75) AND veika(kurso, pv) > 1 THEN veika(kurso, pv) = veika(kurso, pv) - 1
IF me$ = CHR$(0) + CHR$(77) AND veika(kurso, pv) < 3 THEN veika(kurso, pv) = veika(kurso, pv) + 1
IF me$ = "i" THEN
FOR z = 1 TO 12
veika(z, pv) = INT(3 * RND) + 1
NEXT z
END IF
IF me$ = CHR$(27) THEN veika(1, pv) = 0: EXIT DO
IF me$ = CHR$(13) THEN EXIT DO
LOOP
EXIT SUB
END SUB

SUB veiktark
d = 0
FOR zz = 1 TO 12
IF tulos(zz) = veika(zz, pv) THEN d = d + 1
NEXT zz

LOCATE 30 + (2 * pv), 1: COLOR 14
colchk 1
PRINT nimi(pv);
COLOR 6: PRINT ", ";
COLOR 14: PRINT LTRIM$(STR$(d));
COLOR 6: PRINT " OIKEIN! VOITTOSUMMA: ";
COLOR 14
IF voittosumma(d) = 0 THEN PRINT "Ei voittoa" ELSE PRINT LTRIM$(STR$(voittosumma(d)))
rahna = voittosumma(d): rah
END SUB

SUB voimamaar
DIM htarko(1 TO 4) AS INTEGER
DIM ptarko(1 TO 3) AS INTEGER
a = 0: b = 0: c = 0: d = 0
gnome = 0

mw(u(pv)) = 0
pw(u(pv)) = 0
hw(u(pv)) = 0
yw(u(pv)) = 0
aw(u(pv)) = 0

FOR zz = 1 TO 4
IF zz < 4 THEN pketju(zz, pv) = 0
hketju(zz, pv) = 0
NEXT zz

FOR qwe = 1 TO 3
FOR cupex = 1 TO 2
IF ketju(cupex, qwe, pv) = 0 THEN ptarko(qwe) = 1
NEXT cupex
NEXT qwe

FOR qwe = 1 TO 4
FOR cupex = 3 TO 5
IF ketju(cupex, qwe, pv) = 0 THEN htarko(qwe) = 1
NEXT cupex
NEXT qwe

IF maa(1, pv) <> 0 THEN
ccc = maa(1, pv)
xxx = 1
GOSUB zzra
mw(u(pv)) = temp%
END IF

FOR qwe = 1 TO 3
IF ptarko(qwe) = 0 THEN
FOR cupex = 1 TO 2
ccc = ketju(cupex, qwe, pv)
xxx = 2
GOSUB zzra
pketju(qwe, pv) = pketju(qwe, pv) + temp%
NEXT cupex
END IF
NEXT qwe

FOR qwe = 1 TO 4
IF htarko(qwe) = 0 THEN
FOR cupex = 3 TO 5
ccc = ketju(cupex, qwe, pv)
xxx = cupex
GOSUB zzra
hketju(qwe, pv) = hketju(qwe, pv) + temp%
NEXT cupex
END IF
NEXT qwe

pw(u(pv)) = pketju(1, pv) + pketju(2, pv) + pketju(3, pv)
hw(u(pv)) = hketju(1, pv) + hketju(2, pv) + hketju(3, pv) + hketju(4, pv)

FOR qwe = 1 TO 5
IF ketju(qwe, 5, pv) = 0 THEN a = 1
NEXT qwe

FOR qwe = 1 TO 4
IF ketju(qwe, 6, pv) = 0 THEN b = 1
NEXT qwe

IF a = 1 THEN
IF htarko(1) = 1 OR ptarko(1) = 1 THEN a = 2
END IF

IF b = 1 THEN
IF htarko(1) = 1 OR ptarko(1) = 1 THEN b = 2
END IF

gnome = 1

IF a = 2 THEN yvpelaa(pv) = 0 ELSE IF a = 1 THEN yvpelaa(pv) = 1 ELSE yvpelaa(pv) = 5

IF a = 0 OR a = 1 THEN
IF a = 0 THEN cupex = 5 ELSE cupex = 1

FOR qwe = 1 TO 5
ccc = ketju(qwe, cupex, pv)
IF qwe < 3 THEN xxx = 2 ELSE xxx = qwe
GOSUB zzra
yw(u(pv)) = yw(u(pv)) + temp%
NEXT qwe

END IF


gnome = 2

IF b = 2 THEN avpelaa(pv) = 0 ELSE IF b = 1 THEN avpelaa(pv) = 1 ELSE avpelaa(pv) = 6

IF b = 0 OR b = 1 THEN
IF b = 0 THEN cupex = 6 ELSE cupex = 1

FOR qwe = 1 TO 4
ccc = ketju(qwe, cupex, pv)
IF qwe < 3 THEN xxx = 2 ELSE xxx = 6
GOSUB zzra
aw(u(pv)) = aw(u(pv)) + temp%
NEXT qwe
END IF

yw(u(pv)) = yw(u(pv)) * (1 + (mtaito(2, man(u(pv))) * .04))
aw(u(pv)) = aw(u(pv)) * (1 + (mtaito(2, man(u(pv))) * .04))

ERASE htarko, ptarko
EXIT SUB

zzra:
temp% = 0
temp% = pel(ccc, pv).psk + pel(ccc, pv).plus + erik(3, u(pv))
IF gnome = 1 THEN temp% = temp% + pel(ccc, pv).yvo
IF gnome = 2 THEN temp% = temp% + pel(ccc, pv).avo

SELECT CASE xxx
CASE 2
IF pel(ccc, pv).ppp <> 2 THEN temp% = FIX(.7 * temp%)
CASE 3, 4, 5
IF pel(ccc, pv).ppp <> xxx AND pel(ccc, pv).ppp = 2 THEN temp% = FIX(.7 * temp%)
IF pel(ccc, pv).ppp <> xxx AND pel(ccc, pv).ppp <> 2 THEN temp% = temp% - 1
CASE 6
IF pel(ccc, pv).ppp < 3 THEN temp% = FIX(.7 * temp%)
END SELECT
IF pel(ccc, pv).spe = 8 THEN temp% = CINT(.7 * temp%)
SELECT CASE pel(ccc, pv).kun
CASE -1
temp% = FIX(.9 * temp%)
CASE -2
temp% = FIX(.7 * temp%)
CASE -3
temp% = FIX(.5 * temp%)
CASE IS < -3
temp% = FIX(.3 * temp%)
END SELECT
IF temp% < 0 THEN temp% = 0
RETURN
END SUB

SUB wnd (ser%)
SELECT CASE ser%
CASE 1
me$ = "": WHILE me$ = "": me$ = INKEY$: WEND
CASE 2
me$ = "": DO UNTIL me$ = "k" OR me$ = "e": me$ = INKEY$: LOOP
END SELECT
END SUB

SUB xavier (fat%)
COLOR , 0
IF pirtar(6) <> 993 THEN SYSTEM
CLS
xx = sort(kurso)
SELECT CASE fat%
CASE 4
spx(2, pv) = spx(2, pv) - 1
pel(xx, pv).spe = pel(xx, pv).spe + 30000
lax 146
pjn
CASE 1
gnome = INT(6 * RND) + 7
SELECT CASE pel(xx, pv).inj
CASE 1 TO 999
lax 129
pel(xx, pv).inj = pel(xx, pv).inj + 5
CASE ELSE
a = INT(4 * RND)
lax 130 + a
IF a = 0 THEN pel(xx, pv).inj = gnome ELSE IF a = 2 OR a = 3 THEN pel(xx, pv).psk = pel(xx, pv).psk + (a - 1)
END SELECT
spx(1, pv) = spx(1, pv) - 1
IF pel(xx, pv).psk > 20 THEN pel(xx, pv).psk = 20
pjn

CASE 2
gnome = pel(xx, pv).kar
rahna = CLNG(gnome) ^ 1.5 * 4000
lax 201
wnd 2
PRINT
IF me$ = "k" THEN
raha(pv) = raha(pv) - rahna
IF gnome >= 10 THEN b = gnome * 4 ELSE b = 0
c = 100 * RND
IF c < b THEN gnome = gnome - INT(3 * RND) - 1: lax 202 ELSE gnome = gnome + INT(3 * RND) + 1: lax 203
IF gnome > 20 THEN gnome = 20
pel(xx, pv).kar = gnome
pel(xx, pv).inj = 1
pjn
END IF

CASE 3
rahna = 0
lay 35
LOCATE 3, 1: sivux = 1: printpel 8
LOCATE 5, 1
IF pel(xx, pv).svu > 0 AND pel(xx, pv).nhl <> 1 THEN
rahna = -(20 * pel(xx, pv).sra * pel(xx, pv).svu)
lay 62
END IF
LOCATE 7, 1
gnome = 0
IF xx = suosikki(1, 1, pv) OR xx = suosikki(1, 2, pv) OR xx = suosikki(1, 3, pv) THEN
gnome = 1
lax 214
PRINT
lentti 3, 10
PRINT
END IF

COLOR 6
IF pel(xx, pv).svu > 0 THEN lay 63 ELSE lay 64
wnd 2
IF me$ = "k" THEN
IF gnome = 1 THEN boikotti(pv) = boikotti(pv) + INT(8 * RND) + 5

rah
borsinit 1
IF lastbors < UBOUND(bel) THEN
bel(lastbors + 1) = pel(xx, pv)
bel(lastbors + 1).pok = 0
bel(lastbors + 1).neu = 1
lastbors = lastbors + 1
END IF
borsinit 2
poispel
END IF
END SELECT
END SUB

SUB ylmaar
DIM ylx(1 TO 10, 1 TO 2) AS LONG

SELECT CASE kiero(kr)

CASE 1
SELECT CASE sr(od(1))
CASE 1
ylx(1, 1) = (2000 * (1 + ((13 - (sed(od(1)) + sedd(od(1)) + seddd(od(1))) / 3)) * .04)) ^ (1 + (taso(od(1)) - 3) * .015)
IF ot <= 3 THEN ylx(2, 1) = 12 - sed(od(1)) ELSE ylx(2, 1) = 12 - s(od(1))
IF ot <= 3 THEN ylx(2, 2) = 12 - sed(od(2)) ELSE ylx(2, 2) = 12 - s(od(2))
CASE 2
ylx(1, 1) = (1000 * (1 + ((23 - (sed(od(1)) + sedd(od(1)) + seddd(od(1))) / 3)) * .04)) ^ (1 + (taso(od(1)) - 3) * .01)
IF ot <= 3 THEN ylx(2, 1) = 24 - sed(od(1)) ELSE ylx(2, 1) = 12 - s(od(1))
IF ot <= 3 THEN ylx(2, 2) = 24 - sed(od(2)) ELSE ylx(2, 2) = 12 - s(od(2))
CASE 3
ylx(1, 1) = (500 * (1 + ((52 - (sed(od(1)) + sedd(od(1)) + seddd(od(1))) / 3)) * .04)) ^ (1 + (taso(od(1)) - 3) * .01)
ylx(2, 1) = 12 - s(od(1))
END SELECT

IF ohj(od(1)) <> 0 THEN
ylx(1, 1) = ylx(1, 1) * (1 + ((avg(3, ohj(od(1))) - 10) / 50))
END IF

SELECT CASE sr(od(1))
CASE 1
ylx(3, 1) = ylx(1, 1) * (1 + (ylx(2, 1)) * .06)
CASE 2
ylx(3, 1) = ylx(1, 1) * (1 + (ylx(2, 1)) * .05)
CASE 3
ylx(3, 1) = ylx(1, 1) * (1 + (ylx(2, 1)) * .04)
END SELECT

SELECT CASE sr(od(1))
CASE 1
ylx(3, 1) = ylx(3, 1) * (1 + (ylx(2, 2) - 4) * .07)
CASE 2
ylx(3, 1) = ylx(3, 1) * (1 + (ylx(2, 2) - 6) * .06)
CASE 3
ylx(3, 1) = ylx(3, 1) * (1 + (ylx(2, 2) - 8) * .05)
END SELECT
ylx(4, 1) = .95 * ylx(3, 1) + (.1 * RND) * ylx(3, 1)
ylx(8, 1) = ylx(4, 1)

CASE 42, 44, 46
IF tempsr(od(1)) < sr(od(1)) THEN
ylx(1, 1) = (.7 + pround * .05) * (ylek(od(1)) / 22)
ELSE
ylx(1, 1) = (1 + pround * .2) * (ylek(od(1)) / 22)
END IF
ylx(8, 1) = .95 * ylx(1, 1) + (.1 * RND) * ylx(1, 1)

CASE 2
IF od(1) < 49 THEN
ylx(1, 1) = 1.15 * (ylek(od(1)) / kotiot(od(1)))
ELSE
ylx(1, 1) = (paikka(1, od(1)) * 100 + paikka(2, od(1)) * 100) * .95
END IF
ylx(8, 1) = .95 * ylx(1, 1) + (.1 * RND) * ylx(1, 1)

CASE 4
FOR c = 1 TO 2
IF od(c) < 49 THEN ylx(1, c) = sr(od(c)) ELSE IF od(c) < 66 THEN ylx(1, c) = 0 ELSE ylx(1, c) = 4
ylx(1, c) = 5 - ylx(1, c)
NEXT c
IF ylx(1, 1) = 1 THEN ylx(2, 1) = 20 ELSE IF ylx(1, 1) < 5 THEN ylx(2, 1) = kausik(od(1)) ELSE ylx(2, 1) = 3000
b = ylx(1, 2) - ylx(1, 1)
IF b > 0 THEN
IF od(1) < 49 THEN
ylx(2, 1) = ylx(2, 1) ^ (1 + b * (sr(od(1))) * .04)
ELSE
ylx(2, 1) = ylx(2, 1) ^ (1 + b * .04)
END IF
END IF
IF b < 0 THEN
IF od(1) < 49 THEN
ylx(2, 1) = ylx(2, 1) ^ (1 + b * (4 - sr(od(1))) * .04)
ELSE
ylx(2, 1) = ylx(2, 1) ^ (1 + b * .12)
END IF
END IF
IF b = 0 THEN
ylx(2, 1) = ylx(2, 1) * (1 + (13 - (s(od(2)))) * .015)
END IF
ylx(8, 1) = .95 * ylx(2, 1) + (.1 * RND) * ylx(2, 1)

CASE 3
IF od(1) < 49 THEN ylx(1, 1) = ylek(od(1)) / kotiot(od(1)) ELSE ylx(1, 1) = 100
ylx(1, 1) = ylx(1, 1) * (.85 + (cround * .15))

FOR c = 1 TO 2
IF od(c) < 49 THEN
ylx(2, c) = sr(od(c))
ELSE
ylx(2, c) = 4
END IF
NEXT c

SELECT CASE ylx(2, 1)
CASE IS > ylx(2, 2)
ylx(8, 1) = ((ylx(2, 1) - ylx(2, 2)) + 1) * ylx(1, 1)
CASE IS < ylx(2, 2)
ylx(8, 1) = ylx(1, 1) / ((ylx(2, 2) - ylx(2, 1)) + 1)
CASE ylx(2, 2)
ylx(8, 1) = ylx(1, 1)
END SELECT

ylx(8, 1) = .95 * ylx(8, 1) + (.1 * RND) * ylx(8, 1)

END SELECT

IF ohj(od(1)) <> 0 THEN
IF boikotti(ohj(od(1))) > 0 THEN ylx(8, 1) = ylx(8, 1) * .8
IF kuume(ohj(od(1))) = 1 THEN ylx(8, 1) = ylx(8, 1) * 1.2
END IF

IF kiero(kr) = 1 THEN
IF ylx(8, 1) > paikka(2, od(1)) * 100 - kausik(od(1)) THEN ylx(9, 1) = paikka(2, od(1)) * 100 - kausik(od(1)) ELSE ylx(9, 1) = ylx(8, 1)
ELSE
IF ylx(8, 1) > paikka(2, od(1)) * 100 THEN ylx(9, 1) = paikka(2, od(1)) * 100 ELSE ylx(9, 1) = ylx(8, 1)
END IF
ylx(10, 1) = ylx(8, 1) - ylx(9, 1)
IF kiero(kr) = 1 THEN
ylm(2, od(1)) = ylx(9, 1) + kausik(od(1))
ELSE
ylm(2, od(1)) = ylx(9, 1)
END IF
ylm(1, od(1)) = ylx(10, 1)
FOR c = 1 TO 2
IF ylm(c, od(1)) > paikka(c, od(1)) * 100 THEN ylm(c, od(1)) = paikka(c, od(1)) * 100
NEXT c
IF kiero(kr) = 1 THEN
ylek(od(1)) = ylek(od(1)) + ylm(1, od(1)) + ylm(2, od(1))
END IF
ERASE ylx
END SUB

SUB zreseasongala
DIM vsijo(1 TO 48, 1 TO 3) AS INTEGER
DIM vnume(1 TO 48, 1 TO 3) AS INTEGER
DIM ave(1 TO 48) AS SINGLE
DIM aves(1 TO 48) AS INTEGER
DIM aves2(1 TO 12) AS INTEGER
DIM suo(1 TO 48) AS INTEGER
FOR xx = 1 TO 48
FOR xxx = 1 TO 3
vsijo(xx, xxx) = 1
vnume(xx, xxx) = INT(3 * RND)
NEXT xxx
NEXT xx
FOR pv = 1 TO plkm
automa
voimamaar
NEXT pv
FOR qwe = 1 TO 3
IF qwe = 1 THEN a = 1: b = 12 ELSE IF qwe = 2 THEN a = 13: b = 24 ELSE a = 25: b = 48
FOR xx = a TO b - 1
FOR xxx = xx + 1 TO b
IF mw(x(xx)) >= mw(x(xxx)) THEN vsijo(x(xxx), 1) = vsijo(x(xxx), 1) + 1 ELSE vsijo(x(xx), 1) = vsijo(x(xx), 1) + 1
IF pw(x(xx)) >= pw(x(xxx)) THEN vsijo(x(xxx), 2) = vsijo(x(xxx), 2) + 1 ELSE vsijo(x(xx), 2) = vsijo(x(xx), 2) + 1
IF hw(x(xx)) >= hw(x(xxx)) THEN vsijo(x(xxx), 3) = vsijo(x(xxx), 3) + 1 ELSE vsijo(x(xx), 3) = vsijo(x(xx), 3) + 1
NEXT xxx
NEXT xx
NEXT qwe

FOR xx = 1 TO 48
aves(xx) = 1
ave(xx) = (vsijo(xx, 1) + vsijo(xx, 2) + vsijo(xx, 3)) / 3
NEXT xx

FOR xx = 1 TO 11
FOR xxx = xx + 1 TO 12
IF ave(x(xx)) <= ave(x(xxx)) THEN aves(x(xxx)) = aves(x(xxx)) + 1 ELSE aves(x(xx)) = aves(x(xx)) + 1
NEXT xxx
NEXT xx
FOR xx = 1 TO 12
aves2(aves(x(xx))) = x(xx)
NEXT xx
leq 24
lentti 1, 26
PRINT
lentti 2, 8
PRINT
lentti 1, 27
PRINT
lentti 3, 4
PRINT
lentti 3, 5
PRINT
lax 85

pjn

CLS
lentti 3, 6
PRINT
lentti 2, 9
PRINT
COLOR 6
PRINT "..."
PRINT
lentti 3, 7
PRINT
COLOR 31
PRINT STRING$(3, CHR$(14))
PRINT
lax 85
pjn

leq 25

kurso = 1
DO
FOR xx = 1 TO 48
IF xx < 13 THEN LOCATE 2 + xx, 1 ELSE IF xx < 25 THEN LOCATE 2 + xx - 12, 21 ELSE IF xx < 37 THEN LOCATE 2 + xx - 24, 41 ELSE LOCATE 2 + xx - 36, 61
IF kurso = xx THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT l(x(xx));
IF ohj(x(xx)) <> 0 THEN
ccc = ohj(x(xx)): colchk 4
COLOR , 0: PRINT " ("; LTRIM$(STR$(ohj(x(xx)))); ")";
END IF
NEXT xx
COLOR , 0
klearstat 17
haahaa 62
COLOR 6
LOCATE 17, 1: PRINT "MAALIVAHTIPELI"
LOCATE 22, 1: PRINT "PUOLUSTUSPELI"
LOCATE 27, 1: PRINT "HY™KKŽYSPELI"
FOR xx = 1 TO 3
SELECT CASE sr(x(kurso))
CASE 1, 2
IF vsijo(x(kurso), xx) < 2 THEN a = 1 ELSE IF vsijo(x(kurso), xx) < 4 THEN a = 2 ELSE IF vsijo(x(kurso), xx) < 7 THEN a = 3 ELSE IF vsijo(x(kurso), xx) < 10 THEN a = 4 ELSE IF vsijo(x(kurso), xx) < 12 THEN a = 5 ELSE a = 6
CASE 3
IF vsijo(x(kurso), xx) < 2 THEN a = 1 ELSE IF vsijo(x(kurso), xx) < 7 THEN a = 2 ELSE IF vsijo(x(kurso), xx) < 13 THEN a = 3 ELSE IF vsijo(x(kurso), xx) < 19 THEN a = 4 ELSE IF vsijo(x(kurso), xx) < 24 THEN a = 5 ELSE a = 6
END SELECT
LOCATE 18 + (xx - 1) * 5, 1
lt "ga", (xx - 1) * 18 + (a - 1) * 3 + vnume(x(kurso), xx) + 1
NEXT xx
COLOR , 0
wnd 1
ku 1, 1, 48

IF me$ = CHR$(0) + CHR$(75) AND kurso >= 13 THEN kurso = kurso - 12
IF me$ = CHR$(0) + CHR$(77) AND kurso <= 36 THEN kurso = kurso + 12

IF me$ = CHR$(13) THEN EXIT DO
LOOP
FOR xx = 1 TO 12
SELECT CASE ohj(x(xx))
CASE 0
a = INT(101 * RND)
IF a < 30 THEN suo(x(xx)) = x(xx) ELSE IF a < 60 THEN suo(x(xx)) = aves2(1) ELSE IF a < 85 THEN suo(x(xx)) = aves2(2) ELSE suo(x(xx)) = aves2(3)
CASE ELSE
CLS
kurso = 1
yy = x(xx)
COLOR 6: PRINT "(mainoskatkolla)"
haahaa 61
LOCATE 3, 1
lax 211
DO
FOR zz = 1 TO 12
LOCATE 5 + zz, 1
IF kurso = zz THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT l(x(zz))
NEXT zz
COLOR , 0
wnd 1
ku 1, 1, 12
IF me$ = CHR$(13) THEN EXIT DO
LOOP
suo(x(xx)) = x(kurso)
END SELECT
NEXT xx
CLS
lentti 3, 8
PRINT
lentti 2, 10
PRINT
FOR xx = 1 TO 12
COLOR 6
ccc = ohj(x(xx)): colchk 4
PRINT RTRIM$(mana(man(x(xx))).nam);
LOCATE , 25
PRINT "("; RTRIM$(l(x(xx))); ")";
COLOR 14
LOCATE , 40
ccc = ohj(suo(x(xx))): colchk 4
PRINT l(suo(x(xx)))
NEXT xx
PRINT
xx = x(INT(12 * RND) + 13)
lentti 3, 9
PRINT
COLOR 6: PRINT "...": PRINT
lentti 2, 11
PRINT
lentti 2, 12
pjn
ERASE vsijo, vnume, ave, aves, aves2, suo
END SUB


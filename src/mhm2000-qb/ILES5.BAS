DECLARE SUB remppa (rampa%)
DECLARE SUB tarjousmaar (koo1%, koo2%, pienin&, isoin&)
DECLARE SUB areena ()
DECLARE SUB kuva (tied$)
DECLARE SUB leq (fat%)
DECLARE SUB organisaatio ()
DECLARE SUB lax (fat%)
DECLARE SUB lay (fat%)
DECLARE SUB klearstat (fat%)
DECLARE SUB pjn ()
DECLARE SUB ku (kuz%, ku1%, ku2%)
DECLARE SUB qelp (qel%)
DECLARE SUB wnd (ser%)
DECLARE SUB colchk (colre%)
DECLARE SUB haahaa (haha%)
DECLARE SUB lt (lue$, lukux%)
DECLARE SUB statistiikka ()
'$DYNAMIC
'$INCLUDE: 'mhm2k.bi'

IF ensintoinen = 0 THEN CHAIN "mhm2k"
ver$ = "1.2 REKISTER™ITY"
IF ver1 <> ver$ THEN CLS : COLOR 15, 0: PRINT "YHTEENSOPIMATTOMAT VERSIOT!": SYSTEM

IF chainahdus = 1 THEN statistiikka
IF chainahdus = 2 THEN areena
CHAIN "ilex5"

REM $STATIC
SUB areena
kurso = 1
areenalku:
CLS : COLOR 6
PRINT "JŽŽHALLI: ";
COLOR 15
PRINT haln(u(pv))
haahaa 4
LOCATE 1, 41
COLOR 15
PRINT RTRIM$(l(u(pv))); " (";
PRINT nimi(pv); ")"
PRINT
LOCATE , 41
COLOR 6: PRINT "SALDO: ";
COLOR 14: PRINT LTRIM$(STR$(raha(pv)))
LOCATE , 41
COLOR 6: PRINT "POTTI: ";
COLOR 14: PRINT LTRIM$(STR$(potti(pv)))
LOCATE , 41: COLOR 7: PRINT "ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ"
LOCATE , 41
COLOR 6: PRINT " YHT.: ";
COLOR 14: PRINT LTRIM$(STR$(raha(pv) + potti(pv)))
LOCATE 3, 1
COLOR 6
PRINT "VIIHTYISYYSTASO: ";
COLOR 14
PRINT LTRIM$(STR$(taso(u(pv)))); "/6"
PRINT
FOR qwe = 1 TO 2
COLOR 6
LOCATE , 16 - LEN(paiknim(qwe))
PRINT paiknim(qwe); ": ";
COLOR 14: PRINT LTRIM$(STR$(CLNG(paikka(qwe, u(pv))) * 100))
NEXT qwe
COLOR 6
LOCATE , 16 - LEN(paiknim(3))
PRINT paiknim(3); ": ";
COLOR 14: IF paikka(3, u(pv)) = 1 THEN PRINT "KYLLŽ" ELSE PRINT "EI"

DO
FOR qwe = 1 TO 3
LOCATE 9 + qwe, 1
IF kurso = qwe THEN COLOR , 6 ELSE COLOR , 0
IF qwe > 1 AND uhatapa(pv) <> 0 THEN COLOR 8 ELSE COLOR 14
lay 130 + qwe
NEXT qwe
COLOR , 0
IF uhatapa(pv) <> 0 THEN
LOCATE 18, 1
COLOR 15: PRINT "RAKENNUSPROSESSIN TILANNEKATSAUS:"
PRINT
SELECT CASE uhatapa(pv)
CASE 10 TO 100
lay 138 + arkkitehti(pv)
lax 159
CASE 1000 TO 1999
rahna = mpv(pv)
gnome = uhatapa(pv) - 999
IF potti(pv) >= rahna THEN lay 135 + rakennuttaja(pv): lax 163 ELSE lax 164
CASE 2000 TO 2999
rahna = mpv(pv)
gnome = uhatapa(pv) - 1999
IF potti(pv) >= rahna THEN lay 135 + rakennuttaja(pv): lax 167 ELSE lax 168
END SELECT
END IF
wnd 1
IF me$ = "?" THEN qelp (4): GOTO areenalku
ku 1, 1, 3
IF me$ = CHR$(13) THEN EXIT DO
IF me$ = CHR$(27) THEN EXIT SUB
LOOP
SELECT CASE kurso
CASE 1
LOCATE 14, 1: COLOR 15: PRINT "MŽŽRITŽ POTTIIN SIIRRETTŽVŽ SUMMA"
tarjousmaar 16, 1, 0, raha(pv)
potti(pv) = potti(pv) + tarjous
raha(pv) = raha(pv) - tarjous
GOTO areenalku
CASE 2, 3
IF uhatapa(pv) = 0 THEN remppa kurso - 1
GOTO areenalku
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

SUB haahaa (haha%)
COLOR 7, 0
IF haha% = 1 AND lukka = 1 THEN
LOCATE 42, 7
IF pel(sort(kurso), pv).kar < 17 THEN PRINT "K:PLASTIIKKAKIRURGI  ";
IF spx(2, pv) > 0 THEN PRINT "Z:ZOMBIPULVERI  ";
END IF
LOCATE 43, 1
SELECT CASE haha%
CASE 1, 2, 6, 7, 9, 10, 11, 14, 15, 16, 20, 13, 77, 8, 56, 46, 23, 71, 62
PRINT CHR$(17); CHR$(16); CHR$(18);
CASE 3, 5, 33, 27, 66, 61
PRINT CHR$(18);
IF haha% = 3 AND plkm > 1 THEN PRINT CHR$(17); CHR$(16);
CASE 12, 21
PRINT CHR$(17); CHR$(16);
END SELECT
SELECT CASE haha%
CASE 1, 2, 3, 4, 5, 6, 7, 10, 11, 16, 33, 27, 77, 49, 26, 46, 13, 23, 56
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
FOR qwe = 1 TO 3
IF kurso = qwe THEN COLOR 14, 6 ELSE COLOR 14, 0
IF qwe = 1 THEN PRINT "RUNKOSARJAT";  ELSE IF qwe = 2 THEN PRINT "EHL";  ELSE PRINT "PEKKALANDIAN CUP";
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

SUB klearstat (fat%)
FOR zzz = fat% TO 43
LOCATE zzz, 1: PRINT STRING$(80, " ");
NEXT zzz
LOCATE fat%, 1
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

SUB lax (fat%)
lt "x", fat%
END SUB

SUB lay (fat%)
lt "y", fat%
END SUB

SUB leq (fat%)
CLS
lt "q", fat%
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

SUB pjn
LOCATE 43, 1
COLOR 14: PRINT "PAINA JOTAKIN NŽPPŽINTŽ...";
WHILE INKEY$ = "": WEND
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

SUB remppa (rampa%)
d = kurso
kurso = 1
arkkitehti(pv) = 1
rakennuttaja(pv) = 1
uppiste(pv) = ppiste(u(pv))
utaso(pv) = taso(u(pv))
FOR cupex = 1 TO 3
upaikka(cupex, pv) = paikka(cupex, u(pv))
NEXT cupex

remppareiska:
CLS
COLOR 6
IF rampa% = 1 THEN PRINT "HALLIREMONTTI" ELSE PRINT "UUDEN HALLIN SUUNNITTELU"
PRINT
COLOR 15
PRINT "UUSI TILANNE                 NYKYINEN TILANNE"
IF rampa% = 2 THEN LOCATE 15, 1: PRINT "ARKKITEHTI"
LOCATE 15, 40
PRINT "RAKENNUTTAJA"
LOCATE 21, 10
COLOR 6
PRINT "POTTI: ";
COLOR 14: PRINT LTRIM$(STR$(potti(pv)))
LOCATE 5, 33: COLOR 14
PRINT "TILAPISTEITŽ: ";
COLOR 10: PRINT LTRIM$(STR$(ppiste(u(pv))))
PRINT
PRINT
LOCATE , 30
COLOR 14
PRINT "VIIHTYISYYSTASO: ";
COLOR 10
PRINT LTRIM$(STR$(taso(u(pv)))); "/6"
PRINT
FOR qwe = 1 TO 2
COLOR 14
LOCATE , 45 - LEN(paiknim(qwe))
PRINT paiknim(qwe); ": ";
COLOR 10: PRINT LTRIM$(STR$(CLNG(paikka(qwe, u(pv))) * 100))
NEXT qwe
COLOR 14
LOCATE , 45 - LEN(paiknim(3))
PRINT paiknim(3); ": ";
COLOR 10: IF paikka(3, u(pv)) = 1 THEN PRINT "KYLLŽ" ELSE PRINT "EI"

DO
gnome = 0
FOR xx = 1 TO 3
IF tila(xx, utaso(pv)) = -1 THEN upaikka(xx, pv) = 0
IF xx < 3 THEN gnome = gnome + upaikka(xx, pv) * tila(xx, utaso(pv))
IF xx = 3 THEN
IF upaikka(3, pv) = 1 THEN gnome = gnome * 1.2
END IF
NEXT xx
gnome = uppiste(pv) - gnome
LOCATE 5, 1
COLOR 14
IF kurso = 1 THEN COLOR , 6 ELSE COLOR , 0
PRINT "   TILAPISTEITŽ: ";
COLOR 10, 0: PRINT LTRIM$(STR$(uppiste(pv))); "  "
COLOR 14, 0
PRINT "        VAPAANA: ";
IF gnome < 0 THEN COLOR 2 ELSE COLOR 10
PRINT LTRIM$(STR$(gnome)); "    "
COLOR 14
PRINT
IF kurso = 2 THEN COLOR , 6 ELSE COLOR , 0
PRINT "VIIHTYISYYSTASO: ";
COLOR 10, 0
PRINT LTRIM$(STR$(utaso(pv))); "/6"
PRINT
FOR qwe = 1 TO 2
IF kurso = 2 + qwe THEN COLOR , 6 ELSE COLOR , 0
COLOR 14
LOCATE , 16 - LEN(paiknim(qwe))
PRINT paiknim(qwe); ": ";
COLOR 10, 0: IF qwe = 3 THEN PRINT LTRIM$(STR$(upaikka(qwe, pv))); "   " ELSE PRINT LTRIM$(STR$(CLNG(upaikka(qwe, pv)) * 100)); "   "
NEXT qwe
IF kurso = 5 THEN COLOR , 6 ELSE COLOR , 0
COLOR 14
LOCATE , 16 - LEN(paiknim(3))
PRINT paiknim(3); ": ";
COLOR 10, 0: IF upaikka(3, pv) = 1 THEN PRINT "KYLLŽ" ELSE PRINT "EI   "

FOR qwe = 1 TO 3
IF rampa% = 2 THEN
LOCATE 16 + qwe, 1
IF arkkitehti(pv) = qwe THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT CHR$(qwe + 96); ": ";
lay 138 + qwe
END IF
LOCATE 16 + qwe, 40
IF rakennuttaja(pv) = qwe THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT LTRIM$(STR$(qwe)); ": ";
lay 135 + qwe
NEXT qwe
LOCATE 22, 1
COLOR 6, 0
PRINT "KUSTANNUSARVIO: ";
IF rampa% = 1 THEN rahna = (CLNG(uppiste(pv) - ppiste(u(pv)))) * ppmaksu(1) ELSE rahna = CLNG(uppiste(pv)) * ppmaksu(rampa%)
IF rampa% = 2 THEN
rahna = rahna * (.9 + (arkkitehti(pv) * .05))
END IF
IF rampa% = 1 THEN
rahna = rahna + (1000 * CLNG(uppiste(pv)))
END IF
rahna = rahna * (.9 + (rakennuttaja(pv) * .05))

IF rahna * .2 > potti(pv) THEN COLOR 2 ELSE COLOR 10
PRINT LTRIM$(STR$(rahna)); "          "
klearstat 43
haahaa 77
wnd 1
IF me$ = "a" OR me$ = "b" OR me$ = "c" THEN
arkkitehti(pv) = ASC(me$) - 96
END IF
IF me$ = "1" OR me$ = "2" OR me$ = "3" THEN
rakennuttaja(pv) = VAL(me$)
END IF
ku 1, 1, 5
IF me$ = "+" AND kurso = 1 THEN uppiste(pv) = uppiste(pv) + 10
IF me$ = "-" AND kurso = 1 THEN uppiste(pv) = uppiste(pv) - 10
IF me$ = CHR$(0) + CHR$(75) THEN
SELECT CASE kurso
CASE 1
IF uppiste(pv) > ppiste(u(pv)) THEN uppiste(pv) = uppiste(pv) - 1
CASE 2
IF rampa% = 1 THEN temp% = taso(u(pv)) ELSE temp% = 1
IF utaso(pv) > temp% THEN utaso(pv) = utaso(pv) - 1
CASE 3 TO 5
IF kurso <> 5 THEN
IF rampa% = 2 THEN temp% = 1 ELSE temp% = paikka(kurso - 2, u(pv))
ELSE
IF rampa% = 2 THEN temp% = 0 ELSE temp% = paikka(kurso - 2, u(pv))
END IF

IF upaikka(kurso - 2, pv) > temp% THEN upaikka(kurso - 2, pv) = upaikka(kurso - 2, pv) - 1
END SELECT
END IF

IF rampa% = 1 THEN temp% = ppiste(u(pv)) ELSE temp% = 0
IF uppiste(pv) < temp% THEN uppiste(pv) = ppiste(u(pv))

IF me$ = CHR$(0) + CHR$(77) THEN
SELECT CASE kurso
CASE 1
uppiste(pv) = uppiste(pv) + 1
CASE 2
IF utaso(pv) < 6 THEN utaso(pv) = utaso(pv) + 1
CASE 3 TO 5
IF kurso - 2 < 3 THEN temp% = 300 ELSE temp% = 1

IF upaikka(kurso - 2, pv) < temp% THEN upaikka(kurso - 2, pv) = upaikka(kurso - 2, pv) + 1
END SELECT
END IF
IF rampa% = 1 THEN
IF uppiste(pv) > CINT(1.1 * ppiste(u(pv))) THEN uppiste(pv) = CINT(1.1 * ppiste(u(pv)))
END IF
IF me$ = CHR$(27) THEN kurso = 1: EXIT SUB

IF rampa% = 1 THEN temp% = ppiste(u(pv)) ELSE temp% = 20
IF me$ = CHR$(13) AND potti(pv) >= .2 * rahna AND uppiste(pv) > temp% AND gnome >= 0 THEN EXIT DO
IF me$ = "?" THEN qelp 22: GOTO remppareiska
LOOP

klearstat 43
LOCATE 43, 1: lay 25
wnd 2

IF me$ = "e" THEN GOTO remppareiska

SELECT CASE rampa%
CASE 1
IF rakennuttaja(pv) = 1 THEN uhatapa(pv) = 2030 ELSE IF rakennuttaja(pv) = 2 THEN uhatapa(pv) = 2025 ELSE uhatapa(pv) = 2020
mpv(pv) = CLNG(rahna / (uhatapa(pv) - 2000))
CASE 2
uhatapa(pv) = 10
mpv(pv) = rahna
END SELECT
kurso = d
END SUB

SUB statistiikka
DIM mital(1 TO 6) AS INTEGER, hassu(1 TO 6) AS INTEGER
DIM msij(1 TO 48) AS INTEGER
DIM msij2(1 TO 48) AS INTEGER
DIM tgraf(1 TO 44) AS INTEGER
DIM mmsij(1 TO 17) AS INTEGER
DIM mmsij2(1 TO 17) AS INTEGER
FOR xx = 1 TO 48
msij(xx) = 1
IF xx < 18 THEN mmsij(xx) = 1
NEXT xx
FOR xx = 1 TO 47
FOR xxx = xx + 1 TO 48
SELECT CASE tsaav(1, x(xx))
CASE IS > tsaav(1, x(xxx))
msij(x(xxx)) = msij(x(xxx)) + 1
CASE IS < tsaav(1, x(xxx))
msij(x(xx)) = msij(x(xx)) + 1
CASE tsaav(1, x(xxx))
SELECT CASE tsaav(2, x(xx))
CASE IS > tsaav(2, x(xxx))
msij(x(xxx)) = msij(x(xxx)) + 1
CASE IS < tsaav(2, x(xxx))
msij(x(xx)) = msij(x(xx)) + 1
CASE tsaav(2, x(xxx))
SELECT CASE tsaav(3, x(xx))
CASE IS > tsaav(3, x(xxx))
msij(x(xxx)) = msij(x(xxx)) + 1
CASE IS < tsaav(3, x(xxx))
msij(x(xx)) = msij(x(xx)) + 1
CASE tsaav(3, x(xxx))
SELECT CASE tkaus(1, x(xx))
CASE IS > tkaus(1, x(xxx))
msij(x(xxx)) = msij(x(xxx)) + 1
CASE IS < tkaus(1, x(xxx))
msij(x(xx)) = msij(x(xx)) + 1
CASE tkaus(1, x(xxx))
SELECT CASE tkaus(2, x(xx))
CASE IS >= tkaus(2, x(xxx))
msij(x(xxx)) = msij(x(xxx)) + 1
CASE IS < tkaus(2, x(xxx))
msij(x(xx)) = msij(x(xx)) + 1
END SELECT
END SELECT
END SELECT
END SELECT
END SELECT
NEXT xxx
NEXT xx
FOR xx = 1 TO 16
FOR xxx = xx + 1 TO 17
SELECT CASE mmitali(1, xx)
CASE IS > mmitali(1, xxx)
mmsij(xxx) = mmsij(xxx) + 1
CASE IS < mmitali(1, xxx)
mmsij(xx) = mmsij(xx) + 1
CASE mmitali(1, xxx)
SELECT CASE mmitali(2, xx)
CASE IS > mmitali(2, xxx)
mmsij(xxx) = mmsij(xxx) + 1
CASE IS < mmitali(2, xxx)
mmsij(xx) = mmsij(xx) + 1
CASE mmitali(2, xxx)
SELECT CASE mmitali(3, xx)
CASE IS > mmitali(3, xxx)
mmsij(xxx) = mmsij(xxx) + 1
CASE IS < mmitali(3, xxx)
mmsij(xx) = mmsij(xx) + 1
CASE mmitali(3, xxx)
IF mmsarja(xxx) < mmsarja(xx) THEN mmsij(xx) = mmsij(xx) + 1 ELSE mmsij(xxx) = mmsij(xxx) + 1
END SELECT
END SELECT
END SELECT
NEXT xxx
NEXT xx
FOR xx = 1 TO 48
IF ohj(x(xx)) = pv THEN kurso = xx
msij2(msij(xx)) = xx
IF xx < 18 THEN mmsij2(mmsij(xx)) = xx
NEXT xx

CLS
IF kausi = 1999 THEN d = 9 ELSE d = 12
curso = 1
a = 1
oldkurso = kausi - 1
c = 0
alasta:
LOCATE 1, 1
IF krapu(pv) = 2 THEN curso = INT(9 * RND) + 1
FOR z = 1 TO d
IF z = 8 THEN LOCATE 2, 1
IF curso = z THEN COLOR , 15 ELSE COLOR , 0
lt "st", z
COLOR , 0: PRINT "  ";
NEXT z
LOCATE 4, 1
SELECT CASE curso
CASE 1
GOSUB henkkoht
CASE 2
GOSUB personal
CASE 4
GOSUB mitalit
CASE 5
GOSUB prorele
CASE 7
GOSUB rekordholders
CASE 8
GOSUB maraton
CASE 9
GOSUB mmaraton
CASE IS > 9
GOSUB pistepvoit
END SELECT
DO
haahaa 11
COLOR , 0
IF curso = 3 THEN GOSUB omjouk
IF curso = 6 THEN GOSUB runkos
wnd 1
IF me$ = "?" THEN qelp (11): CLS : GOTO alasta
IF curso = 3 THEN
ku 1, 1, 48
END IF
IF curso = 6 AND kausi > 1999 THEN
IF me$ = CHR$(0) + CHR$(72) AND oldkurso > 1999 THEN oldkurso = oldkurso - 1
IF me$ = CHR$(0) + CHR$(80) AND oldkurso < kausi - 1 THEN oldkurso = oldkurso + 1
END IF
IF curso = 8 THEN
IF me$ = CHR$(0) + CHR$(72) AND a > 1 THEN a = a - 1: GOTO alasta
IF me$ = CHR$(0) + CHR$(80) AND a < 15 THEN a = a + 1: GOTO alasta
END IF
IF curso > 8 THEN
IF me$ = CHR$(0) + CHR$(72) AND c = 1 THEN c = 0: GOTO alasta
IF me$ = CHR$(0) + CHR$(80) AND c = 0 THEN c = 1: GOTO alasta
END IF
ku 4, 1, d
IF curso <> kusek THEN CLS : GOTO alasta
IF me$ = CHR$(27) THEN EXIT DO
LOOP
ERASE mital, hassu, msij, msij2, tgraf
EXIT SUB
henkkoht:
colchk 1
LOCATE 4, 1
PRINT nimi(pv); " (";
PRINT kansal(mana(man(u(pv))).nat); ")"
COLOR 15
LOCATE 6, 1: PRINT "OTTELUT (RS/PF)"
LOCATE 6, 41: PRINT "SAAVUTUKSET"
LOCATE 16, 41: PRINT "PERSOONA"
LOCATE 8, 1
FOR qwe = 1 TO 3
COLOR 6
PRINT taulux(qwe); " ";
COLOR 14
PRINT otte(qwe, 1, pv); "/"; otte(qwe, 2, pv)
PRINT
FOR cupex = 1 TO 3
COLOR 6
IF cupex = 1 THEN PRINT " VOITTOJA";  ELSE IF cupex = 2 THEN PRINT " TASAPELEJŽ";  ELSE PRINT " TAPPIOITA";
COLOR 14
LOCATE , 14
PRINT LTRIM$(STR$(vsaldo(qwe, cupex, pv)))
NEXT cupex
PRINT
COLOR 6
PRINT " VOITTOPROSENTTI: ";
COLOR 14
IF otte(qwe, 1, pv) = 0 THEN PRINT "-" ELSE PRINT USING "##.#"; ((1 * vsaldo(qwe, 1, pv)) + (.5 * vsaldo(qwe, 2, pv))) / otte(qwe, 1, pv) * 100
PRINT
NEXT qwe
COLOR 6: PRINT "EHL-OTTELUT: ";
COLOR 14: PRINT LTRIM$(STR$(otte(4, 1, pv)))
PRINT
COLOR 6: PRINT " LOPPUTURNAUKSIA: ";
COLOR 14: PRINT LTRIM$(STR$(otte(4, 2, pv)))


FOR xx = 1 TO 7
LOCATE 7 + xx, 41
COLOR 6
PRINT saavtext(xx);
COLOR 14
LOCATE , 59
PRINT LTRIM$(STR$(saav(xx, pv)))
NEXT xx
FOR xx = 1 TO 6
LOCATE 17 + xx, 41
COLOR 6: PRINT mtnimi(xx);
LOCATE , 59
COLOR 14
IF mtaito(xx, man(u(pv))) < 0 THEN PRINT mtaito(xx, man(u(pv))) ELSE IF mtaito(xx, man(u(pv))) = 0 THEN PRINT "ñ0";  ELSE PRINT "+"; LTRIM$(STR$(mtaito(xx, man(u(pv)))))
NEXT xx
RETURN
omjouk:
klearstat 4
haahaa 11
COLOR 14
FOR qwe = 1 TO 4
FOR cupex = 1 TO 12
LOCATE 29 + cupex, 1 + (qwe - 1) * 14
xx = (qwe - 1) * 12 + cupex
IF kurso = xx THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT RTRIM$(l(x(xx)));
NEXT cupex
NEXT qwe
COLOR 15, 0
LOCATE 4, 1: PRINT "KAUDET SARJATASOILLA"
LOCATE 10, 1: PRINT "SAAVUTUKSET"
LOCATE 4, 41: PRINT "YLEISTŽ"
LOCATE 10, 41: PRINT "HALLI ("; haln(x(kurso)); ")"
FOR xx = 1 TO 3
LOCATE 5 + xx, 1
COLOR 6
PRINT taulux(xx);
COLOR 14: LOCATE , 13
PRINT LTRIM$(STR$(tkaus(xx, x(kurso))));
NEXT xx
FOR xx = 1 TO 5
COLOR 6
LOCATE 11 + xx, 1
IF xx < 5 THEN PRINT saavtext(xx);  ELSE PRINT saavtext(7);
COLOR 14
LOCATE , 19
PRINT LTRIM$(STR$(tsaav(xx, x(kurso))))
NEXT xx
LOCATE 6, 41
COLOR 6
PRINT "KOTIKAUPUNKI: ";
COLOR 14
PRINT kk(x(kurso))
LOCATE 8, 41
COLOR 6
PRINT "MANAGERI: ";
COLOR 14
PRINT RTRIM$(mana(man(x(kurso))).nam); " ("; kansal(mana(man(x(kurso))).nat); ")"
LOCATE 12, 41
COLOR 6
PRINT "VIIHTYISYYSTASO  ";
COLOR 14
PRINT LTRIM$(STR$(taso(x(kurso)))); "/6"
FOR qwe = 1 TO 2
COLOR 6
LOCATE , 41: PRINT paiknim(qwe);
LOCATE , 58
COLOR 14: PRINT LTRIM$(STR$(CLNG(paikka(qwe, x(kurso))) * 100))
NEXT qwe
COLOR 6
LOCATE , 41: PRINT paiknim(3);
LOCATE , 58
COLOR 14: IF paikka(3, x(kurso)) = 1 THEN PRINT "KYLLŽ" ELSE PRINT "EI"
PRINT
COLOR 6
LOCATE , 41: PRINT "YLEIS™KESKIARVO: ";
COLOR 14
IF kotiot(x(kurso)) = 0 THEN PRINT "EI KOTIOTTELUITA";  ELSE PRINT LTRIM$(STR$(CLNG(ylek(x(kurso)) / kotiot(x(kurso))))); "               ";
RETURN
maraton:
LOCATE 4, 1
COLOR 6: PRINT "JOUKKUE  KAUDET  ";
COLOR 12: PRINT "P   ";
COLOR 4: PRINT "D   ";
COLOR 5: PRINT "M   ";
COLOR 14: PRINT "K   ";
COLOR 7: PRINT "H   ";
COLOR 6: PRINT "P";
LOCATE 6, 1
FOR xx = a TO a + 33
COLOR jkolo(sr(msij2(xx)))
IF ohj(msij2(xx)) <> 0 THEN ccc = ohj(msij2(xx)): colchk 4
PRINT l(msij2(xx));
FOR b = 1 TO 3
LOCATE , 14 + b * 4: PRINT LTRIM$(STR$(tkaus(b, msij2(xx)))); "  ";
LOCATE , 26 + b * 4: PRINT LTRIM$(STR$(tsaav(b, msij2(xx)))); "  ";
NEXT b
PRINT
NEXT xx
RETURN
runkos:
IF kausi = 1999 THEN LOCATE 4, 1: COLOR 15: lay 40: RETURN
OPEN "game_" + LTRIM$(STR$(lokero)) + "\" + LTRIM$(STR$(oldkurso)) + ".gr" + LTRIM$(STR$(pv)) FOR INPUT AS #1
INPUT #1, gruuh%
FOR xxx = 1 TO 44
INPUT #1, tgraf(xxx)
NEXT xxx
CLOSE #1
klearstat 4
haahaa 11
LOCATE 4, 1: COLOR 15: PRINT "RUNKOSARJAT, KAUSI "; LTRIM$(STR$(oldkurso)); "-"; LTRIM$(STR$(oldkurso + 1)); "  ";
OPEN "game_" + LTRIM$(STR$(lokero)) + "\" + LTRIM$(STR$(oldkurso)) + ".tbl" FOR INPUT AS #1
FOR qwe = 1 TO 4
FOR cupex = 1 TO 12
INPUT #1, temp1, temp2, temp3
IF qwe = 1 THEN LOCATE 7 + cupex, 1 ELSE IF qwe = 2 THEN LOCATE 7 + cupex, 17 ELSE IF qwe = 3 THEN LOCATE 20 + cupex, 1 ELSE LOCATE 20 + cupex, 17
COLOR stvari(cupex, qwe)
ccc = temp3: colchk 4
PRINT l(temp1); "  ";
PRINT LTRIM$(STR$(temp2))
NEXT cupex
NEXT qwe
CLOSE #1
COLOR 14
FOR xxx = 12 TO 1 STEP -1
LOCATE 32 - (24 - (xxx * 2)), 33
PRINT LTRIM$(STR$(xxx));
NEXT xxx
temp% = 1
FOR xx = 1 TO 44
COLOR stvari(tgraf(xx), gruuh%)
FOR xxx = 12 TO tgraf(xx) STEP -1
LOCATE 33 - (24 - (xxx * 2)), xx + 34
IF temp% = 1 THEN PRINT CHR$(177);  ELSE PRINT CHR$(176);
LOCATE 32 - (24 - (xxx * 2)), xx + 34
IF temp% = 1 THEN PRINT CHR$(177);  ELSE PRINT CHR$(176);
NEXT xxx
IF temp% = 1 THEN temp% = 2 ELSE temp% = 1
NEXT xx
RETURN
mitalit:
lax 179
PRINT
OPEN "game_" + LTRIM$(STR$(lokero)) + "\1.sta" FOR INPUT AS #1
DO UNTIL EOF(1)
INPUT #1, temp, mital(1), hassu(1), mital(2), hassu(2), mital(3), hassu(3), mital(4), hassu(4), jepjepjep$, hassu(5)
LOCATE , 1: COLOR 6: PRINT LTRIM$(STR$(temp));
FOR cupex = 1 TO 4
COLOR 2
ccc = hassu(cupex): colchk 4
LOCATE , 9 + (cupex - 1) * 13
IF mital(cupex) <> 0 THEN PRINT l(mital(cupex));  ELSE PRINT "-";
NEXT cupex
COLOR 2
ccc = hassu(5): colchk 4
LOCATE , 59: PRINT jepjepjep$
IF CSRLIN = 42 THEN pjn: klearstat 6
LOOP
CLOSE #1
RETURN
personal:
lay 29: PRINT : PRINT
IF kausi = 1999 THEN COLOR 14: lay 40: RETURN
OPEN "game_" + LTRIM$(STR$(lokero)) + "\stat." + LTRIM$(STR$(pv)) FOR INPUT AS #1
DO UNTIL EOF(1)
IF POS(0) > 1 THEN PRINT
INPUT #1, temp1, temp2, temp3, temp4, temp5, temp6, temp7, temp8, temp9, temp10, temp11, temp12, temp13
COLOR 6
PRINT LTRIM$(STR$(temp1 - 1)); "-"; LTRIM$(STR$(temp1)); "   ";
COLOR jkolo(temp11)
PRINT l(temp2); " ";
PRINT LTRIM$(STR$(temp4));
IF temp4 < 10 THEN PRINT "  ";  ELSE PRINT " ";
PRINT LTRIM$(STR$(temp5));
IF temp5 < 10 THEN PRINT "  ";  ELSE PRINT " ";
PRINT LTRIM$(STR$(temp6));
IF temp6 < 10 THEN PRINT "  ";  ELSE PRINT " ";
IF temp7 < 10 THEN PRINT "   ";  ELSE IF temp7 < 100 THEN PRINT "  ";  ELSE PRINT " ";
PRINT LTRIM$(STR$(temp7));
PRINT "-";
PRINT LTRIM$(STR$(temp8));
IF temp8 < 10 THEN PRINT "   ";  ELSE IF temp8 < 100 THEN PRINT "  ";  ELSE PRINT " ";
PRINT " ";
PRINT LTRIM$(STR$(temp9));
PRINT " (";
PRINT LTRIM$(STR$(temp10)); ")";
LOCATE , 52
IF temp12 < 0 THEN PRINT "PUTOAMINEN"
IF temp12 > 0 THEN PRINT "SARJANOUSU"
IF temp12 = 0 THEN
SELECT CASE temp13
CASE 1
PRINT "KULTAA"
CASE 2
PRINT "HOPEAA"
CASE 3
PRINT "PRONSSIA"
CASE 4
PRINT "NELJŽS"
CASE 13, 25 TO 26
PRINT "FINAALI"
CASE 14 TO 15, 27 TO 30
PRINT "SEMIFINAALI"
CASE 5 TO 8, 16 TO 18, 31 TO 36
PRINT "1/4-FINAALI"
END SELECT
END IF
IF CSRLIN = 42 THEN pjn: klearstat 6
LOOP
CLOSE #1
RETURN
rekordholders:
COLOR 15
LOCATE 4, 1: PRINT "RUNKOSARJOJEN PISTE-ENNŽTYKSET"
LOCATE 11, 1: PRINT "HENKIL™KOHTAISET PISTE-ENNŽTYKSET"
FOR cupex = 1 TO 3
LOCATE 5 + cupex, 1
COLOR 6
PRINT taulux(cupex);
LOCATE , 13: COLOR 14
IF pisenj(cupex) <> 0 THEN
ccc = pisenohj(cupex): colchk 4
PRINT LTRIM$(STR$(pisenp(cupex))); " ("; RTRIM$(l(pisenj(cupex))); ")"
END IF
IF pisenj(cupex) = 0 THEN PRINT "-"
NEXT cupex
PRINT
FOR zz = 1 TO 6
LOCATE 11 + zz * 2, 1
COLOR 6
IF zz < 4 THEN PRINT "RUNKOSARJA, ";  ELSE PRINT "PLAY-OFFIT, ";
IF zz < 4 THEN PRINT taulux(zz);  ELSE PRINT taulux(zz - 3);
LOCATE , 30
IF rekord(zz).jo = 0 THEN COLOR 14: PRINT "-"
IF rekord(zz).jo <> 0 THEN
COLOR 10: PRINT rekord(zz).na; " ";
COLOR 2: PRINT l(rekord(zz).jo); " ";
COLOR 14
IF rekord(zz).ma < 10 THEN PRINT " ";
PRINT LTRIM$(STR$(rekord(zz).ma));
PRINT " + ";
PRINT LTRIM$(STR$(rekord(zz).sy));
IF rekord(zz).sy < 10 THEN PRINT " ";
PRINT " = "; LTRIM$(STR$(rekord(zz).pi))
END IF
NEXT zz
RETURN
pistepvoit:
COLOR 6: LOCATE 4, 68
IF c = 0 THEN PRINT "RUNKOSARJA" ELSE PRINT "PLAY-OFFIT"
COLOR 14, 0: LOCATE 4, 1
OPEN "game_" + LTRIM$(STR$(lokero)) + "\2" + LTRIM$(STR$(((curso - 9) + (c * 3)))) + ".sta" FOR INPUT AS #1
IF ERR = 53 THEN RETURN
DO UNTIL EOF(1)
INPUT #1, tempk, temp$, temp1, temp2, temp3, temp4, ccc
COLOR 6: PRINT tempk; "  ";
COLOR 10
colchk 4
PRINT temp$; "  ";
COLOR 2
colchk 4
PRINT l(temp1); "  ";
COLOR 14: PRINT LTRIM$(STR$(temp2)); " + "; LTRIM$(STR$(temp3)); " = "; LTRIM$(STR$(temp4)); "   "
IF CSRLIN = 42 THEN pjn: klearstat 4
LOOP
CLOSE #1
RETURN
prorele:
COLOR 6: PRINT "KAUSI  ";
COLOR 14
PRINT "DIV > PHL   PHL > DIV   MUT > DIV   DIV > MUT   MUT > DIV   DIV > MUT"
PRINT
OPEN "game_" + LTRIM$(STR$(lokero)) + "\3.sta" FOR INPUT AS #1
DO UNTIL EOF(1)
INPUT #1, temp, mital(1), hassu(1), mital(2), hassu(2), mital(3), hassu(3), mital(4), hassu(4), mital(5), hassu(5), mital(6), hassu(6)
COLOR 6: PRINT LTRIM$(STR$(temp));
FOR qwe = 1 TO 6
LOCATE , 8 + (qwe - 1) * 12
IF mital(qwe) = 0 THEN COLOR 8 ELSE COLOR 2
ccc = hassu(qwe): colchk 4
IF mital(qwe) = 0 THEN PRINT "-";  ELSE PRINT l(mital(qwe));
NEXT qwe
PRINT
IF CSRLIN = 42 THEN pjn: klearstat 6
LOOP
CLOSE #1
RETURN
mmaraton:
LOCATE 4, 1
COLOR 6
PRINT "MAA                  K   H   P"
LOCATE 6, 1
FOR xx = 1 TO 17
IF xx = 1 THEN COLOR 14 ELSE COLOR 7
PRINT kansap(mmsij2(xx));
LOCATE , 17
IF mmsarja(mmsij2(xx)) = 1 THEN PRINT "(A)";  ELSE PRINT "(B)";
LOCATE , 22
FOR xxx = 1 TO 3
IF xxx = 1 THEN LOCATE , 22 ELSE IF xxx = 2 THEN LOCATE , 26 ELSE LOCATE , 30
PRINT LTRIM$(STR$(mmitali(xxx, mmsij2(xx))));
NEXT xxx
PRINT
NEXT xx
RETURN
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

SUB wnd (ser%)
SELECT CASE ser%
CASE 1
me$ = "": WHILE me$ = "": me$ = INKEY$: WEND
CASE 2
me$ = "": DO UNTIL me$ = "k" OR me$ = "e": me$ = INKEY$: LOOP
END SELECT
END SUB


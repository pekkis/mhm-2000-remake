DECLARE SUB taantumaprosentit ()
DECLARE SUB pistevaatimukset ()
DECLARE SUB minimiottelumaarat ()
DECLARE SUB wnd (sex%)
DECLARE SUB ottelumaarat ()
DECLARE SUB kehitysprosentit ()
'$DYNAMIC
'$INCLUDE: 'mhm2k.bi'

COMMON SHARED muutoz() AS INTEGER, vaat() AS INTEGER
COMMON SHARED vaat2() AS INTEGER, vaat3() AS INTEGER, vaat4() AS INTEGER

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

DO

CLS
PRINT "1. Junnuin ottelum„„r„t"
PRINT "2. Junnuin kehitysprosentit"
PRINT "3. Taitoin minimiottelum„„r„t"
PRINT "4. Wanhusten taantumaprosentit"
PRINT "5. Pistewaatimuxet"

wnd 1

IF me$ = "1" THEN ottelumaarat
IF me$ = "2" THEN kehitysprosentit
IF me$ = "3" THEN minimiottelumaarat
IF me$ = "4" THEN taantumaprosentit
IF me$ = "5" THEN pistevaatimukset

LOOP




'SELECT CASE pel(xx, pv).age
'CASE 18 TO 25
'IF pel(xx, pv).pot > pel(xx, pv).psk * 2 THEN
'a = pel(xx, pv).age
'b = 100 * RND
'IF b > vaat2(a, 3) THEN muutoz(xx) = muutoz(xx) + 3 ELSE IF a > vaat2(a, 2) THEN muutoz(xx) = muutoz(xx) + 2 ELSE IF a > vaat2(a, 1) THEN muutoz(xx) = muutoz(xx) + 1
'END IF
'CASE IS >= 29
'IF pel(xx, pv).age <= 35 THEN a = pel(xx, pv).age ELSE a = 35
'b = 100 * RND
'IF b > vaat3(a, 1) THEN muutoz(xx) = muutoz(xx) - 3 ELSE IF b > vaat3(a, 2) THEN muutoz(xx) = muutoz(xx) - 2 ELSE IF b > vaat3(a, 3) THEN muutoz(xx) = muutoz(xx) - 1
'END SELECT

'IF pel(xx, pv).pot < pel(xx, pv).psk THEN muutoz(xx) = muutoz(xx) - 1

'IF pel(xx, pv).pot = 0 THEN muutoz(xx) = muutoz(xx) + vaat4(pel(xx, pv).psk)

'IF pel(xx, pv).ppp > 1 THEN
'IF pel(xx, pv).ppp = 2 THEN sin1 = .66 ELSE sin1 = 1
'IF tempsr(u(pv)) = 1 THEN sin2 = 1 ELSE IF tempsr(u(pv)) = 2 THEN sin2 = 1.5 ELSE sin2 = 2
'b = rug(xx, pv) + rua(xx, pv) + pel(xx, pv).gls + pel(xx, pv).ass
'IF b >= vaat(pel(xx, pv).psk, 3) * sin1 * sin2 THEN muutoz(xx) = muutoz(xx) + 3 ELSE IF b >= vaat(pel(xx, pv).psk, 2) * sin1 THEN muutoz(xx) = muutoz(xx) + 2 ELSE IF b >= vaat(pel(xx, pv).psk, 1) * sin1 THEN muutoz(xx) = muutoz(xx) + 1
'END IF

'a = 100 * RND
'IF a < 10 THEN muutoz(xx) = muutoz(xx) - 1 ELSE IF a > 91 THEN muutoz(xx) = muutoz(xx) + 1

'IF pel(xx, pv).psk + muutoz(xx) < 1 THEN muutoz(xx) = muutoz(xx) + (1 - muutoz(xx))

'IF pel(xx, pv).psk + muutoz(xx) > 20 THEN
'muutoz(xx) = muutoz(xx) - (muutoz(xx) - 20)
'END IF

ERASE rug, rua, vaat, vaat2, vaat3, vaat4

REM $STATIC
SUB kehitysprosentit
CLS
FOR xx = 18 TO 25
PRINT LTRIM$(STR$(xx));
LOCATE , 7
PRINT LTRIM$(STR$(vaat2(xx, 1)));
LOCATE , 12
PRINT LTRIM$(STR$(vaat2(xx, 2)));
LOCATE , 17
PRINT LTRIM$(STR$(vaat2(xx, 3)));
PRINT
NEXT xx

wnd 1
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

SUB minimiottelumaarat
CLS
FOR xx = 1 TO 20
xxx = xx
PRINT LTRIM$(STR$(xx));
LOCATE , 7
PRINT LTRIM$(STR$(xxx * 1));
LOCATE , 12
PRINT LTRIM$(STR$(xxx * 2));
LOCATE , 17
PRINT LTRIM$(STR$(xxx * 3))
NEXT xx

wnd 1



END SUB

SUB ottelumaarat
CLS
FOR xx = 1 TO 20
xxx = xx * 2
PRINT LTRIM$(STR$(xx));
LOCATE , 7
PRINT LTRIM$(STR$(xxx * 1));
LOCATE , 12
PRINT LTRIM$(STR$(xxx * 2));
LOCATE , 17
PRINT LTRIM$(STR$(xxx * 3))
NEXT xx

wnd 1
END SUB

SUB pistevaatimukset
CLS

FOR xx = 1 TO 20
PRINT LTRIM$(STR$(xx));
LOCATE , 7
PRINT LTRIM$(STR$(vaat(xx, 1)));
LOCATE , 12
PRINT LTRIM$(STR$(vaat(xx, 2)));
LOCATE , 17
PRINT LTRIM$(STR$(vaat(xx, 3)));

LOCATE , 28
PRINT xx ^ 1.55
NEXT xx

wnd 1

END SUB

SUB taantumaprosentit
CLS
FOR xx = 29 TO 35
PRINT LTRIM$(STR$(xx));
LOCATE , 7
PRINT LTRIM$(STR$(vaat3(xx, 1)));
LOCATE , 12
PRINT LTRIM$(STR$(vaat3(xx, 2)));
LOCATE , 17
PRINT LTRIM$(STR$(vaat3(xx, 3)));
PRINT
NEXT xx

wnd 1

END SUB

SUB wnd (sex%)
SELECT CASE sex%
CASE 1
me$ = "": WHILE me$ = "": me$ = INKEY$: WEND
CASE 2
me$ = "": DO UNTIL me$ = "k" OR me$ = "e": me$ = INKEY$: LOOP
END SELECT
END SUB


DECLARE SUB ku (kuz%, ku1%, ku2%)
DECLARE SUB testaa ()
DECLARE SUB wnd (sex%)
DECLARE SUB palkkakayra ()
'$DYNAMIC
'$INCLUDE: 'mhm2k.bi'

COMMON SHARED sin4 AS SINGLE, sin5 AS SINGLE, sin6 AS SINGLE

perusraha = 100
potenssi = 1.17
potenssiplus = .035
xvolisa = .05
johlisa = .02
karlisa = .015

SCREEN 0

DO
CLS
PRINT "1. Palkkak„yr„"
PRINT "2. Testaa palkkarutiinia"

wnd 1
IF me$ = "1" THEN palkkakayra
IF me$ = "2" THEN testaa


LOOP

REM $STATIC
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

SUB palkkakayra
SCREEN 12

b = 1


COLOR 8
FOR a = 1 TO 20
LINE (((a - 1) * 30) + 1, 0)-(((a - 1) * 30) + 1, 460)
NEXT a

COLOR 7


FOR a = 1 TO 20

potenssix = potenssi + (a * potenssiplus)

LOCATE a, 1
PRINT LTRIM$(STR$(a)); ": ";
sin1 = a ^ potenssix

rahna = CLNG(sin1 * perusraha)

PRINT rahna; potenssix
NEXT a

COLOR 15

FOR a = 1 TO 19

potenssix = potenssi + (a * potenssiplus)


'b = b + 1
'IF b = 16 THEN b = 1
'COLOR b

sin1 = a ^ potenssix
sin2 = (a + 1) ^ (potenssix + potenssiplus)

LINE (((a - 1) * 30) + 1, 460 - sin1)-(((a - 1) * 30) + 30, 460 - sin2)


NEXT a

WHILE INKEY$ = "": WEND
SCREEN 0

END SUB

SUB testaa
neup.psk = 10
neup.yvo = 0
neup.avo = 0
neup.ldr = 6
neup.kar = 10
neup.ego = 10

kurso = 1

DO
COLOR , 0
CLS

IF kurso = 1 THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT "TAITO..."; neup.psk
PRINT

IF kurso = 2 THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT " YVO..."; neup.yvo
IF kurso = 3 THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT " AVO..."; neup.avo
PRINT

IF kurso = 4 THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT "JOH..."; neup.ldr

IF kurso = 5 THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT "KAR..."; neup.kar
PRINT
IF kurso = 6 THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT "EGO..."; neup.ego

COLOR , 0

potenssix = potenssi + (neup.psk * potenssiplus)

sin1 = neup.psk ^ potenssix
rahna = CLNG(sin1 * perusraha)

COLOR 6
LOCATE 1, 41: PRINT "P-PALKKA (PTX)   ";
COLOR 14
PRINT LTRIM$(STR$(rahna)); " ("; LTRIM$(STR$(potenssix)); ")"

cl = rahna
rahna = rahna * (1 + ((neup.avo + neup.yvo) * xvolisa))

COLOR 6
LOCATE 3, 41: PRINT "> XVOT   ";
COLOR 14
PRINT LTRIM$(STR$(rahna))
COLOR 6
LOCATE 4, 40: PRINT "%/ALKUP   ";
COLOR 14
PRINT LTRIM$(STR$(CLNG(((rahna / cl) * 100))))

rahna = rahna * (1 + ((-6 + neup.ldr) * johlisa))

COLOR 6
LOCATE 6, 41: PRINT "> JOH   ";
COLOR 14
PRINT LTRIM$(STR$(rahna))
COLOR 6
LOCATE 7, 40: PRINT "%/ALKUP   ";
COLOR 14
PRINT LTRIM$(STR$(CLNG(((rahna / cl) * 100))))


rahna = rahna * (1 + ((-10 + neup.kar) * karlisa))

COLOR 6
LOCATE 9, 41: PRINT "> KAR   ";
COLOR 14
PRINT LTRIM$(STR$(rahna))
COLOR 6
LOCATE 10, 40: PRINT "%/ALKUP   ";
COLOR 14
PRINT LTRIM$(STR$(CLNG(((rahna / cl) * 100))))


wnd 1
ku 1, 1, 6

IF me$ = CHR$(0) + CHR$(75) THEN
SELECT CASE kurso
CASE 1
neup.psk = neup.psk - 1
CASE 2
neup.yvo = neup.yvo - 1
CASE 3
neup.avo = neup.avo - 1
CASE 4
neup.ldr = neup.ldr - 1
CASE 5
neup.kar = neup.kar - 1
CASE 6
neup.ego = neup.ego - 1
END SELECT
END IF

IF me$ = CHR$(0) + CHR$(77) THEN
SELECT CASE kurso
CASE 1
neup.psk = neup.psk + 1
CASE 2
neup.yvo = neup.yvo + 1
CASE 3
neup.avo = neup.avo + 1
CASE 4
neup.ldr = neup.ldr + 1
CASE 5
neup.kar = neup.kar + 1
CASE 6
neup.ego = neup.ego + 1
END SELECT
END IF

IF me$ = CHR$(27) THEN EXIT DO
LOOP

END SUB

SUB wnd (sex%)
SELECT CASE sex%
CASE 1
me$ = "": WHILE me$ = "": me$ = INKEY$: WEND
CASE 2
me$ = "": DO UNTIL me$ = "k" OR me$ = "e": me$ = INKEY$: LOOP
END SELECT
END SUB


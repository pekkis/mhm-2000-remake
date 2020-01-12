DECLARE SUB ku (kuz%, ku1%, ku2%)
DECLARE SUB lt (lue$, lukux%)
DECLARE SUB colchk (colre%)
'$DYNAMIC
'$INCLUDE: 'mhm2k.bi'

DIM pelki(1 TO 20) AS INTEGER

OPEN "data\pelkiel.m2k" FOR INPUT AS #1
FOR zz = 1 TO 18
INPUT #1, pelki(zz)
NEXT zz
CLOSE #1

curso = 1
kurso = 1

DO
CLS
LOCATE 25, 1: PRINT curso;
LOCATE 1, 1

lt "pk", curso
LOCATE 10, 1
COLOR 14, 0: PRINT "PELIKIELTO: ";
COLOR 13: PRINT pelki(curso)

me$ = "": WHILE me$ = "": me$ = INKEY$: WEND
ku 3, 1, UBOUND(pelki)

IF me$ = CHR$(0) + CHR$(75) THEN
pelki(curso) = pelki(curso) - 1
END IF

IF me$ = CHR$(0) + CHR$(77) THEN
pelki(curso) = pelki(curso) + 1
END IF


IF me$ = "S" THEN EXIT DO

LOOP

OPEN "data\pelkiel.m2k" FOR OUTPUT AS #1
FOR zz = 1 TO 18
WRITE #1, pelki(zz)
NEXT zz
CLOSE #1

REM $STATIC
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
PRINT "manageri(xx)";
CASE 6
PRINT "manageri (yy)";
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
IF POS(CSRLIN) > 65 AND lue$ <> "y" AND MID$(text, e, 1) = " " THEN PRINT
yyteri:
NEXT e
CLOSE #1
IF lue$ <> "y" THEN PRINT
END SUB


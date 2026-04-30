'$DYNAMIC
'$INCLUDE: 'mhm2k.bi'
COMMON SHARED kokonaismaara AS LONG

RANDOMIZE TIMER
CLS

DIM keisix(1 TO 7, 1 TO 100) AS INTEGER

OPEN "data\keisit.m2k" FOR INPUT AS #1
FOR xx = 1 TO 7
FOR xxx = 1 TO 100
INPUT #1, keisix(xx, xxx)
NEXT xxx
NEXT xx
CLOSE #1

'GOTO saatana
b = 5



SELECT CASE b
CASE 1
DIM paska(1 TO 17) AS LONG
CASE 2
DIM paska(1 TO 5) AS LONG
CASE 3
DIM paska(18 TO 35) AS LONG
CASE 4
DIM paska(1 TO 20) AS LONG
CASE 5
DIM paska(1 TO 20) AS LONG
CASE 6
DIM paska(1 TO 20) AS LONG
CASE 7
DIM paska(-3 TO 3) AS LONG
END SELECT

kokonaismaara = 0

DO
kokonaismaara = kokonaismaara + 1

SELECT CASE b
CASE 1, 2, 3, 4, 7
a = keisix(b, INT(100 * RND) + 1)
CASE 5, 6
'a = keisix(b, (((INT(100 * RND) + 1) + (INT(100 * RND) + 1)) / 2))

a = keisix(b, INT(((100 * RND) + (100 * RND)) / 2) + 1)

'a = keisix(b, INT(100 * RND * RND) + 1)
END SELECT

paska(a) = paska(a) + 1

LOCATE 1, 1

FOR c = LBOUND(paska) TO UBOUND(paska)
PRINT LTRIM$(STR$(c)); ": ";
PRINT LTRIM$(STR$(paska(c))); "    (";
PRINT USING "##.##"; (paska(c) / kokonaismaara) * 100;
PRINT ")"

NEXT c

LOOP

saatana:
DIM pel(1 TO 1000) AS pelaaja
DIM keskiarvo(1 TO 2) AS LONG


FOR xxx = 1 TO 30
blanko.ppp = keisix(2, INT(100 * RND) + 1)
blanko.age = keisix(3, INT(100 * RND) + 1)
blanko.ego = keisix(4, INT(100 * RND) + 1)
blanko.ldr = keisix(5, (((INT(100 * RND) + 1) + (INT(100 * RND) + 1)) / 2))
blanko.kar = keisix(6, (((INT(100 * RND) + 1) + (INT(100 * RND) + 1)) / 2))
blanko.yvo = keisix(7, INT(100 * RND) + 1)
blanko.avo = keisix(7, INT(100 * RND) + 1)
blanko.nam = krj$ + "." + ptemp$
blanko.nat = nats

pel(xxx) = blanko

NEXT xxx

FOR xx = 1 TO xxx - 1
keskiarvo(1) = keskiarvo(1) + pel(xx).ldr
keskiarvo(2) = keskiarvo(2) + pel(xx).kar
NEXT xx

keskiarvo(1) = keskiarvo(1) / xx - 1
PRINT "keski-ldr..."; keskiarvo(1)

keskiarvo(2) = keskiarvo(2) / xx - 1
PRINT "keski-kar..."; keskiarvo(2)





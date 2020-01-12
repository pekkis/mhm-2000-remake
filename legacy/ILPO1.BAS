DECLARE SUB cuparpo ()
DECLARE SUB borsinit (init%)
DECLARE SUB borsgene ()
DECLARE SUB baaorsmuutos ()
DECLARE SUB gamedayhaara ()
DECLARE SUB budget ()
DECLARE SUB fbimiehet ()
DECLARE SUB faarao ()
DECLARE SUB automa ()
DECLARE SUB apulaisvalm ()
DECLARE SUB bors ()
DECLARE SUB al (fat%)
DECLARE SUB asetukset ()
DECLARE SUB annarahaa (arg%)
DECLARE SUB colchk (colre%)
DECLARE SUB arvox (arvob%)
DECLARE SUB cupohjelma (clurk%)
DECLARE SUB cupjuhla ()
DECLARE SUB ehllopturmaar (murder%)
DECLARE SUB gameday ()
DECLARE SUB mor (mora%, morax%)
DECLARE SUB mmkisaloppu ()
DECLARE SUB mukachk ()
DECLARE SUB maajoukkue ()
DECLARE SUB mmkisaalku ()
DECLARE SUB jaauniorit ()
DECLARE SUB leq (fat%)
DECLARE SUB lax (fat%)
DECLARE SUB harjotte (pkl%)
DECLARE SUB ketjuchk ()
DECLARE SUB kc ()
DECLARE SUB katsoket ()
DECLARE SUB katsopel ()
DECLARE SUB graph ()
DECLARE SUB iaformaatio ()
DECLARE SUB meanstuff ()
DECLARE SUB kutsuturnaus ()
DECLARE SUB lt (lue$, lukux%)
DECLARE SUB intejasopu ()
DECLARE SUB kriisipalaveri ()
DECLARE SUB kuitt ()
DECLARE SUB kuva (tied$)
DECLARE SUB lay (fat%)
DECLARE SUB haahaa (haha%)
DECLARE SUB ku (kuz%, ku1%, ku2%)
DECLARE SUB lentti (kuka%, sano%)
DECLARE SUB komme (sano%)
DECLARE SUB maarpalk (jepulis$)
DECLARE SUB naytaott (nayk%)
DECLARE SUB kausikorttimaar ()
DECLARE SUB joulutauko ()
DECLARE SUB pisteporssimaar ()
DECLARE SUB pjn ()
DECLARE SUB poispel ()
DECLARE SUB poisne ()
DECLARE SUB piirtox ()
DECLARE SUB pankki ()
DECLARE SUB organisaatio ()
DECLARE SUB pisteporssi (fat%)
DECLARE SUB palkmaar ()
DECLARE SUB printpel (fat%)
DECLARE SUB osto2 ()
DECLARE SUB ottpel ()
DECLARE SUB ottul ()
DECLARE SUB otmuut (fat%)
DECLARE SUB playoffplajays (plots%)
DECLARE SUB staulmaar ()
DECLARE SUB staulehlmaar ()
DECLARE SUB sponsorit ()
DECLARE SUB rstages ()
DECLARE SUB sortmaar ()
DECLARE SUB skreensaver ()
DECLARE SUB qelp (qel%)
DECLARE SUB snayt ()
DECLARE SUB scoutit ()
DECLARE SUB sporvagen ()
DECLARE SUB rela ()
DECLARE SUB sortbors (paddy%)
DECLARE SUB sopimusext (fat%)
DECLARE SUB report ()
DECLARE SUB sattuma ()
DECLARE SUB uusikausi ()
DECLARE SUB zreseasongala ()
DECLARE SUB tremaar ()
DECLARE SUB tarkistanhlc ()
DECLARE SUB vastmaar ()
DECLARE SUB valitsestrat ()
DECLARE SUB suunnitelma ()
DECLARE SUB tyytyma ()
DECLARE SUB tallennus ()
DECLARE SUB suosikitchk ()
DECLARE SUB vedonlyonti ()
DECLARE SUB tulonsiirto ()
DECLARE SUB tulevatottelut ()
DECLARE SUB wnd (ser%)
DECLARE SUB tmankom (sano%)
DECLARE SUB turnaus ()
DECLARE SUB ylmaar ()
DECLARE SUB veiktark ()
DECLARE SUB uutisia ()
DECLARE FUNCTION tarko% (t0%, t1%, t2%, t3%)
DECLARE FUNCTION tarka% (jez%)
'$DYNAMIC
'$INCLUDE: 'mhm2k.bi'
RANDOMIZE TIMER

IF chainahdus = 0 THEN
CLS
IF ensintoinen = 0 THEN RUN "mhm2k"
ver$ = "1.2 REKISTER™ITY"
IF ver1 <> ver$ THEN CLS : COLOR 15, 0: PRINT "YHTEENSOPIMATTOMAT VERSIOT!": SYSTEM

menu1:
IF kiero(kr) = 48 THEN
uusikausi
END IF

IF ladattu = 0 THEN

IF kiero(kr) = 1 AND ki MOD 3 = 0 THEN tv = INT(6 * RND) + 1 ELSE tv = 0

FOR xx = 1 TO 48
IF ohj(xx) = 0 AND mo(xx) <= -6 THEN
IF tarko(xx, 4, 10, 50) = 1 THEN mor xx, 2
END IF
NEXT xx

SELECT CASE kiero3(kr)
CASE 49
zreseasongala
CASE 2
cuparpo
CASE 4
COLOR 31, 0: CLS : PRINT "ODOTA HETKINEN!"
borsinit 1
firstborsgene = lastbors + 1: borsgenex = 440: borsgene
borsinit 2
cuparpo
CASE 6
tremaar
CASE 7
tarkistanhlc
CASE 11
mmkisaloppu
END SELECT

IF arvsulk = 1 AND INT(101 * RND) < 8 THEN arvsulk = 0
SELECT CASE kiero(kr)
CASE 2, 3, 98, 22, 99, 97
lm = 0
CASE 1, 42, 44, 46
lm = 1
CASE 4
lm = 0
DIM hott(1 TO 86) AS INTEGER
DIM hotte(1 TO 86) AS INTEGER
FOR pv = 1 TO plkm
hott(-1 + (pv * 2)) = u(pv)
NEXT pv
END SELECT
END IF
pisteporssimaar
IF kiero(kr) = 42 OR kiero(kr) = 44 OR kiero(kr) = 46 THEN mukachk
vu = 0
menu2:
cupoli = 1
durso = 1
aape = 0
vu = vu + 1
IF vu > plkm THEN
IF kr < 1 THEN baaorsmuutos
gamedayhaara
GOTO menu1
END IF
pv = vuoro(vu)
koti(pv) = 0: vieras(pv) = 0
staulmaar
staulehlmaar
IF kiero(kr) <> 4 THEN vast(pv) = 0
vastmaar

IF ladattu = 0 THEN
IF kiero(kr) = 97 THEN maajoukkue
SELECT CASE kiero3(kr)
CASE 10
mmkisaalku
CASE 99
sponsorit
CASE 1
valitsestrat
tremaar
CASE 4
jaauniorit
budget
CASE 5
suunnitelma
END SELECT

jaynteh = 0
kriisi = 0

IF valb(1, pv) = 1 THEN b = 15: c = 101 ELSE IF valb(1, pv) = 2 THEN b = 10: c = 96 ELSE IF valb(1, pv) = 3 THEN b = 7: c = 94 ELSE IF valb(1, pv) = 4 THEN b = 5: c = 91 ELSE b = 0: c = 86
d = INT(100 * RND) + 1
IF d <= b THEN treeni(pv) = -1 ELSE IF d >= c THEN treeni(pv) = 1 ELSE treeni(pv) = 0

IF kr > 1 THEN actiox(pv) = 999 ELSE actiox(pv) = aktion(kr)
IF vai(1, pv) < 3 THEN actiox(pv) = actiox(pv) + 3 - vai(1, pv)

FOR zz = 2 TO 17
IF skout(zz, pv) > 1 THEN skout(zz, pv) = skout(zz, pv) - 1
NEXT zz

FOR xx = 1 TO lpl(pv)
IF konkurssi(pv) = 0 AND pel(xx, pv).inj = 3333 THEN pel(xx, pv).inj = 0

IF pel(xx, pv).spe >= 30000 THEN
leq 5
IF tarko(u(pv), 6, 5, 30) = 1 THEN
lax 57
pel(xx, pv).spe = pel(xx, pv).spe - 30000
ELSE
lax 58
pel(xx, pv).spe = 13
pel(xx, pv).psk = 1
pel(xx, pv).yvo = -3
pel(xx, pv).avo = -3
pel(xx, pv).ldr = 1
pel(xx, pv).kar = 1
END IF
pjn
END IF

pel(xx, pv).neu = 0
IF pel(xx, pv).svu = 0 THEN pel(xx, pv).sra = 0
IF pel(xx, pv).spe = 13 AND pel(xx, pv).kun <> 0 THEN pel(xx, pv).kun = 0

IF pel(xx, pv).spe = 3 AND INT(101 * RND) < pel(xx, pv).pok THEN fbimiehet: EXIT FOR

IF pel(xx, pv).svu = 666 AND 100 * RND < 5 THEN
leq 5
lax 93
poispel
pjn
END IF

IF pel(xx, pv).svu = 10000 THEN
leq 5
lax 94
IF pel(xx, pv).spe = 4 THEN lax 95
poispel
pjn
END IF

IF pel(xx, pv).spe = 1 AND mo(u(pv)) < 0 AND konkurssi(pv) = 0 THEN mo(u(pv)) = 0
NEXT xx

IF kr = 1 AND ladattu = 0 THEN poisne

IF kr = -9 AND ladattu = 0 THEN tyytyma

borsinit 1
FOR xx = 1 TO lastbors
bel(xx).neu = 0
NEXT xx
borsinit 2

IF uhatapa(pv) <> 0 THEN rstages

IF kiero(kr) = 4 THEN
IF INT(101 * RND) + mtaito(5, man(u(pv))) * 10 > 50 AND hotte(u(pv)) = 0 THEN harjotte 1
END IF

IF konkurssi(pv) > 0 THEN faarao

IF kiero3(kr) = 4 AND vu = 1 THEN tallennus
END IF
ladattu = 0

END IF
chainahdus = 0
menu3:

FOR xx = 1 TO 86
IF ohj(xx) = 0 THEN
SELECT CASE xx
CASE IS < 49
yw(xx) = ((hw(xx) + tauti(2, tox(xx))) / 3.3 + (pw(xx) + tauti(3, tox(xx))) / 2.5) * (1 + (mtaito(2, man(xx)) * .04))
aw(xx) = ((hw(xx) + tauti(2, tox(xx))) / 4.4 + (pw(xx) + tauti(3, tox(xx))) / 2.5) * (1 + (mtaito(2, man(xx)) * .04))
CASE ELSE
yw(xx) = hw(xx) / 3.3 + pw(xx) / 2.5
aw(xx) = hw(xx) / 4.4 + pw(xx) / 2.5
END SELECT

END IF
IF xx < 49 THEN
SELECT CASE ohj(xx)
CASE 0
IF mo(xx) < -10 THEN mo(xx) = -10 ELSE IF mo(xx) > 10 THEN mo(xx) = 10
CASE ELSE
IF mo(xx) < momin(vai(1, ohj(xx))) THEN mo(xx) = momin(vai(1, ohj(xx)))
IF mo(xx) > momax(vai(1, ohj(xx))) THEN mo(xx) = momax(vai(1, ohj(xx)))
END SELECT
END IF
NEXT xx

suosikitchk
IF automat(pv) = 1 THEN automa

skoutteja(pv) = 0
FOR c = 2 TO 17
IF skout(c, pv) <> 0 THEN skoutteja(pv) = skoutteja(pv) + 1
NEXT c
IF raha(pv) >= 0 THEN konkurssi(pv) = 0
IF pirtar(7) <> 1048 THEN mor u(pv), -66
IF raha(pv) > 2000000000 THEN raha(pv) = 2000000000
sortmaar
ketjuchk
kc


IF vaihtis% = 1 THEN katsoket: GOTO menu3
IF vaihtis% = 2 THEN katsopel: GOTO menu3

CLS
piirtox
DO
me$ = ""
skreensave = TIMER
WHILE me$ = ""
me$ = INKEY$
IF TIMER - skreensave > saver% THEN skreensaver: EXIT DO
IF LEFT$(TIME$, 5) <> clock$ THEN clock$ = LEFT$(TIME$, 5): COLOR 8: LOCATE 3, 37: PRINT clock$
WEND

IF me$ = "?" THEN qelp (0): EXIT DO
IF me$ = "1" THEN snayt: EXIT DO
IF me$ = "2" THEN chainahdus = 1: CHAIN "iles5"
IF me$ = "3" THEN graph: EXIT DO
IF me$ = "u" AND automat(pv) = 1 THEN automat(pv) = 0: EXIT DO ELSE IF me$ = "u" THEN automat(pv) = 1: EXIT DO
IF me$ = "i" THEN iaformaatio: EXIT DO
IF me$ = "." AND infos(pv) = 1 THEN infos(pv) = 2: EXIT DO ELSE IF me$ = "." THEN infos(pv) = 1: EXIT DO

IF vast(pv) <> 0 AND valb(1, pv) > 1 THEN
IF me$ = CHR$(0) + CHR$(77) THEN durso = 2: apulaisvalm
IF me$ = CHR$(0) + CHR$(75) THEN durso = 1: apulaisvalm
END IF

IF kiero(kr) = 3 AND cround = 1 THEN
IF me$ = "-" THEN cupoli = 1: EXIT DO
IF me$ = "+" THEN cupoli = 2: EXIT DO
END IF
IF kiero(kr) = 4 THEN
IF hotte(u(pv)) = 0 AND me$ = "h" THEN harjotte 2: EXIT DO
END IF
IF me$ = "A" THEN automa: EXIT DO
IF me$ = "p" THEN pankki: EXIT DO
IF me$ = "o" THEN organisaatio: EXIT DO
IF me$ = "a" THEN katsopel: EXIT DO
IF me$ = "b" THEN katsoket: EXIT DO
IF me$ = "c" AND kiero2(kr) = 1 THEN bors: EXIT DO
IF me$ = "d" THEN chainahdus = 2: CHAIN "iles5"
IF me$ = "e" THEN scoutit: EXIT DO
IF me$ = "f" AND jaynteh = 0 AND kr <= 68 THEN meanstuff: EXIT DO
IF me$ = "v" AND kiero(kr) = 1 AND arvsulk = 0 THEN vedonlyonti: EXIT DO
IF me$ = "l" AND kiero3(kr) = 3 AND mukt(pv) = 0 THEN kutsuturnaus: EXIT DO
IF me$ = "l" AND uhka(pv) > 0 AND kiero3(kr) <> 3 THEN
CLS
al 0
IF uhka(pv) = 1 THEN lt "uh", INT(15 * RND) + 1 ELSE lt "uh", INT(15 * RND) + 16
pjn
uhka(pv) = 0
EXIT DO
END IF
IF me$ = "X" THEN asetukset: EXIT DO
IF me$ = "s" THEN sporvagen: EXIT DO
IF me$ = "t" AND plkm > 1 THEN tulonsiirto: EXIT DO
IF me$ = "S" THEN
IF jaynax(2, u(pv)) = 0 THEN jaynax(2, u(pv)) = 1 ELSE jaynax(2, u(pv)) = 0
intejasopu
END IF
IF mo(u(pv)) <= -6 AND konkurssi(pv) = 0 AND kriisi = 0 AND me$ = "k" THEN kriisipalaveri: EXIT DO
IF me$ = "*" THEN tulevatottelut: EXIT DO
IF me$ = "0" THEN pisteporssi sr(u(pv)): EXIT DO
IF krapu(pv) <> 0 THEN inte(pv) = 1
IF krapu(pv) = 0 THEN
IF me$ = CHR$(0) + CHR$(72) AND inte(pv) < 2 THEN inte(pv) = inte(pv) + 1: intejasopu
IF me$ = CHR$(0) + CHR$(80) AND inte(pv) > 0 THEN inte(pv) = inte(pv) - 1: intejasopu
END IF
IF me$ = "Q" THEN kuitt: EXIT DO
IF me$ = "<" AND kr <= 68 AND vu = 1 THEN tallennus: EXIT DO
IF me$ = CHR$(13) THEN
GOTO menu2
END IF
IF me$ = "!" THEN SCREEN 13: kuva ("credits"): SCREEN 0: WIDTH 80, 43: EXIT DO

LOOP
GOTO menu3

REM $STATIC
SUB aaaargh
IF lpl(pv) < 5 THEN
FOR xx = lpl(pv) + 1 TO 5
nats = 1
rela
pel(xx, pv) = blanko
pel(xx, pv).svu = 1
pel(xx, pv).psk = INT(3 * RND) + 1
neup = pel(xx, pv)
palkmaar
pel(xx, pv).sra = rahna
NEXT xx
lpl(pv) = 5
END IF
END SUB

SUB actionprint
mukax(pv) = 0
SELECT CASE kiero(kr)
CASE 41, 43, 45, 47, 97, 99, 96, 4
mukax(pv) = 1
CASE 1
mukax(pv) = 2
CASE 2, 22
IF muke(pv) = 1 THEN mukax(pv) = 2 ELSE mukax = 0
CASE 98
IF mukt(pv) > 0 THEN mukax(pv) = 2 ELSE mukax = 0
CASE 3
IF mukc(pv) = 1 THEN mukax(pv) = 2 ELSE mukax = 0
CASE 42, 44, 46
IF mukp(pv) = 1 THEN mukax(pv) = 2 ELSE mukax = 0
END SELECT
PRINT "ENTER: ";
IF mukax(pv) = 0 THEN
PRINT "LEPOPŽIVŽ";
EXIT SUB
END IF
SELECT CASE kiero(kr)
CASE 99, 4
SELECT CASE vast(pv)
CASE 0
PRINT LTRIM$(STR$(1 - kr)); " VIIKKO";
IF kr < 0 THEN PRINT "A";
PRINT " KAUDEN ALKUUN";
CASE ELSE
PRINT "HARJOITUSOTTELU";
END SELECT
CASE 2
PRINT "EHL-PELIPŽIVŽ";
CASE 3
PRINT "CUP-PELIPŽIVŽ";
CASE 98
PRINT turnimi(mukt(pv));
CASE 97
PRINT "MAAJOUKKUETAUKO";
CASE 96
PRINT "VAPAA VIIKONLOPPU";
CASE 22
PRINT "EHL:N LOPPUTURNAUS";
CASE 1
PRINT "RUNKOSARJAPELIPŽIVŽ";
CASE 41
PRINT "NELJŽNNESFINAALIPLŽJŽYS";
CASE 42
PRINT "NELJŽNNESFINAALIPELIPŽIVŽ";
CASE 43
PRINT "SEMIFINAALIPLŽJŽYS";
CASE 44
PRINT "SEMIFINAALIPELIPŽIVŽ";
CASE 45
PRINT "FINAALIPLŽJŽYS";
CASE 46
PRINT "FINAALIPELIPŽIVŽ";
CASE 47
PRINT "PHL:N JUHLAGAALA";
END SELECT
END SUB

SUB al (fat%)
lukka = 1

FOR zz = 1 TO 60
xx = INT(lpl(pv) * RND) + 1

SELECT CASE fat%
CASE 0
lukka = 0
CASE 1
IF pel(xx, pv).inj = 0 AND pel(xx, pv).ket > 0 THEN lukka = 0
CASE 2
IF pel(xx, pv).plus = 0 AND pel(xx, pv).kest = 0 THEN lukka = 0
CASE 3
IF pel(xx, pv).inj = 0 THEN lukka = 0
CASE 4
IF pel(xx, pv).spe = 0 AND pel(xx, pv).psk >= 8 THEN lukka = 0
CASE 5
IF pel(xx, pv).ego < 10 THEN lukka = 0
CASE 6, 7
IF fat% = 6 THEN gnome = 3 ELSE gnome = 5
IF pel(xx, pv).ego > 15 THEN
IF 100 * RND < (pel(xx, pv).ego - 15) * gnome THEN lukka = 0 ELSE EXIT SUB
END IF
CASE 8
IF pel(xx, pv).ego >= 17 THEN lukka = 0
CASE 9
IF pel(xx, pv).psk >= avg(1, pv) + 2 AND pel(xx, pv).plus = 0 THEN lukka = 0
CASE 10
IF pel(xx, pv).psk > 1 AND pel(xx, pv).psk < 20 THEN lukka = 0
CASE 11
IF pel(xx, pv).psk >= maajomin(1) AND pel(xx, pv).age <= 27 THEN lukka = 0
CASE 12
IF pel(xx, pv).lah = 99 AND pel(xx, pv).svu = 1 THEN lukka = 0
CASE 13
IF pel(xx, pv).svu = 1 THEN lukka = 0
CASE 14
IF pel(xx, pv).lah = 98 THEN lukka = 0
CASE 15
IF pel(xx, pv).lah = 97 AND pel(xx, pv).svu > 1 THEN lukka = 0
CASE 16
IF pel(xx, pv).svu > 1 THEN lukka = 0
CASE 17
IF pel(xx, pv).lah = 97 THEN lukka = 0
END SELECT
IF pel(xx, pv).spe = 13 THEN lukka = 1
IF lukka = 0 THEN EXIT FOR
NEXT zz
END SUB

SUB annanhal
kurso = 1
DIM ntemp(26) AS STRING * 1
haln(u(pv)) = ""
DO
FOR zz = 1 TO 26
COLOR 6
LOCATE 8, zz + 1: PRINT ntemp(zz);
NEXT zz
LOCATE 8, kurso + 1: COLOR 14: PRINT "Û"
wnd 1
IF ASC(me$) >= 33 AND kurso < 26 THEN ntemp(kurso) = me$: kurso = kurso + 1
IF me$ = CHR$(8) AND kurso > 1 THEN ntemp(kurso - 1) = "": kurso = kurso - 1
IF me$ = CHR$(32) AND kurso < 25 THEN ntemp(kurso) = " ": kurso = kurso + 1
IF me$ = CHR$(13) THEN EXIT DO
LOOP
mukka = kurso - 1
IF mukka = 0 THEN haln(u(pv)) = RTRIM$(l(u(pv))) + " Areena": GOTO mulkerooo
FOR zzz = 1 TO mukka
haln(u(pv)) = haln(u(pv)) + ntemp(zzz)
NEXT zzz
mulkerooo:
COLOR 6, 0
LOCATE 8, 2
PRINT haln(u(pv)); "   "
ERASE ntemp
END SUB

SUB annarahaa (arg%)
argle = 0
IF sponso(arg%, pv) <> 0 THEN
colchk 1
PRINT nimi(pv);
COLOR 6
PRINT ", ";
lay 145 + arg%
PRINT ": ";
IF sponso(arg%, pv) < 0 THEN COLOR 2 ELSE COLOR 14
PRINT LTRIM$(STR$(sponso(arg%, pv)))
PRINT
raha(pv) = raha(pv) + sponso(arg%, pv)
IF arg% <> 7 THEN sponso(arg%, pv) = 0
END IF
END SUB

SUB apulaisvalm
IF durso = 1 THEN COLOR 2 ELSE COLOR 5
LOCATE 31, 1: PRINT "ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ";
IF vast(pv) = 0 OR durso = 1 OR valb(1, pv) = 1 THEN COLOR 8 ELSE COLOR 15
PRINT CHR$(17);
IF vast(pv) = 0 OR durso = 2 OR valb(1, pv) = 1 THEN COLOR 8 ELSE COLOR 15
PRINT CHR$(16);
IF durso = 1 THEN COLOR 2 ELSE COLOR 5
PRINT "»";
LOCATE 32, 1: PRINT "º                                   ³        º";
LOCATE 33, 1: PRINT "ºÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´        º";
LOCATE 34, 1: PRINT "º                                   ³        º";
LOCATE 35, 1: PRINT "º                                   ³        º";
LOCATE 36, 1: PRINT "º                                   ³        º";
LOCATE 36, 1: PRINT "º                                   ³        º";
LOCATE 37, 1: PRINT "º                                   ÀÄÄÄÄÄÄÄÄº";
LOCATE 38, 1: PRINT "º                                            º";
LOCATE 39, 1: PRINT "ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼";
LOCATE 31, 3
IF durso = 1 THEN PRINT "APULAISVALMENTAJAN FLŽPPITAULU" ELSE PRINT "KATSOMOVALMENTAJAN FLŽPPITAULU"
IF durso = 1 THEN
LOCATE 38, 38: PRINT "A";
COLOR 7: PRINT "U";
COLOR 2: PRINT "TO:"
END IF
IF durso = 1 THEN COLOR 10 ELSE COLOR 13
LOCATE 32, 38: PRINT "MV:";
LOCATE 33, 38: PRINT "PU:";
LOCATE 34, 38: PRINT "HY:";
LOCATE 36, 38: PRINT "SI:";
SELECT CASE durso
CASE 1
temp% = 0: ccc = 0
FOR z = 1 TO lpl(pv)
IF pel(z, pv).svu = 0 THEN ccc = 1
NEXT z
FOR z = 1 TO lpl(pv)
IF pel(z, pv).ket > 0 AND pel(z, pv).kun < 0 THEN temp% = 1
IF pel(z, pv).ket > 0 AND pel(z, pv).kun <= -3 THEN temp% = 2
NEXT z
IF haikka = 1 THEN LOCATE 32, 4: lay 1
LOCATE 34
IF krapu(pv) = 0 THEN
IF kr <= 1 THEN gnome = actiox(pv): LOCATE , 2: lay 2
IF kr <= 1 THEN gnome = kausik(u(pv)): LOCATE , 2: lay 3
IF lpj(pv) > 0 THEN LOCATE , 2: lay 4
IF treeni(pv) = -1 THEN LOCATE , 2: lay 5
IF treeni(pv) = 1 THEN LOCATE , 2: lay 6
IF kiero2(kr) = 1 AND kiero2(kr + 1) = 0 THEN LOCATE , 2: lay 7
IF spx(3, pv) = 1 THEN LOCATE , 2: lay 8
IF spx(4, pv) = 1 THEN LOCATE , 2: lay 9
IF kuume(pv) = 1 THEN LOCATE , 2: lay 10
IF raha(pv) < 0 THEN LOCATE , 2: lay 11
IF temp% > 0 THEN LOCATE , 2: lay 11 + temp%
IF ccc = 1 THEN LOCATE , 2: lay 14
IF kapu(pv) = 0 THEN LOCATE , 2: lay 16
ELSE
LOCATE , 2: lay 15
END IF

LOCATE 38, 44: COLOR 14
IF automat(pv) = 0 THEN PRINT "EI" ELSE PRINT "ON"
CASE 2
COLOR 13
LOCATE 32, 2
PRINT RTRIM$(l(vast(pv)));
IF vast(pv) < 49 THEN PRINT " ("; RTRIM$(mana(man(vast(pv))).nam); ")"
IF vast(pv) > 48 THEN PRINT " ("; kk(vast(pv)); ")"
LOCATE 34
IF ohj(vast(pv)) = 0 AND vast(pv) < 49 THEN
FOR qwe = 1 TO 3
IF tauti(qwe, tox(vast(pv))) < 0 THEN LOCATE , 2: lax 77 + qwe
NEXT qwe
LOCATE , 2
IF tautip(vast(pv)) < 1 THEN lax 81 ELSE IF tautip(vast(pv)) > 1 THEN lax 82
LOCATE 38, 2

IF valb(1, pv) > 1 THEN
IF aape = 0 THEN
c = 5 - valb(1, pv)
d = (5 - valb(1, pv)) * 2
virhe(1) = mw(vast(pv)) + d * RND - c
virhe(2) = pw(vast(pv)) + d * RND * 4 - c
virhe(3) = hw(vast(pv)) + d * RND * 8 - c
END IF
END IF

IF valb(1, pv) <= 2 OR valb(1, pv) = 5 THEN
IF valb(1, pv) <= 2 THEN c = 26: d = 6 ELSE c = 10: d = 7
IF aape = 0 THEN aapee = INT(c * RND) + 1: aape = 1
arvox d
IF ohj(vast(pv)) = 0 THEN
IF valb(1, pv) = 2 THEN PRINT text ELSE PRINT UCASE$(RTRIM$(top(tox(vast(pv)), 1).nam)); " "; text
END IF
END IF
END IF
ww = 1
END SELECT
LOCATE 32, 42
IF durso = 1 THEN PRINT LTRIM$(STR$(mw(u(pv)))) ELSE PRINT LTRIM$(STR$(virhe(1)))
LOCATE 33, 42
IF durso = 1 THEN PRINT LTRIM$(STR$(pw(u(pv)))) ELSE PRINT LTRIM$(STR$(virhe(2)))
LOCATE 34, 42
IF durso = 1 THEN PRINT LTRIM$(STR$(hw(u(pv)))) ELSE PRINT LTRIM$(STR$(virhe(3)))
LOCATE 36, 42
IF vast(pv) < 49 THEN
IF durso = 1 THEN
PRINT LTRIM$(STR$(s(u(pv))));
IF sr(u(pv)) = 1 THEN PRINT "P";  ELSE IF sr(u(pv)) = 2 THEN PRINT "D" ELSE PRINT "M"
END IF
IF durso = 2 THEN
PRINT LTRIM$(STR$(s(vast(pv))));
IF sr(vast(pv)) = 1 THEN PRINT "P";  ELSE IF sr(vast(pv)) = 2 THEN PRINT "D" ELSE PRINT "M"
END IF
END IF
END SUB

SUB arpo (arf%)
IF pirtar(4) <> 723 THEN SYSTEM

untamo:
xx = INT(48 * RND) + 1

SELECT CASE arf%
CASE 1
IF ohj(xx) <> 0 THEN GOTO untamo
CASE 2
IF ohj(xx) <> 0 OR tautip(xx) <> 1 THEN GOTO untamo
END SELECT


END SUB

SUB arpol (cus%, ttt%, voiz%)
lukka = 1


SELECT CASE ttt%
CASE 1 TO 2
c = (cus% - 1) * 12
IF cus% < 3 THEN b = 12 ELSE b = 24

FOR z = 1 TO 20
xx = x(INT(b * RND) + 1 + c)

IF ohj(xx) = 0 AND ttt% = 1 THEN
IF tazo(xx) >= voiz% THEN lukka = 0: EXIT SUB
END IF

IF ohj(xx) = 0 AND ttt% = 2 THEN
IF tazo(xx) <= voiz% THEN lukka = 0: EXIT SUB
END IF
NEXT z

CASE 3, 4
IF ttt% = 3 THEN a = 1: b = 1 ELSE a = 12: b = -1
FOR zz = a TO voiz% STEP b
IF ohj(sijo(cus%, zz)) = 0 THEN xx = sijo(cus%, zz): lukka = 0: EXIT SUB
NEXT zz
END SELECT
END SUB

SUB arvox (arvob%)
OPEN "arvox\" + LTRIM$(STR$(arvob%)) + ".a2k" FOR INPUT AS #1
IF arvob% <> 6 AND arvob% <> 7 THEN INPUT #1, arse%
IF arvob% = 6 THEN c = aapee ELSE IF arvob% = 7 THEN c = aapee ELSE c = INT(arse% * RND) + 1
FOR b = 1 TO c
LINE INPUT #1, text
NEXT b
CLOSE #1
END SUB

SUB asetukset
kurso = 1
a = 2
xavier:
leq 28
haahaa 46
DO
FOR xx = 1 TO a
LOCATE 1 + xx * 2, 1
IF kurso = xx THEN COLOR , 6 ELSE COLOR , 0
lt "stg", xx
NEXT xx
COLOR , 0
LOCATE 3, 46
COLOR 7
PRINT LTRIM$(STR$(saver%)); "   "
FOR xx = 1 TO 3
IF xx = savertype% THEN COLOR 7 ELSE COLOR 8
LOCATE 5, 24 + (xx - 1) * 16
lt "stg", 10 + xx
NEXT xx
wnd 1
ku 1, 1, a
IF kurso = 1 THEN
IF me$ = CHR$(0) + CHR$(75) AND saver% > 10 THEN saver% = saver% - 1
IF me$ = CHR$(0) + CHR$(77) AND saver% < 180 THEN saver% = saver% + 1
END IF
IF kurso = 2 THEN
IF me$ = CHR$(0) + CHR$(75) AND savertype% > 1 THEN savertype% = savertype% - 1
IF me$ = CHR$(0) + CHR$(77) AND savertype% < 3 THEN savertype% = savertype% + 1
END IF
IF me$ = "?" THEN qelp 7: GOTO xavier
IF me$ = CHR$(27) THEN EXIT DO
LOOP
END SUB

SUB automa
DIM auto(1 TO 3, 1 TO 8, 2 TO 5) AS INTEGER
automv = 0
zz = 1
FOR qwe = 1 TO lpl(pv)
IF pel(qwe, pv).inj = 0 AND pel(qwe, pv).svu > 0 AND pel(qwe, pv).kun >= 0 THEN
SELECT CASE automv
CASE 0
IF pel(qwe, pv).ppp = 1 THEN automv = qwe
CASE ELSE
IF pel(qwe, pv).ppp = 1 THEN xx = automv: xxx = qwe: GOSUB verrokki
IF vert% = xxx THEN automv = xxx
END SELECT
END IF
NEXT qwe
FOR zz = 1 TO 3
FOR cupex = 2 TO 5
FOR qwe = 1 TO lpl(pv)
IF pel(qwe, pv).inj = 0 AND pel(qwe, pv).svu > 0 AND pel(qwe, pv).kun >= 0 THEN
IF zz = 1 THEN
IF cupex = 2 THEN a = 6 ELSE a = 4
END IF
IF zz > 1 THEN
IF cupex = 2 THEN a = 4 ELSE a = 2
END IF
IF pel(qwe, pv).ppp = cupex THEN
FOR b = 1 TO a
SELECT CASE auto(zz, b, cupex)
CASE 0
auto(zz, b, cupex) = qwe
GOTO lennokki
CASE ELSE
xx = auto(zz, b, cupex): xxx = qwe: GOSUB verrokki
IF vert% = xxx THEN
FOR c = a - 1 TO b STEP -1
auto(zz, c + 1, cupex) = auto(zz, c, cupex)
NEXT c
auto(zz, b, cupex) = qwe
GOTO lennokki
END IF
END SELECT
NEXT b
END IF
lennokki:
END IF
NEXT qwe
NEXT cupex
NEXT zz
maa(1, pv) = automv
a = 1: b = 1: c = 1
FOR qwe = 1 TO 3
FOR cupex = 1 TO 2
ketju(cupex, qwe, pv) = auto(1, a, 2): a = a + 1
IF qwe < 2 THEN ketju(cupex, qwe + 4, pv) = auto(2, b, 2): b = b + 1
IF qwe < 2 THEN ketju(cupex, qwe + 5, pv) = auto(3, c, 2): c = c + 1
NEXT cupex
NEXT qwe
FOR qwe = 1 TO 4
FOR cupex = 3 TO 5
IF dad(cupex, qwe) = 1 THEN ketju(cupex, qwe, pv) = auto(1, qwe, cupex)
IF qwe < 2 THEN
IF dad(cupex, qwe + 4) = 1 THEN ketju(cupex, qwe + 4, pv) = auto(2, qwe, cupex)
END IF
IF qwe < 2 THEN
IF dad(cupex, qwe + 5) = 1 THEN ketju(cupex, qwe + 5, pv) = auto(3, qwe, cupex)
END IF
NEXT cupex
NEXT qwe
ERASE auto

IF automat(pv) = 1 THEN
FOR zz = 1 TO 3
IF pel(suosikki(2, zz, pv), pv).inj = 0 THEN kapu(pv) = suosikki(2, zz, pv): EXIT FOR
NEXT zz
END IF



EXIT SUB
verrokki:
IF zz = 1 THEN
ww = pel(xx, pv).psk + pel(xx, pv).plus
IF pel(xx, pv).spe = 4 THEN ww = 99
www = pel(xxx, pv).psk + pel(xxx, pv).plus
IF pel(xxx, pv).spe = 4 THEN www = 99
END IF
IF zz = 2 THEN
ww = pel(xx, pv).psk + pel(xx, pv).yvo + pel(xx, pv).plus
www = pel(xxx, pv).psk + pel(xxx, pv).yvo + pel(xxx, pv).plus
END IF
IF zz = 3 THEN
ww = pel(xx, pv).psk + pel(xx, pv).avo + pel(xx, pv).plus
www = pel(xxx, pv).psk + pel(xxx, pv).avo + pel(xxx, pv).plus
END IF
SELECT CASE ww
CASE IS > www
vert% = xx
CASE IS < www
vert% = xxx
CASE www
SELECT CASE pel(xx, pv).age
CASE IS <= pel(xxx, pv).age
vert% = xx
CASE IS > pel(xxx, pv).age
vert% = xxx
END SELECT
END SELECT
RETURN
END SUB

SUB baaorsmuutos
borsinit 1
a = 1
IF lastbors > 10 THEN
suolakurkku:
FOR xx = a TO lastbors
IF INT(101 * RND) > 80 - bel(xx).psk THEN
FOR smut = xx TO lastbors - 1
bel(smut) = bel(smut + 1)
NEXT smut
lastbors = lastbors - 1
a = xx: GOTO suolakurkku
END IF
NEXT xx
END IF
FOR xx = 1 TO 10
IF INT(101 * RND) > 50 THEN
firstborsgene = lastbors + 1: borsgenex = lastbors + 1: borsgene
END IF
NEXT xx
borsinit 2
END SUB

SUB bors
borsinit 1
curso = 1
kurso = 1
IF lastbors < 10 THEN
firstborsgene = lastbors + 1
borsgenex = 10
borsgene
END IF
DIM sortb(1 TO lastbors) AS INTEGER
DIM sortc(1 TO 32) AS INTEGER
DIM borschtext(1 TO 17 + plkm - 1) AS STRING
FOR c = 1 TO 17
IF plkm = 1 THEN borschtext(c) = kansap(c) ELSE borschtext(c) = kansal(c)
NEXT c
IF plkm > 1 THEN
d = 1
FOR c = 1 TO plkm
IF c <> pv THEN borsch(d + 17) = c: borschtext(d + 17) = nimi(c): d = d + 1
NEXT c
END IF
alkubors:
COLOR 14, 0
CLS
FOR qwe = 1 TO UBOUND(borschtext)
IF curso = qwe THEN COLOR 14, 6 ELSE COLOR 14, 0
PRINT borschtext(qwe);
COLOR , 0: PRINT "  ";
NEXT qwe
haahaa 3
LOCATE 4, 1
lay 35
IF curso < 18 THEN sortbors 1 ELSE sortbors 2
IF kurso < 1 THEN kurso = 1
IF curso < 18 THEN
IF kurso > lb THEN kurso = lb
END IF
IF curso > 17 THEN
IF kurso > lpl(borsch(curso)) THEN kurso = lpl(borsch(curso))
END IF
DO
SELECT CASE curso
CASE IS < 18
IF lb > 0 THEN
IF kurso < 18 THEN
IF lb < 33 THEN grr = lb ELSE grr = 33
FOR xx = 1 TO grr
IF kurso = xx THEN COLOR , 6 ELSE COLOR , 0
LOCATE xx + 5, 1: printpel 5
NEXT xx
END IF
IF kurso > 17 AND kurso + 16 <= lb THEN
COLOR , 6: LOCATE 22, 1: xx = kurso: printpel 5
COLOR , 0
FOR xx = kurso - 1 TO kurso - 16 STEP -1
LOCATE 22 - (kurso - xx), 1: printpel 5
NEXT xx
IF lb < kurso + 16 THEN grr = lb ELSE grr = kurso + 16
FOR xx = kurso + 1 TO grr
LOCATE 22 + (xx - kurso), 1: printpel 5
NEXT xx
END IF
IF kurso > 17 AND kurso + 16 > lb THEN
zzz = 1
IF lb - 33 < 1 THEN grr = 1 ELSE grr = lb - 32
FOR xx = grr TO lb
IF kurso = xx THEN COLOR , 6 ELSE COLOR , 0
LOCATE 5 + zzz, 1: printpel 5
zzz = zzz + 1
NEXT xx
END IF
END IF
CASE IS > 17
FOR zz = 1 TO lpl(borsch(curso))
IF zz = kurso THEN COLOR , 6 ELSE COLOR , 0
xx = sortc(zz)
LOCATE zz + 5, 1: printpel 2
NEXT zz
END SELECT
wnd 1
IF me$ = CHR$(27) THEN COLOR , 0: EXIT DO
IF me$ = "?" THEN qelp (3): GOTO alkubors
ku 4, 1, UBOUND(borschtext)
IF curso <> kusek THEN GOTO alkubors
SELECT CASE curso
CASE IS < 18
ku 1, 1, lb
IF me$ = "o" AND actiox(pv) > 0 AND lpl(pv) < 32 AND lb > 0 THEN COLOR , 0: xx = kurso: sopimusext 2: GOTO alkubors
IF me$ = "+" AND kurso + 10 <= lb THEN kurso = kurso + 10
IF me$ = "-" AND kurso - 10 >= 1 THEN kurso = kurso - 10
COLOR , 0
CASE IS > 17
ku 1, 1, lpl(borsch(curso))
IF actiox(pv) > 0 THEN
IF pel(sortc(kurso), borsch(curso)).ket = 0 THEN
IF me$ = "o" AND lpl(pv) < 32 AND lpl(borsch(curso)) > 5 AND pel(sortc(kurso), borsch(curso)).svu = 0 THEN COLOR , 0: ote = borsch(curso): xx = sortc(kurso): sopimusext 1: GOTO alkubors
IF me$ = "o" AND lpl(pv) < 32 AND lpl(borsch(curso)) > 5 AND pel(sortc(kurso), borsch(curso)).svu > 0 THEN COLOR , 0: ote = borsch(curso): osto2: GOTO alkubors
END IF
END IF
END SELECT
LOOP
COLOR , 0
ERASE sortb, sortc, borschtext
borsinit 2
END SUB

SUB borsgene
FOR xxx = firstborsgene TO borsgenex
nats = keisix(1, INT(100 * RND) + 1)
rela
bel(xxx) = blanko
DIM pros(1 TO 200) AS INTEGER
c = 1
d = 1
FOR qwe = 1 TO 200
IF borssix(c, nats) > d THEN pros(qwe) = c: d = d + 1: GOTO purkka
IF borssix(c, nats) = d THEN pros(qwe) = c: d = 1: c = c + 1
purkka:
NEXT qwe
bel(xxx).psk = ((pros(INT(200 * RND) + 1)) * 2) + INT(3 * RND) - 1
ERASE pros
IF bel(xxx).psk > 6 THEN
temp% = INT(100 * RND) + 1
IF temp% < 11 THEN bel(xxx).spe = 8 ELSE IF temp% < 16 THEN bel(xxx).spe = 5 ELSE IF temp% < 19 THEN bel(xxx).spe = 2 ELSE IF temp% < 22 AND bel(xxx).age >= 30 THEN bel(xxx).spe = 1
END IF

NEXT xxx
lastbors = xxx - 1
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

SUB budget
kurso = 1
IF pirtar(5) <> 509 THEN SYSTEM
kaarevakyrpa:
leq 3
haahaa 13
COLOR 6
LOCATE 3, 30: PRINT "1   2   3   4   5"
LOCATE 13, 30: PRINT "1   2   3   4   5"
DO
FOR a = 1 TO 5
LOCATE 2 + a * 2, 1
IF kurso = a THEN COLOR 14, 6 ELSE COLOR 14, 0
lay a + 79
LOCATE , 30
FOR b = 1 TO 5
IF valb(a, pv) = b THEN COLOR 10, 0 ELSE COLOR 2, 0
IF valb(a, pv) = b THEN PRINT "²";  ELSE PRINT "°";
IF b < 5 THEN COLOR 2: PRINT "°°°";
NEXT b
LOCATE , 50: COLOR 15: PRINT LTRIM$(STR$(valbh(vai(2, pv), a, valb(a, pv))));
IF a < 5 THEN PRINT "/KR    ";  ELSE PRINT "/P/KR    ";
NEXT a
FOR zz = 16 TO 20
LOCATE zz, 1: PRINT STRING$(79, " ")
NEXT zz
LOCATE 16: COLOR 12
lax 15 + valb(kurso, pv) + (kurso - 1) * 5
wnd 1
ku 1, 1, 5
IF me$ = CHR$(0) + CHR$(75) AND valb(kurso, pv) > 1 THEN valb(kurso, pv) = valb(kurso, pv) - 1
IF me$ = CHR$(0) + CHR$(77) AND valb(kurso, pv) < 5 THEN valb(kurso, pv) = valb(kurso, pv) + 1
IF me$ = "?" THEN qelp 20: GOTO kaarevakyrpa
IF me$ = CHR$(13) THEN EXIT DO
LOOP
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

SUB cuparpo
cround = cround + 1
leggi = 1
SELECT CASE cround
CASE 1 TO 6
ccc = cupjouk(cround)
FOR xx = 1 TO cuparpokerto
arpoox:
arpo1 = INT(ccc * RND) + 1
arpo2 = INT(ccc * RND) + 1
IF arpo1 = arpo2 THEN GOTO arpoox
SWAP cup(arpo1), cup(arpo2)
NEXT xx
FOR xx = 1 TO plkm
mukc(xx) = 0
NEXT xx
FOR xx = 1 TO cupjouk(cround)
IF ohj(cup(xx)) <> 0 THEN mukc(ohj(cup(xx))) = 1
NEXT xx
CLS
cupohjelma 1
pjn
CASE 7
cupjuhla
END SELECT
END SUB

SUB cupjuhla
xx = cup(1)
IF ohj(xx) <> 0 THEN SCREEN 13: kuva ("pysti3"): SCREEN 0: WIDTH 80, 43

CLS
lax 194 + INT(3 * RND)
PRINT

lentti 1, 9
PRINT : COLOR 6: PRINT "...": PRINT
lentti 1, 23
PRINT
IF ohj(xx) = 0 THEN tmankom 6 ELSE komme 11
cupvoittaja = cup(1)
tsaav(5, cupvoittaja) = tsaav(5, cupvoittaja) + 1
IF ohj(cupvoittaja) <> 0 THEN saav(7, ohj(cupvoittaja)) = saav(7, ohj(cupvoittaja)) + 1
PRINT
FOR pv = 1 TO plkm
sponso(7, pv) = 0
IF cup(1) = u(pv) THEN annarahaa 6
NEXT pv
pjn
END SUB

SUB cupohjelma (clurk%)
COLOR 15
PRINT "PEKKALANDIAN CUPIN ";
SELECT CASE cround
CASE 1, 2, 3
PRINT LTRIM$(STR$(cround)); ". KIERROKSEN OTTELUPARIT:"
CASE 4
PRINT "1/4-FINAALIT:"
CASE 5
PRINT "SEMIFINAALIT:"
CASE 6
PRINT "FINAALI:"
END SELECT
COLOR 7
PRINT
FOR xx = 1 TO cupjouk(cround) / 2
COLOR 8
IF cup(xx * 2 - 1) < 49 THEN COLOR jkolo(sr(cup(xx * 2 - 1)))
ccc = ohj(cup(xx * 2 - 1)): colchk 4
PRINT l(cup(xx * 2 - 1)); " ("; kk(cup(xx * 2 - 1)); ")";
LOCATE , 29
COLOR 7
PRINT " - ";
COLOR 8
IF cup(xx * 2) < 49 THEN COLOR jkolo(sr(cup(xx * 2)))
ccc = ohj(cup(xx * 2)): colchk 4
PRINT l(cup(xx * 2)); " ("; kk(cup(xx * 2)); ")"
NEXT xx
IF clurk% = 1 THEN
PRINT
FOR pv = 1 TO plkm
IF mukc(pv) = 0 THEN sponso(6, pv) = 0: sponso(7, pv) = 0
IF cround > 1 AND mukc(pv) = 1 THEN
annarahaa 7
sponso(17, pv) = 0
IF cround = 5 THEN sponso(16, pv) = 0
END IF
IF cround <= 5 AND mukc(pv) = 0 THEN
annarahaa 16
END IF
IF cround = 2 AND mukc(pv) = 0 THEN annarahaa 17
NEXT pv
END IF
END SUB

SUB dap (dep%)
SELECT CASE dep%
CASE 1
gnome = loukka(lukka, valb(4, pv))
IF gnome = -1 THEN lax 115 ELSE lax 116
lt "i", lukka
IF gnome > 0 THEN pel(xx, pv).inj = gnome + 1 ELSE pel(xx, pv).inj = gnome
CASE 2
gnome = pelki(lukka)
lax 117
lt "pk", lukka
pel(xx, pv).inj = gnome + 1000
CASE 3
muud = INT(45 * RND) + 1
al 2
IF lukka = 0 THEN
IF pel(xx, pv).psk + mood(muud, 1) > 0 THEN
IF mood(muud, 1) > 0 THEN lax 120 ELSE lax 121
lt "m", muud
pel(xx, pv).plus = mood(muud, 1)
pel(xx, pv).kest = INT(mood(muud, 3) * RND) + mood(muud, 2) + 1
END IF
END IF
END SELECT
PRINT
END SUB

SUB ehllopturmaar (murder%)
SELECT CASE murder%
CASE 1
DIM kak(5) AS INTEGER
DIM kaks(5) AS INTEGER
staulehlmaar
FOR qwe = 1 TO 5
FOR cupex = 1 TO 4
IF cupex <= plkm THEN muke(cupex) = 0
IF es((qwe - 1) * 4 + cupex) = 1 THEN elt(qwe) = ex((qwe - 1) * 4 + cupex)
IF es((qwe - 1) * 4 + cupex) = 2 THEN kak(qwe) = (qwe - 1) * 4 + cupex
NEXT cupex
NEXT qwe
FOR xx = 1 TO 4
FOR xxx = xx + 1 TO 5
SELECT CASE ep(kak(xx))
CASE IS > ep(kak(xxx))
kaks(xxx) = kaks(xxx) + 1
CASE IS < ep(kak(xxx))
kaks(xx) = kaks(xx) + 1
CASE ep(kak(xxx))
SELECT CASE egf(kak(xx)) - ega(kak(xx))
CASE IS > egf(kak(xxx)) - ega(kak(xxx))
kaks(xxx) = kaks(xxx) + 1
CASE IS < egf(kak(xxx)) - ega(kak(xxx))
kaks(xx) = kaks(xx) + 1
CASE egf(kak(xxx)) - ega(kak(xxx))
IF egf(kak(xx)) >= egf(kak(xxx)) THEN kaks(xxx) = kaks(xxx) + 1 ELSE kaks(xx) = kaks(xx) + 1
END SELECT
END SELECT
NEXT xxx
NEXT xx
FOR xx = 1 TO 5
IF kaks(xx) = 0 THEN elt(6) = ex(kak(xx)): EXIT FOR
NEXT xx
ERASE kak, kaks
CLS
COLOR 6: PRINT "EHL:N LOPPUTURNAUKSEEN OVAT SELVINNEET LOHKOVOITTAJINA"
PRINT
FOR xx = 1 TO 6
COLOR 2
IF ohj(elt(xx)) <> 0 THEN muke(ohj(elt(xx))) = 1: otte(4, 2, ohj(elt(xx))) = otte(4, 2, ohj(elt(xx))) + 1: ccc = ohj(elt(xx)): colchk 4
PRINT l(elt(xx)); " ("; kk(elt(xx)); ")"
IF xx = 5 THEN PRINT : COLOR 6: PRINT "SEKŽ PARHAANA LOHKOKAKKOSENA": PRINT
NEXT xx
PRINT
FOR pv = 1 TO plkm
IF muke(pv) = 1 THEN
annarahaa 9
sponso(18, pv) = 0
END IF
IF muke(pv) = 0 THEN
annarahaa 18
sponso(8, pv) = 0
sponso(9, pv) = 0
END IF
NEXT pv
pjn
CASE 2

maarpalk "elt"
tnimi(1) = "EHL:N LOPPUTURNAUS"
FOR xx = 1 TO 6
tx(xx) = elt(xx)
NEXT xx
naaturnaus = 1
turnaus
FOR xx = 1 TO 6
IF ts(xx) = 1 THEN EXIT FOR
NEXT xx
emestari = tx(xx)
IF ohj(emestari) <> 0 THEN SCREEN 13: kuva ("pysti2"): SCREEN 0: WIDTH 80, 43
CLS
COLOR 6: PRINT "JŽŽKIEKON EUROOPAN MESTARI ON"
PRINT : COLOR 14
PRINT RTRIM$(l(emestari)); " ("; kk(emestari); ")"
PRINT
FOR pv = 1 TO plkm
IF emestari = u(pv) THEN annarahaa 8
IF muke(pv) = 1 THEN muke(pv) = 0
sponso(8, pv) = 0
NEXT pv
xx = emestari
IF emestari < 49 THEN
tsaav(4, xx) = tsaav(4, xx) + 1
IF ohj(xx) <> 0 THEN saav(4, ohj(xx)) = saav(4, ohj(xx)) + 1
lentti 1, 22
PRINT
IF ohj(emestari) = 0 THEN tmankom 5 ELSE komme 10
END IF
IF emestari > 48 THEN lax 197 + INT(3 * RND)
pjn
END SELECT
END SUB

SUB erikoisp (fuk%)
IF pirtar(3) <> 101 THEN SYSTEM
IF eri(fuk%) = 0 THEN
DIM teksti(1 TO 1) AS STRING * 500
OPEN "data\monty.mhz" FOR RANDOM AS #1
GET #1, fuk%, monty
CLOSE #1
OPEN "data\p.mhz" FOR RANDOM AS #1
DIM sel(1 TO monty.montako) AS pelaaja
FOR xx = 0 TO monty.montako - 1
GET #1, monty.malka + xx, sel(xx + 1)
NEXT xx
CLOSE #1
IF lpl(pv) <= 32 - monty.montako THEN
IF sel(1).ppp = 1 THEN b = 2 ELSE b = 1
a = valb(b, pv) + valb(4, pv) + valb(5, pv) * 2 - sel(1).psk
IF a >= -4 THEN
IF fuk% > 27 THEN eri(fuk%) = 1
lt "p", fuk%
PRINT
wnd 2
IF me$ = "k" THEN lt "kylla", fuk% ELSE lt "ei", fuk%
IF me$ = "k" THEN
eri(fuk%) = 1
FOR z = 1 TO monty.montako
pel(lpl(pv) + z, pv) = sel(z)
NEXT z
lpl(pv) = lpl(pv) + monty.montako
IF fuk% = 30 THEN pel(lpl(pv), pv).svu = pel(lpl(pv), pv).svu + INT(25 * RND) + 1
END IF
END IF
END IF
ERASE sel
END IF
END SUB

SUB euromaar
ekr = 1
FOR xx = 1 TO 20
ex(xx) = 0
ep(xx) = 0
egf(xx) = 0
ega(xx) = 0
NEXT xx
FOR zz = 1 TO plkm
IF karki(1) = u(zz) OR karki(2) = u(zz) OR cupvoittaja = u(zz) THEN muke(zz) = 1
NEXT zz
xx = INT(19 * RND) + 1
FOR xx = 1 TO 20
IF xx < 3 THEN ex(xx) = karki(xx)
IF xx = 3 AND kausi > 1999 THEN
IF cupvoittaja <> karki(1) AND cupvoittaja <> karki(2) THEN ex(xx) = cupvoittaja: GOTO urpo
ex(xx) = karki(3)
IF ohj(karki(3)) <> 0 THEN muke(ohj(karki(3))) = 1
GOTO urpo
END IF
IF kausi = 1999 THEN
IF xx = 3 THEN ex(xx) = 3
IF ohj(3) <> 0 THEN muke(ohj(3)) = 1
END IF
urpo:
IF xx > 3 THEN ex(xx) = 45 + xx
NEXT xx
FOR xx = 1 TO 1000
a = INT(20 * RND) + 1
b = INT(20 * RND) + 1
IF a <> b THEN SWAP ex(a), ex(b)
NEXT xx
END SUB

SUB faarao
a = 0

mor u(pv), -konkurssi(pv)

FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).inj = 0 AND pel(xx, pv).spe <> 13 THEN
IF 200 * RND < pel(xx, pv).ego * (konkurssi(pv) - 1) THEN
IF a = 0 THEN a = 1: leq 33
lax 216
PRINT
pel(xx, pv).inj = 3333
END IF
END IF
NEXT xx

IF a = 1 THEN pjn
END SUB

SUB fbimiehet
leq 5
lax 46
PRINT
lax 134
PRINT
lentti 1, 10
xxx = CSRLIN: komme 5
PRINT
lentti 1, 11
xxx = CSRLIN: komme 6
PRINT
lentti 1, 12
PRINT
lax 135
poispel
pjn
END SUB

SUB gameday
testink = 0
testing = 0

CLS : COLOR 6
IF pirtar(2) <> 432 THEN SYSTEM
SELECT CASE kiero(kr)
CASE 4

d = INT(11 * RND) + 40
IF d MOD 2 <> 0 THEN d = d + 1
FOR qwe = 9 TO d STEP 2
hottentot:
xx = INT(48 * RND) + 1
IF ohj(x(xx)) <> 0 OR hotte(x(xx)) <> 0 THEN GOTO hottentot
hotte(x(xx)) = 1
hott(qwe) = x(xx)
pygmi:
a = INT(101 * RND)
SELECT CASE x(xx)
CASE 1 TO 12
IF a < 3 THEN b = 23: c = 25 ELSE IF a < 20 THEN b = 12: c = 13 ELSE IF a < 70 THEN b = 12: c = 1 ELSE b = 17: c = 49
CASE 13 TO 24
IF a < 15 THEN b = 23: c = 25 ELSE IF a < 30 THEN b = 15: c = 72 ELSE IF a < 85 THEN b = 12: c = 13 ELSE b = 12: c = 1
CASE 25 TO 48
IF a < 30 THEN b = 14: c = 72 ELSE IF a < 80 THEN b = 24: c = 25 ELSE b = 12: c = 13
END SELECT
xxx = INT(b * RND) + c
IF xxx < 49 THEN xxx = x(xxx)
IF ohj(xxx) <> 0 OR hotte(xxx) <> 0 THEN GOTO pygmi
hotte(xxx) = 1
hott(qwe + 1) = xxx
NEXT qwe
PRINT "HARJOITUSOTTELUITA:"
naytaott 4
pjn
CLS
COLOR 6
PRINT "HARJOITUSOTTELUITA:"
LOCATE 3
FOR cupex = 1 TO 43 STEP 2
IF hott(cupex) <> 0 AND hott(cupex + 1) <> 0 THEN
od(1) = hott(cupex)
od(2) = hott(cupex + 1)
ylmaar
ottpel
ottul
END IF
NEXT cupex
pjn
FOR vu = 1 TO plkm
pv = vuoro(vu)
IF vast(pv) <> 0 THEN report: vast(pv) = 0
NEXT vu

CASE 1
FOR a = 1 TO 48
FOR b = 9 TO 1 STEP -1
kunto(b + 1, a) = kunto(b, a)
NEXT b
NEXT a

PRINT "RUNKOSARJOJEN OTTELUT:"
naytaott 1
pjn
CLS
COLOR 6: PRINT "RUNKOSARJOJEN TULOKSET:"
LOCATE 3
FOR qwe = 1 TO 4
kolo = jkolo(qwe)
IF qwe = 1 THEN LOCATE 3 ELSE IF qwe = 2 THEN LOCATE 10 ELSE IF qwe = 3 THEN LOCATE 17 ELSE LOCATE 24
FOR cupex = 1 TO 6
od(1) = x(fxt(cupex * 2 - 1, ki) + (qwe - 1) * 12)
od(2) = x(fxt(cupex * 2, ki) + (qwe - 1) * 12)
ylmaar
ottpel
ottul
otmuut 1
NEXT cupex
NEXT qwe

FOR pv = 1 TO plkm
IF veika(1, pv) <> 0 THEN veiktark: veika(1, pv) = 0
NEXT pv

pjn
ot = ot + 1
FOR xx = 1 TO 48
IF valm(xx) = 1 THEN tre(xx) = tre(xx) + .0025 ELSE IF valm(xx) = 2 THEN tre(xx) = tre(xx) - .0025
NEXT xx
FOR vu = 1 TO plkm
pv = vuoro(vu)
otte(sr(u(pv)), 1, pv) = otte(sr(u(pv)), 1, pv) + 1
report
sattuma
NEXT vu
uutisia
ki = ki + 1: IF ki = 45 THEN ki = 1

CASE 42, 44, 46
CLS
FOR a = 1 TO 3
IF a = 1 THEN LOCATE 1, 1 ELSE IF a = 2 THEN LOCATE 8, 1 ELSE LOCATE 14, 1
SELECT CASE kiero(kr)
CASE 42
PRINT "1/4-FINAALIOTTELUT, "; taulux(a)
CASE 44
PRINT "SEMIFINAALIOTTELUT, "; taulux(a)
CASE 46
PRINT "FINAALIOTTELU";
IF a = 1 OR a = 3 THEN PRINT "T, ";  ELSE PRINT ",";
PRINT taulux(a)
END SELECT
NEXT a
naytaott 1
pjn
CLS
COLOR 6
FOR a = 1 TO 3
IF a = 1 THEN LOCATE 1, 1 ELSE IF a = 2 THEN LOCATE 8, 1 ELSE LOCATE 14, 1
SELECT CASE kiero(kr)
CASE 42
PRINT "1/4-FINAALITULOKSET, "; taulux(a)
CASE 44
PRINT "SEMIFINAALITULOKSET, "; taulux(a)
CASE 46
PRINT "FINAALITULO";
IF a = 1 OR a = 3 THEN PRINT "KSET, ";  ELSE PRINT "S,";
PRINT taulux(a)
END SELECT
NEXT a
FOR qwe = 1 TO 3
kolo = jkolo(qwe)
IF qwe = 1 THEN LOCATE 3 ELSE IF qwe = 2 THEN LOCATE 10 ELSE LOCATE 16
FOR cupex = 1 TO pep(qwe, pround).joukk / 2
IF pwin(plex(qwe, pfxt(pround, pkr, qwe, cupex * 2 - 1))) < 3 AND pwin(plex(qwe, pfxt(pround, pkr, qwe, cupex * 2))) < 3 THEN

od(1) = plex(qwe, pfxt(pround, pkr, qwe, cupex * 2 - 1))
od(2) = plex(qwe, pfxt(pround, pkr, qwe, cupex * 2))
ylmaar
ottpel
ottul
otmuut 3
END IF
NEXT cupex
NEXT qwe
pjn
FOR xx = 1 TO plkm
IF mukp(xx) = 1 THEN otte(sr(u(xx)), 2, xx) = otte(sr(u(xx)), 2, xx) + 1
NEXT xx
FOR vu = 1 TO plkm
pv = vuoro(vu)
IF mukp(pv) = 1 THEN
report
sattuma
END IF
NEXT vu
pkr = pkr + 1
temp% = 0

CASE 2

PRINT "EHL:N OTTELUT OVAT SEURAAVAT:"
naytaott 3
pjn
CLS
COLOR 6: PRINT "EHL:N TULOKSET OVAT SEURAAVAT:": PRINT : kolo = 12
FOR qwe = 1 TO 5
FOR cupex = 1 TO 2
od(1) = ex((efxt(ekr, cupex * 2 - 1)) + (qwe - 1) * 4)
od(2) = ex((efxt(ekr, cupex * 2)) + (qwe - 1) * 4)
nn1 = efxt(ekr, cupex * 2 - 1) + (qwe - 1) * 4
mm1 = efxt(ekr, cupex * 2) + (qwe - 1) * 4
ylmaar
ottpel
ottul
otmuut 2
NEXT cupex
PRINT
NEXT qwe
pjn
eot = eot + 1
ekr = ekr + 1
FOR xx = 1 TO plkm
IF muke(xx) = 1 THEN otte(4, 1, xx) = otte(4, 1, xx) + 1
NEXT xx
FOR vu = 1 TO plkm
pv = vuoro(vu)
IF muke(pv) = 1 THEN
report
sattuma
END IF
NEXT vu
IF eot = 6 THEN ehllopturmaar 1

CASE 3

DIM tempcup(1 TO cupjouk(cround + 1)) AS INTEGER
GOSUB yrmeakakka
FOR cupex = 1 TO cupjouk(cround) / 2
COLOR 8
IF cup(cupex * 2 - 1) < 49 THEN COLOR jkolo(sr(cup(cupex * 2 - 1)))
ccc = ohj(cup(cupex * 2 - 1)): colchk 4
PRINT l(cup(cupex * 2 - 1)); " ("; kk(cup(cupex * 2 - 1)); ")";
LOCATE , 12
COLOR 7
PRINT " - ";
COLOR 8
IF cup(cupex * 2) < 49 THEN COLOR jkolo(sr(cup(cupex * 2)))
ccc = ohj(cup(cupex * 2)): colchk 4
PRINT l(cup(cupex * 2)); " ("; kk(cup(cupex * 2)); ")"
NEXT cupex
pjn
CLS
GOSUB yrmeakakka
FOR cupex = 1 TO cupjouk(cround) / 2
kolo = 12
od(1) = cup(cupex * 2 - 1)
od(2) = cup(cupex * 2)
ylmaar
ottpel
ottul
IF leggi = 1 THEN
leg(od(1)) = gl(od(1))
leg(od(2)) = gl(od(2))
END IF
SELECT CASE leggi
CASE 1
SWAP cup(cupex * 2 - 1), cup(cupex * 2)
CASE 2
IF gl(cup(cupex * 2 - 1)) + leg(cup(cupex * 2 - 1)) > gl(cup(cupex * 2)) + leg(cup(cupex * 2)) THEN tempcup(cupex) = cup(cupex * 2 - 1) ELSE tempcup(cupex) = cup(cupex * 2)
LOCATE 2 + cupex, 54
COLOR 7
PRINT "Ä> ";
COLOR 8
IF tempcup(cupex) < 49 THEN COLOR jkolo(sr(tempcup(cupex)))
PRINT l(tempcup(cupex));
SELECT CASE tempcup(cupex)
CASE cup(cupex * 2 - 1)
PRINT " ("; LTRIM$(STR$(gl(cup(cupex * 2 - 1)) + leg(cup(cupex * 2 - 1)))); "-"; LTRIM$(STR$(gl(cup(cupex * 2)) + leg(cup(cupex * 2)))); ")"
CASE cup(cupex * 2)
PRINT " ("; LTRIM$(STR$(gl(cup(cupex * 2)) + leg(cup(cupex * 2)))); "-"; LTRIM$(STR$(gl(cup(cupex * 2 - 1)) + leg(cup(cupex * 2 - 1)))); ")"
END SELECT
END SELECT
NEXT cupex
IF leggi = 2 THEN
FOR xx = 1 TO UBOUND(tempcup)
cup(xx) = tempcup(xx)
NEXT xx
END IF
pjn
FOR vu = 1 TO plkm
pv = vuoro(vu)
IF mukc(pv) = 1 THEN
report
sattuma
END IF
NEXT vu
ERASE tempcup
leggi = leggi + 1
EXIT SUB
END SELECT
EXIT SUB

yrmeakakka:
COLOR 15
PRINT "PEKKALANDIAN CUPIN ";
SELECT CASE cround
CASE 1, 2, 3
PRINT LTRIM$(STR$(cround)); ". KIERROS ";
CASE 4
PRINT "1/4-FINAALIT:";
CASE 5
PRINT "SEMIFINAALIT:";
CASE 6
PRINT "FINAALI:";
END SELECT
COLOR 15
PRINT "("; LTRIM$(STR$(leggi)); ". OSAOTTELU)"
PRINT
RETURN
END SUB

SUB gamedayhaara
DIM gl(1 TO 86) AS INTEGER
DIM ylm(1 TO 2, 1 TO 86) AS LONG
DIM ja(1 TO 86) AS INTEGER
DIM maalix(1 TO 40, 1 TO plkm) AS INTEGER
DIM maali(1 TO 40, 1 TO plkm) AS STRING
DIM syotto(1 TO 40, 1 TO 2, 1 TO plkm) AS STRING
DIM yvoima(1 TO 40, 1 TO plkm) AS INTEGER
DIM tulos(1 TO 24) AS INTEGER

FOR pv = 1 TO plkm
krapu(pv) = 0
NEXT pv

SELECT CASE kiero(kr)
CASE 1, 2, 3, 42, 44, 46
gameday
CASE 99
kausikorttimaar
CASE 4
kausikorttimaar
gameday
ERASE hott, hotte

CASE 98
joulutauko
CASE 22
ehllopturmaar 2
CASE 41, 43, 45
playoffplajays kiero(kr) - 40
CASE 47
ERASE gl, ja, ylm, maali, maalix, syotto, tulos, yvoima


CHAIN "ilez5"
END SELECT

FOR pv = 1 TO plkm
IF boikotti(pv) > 0 THEN boikotti(pv) = boikotti(pv) - 1

temp% = 0
FOR xx = 1 TO lpl(pv)
IF kiero(kr) <> 99 AND kiero(kr) <> 4 THEN
IF pel(xx, pv).ket = 0 OR mukax(pv) = 0 THEN
IF pel(xx, pv).inj = 0 OR pel(xx, pv).inj > 1000 AND pel(xx, pv).inj < 2000 THEN
IF pel(xx, pv).age > 33 THEN a = 33 ELSE a = pel(xx, pv).age
IF pel(xx, pv).kun < kuntomax(a) THEN pel(xx, pv).kun = pel(xx, pv).kun + 2
IF pel(xx, pv).kun > kuntomax(a) THEN pel(xx, pv).kun = kuntomax(a)
END IF
END IF
END IF
SELECT CASE pel(xx, pv).inj
CASE 1 TO 999, 2001 TO 2999
pel(xx, pv).kun = -2
pel(xx, pv).inj = pel(xx, pv).inj - 1
IF pel(xx, pv).inj = 2000 THEN pel(xx, pv).inj = 0
CASE 9001
pel(xx, pv).inj = 0
pel(xx, pv).kun = pel(xx, pv).kun - 2
END SELECT
IF mukax(pv) = 2 THEN
IF pel(xx, pv).ket > 0 THEN
SELECT CASE inte(pv)
CASE 0
IF pel(xx, pv).age > 33 THEN a = 33 ELSE a = pel(xx, pv).age
IF pel(xx, pv).kun < kuntomax(a) THEN pel(xx, pv).kun = pel(xx, pv).kun + 1
CASE 2
pel(xx, pv).kun = pel(xx, pv).kun - 2
END SELECT
IF pel(xx, pv).ket > 1 THEN pel(xx, pv).kun = pel(xx, pv).kun - 1
END IF
END IF
IF pel(xx, pv).plus <> 0 THEN
IF pel(xx, pv).kest > 0 THEN pel(xx, pv).kest = pel(xx, pv).kest - 1
IF pel(xx, pv).kest = 0 THEN pel(xx, pv).plus = 0
END IF
IF pel(xx, pv).kun < -6 AND pel(xx, pv).inj = 0 THEN
IF temp% = 0 THEN leq 5
temp% = 1
lax 110
pel(xx, pv).inj = INT(3 * RND) + 3
END IF
NEXT xx
IF temp% = 1 THEN pjn
NEXT pv
FOR zzz = 1 TO 48 - plkm
FOR zz = 1 TO 3
IF tkest(zz, zzz) > 0 THEN tkest(zz, zzz) = tkest(zz, zzz) - 1
IF tkest(zz, zzz) = 0 AND tauti(zz, zzz) <> 0 THEN tauti(zz, zzz) = 0
NEXT zz
NEXT zzz
FOR zz = 1 TO 48
IF tautik(zz) > 0 THEN tautik(zz) = tautik(zz) - 1
IF tautik(zz) = 0 AND tautip(zz) <> 1 THEN tautip(zz) = 1
NEXT zz

kr = kr + 1
ERASE gl, ja, ylm, maali, maalix, syotto, tulos, yvoima
END SUB


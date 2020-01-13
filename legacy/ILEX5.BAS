DECLARE SUB uusikausi ()
DECLARE SUB mor (mora%, morax%)
DECLARE SUB zreseasongala ()
DECLARE SUB cuparpo ()
DECLARE SUB borsinit (init%)
DECLARE SUB borsgene ()
DECLARE SUB tremaar ()
DECLARE SUB tarkistanhlc ()
DECLARE SUB mmkisaloppu ()
DECLARE SUB pisteporssimaar ()
DECLARE SUB mukachk ()
DECLARE SUB baaorsmuutos ()
DECLARE SUB gamedayhaara ()
DECLARE SUB staulmaar ()
DECLARE SUB staulehlmaar ()
DECLARE SUB vastmaar ()
DECLARE SUB maajoukkue ()
DECLARE SUB mmkisaalku ()
DECLARE SUB sponsorit ()
DECLARE SUB valitsestrat ()
DECLARE SUB jaauniorit ()
DECLARE SUB budget ()
DECLARE SUB suunnitelma ()
DECLARE SUB leq (fat%)
DECLARE SUB lax (fat%)
DECLARE SUB pjn ()
DECLARE SUB fbimiehet ()
DECLARE SUB poispel ()
DECLARE SUB poisne ()
DECLARE SUB tyytyma ()
DECLARE SUB rstages ()
DECLARE SUB harjotte (pkl%)
DECLARE SUB faarao ()
DECLARE SUB tallennus ()
DECLARE SUB suosikitchk ()
DECLARE SUB automa ()
DECLARE SUB sortmaar ()
DECLARE SUB ketjuchk ()
DECLARE SUB kc ()
DECLARE SUB katsoket ()
DECLARE SUB katsopel ()
DECLARE SUB piirtox ()
DECLARE SUB skreensaver ()
DECLARE SUB qelp (qel%)
DECLARE SUB snayt ()
DECLARE SUB graph ()
DECLARE SUB iaformaatio ()
DECLARE SUB apulaisvalm ()
DECLARE SUB pankki ()
DECLARE SUB organisaatio ()
DECLARE SUB bors ()
DECLARE SUB scoutit ()
DECLARE SUB meanstuff ()
DECLARE SUB vedonlyonti ()
DECLARE SUB kutsuturnaus ()
DECLARE SUB al (fat%)
DECLARE SUB lt (lue$, lukux%)
DECLARE SUB asetukset ()
DECLARE SUB sporvagen ()
DECLARE SUB tulonsiirto ()
DECLARE SUB intejasopu ()
DECLARE SUB kriisipalaveri ()
DECLARE SUB tulevatottelut ()
DECLARE SUB pisteporssi (fat%)
DECLARE SUB kuitt ()
DECLARE SUB kuva (tied$)
DECLARE SUB aaaargh ()
DECLARE SUB rela ()
DECLARE SUB palkmaar ()
DECLARE SUB actionprint ()
DECLARE SUB annanhal ()
DECLARE SUB wnd (ser%)
DECLARE SUB annarahaa (arg%)
DECLARE SUB colchk (colre%)
DECLARE SUB lay (fat%)
DECLARE SUB arvox (arvob%)
DECLARE SUB arpo (arf%)
DECLARE SUB arpol (cus%, ttt%, voiz%)
DECLARE SUB haahaa (haha%)
DECLARE SUB ku (kuz%, ku1%, ku2%)
DECLARE SUB sortbors (paddy%)
DECLARE SUB printpel (fat%)
DECLARE SUB sopimusext (fat%)
DECLARE SUB osto2 ()
DECLARE SUB cupohjelma (clurk%)
DECLARE SUB cupjuhla ()
DECLARE SUB lentti (kuka%, sano%)
DECLARE SUB tmankom (sano%)
DECLARE SUB komme (sano%)
DECLARE SUB dap (dep%)
DECLARE SUB ehllopturmaar (murder%)
DECLARE SUB maarpalk (jepulis$)
DECLARE SUB turnaus ()
DECLARE SUB erikoisp (fuk%)
DECLARE SUB euromaar ()
DECLARE SUB gameday ()
DECLARE SUB naytaott (nayk%)
DECLARE SUB ylmaar ()
DECLARE SUB ottpel ()
DECLARE SUB ottul ()
DECLARE SUB report ()
DECLARE SUB otmuut (fat%)
DECLARE SUB veiktark ()
DECLARE SUB sattuma ()
DECLARE SUB uutisia ()
DECLARE SUB kausikorttimaar ()
DECLARE SUB joulutauko ()
DECLARE SUB playoffplajays (plots%)
DECLARE SUB jaynacheck (choko%)
DECLARE SUB lux (fat%)
DECLARE SUB printket ()
DECLARE SUB ketlaita ()
DECLARE SUB klear (fat%)
DECLARE SUB klearstat (fat%)
DECLARE SUB xavier (fat%)
DECLARE SUB poisjun ()
DECLARE SUB krapulapiirto ()
DECLARE SUB kuntopuntari (sar!)
DECLARE SUB lex (fat%)
DECLARE SUB luz (fat%)
DECLARE SUB mahmax ()
DECLARE SUB protesti ()
DECLARE SUB muilutus (fat%)
DECLARE SUB ont (ontto%)
DECLARE SUB nollaux ()
DECLARE SUB tarjousmaar (koo1%, koo2%, pienin&, isoin&)
DECLARE SUB poispelaaja (vp%, jp%)
DECLARE SUB pisteet ()
DECLARE SUB pesc ()
DECLARE SUB voimamaar ()
DECLARE SUB postia (posti%)
DECLARE SUB staulnayt (sar!, sty!, stx!, iso!)
DECLARE SUB plajaytajoukkueet ()
DECLARE SUB potk (potcu%)
DECLARE SUB rah ()
DECLARE SUB sex (stondis%)
DECLARE SUB skandal ()
DECLARE SUB staulnaytehl ()
DECLARE SUB staulturmaar ()
DECLARE SUB taut (jop!, jupp%)
DECLARE SUB teet (jup%, jupp%, juppp%)
DECLARE FUNCTION tarka% (jez%)
DECLARE FUNCTION tarko% (t0%, t1%, t2%, t3%)
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

SUB graph
leq 2
COLOR 2
PRINT "JOUKKUE: ";
COLOR 10
PRINT RTRIM$(l(u(pv))); " (";
PRINT taulux(sr(u(pv))); ")"
COLOR 14
FOR xxx = 12 TO 1 STEP -1
LOCATE 29 - (24 - (xxx * 2)), 1
PRINT LTRIM$(STR$(xxx));
NEXT xxx
LOCATE 31, 4
FOR xx = 1 TO 5
IF xx < 5 THEN d = 10 ELSE d = 4
FOR xxx = 1 TO d
IF xxx < 10 THEN PRINT LTRIM$(STR$(xxx));  ELSE PRINT "0";
IF xxx = 10 THEN
c = CSRLIN
d = POS(CSRLIN)
LOCATE c + 1, d - 1: PRINT LTRIM$(STR$(xx))
LOCATE c, d
END IF
NEXT xxx
NEXT xx
IF ot > 0 THEN
temp% = 1
FOR xx = 1 TO ot
IF krapu(pv) = 2 THEN a = INT(12 * RND) + 1 ELSE a = graf(xx, pv)
COLOR stvari(a, sr(u(pv)))
FOR xxx = 12 TO a STEP -1
LOCATE 30 - (24 - (xxx * 2)), xx + 3
IF temp% = 1 THEN PRINT CHR$(177);  ELSE PRINT CHR$(176);
LOCATE 29 - (24 - (xxx * 2)), xx + 3
IF temp% = 1 THEN PRINT CHR$(177);  ELSE PRINT CHR$(176);
NEXT xxx
IF temp% = 1 THEN temp% = 2 ELSE temp% = 1
NEXT xx
END IF
haahaa 26
DO
wnd 1
IF me$ = CHR$(27) THEN EXIT SUB
LOOP
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
CASE 1, 2, 6, 7, 9, 10, 11, 14, 15, 16, 20, 13, 77, 8, 56, 46, 23, 71, 62, 21
PRINT CHR$(17); CHR$(16); CHR$(18);
CASE 3, 5, 33, 27, 66, 61
PRINT CHR$(18);
IF haha% = 3 AND plkm > 1 THEN PRINT CHR$(17); CHR$(16);
CASE 12
PRINT CHR$(17); CHR$(16);
END SELECT
SELECT CASE haha%
CASE 1, 2, 3, 4, 5, 6, 7, 10, 11, 16, 33, 27, 77, 49, 26, 46, 13, 23, 56, 21
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
FOR qwe = 0 TO 3
IF kurso = qwe THEN COLOR 14, 6 ELSE COLOR 14, 0
IF qwe = 0 THEN PRINT "KALENTERI";  ELSE IF qwe = 1 THEN PRINT "RUNKOSARJAT";  ELSE IF qwe = 2 THEN PRINT "EHL";  ELSE PRINT "PEKKALANDIAN CUP";
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

SUB harjotte (pkl%)
SELECT CASE pkl%
CASE 1
bantu:
a = INT(101 * RND)
SELECT CASE x(u(pv))
CASE 1 TO 12
IF a < 3 THEN b = 24: c = 25 ELSE IF a < 20 THEN b = 12: c = 13 ELSE IF a < 70 THEN b = 12: c = 1 ELSE b = 17: c = 49
CASE 13 TO 24
IF a < 15 THEN b = 24: c = 25 ELSE IF a < 30 THEN b = 15: c = 72 ELSE IF a < 85 THEN b = 12: c = 13 ELSE b = 12: c = 1
CASE 25 TO 48
IF a < 30 THEN b = 15: c = 72 ELSE IF a < 80 THEN b = 24: c = 25 ELSE b = 12: c = 13
END SELECT
xx = INT(b * RND) + c
IF xx < 49 THEN xx = x(xx)
IF ohj(xx) <> 0 THEN GOTO bantu
gnome = INT(4 * RND) + 1
leq 23
IF xx < 49 THEN lax 205 + INT(3 * RND) ELSE lax 208
wnd 2
IF me$ = "k" THEN
vast(pv) = xx
hott(pv * 2) = xx
SWAP hott(pv * 2), hott(pv * 2 - 1)
hotte(u(pv)) = 1
hotte(xx) = 1
END IF
CASE 2
DIM pks(1 TO 80) AS INTEGER
FOR xx = 1 TO 80
IF xx < 49 THEN pks(xx) = x(xx) ELSE IF xx < 66 THEN pks(xx) = xx ELSE pks(xx) = xx + 6
NEXT xx
kurso = 1
arabi:
leq 22
haahaa 71
LOCATE 3, 1: PRINT "PHL"
LOCATE 18, 1: PRINT "DIV"
LOCATE 3, 16: PRINT "MUT"
LOCATE 3, 31: PRINT "EHL"
LOCATE 3, 46: PRINT "MUUT"

LOCATE 34, 1: COLOR 6: PRINT "NEUVOTTELUAIKAA JŽLJELLŽ: ";
COLOR 14: PRINT LTRIM$(STR$(actiox(pv)))

DO
FOR xx = 1 TO 80
IF xx < 13 THEN LOCATE 4 + xx, 1 ELSE IF xx < 25 THEN LOCATE 7 + xx, 1 ELSE IF xx < 49 THEN LOCATE 4 + xx - 24, 16 ELSE IF xx < 66 THEN LOCATE 4 + xx - 48, 31 ELSE LOCATE 4 + xx - 65, 46
IF kurso = xx THEN COLOR , 6 ELSE COLOR , 0
IF ohj(pks(xx)) = pv OR hotte(pks(xx)) <> 0 THEN COLOR 8 ELSE COLOR 14
PRINT l(pks(xx));
NEXT xx
COLOR , 0
wnd 1
ku 1, 1, 80

IF me$ = CHR$(0) + CHR$(77) AND kurso <= 70 THEN kurso = kurso + 10
IF me$ = CHR$(0) + CHR$(75) AND kurso >= 11 THEN kurso = kurso - 10


IF me$ = CHR$(27) THEN ERASE pks: EXIT SUB
IF me$ = CHR$(13) AND actiox(pv) > 0 AND ohj(pks(kurso)) <> pv AND hotte(pks(kurso)) = 0 THEN EXIT DO
LOOP
actiox(pv) = actiox(pv) - 1

IF kurso < 49 THEN a = sed(pks(kurso)) ELSE IF kurso < 66 THEN a = -6 ELSE a = 60
b = INT(101 * RND) - (sed(u(pv)) - a) + mtaito(5, man(u(pv))) * 5
xx = pks(kurso)
CLS
IF xx < 49 THEN lax 209 ELSE lax 210
PRINT
SELECT CASE ohj(xx)
CASE 0
SELECT CASE b
CASE IS < 50
lentti 1, 24
pjn
GOTO arabi
CASE ELSE
lentti 1, 25
pjn
END SELECT
CASE IS <> 0
curso = 1
DO
LOCATE 6, 1
FOR z = 1 TO 2
IF curso = z THEN COLOR 14, 6 ELSE COLOR 14, 0
IF z = 1 THEN PRINT "EI" ELSE PRINT "KYLLŽ"
NEXT z
wnd 1
ku 3, 1, 2
IF me$ = CHR$(13) THEN EXIT DO
LOOP
IF curso = 1 THEN GOTO arabi
END SELECT
vast(pv) = pks(kurso)
hotte(u(pv)) = 1
hotte(vast(pv)) = 1
hotte(u(pv)) = 1
hott(pv * 2) = vast(pv)
IF ohj(vast(pv)) <> 0 THEN vast(ohj(vast(pv))) = u(pv)
ERASE pks
END SELECT

COLOR , 0
END SUB

SUB iaformaatio

sarana:
leq 21
haahaa 26
COLOR 7: LOCATE 21, 50: PRINT "TŽHDET";
FOR b = 1 TO 3
LOCATE 3 + (b - 1) * 8, 1: lay 64 + b
LOCATE 5 + ((b - 1) * 8), 1: lay 35
FOR xxx = 1 TO 3
LOCATE 6 + ((b - 1) * 8) + xxx, 1
xx = suosikki(b, xxx, pv): sivux = 1
printpel 8
LOCATE , 50
SELECT CASE b
CASE 1
sin1 = pel(xx, pv).kar * 2 + pel(xx, pv).psk * 2 + pel(xx, pv).pok

CASE 2
IF kapu(pv) = xx THEN PRINT "C ";
sin1 = ((pel(xx, pv).age + pel(xx, pv).ldr ^ 1.3) / 50)
IF pel(xx, pv).psk < avg(1, pv) THEN sin1 = sin1 * (pel(xx, pv).psk / avg(1, pv))

CASE 3
a = CINT((pel(xx, pv).psk + pel(xx, pv).ldr + pel(xx, pv).kar) / 10)
IF a = 0 THEN PRINT "­";  ELSE PRINT STRING$(a, "*")
END SELECT
NEXT xxx
NEXT b
DO
wnd 1
IF me$ = "?" THEN qelp 8: GOTO sarana
IF me$ = CHR$(27) THEN EXIT SUB
LOOP
END SUB

SUB intejasopu
IF kiero(kr) = 98 OR kiero(kr) = 22 THEN inte(pv) = 1
IF pirtar(7) <> 1048 THEN inte(pv) = 0
COLOR 14: LOCATE 3, 57
PRINT intens(inte(pv));
PRINT STRING$(10, " ");
IF krapu(pv) >= 1 THEN COLOR 8: LOCATE 5, 57: PRINT "LIIAN TIUKKA";
IF jaynax(2, u(pv)) = 0 THEN COLOR 14 ELSE COLOR 30
LOCATE 4, 57
PRINT "EI";
END SUB

SUB jaauniorit
DIM juns(2 TO 10, 1 TO 3) AS INTEGER
OPEN "data\junnut.m2k" FOR INPUT AS #1
FOR b = 2 TO 10
INPUT #1, juns(b, 1), juns(b, 2), juns(b, 3)
NEXT b
CLOSE #1

d = valb(3, pv) * 2 - junnu(pv)
IF d >= 6 THEN c = 2 ELSE IF d > 0 THEN c = 1 ELSE IF d = 0 THEN c = 0 ELSE IF d <= -6 THEN c = -2 ELSE c = -1
junnu(pv) = junnu(pv) + c

FOR xx = 1 TO juns(junnu(pv), 1) + INT(3 * RND) - 1
nats = 1
rela
jel(xx, pv) = blanko
jel(xx, pv).psk = juns(junnu(pv), 2) + INT(juns(junnu(pv), 3) * RND)
jel(xx, pv).age = 18
IF 100 * RND < 6 THEN jel(xx, pv).spe = 5
IF 100 * RND < 2 AND jel(xx, pv).spe = 0 THEN jel(xx, pv).spe = 8
NEXT xx
lpj(pv) = xx - 1
ERASE juns
END SUB

SUB jaynacheck (choko%)
IF choko% = 1 THEN GOSUB ripuli ELSE IF choko% = 2 THEN GOSUB skandalpl
IF choko% <> 0 THEN EXIT SUB

FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).spe = 666 THEN
jaynax(5, pv) = 1
lukka = 17
yy = vast(pv)
dap 2
END IF

IF pel(xx, pv).spe = 2 AND pel(xx, pv).ket > 0 THEN
IF INT(101 * RND) < 2 THEN lukka = 18: dap 2
END IF

NEXT xx

IF jaynax(5, u(pv)) = 1 THEN
al 1
IF lukka = 0 THEN
lukka = 44
dap 1
jaynax(5, u(pv)) = 0
END IF
END IF

FOR xxx = 1 TO plkm
IF vast(xxx) = u(pv) AND jaynax(5, xxx) = 1 THEN
jaynax(5, xxx) = 0
al 1
IF lukka = 0 THEN
lukka = 45
dap 1
END IF
END IF
NEXT xxx

IF jaynax(7, u(pv)) <> 0 THEN
xx = jaynax(7, u(pv))
jaynax(7, u(pv)) = 0
lux 13
mor u(pv), -15
END IF

FOR xx = 1 TO 48
IF ohj(xx) = 0 AND jaynax(7, xx) <> 0 THEN
jaynax(7, xx) = 0
mor xx, -55
lux 36
END IF
NEXT xx

IF jaynax(3, u(pv)) = 1 THEN GOSUB skandalpl
IF jaynax(6, u(pv)) = 1 THEN GOSUB ripuli
IF jaynax(4, u(pv)) = 1 THEN GOSUB vieroitus
EXIT SUB

skandalpl:
lax 59
PRINT
IF tarko(u(pv), 5, 15, 50) = 1 THEN
lax 60
mor u(pv), 10
ELSE
lax 61
mor u(pv), -10
END IF
jaynax(3, u(pv)) = 0
RETURN

ripuli:
lux 19
IF tarko(u(pv), 6, 15, 50) = 1 THEN lux 76 ELSE lux 77
FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).inj = 0 AND 100 * RND > 60 THEN pel(xx, pv).inj = 2
NEXT xx
jaynax(6, u(pv)) = 0
RETURN

vieroitus:
al 3
IF lukka = 0 THEN
gnome = INT(11 * RND) + 7
lax 118
pel(xx, pv).inj = gnome + 2000
END IF
jaynax(4, u(pv)) = 0
RETURN
END SUB

SUB joulutauko
DIM turnax(1 TO 86) AS INTEGER, lusmux(1 TO 10) AS INTEGER
FOR zz = 1 TO 10
lusmux(zz) = 1
NEXT zz
IF tietos > 0 THEN turnax(tietos) = 1
FOR zz = 1 TO plkm
turnax(u(zz)) = 1
NEXT zz
FOR qwe = 10 TO 1 STEP -1
maarpalk "jt" + LTRIM$(STR$(qwe))
tnimi(1) = turnimi(qwe)
naaturnaus = 0
FOR zz = 1 TO plkm
IF mukt(zz) = qwe THEN
turnax(u(zz)) = 1
tx(lusmux(qwe)) = u(zz)
lusmux(qwe) = lusmux(qwe) + 1
naaturnaus = 1
END IF
NEXT zz
IF qwe = 1 AND tietos > 0 THEN tx(1) = tietos: lusmux(qwe) = lusmux(qwe) + 1
FOR cupex = lusmux(qwe) TO 6
purppura:
a = INT(100 * RND) + 1
SELECT CASE qwe
CASE 10
b = INT(16 * RND) + 71
CASE 9
IF a < 25 THEN b = x(INT(24 * RND) + 25) ELSE b = INT(16 * RND) + 71
CASE 8
IF a < 70 THEN b = x(INT(24 * RND) + 25) ELSE b = INT(16 * RND) + 71
CASE 7
IF a < 25 THEN b = x(INT(12 * RND) + 12) ELSE b = x(INT(24 * RND) + 25)
CASE 6
IF a < 50 THEN b = x(INT(12 * RND) + 12) ELSE b = x(INT(24 * RND) + 25)
CASE 5
IF a < 20 THEN b = x(INT(12 * RND) + 1) ELSE b = x(INT(12 * RND) + 13)
CASE 4
IF a < 70 THEN b = x(INT(12 * RND) + 1) ELSE b = x(INT(12 * RND) + 5)
CASE 3
IF a < 50 THEN b = x(INT(12 * RND) + 1) ELSE b = INT(17 * RND) + 49
CASE 2
IF a < 40 THEN b = x(INT(5 * RND) + 1) ELSE b = INT(17 * RND) + 49
CASE 1
b = 64 + cupex
END SELECT
IF turnax(b) = 1 THEN GOTO purppura
turnax(b) = 1
tx(lusmux(qwe)) = b
lusmux(qwe) = lusmux(qwe) + 1
NEXT cupex
turnaus
NEXT qwe
tietos = 0
ERASE turnax, lusmux
END SUB

SUB katsoket
kurso = 1
curso = 1
vaihtis% = 0
tulkero:
CLS
COLOR 8, 0: LOCATE 2, 1: PRINT STRING$(80, "Ä");


haahaa 2
kc
b = 1: c = pelaa: GOSUB hulkko
LOCATE 3, 1
lay 41
DO
LOCATE 1, 1
FOR cupex = 1 TO 11
IF curso = cupex THEN COLOR 14, 6 ELSE COLOR 14, 0
SELECT CASE cupex
CASE 1 TO 5
IF cupex < 4 THEN PRINT "PP" + LTRIM$(STR$(cupex));  ELSE IF cupex = 4 THEN PRINT "PPYV";  ELSE PRINT "PPAV";
CASE 6 TO 11
IF cupex < 10 THEN PRINT "HK" + LTRIM$(STR$(cupex - 5));  ELSE IF cupex = 10 THEN PRINT "HKYV";  ELSE PRINT "HKAV";
END SELECT
IF cupex < 11 THEN COLOR , 0: PRINT "  ";
NEXT cupex
printket
IF pelaa > 0 THEN
b = kurso - 1: c = kurso + 1: GOSUB hulkko
END IF
wnd 1
COLOR , 0
IF me$ = "?" THEN qelp (2): GOTO tulkero
IF pelaa > 0 THEN
ketlaita
ku 4, 1, 11

IF curso = 5 AND gnome = 3 OR curso = 6 AND gnome = 2 THEN
COLOR , 0
FOR zz = 3 TO 42
LOCATE zz, 36: PRINT STRING$(44, " ");
NEXT zz
END IF

ku 1, 1, pelaa
IF me$ = "k" THEN klear 1: kc: b = 1: c = pelaa: GOSUB hulkko
IF me$ = "K" THEN klear 2: kc: b = 1: c = pelaa: GOSUB hulkko
IF me$ = "A" THEN klear 2: automa: kc: b = 1: c = pelaa: GOSUB hulkko
END IF
IF me$ = CHR$(27) THEN COLOR , 0: EXIT DO
IF me$ = CHR$(9) THEN COLOR , 0: vaihtis% = 2: EXIT DO
LOOP
EXIT SUB
hulkko:
FOR a = b TO c
IF a >= 1 AND a <= pelaa THEN
IF pel(sort2(a), pv).ket = 0 THEN COLOR 8: zra = 7 ELSE IF pel(sort2(a), pv).ket = 1 THEN COLOR 14: zra = 6 ELSE COLOR 9: zra = 1
LOCATE a + 4 + pel(sort2(a), pv).ppp - 1, 1
IF a = kurso THEN COLOR , zra ELSE COLOR , 0
printpel 6
END IF
NEXT a
RETURN
END SUB

SUB katsopel
sivux = 1
lukka = 1
kurso = 1
vaihtis% = 0
IF kr > 68 THEN sivmax% = 4 ELSE sivmax% = 3
dukka:
COLOR , 0
CLS
LOCATE 3, 1
lay 35
LOCATE , 50
lay 35 + sivux
LOCATE 1, 1
SELECT CASE lukka
CASE 1
COLOR 6: PRINT "P-RINKI "; : COLOR 14: PRINT l(u(pv));
COLOR 6: PRINT " P.B ";
COLOR 14: PRINT LTRIM$(STR$(pelbudget(pv))); "/O";
COLOR 6: PRINT "  K-IK ";
COLOR 14: PRINT USING "##.#"; avg(2, pv);
COLOR 6: PRINT "  K-TA ";
COLOR 14: PRINT USING "##.#"; avg(1, pv);
COLOR 6: PRINT "  K-KA ";
COLOR 14: PRINT USING "##.#"; avg(3, pv);

LOCATE , 72
COLOR 15
SELECT CASE sivux
CASE 1
PRINT "TILAST. "; CHR$(16)
CASE 2
PRINT "SOPIM. "; CHR$(17); CHR$(16)
CASE 3
PRINT "ERIK. ";
IF kr < 68 THEN PRINT CHR$(17) ELSE PRINT CHR$(17); CHR$(16)
CASE 4
PRINT "RUNKOS. "; CHR$(17)
END SELECT
LOCATE 4, 1
a = 1: b = lpl(pv): GOSUB mussolini
CASE 2
IF lpj(pv) = 1 THEN kurso = 1
COLOR 6: PRINT "A-JUNIOREIDEN PARHAIMMISTO "; : COLOR 14: PRINT l(u(pv))
a = 1: b = lpj(pv): GOSUB mussolini
END SELECT
DO
COLOR , 0
klearstat 42
haahaa 1
a = kurso - 1: b = kurso + 1: GOSUB mussolini
wnd 1
IF me$ = CHR$(27) THEN COLOR , 0: EXIT DO
IF me$ = CHR$(9) THEN COLOR , 0: vaihtis% = 1: EXIT DO
IF me$ = CHR$(0) + CHR$(75) AND sivux > 1 THEN sivux = sivux - 1: COLOR , 0: GOTO dukka
IF me$ = CHR$(0) + CHR$(77) AND sivux < sivmax% THEN sivux = sivux + 1: COLOR , 0: GOTO dukka
IF me$ = "?" THEN qelp (1): GOTO dukka
SELECT CASE lukka
CASE 1
ku 1, 1, lpl(pv)

IF pel(sort(kurso), pv).svu > 0 AND pel(sort(kurso), pv).inj = 0 THEN
IF me$ = "c" AND kapu(pv) <> sort(kurso) THEN kapu(pv) = sort(kurso): GOTO dukka
END IF
IF actiox(pv) > 0 THEN
IF me$ = "e" AND pel(sort(kurso), pv).svu = 0 THEN COLOR , 0: ote = pv: xx = sort(kurso): sopimusext 1: GOTO dukka
END IF

IF me$ = "z" AND pel(sort(kurso), pv).spe < 30000 AND spx(2, pv) > 0 THEN xavier 4: GOTO dukka
IF me$ = "t" AND spx(1, pv) > 0 THEN xavier 1: GOTO dukka
IF me$ = "k" AND pel(sort(kurso), pv).kar < 17 AND pel(sort(kurso), pv).inj = 0 THEN xavier 2: GOTO dukka
IF me$ = "p" AND lpl(pv) > 5 AND kr <= 68 AND pel(sort(kurso), pv).inj = 0 THEN xavier 3: GOTO dukka
IF me$ = "m" AND pel(sort(kurso), pv).spe = 5 THEN pel(sort(kurso), pv).spe = 666: me$ = ""
IF me$ = "m" AND pel(sort(kurso), pv).spe = 666 THEN pel(sort(kurso), pv).spe = 5: me$ = ""
IF me$ = CHR$(8) AND lpj(pv) > 0 THEN lukka = 2: kurso = 1: GOTO dukka
CASE 2
ku 1, 1, lpj(pv)
IF me$ = "n" AND lpl(pv) < 32 THEN
pel(lpl(pv) + 1, pv) = jel(kurso, pv): lpl(pv) = lpl(pv) + 1: sortmaar
IF kurso < lpj(pv) THEN
FOR smut = kurso TO lpj(pv) - 1
jel(smut, pv) = jel(smut + 1, pv)
NEXT smut
END IF
lpj(pv) = lpj(pv) - 1
kurso = 1
IF lpj(pv) = 0 THEN lukka = 1
GOTO dukka
END IF
IF me$ = CHR$(8) THEN lukka = 1: kurso = 1: GOTO dukka
IF me$ = "p" THEN poisjun: GOTO dukka
END SELECT
LOOP
EXIT SUB
mussolini:
SELECT CASE lukka
CASE 1
FOR xxx = a TO b
IF xxx >= 1 AND xxx <= lpl(pv) THEN
IF kurso = xxx THEN COLOR , 6 ELSE COLOR , 0
LOCATE xxx + 4 + pel(sort(xxx), pv).ppp - 1, 1
xx = sort(xxx): printpel 1
END IF
NEXT xxx
CASE 2
FOR xxx = a TO b
IF xxx >= 1 AND xxx <= lpj(pv) THEN
IF kurso = xxx THEN COLOR , 6 ELSE COLOR , 0
LOCATE xxx + 4, 1
xx = xxx: printpel 3
END IF
NEXT xxx
END SELECT
RETURN
END SUB

SUB kausikorttimaar
FOR xx = 1 TO 48
d = 0

temp% = paikka(2, xx) * 100 - kausik(xx)

sin1 = (sed(xx) * 2 + sedd(xx) + seddd(xx)) / 4


SELECT CASE sr(xx)
CASE 1
c = 110
CASE 2
c = 85
CASE 3
c = 50
END SELECT

sin2 = 8 - sin1

IF sin2 > 0 THEN
d = c ^ (1 + (sin2 / 50))
sin3 = 1 + ((taso(xx) - 3) * (.005 + (sin2 / 200)))
ELSE
d = c ^ (1 + (sin2 / 100))
sin3 = 1 + ((taso(xx) - 3) * .005)
END IF

d = d ^ sin3

d = d * (1 + (mtaito(5, man(xx)) * .02))

IF ohj(xx) <> 0 THEN
d = d * (1 + ((avg(3, ohj(xx)) - 10) / 50))
END IF

d = (.95 * d) + (.1 * RND) * d
d = d + INT(3 * RND) - 1

IF d > temp% THEN d = temp%

IF ohj(xx) <> 0 THEN
IF boikotti(ohj(xx)) > 0 THEN d = d * .8
raha(ohj(xx)) = raha(ohj(xx)) + d * (lhinta(sr(xx)) * 22)
END IF

kausik(xx) = kausik(xx) + d

NEXT xx
END SUB

SUB kc
FOR xx = 1 TO lpl(pv)
pel(xx, pv).ket = 0
IF maa(1, pv) = xx THEN pel(xx, pv).ket = pel(xx, pv).ket + 1
FOR qwe = 1 TO 5
FOR cupex = 1 TO 4
IF ketju(qwe, cupex, pv) = xx THEN pel(xx, pv).ket = pel(xx, pv).ket + 1
NEXT cupex
NEXT qwe
IF pel(xx, pv).ket = 0 AND pel(xx, pv).spe = 666 THEN pel(xx, pv).spe = 5
NEXT xx
END SUB

SUB ketjuchk
FOR zz = 1 TO lpl(pv)
IF pel(zz, pv).inj <> 0 THEN
IF kapu(pv) = zz THEN kapu(pv) = 0
IF maa(1, pv) = zz THEN maa(1, pv) = 0
FOR qwe = 1 TO 5
FOR cupex = 1 TO 6
IF ketju(qwe, cupex, pv) = zz THEN ketju(qwe, cupex, pv) = 0
NEXT cupex
NEXT qwe
END IF
NEXT zz

isobee:
FOR a = 1 TO 2
c = 0
IF ketju(1, a, pv) <> 0 AND ketju(2, a, pv) <> 0 THEN c = pel(ketju(1, a, pv), pv).psk + pel(ketju(1, a, pv), pv).psk
FOR b = a + 1 TO 3
d = 0
IF ketju(1, b, pv) <> 0 AND ketju(2, b, pv) <> 0 THEN d = pel(ketju(1, b, pv), pv).psk + pel(ketju(1, b, pv), pv).psk
IF d > c THEN
SWAP ketju(1, a, pv), ketju(1, b, pv)
SWAP ketju(2, a, pv), ketju(2, b, pv)
GOTO isobee
END IF
NEXT b
NEXT a

isobee2:
FOR a = 1 TO 3
c = 0
IF ketju(3, a, pv) <> 0 AND ketju(4, a, pv) <> 0 AND ketju(5, a, pv) <> 0 THEN c = pel(ketju(3, a, pv), pv).psk + pel(ketju(4, a, pv), pv).psk + pel(ketju(5, a, pv), pv).psk
FOR b = a + 1 TO 4
d = 0
IF ketju(3, b, pv) <> 0 AND ketju(4, b, pv) <> 0 AND ketju(5, b, pv) <> 0 THEN d = pel(ketju(3, b, pv), pv).psk + pel(ketju(4, b, pv), pv).psk + pel(ketju(5, b, pv), pv).psk
IF d > c THEN
SWAP ketju(3, a, pv), ketju(3, b, pv)
SWAP ketju(4, a, pv), ketju(4, b, pv)
SWAP ketju(5, a, pv), ketju(5, b, pv)
GOTO isobee2
END IF
NEXT b
NEXT a

FOR zz = 1 TO 3
avg(zz, pv) = 0
NEXT zz

FOR zz = 1 TO lpl(pv)
avg(1, pv) = avg(1, pv) + pel(zz, pv).psk
avg(2, pv) = avg(2, pv) + pel(zz, pv).age
avg(3, pv) = avg(3, pv) + pel(zz, pv).kar
NEXT zz

FOR zz = 1 TO 3
avg(zz, pv) = avg(zz, pv) / lpl(pv)
NEXT zz

haikka = 0
IF maa(1, pv) = 0 THEN haikka = 1
FOR qwe = 1 TO 5
FOR cupex = 1 TO 6
IF ketju(qwe, cupex, pv) = 0 AND dad(qwe, cupex) = 1 THEN haikka = 1: GOTO pienibee
NEXT cupex
NEXT qwe
pienibee:
END SUB

SUB ketlaita
IF pel(sort2(kurso), pv).svu > 0 AND pel(sort2(kurso), pv).ket < 2 THEN
SELECT CASE me$
CASE "z"
IF pel(sort2(kurso), pv).svu > 0 AND pel(sort2(kurso), pv).ppp = 1 THEN
maa(1, pv) = sort2(kurso)
END IF
CASE "q"
IF pel(sort2(kurso), pv).ppp <> 1 THEN
IF curso > 5 THEN
IF curso < 10 THEN temp% = curso - 5 ELSE IF curso = 10 THEN temp% = 5 ELSE temp% = 6
IF ketju(4, temp%, pv) <> sort2(kurso) AND ketju(5, temp%, pv) <> sort2(kurso) THEN ketju(3, temp%, pv) = sort2(kurso)
END IF
END IF
CASE "w"
IF pel(sort2(kurso), pv).ppp <> 1 THEN
IF curso > 5 THEN
IF curso < 10 THEN temp% = curso - 5 ELSE IF curso = 10 THEN temp% = 5 ELSE temp% = 6
IF ketju(3, temp%, pv) <> sort2(kurso) AND ketju(5, temp%, pv) <> sort2(kurso) THEN ketju(4, temp%, pv) = sort2(kurso)
END IF
END IF
CASE "e"
IF pel(sort2(kurso), pv).ppp <> 1 THEN
IF curso > 5 THEN
IF curso < 10 THEN temp% = curso - 5 ELSE IF curso = 10 THEN temp% = 5 ELSE temp% = 6
IF ketju(3, temp%, pv) <> sort2(kurso) AND ketju(4, temp%, pv) <> sort2(kurso) THEN ketju(5, temp%, pv) = sort2(kurso)
END IF
END IF
CASE "a"
IF pel(sort2(kurso), pv).ppp <> 1 THEN
IF curso < 6 THEN
IF curso < 4 THEN temp% = curso ELSE IF curso = 4 THEN temp% = 5 ELSE temp% = 6
IF ketju(2, temp%, pv) <> sort2(kurso) THEN ketju(1, temp%, pv) = sort2(kurso)
END IF
END IF
CASE "s"
IF pel(sort2(kurso), pv).ppp <> 1 THEN
IF curso < 6 THEN
IF curso < 4 THEN temp% = curso ELSE IF curso = 4 THEN temp% = 5 ELSE temp% = 6
IF ketju(1, temp%, pv) <> sort2(kurso) THEN ketju(2, temp%, pv) = sort2(kurso)
END IF
END IF
END SELECT
kc
printket
END IF
END SUB

SUB klear (fat%)
SELECT CASE fat%
CASE 1
SELECT CASE curso
CASE 1 TO 5
IF curso < 4 THEN c = curso ELSE IF curso = 4 THEN c = 5 ELSE c = 6
FOR cupex = 1 TO 2
ketju(cupex, c, pv) = 0
NEXT cupex
CASE ELSE
c = curso - 5
FOR cupex = 3 TO 5
ketju(cupex, c, pv) = 0
NEXT cupex
END SELECT
CASE 2
FOR c = 1 TO 6
FOR cupex = 1 TO 5
ketju(cupex, c, pv) = 0
NEXT cupex
NEXT c
maa(1, pv) = 0
END SELECT
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

SUB krapulapiirto
FOR zz = 1 TO 43
FOR zzz = 1 TO 80
a = INT(51 * RND)
COLOR INT(15 * RND) + 17
IF a = 1 THEN LOCATE zz, zzz: PRINT CHR$(1);  ELSE IF a = 2 THEN LOCATE zz, zzz: PRINT CHR$(2);
NEXT zzz
NEXT zz
END SUB

SUB kriisipalaveri
leq 39
lax 56
haahaa 66
kurso = 1
DO
LOCATE 8, 1
FOR zz = 1 TO 3
IF kurso = zz THEN COLOR , 6 ELSE COLOR , 0
lax 155 + zz
NEXT zz

COLOR , 0

wnd 1
ku 1, 1, 3
IF me$ = CHR$(27) THEN EXIT SUB
IF me$ = CHR$(13) THEN EXIT DO
LOOP

klearstat 43
LOCATE 12, 1

kriisi = 1
xx = kapu(pv)

yy = INT(lpl(pv) * RND) + 1
IF xx = 0 THEN
lt "kr", 0 + kurso
a = -kurso
mor u(pv), a
pjn
EXIT SUB
END IF

sin1 = ((pel(xx, pv).age + pel(xx, pv).ldr ^ 1.3) / 50)
IF pel(xx, pv).psk < avg(1, pv) THEN sin1 = sin1 * (pel(xx, pv).psk / avg(1, pv))

d = 0

SELECT CASE kurso
CASE 1
lt "kr", 4
PRINT
a = 50 + mtaito(4, man(u(pv))) * 10
a = a * sin1 ^ 2
IF 100 * RND < a THEN mor u(pv), INT(2 * RND) + 1: lt "kr", 5 ELSE lt "kr", 6

CASE 2
CLS
lt "kr", 7
PRINT
sin2 = (1 - sin1 ^ 1.5) * 100 + 30
SELECT CASE 100 * RND
CASE IS < sin2
lt "kr", INT(3 * RND) + 9
mor u(pv), -1
CASE ELSE
lt "kr", INT(3 * RND) + 12
mor u(pv), 2
END SELECT
PRINT
SELECT CASE 100 * RND
CASE IS <= 20 - mtaito(4, man(u(pv))) * 5
lt "kr", 15
mor u(pv), -1
CASE IS >= 80 - mtaito(4, man(u(pv))) * 5
lt "kr", 16
mor u(pv), 2
CASE ELSE
lt "kr", 17
END SELECT
PRINT
al 6
IF lukka = 0 THEN
lt "kr", INT(3 * RND) + 18
mor u(pv), -1
END IF

CASE 3
CLS
lt "kr", 8
PRINT
IF valb(1, pv) < 4 THEN
IF 100 * RND < (4 - valb(1, pv)) * 5 THEN
lt "kr", INT(3 * RND) + 21
mor u(pv), -1
PRINT
END IF
END IF
sin2 = (1 - sin1 ^ 2) * 100 + 40
SELECT CASE 100 * RND
CASE IS < sin2
lt "kr", INT(3 * RND) + 27
mor u(pv), -2
CASE ELSE
lt "kr", INT(3 * RND) + 24
mor u(pv), 3
END SELECT
PRINT
SELECT CASE 100 * RND
CASE IS <= 30 - mtaito(4, man(u(pv))) * 10
lt "kr", 30
mor u(pv), -2
CASE IS >= 70 - mtaito(4, man(u(pv))) * 10
lt "kr", 31
mor u(pv), 3
CASE ELSE
lt "kr", 32
END SELECT
PRINT
al 7
IF lukka = 0 THEN
qwe = INT(3 * RND)
lt "kr", qwe + 33
mor u(pv), -2
IF qwe = 2 THEN
IF pel(xx, pv).inj = 0 THEN pel(xx, pv).inj = INT(5 * RND) + 3
mor u(pv), -1
END IF
END IF

END SELECT

pjn
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

SUB kuitt
CLS
COLOR 15
PRINT "TAHDOTKO LOPETTAA? (K/E)"
wnd 2
IF me$ = "e" THEN EXIT SUB
SCREEN 0: WIDTH 80, 25: COLOR 15, 0
CLS
lax 89
PRINT
lax 88
PRINT
lax 87
COLOR 6: PRINT "               E-MAIL: ";
COLOR 14: PRINT "forster@dlc.fi"
PRINT
lax 86
SYSTEM
END SUB

SUB kuntopuntari (sar)
DIM kdata(1 TO 3, ((sar - 1) * 12) + 1 TO sar * 12) AS INTEGER
DIM ksij(1 TO 12) AS INTEGER

FOR xx = LBOUND(kdata, 2) TO UBOUND(kdata, 2)
kdata(3, xx) = 1
FOR xxx = 1 TO 10
IF kunto(xxx, x(xx)) = 1 OR kunto(xxx, x(xx)) = 4 THEN kdata(2, xx) = kdata(2, xx) + 2
IF kunto(xxx, x(xx)) = 2 OR kunto(xxx, x(xx)) = 5 THEN kdata(2, xx) = kdata(2, xx) + 1
NEXT xxx
NEXT xx

FOR xx = LBOUND(kdata, 2) TO UBOUND(kdata, 2) - 1
FOR xxx = xx + 1 TO UBOUND(kdata, 2)
SELECT CASE kdata(2, xx)
CASE IS > kdata(2, xxx)
kdata(3, xxx) = kdata(3, xxx) + 1
CASE IS < kdata(2, xxx)
kdata(3, xx) = kdata(3, xx) + 1
CASE kdata(2, xxx)
IF s(x(xx)) > s(x(xxx)) THEN kdata(3, xx) = kdata(3, xx) + 1 ELSE kdata(3, xxx) = kdata(3, xxx) + 1
END SELECT
NEXT xxx
NEXT xx

FOR xx = LBOUND(kdata, 2) TO UBOUND(kdata, 2)
ksij(kdata(3, xx)) = xx
NEXT xx




IF sar < 4 THEN LOCATE 3, 1 ELSE LOCATE 19, 1

FOR xx = 1 TO 12
xxx = ksij(xx)
od(1) = x(xxx)
COLOR stvari(xx, sar)
colchk 2

PRINT l(x(xxx)); "  ("; kk(x(xxx)); ")";

LOCATE , 30
FOR zz = 1 TO 10
IF kunto(zz, x(xxx)) <> 0 THEN PRINT kuntox(kunto(zz, x(xxx)));  ELSE PRINT " ";
NEXT zz

PRINT "  ";
PRINT LTRIM$(STR$(kdata(2, xxx)));
IF kdata(2, xxx) < 10 THEN PRINT "   (";  ELSE PRINT "  (";
PRINT LTRIM$(STR$(s(x(xxx)))); ")"

COLOR 8
IF sar = 1 AND xx = 8 OR sar = 1 AND xx = 11 THEN PRINT "ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ"
IF sar = 2 AND xx = 6 OR sar = 2 AND xx = 10 THEN PRINT "ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ"
IF sar = 3 AND xx = 6 OR sar = 4 AND xx = 6 THEN PRINT "ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ"

NEXT xx

ERASE kdata, ksij
END SUB

SUB kutsuturnaus
IF sed(u(pv)) < 49 THEN d = tkutsux(sed(u(pv))) ELSE d = 48
kurso = d
leq 12
LOCATE 16, 1: COLOR 6: PRINT "TURNAUKSEN KUVAUS"
DO
FOR zz = d TO 10
IF zz = kurso THEN COLOR 14, 6 ELSE COLOR 14, 0
LOCATE 2 + zz, 1: PRINT turnimi(zz)
NEXT zz
COLOR 12, 0
klearstat 18
haahaa 14
LOCATE 18, 1: lax 67 + kurso
wnd 1
ku 1, d, 10
IF me$ = CHR$(13) THEN mukt(pv) = kurso: EXIT DO
IF me$ = CHR$(27) THEN mukt(pv) = 0: EXIT DO
LOOP
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

SUB lentti (kuka%, sano%)
lt "s" + LTRIM$(STR$(kuka%)), (sano% - 1) * 6 + INT(6 * RND) + 1
END SUB

SUB leq (fat%)
CLS
lt "q", fat%
PRINT
END SUB

SUB lex (fat%)
lt "v", fat%
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
IF yy <= 48 THEN PRINT RTRIM$(mana(man(yy)).nam);
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

SUB lux (fat%)
lt "e", fat%
PRINT
END SUB

SUB luz (fat%)
lt "n", fat%
PRINT
END SUB

SUB maajoukkue
d = 0
leq 7
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

SUB maarpalk (jepulis$)
OPEN "data\" + jepulis$ + ".plx" FOR INPUT AS #1
FOR z = 1 TO 6
INPUT #1, palki(z)
NEXT z
CLOSE #1
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

SUB meanstuff
kurso = 1: oldkurso = 1
bekinado:
leq 36

IF jaynateh(pv) = 3 THEN lay 23: pjn: EXIT SUB

a = 1: b = 48: GOSUB dalailama
IF kr = 68 THEN jaynmax = 1 ELSE jaynmax = 7
COLOR 12: LOCATE 31, 1: lax 5 + oldkurso
haahaa 6
DO
a = kurso - 1: b = kurso + 1: GOSUB dalailama
FOR zz = 1 TO jaynmax
IF ohj(x(kurso)) <> 0 AND zz = 2 OR ohj(x(kurso)) = pv THEN COLOR 8 ELSE COLOR 14
IF oldkurso = zz THEN COLOR , 6 ELSE COLOR , 0
LOCATE 2 + zz, 41: PRINT jayna(zz)
NEXT zz
COLOR 6, 0
LOCATE 29, 1: PRINT "JOUKKUEEN MANAGERI: ";
COLOR 14
PRINT mana(man(x(kurso))).nam
wnd 1
IF me$ = "?" THEN qelp (6): GOTO bekinado
ku 1, 1, 48
IF me$ = CHR$(0) + CHR$(75) AND oldkurso > 1 THEN oldkurso = oldkurso - 1: klearstat 31: LOCATE 31, 1: COLOR 12: lax 5 + oldkurso: haahaa 6
IF me$ = CHR$(0) + CHR$(77) AND oldkurso < jaynmax THEN oldkurso = oldkurso + 1: klearstat 31: LOCATE 31, 1: COLOR 12: lax 5 + oldkurso: haahaa 6
IF me$ = CHR$(27) THEN EXIT DO
IF me$ = CHR$(13) THEN
d = 1
IF ohj(x(kurso)) <> 0 AND oldkurso = 2 THEN d = 0
IF ohj(x(kurso)) = pv THEN d = 0
IF d = 1 THEN
COLOR 6, 0
CLS
COLOR 15
PRINT jayna(oldkurso)
PRINT
IF raha(pv) < jahinta(oldkurso) * (4 - sr(x(kurso))) THEN
COLOR 6
PRINT "SINULLA EI OLE TARPEEKSI RAHAA! YRITŽ MY™HEMMIN UUDELLEEN!"
pjn
GOTO bekinado
END IF
COLOR 6
PRINT "Uhri: ";
COLOR 14: PRINT l(x(kurso)): COLOR 6: PRINT
PRINT "Hinta: ";
COLOR 14
PRINT LTRIM$(STR$(jahinta(oldkurso) * (4 - sr(x(kurso)))))
PRINT
COLOR 6
lax 136 + oldkurso
wnd 2
IF me$ = "e" THEN GOTO bekinado
raha(pv) = raha(pv) - jahinta(oldkurso) * (4 - sr(x(kurso)))
jaynteh = 1
SELECT CASE oldkurso
CASE 1
xx = u(pv): xxx = x(kurso)
jaynteh = 1
jaynateh(pv) = jaynateh(pv) + 1
protesti
CASE 2 TO 6
jaynax(oldkurso, x(kurso)) = 1
CASE 7
jaynax(oldkurso, x(kurso)) = u(pv)
END SELECT
EXIT DO
END IF
END IF
LOOP
EXIT SUB

dalailama:
FOR xx = a TO b
IF xx > 0 AND xx < 49 THEN
IF xx < 13 THEN LOCATE 2 + xx, 1 ELSE IF xx < 25 THEN LOCATE 2 + xx - 12, 15 ELSE IF xx < 37 THEN LOCATE 15 + xx - 24, 1 ELSE LOCATE 15 + xx - 36, 15
IF kurso = xx THEN COLOR , 6 ELSE COLOR , 0
IF ohj(x(xx)) = 0 THEN COLOR 14 ELSE COLOR 7
PRINT l(x(xx));
END IF
NEXT xx
RETURN
END SUB

SUB mmkisaalku
leq 6
d = 0
FOR xx = 1 TO lpl(pv)
IF mmsarja(pel(xx, pv).nat) = 2 AND pel(xx, pv).mjo = 1 AND pel(xx, pv).inj = 0 THEN
IF d = 0 THEN d = 1
lax 176
PRINT
wnd 2
SELECT CASE me$
CASE "k"
lax 177
PRINT
pel(xx, pv).inj = 9002
pel(xx, pv).plus = 1
pel(xx, pv).kest = INT(10 * RND) + 10
CASE "e"
lax 178
PRINT
pel(xx, pv).plus = INT(3 * RND) - 3
pel(xx, pv).kest = INT(10 * RND) + 10
END SELECT
END IF
NEXT xx
IF d = 0 THEN COLOR 2: PRINT "YKSIKŽŽN PELAAJISTASI EI OLE LŽHD™SSŽ KISOIHIN."
pjn
END SUB

SUB mmkisaloppu
CLS
mmx% = 2
lax 136
PRINT
COLOR 6: PRINT "..."
PRINT
DIM mmj(1 TO 7) AS INTEGER
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
FOR a = 1 TO 500
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
lentti 1, 16
PRINT
COLOR 6: PRINT "..."
PRINT
mmnousu = mmsij(1)
xx = mmsij(1)
lentti 1, 17
PRINT
COLOR 6: PRINT "..."
PRINT
xx = mmsij(2)
lentti 1, 18
PRINT
COLOR 6: PRINT "..."
PRINT
lentti 1, 19
FOR pv = 1 TO plkm
FOR xx = 1 TO lpl(pv)
IF pel(xx, pv).inj = 9002 THEN
pel(xx, pv).kun = pel(xx, pv).kun - 3
pel(xx, pv).inj = 0
END IF
IF mmsarja(pel(xx, pv).nat) = 2 AND pel(xx, pv).mjo = 1 THEN pel(xx, pv).mjo = 0
NEXT xx
NEXT pv
pjn
ERASE mmj, mmp, mmv, mms, mmrando, mmsij
END SUB

SUB mor (mora%, morax%)
mo(mora%) = mo(mora%) + morax%
END SUB

SUB muilutus (fat%)
SELECT CASE fat%
CASE 1
jaynax(5, xx) = 0
luz 51
CASE 2
jaynax(4, xx) = 0
luz 52
CASE 3
luz 54
END SELECT

zz = INT(2 * RND) + 2
IF zz = 2 THEN zzz = 3: zzzz = 1 ELSE zzz = 2: zzzz = -1
FOR d = zz TO zzz STEP zzzz

IF tarka(d) = 0 THEN
tauti(zz, tox(xx)) = -(INT(4 * RND) + 3)
tkest(zz, tox(xx)) = INT(4 * RND) + 3
EXIT FOR
END IF
NEXT d

END SUB

SUB mukachk
FOR c = 1 TO plkm
mukp(c) = 0
NEXT c
FOR qwe = 1 TO 3
FOR cupex = 1 TO pep(qwe, pround).joukk / 2
od(1) = plex(qwe, pfxt(pround, pkr, qwe, cupex * 2 - 1))
od(2) = plex(qwe, pfxt(pround, pkr, qwe, cupex * 2))

FOR a = 1 TO 2
IF ohj(od(a)) <> 0 THEN
IF a = 1 THEN b = 2 ELSE b = 1
IF pwin(od(a)) < 3 AND pwin(od(b)) < 3 THEN mukp(ohj(od(a))) = 1 ELSE mukp(ohj(od(a))) = 0
END IF
NEXT a

NEXT cupex
NEXT qwe
END SUB

SUB naytaott (nayk%)
SELECT CASE nayk%
CASE 4
s = 1
kolo = 12
LOCATE 3
FOR cupex = 1 TO 43 STEP 2
IF hott(cupex) <> 0 AND hott(cupex + 1) <> 0 THEN
od(1) = hott(cupex)
od(2) = hott(cupex + 1)
ont 2
END IF
NEXT cupex
CASE 1
s = 1
SELECT CASE kiero(kr)
CASE 1
LOCATE 3
FOR qwe = 1 TO 4
kolo = jkolo(qwe)
IF qwe = 1 THEN LOCATE 3 ELSE IF qwe = 2 THEN LOCATE 10 ELSE IF qwe = 3 THEN LOCATE 17 ELSE LOCATE 24
FOR cupex = 1 TO 6
od(1) = x(fxt(cupex * 2 - 1, ki) + (qwe - 1) * 12)
od(2) = x(fxt(cupex * 2, ki) + (qwe - 1) * 12)
ont 1
NEXT cupex
NEXT qwe
CASE 42, 44, 46
FOR qwe = 1 TO 3
kolo = jkolo(qwe)
IF qwe = 1 THEN LOCATE 3 ELSE IF qwe = 2 THEN LOCATE 10 ELSE LOCATE 16
FOR cupex = 1 TO pep(qwe, pround).joukk / 2
IF kiero(kr) = 46 AND cupex = 1 AND qwe = 1 THEN COLOR 14
IF kiero(kr) = 46 AND cupex = 2 AND qwe = 1 THEN COLOR 6
IF kiero(kr) = 46 AND cupex = 1 AND qwe = 2 THEN COLOR 12
IF pwin(plex(qwe, pfxt(pround, pkr, qwe, cupex * 2 - 1))) < 3 AND pwin(plex(qwe, pfxt(pround, pkr, qwe, cupex * 2))) < 3 THEN
od(1) = plex(qwe, pfxt(pround, pkr, qwe, cupex * 2 - 1))
od(2) = plex(qwe, pfxt(pround, pkr, qwe, cupex * 2))
ont 1
END IF
NEXT cupex
NEXT qwe
CASE 41, 43, 45, 47
LOCATE 3, 1: COLOR 12: PRINT "EI OTTELUITA"
LOCATE 12, 1: COLOR 4: PRINT "EI OTTELUITA"
END SELECT
CASE 2
s = 1
LOCATE 3
kolo = 12
SELECT CASE cround
CASE 1
IF cupoli = 1 THEN b = 1: c = 16 ELSE b = 17: c = 32
CASE ELSE
b = 1: c = cupjouk(cround) / 2
END SELECT
FOR xx = b TO c
COLOR 8
od(1) = cup(xx * 2 - 1)
od(2) = cup(xx * 2)
ont 2
NEXT xx
CASE 3
s = 1
LOCATE 2
kolo = 12
FOR qwe = 1 TO 5
PRINT
FOR cupex = 1 TO 2
od(1) = ex((efxt(ekr, cupex * 2 - 1)) + (qwe - 1) * 4)
od(2) = ex((efxt(ekr, cupex * 2)) + (qwe - 1) * 4): ont 2
NEXT cupex
NEXT qwe
END SELECT
END SUB

SUB nollaux
FOR xxx = 1 TO plkm
FOR xx = 1 TO 32
IF pel(xx, xxx).ppp <> 1 OR ot = 0 THEN
pel(xx, xxx).gls = 0
pel(xx, xxx).ass = 0
END IF
NEXT xx
NEXT xxx
FOR xx = 1 TO 48 - plkm
FOR xxx = 1 TO 5
top(xx, xxx).gls = 0
top(xx, xxx).ass = 0
NEXT xxx
NEXT xx
END SUB

SUB ont (ontto%)
LOCATE , s
FOR a = 1 TO 2
COLOR kolo
colchk a + 1
PRINT l(od(a));
IF ontto% = 1 THEN
PRINT " ("; LTRIM$(STR$(s(od(a)))); ")";
IF s(od(a)) < 10 THEN PRINT " ";
END IF
IF a = 1 THEN PRINT " - ";  ELSE PRINT
NEXT a

END SUB

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


TYPE montx
montako AS INTEGER
malka AS INTEGER
END TYPE

TYPE pleioff
joukk AS INTEGER
voitt AS INTEGER
END TYPE

TYPE manaher
nam AS STRING * 20
nat AS INTEGER
END TYPE

TYPE tazzo
maz AS INTEGER
puz AS INTEGER
hyz AS INTEGER
END TYPE

TYPE borzzi
na AS STRING * 13
ma AS INTEGER
sy AS INTEGER
pi AS INTEGER
jo AS INTEGER
ka AS INTEGER
END TYPE

TYPE pelaaja
nam AS STRING * 13
ppp AS INTEGER
nat AS INTEGER
age AS INTEGER
psk AS INTEGER
spe AS INTEGER
svu AS INTEGER
sra AS LONG
ego AS INTEGER
pok AS INTEGER
pot AS INTEGER
kun AS INTEGER
gls AS INTEGER
ass AS INTEGER
inj AS INTEGER
lah AS INTEGER
neu AS INTEGER
ket AS INTEGER
plus AS INTEGER
kest AS INTEGER
yvo AS INTEGER
avo AS INTEGER
ldr AS INTEGER
nhl as integer
kar as integer
mjo as integer
END TYPE

TYPE lakko
nami AS STRING * 40
lelu AS pelaaja
END TYPE

TYPE topp
nam AS STRING * 13
gls AS INTEGER
ass AS INTEGER
age AS INTEGER
nat AS INTEGER
END TYPE

COMMON SHARED l() AS STRING * 10, kk() AS STRING, sr() AS INTEGER, x() AS INTEGER, gl() AS INTEGER
COMMON SHARED s() AS INTEGER, gf() AS INTEGER, ga() AS INTEGER, p() AS INTEGER
COMMON SHARED a AS INTEGER, b AS INTEGER, c AS INTEGER, d AS INTEGER, ki AS INTEGER, ot AS INTEGER, ja() AS INTEGER
COMMON SHARED win() AS INTEGER, dra() AS INTEGER, los() AS INTEGER
COMMON SHARED nn AS INTEGER, mm AS INTEGER, kausi AS INTEGER, s AS INTEGER
COMMON SHARED pkr AS INTEGER, pwin() AS INTEGER, sed() AS INTEGER, sedd() AS INTEGER
COMMON SHARED vai() AS INTEGER, nimi() AS STRING, raha() AS LONG, u() AS INTEGER
COMMON SHARED xxx AS INTEGER, plkm AS INTEGER, pv AS INTEGER, kolo AS INTEGER, valm() AS INTEGER, kr AS INTEGER, ex() AS INTEGER, egf() AS INTEGER,ega() as integer
COMMON SHARED ekr AS INTEGER, mukp() AS INTEGER, muke() AS INTEGER, eot AS INTEGER, ep() AS INTEGER
COMMON SHARED nn1 AS INTEGER, mm1 AS INTEGER, es() AS INTEGER, elt() AS INTEGER
cOMMON SHARED tx() AS INTEGER, ts() AS INTEGER, tero() AS INTEGER, tp() AS INTEGER, tnimi() AS STRING
COMMON SHARED emestari AS INTEGER, automv AS INTEGER,pros() as integer
COMMON SHARED krj$, kriisi AS INTEGER, lpl()  AS INTEGER, lpj() AS INTEGER, xx AS INTEGER, ohj() AS INTEGER, sort() AS INTEGER, kurso AS INTEGER
COMMON SHARED mw() AS INTEGER, pw() AS INTEGER, hw() AS INTEGER, etu() AS SINGLE, borsch() AS INTEGER, tarjous AS LONG
COMMON SHARED ptemp$, lastbors AS INTEGER, kuka AS INTEGER, nats AS INTEGER
COMMON SHARED ylm() AS long
COMMON SHARED man() AS INTEGER,oldkurso as integer
COMMON SHARED tkaus() AS INTEGER, tsaav() AS INTEGER, ww AS INTEGER, www AS INTEGER
COMMON SHARED mo() AS INTEGER, pelaa AS INTEGER, sort2() AS INTEGER
COMMON SHARED vuoro() AS INTEGER, maa() AS INTEGER, sivux AS INTEGER, sponsor() AS STRING, firstborsgene AS INTEGER, haikka AS INTEGER
COMMON SHARED maali() AS STRING, syotto() AS STRING, pketju() AS INTEGER, hketju() AS INTEGER, tox() AS INTEGER
COMMON SHARED skout() AS INTEGER, saav() AS INTEGER, rug() AS INTEGER, rua() AS INTEGER, tre() AS SINGLE
COMMON SHARED inte() AS INTEGER, valb() AS INTEGER,borsgenex as integer
COMMON SHARED ensintoinen AS INTEGER, rekkax AS STRING, palkehd AS long, ccc AS INTEGER
COMMON SHARED ote AS INTEGER, sopvplus AS INTEGER, veika() AS INTEGER, tulos() AS INTEGER, lokero AS INTEGER, ladattu AS INTEGER
COMMON SHARED kansap() AS STRING, kansal() AS STRING * 3, intens() AS STRING, genre() AS INTEGER, krjn() AS STRING * 1
COMMON SHARED putki() as integer, vast() AS INTEGER, koti() AS INTEGER, vieras() AS INTEGER, krapu() AS INTEGER
COMMON SHARED pelip() AS STRING * 2, tazo() AS INTEGER, jayna() AS STRING, valms() AS STRING
COMMON SHARED pel() AS pelaaja, bel() AS pelaaja, top() AS topp, kuntomax() AS INTEGER, mukt() AS INTEGER
COMMON SHARED turnimi() AS STRING, turnauz AS INTEGER, tietos AS INTEGER, rekord() AS borzzi, jel() AS pelaaja
COMMON SHARED tauti() AS INTEGER, tkest() AS INTEGER, tautip() AS SINGLE, tautik() AS INTEGER, ver1 AS STRING
COMMON SHARED haln() AS STRING, blanko AS pelaaja, eri() AS INTEGER, jaynteh AS INTEGER, uhka() AS INTEGER
COMMON SHARED momax() AS INTEGER, momin() AS INTEGER, sovtap() AS INTEGER, kuume() AS INTEGER, sopuhu() AS INTEGER
COMMON SHARED potti() AS LONG, ppotti AS LONG, kausik() AS integer, sopim() AS INTEGER, seddd() AS INTEGER, fxt() AS INTEGER
COMMON SHARED materia() AS STRING, materiax() AS INTEGER, junnu() AS INTEGER, arvsulk AS INTEGER, pirtar() AS INTEGER
COMMON SHARED kotiot() AS INTEGER, ylek() AS LONG, valbh() AS LONG, laina() AS LONG, panknim() AS STRING, pankkor() AS single, mafia() AS INTEGER
COMMON SHARED actiox() AS INTEGER, jaynateh() AS INTEGER, lhinta() AS LONG, nokka AS INTEGER
COMMON SHARED pisenj() AS INTEGER, pisenp() AS INTEGER, pisenohj() AS INTEGER, maajomin() AS INTEGER
COMMON SHARED ppors() AS borzzi, pvoittaja() AS borzzi, lukka AS INTEGER, vu AS INTEGER, sortb() AS INTEGER, sortc() AS INTEGER, naaturnaus AS INTEGER, lm AS INTEGER, palki() AS long, tkr AS INTEGER 
common shared jaynmax AS INTEGER, dat%, vaihtis%, graf() AS INTEGER
COMMON SHARED mwnn, pwnn, hwnn, mwmm, pwmm, hwmm, verk%, neup AS pelaaja, temp%
COMMON SHARED cauzi() AS INTEGER, muud AS INTEGER,zzz as integer, kiero() AS INTEGER, kiero2() AS INTEGER, kiero3() AS INTEGER
COMMON SHARED kierrosmax AS INTEGER, stvari() AS INTEGER, estvari() AS INTEGER
COMMON SHARED cup() AS INTEGER, cround AS INTEGER, cupjouk() AS INTEGER, cuparpokerto AS INTEGER, cupex AS INTEGER
COMMON SHARED pep() AS pleioff, lusmux() AS INTEGER,avg() as single
COMMON SHARED pround AS INTEGER, plex() AS INTEGER, qwe AS INTEGER, pfxt() AS INTEGER
COMMON SHARED efxt() AS INTEGER, tfxt() AS INTEGER,borssix() as integer
COMMON SHARED pkolo() AS INTEGER ,zzzz as integer,paiknim() as string
COMMON SHARED jahinta() AS LONG, jaynax() AS INTEGER,cupoli as integer
COMMON SHARED keisix() AS INTEGER, mukax() AS INTEGER, turnax() AS INTEGER
COMMON SHARED perz AS INTEGER, mana() AS manaher, taulux() AS STRING, otte() AS INTEGER
COMMON SHARED vsaldo() AS INTEGER, supaplex() AS INTEGER, jkolo() AS INTEGER, sanam() AS STRING
COMMON SHARED tkutsux() AS INTEGER, karki() AS INTEGER, sijo() AS INTEGER, mukc() AS INTEGER
COMMON SHARED mtnimi() AS STRING, mtaito() AS INTEGER, curso AS INTEGER
COMMON SHARED dad() AS INTEGER, ketju() AS INTEGER, me$,kunto() as integer
COMMON SHARED elake() AS INTEGER, anhooal() AS INTEGER, durso AS INTEGER,zz as integer
COMMON SHARED vstatus() AS INTEGER, ntext() AS STRING, saavtext() AS STRING
COMMON SHARED automat() AS INTEGER, kapu() AS INTEGER, arvob AS INTEGER, monty AS montx
COMMON SHARED tempsr() AS INTEGER, nousu() AS INTEGER, puto() AS INTEGER
COMMON SHARED tempus AS STRING * 1, luex AS STRING * 1, text AS STRING, e AS INTEGER
common shared rahna as long,gnome as integer,pelki() as integer, loukka() as integer,mood() as integer, yy as integer,z as integer,potku as integer
common shared tuloste as integer,leg() as integer,leggi as integer,mmsarja() as integer,lb as integer,smut as integer,clock$
common shared erik() as integer,erikmax() as integer,kusek as integer
common shared mmnousu as integer,mmputo as integer,mmitali() as integer,erikalk() as integer
common shared taso() as integer,ppiste() as integer,tila() as integer,paikka() as integer
common shared erikmak() as long,rahna2 as long,ppmaksu() as long,arkkitehti() as integer,mpv() as long,cupvoittaja as integer
common shared utaso() as integer,uppiste() as integer,upaikka() as integer,uhatapa() as integer,rakennuttaja() as integer,pelbudget() as long
common shared tv as integer,sponso() as long,spona() as string
common shared skoutteja() as integer,argle as integer,suosikki() as integer,infos() as integer
common shared hott() as integer,hotte() as integer,kopsa as string*1,saver%,savertype%
common shared od() as integer,ode() as single,sin1 as single, sin2 as single,luotto() as long
common shared aapee as integer, aape as integer,virhe() as integer,maine() as long,otma as integer,maalix() as integer,voittosumma() as long
common shared bl as long,cl as long, dl as long,boikotti() as integer,yvoima() as integer
common shared tempcup() as integer,konkurssi() as integer,yw() as integer,aw() as integer,yvpelaa() as integer,avpelaa() as integer
common shared voimalla as integer,testing as integer,testink as integer,kuntox() as string*1
COMMON SHARED potenssi AS SINGLE, potenssiplus AS SINGLE, potenssix AS SINGLE, perusraha AS LONG
COMMON SHARED xvolisa AS SINGLE, johlisa AS SINGLE, karlisa AS SINGLE, egolisa AS SINGLE, chainahdus as integer
common shared aktion() as integer, vapaa() as integer,spx() as integer,sin3 as single, treeni() as integer
common shared kdata() as integer,ksij() as integer

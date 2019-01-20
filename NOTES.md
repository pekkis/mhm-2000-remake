# Implementoimattomia juttuja:

## yleistä

- vaikeustasot

IF vai = 5 THEN CLS : PRINT "Valmentaja "; lm(zzz); " nostaa kauden aluksi protes-"
IF vai = 5 THEN PRINT "tin joukkuettasi vastaan! Menet„tte 3 pistett„!"
IF vai = 5 AND sarja = 1 THEN p(u) = p(u) - 3
IF vai = 5 AND sarja = 2 THEN pd(u) = pd(u) - 3
IF vai = 5 THEN INPUT yucca\$
END SUB

- veikkaus

oi = 0
COLOR 15, 0
PRINT "Veikkasit seuraavaa rivi„: "; vei$(1); " "; vei$(2); " "; vei$(3); " "; vei$(4); " "; vei$(5); " "; vei$(6)
PRINT "Oikea rivi on seuraava : "; veo$(1); " "; veo$(2); " "; veo$(3); " "; veo$(4); " "; veo$(5); " "; veo$(6)
FOR x = 1 TO 6
IF vei$(x) = veo$(x) THEN oi = oi + 1
NEXT x
PRINT
COLOR 9, 0
IF oi = 0 OR oi = 1 THEN PRINT "Valitettavasti et voittanut t„ll„ kertaa mit„„n..."
IF oi = 2 THEN PRINT "Jess! Voitit 20 pekkaa!": raha = raha + 20
IF oi = 3 THEN PRINT "Hiphei! Voitit 1.000 pekkaa!": raha = raha + 1000
IF oi = 4 THEN PRINT "Hurraa! Voitit 10.000 pekkaa!": raha = raha + 10000
IF oi = 5 THEN PRINT "Habadoodel! Voitit 50.000 pekkaa!!!!": raha = raha + 50000
IF oi = 6 THEN PRINT "UMRAH! VOITIT PŽŽVOITON, 200.000 pekkaa!!!!!!!!!!": raha = raha + 200000
IF sarja = 2 THEN INPUT yucca\$
PRINT : veiggo = 0
RETURN
enderoinen:

- IF veikko = 1 THEN palo = palo - (50 \* hjalli)

## erikoistoimenpiteet

- IF mikki = 1 AND sarja = 1 AND 100 \* RND < 6 THEN PRINT "Arh! Mikrofoni l”ytyy, ja saatte 50000 sakkoa ja 4 pisteen v„hennyksen!": p(u) = p(u) - 4: raha = raha - 50000

## ei ehkä toteuteta

- vihat

## eventit

- effueventtejä ei joukkueille joilla jo effu ennestään?

## pläjäytykset

- playoff-pläjäytys
  - IF chcup = 1 THEN tre = tre - 4
  - IF xcup = 1 THEN tre = tre - 4

## muistutukset

- viimeinen hetki ostaa pelaajia
- viimeinen hetki pitää kriisipalaveri

## webasivut

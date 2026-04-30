'$DYNAMIC
'$INCLUDE: 'mhm2k.bi'

COMMON SHARED takko AS lakko
OPEN "data\lakko.mhz" FOR RANDOM AS #1

kurso = 1

DO
GET #1, kurso, takko
CLS
PRINT "1."; takko.nami
PRINT
PRINT "1.nam..."; takko.lelu.nam
PRINT "2.ppp..."; takko.lelu.ppp
PRINT "3.psk..."; takko.lelu.psk
PRINT "  yvo..."; takko.lelu.yvo
PRINT "  avo..."; takko.lelu.avo
PRINT "4.nat..."; takko.lelu.nat
PRINT "5.age..."; takko.lelu.age
PRINT "svu..."; takko.lelu.svu
PRINT "sra..."; takko.lelu.sra
PRINT "6.ego..."; takko.lelu.ego
PRINT "  kar..."; takko.lelu.kar
PRINT "  ldr..."; takko.lelu.ldr
PRINT "plus..."; takko.lelu.plus
PRINT "kest..."; takko.lelu.kest
PRINT
PRINT "nhl..."; takko.lelu.nhl
takko.lelu.nhl = 0
PRINT "spe..."; takko.lelu.spe


me$ = "": WHILE me$ = "": me$ = INKEY$: WEND

IF me$ = CHR$(0) + CHR$(75) THEN kurso = kurso - 1
IF me$ = CHR$(0) + CHR$(77) THEN kurso = kurso + 1

IF me$ = CHR$(13) THEN
takko.lelu.svu = 666
takko.lelu.sra = 0
PUT #1, kurso, takko
END IF

IF me$ = "1" THEN
CLS
INPUT "kokonimi...", re$
takko.nami = re$
INPUT "lyhytnimi...", re$
takko.lelu.nam = re$
PUT #1, kurso, takko
END IF


IF me$ = "2" THEN
CLS
INPUT "ppp...", xx
takko.lelu.ppp = xx
PUT #1, kurso, takko
END IF

IF me$ = "3" THEN
CLS
INPUT "psk...", xx
takko.lelu.psk = xx
INPUT "yvo...", xx
takko.lelu.yvo = xx
INPUT "avo...", xx
takko.lelu.avo = xx
PUT #1, kurso, takko
END IF

IF me$ = "4" THEN
CLS
INPUT "nat...", xx
takko.lelu.nat = xx
PUT #1, kurso, takko
END IF

IF me$ = "5" THEN
CLS
INPUT "age...", xx
takko.lelu.age = xx
PUT #1, kurso, takko
END IF

IF me$ = "6" THEN
CLS
INPUT "ego...", xx
takko.lelu.ego = xx
INPUT "kar...", xx
takko.lelu.kar = xx
INPUT "ldr...", xx
takko.lelu.ldr = xx
PUT #1, kurso, takko
END IF

LOOP




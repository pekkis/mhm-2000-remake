# MHM 2000 — variable decoder

Source: [`MHM2K.BI`](../MHM2K.BI). Every `COMMON SHARED` global, bucketed
by domain. `❓ TODO` = please clarify.

QB sigil reminder: `%` = INTEGER (16-bit), `&` = LONG (32-bit), `!` =
SINGLE, `#` = DOUBLE, `$` = STRING, `()` = array. No sigil + `AS X` =
explicit type. Convention in this codebase: array = per-team or
per-manager indexed; scalar = global.

---

## TYPEs (struct definitions)

### `pelaaja` — PLAYER (the central record)

| Field  | QB type    | Meaning                                                                           | TODO                  |
| ------ | ---------- | --------------------------------------------------------------------------------- | --------------------- |
| `nam`  | STRING\*13 | name                                                                              |                       |
| `ppp`  | INTEGER    | **player position**: 1=goalkeeper, 2=defence, 3=left wing, 4=center, 5=right wing | confirmed             |
| `nat`  | INTEGER    | nationality (index into nation table)                                             |                       |
| `age`  | INTEGER    | age                                                                               |                       |
| `psk`  | INTEGER    | skill / "pelisilmä-skill"?                                                        | TODO: confirm         |
| `spe`  | INTEGER    | speed?                                                                            | TODO: confirm         |
| `svu`  | INTEGER    | ❓                                                                                | TODO: `svu` =?        |
| `sra`  | LONG       | salary (`sra` = "saraka"? "sara")                                                 | TODO: confirm meaning |
| `ego`  | INTEGER    | ego                                                                               |                       |
| `pok`  | INTEGER    | ❓ ("pokka"? coolness?)                                                           | TODO                  |
| `pot`  | INTEGER    | potential                                                                         |                       |
| `kun`  | INTEGER    | current condition / form (kunto)                                                  |                       |
| `gls`  | INTEGER    | season goals                                                                      |                       |
| `ass`  | INTEGER    | season assists                                                                    |                       |
| `inj`  | INTEGER    | injury (rounds remaining)                                                         |                       |
| `lah`  | INTEGER    | ❓ ("lahjakkuus"? talent? "lähtö"? exit?)                                         | TODO                  |
| `neu`  | INTEGER    | ❓ ("neuvottelu"? negotiation skill?)                                             | TODO                  |
| `ket`  | INTEGER    | line/chain assignment (ketju)                                                     |                       |
| `plus` | INTEGER    | bonus modifier                                                                    | TODO: clarify         |
| `kest` | INTEGER    | durability (kesto)                                                                |                       |
| `yvo`  | INTEGER    | power-play rating (ylivoima)                                                      |                       |
| `avo`  | INTEGER    | penalty-kill rating (alivoima)                                                    |                       |
| `ldr`  | INTEGER    | leadership                                                                        |                       |
| `nhl`  | INTEGER    | NHL flag (drafted / leaving)                                                      | TODO: 0/1 or year?    |
| `kar`  | INTEGER    | **charisma** (drawn from KEISIT.M2K col 6 with bell-shaped roll)                  | confirmed             |
| `mjo`  | INTEGER    | national team flag (maajoukkue)                                                   |                       |

### `topp` — top scorer entry

`nam STRING*13, gls, ass, age, nat`. League scoring leaderboard row.

### `borzzi` — player-market entry (slim view of a player on the market)

| Field | Type         | Meaning                                    |
| ----- | ------------ | ------------------------------------------ |
| `na`  | STRING \* 13 | player name                                |
| `ma`  | INTEGER      | ❓ TODO (asking price?)                    |
| `sy`  | INTEGER      | ❓ TODO (syntymävuosi = birth year / age?) |
| `pi`  | INTEGER      | ❓ TODO                                    |
| `jo`  | INTEGER      | ❓ TODO (joukkue = team / origin?)         |
| `ka`  | INTEGER      | ❓ TODO                                    |

`na STRING*13, ma, sy, pi, jo, ka`.
TODO: what do `ma sy pi jo ka` mean? Looks like 5 score columns.

### `pleioff` — playoff seed

`joukk INTEGER, voitt INTEGER`. Team id + wins-in-series.

### `manaher` — manager identity

`nam STRING*20, nat INTEGER`. Name + nationality.

### `lakko` — contract dispute / strike

`nami STRING*40, lelu AS pelaaja`. ("lakko" = strike, "lelu" = toy?
TODO: clarify why a player is `lelu`.)

### `tazzo` — ❓ standings row?

`maz, puz, hyz`. TODO: completely opaque; please decode. Looks like a
3-column tally (maalit/pisteet/hyökkäys?).

### `montx` — ❓

`montako INTEGER, malka INTEGER`. ("montako" = how many, "malka" =
beam/pole?). TODO.

---

## League / season scalars

| Var                             | Type    | Meaning                                   | TODO                    |
| ------------------------------- | ------- | ----------------------------------------- | ----------------------- |
| `kausi`                         | INTEGER | season number                             |                         |
| `nn`                            | INTEGER | round (kierros)                           | TODO: confirm vs. mm    |
| `mm`                            | INTEGER | phase / submenu                           | TODO: confirm           |
| `s`                             | INTEGER | sarja (current league: 1=PHL, 2=Division) |                         |
| `ki`                            | INTEGER | ❓ (kierros?)                             | TODO                    |
| `ot`                            | INTEGER | ottelu (match counter)                    |                         |
| `pv`                            | INTEGER | **pelaaja vuorossa** — index (1..`plkm`, max 4) of the human player whose turn it currently is in the hot-seat rotation. Used everywhere as the per-manager subscript: `raha(pv)`, `laina(curso, pv)`, `mafia(pv)`, `u(pv)` (which team this player manages), `sr(u(pv))` (the tier of that team), etc. NOT a day counter despite the obvious "päivä" reading. | confirmed               |
| `kr`                            | INTEGER | kierros — round counter                   | TODO: vs. nn            |
| `pkr`                           | INTEGER | playoff round                             |                         |
| `ekr`                           | INTEGER | EHL round                                 |                         |
| `eot`                           | INTEGER | EHL match counter                         |                         |
| `kolo`                          | INTEGER | ❓ ("kolo" = hole/slot)                   | TODO                    |
| `xx`, `yy`, `zz`, `zzz`, `zzzz` | INTEGER | scratch loop indices                      |                         |
| `xxx`                           | INTEGER | scratch                                   | TODO: any specific use? |
| `plkm`                          | INTEGER | pelaajien lukumäärä — number of human players in this hot-seat game (1..4). Bound for every `FOR pv = 1 TO plkm` loop. | confirmed               |

## League per-team arrays (indexed by team id)

| Var                    | Type    | Meaning                           | TODO                    |
| ---------------------- | ------- | --------------------------------- | ----------------------- |
| `gf()`                 | INTEGER | goals for                         |                         |
| `ga()`                 | INTEGER | goals against                     |                         |
| `p()`                  | INTEGER | points                            |                         |
| `win() dra() los()`    | INTEGER | W / D / L                         |                         |
| `s()`                  | INTEGER | ❓ scalar `s` shadowed by array?  | TODO                    |
| `sr()`                 | INTEGER | series tier per team: 1 = PHL, 2 = Divisioona, 3 = Mutasarja (`ILEZ5.BAS:1226` PRINT, `ILEZ5.BAS:295..314` promotion/relegation mutations). Also gates loan ceilings (`luotto * (4 - sr)`) and many UI color choices via `jkolo(sr(...))`. | confirmed               |
| `gl()`                 | INTEGER | ❓ goal-related?                  | TODO                    |
| `x()`                  | INTEGER | ❓ generic "extra" / sort scratch | TODO                    |
| `ja()`                 | INTEGER | ❓                                | TODO                    |
| `pwin()`               | INTEGER | playoff wins                      |                         |
| `sed() sedd() seddd()` | INTEGER | ❓ tiered "sed" — TODO            | TODO: 3 levels of what? |
| `ex()`                 | INTEGER | ❓ "extra" results?               | TODO                    |
| `egf() ega() ep()`     | INTEGER | EHL goals/points                  |                         |
| `es() elt()`           | INTEGER | EHL ❓                            | TODO                    |
| `nimi()`               | STRING  | team names                        | TODO: or manager names? |
| `u()`                  | INTEGER | active manager's team(s)          |                         |
| `man()`                | INTEGER | manager flag per team             | TODO: confirm           |
| `vai()`                | INTEGER | ❓ ("vaihto"? substitution?)      | TODO                    |
| `automat()`            | INTEGER | auto-play flag per manager        |                         |
| `automv`               | INTEGER | global auto-play move flag        | TODO                    |

## Money

| Var               | Type    | Meaning                               | TODO                   |
| ----------------- | ------- | ------------------------------------- | ---------------------- |
| `raha()`          | LONG    | money per team                        |                        |
| `palki()`         | LONG    | prize money / awards                  | TODO: prize or salary? |
| `palkehd`         | LONG    | salary obligation?                    | TODO                   |
| `laina()`         | LONG    | loans                                 |                        |
| `panknim()`       | STRING  | bank name                             |                        |
| `pankkor()`       | SINGLE  | bank interest rate                    |                        |
| `ylek()`          | LONG    | ❓ ("ylevä"? "yleisö"?)               | TODO                   |
| `valbh()`         | LONG    | trainer cost (`valmentaja`)           | TODO confirm           |
| `lhinta()`        | LONG    | ❓ ("lippuhinta"? ticket price?)      | TODO                   |
| `voittosumma()`   | LONG    | winnings                              |                        |
| `ppmaksu()`       | LONG    | ❓ ("per-peli maksu"? per-match fee?) | TODO                   |
| `mpv()`           | LONG    | ❓                                    | TODO                   |
| `pelbudget()`     | LONG    | team budget                           |                        |
| `erikmak()`       | LONG    | special-action cost                   |                        |
| `tarjous`         | LONG    | offer (transfer)                      |                        |
| `jahinta()`       | LONG    | ❓ player asking price?               | TODO                   |
| `rahna`, `rahna2` | LONG    | scratch money totals                  | TODO: which is which   |
| `perusraha`       | LONG    | base money / starting cash            |                        |
| `luotto()`        | LONG    | credit                                |                        |
| `bl, cl, dl`      | LONG    | scratch                               |                        |
| `maine()`         | LONG    | reputation                            |                        |
| `sponso()`        | LONG    | sponsor money                         |                        |
| `spona()`         | STRING  | sponsor name                          |                        |
| `potti()`         | LONG    | jackpot per competition?              | TODO confirm           |
| `ppotti`          | LONG    | grand jackpot?                        | TODO                   |
| `ylm()`           | LONG    | ❓                                    | TODO                   |
| `mafia()`         | INTEGER | per-manager "the mafia owns you" flag (0/1). Set to 1 the instant a manager borrows even one pekka from bank #3 IVAN'S INVEST (`ILEX5.BAS:4126`). While set, the random event walker can fire mafia-only branches: morality-tested morale hits (CASES 148, 149 with `lux 63`), forced match-fixing (`sovtap = 1`, CASES 150 151 160 161 with `lux 64`), and an interactive shakedown (CASES 152 159 — refuse and pranks 3, 5, 6 are queued against you; comply for an extra cash trickle, `lux 65`/`64`/`55`). After fully repaying the Ivan loan there's a per-rollover 30% chance the flag clears (`ILEX5.BAS:7728..7729`). | confirmed              |

## Players / roster

| Var                         | Type           | Meaning                                                                                                                                                                                                                                                                                                                                                                                                    | TODO                 |
| --------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `pel()`                     | pelaaja        | master roster (per team × per slot)                                                                                                                                                                                                                                                                                                                                                                        | TODO: dimensions     |
| `bel()`                     | pelaaja        | bench / B-roster                                                                                                                                                                                                                                                                                                                                                                                           | TODO                 |
| `jel()`                     | pelaaja        | juniors                                                                                                                                                                                                                                                                                                                                                                                                    | TODO confirm         |
| `neup`                      | pelaaja        | currently negotiated player                                                                                                                                                                                                                                                                                                                                                                                | TODO                 |
| `blanko`                    | pelaaja        | empty template — used to wipe slots                                                                                                                                                                                                                                                                                                                                                                        |                      |
| `top()`                     | topp           | top-scorer table                                                                                                                                                                                                                                                                                                                                                                                           |                      |
| `rekord()`                  | borzzi         | player-market listings (börssi entries; runtime players also stored in a random-access file like a DB)                                                                                                                                                                                                                                                                                                     | confirmed            |
| `kunto()`                   | INTEGER        | per-player condition shadow?                                                                                                                                                                                                                                                                                                                                                                               | TODO why two         |
| `kuntomax()`                | INTEGER        | per-player max condition                                                                                                                                                                                                                                                                                                                                                                                   |                      |
| `kuntox()`                  | STRING\*1      | condition tier glyph                                                                                                                                                                                                                                                                                                                                                                                       |                      |
| `valm()`                    | INTEGER        | trainer per team                                                                                                                                                                                                                                                                                                                                                                                           |                      |
| `inj? in pelaaja`           |                | injuries live on player                                                                                                                                                                                                                                                                                                                                                                                    |                      |
| `loukka()`                  | INTEGER        | injury list per team?                                                                                                                                                                                                                                                                                                                                                                                      | TODO vs. pelaaja.inj |
| `kapu()`                    | INTEGER        | ❓ "captain"?                                                                                                                                                                                                                                                                                                                                                                                              | TODO                 |
| `tre()`                     | SINGLE         | trainer multiplier                                                                                                                                                                                                                                                                                                                                                                                         |                      |
| `mtnimi() mtaito()`         | STRING/INTEGER | **manager attribute labels + values**. `mtnimi(1..6)` = the six attribute names loaded from DATAX.M2K (STRATEGIAT, ERIKOISTILANTEET, NEUVOTTELUTAITO, NEUVOKKUUS, KARISMA, ONNEKKUUS). `mtaito(1..6, 1..54+plkm)` = each manager's six attribute values, range −3..+3. CPU values from MANAGERS.M2K; human values come from the new-game point-spend UI ([MHM2K.BAS:1480](../MHM2K.BAS)) keyed at `54+pv`. | confirmed            |
| `pketju() hketju() ketju()` | INTEGER        | line chains: power-play / penalty-kill / general                                                                                                                                                                                                                                                                                                                                                           | TODO confirm         |
| `treeni()`                  | INTEGER        | training type per team                                                                                                                                                                                                                                                                                                                                                                                     |                      |

## Strategy & match

| Var                                 | Type      | Meaning                                                                                                                                                                                                                                                            | TODO         |
| ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| `koti() vieras() vast()`            | INTEGER   | home/away/opponent of upcoming match                                                                                                                                                                                                                               | TODO confirm |
| `pelip()`                           | STRING\*2 | strategy code                                                                                                                                                                                                                                                      |              |
| `tazo()`                            | INTEGER   | **CPU team strength level (1..58)** — indexes TASOT.M2K (`lvl(tazo(team))`) for goalie/def/att raw stats and MATERIAX.M2K → MATERIA.M2K for the UI "material tier" label. NOT the same as `taso()` (arena tier).                                                   |
| `jayna()`                           | STRING    | ❓ ("jäynä" = prank? line setup?)                                                                                                                                                                                                                                  | TODO         |
| `jaynteh jaynateh jaynmax jaynax()` | INTEGER   | prank counts/limits                                                                                                                                                                                                                                                | TODO clarify |
| `valms()`                           | STRING    | strategy name                                                                                                                                                                                                                                                      |              |
| `valb()`                            | INTEGER   | strategy weight                                                                                                                                                                                                                                                    |              |
| `intens()`                          | STRING    | intensity label                                                                                                                                                                                                                                                    |              |
| `genre()`                           | INTEGER   | playing-style genre                                                                                                                                                                                                                                                | TODO         |
| `krjn()`                            | STRING\*1 | **first-initial pool** — 23 single letters (`A E I O U Y R T P S H J K L N M C D B W Z G F`) loaded from DATAX.M2K records 41..63. Pekkalandian players draw from `krjn(1..16)`, foreigners from all 23. Ported to [src/data/initials.ts](../../data/initials.ts). | confirmed    |
| `krj$`                              | STRING    | scratch holding the rolled first initial in `SUB rela` ([YHTEIS.BAS:1](../YHTEIS.BAS)). Player name composed as `krj$ + "." + ptemp$` → e.g. `K.Hirvikoski`.                                                                                                       | confirmed    |
| `maali()`                           | STRING    | goal-event text log                                                                                                                                                                                                                                                |              |
| `syotto()`                          | STRING    | assist text                                                                                                                                                                                                                                                        |              |
| `vu`                                | INTEGER   | scratch (vuoro = turn?)                                                                                                                                                                                                                                            |              |
| `vuoro()`                           | INTEGER   | turn order per team?                                                                                                                                                                                                                                               | TODO         |
| `kotiot()`                          | INTEGER   | home matches played counter                                                                                                                                                                                                                                        |              |
| `otma`                              | INTEGER   | match... mahjong? maximum?                                                                                                                                                                                                                                         | TODO         |
| `otte()`                            | INTEGER   | match flags                                                                                                                                                                                                                                                        | TODO         |

## Morale / status / events

| Var                         | Type    | Meaning                                  | TODO                        |
| --------------------------- | ------- | ---------------------------------------- | --------------------------- |
| `mo()`                      | INTEGER | morale per team                          |                             |
| `mood()`                    | INTEGER | mood — vs. mo?                           | TODO clarify diff           |
| `momax() momin()`           | INTEGER | morale clamps per team                   |                             |
| `tre()`                     | SINGLE  | trainer effect                           |                             |
| `tauti()`                   | INTEGER | illness flag                             |                             |
| `tkest()`                   | INTEGER | illness duration                         |                             |
| `tautip()`                  | SINGLE  | illness probability                      |                             |
| `tautik()`                  | INTEGER | illness counter                          |                             |
| `krapu()`                   | INTEGER | hangover modifier                        |                             |
| `kuume()`                   | INTEGER | fever                                    |                             |
| `putki()`                   | INTEGER | streak                                   |                             |
| `uhka()`                    | INTEGER | threat / pressure                        |                             |
| `vstatus()`                 | INTEGER | viewer/manager status                    | TODO                        |
| `ntext() saavtext()`        | STRING  | news text / achievement text             |                             |
| `aktion() actiox()`         | INTEGER | action flags                             | TODO clarify                |
| `vapaa()`                   | INTEGER | "free" — what kind?                      | TODO                        |
| `spx()`                     | INTEGER | ❓                                       | TODO                        |
| `inte()`                    | INTEGER | interview / interest                     | TODO                        |
| `sopuhu()`                  | INTEGER | ❓ ("sopu-puhe"? peace talk?)            | TODO                        |
| `sovtap()`                  | INTEGER | match-fixing flag ("sovittu tappio" = agreed loss). Set to 1 by mafia event branches CASES 150/151/160/161 (`ILEX5.BAS:6132`) when the morality check fails — the manager is forced to throw the next match for the Russian mob. Likely also set by the regular `sopupeli` event. | confirmed                   |
| `sopim()`                   | INTEGER | contract status                          | TODO                        |
| `sopvplus`                  | INTEGER | contract bonus                           | TODO                        |
| `pelki()`                   | INTEGER | fear (pelko)                             |                             |
| `boikotti()`                | INTEGER | boycott flag                             |                             |
| `konkurssi()`               | INTEGER | bankruptcy flag                          |                             |
| `potku`                     | INTEGER | firing flag (potku = kick)               |                             |
| `kiero() kiero2() kiero3()` | INTEGER | corruption tiers                         | TODO: 3 dimensions of what? |
| `cauzi()`                   | INTEGER | ❓ ("kauzi"? "case"?)                    | TODO                        |
| `muud`                      | INTEGER | ❓ ("muudos"? change?)                   | TODO                        |
| `nokka`                     | INTEGER | ❓ ("nokka" = beak/spout)                | TODO                        |
| `haikka`                    | INTEGER | ❓ ("haikka" = ?)                        | TODO                        |
| `argle`                     | INTEGER | ❓                                       | TODO: cosmic mystery        |

## Manager

| Var                          | Type      | Meaning                          | TODO         |
| ---------------------------- | --------- | -------------------------------- | ------------ |
| `mana()`                     | manaher   | manager records                  |              |
| `me$`                        | STRING    | current player input / "you" key |              |
| `kuka`                       | INTEGER   | active manager id                |              |
| `kurso oldkurso curso durso` | INTEGER   | various cursor positions         | TODO clarify |
| `nat()`                      | INTEGER   | per-team nationality?            | TODO         |
| `nats`                       | INTEGER   | nation count?                    | TODO         |
| `kansap()`                   | STRING    | nation full name                 |              |
| `kansal()`                   | STRING\*3 | nation 3-letter code             |              |
| `maa()`                      | INTEGER   | country index per team           |              |
| `maajomin()`                 | INTEGER   | min nat-team rating threshold    | TODO         |
| `elake()`                    | INTEGER   | retirement (eläke)               |              |
| `anhooal()`                  | INTEGER   | ❓ ("an-hoo-al"? gibberish?)     | TODO         |

## Player market (BÖRSSI — NOT a stock market)

Player market = list of free agents / available players. Persistent
player records live in a random-access file (database-style).

| Var                                | Type    | Meaning                              | TODO                        |
| ---------------------------------- | ------- | ------------------------------------ | --------------------------- |
| `borsch()`                         | INTEGER | per-player market state              |                             |
| `borssix()`                        | INTEGER | seed indices into BORSSIX.M2K        |                             |
| `lastbors firstborsgene borsgenex` | INTEGER | player-gen pointers in market        | TODO                        |
| `etu()`                            | SINGLE  | per-player market movement per tick  |                             |
| `ppors`                            | borzzi  | currently-displayed market entry     | TODO                        |
| `pvoittaja()`                      | borzzi  | bidding winners (`pelaaja-voittaja`) |                             |
| `lukka`                            | INTEGER | "lock" — market closed?              | TODO                        |
| `pirtar()`                         | INTEGER | ❓ "pir-tar" — stock tier?           | TODO: pirtar1..7 SUBs exist |

## Betting

| Var                            | Type    | Meaning                   | TODO               |
| ------------------------------ | ------- | ------------------------- | ------------------ |
| `veika()`                      | INTEGER | coupon picks (veikkaus)   |                    |
| `tulos()`                      | INTEGER | results                   |                    |
| `ote`                          | INTEGER | share / exposure (otto?)  | TODO               |
| `ccc`                          | INTEGER | coupon counter?           | TODO               |
| `lokero`                       | INTEGER | slot id (lokero = locker) |                    |
| `pisenj() pisenp() pisenohj()` | INTEGER | betting points            | TODO clarify three |
| `voimalla`                     | INTEGER | "with-power" multiplier   | TODO               |

## EHL (Euro)

| Var                                          | Type    | Meaning                       | TODO              |
| -------------------------------------------- | ------- | ----------------------------- | ----------------- |
| `mw() pw() hw()`                             | INTEGER | ❓ (main/power/home weights?) | TODO              |
| `mwnn pwnn hwnn mwmm pwmm hwmm`              | INTEGER | indexed by round/phase        | TODO              |
| `mukp() muke() mukt() mukc() mukax() mukax%` | INTEGER | participation tiers           | TODO clarify each |
| `emestari`                                   | INTEGER | European champion id          |                   |
| `euromaar`                                   | INTEGER | euro money/payout             | TODO              |

## Cup (Suomen Cup?)

| Var                                        | Type    | Meaning                                | TODO |
| ------------------------------------------ | ------- | -------------------------------------- | ---- |
| `cup() cupjouk() cupex cupoli cupvoittaja` | INTEGER | cup tree state                         |      |
| `cround`                                   | INTEGER | cup round                              |      |
| `cuparpokerto`                             | INTEGER | ❓ ("arvonta-kerto"? draw multiplier?) | TODO |
| `tempcup()`                                | INTEGER | cup scratch                            |      |

## Tournaments / invitations

| Var                          | Type    | Meaning                                  | TODO         |
| ---------------------------- | ------- | ---------------------------------------- | ------------ |
| `turnimi()`                  | STRING  | tournament names                         |              |
| `turnauz turnax() tkutsux()` | INTEGER | tournament status / invitations          | TODO clarify |
| `naaturnaus`                 | INTEGER | "naapuri-turnaus" = neighbor tournament? | TODO         |

## Playoffs

| Var                            | Type    | Meaning                                    | TODO         |
| ------------------------------ | ------- | ------------------------------------------ | ------------ |
| `pep()`                        | pleioff | playoff bracket entries                    |              |
| `pround plex() pfxt() pkolo()` | INTEGER | playoff round / index / fixture / position | TODO clarify |
| `lpl() lpj()`                  | INTEGER | ❓ "loppu-pl/pj" = final?                  | TODO         |
| `lukka`                        |         | (already noted above)                      |              |
| `lokero`                       |         | (above)                                    |              |

## MM-kisat (World Championships)

| Var                                  | Type    | Meaning                                | TODO |
| ------------------------------------ | ------- | -------------------------------------- | ---- |
| `mmsarja() mmnousu mmputo mmitali()` | INTEGER | WC group / promo / relegation / medals |      |
| `nats`                               | INTEGER | nation count                           |      |
| `kunsap kunsal`                      | STRING  | (above, country names)                 |      |

## Arenas / facilities

| Var                                     | Type    | Meaning                              | TODO         |
| --------------------------------------- | ------- | ------------------------------------ | ------------ |
| `taso()`                                | INTEGER | arena tier per team                  |              |
| `ppiste()`                              | INTEGER | arena point score                    | TODO confirm |
| `tila()`                                | INTEGER | arena state                          |              |
| `paikka()`                              | INTEGER | capacity                             |              |
| `arkkitehti()`                          | INTEGER | architect quality                    |              |
| `rakennuttaja()`                        | INTEGER | builder                              |              |
| `utaso() uppiste() upaikka() uhatapa()` | INTEGER | upgrade tier / points / pos / method | TODO each    |

## Stats blobs

| Var                              | Type           | Meaning                                                                                                              | TODO      |
| -------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------- | --------- |
| `tx() ts() tero() tp() tnimi()`  | INTEGER/STRING | season-end top scorer columns                                                                                        | TODO each |
| `tkaus() tsaav()`                | INTEGER        | ❓ "season"/"achievement"?                                                                                           | TODO      |
| `taulux()`                       | STRING         | rendered tables stored as strings                                                                                    |           |
| `karki() sijo()`                 | INTEGER        | top / position                                                                                                       |           |
| `kdata() ksij()`                 | INTEGER        | season-end ❓ data/position                                                                                          | TODO      |
| `sortb() sortc() sort() sort2()` | INTEGER        | sorting scratch                                                                                                      |           |
| `tempsr()`                       | INTEGER        | sort temp                                                                                                            |           |
| `nousu() puto()`                 | INTEGER        | promoted / relegated team(s)                                                                                         |           |
| `dad(1..5, 1..6)`                | INTEGER        | lineup slot mask from `KARSA.M2K` — `dad(position, line) = 1` means that position must be filled in that line config | confirmed |
| `ketju()`                        | INTEGER        | (above, line chain)                                                                                                  |           |
| `actiox()`                       | (above)        |                                                                                                                      |           |

## EHL/Cup/Tournament fixtures

| Var                    | Type    | Meaning                         | TODO |
| ---------------------- | ------- | ------------------------------- | ---- |
| `fxt()`                | INTEGER | fixture array                   |      |
| `pfxt() efxt() tfxt()` | INTEGER | playoff/EHL/tournament fixtures |      |

## Misc / scratch / IO

| Var                                      | Type                | Meaning                                   | TODO        |
| ---------------------------------------- | ------------------- | ----------------------------------------- | ----------- |
| `dat%`                                   | INTEGER             | "date" / data flag                        | TODO        |
| `vaihtis%`                               | INTEGER             | substitution allowed?                     | TODO        |
| `verk%`                                  | INTEGER             | network mode?                             | TODO        |
| `temp%`                                  | INTEGER             | scratch                                   |             |
| `saver% savertype%`                      | INTEGER             | save mode flags                           |             |
| `kopsa STRING*1`                         | STRING              | scratch char                              |             |
| `clock$`                                 | STRING              | clock                                     |             |
| `tempus STRING*1`                        | STRING              | scratch char                              |             |
| `luex STRING*1`                          | STRING              | scratch char                              |             |
| `text STRING`                            | STRING              | scratch text                              |             |
| `e INTEGER`                              | INTEGER             | scratch                                   |             |
| `ver1 STRING`                            | STRING              | version string                            |             |
| `chainahdus`                             | INTEGER             | CHAIN return-tag (1=stats,2=arena)        |             |
| `ensintoinen`                            | INTEGER             | "first-time" flag (game properly started) |             |
| `ladattu`                                | INTEGER             | "loaded" flag                             |             |
| `ote`                                    | INTEGER             | (above, share/grip)                       |             |
| `monty`                                  | montx               | single instance of montx — TODO purpose   |             |
| `arvob arvsulk`                          | INTEGER             | ❓ "arvonta-…" = lottery-…?               | TODO each   |
| `tietos`                                 | INTEGER             | ❓ "tieto-s" = info-…?                    | TODO        |
| `pelaa`                                  | INTEGER             | "play" flag                               |             |
| `tuloste`                                | INTEGER             | print flag                                |             |
| `leg() leggi`                            | INTEGER             | "leg" stat?                               | TODO        |
| `lb`                                     | INTEGER             | scratch                                   |             |
| `smut`                                   | INTEGER             | ❓ ("smut" = ?)                           | TODO        |
| `erik() erikmax() erikalk() erikmak()`   | INTEGER/LONG        | special-actions array                     | TODO each   |
| `kusek`                                  | INTEGER             | ❓ — TODO: please decode                  | TODO        |
| `tv`                                     | INTEGER             | TV broadcast flag                         |             |
| `skoutteja()`                            | INTEGER             | scout count                               |             |
| `skout()`                                | INTEGER             | scout assignments                         |             |
| `infos()`                                | INTEGER             | info known per team                       |             |
| `suosikki()`                             | INTEGER             | favorite team                             | TODO whose? |
| `hott() hotte()`                         | INTEGER             | hot streak / temperature?                 | TODO        |
| `od() ode()`                             | INTEGER/SINGLE      | odds / stake?                             | TODO        |
| `sin1 sin2 sin3`                         | SINGLE              | scratch singles                           |             |
| `aapee aape`                             | INTEGER             | ❓ "A.B." labels?                         | TODO        |
| `virhe()`                                | INTEGER             | error flags                               |             |
| `maine()`                                | (above, reputation) |                                           |             |
| `maalix()`                               | INTEGER             | season goals tally?                       | TODO        |
| `voittosumma()`                          | (above, winnings)   |                                           |             |
| `cl bl dl`                               | LONG                | (above, scratch)                          |             |
| `yvoima() yw() aw() yvpelaa() avpelaa()` | INTEGER             | power-play / kill state                   |             |
| `pirtar()`                               | (above, stock tier) |                                           |             |
| `gnome`                                  | INTEGER             | ❓ literally "gnome" — TODO mystery       | TODO        |
| `qwe`                                    | INTEGER             | scratch                                   |             |
| `lm`                                     | INTEGER             | scratch (last-match?)                     | TODO        |
| `tkr`                                    | INTEGER             | tournament round counter?                 | TODO        |
| `ww www`                                 | INTEGER             | scratch loop counters                     |             |
| `pelaa`                                  | (above)             |                                           |             |
| `testing testink`                        | INTEGER             | dev flags                                 |             |
| `ksij()`                                 | (above)             |                                           |             |
| `sortb() sortc()`                        | (above)             |                                           |             |
| `materia() materiax()`                   | STRING/INTEGER      | "material" — what?                        | TODO        |
| `junnu()`                                | INTEGER             | junior count per team                     | TODO        |
| `arvsulk`                                | (above)             |                                           |             |
| `pirtar()`                               | (above)             |                                           |             |
| `kotiot()`                               | (above)             |                                           |             |

## Balance constants (likely user-tunable in MHM 2000 remake)

These are **the formula knobs**. Single-precision = multiplier.

| Var                               | Type   | Meaning                        | TODO         |
| --------------------------------- | ------ | ------------------------------ | ------------ |
| `potenssi potenssiplus potenssix` | SINGLE | "power" tiered multiplier      | TODO clarify |
| `xvolisa`                         | SINGLE | extra modifier ("xvo-lisä")    | TODO         |
| `johlisa`                         | SINGLE | leadership bonus ("joht-lisä") | TODO         |
| `karlisa`                         | SINGLE | ❓ ("kar-lisä", + `kar` field) | TODO         |
| `egolisa`                         | SINGLE | ego bonus                      |              |
| `perusraha`                       | LONG   | base starting cash             |              |

---

## Field naming patterns I noticed

- **Suffix `()`** = per-team or per-manager array. Almost universally.
- **Prefix `e`** = EHL version of the same field. (`ekr` ↔ `kr`,
  `egf()` ↔ `gf()`, etc.)
- **Prefix `p`** = playoff version. (`pkr` ↔ `kr`, `pwin()` ↔ `win()`,
  `pep()`, `pround`.)
- **Prefix `t`** = tournament version. (`tfxt()`, `turnax()`.)
- **Prefix `c`** = cup. (`cround`, `cupex`.)
- **Prefix `mm`** = world championships. (`mmsarja()`, `mmnousu`.)
- **Suffix `nimi`** = name. **Suffix `max`/`min`** = clamp. **Suffix
  `x`** = "extra"/index/scratch (`borssix()`, `mukax()`, `actiox()`).
- **Suffix `k`** = counter. (`tautik()`, `kausik()`, `kotiot()` is sus.)

This pattern is **goldmine for porting**: most fields fall into a
`Record<TeamId, T>` or per-competition-overlay shape we already have in
MHM 97's TS code.

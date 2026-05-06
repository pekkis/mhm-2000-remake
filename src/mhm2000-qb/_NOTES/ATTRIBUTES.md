# Manager attributes — `mtaito(1..6, manager)`

Reference: every QB call site of `mtaito()` enumerated here, classified
by attribute, with port status and a per-attribute power assessment.
Companion to [VARIABLES.md](VARIABLES.md) (which carries the schema
row) and [SUBS.md](SUBS.md) (which carries the SUB-by-SUB porting
state).

> **Range is signed −3..+3 in QB.** Bounded by the wizard at
> [MHM2K.BAS:1535](../MHM2K.BAS) (`> -3`) and
> [MHM2K.BAS:1539](../MHM2K.BAS) (`< 3`); rendered with a sign-aware
> three-way branch at [ILES5.BAS:741](../ILES5.BAS); used unshifted in
> every multiplier site (e.g. `* (1 + mtaito(2)*.04)` → 0.88..1.12).
> A previous draft of `runTasomuut` had a `+4` shift based on a
> misreading; corrected — see [STATUS.md](STATUS.md).

---

## The six attributes (QB index → TS field)

| QB  | QB label         | TS field          | Power |
| --- | ---------------- | ----------------- | ----- |
| 1   | STRATEGIAT       | `strategy`        | C     |
| 2   | ERIKOISTILANTEET | `specialTeams`    | B     |
| 3   | NEUVOTTELUTAITO  | `negotiation`     | B     |
| 4   | NEUVOKKUUS       | `resourcefulness` | **S** |
| 5   | KARISMA          | `charisma`        | **A** |
| 6   | ONNEKKUUS        | `luck`            | D     |

---

## Call-site inventory (every `mtaito(*, …)` use)

### `mtaito(1, …)` — strategy

| QB site                        | Effect                                                                                   | Port                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [ILEX5.BAS:7461](../ILEX5.BAS) | `tre += mtaito(1) * .007` — season-arc readiness bonus, only for non-Tasainen strategies | ✅ [season-start.ts](../../machines/parts/season-start.ts) |

**That's it.** A single one-shot tweak, max ±0.021 on a multiplier
that ranges ~0.7..1.3. <2% strength swing. Almost a stat dump.

### `mtaito(2, …)` — specialTeams

| QB site                             | Effect                                                                                                                                               | Port                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [ILEX5.BAS:325-336](../ILEX5.BAS)   | `yw/aw = (…) * (1 + mtaito(2)*.04)` for **AI teams only** (guarded by `IF ohj(xx) = 0`); coarse formula using team aggregates                        | ✅ [simulate-match.ts:209](../../services/mhm-2000/simulate-match.ts) |
| [ILEX5.BAS:8538-8539](../ILEX5.BAS) | Same multiplier applied **for the human's team only** at the end of `voimamaar`, which fully recomputes `yw/aw` from per-line tactical-chain weights | ❌ unported (`voimamaar` whole-SUB)                                   |

Clean ±12% on PP/PK weight every match. The two sites form a
**mutually-exclusive guarded split** (AI teams → site 1, human team →
site 2 via `voimamaar` called from `piirtox`); each team's `yw/aw`
receives the multiplier exactly once. The formulas differ in
_aggregation granularity_ — AI uses pre-summed team aggregates
(`hw/pw`); human walks each player on each PP/PK chain
(`pketju` / `hketju` / `ketju()`) — giving the human extra lineup
agency but **no asymmetric multiplier buff**.

### `mtaito(3, …)` — negotiation

| QB site                             | Effect                                                                                                                                                                         | Port                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| [ILEZ5.BAS:1960-1964](../ILEZ5.BAS) | `tasomuut` end-of-season jitter bands `30+8*skill` / `60+8*skill`                                                                                                              | ✅ [end-of-season.ts:480](../../machines/end-of-season.ts) |
| [ILEX5.BAS:6350](../ILEX5.BAS)      | `sopimus(2) = 85 - a*10 + mtaito(5,u(pv))*5` (note: indexed as 5 here, but call passes team id `u(pv)` not manager id — likely QB confusion; semantically negotiation context) | ❌ unported (no contract negotiation)                      |
| [ILEX5.BAS:6439](../ILEX5.BAS)      | `sin1 = mtaito(3, u(pv))*5 + 50 - …` — contract-renewal acceptance threshold                                                                                                   | ❌ unported                                                |
| [ILEX5.BAS:6528](../ILEX5.BAS)      | `sopimus(2) -= d + INT(mtaito(3, u(pv))*RND)` — contract length jitter                                                                                                         | ❌ unported                                                |

Mostly contract math, plus the season-end jitter. Compounds across
multiple seasons (1 tier per season at +3 vs −3 = 6-tier swing over
3 seasons).

### `mtaito(4, …)` — resourcefulness

| QB site                             | Effect                                                                                        | Port                                                          |
| ----------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [ILEX5.BAS:7708](../ILEX5.BAS)      | `mo(team) = mtaito(4, man(team))` — **initial team morale**                                   | ✅ [season-start.ts:57](../../machines/parts/season-start.ts) |
| [ILEX5.BAS:2791](../ILEX5.BAS)      | `kriisipalaveri` option 1 base: `a = 50 + mtaito(4)*10` (50% baseline → 80% at +3, 20% at −3) | ❌ unported                                                   |
| [ILEX5.BAS:2810,2813](../ILEX5.BAS) | option 2 thresholds: `≤ 20 - mtaito(4)*5` / `≥ 80 - mtaito(4)*5`                              | ❌ unported                                                   |
| [ILEX5.BAS:2848,2851](../ILEX5.BAS) | option 3 thresholds: `≤ 30 - mtaito(4)*10` / `≥ 70 - mtaito(4)*10`                            | ❌ unported                                                   |

The S-tier engine. Two compounding effects: (1) initial-morale buffer
keeps you out of the chairman's `mo <= -6` crisis trigger; (2) when a
crisis _does_ fire, every threshold is shifted in your favour. At +3
the worst option of the worst meeting flips to **best chance 100%, worst
chance 0%**. Anti-fragility incarnate. The +3 manager rarely sees a
crisis, and when he does, he wins it.

### `mtaito(5, …)` — charisma

| QB site                        | Effect                                                                                                                                 | Port                                                        |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [ILEX5.BAS:311](../ILEX5.BAS)  | Training-week round (`kiero=4`): `IF INT(101*RND) + mtaito(5)*10 > 50` triggers a free `harjotte` morale boost (~80% at +3, 20% at −3) | ❌ unported                                                 |
| [ILEX5.BAS:2062](../ILEX5.BAS) | Player-poaching roll: `b = INT(101*RND) - sed-diff + mtaito(5)*5`                                                                      | ❌ unported                                                 |
| [ILEX5.BAS:2537](../ILEX5.BAS) | `kausikorttimaar`: `d *= 1 + mtaito(5)*.02` — annual season-ticket revenue ±6%                                                         | ❌ unported                                                 |
| [ILEX5.BAS:5200](../ILEX5.BAS) | `IF d <= 50 + (mtaito(5,you) - mtaito(5,opponent))*5` — 11-member board vote, used for governance / leadership challenges              | ❌ unported                                                 |
| [ILEX5.BAS:5681](../ILEX5.BAS) | `tarko(_, 5, 15, 50)` event resolution                                                                                                 | (via [attribute-roll.ts](../../services/attribute-roll.ts)) |
| [ILEX5.BAS:5690](../ILEX5.BAS) | `tarko(_, 5, 15, 50)` event resolution (cash bonus)                                                                                    | ditto                                                       |
| [ILEX5.BAS:5715](../ILEX5.BAS) | `tarko(_, 5, 10, 50)`                                                                                                                  | ditto                                                       |
| [ILEX5.BAS:5722](../ILEX5.BAS) | `tarko(_, 5, 10, 100)`                                                                                                                 | ditto                                                       |
| [ILEX5.BAS:5741](../ILEX5.BAS) | `tarko(_, 5, 30, 0)`                                                                                                                   | ditto                                                       |
| [ILEX5.BAS:5777](../ILEX5.BAS) | `tarko(_, 5, 20, 100)` morale ±3                                                                                                       | ditto                                                       |
| [ILEX5.BAS:2238](../ILEX5.BAS) | `tarko(_, 5, 15, 50)`                                                                                                                  | ditto                                                       |

Most-used attribute in the codebase. Quietly powerful: free morale
boosts in training weeks, season-ticket revenue compounds across
seasons, board votes against equal opponents, and ~half the event
deck favours it.

### `mtaito(6, …)` — luck

| QB site                        | Effect                                                                                          | Port                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [ILEX5.BAS:5934](../ILEX5.BAS) | `neup.psk = 8*RND + 2 + mtaito(6)*RND` — bonus skill on certain new players (~0..3 extra at +3) | ❌ unported                                                 |
| [ILEX5.BAS:259](../ILEX5.BAS)  | `tarko(_, 6, 5, 30)`                                                                            | (via [attribute-roll.ts](../../services/attribute-roll.ts)) |
| [ILEX5.BAS:2250](../ILEX5.BAS) | `tarko(_, 6, 15, 50)`                                                                           | ditto                                                       |
| [ILEX5.BAS:3786](../ILEX5.BAS) | `tarko(_, 6, 10, 50)`                                                                           | ditto                                                       |
| [ILEX5.BAS:3793](../ILEX5.BAS) | `tarko(_, 6, 10, 50)`                                                                           | ditto                                                       |
| [ILEX5.BAS:5693](../ILEX5.BAS) | `tarko(_, 6, 15, 50)`                                                                           | ditto                                                       |
| [ILEX5.BAS:5700](../ILEX5.BAS) | `tarko(_, 6, 15, 50)`                                                                           | ditto                                                       |
| [ILEX5.BAS:5707](../ILEX5.BAS) | `tarko(_, 6, 15, 50)`                                                                           | ditto                                                       |
| [ILEX5.BAS:5733](../ILEX5.BAS) | `tarko(_, 6, 15, 100)`                                                                          | ditto                                                       |
| [ILEX5.BAS:5756](../ILEX5.BAS) | `tarko(_, 6, 15, 50)`                                                                           | ditto                                                       |
| [ILEX5.BAS:5758](../ILEX5.BAS) | `tarko(_, 6, 15, 50)`                                                                           | ditto                                                       |
| [ILEX5.BAS:5780](../ILEX5.BAS) | `tarko(_, 6, 20, 50)` cash                                                                      | ditto                                                       |

Almost all luck use is event-resolution `tarko` calls — D-tier in the
sense that you only feel it on the specific event days that test it,
and rarely with cascading consequences. **Per Pier Paolo Pasolini's
principle: leave it to chance.**

---

## TS port status — what's wired, what's missing

| Attribute       | Wired in TS                        | Pending                                                                                  |
| --------------- | ---------------------------------- | ---------------------------------------------------------------------------------------- |
| strategy        | season-arc bonus + drift           | —                                                                                        |
| specialTeams    | match PP/PK base mult (AI formula) | `voimamaar` per-line recompute for human team                                            |
| negotiation     | `runTasomuut` jitter               | contract negotiation flow                                                                |
| resourcefulness | initial morale                     | `kriisipalaveri` math (5 thresholds)                                                     |
| charisma        | —                                  | training-round morale boost, season-ticket revenue, board vote, poaching, training-event |
| luck            | (via `attribute-roll`)             | new-player skill bonus + many `tarko` events as they land                                |

Charisma is the most under-served attribute relative to its impact —
zero use sites in TS, biggest QB footprint after luck.

---

## Power tiers (player investment guide)

For a human spending the new-game budget at
[MHM2K.BAS:1480..1545](../MHM2K.BAS):

1. **resourcefulness** — buy to +3, no question. S-tier survival stat.
2. **charisma** — buy to +2 or +3. A-tier passive income.
3. **specialTeams** — buy to +1 or +2. Predictable ±12% on PP/PK each match.
4. **negotiation** — +1 if budget allows; matters more in long campaigns.
5. **strategy** — leave at 0. <2% strength bonus. Stat dump.
6. **luck** — dump to −3 to free points. You'll barely notice.

Per von Bachman's `(-3, -3, -3, +3, +3, +3)` is **the objectively
optimal CPU build**: maxes the two highest-tier stats (resourcefulness,
charisma), dumps the lowest-tier (strategy). The luck max is the one
mystery — possibly the QB designers thought luck mattered more than
the code makes it.

---

## CPU manager rankings

Score = `1·strategy + 3·specialTeams + 3·negotiation + 6·resourcefulness + 5·charisma + 1·luck`.
Weights derived from the tier analysis above.

### S-tier (score ≥ 13) — actually elite

| #   | Manager               | Score   | Notes                                                                                                                                                                                     |
| --- | --------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 33  | **Juri Simonov**      | **+45** | Runaway king. `(3, 2, 2, 3, 3, −3)` — three +3s in S/A/A and dumps the right stat. Hardcoded to always pick his own strategy ([ILEZ5.BAS:2030](../ILEZ5.BAS)). The lore matches the math. |
| 25  | **Kari P.A. Sietilä** | +31     | Loaded sheet `(3, 3, 0, 2, 2, −3)` — slightly inefficient (burns 6 points on C-tier strategy + B-tier specialTeams) but absolute totals carry him.                                        |
| 18  | **Per von Bachman**   | +15     | The optimal-build poster child `(−3, −3, −3, 3, 3, 3)`. Honoured in [user-memory note](../../../../) — should also have a `KAIKKI PELIIN` strategy bias one day.                          |
| 26  | Ara Hannuvirta        | +15     | Boring `(1, 1, 1, 1, 1, −3)` even-spread carries on the resourcefulness/charisma weighting.                                                                                               |
| 49  | Imsohel Kone          | +13     | `(−2, −2, 3, 3, −1, −1)` — negotiation/resourcefulness combo.                                                                                                                             |

### A-tier (7..12) — genuinely good

Juri Dorkaeff +11, Fjatseslav Vandals +10, Kannu Happanen +10, Curt
Lindman +8, Karl Gustaf Bormann +7, Franco M. Berg +7, Kai L.
Sinisalko +7

### B-tier (1..6) — competent middle

Scotty Booman +6, Pekka Rautakallo +6, Wurst Kaltheim +5, Eriko Nondo
+5, Tilhelm Well +5, Mint E. Pattikainen +4, Ptr Srszrscen +3, Blavio
Friatore +3, Sven Stenvall +3, Hari Järkäle +3, Limo Tahtinen +3,
Jannu Hortikka +2, Um-Bongo Rabban +2, Heinrich Heydrich +1, Xavier
Rated +1, Marty Saariganges +1, Carlos Numminen +1, Micho Magelä +1

### C-tier (−3..0) — mediocre / wash

Reijo Mustikka 0, Wech Lalesa 0, Pasolini 0 (proxy), Juri Simonov Jr.
0, Seter Ptastny −1, Kauno O. Pirr −1, Tasili Vihonov −1, Qimbo
Tondvist −1, Dave Queen −2, Tinjami Uhmanen −2, Clawsa Sykora −3, SuPo
Alhonen −3, Ronadlo −3

### D-tier (< −3) — actively bad

Nykan Hågren −4, Lennart Järvi −5, Werkka Easterlund −5, Aimo SA
Rummanen −6, Ari Keloranta −7, Tex Genderblender −8, Amok R.
Jekäläinen −9, Hannes De Ansas −10, Jukka Palmu −10, Fent Korsberg
−11, Bonatoli Agdanov −11, **Marcó Harcimo −16** (worst — 9 points
sunk into negotiation while dumping resourcefulness AND charisma).

### Notable patterns

- **Juri Simonov** dominates by 14 points. Possibly the QB designers
  knew exactly what they were doing here — or they liked him.
- **The "loaded" managers (Kari P.A. Sietilä, Jannu Hortikka,
  Tinjami Uhmanen)** look impressive on paper but bury points in the
  wrong stats.
- **The "balanced" managers (Ara Hannuvirta, Wurst Kaltheim, Sven
  Stenvall)** outperform their sheets because resourcefulness and
  charisma are weighted so heavily.
- **Ronadlo** (`0, 3, −3, −3, 3, 0`) — flashy charisma + specialTeams
  but dump-fired the wrong stats. Looks like a star, plays like a
  liability. (That… tracks.)
- **Marcó Harcimo** is mathematically the worst manager in the game.

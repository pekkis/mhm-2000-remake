# Sponsorship deals — full decode

> One-liner: every preseason you negotiate **once** with **three**
> randomly-rolled sponsor candidates. You can re-haggle each candidate
> repeatedly to bump their offer, but every haggle attempt risks
> insulting them and losing the candidate entirely. **Once two of the
> three have walked away, the third must be accepted as-is** — no
> further haggling. The chosen sponsor pays a **per-match fee** all
> season plus situational **bonuses on success / penalties on failure**
> (medals, playoffs, cup rounds, EHL, promotion, relegation).

References: `SUB sponsorit` ([ILEX5.BAS:6642–6898](../ILEX5.BAS)),
`SUB sporvagen` ([ILEX5.BAS:6900–6940](../ILEX5.BAS), read-only viewer),
`SUB annarahaa` ([ILEX5.BAS:597–612](../ILEX5.BAS) and
[ILEZ5.BAS:232–247](../ILEZ5.BAS), the payout dispatcher),
[DATA/SPONDATA.M2K](../DATA/SPONDATA.M2K) (93 sponsor names),
[DATA/Y.MHM](../DATA/Y.MHM) records 145..185 (the 20 payout-slot labels

- category goal labels + NEUVOTTELE / HYVÄKSY UI strings).

Persistence: `spona(pv)` and `sponso(1..20, pv)` are written by `SUB
savetus` to `savetus2.xxx` ([ILEX5.BAS:7277–7280](../ILEX5.BAS)) and
restored at [MHM2K.BAS:1289–1291](../MHM2K.BAS).

---

## 1. When the negotiation screen runs

Calendar-driven. The dispatcher in `gameday`'s preseason switch
([ILEX5.BAS:225–238](../ILEX5.BAS)) is:

```basic
SELECT CASE kiero3(kr)
CASE 10:  mmkisaalku
CASE 99:  sponsorit          ' <-- here
CASE 1:   valitsestrat : tremaar
CASE 4:   jaauniorit  : budget
CASE 5:   suunnitelma
END SELECT
```

`sponsorit` runs whenever the third KIERO.M2K column is **99**. In the
shipped calendar that's row 2 (i.e. preseason `kr = -8`):

```
KIERO.M2K rows 1..7 (kiero, kiero2, kiero3):
  99,1,4    ← jaauniorit + budget  (round kr=-9)
  99,1,99   ← sponsorit             (round kr=-8) ★ sponsor neg
  99,1,0    ← idle preseason rounds
  99,1,0
  99,1,0
  99,1,0
  4,1,0     ← regular season starts
```

So once per season, very early, before the regular season fires up.
There is no other entry point — the negotiation screen never reappears
mid-season. The `s` hotkey on the info menu opens the read-only
**`SUB sporvagen`** viewer (`ILEX5.BAS:416 → :6900`), not a re-negotiate.

---

## 2. Data structures

```basic
DIM spo(1 TO 3) AS STRING                    ' candidate names
DIM spr(1 TO 3, 1 TO 20) AS LONG             ' candidate offers, 20 payout slots
DIM sexx(1 TO 3, 1 TO 4) AS INTEGER          ' chosen goal level per category
DIM seks(1 TO 4) AS INTEGER                  ' max selectable goal level per category
DIM spn(1 TO 3) AS INTEGER                   ' negotiations done (0,1,2,…), -1 = walked
DIM sph(1 TO 3) AS INTEGER                   ' 1 = still acceptable, 0 = walked
DIM spp(1 TO 3, 1 TO 20) AS SINGLE           ' per-slot random multiplier (~0.9..1.0)
```

Persistent (per-manager, survive into the season):

```basic
spona(pv)             AS STRING   ' chosen sponsor name
sponso(1..20, pv)     AS LONG     ' the 20 payout-slot ledger
```

`sponso()` is **the season-wide payout ledger**: each of the 20 slots
holds the amount paid out in a specific situation. Slots get **paid
and zeroed** by `SUB annarahaa` when their trigger fires (with one
exception, slot 7, which is per-cup-round and never zeroed).

---

## 3. The 20 payout slots

Labels from `Y.MHM` records 146..165 (printed via `lay 145+arg` from
both `sponsorit` and `sporvagen`):

| #   | Label (FI)                             | Trigger ⇒ payout site                                                                                                                                                                                                                                                                                                                                                         | Sign | Notes     |
| --- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | --------- |
| 1   | MESTARUUS                              | finished 1st in PHL ⇒ `annarahaa sed(u(pv))` ([ILEZ5.BAS:466](../ILEZ5.BAS))                                                                                                                                                                                                                                                                                                  | +    |           |
| 2   | HOPEA                                  | finished 2nd in PHL ⇒ ditto                                                                                                                                                                                                                                                                                                                                                   | +    |           |
| 3   | PRONSSI                                | finished 3rd in PHL ⇒ ditto                                                                                                                                                                                                                                                                                                                                                   | +    |           |
| 4   | NELJÄS SIJA                            | finished 4th in PHL ⇒ `annarahaa 4` ([ILEZ5.BAS:470](../ILEZ5.BAS))                                                                                                                                                                                                                                                                                                           | +    |           |
| 5   | PÄÄSY PLAY-OFFEIHIN                    | qualified to PHL playoffs ⇒ `annarahaa 5` ([ILEX5.BAS:4694](../ILEX5.BAS))                                                                                                                                                                                                                                                                                                    | +    |           |
| 6   | CUPIN VOITTO                           | won the cup ⇒ `annarahaa 6` ([ILEX5.BAS:1206](../ILEX5.BAS))                                                                                                                                                                                                                                                                                                                  | +    |           |
| 7   | KIERROS/CUP                            | per-cup-round survival fee ⇒ `annarahaa 7` ([ILEX5.BAS:1244](../ILEX5.BAS)). **Special: NOT zeroed by `annarahaa` (`IF arg% <> 7`), so it pays again every cup round you survive.** Cleared in two places: on cup elimination ([ILEX5.BAS:1242](../ILEX5.BAS), `sponso(7, pv) = 0`) and on cup conclusion after the winner is crowned ([ILEX5.BAS:1205](../ILEX5.BAS), same). | +    | repeating |
| 8   | EUROOPAN MESTARUUS                     | won EHL final tournament ⇒ `annarahaa 8` ([ILEX5.BAS:1361](../ILEX5.BAS))                                                                                                                                                                                                                                                                                                     | +    |           |
| 9   | PÄÄSY EHL-LOPPUTURNAUKSEEN             | qualified to EHL final tournament ⇒ `annarahaa 9` ([ILEX5.BAS:1331](../ILEX5.BAS))                                                                                                                                                                                                                                                                                            | +    |           |
| 10  | SARJANOUSU                             | promoted (final tier < starting tier) ⇒ `annarahaa 10` ([ILEZ5.BAS:474](../ILEZ5.BAS))                                                                                                                                                                                                                                                                                        | +    |           |
| 11  | MITALITTA JÄÄMINEN                     | finished 4th or worse in PHL ⇒ `annarahaa 11` ([ILEZ5.BAS:471](../ILEZ5.BAS)) (also paid out as a one-shot when knocked out of playoffs at [ILEX5.BAS:4700](../ILEX5.BAS))                                                                                                                                                                                                    | −    | penalty   |
| 12  | SEMIFINAALEISTA KARSIUTUMINEN          | knocked out before the PHL semifinals ⇒ `annarahaa 12` ([ILEX5.BAS:4701](../ILEX5.BAS))                                                                                                                                                                                                                                                                                       | −    | penalty   |
| 13  | PLAY-OFFEISTA ULOS JÄÄMINEN            | failed to reach PHL playoffs ⇒ `annarahaa 13` ([ILEX5.BAS:4702](../ILEX5.BAS))                                                                                                                                                                                                                                                                                                | −    | penalty   |
| 14  | KARSINTAAN JOUTUMINEN                  | dropped to relegation playoff (mid-season tier shuffle, `tempsr ≠ sr`) ⇒ `annarahaa 14` ([ILEX5.BAS:4746](../ILEX5.BAS))                                                                                                                                                                                                                                                      | −    | penalty   |
| 15  | PUTOAMINEN                             | relegated (final tier > starting tier) ⇒ `annarahaa 15` ([ILEZ5.BAS:478](../ILEZ5.BAS))                                                                                                                                                                                                                                                                                       | −    | penalty   |
| 16  | PUTOAMINEN CUPISTA ENNEN SEMIFINAALEJA | knocked out of cup before the semifinals ⇒ `annarahaa 16` ([ILEX5.BAS:1249](../ILEX5.BAS))                                                                                                                                                                                                                                                                                    | −    | penalty   |
| 17  | PUTOAMINEN CUPISTA 1. KIERROKSELLA     | knocked out of cup in round 1 ⇒ `annarahaa 17` ([ILEX5.BAS:1251](../ILEX5.BAS))                                                                                                                                                                                                                                                                                               | −    | penalty   |
| 18  | EHL:N LOPPUTURNAUKSESTA KARSIUTUMINEN  | failed to qualify to EHL final tournament ⇒ `annarahaa 18` ([ILEX5.BAS:1335](../ILEX5.BAS))                                                                                                                                                                                                                                                                                   | −    | penalty   |
| 19  | EI SARJANOUSUA                         | promotion goal missed (final tier ≥ starting tier) ⇒ `annarahaa 19` ([ILEZ5.BAS:477](../ILEZ5.BAS))                                                                                                                                                                                                                                                                           | −    | penalty   |
| 20  | OTTELUMAKSU                            | **per-match base fee.** Added to the manager's round income inside the budget screen at [ILEX5.BAS:3534, :5340](../ILEX5.BAS). Never goes through `annarahaa`; never zeroed. Read every regular round.                                                                                                                                                                        | +    | repeating |

Slot 20 is the **headline number**. Everything else is shaped relative
to it. Slots 1..10 are positive bonuses, 11..19 are negative penalties,
slot 7 is the only repeating bonus, slot 20 is the only per-match fee.

The `sporvagen` viewer renders slots 1..10 in bright cash colours
(yellow/green) and 11..19 in dark/red — a UI hint that 1..10 are
"upside" and 11..19 are "downside", regardless of the actual numeric
sign at the moment of display. (If a slot is 0 it's hidden entirely —
i.e. only slots that have a non-zero stake from the negotiated deal
are shown.)

---

## 4. The 4 goal categories (the haggling axes)

The negotiation UI splits the 20 slots into **4 goal categories**.
Each category has a competition-appropriate "ambition ladder" the
manager can dial up or down independently per candidate.

```basic
IF sr(u(pv)) = 1 THEN seks(1) = 4 ELSE seks(1) = 0   ' PHL only top tier
IF sr(u(pv)) > 1 THEN seks(2) = 3 ELSE seks(2) = 0   ' DIV/MUT only lower tiers
seks(3) = 3                                          ' CUP always
IF muke(pv) = 1 THEN seks(4) = 3 ELSE seks(4) = 0    ' EHL only if qualified
```

| Cat | Header (UI)   | Available levels (label = `lay 169 + ...`)     | Levels                          | Eligibility                                  |
| --- | ------------- | ---------------------------------------------- | ------------------------------- | -------------------------------------------- |
| 1   | **PHL**       | 1 EI · 2 PLAY-OFFIT · 3 SEMIFINAALI · 4 MITALI | 1..4                            | only if team is in PHL (`sr=1`)              |
| 2   | **DIV & MUT** | A EI · B PLAY-OFFIT · C SARJANOUSU             | 1..3 (keys A/B/C, ASCII 65..67) | only if team is in a lower tier (`sr>1`)     |
| 3   | **CUP**       | D EI · E 2. KIERROS · F SEMIFINAALI            | 1..3 (keys D/E/F, ASCII 68..70) | always                                       |
| 4   | **EHL**       | G EI · H LOPPUTURNAUS · I EUROOPAN MESTARUUS   | 1..3 (keys G/H/I, ASCII 71..73) | only if team qualified to EHL (`muke(pv)=1`) |

`sexx(curso, 1..4)` defaults to 1 (= "EI", no goal, no payout, no
penalty). The manager presses the corresponding letter/digit to bump
the ambition. Higher ambition = bigger bonus on success **and** bigger
penalty on failure.

The category header and ladder labels live in `Y.MHM` records 170..182.

---

## 5. Base offer formula

```basic
sin1 = 49 - ((sed(u(pv)) + sedd(u(pv)) + seddd(u(pv))) / 3)
spr(curso, 20) = 20000 * (1 + sin1 * 0.07) * (vai(3, pv) / 100)
```

- `sed/sedd/seddd` = team's last three season-end PHL rankings
  (1 = champions, 48 = wooden spoon). Higher rank → lower number → larger
  `sin1` (1..48). Newly-created teams effectively start at rank ~24.
- `sin1 * 0.07` → multiplier between **1.07× (last-place team)** and
  **~4.36× (perennial champions)** on the 20 000 base.
- `vai(3, pv)` is the **difficulty-tier sponsor scale percent**:
  Nörttivatsa 200 / Maitovatsa 140 / 120 / 100 / Katarrivatsa 90
  (see [VARIABLES.md `vai()`](VARIABLES.md)).

So a champion team on Nörttivatsa pulls roughly **174 000 mk per match
× 44 rounds ≈ 7.66 M mk season**, base. A bottom-of-DIV team on
Katarrivatsa scrapes by on **~19 300 × 44 ≈ 850 k**.

The displayed `(YHT. N)` total in both `sponsorit` (line 6811) and
`sporvagen` (line 6932) is exactly `spr(curso, 20) * 44` — i.e. assumed
44 regular-season matches.

---

## 6. Goal-driven bonus / penalty formulas

For each candidate `curso`, after `spr(curso, 20)` is set, the chosen
ambition `sexx(curso, cat)` per category dials in the relevant slots.
All formulas are scaled relative to `spr(curso, 20)` (the per-match
fee).

### Category 1 — PHL ambition (`sexx(curso, 1)`)

| Level | Meaning     | Bonus slots (positive)                               | Penalty slots (negative)                                               |
| ----- | ----------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| 1     | EI          | (none)                                               | (none)                                                                 |
| 2     | PLAY-OFFIT  | `5 = 3·base`                                         | `13 = -1.2·5`, `14 = .3·13`, `15 = .4·13`                              |
| 3     | SEMIFINAALI | `1 = 5·base, 2 = 4.5·base, 3 = 4·base, 4 = 3.5·base` | `12 = -.8·1`, `13 = .3·12`, `14 = .2·12`, `15 = .1·12`                 |
| 4     | MITALI      | `1 = 8·base, 2 = 7·base, 3 = 6·base`                 | `11 = -1·1`, `12 = .2·11`, `13 = .18·11`, `14 = .16·11`, `15 = .14·11` |

### Category 2 — DIV/MUT ambition (`sexx(curso, 2)`)

| Level | Meaning    | Bonus slots                   | Penalty slots                                                           |
| ----- | ---------- | ----------------------------- | ----------------------------------------------------------------------- |
| 1     | EI         | (none)                        | (none)                                                                  |
| 2     | PLAY-OFFIT | `5 = 3·base`, `10 = 1.5·base` | `13 = -1.2·5`; if `sr=2` also `14 = .3·13, 15 = .4·13`                  |
| 3     | SARJANOUSU | `10 = 8·base`                 | `13 = -.1·10`, `19 = -.75·10`; if `sr=2` also `14 = .25·19, 15 = .5·19` |

### Category 3 — CUP ambition (`sexx(curso, 3)`)

| Level | Meaning     | Bonus slots                    | Penalty slots            |
| ----- | ----------- | ------------------------------ | ------------------------ |
| 1     | EI          | (none)                         | (none)                   |
| 2     | 2. KIERROS  | `7 = 1.25·base`                | `17 = -1.5·7`            |
| 3     | SEMIFINAALI | `6 = 2.5·base`, `7 = 1.5·base` | `16 = -6·7`, `17 = -2·7` |

### Category 4 — EHL ambition (`sexx(curso, 4)`)

| Level | Meaning            | Bonus slots    | Penalty slots |
| ----- | ------------------ | -------------- | ------------- |
| 1     | EI                 | (none)         | (none)        |
| 2     | LOPPUTURNAUS       | `9 = 3.5·base` | `18 = -.9·9`  |
| 3     | EUROOPAN MESTARUUS | `8 = 8·base`   | `18 = -.9·8`  |

### Per-slot random jitter

After all of the above are set:

```basic
FOR cupex = 1 TO 20: spr(curso, cupex) = spr(curso, cupex) * spp(curso, cupex)
```

with `spp(curso, slot) = .9 + .05·RND` (`+ .05` if `paikka(3, u(pv)) = 1`,
i.e. the team owns the top arena tier). The jitter is **always a
discount**: without the arena bonus, range is **0.90–0.95** (−5 % to
−10 %); with the arena bonus, **0.95–1.00** (0 % to −5 %). It
**never exceeds 1.0** — arena ownership lifts offers out of the
built-in discount, which is a subtle but meaningful reward. Locked at
the moment the candidate is rolled. (Note this means **two candidates
proposing the same ambition pattern won't propose identical numbers**;
the jitter provides enough difference to actually compare them.)

> **Sign convention.** Penalty formulas multiply by negative
> coefficients (e.g. `-1.2 * spr(curso, 5)`), so penalty slots end up
> stored as **negative LONGs**. `annarahaa` adds them to `raha(pv)`
> unconditionally — the sign does the work. The UI colours negative
> values red / positive green at every render.

---

## 7. Negotiation loop — the haggling rules

```basic
DO
  ' draw the screen, read me$
  ...

  IF spn(curso) = 0 THEN
    ' first time on this candidate: rebuild spr(curso, *) from sexx
    ...
  END IF

  ' --- input handling ---

  ' digit / letter keys change ambition for current candidate
  IF spn(curso) = 0 THEN
    IF ASC(me$) > 48 AND ASC(me$) < 53 THEN
      IF seks(1) >= ASC(me$) - 48 THEN sexx(curso, 1) = ASC(me$) - 48
    END IF
    FOR d = 2 TO 4
      IF ASC(me$) > (96 + (d - 2) * 3) AND ASC(me$) < (100 + (d - 2) * 3) THEN
        IF seks(d) >= ASC(me$) - (96 + (d - 2) * 3) THEN sexx(curso, d) = ASC(me$) - (96 + (d - 2) * 3)
      END IF
    NEXT d
  END IF

  IF me$ = CHR$(13) THEN     ' ENTER
    SELECT CASE kurso        ' kurso = 1 NEUVOTTELE, 2 HYVÄKSY
    CASE 1
      IF spn(curso) <> -1 AND temp% <> 2 THEN
        IF tarko(u(pv), 3, 5, 97 - spn(curso) * 5) = 0 THEN
          spn(curso) = -1 : sph(curso) = 0
          FOR qwe = 1 TO 20: spr(curso, qwe) = 0
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
      IF sph(curso) = 1 THEN EXIT DO
    END SELECT
  END IF
LOOP

' commit
spona(pv) = spo(curso)
FOR qwe = 1 TO 20: sponso(qwe, pv) = spr(curso, qwe)
```

### Allowed actions per state

- **First visit to candidate** (`spn(curso) = 0`): the manager can
  freely change the ambition on each of the 4 categories using the
  digit/letter keys. The `spr(curso, *)` slots are rebuilt from
  scratch every loop iteration based on the current `sexx`.
- **After the first NEUVOTTELE** (`spn > 0`): the ambition keys are
  locked. The candidate's offer is whatever it is. The only choices
  are NEUVOTTELE again or HYVÄKSY.
- **Switching candidates** (cursor between offers 1 / 2 / 3,
  `curso` 1..3): always allowed. Each candidate has independent
  state. Walked candidates (`sph = 0`) still appear but show empty
  offer; you can switch to them but can't NEUVOTTELE or HYVÄKSY.

### NEUVOTTELE roll — `tarko(u(pv), 3, 5, 97 - spn(curso) * 5)`

```basic
INT(100 * RND) + 1 < base + mtaito(3, manager) * 5
```

- Attribute: `mtaito(3)` = **NEUVOTTELUTAITO** (negotiation skill),
  range −3..+3. Each point = ±5 % success.
- Base threshold: `97 - spn * 5`. So the first NEUVOTTELE has base
  97 (almost guaranteed even for terrible negotiators), the second
  92, the third 87, the fourth 82, the fifth 77, etc. Each successful
  haggle makes the next harder.
- A neutral negotiator (mtaito(3) = 0) can typically push 4–5 rounds
  before risk gets serious. A +3 negotiator can grind further; a −3
  one is taking real risks already on the second haggle.
- **Failure** (`tarko = 0`): `spn = -1`, `sph = 0`, the candidate
  walks. All `spr(curso, *)` are zeroed.

### Bonus bump on success — `tarko(u(pv), 3, 0, 50)`

If the candidate stays:

- Loop over all 20 slots. For each slot whose value is **positive**
  (`spr > 0`), roll `tarko(u(pv), 3, 0, 50)` independently — flat
  50 % chance per slot, **no attribute bonus** (`t2 = 0`).
- On success, multiply that slot by `1 + (.015 + .01 * RND)` — i.e.
  +1.5 % to +2.5 %.
- This means each successful haggle nudges roughly **half of your
  positive numbers up by ~2 %**. The base per-match fee (slot 20)
  is also a positive slot, so it participates. Penalty slots
  (negative values) are **never bumped** — haggling can only ever
  improve your upside, never reduce your downside.
- Note the asymmetry vs. the NEUVOTTELE roll itself: NEUVOTTELE
  succeeds with `mtaito(3) * 5` bonus, but the bonus-bump step
  ignores `mtaito(3)`. Bad negotiators can still benefit from the
  bump in the rare event they survive a haggle.

### The "two-walked" lockout (the rule the user remembered)

Each iteration:

```basic
temp% = 0
FOR qwe = 1 TO 3
  IF sph(qwe) = 0 THEN temp% = temp% + 1
NEXT qwe
```

The NEUVOTTELE branch is gated on `temp% <> 2`. The matching UI
greys out the NEUVOTTELE button when `temp% = 2`. So:

- 0 walked: free haggling on any candidate.
- 1 walked: still free haggling on the remaining two.
- **2 walked: NEUVOTTELE is dead. The only legal action is HYVÄKSY
  on the surviving candidate.** This is the user's "you HAVE to
  agree on the third one" rule, exactly. Note that you don't even
  have to switch the cursor to the surviving candidate — once you
  HYVÄKSY any candidate with `sph = 1`, the loop exits.

### HYVÄKSY commit

```basic
IF sph(curso) = 1 THEN EXIT DO
spona(pv) = spo(curso)
FOR qwe = 1 TO 20: sponso(qwe, pv) = spr(curso, qwe)
```

The chosen candidate's offer becomes the manager's deal for the
season. The entire `sponso(1..20, pv)` ledger is set in one shot.

If all three candidates walk (improbable but possible — every
NEUVOTTELE failure is independent), the loop has **no exit** — the
only `EXIT DO` is gated on `sph(curso) = 1`, and all three are 0.
This is a **QB soft-lock bug**, not an intentional mechanic.
Practically near-impossible (you'd have to voluntarily haggle all
three and fail rolls starting at 97 %), but the TS port should
handle this gracefully — e.g. force-accept an empty deal and
continue.

---

## 8. Candidate roll

For each of the 3 candidates:

```basic
OPEN "data\spondata.m2k" FOR INPUT AS #1
FOR cupex = 1 TO INT(93 * RND) + 1
  INPUT #1, spo(qwe)
NEXT cupex
CLOSE #1
```

- Pure RNG draw of a **name** from the 93-line
  [SPONDATA.M2K](../DATA/SPONDATA.M2K). Cosmetic only — the name has
  **zero** gameplay effect. Any sponsor can offer any deal pattern.
- 93 names, no de-duplication — two candidates could in theory roll
  the same name. Cute, harmless.
- The list is the usual MHM brand-pun dump: "Bebsi", "GoGo-Cola",
  "Hitler&Mobutu H&M", "MacOkselds", "Pizza Cab", "Spudweiser",
  "Hjartwall", "S\u00f6ner\u00e4", etc. Preserve verbatim — the whole
  point is the dated-Finnish-90s tone.

---

## 9. The `sporvagen` viewer (read-only mid-season)

`s` from the main info menu. Renders the same layout as the
negotiation screen minus the haggling controls — current sponsor name,
the 20 slots that are non-zero, and the per-match fee × 44 total.
Suppressed when `kr < -8` (i.e. before sponsor negotiation has run).
Calls `krapulapiirto` overlay if the team is hungover. Already
documented in [SUBS.md `sporvagen` row](SUBS.md) and
[GLOSSARY.md `sporvagen` row](GLOSSARY.md).

---

## 10. Payout-trigger map (mirror of slot table, by trigger site)

| Trigger SUB / site                                                                 | What pays                                                                                                                                                                                                                                                                    | What zeros                                                             |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `cupohjelma` ([ILEX5.BAS:1241–1252](../ILEX5.BAS)) — between cup rounds            | **Surviving teams:** slot 7 paid (kept by `annarahaa`), slots 16/17 preemptively zeroed (penalty threat removed). **Eliminated teams:** slots 6/7 zeroed ([ILEX5.BAS:1242](../ILEX5.BAS)), slot 16 paid as penalty (after round 5), slot 17 paid as penalty (after round 2). | see left                                                               |
| `mestaruusjuhlat` / cup winner ([ILEX5.BAS:1206](../ILEX5.BAS))                    | slot 6 (cup win)                                                                                                                                                                                                                                                             | slot 7 cleared at season-cup boundary ([ILEX5.BAS:1205](../ILEX5.BAS)) |
| `ehllopturmaar` case 1 ([ILEX5.BAS:1329–1338](../ILEX5.BAS)) — EHL group stage end | slot 9 (qualified to lopputurnaus) **or** slot 18 (didn't qualify)                                                                                                                                                                                                           | slot 18 (if qualified); slots 8/9 (if eliminated)                      |
| `ehllopturmaar` case 2 ([ILEX5.BAS:1361–1363](../ILEX5.BAS)) — EHL champion        | slot 8 (Euroopan mestaruus)                                                                                                                                                                                                                                                  | slot 8 always cleared                                                  |
| `playoff` resolution ([ILEX5.BAS:4692–4708](../ILEX5.BAS)) — playoff qualification | slot 5 (qualified to PO) **or** slots 11+12+13 (failed)                                                                                                                                                                                                                      | slots 13/14/15 (if qualified); slots 1..5 (if eliminated)              |
| `playoff` round end ([ILEX5.BAS:4741–4755](../ILEX5.BAS)) — mid-PO tier shuffle    | slot 14 (`tempsr ≠ sr`, knocked into karsinta)                                                                                                                                                                                                                               | slot 12 (held tier); slots 1..4 (eliminated)                           |
| `final standings` ([ILEZ5.BAS:464–479](../ILEZ5.BAS)) — end of season              | slots 1/2/3 (medals via `sed=1..3`), 4 (4th), 11 (no medal), 10 (promoted), 19 (no promotion), 15 (relegated)                                                                                                                                                                | slot 11 if 4th; slot 19 if held tier                                   |
| `budget` per round ([ILEX5.BAS:3534, :5340](../ILEX5.BAS))                         | slot 20 (per-match fee, added straight into `rahna`)                                                                                                                                                                                                                         | never zeroed                                                           |

`SUB annarahaa` ([ILEX5.BAS:597, ILEZ5.BAS:232](../ILEX5.BAS))
unconditionally adds `sponso(arg, pv)` (signed) to `raha(pv)`, prints
the line, and zeroes the slot — except for slot 7 (cup per-round) which
is left in place so it can pay again. Penalty slots stored as negative
LONGs do exactly the right thing: addition becomes subtraction. The
pre-print colour test (`IF sponso(arg, pv) < 0 THEN COLOR 2 ELSE COLOR
14`) is the single visual difference between bonus and penalty.

---

## 11. Open / verify when porting

- **`paikka(3, u(pv)) = 1`** boost (`+0.05` to all `spp` jitters):
  inferred to mean "team owns the top arena tier", but `paikka(1..3)`
  is generally documented as arena seat capacities. Whether this is
  "has any luxury / VIP seats" or "arena fully built out" needs
  verification by walking the arena upgrade SUB (`AREENAT.BAS` /
  `ILES5.BAS:areena` / `:rakennuttaja`). See [VARIABLES.md `paikka()`](VARIABLES.md)
  TODO row.
- **44-game season assumption** baked into `(YHT. ...)` total displayed
  in both the negotiation and viewer screens. Real season is 44 PHL
  rounds; the multiplier ignores cup / EHL slot interactions, so the
  shown total is always optimistic.
- **No mid-season re-negotiation** ever. If the user remembers
  re-haggling mid-year that's likely a confused MHM 95/97 memory —
  MHM 2000 is one-shot. The only mid-season UI is `sporvagen`
  (viewer).
- **The walked-out empty-handed edge case** (all 3 candidates fail
  NEUVOTTELE in succession) is real. Should the TS port surface that
  more visibly — a "tappiollinen kausi alkaa" toast, an explicit
  `EmptySponsorDeal` snapshot? Open product question.
- **CPU manager behaviour:** `SUB sponsorit` is only ever called from
  the human-managed gameday switch (after `vu` loop ⇒ `vuoro(vu)`).
  Whether the CPU teams **also** get sponsor deals — or always run on
  some hardcoded baseline — needs grep-confirmation. There's no
  alternate "AI sponsor fill-in" SUB visible in the source. Look for
  any `sponso(*, ai_team_pv)` writes outside `SUB sponsorit`. (Likely
  answer: the QB code has a managed-only world here, and CPU teams
  silently get nothing — their finances run off `pelbudget` /
  arena receipts only. Confirm before porting AI economy.)

---

## 12. Port hooks (TS / XState mapping notes)

When this gets ported (Phase 3 territory, no work yet):

- **State.** Add to `GameContext.managers[id]` a `SponsorDeal | null`
  field. `SponsorDeal` mirrors the QB shape:

  ```ts
  type SponsorDeal = {
    sponsorName: string; // spona(pv)
    payouts: Record<SponsorPayoutSlot, number>; // sponso(1..20, pv), signed
  };
  ```

  Use a `SponsorPayoutSlot` string-literal union (`"phlChampion"`,
  `"phlSilver"`, …, `"perMatchFee"`) instead of carrying the QB 1..20
  indices forward. Snapshot stability matters; pick the names once.

- **Negotiation as wizard machine.** Spawn a child machine when the
  preseason calendar tick lands on the sponsorit step (analogous to
  how the EOS flow works). Per-manager parallel sub-states; humans
  get the UI, AI auto-resolves (open question above). Final action:
  commit `SponsorDeal` to context, then back to `gameMachine`.

- **Random discipline.** Every roll inside the negotiation machine —
  candidate name, base jitter `spp`, `tarko` rolls, bonus-bump
  rolls — is **interactive**, so the snapshotting rule for events
  doesn't apply directly. But: the candidate-roll seed (3 names + 3
  `spp` arrays) should be rolled **once on machine entry** and
  snapshotted, so save/load mid-negotiation doesn't reroll names.
  Each `tarko` roll happens at the moment the user presses ENTER —
  fine to roll inline.

- **Payout dispatcher.** Replace `SUB annarahaa` with a tiny pure
  function `applySponsorPayout(draft, managerId, slot)` invoked from
  the relevant phase actions (cup round end, EHL stage end, playoff
  resolution, end-of-season). It adds the signed amount to
  `manager.money`, emits a notification, and zeroes the slot
  (except `perCupRound`). Keeps the trigger sites declarative — same
  pattern as the existing event-effects interpreter.

- **`vai(3)` scale and difficulty.** Already documented in
  [VARIABLES.md `vai()`](VARIABLES.md) — make sure the new-game
  difficulty selector emits the right `sponsorScalePercent` value
  and that the negotiation machine reads it from there, not from a
  local copy.

- **44-match assumption.** When porting, decide whether to recompute
  the YHT. total from the actual remaining schedule rather than
  hardcode × 44 — minor UX upgrade, no behaviour cost.

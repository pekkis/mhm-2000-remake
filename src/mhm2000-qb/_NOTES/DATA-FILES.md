# MHM 2000 — DATA/ files

The `DATA/` folder is the runtime content. **All event/news text lives
here** — the .BAS code reads records on demand, SmartDrive caches them,
result: 640K-friendly streaming of ~750KB of Finnish prose without ever
loading it all.

## File extensions

| Ext                   | Format                                      | Notes                                                                              |
| --------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------- |
| `.MHM`                | **Random-access fixed-record text**         | 500-byte records, space-padded, cp850 encoding                                     |
| `.MHX`                | ❓ TODO — random-access numbered (1..17)    | Probably similar shape; looks like per-team rosters or per-league data             |
| `.MHZ`                | ❓ TODO (`LAKKO.MHZ`, `MONTY.MHZ`, `P.MHZ`) | Three files only; contract-strike + montx records?                                 |
| `.M2K`                | Plain ASCII tables                          | Numeric/data tables (teams, sponsors, prices, …)                                   |
| `.PLX`                | ❓ TODO (`ELT.PLX`, `JT1..JT10.PLX`)        | Likely playoff/jäynä tournament definitions                                        |
| `.ALA/.FOR/.NHL/.PLN` | Team rosters                                | `TEAMS.ALA`, `TEAMS.FOR`, `TEAMS.NHL`, `TEAMS.PLN` — international teams by group? |
| `D.BAT`               | DOS batch                                   | Setup script                                                                       |

---

## .MHM record format

- **Fixed 500 bytes per record**, space-padded.
- **Encoding: cp850** (DOS Western European; Finnish ä/ö/å render correctly).
- **No record terminator** — read with `OPEN … FOR RANDOM` + `RECORD = N`.
- **Inline format tokens** for color/style.
- **Inline `@N` placeholders** for runtime substitution.

Verified in Python:

```python
data = open('DATA/E.MHM','rb').read()
record = data[i*500:(i+1)*500].decode('cp850').rstrip()
```

### Format tokens (`$X`)

Inferred from context. Best-guess color mapping based on QB COLOR codes
that appear in the source. **Confirm against actual rendering.**

| Token | Best guess                   | Frequency in E.MHM | Notes                                                        |
| ----- | ---------------------------- | ------------------ | ------------------------------------------------------------ |
| `$b`  | body / reset to default      | 247                | Most common. Always returns to neutral.                      |
| `$j`  | name highlight (yellow?)     | 77                 | Wraps proper names: `$jHari Jalme$b`, `$jLentti Pindegren$b` |
| `$n`  | number / emphasis (red?)     | 54                 | Wraps numbers, key verbs: `$nnopeasti$b`, `$nkuollut$b`      |
| `$f`  | dramatic / money (red bold?) | 27                 | Wraps `@4 euroa`, warnings, severe news                      |
| `$o`  | single-letter highlight      | 33                 | Always one letter, then `$b`: `$oK$borkialahden`             |
| `$h`  | header style                 | 2 (in E.MHM)       | Common in `ST.MHM` for column headers                        |
| `$d`  | ❓ TODO                      | 1                  | Very rare                                                    |

❓ TODO: confirm exact COLOR numbers for each token from `colchk` /
`actionprint` / `lt` SUBs in ilex5.

### Substitution placeholders (`@N`)

| Token | Best guess      | Source                                                  |
| ----- | --------------- | ------------------------------------------------------- |
| `@0`  | reset attribute | Y.MHM labels end with `@0`                              |
| `@1`  | ❓ TODO         | E.MHM frequent (17 occurrences) — team name?            |
| `@3`  | ❓ TODO         | E.MHM rare                                              |
| `@4`  | money amount    | "@4 euroa", "@4 euron"                                  |
| `@5`  | numeric value   | "@5 voittoa putkeen", "NEUVOTTELUAIKAA: $n@5@0"         |
| `@6`  | manager name    | "@6$f, SPONSORINEUVOTTELUT" — your name + section title |

❓ TODO: enumerate `@N` for N=2,7,8,9 if used. Also: is there a
**second placeholder syntax `£N`**? Found `$j£2$b` in N.MHM. Could be
manager name _inside an already-colored span_ (so the substitution
mechanism preserves the surrounding color).

---

## File-by-file inventory

Sorted by inferred role, not name. Counts are **records** (file size /
500).

### Events / story-driven random text

| File           | Records | Role                                        | Sample (truncated)                       |
| -------------- | ------- | ------------------------------------------- | ---------------------------------------- |
| **E.MHM**      | 84      | random events (the big "sattuma" pool)      | "kaikki pelaajasi ovat kuolleet"         |
| **N.MHM**      | 88      | news / announcements (manager-scoped)       | "$j£2$b on lanseerannut … ABCD-ohjelman" |
| **I.MHM**      | 47      | injuries                                    | "Kiekko osui häntä kipeästi nivusiin"    |
| **PK.MHM**     | 19      | penalties / dirty play                      | "Aikamme Gladiaattori"                   |
| **M.MHM**      | 45      | family/personal events (death, inheritance) | "rakastettu mummonsa on kuollut"         |
| **P.MHM**      | 30      | player acquisition events                   | "Hari Jalme yrittää comebackia"          |
| **UH.MHM**     | 30      | threats from underground figures            | "PERA TÄSSÄ TERE…"                       |
| **V.MHM**      | 57      | event-resolution flavor                     | "Uskoitko? Ensimmäisellä kerralla…"      |
| **KONKKA.MHM** | 5       | bankruptcy stages (escalating)              | "palkat jääneet maksamatta 1 kerran" → 5 |
| **KO.MHM**     | 60      | post-match interview comments               | "Tuntuu todella hyvältä"                 |
| **TK.MHM**     | 36      | post-tournament comments                    | (similar to KO)                          |
| **KR.MHM**     | 35      | crisis-meeting outcomes                     | "Kapteenin puutteen ei voi…"             |
| **PTK.MHM**    | 5       | streak announcements                        | "@5 voittoa putkeen"                     |

### Choice-response pairs

| File          | Records | Role                                           |
| ------------- | ------- | ---------------------------------------------- |
| **KYLLA.MHM** | 30      | "yes" answer narrations (one per choice event) |
| **EI.MHM**    | 30      | "no" answer narrations (paired with KYLLA)     |

These are **parallel arrays** — same record index across both files
gives the yes/no flavor for one decision. ❓ TODO: confirm that record
N in P.MHM (offers) maps to record N in KYLLA/EI (responses).

### "Lentti Pindegren" studio commentary (the legendary anchor!)

| File       | Records | Role                                                     |
| ---------- | ------- | -------------------------------------------------------- |
| **S1.MHM** | 174     | Gala intros / running commentary (the largest text file) |
| **S2.MHM** | 72      | Mid-show segments                                        |
| **S3.MHM** | 66      | Mid-show segments                                        |
| **S4.MHM** | 84      | Mid-show segments                                        |
| **S5.MHM** | 6       | Mid-season interviews (`@6$b` = manager name)            |
| **GA.MHM** | 54      | Gala / pre-game analysis                                 |

❓ TODO: what's the difference between S1/S2/S3/S4? Phases of the
gala? Different speakers? Different shows?

### UI labels & section headers

| File        | Records | Role                                                      |
| ----------- | ------- | --------------------------------------------------------- |
| **X.MHM**   | 216     | difficulty descriptions (long help text per setting)      |
| **Y.MHM**   | 192     | UI strings (validation messages, prompts)                 |
| **Q.MHM**   | 39      | screen titles ("@6, KAUDEN KULKU" = "Pekka, SEASON FLOW") |
| **AL.MHM**  | 10      | new-game wizard labels                                    |
| **ST.MHM**  | 12      | stats column headers                                      |
| **STG.MHM** | 13      | settings labels                                           |

---

## .MHX files (1.MHX..17.MHX)

**Plain ASCII player-surname pools, one file per nation.** Each line is
a quoted surname (`"Aajanen"`). The file index is the nation id —
cross-reference against `KANSAT.M2K`.

Confirmed:

| File     | Lines | Nation                                                               |
| -------- | ----- | -------------------------------------------------------------------- |
| `1.MHX`  | 636   | Finland (`"Aajanen", "Aakala", "Aakenus", …`)                        |
| `2.MHX`  | 344   | Sweden (`"Andersson", "Backman", "Carlsson", "Loob", "Forsberg", …`) |
| `17.MHX` | 100   | Poland (`"Adamski", "Banasik", "Bednarz", …`)                        |

Used by player-generation SUBs (`junnumaar` etc.) to pick a random
surname matching the player's nationality. ❓ TODO: enumerate the full
1..17 nation mapping from `KANSAT.M2K`.

## .M2K files (plain ASCII data tables)

Just file names — reading them is trivial when needed.

| File                      | Best guess                                                                                                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AKTION.M2K                | event-action probabilities?                                                                                                                                                                          |
| ALKURSO.M2K               | initial cursor positions?                                                                                                                                                                            |
| ARENAS.M2K                | arena database                                                                                                                                                                                       |
| BORSSIX.M2K               | player-market seed list (börssi = player market, NOT stock market)                                                                                                                                   |
| BUDGET.M2K                | budget templates / starting allocations                                                                                                                                                              |
| DATAX.M2K                 | ❓                                                                                                                                                                                                   |
| FIXTURE.M2K               | match fixtures                                                                                                                                                                                       |
| INJURIES.M2K              | injury types/severity table                                                                                                                                                                          |
| JAYNAT.M2K                | prank definitions                                                                                                                                                                                    |
| JUNNUT.M2K                | junior names?                                                                                                                                                                                        |
| KANSAT.M2K                | nations table                                                                                                                                                                                        |
| KARSA.M2K                 | **lineup slot mask** → `dad(1..5, 1..6)` — 5 positions × 6 line configurations (1 = slot required, 0 = empty). File cols are positions in order [3,4,5,1,2]. Used by auto-line-assigner (`ketju()`). |
| KEISIT.M2K                | ❓ ("keisi" = ?)                                                                                                                                                                                     |
| KIERO.M2K                 | **calendar (`kierokset` = rounds)** — 99 rows × 3 cols (phase id, flag, param). MHM 2000's equivalent of MHM 97's 75-round calendar.                                                                 |
| MANAGERS.M2K              | manager identities                                                                                                                                                                                   |
| MATERIA.M2K, MATERIAX.M2K | "materia" arrays — ❓                                                                                                                                                                                |
| MUUDIT.M2K                | ❓ ("muut" = others?)                                                                                                                                                                                |
| MUUTOS.M2K                | "change" — modifier table?                                                                                                                                                                           |
| ORGA.M2K, ORGASM.M2K      | organization templates (orga + orga-summary?)                                                                                                                                                        |
| PANKI.M2K                 | bank parameters                                                                                                                                                                                      |
| PELKIEL.M2K               | ❓ ("pelaajan kieli" = player language? player fear?)                                                                                                                                                |
| PEPDEP.M2K                | playoff/depth table?                                                                                                                                                                                 |
| PLCUP.M2K                 | playoff cup data                                                                                                                                                                                     |
| POTTI.M2K                 | jackpot table                                                                                                                                                                                        |
| SPONDATA.M2K              | sponsor data                                                                                                                                                                                         |
| STVARI.M2K                | "stvari" — ❓                                                                                                                                                                                        |
| TAHDET.M2K                | stars (tähdet) — celebrity-team association?                                                                                                                                                         |
| TASOT.M2K                 | levels/tiers table                                                                                                                                                                                   |
| TKUTSU.M2K                | tournament invitations                                                                                                                                                                               |
| V_SUMMAT.M2K              | win amounts                                                                                                                                                                                          |

---

## TEAMS.\* roster files

`TEAMS.ALA`, `TEAMS.FOR`, `TEAMS.NHL`, `TEAMS.PLN`. Best guess:

- `ALA` = alasarja = lower league?
- `FOR` = foreign?
- `NHL` = NHL teams (importable rosters?)
- `PLN` = ❓ (`pelaa-N`? "PLN" = Polish?)

❓ TODO: confirm.

---

## .PLX files

`ELT.PLX`, `JT1..JT10.PLX`. The JT1-10 series strongly suggests
**10 invitation tournaments** (JT = `juhlaturnaus`?). `ELT.PLX` =
`elite`? Per-tournament data file.

❓ TODO: confirm.

---

## Why this matters for the port

1. **The text is the game.** ~750 KB of hand-written Finnish narrative
   for events, interviews, gala monologues. Modern equivalent: a TS
   module per category, but **we should preserve the original text
   verbatim** — that prose is the soul of MHM 2000.
2. **The format tokens map cleanly** to the same Markdown component
   pattern we already use for MHM 97 events. `$j…$b` → `<strong>…</strong>`
   or a styled span. `@N` → mustache-style substitutions (`{managerName}`).
3. **The yes/no parallel arrays** are exactly the same shape as the
   `interactive event` archetype we already have. The choice mechanism
   is built in.
4. **Lentti Pindegren must be ported with full reverence.**

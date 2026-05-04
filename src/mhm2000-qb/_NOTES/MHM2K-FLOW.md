# MHM2K.BAS — entry / menu / new-game wizard flow

> Decoded 2026-05-02. ~2700 lines, 45 SUBs. The program that runs
> before the game proper (`ilex5`). Owns: title splash, slot menu,
> load-game branch, **new-game wizard**, world generation, then
> `CHAIN "ilex5"`.
>
> Companion to the higher-level CHAIN graph in
> [README.md](README.md). This document drills into MHM2K.BAS only.

## Module-level entry sequence

```
1.  SCREEN 13
2.  kuvax("mfpres")              ─ preface splash (Forster Productions)
3.  kuvax("mhm2000")              ─ title splash
4.  pirtar1..7 DRM checksums      ─ ignored in port
5.  SCREEN 0; mass DIM            ─ pre-plkm globals (~150 arrays)
6.  load data/alkurso.m2k         ─ last-selected slot, persisted
7.  alcus:  slot menu             ─ 8 slots, T=clear, ENTER=pick, ESC=quit
8.  IF ident(lokero) = 0 THEN alku    ─ MUST set plkm before next line
9.  DIM ...(1 TO plkm) AS pelaaja…    ─ per-manager arrays now sized
10. avaa                          ─ load all static *.m2k data files
11. SELECT CASE ident(lokero)
       CASE 0   (new game)        ─ wizard + world-gen, see below
       CASE ELSE (load)            ─ lataus (read all save files)
12. ensintoinen = 1; ERASE scratch
13. CHAIN "ilex5"
```

The split of "DIM big stuff" between **before** and **after** the slot
menu exists because the per-manager arrays (`pel(1 TO 32, 1 TO plkm)`,
etc.) need `plkm` to size, and `plkm` is only known after step 7-8.
That's why `alku` is the **only** thing that can run between steps 7
and 9 — it must set `plkm`, nothing else.

## Slot menu (`alcus:` / `printident` / `tyhjennalokero`)

- **8 slots**, not 6. Files: `game_1/gameid.gam` .. `game_8/gameid.gam`.
- Each `gameid.gam` is plain CSV holding **just the menu metadata**:
  `ident` (1..4 = manager count, 0 = empty),
  `cauzi` (start year, e.g. 1998),
  then per-manager triples `(nimmi$, jokke$, tokke%)` =
  `(manager name, team name, league tier 1=PHL / 2=Div / 3=Muta)`.
  Lets the slot card render "Pasolini · Jokerit (PHL)" without
  loading the whole save.
- Horizontal cursor across all 8 slot cards.
  - **ENTER** on empty slot → `alku` (new-game wizard)
  - **ENTER** on filled slot → `lataus` (load)
  - **T** on filled slot → `tyhjennalokero` (K/E confirm, then
    `KILL game_N/*.*` and rewrite empty `gameid.gam`)
  - **ESC** → `exitus` (credits screen + SYSTEM)
  - **?** → `qelp 99` (help)
- Last-selected slot persisted in `data/alkurso.m2k` so cursor
  remembers across runs.

## `alku` — pre-plkm questions

Two things, both before per-manager arrays are sized:

1. **Manager count** `plkm ∈ {1, 2, 3, 4}` (horizontal selector).
2. **Pecking order** `nokka` (only if `plkm > 1`):
   - `1` = weakest first
   - `2` = strongest first
   - `3` = random (re-rolled at each season rollover via `vuoro()`)

   Labels read from `AL.MHM` records 2-4. `nokka` is then re-applied
   every season at the rollover init block in
   [ILEX5.BAS:7755-7773](../ILEX5.BAS).

If `plkm = 1`, `nokka = 1` is forced and the question is skipped.

## Per-manager wizard — `alku2` (`FOR pv = 1 TO plkm`)

The per-manager loop. Each manager goes through this sequence in order:

### 1. Name input

- 21-char buffer with positional cursor + backspace.
- Empty submission → defaults to `"Manageri N"`.
- Stored as `nimi(pv)` and `mana(54+pv).nam`.

### 2. `valitsekansallisuus` — nationality

- 22 nations from `KANSAT.M2K` in a 2-column grid (14 + 8).
- Stored as `mana(54+pv).nat`.

### 3. Previous experience (still inside `valitsekansallisuus`)

- Same SUB; second screen "MANAGERINA OLET…" with 3 options:
  - **`UUSI KASVO`** (rookie) — no history populated.
  - **`KOKENUT KONKARI`** — pre-fills 3 mid-career seasons of
    `otte()`/`vsaldo()` per league + `saav(3,5)` (one-bronze, two-fourths).
  - **`ELÄVÄ LEGENDA`** — pre-fills 15 seasons in PHL, EHL appearances
    in `otte(4,*)`, and a fat medal cabinet via `saav(1..5)`.
- Affects only stats; **not** difficulty.

### 4. `options` — difficulty (1..5)

- Vertical selector with `AL.MHM` rows 5..9 as labels (Nörttivatsa /
  Maitovatsa / Kahvivatsa / Haavavatsa / Katarrivatsa).
- Sets `vai(1, pv) = 1..5`.
- Derives the rest of the `vai(1..4, pv)` tuple:
  - `vai(2, pv)` — **budget tier** 1..3, indexes BUDGET.M2K's first
    dimension (`valbh(tier, category, choice)`). Mapping is
    1→1 / 2→2 / 3→2 / 4→2 / 5→3. NOT a bank tier — banks are
    difficulty-agnostic.
  - `vai(3, pv)` — **sponsor scale percent** (200/140/120/100/90).
    Multiplies `spr(curso, 20)` inside `SUB sponsorit`
    (`ILEX5.BAS:6702`); easy mode = fat sponsor offers, hard mode =
    starvation income. Not player salaries.
  - `vai(4, pv) = 4 + vai(1) * 2` — **post-match injury-roll percent**
    (6/8/10/12/14). Per-gameday roll at `ILEX5.BAS:5634-5640`: picks a
    random non-injured lineup player and applies a real injury from
    INJURIES.M2K (severity softened by the medical-budget slider
    `valb(4, pv)`). NOT the inter-manager prank system despite the
    in-source `jäynä` label — that's `jaynteh`/JAYNAT.M2K, separate.
- Then computes a strength score `sin1` from previous-experience
  scaffolding (weighted sums of `otte`/`vsaldo`/`saav`) and bins it into
  `a` — the **team-quality threshold** for the team selector. Combined
  with `vai(2)`, `a` controls which teams are pickable in the next step.
  Ported to [src/machines/new-game.ts](../../machines/new-game.ts)
  (`computeManagerStrength` + `sin1ToThreshold` + `isTeamSelectable`).
  See VARIABLES.md `sin1` row for the formula breakdown.

### 5. Team selection (still inside `options`, label `carlosmoya:`)

- 49-cell grid (48 teams + "OMA JOUKKUE").
- Teams with `(sed+sedd+seddd)/3 < a` **or** already owned
  (`ohj(team) ≠ 0`) render dim grey and can't be picked.
- Material label per team via `materia(materiax(tazo(team)))`.
- City + arena name + level + capacities shown for the highlighted team.
- `ENTER` on team → store `u(pv) = team`, `ohj(team) = pv`.
- `ENTER` on "OMA JOUKKUE" → `omajoukkue` (custom team flow):
  - pick a team to **displace** (same `a`/`ohj` gating)
  - team name (max 10 chars)
  - city (max 12 chars)
  - arena name via `annanimihallille` (max 26 chars,
    default "MHM 2000 Areena")

### 6. `maaritakarakter` — character points

- Distribute pool across 6 manager skills `mtnimi(1..6)`.
- Each skill `mtaito(skill, 54+pv)` ∈ `[-3..+3]`.
- Pool size = `(3 - vai(1, pv)) * 3` if difficulty < 3, else `0`.
  Mapping: rookie (1) = **6 pts**, casual (2) = **3 pts**,
  normal/hard/veteran (3/4/5) = **0 pts**.
- Each tick costs/refunds 1 point against the pool.
- ENTER only accepts when pool is exactly 0.

## Post-wizard world generation (new-game branch only)

Runs after the per-manager loop completes, **before** `CHAIN "ilex5"`:

| SUB               | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `oppnas2`         | Load `TEAMS.PLN` (48 managed teams + arena defs) and `MANAGERS.M2K` (54 manager personas, 6 skills each).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `sarjamaaralku`   | Bucket teams into `x(1..48)` by `sr()` league: PHL → 1..12, Div → 13..24, Muta → 25..48. Shuffle Muta. Bubble-sort Muta by recent ranking (`sed`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `uusipeli`        | Set `kausi = 1998`, `kr = kierrosmax`. Then run `muutmestarit` (load 5 NHL + 11 European foreign teams into `l(49..70)`), `historia` (write fake 1997-1999 history files for the stats viewer), `tasomaar` (derive `mw/pw/hw` from `tazo` with jitter; call `orgamaar` per team), `gene` per manager (generate 20-man + 4-junior roster shaped to team strength).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `topmaar`         | Assign `tox()` indices to non-managed teams; init epidemic state (`tauti`/`tkest`/`tautip`/`tautik`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `uusipeliman`     | Shuffle the 48 manager personas across non-managed teams; assign personas `49..54+plkm` to the human-managed teams.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `uusipelitop`     | Generate 5 random top players per non-managed team (names via `*.MHX` + `mahmax`); then overlay real-name stars from `TAHDET.M2K`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `valitsestrattie` | Auto-pick tactic per non-managed team (1=normal / 2=defensive / 3=offensive) via relative-strength bins.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `palkmaar` loop   | Per-player salary formula (potenssi-based, see `palkmaar` SUB).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| force-manager-33  | If team 14 has no human manager and persona 33 isn't already on team 14, force-swap him onto team 14. **Rigged season-1 promotion**: persona 33 = `Juri Simonov` (`MANAGERS.M2K:225`, nat=5 / Russia, +3/+2/+2/+3/+3/-3 — borderline broken stats; his name is also one of the season-strategy aliases, hinting at legend status). Team 14 = `Kärpät, Oulu` (`TEAMS.PLN:14`, the strongest Divisioona team, `tazo=14`). Real-life parallel: 1999–2000 Liiga, Kärpät pushed hard for PHL re-promotion (https://fi.wikipedia.org/wiki/J%C3%A4%C3%A4kiekon_SM-liigakausi_1999%E2%80%932000). MHM 2000 quietly hard-codes the Simonov-on-Kärpät pairing so the AI version usually does promote in season 1. The real-world expansion that voided relegation that season is **not** modelled — we live in the alternate reality where Kärpät earn it. |
| `vihat`           | **"Viharuutu"** — pick one team to hate. That team becomes `Blackheads` from `Hirvikoski`, gets garbage stats, "Loimaan Kunnan Urheilukeskus" arena, and is forcibly demoted to Mutasarja. The chaos lever. Optional ("EN HALUA VIHATA…" first item).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

## Surprises vs. typical mental model

- **8 slots, not 6.** A common mis-remembrance.
- **Pecking order** is part of setup, asked once before the
  per-manager loop. Re-applied every season.
- **Character points** (6 skills × ±3) are separate from difficulty,
  and only available at low difficulty (rookie/casual).
- **Custom team** is one option in the team-selection grid, not a
  separate sub-flow.
- **Hate selection** (`vihat`) is the **last** new-game step and pure
  mood. It's optional; first menu item is "EN HALUA VIHATA…".
- **Previous experience ≠ difficulty.** They're two different screens
  inside `valitsekansallisuus` and `options` respectively.
- The fake history files (`historia` SUB) write `1997.sta` / `1998.sta`
  / `1999.sta` so the stats viewer in `iles5` has _something_ to show
  on day 1 of a fresh game. Includes hardcoded "Jokerit 1997 / Feldkirch
  1998 / Dynamo 1999" champion-history entries.

## Save-game shape (`lataus` reads, `ilex5`'s save SUB writes)

The opaque save format, gathered here for reference (we'll use a single
opaque XState snapshot blob in the port). One-line summary per file:

| File           | Holds                                                                                                                                                                                                                                                                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gameid.gam`   | Slot-card metadata (manager + team names, year). Plain CSV.                                                                                                                                                                                                                                                                                         |
| `savetus1.xxx` | Global-ish scalars: `emestari`, `nousu/puto`, `kausi`, `kr`, `nokka`, `karki(1..7)`…                                                                                                                                                                                                                                                                |
| `savetus2.xxx` | Per-manager state: `nimi/raha/laina/u(pv)/lpl/lpj/spx/suosikki/otte/vsaldo/saav/maa/ketju/spona/sponso`.                                                                                                                                                                                                                                            |
| `savetus4.xxx` | Per-team season state: `l/kk/ohj/mw/pw/hw/tazo/leg/ppiste/taso/paikka` for all 86 teams; `seddd/sedd/sed/valm/tre/sr/x/s/p/gf/ga/win/dra/los/tox/tautip/tautik/haln/kausik/ylek/kotiot/mo/tkaus/tsaav/jaynax/erik/kunto` for the 48 base teams; EHL stats; per-manager `valb`; cup brackets `cup(1..64)`; EHL stats `elt(1..6)`; misc `eri(1..30)`. |
| `savetus5.xxx` | Player market (börssi). Copied to `borspel.tmp` on load.                                                                                                                                                                                                                                                                                            |
| `savetus6.xxx` | Top players + scout assignments + bet slips per manager.                                                                                                                                                                                                                                                                                            |
| `savetus7.xxx` | Manager personas (`mana`, `mtaito`), team-manager mapping `man(1..48)`, all-time records, point-record holders.                                                                                                                                                                                                                                     |
| `pelN.xxx`     | RANDOM-access roster file (`pelaaja` records, 1..lpl(N)) per manager N.                                                                                                                                                                                                                                                                             |
| `jelN.xxx`     | RANDOM-access junior file (`pelaaja` records, 1..lpj(N)) per manager N.                                                                                                                                                                                                                                                                             |
| `mmitali.xxx`  | World-championship medal table (3 medals × 17 nations).                                                                                                                                                                                                                                                                                             |
| `graf.xxx`     | Per-manager 44-round position-graph data for the standings view.                                                                                                                                                                                                                                                                                    |
| `hativati.xxx` | Mid-round resume snapshot for `kiero(kr) = 4` (cup day). Optional.                                                                                                                                                                                                                                                                                  |
| `1.sta..3.sta` | History tables for the stats viewer (champions, MVPs, promos/relegations). Plain CSV.                                                                                                                                                                                                                                                               |

## Modern (TS / XState) mapping cheat-sheet

For when we port this into [`appMachine`](../../machines/app.ts) + a new
`newGameMachine` wizard actor:

| QB                              | TS                                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------------------- |
| `alcus:` slot menu              | `appMachine.menu` (today only slot 1; expand to 8).                                            |
| `tyhjennalokero` K/E confirm    | `appMachine.menu` sub-state `confirmingClear`.                                                 |
| `data/alkurso.m2k` last-slot    | `localStorage["mhm2k:lastSlot"]`.                                                              |
| `alku` (count + nokka)          | `newGameMachine.setup.managerCount` → `peckingOrder`.                                          |
| `alku2` per-manager loop        | `newGameMachine.setup.managerLoop` (sequential compound).                                      |
| name / nationality / experience | leaf states inside `managerLoop`.                                                              |
| `options` difficulty + team     | leaf states; team gating via threshold + `ohj()` selector.                                     |
| `omajoukkue` custom team        | sub-flow: displace → name → city → arena.                                                      |
| `maaritakarakter`               | leaf state; pool size = `(3 - difficulty) * 3 \| 0`.                                           |
| `vihat` (hate)                  | final wizard step before `done`.                                                               |
| world-gen SUBs (uusipeli etc.)  | pure functions called from the wizard's `done.output` handler in `appMachine`.                 |
| `CHAIN "ilex5"`                 | `appMachine.starting → playing` transition that spawns `gameMachine` with the seeded context.  |
| `ensintoinen=0` bail            | not needed — there's no shared in-memory program; rehydration is via `getPersistedSnapshot()`. |

## Open questions / TODO

- `cauzi(slot)` — start-year metadata: hardcoded `1998` per `kausi = 1998`? Then why is it in the slot card? ❓ (multi-save year display?)
- Confirm `KANSAT.M2K` is exactly 22 rows (current code grids 14 + 8).

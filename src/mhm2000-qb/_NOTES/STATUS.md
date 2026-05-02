# Status — where the archaeology stands

> **For Jean-Claude / any agent picking this up.** Read this first, then
> [README.md](README.md) for the file map, then dive into whichever
> decoder doc is relevant.

## TL;DR

We're reverse-engineering MHM 2000's QuickBASIC 4.5 source (in
`src/mhm2000-qb/`) toward a TypeScript port. The runtime stack
(XState 5 + React 19 + vanilla-extract + immer) is **already proven** —
it's the inherited MHM 97 remake foundation. New game logic ports onto
it sub-by-sub.

## Sub-decode docs

- [MHM2K-FLOW.md](MHM2K-FLOW.md) — `MHM2K.BAS` end-to-end: title
  splash, 8-slot menu, new-game wizard (`alku` / `alku2`),
  world-generation pipeline (`oppnas2` → `vihat`), save-file layout,
  XState mapping cheat sheet. **Required reading before touching the
  new-game flow.**

## What we already know (verified)

### Architecture

- **3 CHAINed programs** share `COMMON SHARED` globals via `MHM2K.BI`:
  - `MHM2K.BAS` — entry / menu / new-game wizard
  - `ILEX5.BAS` — main loop, ~8967 lines, ~120 SUBs
  - `ILEZ5.BAS` — between-seasons (transfers, awards), ~30 SUBs
  - `ILES5.BAS` — utilities (stats viewer + arena renovate), ~16 SUBs
- `chainahdus` = return-tag (1 = stats, 2 = arena renovate).
- `ensintoinen = 0` = "we got here without going through mhm2k first" → bail to mhm2k.
- Modern equivalent: a single `gameMachine.context` with three top-level states sharing one shape.

### Source classification

- 35 `.BAS` files total in `src/mhm2000-qb/`:
  - **24 tokenized** (QB45 binary, magic `0xFC 00 01 00`) — editors and tooling. Don't decode unless we need to.
  - **11 plain ASCII** — the actual simulation. All readable.
  - **9 of those are empty stubs.**
- DRM: `pirtar1..7` are obfuscated checksums. **Will not port.**

### Data files (`src/mhm2000-qb/DATA/`)

Full inventory in [DATA-FILES.md](DATA-FILES.md). Highlights:

- **`.MHM`** = 500-byte fixed random-access records, **cp850** encoded,
  space-padded. **27 files, 1539 records, ~750 KB of Finnish prose.**
  - Inline format tokens: `$b` (body/reset), `$j` (name), `$n` (emphasis),
    `$f` (dramatic/money), `$o` (single-letter highlight), `$h` (header),
    rare `$d`. ❓ TODO confirm exact COLOR codes.
  - Inline placeholders: `@0..@6`. `@4` = money, `@5` = number, `@6` =
    manager name. Possibly a second `£N` syntax for substitutions inside
    a colored span (saw `$j£2$b` in `N.MHM`). ❓ TODO confirm.
  - **Yes/no choice events** use parallel `KYLLA.MHM` + `EI.MHM`
    (30 records each, same index → paired flavor text).
  - **Lentti Pindegren** lives in `S1..S5.MHM` + `GA.MHM` (456 records of
    studio commentary). Sacred. Port verbatim.
- **`.MHX`** = 17 files, one per nation. Plain ASCII quoted surnames.
  `1.MHX` = Finnish (636), `2.MHX` = Swedish (344), `17.MHX` = Polish (100).
  File index = nation id (cross-ref `KANSAT.M2K`).
- **`KIERO.M2K`** = the calendar. **99 rounds × 3 cols** (`phase_id, flag,
param`). MHM 2000 expanded MHM 97's 75-round calendar.
- **`KARSA.M2K`** = lineup slot mask → `dad(1..5, 1..6)` = 5 positions ×
  6 line configurations (1 = slot required). File cols ordered
  `[3, 4, 5, 1, 2]`. Used by auto-line-assigner.
- **börssi ≠ stock market.** It's the **player market** (free agents /
  transfers). `borzzi` TYPE = market entry. Runtime players also stored
  in a random-access file like a database. ❓ TODO find that filename
  (probably written next to save, not in `DATA/`).

### Naming patterns

- Suffix `*maar` = `määritä` (init/setup)
- Suffix `*lisa` = bonus/multiplier
- Prefix `e*` = EHL version of something
- Prefix `p*` = playoff version
- `cup`, `tur`, `mm` = cup/tournament/world-championship
- Variable hall of fame: `dad()`, `qwe`, `zz`, `cupex`, `haikka`,
  `chainahdus`, `ensintoinen`, `borzzi`, `tazzo`, `montx`. They mean
  what they mean. Don't rename in QB; we'll rename in the port.

## Open mysteries (TODO, in rough priority)

### High value — unblocks porting

1. **`sattuma` SUB** in `ILEX5.BAS:5527` — the main random-event roller.
   Decoding this maps E.MHM record indices to event triggers (which
   record fires under which condition).
2. **`ottpel` / `ottul` SUBs** — gameday simulation core. Untangling
   these gives us the match engine.
3. **Runtime player random-access DB filename** — created on new game.
4. **`borzzi` field meanings**: `na` (name, 13 chars, confirmed),
   `ma` ❓, `sy` ❓, `pi` ❓, `jo` ❓, `ka` ❓.

### Medium — fills out the data layer

5. **`KIERO.M2K` phase_id values** — the 99-row calendar. What does
   `99,1,4` vs `4,1,1` vs `47,0,2` mean? Need to find the `kierokset`
   reader and decode each phase id.
6. **`.PLX` files** (`ELT.PLX`, `JT1..JT10.PLX`) — likely 10 invitation
   tournaments + an "elite" definition. Need to peek.
7. **`.MHZ` files** (3: `LAKKO.MHZ`, `MONTY.MHZ`, `P.MHZ`) — strike +
   `montx` records?
8. **Remaining `.M2K` files** still ❓: `STVARI`, `PEPDEP`,
   `MUUDIT`, `MUUTOS`, `ORGASM`, `PELKIEL`,
   `TAHDET`. (Decoded so far: `KANSAT`, `MANAGERS`, `KEISIT`,
   `MATERIA`, `MATERIAX`, `TASOT`, `DATAX`, `KARSA`, `KIERO` outline.)
9. **`TEAMS.{ALA,FOR,NHL,PLN}`** — extension naming. Best guesses in
   [DATA-FILES.md](DATA-FILES.md).

### Lower priority — fill at leisure

10. User to fill `❓ TODO` markers across [VARIABLES.md](VARIABLES.md),
    [SUBS.md](SUBS.md), [GLOSSARY.md](GLOSSARY.md) as time permits.
    Either inline or just tell me in chat and I'll update.

## Recommended next session order

1. Decode `sattuma` → unlock event-system porting.
2. Decode `ottpel` → unlock gameday porting.
3. Build a TS `GameContext` shape that maps the QB globals (use
   [VARIABLES.md](VARIABLES.md) as the source of truth).
4. Port the simplest event first (`KONKKA.MHM` bankruptcy escalation
   has only 5 stages and is purely deterministic) as the
   port-pipeline shakedown.
5. From there, iterate: declarative event registry, prank registry,
   per-competition extension methods, calendar driver — all the
   patterns already exist in the inherited codebase.

## Vibe / collaboration notes

- User loves the Finnish-legacy spelunking. Conversational pace,
  liberal humor welcome.
- Pier Paolo Pasolini = preferred mock-data subject.
- Lentti Pindegren = the legendary in-game anchor, port with reverence.
- "VAPPU" = Finnish May Day = long weekend = more archaeology time.
- Don't auto-port without understanding. Decode-then-port.
- `pnpm` only. Never `npm` / `npx`.

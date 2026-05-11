# MHM 2000 — QuickBASIC source archaeology

Working notes for the eventual MHM 2000 remake. The QB source lives one
level up; everything in this `_NOTES/` folder is for our benefit while
we reverse-engineer it.

## File layout (relevant subset)

```
MHM2K.BI         — schema. ~150 COMMON SHARED globals + 7 TYPEs.
MHM2K.BAS        — entry / shell. Menus + new-game wizard + load/save.
                   CHAINs to ilex5 once a game is started.
ILEX5.BAS        — main play loop. 8967 lines. The dragon.
ILEZ5.BAS        — between-seasons (transfers, contracts, awards).
                   CHAINed from ilex5 at end of regular season.
ILES5.BAS        — utilities: stats viewer + arena renovations.
                   CHAINed in/out of ilex5 mid-game on demand.

DATA/, PICS/, HELP/, GAME_*/  — assets / save slots / docs.
*.BAS (others)   — editors and tooling. Tokenized binary, not opened.
```

## CHAIN graph

```
mhm2k  ──CHAIN──▶  ilex5
                     │  chainahdus=1, me$="2"   ──CHAIN──▶ iles5 (statistics)
                     │  chainahdus=2, me$="d"   ──CHAIN──▶ iles5 (arena renovate)
                     │                          ◀──CHAIN── iles5
                     │                          ──CHAIN──▶ ilez5 (end of season)
                     │                          ◀──CHAIN── ilez5
```

`CHAIN` swaps the program in memory but `COMMON SHARED` survives. Modern
equivalent: a single `gameMachine.context` and three top-level states
(`playing` / `endOfSeason` / `utilities`) that share the same context.

`chainahdus` is a tiny return-address register so iles5/ilez5 know what
to run on entry. `ensintoinen=0` is "we got here without going through
mhm2k first" → bail to mhm2k.

## What's in this folder

- **[STATUS.md](STATUS.md) — START HERE.** Current state, what's
  decoded, what's open, recommended next session order.
- [MHM2K-FLOW.md](MHM2K-FLOW.md) — full decode of `MHM2K.BAS`: title
  splash, slot menu, new-game wizard, world generation, save-file
  layout, modern XState mapping. Read before touching new-game code.
- [VARIABLES.md](VARIABLES.md) — decoder ring for `MHM2K.BI` globals,
  bucketed by domain. `❓ TODO` markers everywhere I'm guessing.
- [SUBS.md](SUBS.md) — every `SUB` / `FUNCTION` across mhm2k, ilex5,
  ilez5, iles5, with my best-guess one-liner. `❓ TODO` markers same.
- [GLOSSARY.md](GLOSSARY.md) — Finnish words & invented MHM jargon.
- [DATA-FILES.md](DATA-FILES.md) — the `DATA/` folder: .MHM (random-access
  500-byte text records), .M2K (ASCII tables), .MHX, .PLX, TEAMS.\*.
- [ATTRIBUTES.md](ATTRIBUTES.md) — every `mtaito(*, manager)` call
  site, port status per attribute, S..D power tiering, and the
  resulting CPU-manager rankings (Juri Simonov +45, Marcó Harcimo
  −16). Read before touching crisis / training / poaching / contract
  code.
- [SPONSORS.md](SPONSORS.md) — full decode of `SUB sponsorit` (preseason
  3-candidate negotiation, 4 goal categories, 20 payout slots, the
  "two walked → must accept the third" lockout, every payout trigger
  site). Read before touching anything that pays sponsor money.
- [ARENAS.md](ARENAS.md) — full arena system: per-team static state,
  per-manager build/renovate state machine (`uhatapa`), `SUB areena`
  - `SUB remppa` design wizard, `SUB rstages` construction loop,
    `SUB ylmaar` per-match attendance formulae by `kiero`, `SUB
kausikorttimaar` season-ticket drive, gate revenue and ancillary
    income, sponsor box bonus, team-strength capacity floor. Read
    before touching anything that touches `taso/ppiste/paikka`,
    attendance, season tickets, or gate revenue.

## How to use this

The TODO markers (`❓`) are for **you** to fill in. Either:

- Replace `❓ TODO: …` with the answer inline, or
- Just tell me in chat and I'll update the doc.

Once we've decoded enough of `VARIABLES.md` and `SUBS.md`, we can map
the QB globals onto a TS `GameContext` shape and start porting the
simulation logic sub-by-sub.

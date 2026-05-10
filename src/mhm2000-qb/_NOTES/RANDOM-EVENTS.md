# Random events — the `sattuma` archaeology

Decoded from `SUB sattuma` ([ILEX5.BAS:5527](../ILEX5.BAS)) and surrounding
infrastructure. This is the **main random-event engine** of MHM 2000:
the post-match per-manager hook that fires bankruptcy banners, drug
detection, TV bonuses, natural injuries, mood swings, bans, prank
resolution, and the famous big `dat%` story-event lottery.

> **Scope.** Just documenting findings. No TS code. The existing
> `new-events/` directory is all MHM 97 carry-over and will go away —
> none of it represents MHM 2000 yet. This doc is the source of truth
> for what we'll be building.

> **Already decoded elsewhere — do not re-port.**
>
> - **Injuries** — full 45-row catalogue in [src/data/injuries.ts](../../data/injuries.ts).
>   See `dap` CASE 1 below.
> - **Bans / pelikielto** — full 18-row table in [src/data/bans.ts](../../data/bans.ts).
>   See `dap` CASE 2 below.
> - **Performance modifiers (`plus`/`kest`) + 45 mood definitions** —
>   [src/data/performance-modifier.ts](../../data/performance-modifier.ts).
>   See `dap` CASE 3 below.
> - **Pranks (jäynä) — 7 entries** — `JAYNAT.M2K` decoded in
>   [DATA-FILES.md](DATA-FILES.md). Jaynax slot semantics + jaynacheck
>   resolver decoded in [SUBS.md `jaynacheck` row](SUBS.md). The 7
>   pranks are: 1 PROTESTI, 2 SOPUPELI, 3 SKANDAALIN JULKISTAMINEN,
>   4 PELAAJAN KOUKUTUS (vieroitus), 5 PELAAJAN HOITELU,
>   6 URHEILUJUOMAN TERÄSTÄMINEN (ripuli), 7 KYTTÄYSKEIKKA.
> - **Sopupeli (`erik(3)`) doping detection** — full analysis in
>   [DOPING.md](DOPING.md). Deep-dive on the `erik(3) * N`-per-round
>   probability table is at the top of `sattuma` (see Layer 2 below).
> - **`faarao` bankruptcy strike** — [SUBS.md](SUBS.md) +
>   [VARIABLES.md `ego` row](VARIABLES.md). Sentinel `inj = 3333`.
> - **`fbimiehet`** — abducts an `uglyAndWeird` (spe=3) player on a
>   per-round roll. Decoded in [SUBS.md](SUBS.md). Fires from the
>   gameday-prep loop (`ILEX5.BAS:278`), **NOT** from `sattuma`.
> - **`xavier`** consumables (CCCP-tabletti, ZOMBIPULVERI, `spx(1..4)`,
>   voodoo-ukko, tanssiryhmä) — see GLOSSARY.md `xavier` /
>   `zombipulveri` / `voodoo-ukko` / `tanssiryhmä` rows. The events
>   that grant these consumables live inside `sattuma`'s `dat%` table
>   below (cases 31–37).

---

## 0 · Big picture

`SUB sattuma` is called once per human manager, **after each match**,
in `SUB gameday` ([ILEX5.BAS:1486](../ILEX5.BAS)) — at lines `:1580`
(regular runkosarja, `kiero=1`), `:1640` (playoffs `42/44/46`),
`:1676` (EHL `kiero=2`), `:1741` (cup `kiero=3`). `harjotte`-mode
training (`kiero=4`) does **not** call `sattuma`; `kr=97` international
break, `kr=22` EHL final, `kr=99` preseason, etc. don't either.

Inside `sattuma` there are five concentric layers. Each one is
independently gated; multiple can fire on the same gameday.

```
sattuma
├── L1 KONKKA banner            (always if konkurssi(pv) > 0)
├── L2 sopupeli detection       (always if erik(3) > 0; per-round-type)
├── L3 TV bonus + Lentti        (only kiero=1, only if you're on TV)
├── L4 post-match dap rolls     (always)
│   ├── natural injury          (vai(4)% gate, 1..44 from I.MHM/INJURIES.M2K)
│   ├── mood event              (20% flat, 1..45 from M.MHM/MUUDIT.M2K)
│   ├── post-match ban          (5% flat, 1..16 from PK.MHM/PELKIEL.M2K)
│   └── jaynacheck 0            (resolves pending pranks; can fire injuries 17/18/44/45)
└── L5 dat% pool                (only kiero=1, INT(521*RND)+1, ~70 cases from E.MHM/V.MHM)
```

Layers 4 and 5 are where almost all the "story" events live. Layer 5
is the one most users remember: the giant SELECT CASE on a 1..521 roll
where only ~70 ids match anything — most rolls are silently no-ops.
That's intentional: the sparse table is how the QB gets a
**rare-event-feel** out of a uniform RNG.

---

## 1 · Layer 1 — Bankruptcy banner

```basic
IF konkurssi(pv) > 0 THEN
  IF konkurssi(pv) < 5 THEN lt "konkka", konkurssi(pv) ELSE lt "konkka", 5
END IF
```

Reads `KONKKA.MHM` record 1..5 (escalating "your salaries are unpaid
N times" copy). Pure presentation — the player-strike side-effect
fires **before** `sattuma` in `gameday` prep (`ILEX5.BAS:314 → faarao`).

| Effect kind   | Status                                                                         |
| ------------- | ------------------------------------------------------------------------------ |
| Show MHM text | Need declarative way to print a record from a known data file in event render. |

---

## 2 · Layer 2 — Sopupeli detection

```basic
IF erik(3, u(pv)) <> 0 THEN
  SELECT CASE kiero(kr)
  CASE 1: <10% per erik(3) tier, regular-season>
  CASE 2: <15% per erik(3) tier, EHL>
  CASE 3: <20% per erik(3) tier, cup>
  CASE 42, 44, 46: <22% per erik(3) tier, playoffs>
  END SELECT
END IF
```

If you've bought match-fixing (`erik(3) ∈ {1, 2}`), each match has a
per-round-type chance of getting **caught** that scales linearly with
the tier. Caught = morale −55, statlines wiped, fine. The exact
mechanics (per case) are documented in [DOPING.md](DOPING.md); the
relevant effect kinds are:

| Effect kind                   | Notes                                                                                                                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Money one-shot (large)        | `rahna = -1000000 / -500000 / -400000`, `rah` (rolled into `decrementBalance`)                                                                                                         |
| Morale −55                    | `mor u(pv), -55` — already covered by `decrementMorale`.                                                                                                                               |
| Reset season W/L/D/GF/GA/Pts  | All counters for current competition zeroed; loss column inflated to `ot`. **Not currently in EventEffect.**                                                                           |
| Reset player gls/ass          | All non-goalies on roster: `gls = 0, ass = 0`. **Not currently in EventEffect.**                                                                                                       |
| Forfeit/disqualify            | Cup: kicked out (`cup(xx) = vast(pv)`); EHL: dropped & replaced with light team `yy = 70 + pv`; playoffs: `pwin(opponent) = 3`. Round-type-specific. **Not currently in EventEffect.** |
| Top-scorer (`top()`) wipe     | Used by AI-team analogue in `uutisia` (`ILEX5.BAS:7790-7793`).                                                                                                                         |
| AI manager firing (`potk xx`) | Used by AI-team analogue in `uutisia`. **Not currently in EventEffect.**                                                                                                               |

There's also an interactive sub-branch `leggi` (cup punishment choice
1 = forfeit-this-match, 2 = forfeit-the-tie). MHM 2000 lets the
**player** pick the punishment when caught in a cup; that's a yes/no-
style interactive resolution from the engine's perspective.

---

## 3 · Layer 3 — TV bonus

```basic
IF kiero(kr) = 1 AND tv <> 0 THEN
  IF you're in this gameday's televised match THEN
    rahna = 20000: rah
    lax 49
    lentti 1, tuloste + 12
    komme 10 - tuloste
  END IF
END IF
```

If TV is on (`tv` is the round's televised pairing index) and your
team is one of the two on TV, you get +20 000 mk and a Lentti studio
soundbite from `S1.MHM` (one of three, branching on whether you won,
tied, or lost — `tuloste` is set in `report`).

| Effect kind             | Notes                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Money one-shot (small)  | Already covered by `incrementBalance`.                                                                            |
| Show prefix from X.MHM  | `lax 49` = "PHL on televisioinut tämän ottelun ja sinä saat osasi rahkeista:"                                     |
| Embed Lentti commentary | `S1.MHM` records 13..18 / 19..24 / 25..30 — Lentti's home, neutral, and away post-match musings about your match. |

---

## 4 · Layer 4 — `dap` rolls (the post-match trinity + prank resolver)

The block runs **every** `sattuma` invocation regardless of round type.

### 4a · Natural injury — `dap 1`

```basic
IF INT(101 * RND) < vai(4, pv) THEN
  al 1                       ' pick a healthy lineup player
  IF lukka = 0 THEN
    lukka = INT(44 * RND) + 1
    dap 1                    ' apply injury #lukka
  END IF
END IF
```

- Gate: `vai(4, pv)` = the difficulty-driven INJURY-PROBABILITY tier.
  Higher difficulty → more injuries.
- Selector: `SUB al 1` = a healthy player who is **in the lineup**
  (`inj = 0 AND ket > 0`). Up to 60 retries; sets `xx` to the chosen
  slot or `lukka = 1` (failure flag) if no valid candidate found.
- Roll: `1..44` (natural rolls never reach id 45 — that's POLIISI-
  enforcer-only).
- Apply: `dap 1` = duration from `loukka(lukka, valb(4, pv))`
  (HUOLTOTASO-gated). `-1` = season-ending. Renders `lax 115/116`
  prefix + I.MHM record `lukka` body.
- Result: `pel(xx, pv).inj = duration + 1` (sentinel range `1..999`).

### 4b · Mood event — `dap 3`

```basic
IF INT(101 * RND) < 20 THEN
  dap 3
END IF
```

- Gate: flat 20%.
- Inside `dap 3`: `muud = INT(45*RND)+1`, `al 2` (player whose
  `plus = 0 AND kest = 0` — no active modifier), guarded by
  `psk + amount > 0`. On hit: prefix `lax 120` (positive amount) or
  `lax 121` (negative), then M.MHM record `muud` body, then sets
  `pel(xx, pv).plus` and `kest`.
- Effect kind: temporary skill modifier. Already modeled as
  `PlayerEffect[]` per [src/data/performance-modifier.ts](../../data/performance-modifier.ts).

### 4c · Post-match ban — `dap 2`

```basic
IF INT(101 * RND) < 5 THEN
  al 1
  IF lukka = 0 THEN
    lukka = INT(16 * RND) + 1
    dap 2
  END IF
END IF
```

- Gate: flat 5%.
- Roll: `1..16`. Codes 17 (POLIISI) and 18 (aggressive captain) are
  reserved for the enforcer paths in `jaynacheck`.
- Apply: `dap 2` = duration from `pelki(lukka)`. Renders `lax 117`
  prefix + PK.MHM record `lukka` body.
- Result: `pel(xx, pv).inj = duration + 1000` (sentinel range
  `1001..1999`).

### 4d · `jaynacheck 0`

Resolves the prank queue (`jaynax(N, ...)`) for the current manager
post-match. See [SUBS.md `jaynacheck` row](SUBS.md) for the full
decode. Six side-channels:

| Slot        | Source                                     | Effect on resolve                                                               |
| ----------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| `jaynax(2)` | SOPUPELI prank set by `meanstuff`          | (resolution path TODO — currently flagged but not resolved here)                |
| `jaynax(3)` | SKANDAALI prank or mafia branch            | `mor ±10` based on charisma `tarko` roll. V.MHM:59-61 lines.                    |
| `jaynax(4)` | PELAAJAN KOUKUTUS prank                    | `vieroitus` GOSUB → `inj = INT(11*RND)+7 + 2000` (rehab sentinel `2001..2999`). |
| `jaynax(5)` | PELAAJAN HOITELU prank or POLIISI enforcer | Forces injury #44 (HOITELU on victim) or #45 (POLIISI on opponent).             |
| `jaynax(6)` | URHEILUJUOMAN TERÄSTÄMINEN (ripuli) prank  | Mass roster injury: every `inj=0` player gets `inj = 2` at 60% chance.          |
| `jaynax(7)` | KYTTÄYSKEIKKA prank                        | `mor -15` if you, `mor -55` for AI managers.                                    |

**Two new sentinel ranges** (beyond what's already in VARIABLES.md):

- `inj ∈ 2001..2999` = **rehab / vieroitus** sentinel set by `jaynacheck` GOSUB at
  `:2261-2262` (`pel(xx, pv).inj = gnome + 2000` where `gnome = INT(11*RND)+7`).
  VARIABLES.md `inj` row already lists this range as "Injury" — but
  semantically it's a separate state ("KOUKUTETTU" / drug rehab). The
  player-info screen renders these the same as injuries; the
  gameplay difference is only the prank-source attribution.
- `inj = 9001` / `9002` = national-team absence (already documented).

Also: `jaynacheck` blocks 1-2 in pre-match prep (different from the
`jaynacheck 0` here) handle the POLIISI enforcer sweep
(`spe = 666` triggers a 7-game ban via `lukka = 17, dap 2`) and the
2% aggressive-captain self-ban (`spe = 2 AND ket > 0` triggers
`lukka = 18, dap 2`).

---

## 5 · Layer 5 — The big `dat%` pool

```basic
IF kiero(kr) = 1 THEN
  dat% = INT(521 * RND) + 1
  SELECT CASE dat%
  …
  END SELECT
END IF
```

- **Only fires on regular-season `kiero = 1` rounds.** EHL / cup /
  playoff `sattuma` calls skip this entire block.
- Roll: 1..521 uniform.
- ~70 cases match anything; the other ~450 ids are silent no-ops.
  This is a deliberate design choice — the sparse hit-rate is the
  rarity dial.
- Cases pull intro text from **E.MHM** (via `lux N`) and resolution
  text from **V.MHM** (via `lex N`). `arvox K` reads from the
  `arvox/` folder (per-K random-line files: book titles, joke names,
  destinations, etc.).

### 5.1 · Case enumeration

Below is the complete decode of every active `dat%` case. Columns:

- **Case** — `dat%` ids (multiple ids in a row → same case body, just
  inflating the rarity).
- **Trigger** — predicate / gate that must hold for anything to happen
  (separate from the dat% match itself).
- **Effects** — what fires when the case is taken.
- **Archetype** — auto / interactive / pre-resolved (using
  AGENTS.md's three event archetypes).
- **MHM refs** — E.MHM (`lux`), V.MHM (`lex`), N.MHM (`luz`),
  Y.MHM (`lay`), X.MHM (`lax`), `arvox` files.

Where I cite "see X" the underlying mechanic is fully decoded in
that other note; only the dat% binding is logged here.

| Case(s)            | Trigger                                                                | Effects                                                                                                                                                                                                                                                                                                                                 | Archetype    | MHM refs                          |
| ------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------- |
| 1, 2               | none                                                                   | Pure flavor: print E.MHM:1, then later V.MHM:1 over the same line. Looks like a "tease then reveal" gag.                                                                                                                                                                                                                                | pre-resolved | E:1, V:1                          |
| 3, 4, 5            | `tarko(team, charisma=6, w=15, b=50) = 1`                              | `mor +2`, render E.MHM:2 (positive flavor only on success — silent on fail).                                                                                                                                                                                                                                                            | pre-resolved | E:2                               |
| 6, 7               | none                                                                   | Yes/no prompt (E.MHM:3): take 5000 mk? "k" → V.MHM:2 (declined? wait let me reread); "e" → `+5000` + V.MHM:3.                                                                                                                                                                                                                           | interactive  | E:3, V:2/3                        |
| 8, 9, 10           | `tarko(team, charisma=5, w=15, b=50) = 1`                              | `+35000` mk and E.MHM:4. Silent on fail.                                                                                                                                                                                                                                                                                                | pre-resolved | E:4                               |
| 11–16              | none                                                                   | Charisma `tarko` flips outcome: hit = `+50000` + E.MHM:6; miss = `-50000` + E.MHM:5.                                                                                                                                                                                                                                                    | pre-resolved | E:5/6                             |
| 17–22              | none                                                                   | Charisma `tarko` flips: hit = `+20000` + E.MHM:7; miss = `-20000` + E.MHM:8.                                                                                                                                                                                                                                                            | pre-resolved | E:7/8                             |
| 25                 | `raha > 500000 AND tarko(charisma) = 0`                                | `raha -= raha * .1` (10% percentage hit), E.MHM:9. **Percentage-of-balance is a NEW effect kind.**                                                                                                                                                                                                                                      | pre-resolved | E:9                               |
| 26–28              | none                                                                   | `+10000`, E.MHM:10, then `tarko(strategy=5, w=10, b=50)` decides: hit = E.MHM:70 epilogue; miss = E.MHM:71.                                                                                                                                                                                                                             | pre-resolved | E:10/70/71                        |
| 29, 30             | `tautip(team) = 1`                                                     | Set `tautik = 2`, `tautip = .8` (illness state). Pick a player via `al 0`. If `tarko(strategy=5, w=10, b=100) = 1`: yes/no E.MHM:11 — accept = `krapu(pv) = 2 (visible hangover w/ pikku-ukot)` + `mor +3` + V.MHM:4; decline = `krapu(pv) = 1` + V.MHM:5. Else `krapu(pv) = 1` + E.MHM:72.                                             | interactive  | E:11/72, V:4/5                    |
| 31, 32             | `tarko(charisma=6, w=15, b=100) = 1`                                   | E.MHM:12 yes/no for CCCP-tabletti at `-39999`. Accept: `spx(1, pv) += 1`, V.MHM:6. Bonus: extra `tarko(strategy=5, w=30, b=0)` doubles to a second tabletti + E.MHM:73. Decline: V.MHM:7.                                                                                                                                               | interactive  | E:12/73, V:6/7                    |
| 33, 34             | none                                                                   | `arpo 1` picks a random AI manager into `xx`. Sets `jaynax(7, u(pv)) = xx` — schedules a KYTTÄYSKEIKKA prank against you, resolved by `jaynacheck` block 5. Silent at fire time.                                                                                                                                                        | pre-resolved | (silent, jaynacheck speaks later) |
| 35                 | none                                                                   | E.MHM:14 yes/no, `rahna = 100000 * (4 - sr(team))` (tier-scaled). Accept: charisma `tarko` chooses `+rahna` + V.MHM:8 vs `-rahna` + V.MHM:9. Decline: charisma `tarko` chooses V.MHM:10/11.                                                                                                                                             | interactive  | E:14, V:8/9/10/11                 |
| 36                 | none                                                                   | E.MHM:15 yes/no for VOODOO-UKKO at `-10000`. Accept: `spx(3, pv) = 1` + V.MHM:12. Decline: V.MHM:13. (See `voodoo-ukko` glossary row for the spx(3) effect side.)                                                                                                                                                                       | interactive  | E:15, V:12/13                     |
| 37                 | none                                                                   | E.MHM:16 yes/no for TANSSIRYHMÄ at `-10000`. Accept: `spx(4, pv) = 1` + V.MHM:14. Decline: V.MHM:15. (See `tanssiryhmä`.)                                                                                                                                                                                                               | interactive  | E:16, V:14/15                     |
| 38–40              | none                                                                   | `+15000` + E.MHM:17. `tarko(charisma=5, w=20, b=100)` decides: hit = `mor +3` + E.MHM:74; miss = `mor -3` + E.MHM:75.                                                                                                                                                                                                                   | pre-resolved | E:17/74/75                        |
| 41                 | `tarko(charisma=6, w=20, b=50) = 1`                                    | `+ rand(0, 99999)` mk lottery win, E.MHM:18.                                                                                                                                                                                                                                                                                            | pre-resolved | E:18                              |
| 42                 | none                                                                   | `jaynacheck 1` — forces the **ripuli GOSUB** path: 60% per-player `inj = 2` mass food poisoning. **No own predicate** — fires unconditionally if `dat% = 42` rolls.                                                                                                                                                                     | pre-resolved | (E.MHM:19 + E.MHM:76/77)          |
| 43, 44, 45         | none                                                                   | `arpo 1` picks AI opponent. E.MHM:20 yes/no — accept = `verk% = xx` (queues something for the betting screen — `verk` is a "vihjeessä" signal flag). Otherwise silent. **`verk%` mechanic is opaque**, ❓ TODO.                                                                                                                         | interactive  | E:20                              |
| 46, 47             | none                                                                   | `rahna = 125000`, E.MHM:21 yes/no. "e" = decline + `arpo 1` + V.MHM:47. "k" = `+125000` + negotiation `tarko` flips `mor ±4` + E.MHM:78/79.                                                                                                                                                                                             | interactive  | E:21/78/79, V:47                  |
| 48, 49             | none                                                                   | `rahna = 100000`, E.MHM:22 yes/no. "e" = V.MHM:16 (decline). "k" = negotiation `tarko` flips: hit = `+100k` + V.MHM:18; miss = `raha = -raha: rah` (!! negates the balance THEN adds rahna=100k — so a manager with 2M ends up at −2M + 100k = −1.9M. **Looks like a QB bug, preserve verbatim.**) + V.MHM:17.                          | interactive  | E:22, V:16/17/18                  |
| 50, 51             | `tautip(team) = 1`                                                     | Multi-step illness diagnosis. E.MHM:23, then `komme 12` (general comment), then a 3-or-8-day cursor pick: `tautip = .9`, `tautik = pick + 1`, prints E.MHM:76+pick. **Cursor mid-event is unusual** — looks like a real interactive choice baked in. ❓ TODO confirm UI shape.                                                          | interactive  | E:23/77/78                        |
| 52                 | none                                                                   | `arpo 1` picks AI opponent into `xx`. Picks a random **Pekkalandian surname** via `mahmax` (so `nats=1` forced). Prints `krj$.ptemp$` in green + E.MHM:24. `tarko(strategy=5, w=15, b=100)`: miss = `mor -55` + E.MHM:83 (catastrophe); hit = E.MHM:82. Yes/no follow-up: "k" = `lentti 3, 11` (S3.MHM commentary).                     | interactive  | E:24/82/83, S3.MHM                |
| 53, 54, 55         | `kiero(kr)=1 AND ohj(vast(pv)) = 0`                                    | E.MHM:25, then `pjn`, then **invokes `protesti` directly** — instant in-place protest spawn with `xx = vast(pv)` (your post-match opponent), `xxx = u(pv)` (you).                                                                                                                                                                       | spawn-event  | E:25                              |
| 56–58              | none                                                                   | E.MHM:26 yes/no. "e" = V.MHM:48. "k" = strategy `tarko` flips: hit = `mor +4` + V.MHM:19; miss = V.MHM:20 + charisma `tarko` flips again: hit = V.MHM:49; miss = `mor -4` + V.MHM:50.                                                                                                                                                   | interactive  | E:26, V:19/20/48/49/50            |
| 59                 | `tarko(charisma=6, w=15, b=50) = 1`                                    | `potti(pv) += rand(300000, 399999)` (**arena building fund** windfall — the team's earmarked stadium-construction kitty, NOT the league prize pool — see §7.1), E.MHM:27.                                                                                                                                                               | pre-resolved | E:27                              |
| 60–62              | none                                                                   | E.MHM:28 + `arvox 3` = print a random line from `arvox/3.a2k`. Pure flavor (a quote / book title / joke).                                                                                                                                                                                                                               | pre-resolved | E:28, arvox/3                     |
| 63                 | `erik(2, team) <> 0`                                                   | E.MHM:69 yes/no (medical-services-only event). "k" = V.MHM:45; "e" = V.MHM:46. Mechanical effect TBD — looks like flavor only. ❓ TODO confirm.                                                                                                                                                                                         | interactive  | E:69, V:45/46                     |
| 64, 65             | `al 8 = 0` (player ego ≥ 17 in lineup)                                 | `mor -7`, E.MHM:30. The high-ego player throws a tantrum.                                                                                                                                                                                                                                                                               | pre-resolved | E:30                              |
| 66, 67             | `al 0 = 0` (any player)                                                | E.MHM:31 + `tarko(charisma=5, w=20, b=100)` flips: hit = V.MHM:51; miss = `mor -8` + V.MHM:52.                                                                                                                                                                                                                                          | pre-resolved | E:31, V:51/52                     |
| 68, 69             | `al 9 = 0` (high-skill non-modified player)                            | E.MHM:32 yes/no — re-sign request. "k" = `pel(xx).sra *= 1.1` (10% raise) + `plus = 1, kest = 1000` (effectively-perma small buff) + V.MHM:21. "e" = `plus = -2, kest = 1000` (perma small debuff) + V.MHM:22. (Decoded in performance-modifier.ts.)                                                                                    | interactive  | E:32, V:21/22                     |
| 70, 71             | `kuume = 0 AND sr=PHL AND tarko(6,10,50) AND tarko(5,10,50)`           | E.MHM:33 (tier-1 PHL) or E.MHM:34. `kuume(pv) = 1` (fever flag).                                                                                                                                                                                                                                                                        | pre-resolved | E:33/34                           |
| 72–74              | `sopuhu(pv) <= 10 AND sovtap(pv) = 0`                                  | `rahna = 100000 * (4 - sr)` tier-scaled. E.MHM:35 yes/no — Russian mob match-fix offer. "k" = accept money + `sovtap(pv) = 1` (forced loss queued) + V.MHM:23. "e" = decline + V.MHM:24.                                                                                                                                                | interactive  | E:35, V:23/24                     |
| 77–79              | none                                                                   | `tarko(strategy=5, w=10, b=50)` flips: hit = E.MHM:37 + `mor +3`; miss = E.MHM:38 + `mor -5`.                                                                                                                                                                                                                                           | pre-resolved | E:37/38                           |
| 81, 82, 182        | `kiero2(kr)=1 AND lpl < 32 AND sex 1 = 0`                              | A scout has identified a free agent (`sex 1` finds an active scouted country). E.MHM:39 yes/no. "e" = V.MHM:25. "k" = V.MHM:26 + **synthesise a new player**: `lpl += 1`, `nats = xx` (the scouted country), `rela`, `psk = 8*RND + 2 + mtaito(luck)*RND` clamped to ≥1, `svu = 1`, `palkmaar`, `sra = .75 * rahna`. Slots into roster. | interactive  | E:39, V:25/26                     |
| 83, 84             | none                                                                   | E.MHM:40 yes/no. "e" = `arvox 5` random text reveal. "k" = negotiation `tarko` flips V.MHM:27/28.                                                                                                                                                                                                                                       | interactive  | E:40, arvox/5, V:27/28            |
| 85, 86             | none                                                                   | `arpo 1` random AI opponent. E.MHM:41 yes/no — "k" = `arvox 5` text reveal. (Pure flavor — looks like the "tabloid leaks something about a rival" trope.)                                                                                                                                                                               | interactive  | E:41, arvox/5                     |
| 87                 | `tarko(charisma=5, w=25, b=0) = 1`                                     | `arvox 1` (book author name) + arvox 2 (book title), printed in colored span. Pure flavor (invented book about your life).                                                                                                                                                                                                              | pre-resolved | arvox/1, arvox/2                  |
| 88, 89             | `sex 0 = 0 AND tarko(charisma=6, w=10, b=50) = 1`                      | E.MHM:43 yes/no — "k" = `skout(xx, pv) = 1` (auto-hire scout in country `xx`) + V.MHM:30. "e" = V.MHM:31.                                                                                                                                                                                                                               | interactive  | E:43, V:30/31                     |
| 90, 91             | `kiero2(kr) = 1`                                                       | E.MHM:44 yes/no, V.MHM:32 (always — looks like flavor-only).                                                                                                                                                                                                                                                                            | interactive  | E:44, V:32                        |
| 92                 | none                                                                   | `jaynacheck 2` — forces the **skandalpl GOSUB** path: charisma-`tarko`-flipped `mor ±10` from E.MHM:59-61.                                                                                                                                                                                                                              | pre-resolved | (E:59-61)                         |
| 93, 155            | `kiero2(kr)=1 AND tarko(charisma=6, w=10, b=50) = 1`                   | `fat% = INT(17*RND) + 1`, `erikoisp fat%` — invokes a random **special action** (the "free agent on the bench" pipeline), drawing from `MONTY.MHZ` (count + offset table) + `P.MHZ` (player records).                                                                                                                                   | interactive  | (P.MHM via erikoisp)              |
| 94–99              | none                                                                   | `arpo 1`. `tarko(charisma=5, w=15, b=50)` flips: hit = `mor +1` + E.MHM:47; miss = `mor -1` + E.MHM:46.                                                                                                                                                                                                                                 | pre-resolved | E:46/47                           |
| 100                | `al 1 = 0 AND tarko(charisma=6, w=20, b=50) = 0`                       | `rahna = -90000`, `gnome = INT(8*RND) + 2`. E.MHM:48 yes/no — "k" = pay + V.MHM:33. "e" = `pel(xx).inj = 1000 + gnome` (a 2-9 round ban!) + V.MHM:34. ("Pay the bribe or get suspended" event.)                                                                                                                                         | interactive  | E:48, V:33/34                     |
| 101, 102           | `al 10 = 0` (player with `psk` 2..19)                                  | Charisma `tarko` flips: hit = E.MHM:50 + `pel(xx).psk += 1`; miss = E.MHM:49 + `pel(xx).psk -= 1`. **Permanent skill change** to a single player.                                                                                                                                                                                       | pre-resolved | E:49/50                           |
| 103, 104           | `kiero2=1 AND sr=PHL AND lpl<32 AND tarko(charisma=5, w=10, b=50) = 1` | Open `LAKKO.MHZ`, pick a random `lakko` record (a real archived player on-strike from elsewhere). E.MHM:51 yes/no — "k" = sign them: `lpl += 1`, `pel(lpl) = takko.lelu`. "e" = pass.                                                                                                                                                   | interactive  | E:51, LAKKO.MHZ                   |
| 105, 106           | `kiero2(kr) = 0`                                                       | `tarko(strategy=1, w=20, b=50)` flips: hit = `tre(team) += 0.02` + E.MHM:53; miss = `tre(team) -= 0.02` + E.MHM:52. **Readiness drift event** (only between rounds, not between fixtures).                                                                                                                                              | pre-resolved | E:52/53                           |
| 107, 108           | `tarko(resourcefulness=4, w=10, b=50) = 1`                             | `+ paikka(2, team) * 30 * 100` (arena-sized cash bonus). E.MHM:54.                                                                                                                                                                                                                                                                      | pre-resolved | E:54                              |
| 109, 110           | `kiero2=1 AND al 11 = 0` (national-team-eligible)                      | `rahna = 350000`. E.MHM:55 yes/no — "e" = V.MHM:35 (keep). "k" = sell: V.MHM:36 + `poispelaaja xx, pv` + `+350000` (player goes abroad).                                                                                                                                                                                                | interactive  | E:55, V:35/36                     |
| 111–113            | none                                                                   | E.MHM:56. Pure flavor (no detectable mechanic).                                                                                                                                                                                                                                                                                         | pre-resolved | E:56                              |
| 114, 115           | `al 12 = 0` (`lah=99 AND svu=1`)                                       | E.MHM:57 yes/no — "e" = V.MHM:37 (let go). "k" = `pel(xx).svu += 1` + V.MHM:38. (`lah=99` is the "wants to leave" sentinel; bumping `svu` extends contract.)                                                                                                                                                                            | interactive  | E:57, V:37/38                     |
| 116, 117           | `al 13 = 0` (`svu = 1`)                                                | E.MHM:58 yes/no. "e" = V.MHM:39. "k" = `pel(xx).svu += 1` + V.MHM:40.                                                                                                                                                                                                                                                                   | interactive  | E:58, V:39/40                     |
| 118, 119           | `al 14 = 0` (`lah = 98`)                                               | `pel(xx).lah = 0` + E.MHM:59. (Clear "leaving" intent.)                                                                                                                                                                                                                                                                                 | pre-resolved | E:59                              |
| 120, 121           | `al 15 = 0` (`lah=97 AND svu>1`)                                       | E.MHM:60 yes/no — "e" = V.MHM:41. "k" = `pel(xx).svu = 1` + V.MHM:42. (Forces a contract DOWN to 1 year.)                                                                                                                                                                                                                               | interactive  | E:60, V:41/42                     |
| 122, 123           | `al 16 = 0` (`svu > 1`)                                                | E.MHM:61 yes/no — "e" = V.MHM:43. "k" = `pel(xx).svu = 1` + V.MHM:44.                                                                                                                                                                                                                                                                   | interactive  | E:61, V:43/44                     |
| 124, 125           | `al 17 = 0` (`lah = 97`)                                               | `pel(xx).lah = 0` + E.MHM:62.                                                                                                                                                                                                                                                                                                           | pre-resolved | E:62                              |
| 126, 127, 141      | `sr=PHL AND kiero2=1 AND tarko(charisma=6, w=12, b=50) = 1`            | `erikoisp 28` — special-action id 28.                                                                                                                                                                                                                                                                                                   | pre-resolved | (P.MHM via erikoisp)              |
| 128–130            | `sr=PHL AND kiero2=1 AND tarko(charisma=6, w=12, b=50) = 1`            | `erikoisp 29` — special-action id 29.                                                                                                                                                                                                                                                                                                   | pre-resolved | (P.MHM via erikoisp)              |
| 135–137            | none                                                                   | `tarko(charisma=5, w=20, b=50)` flips: hit = `uhka(pv) = 2` (severe threat); miss = `uhka(pv) = 1`. Sets the threat flag; resolution happens later via the "l" hotkey reading **UH.MHM**:1-15 (uhka=1) or 16-30 (uhka=2). **Defers resolution to a later UI moment.**                                                                   | pre-resolved | (UH.MHM later)                    |
| 138                | `kiero2(kr) = 1`                                                       | `erikoisp 30` — special-action id 30.                                                                                                                                                                                                                                                                                                   | pre-resolved | (P.MHM via erikoisp)              |
| 148, 149           | `mafia(pv) = 1 AND tarko(resourcefulness=4, w=50, b=15) = 0`           | `mor -8`, E.MHM:63. Mafia harassment.                                                                                                                                                                                                                                                                                                   | pre-resolved | E:63                              |
| 150, 151, 160, 161 | `mafia=1 AND tarko(charisma=6, w=15, b=0) = 0`                         | `sovtap(pv) = 1` (forced match-fixing) + E.MHM:64.                                                                                                                                                                                                                                                                                      | pre-resolved | E:64                              |
| 152, 159           | `mafia(pv) = 1`                                                        | `arvox 4` (mafia name reveal) + E.MHM:65 yes/no shakedown. "e" = V.MHM:53 + queue THREE pranks (`jaynax 6, 5, 3`). "k" = `rahna = 99999` + V.MHM:54 + `tarko(charisma=5, w=30, b=0)` adds V.MHM:55 trickle.                                                                                                                             | interactive  | E:65, V:53/54/55, arvox/4         |
| 500, 501           | `al 4 = 0` (top-skill non-`spe` player)                                | `pel(xx).spe = 8` (greedySurfer) + E.MHM:66.                                                                                                                                                                                                                                                                                            | pre-resolved | E:66                              |
| 502, 503           | `al 5 = 0` (low-ego player)                                            | `pel(xx).ego = 20` (max ego) + E.MHM:67.                                                                                                                                                                                                                                                                                                | pre-resolved | E:67                              |
| 504, 505           | `al 8 = 0` (high-ego player ≥17)                                       | `pel(xx).ego = 1` (min ego) + E.MHM:68.                                                                                                                                                                                                                                                                                                 | pre-resolved | E:68                              |

**Coverage check.** Of 521 ids, the cases above account for
~70 distinct event bodies. Conspicuous gaps (silent ids):

- **23, 24** — between mood-illness 22 and 25.
- **75, 76** — between sopu 74 and "good morale" 77.
- **80** — between FA-signing 79 and 81.
- **131–134, 139, 140, 142–147, 153–158, 162–181, 183–499, 506–521** — **the vast majority** of the roll space.

Most of these are intentionally silent — the design relies on an
extremely sparse table to make any given event feel rare. There is
a **small** chance some of the silent ids were used by a feature that
got cut and the case bodies were simply removed; if we find any
orphan E.MHM/V.MHM record indices that no `lux N`/`lex N` references,
that's a deletion candidate. ❓ TODO: cross-reference E.MHM record
count (84) against `lux` references and audit unused records.

### 5.2 · Overall fall-through

After the `END SELECT`:

```basic
IF CSRLIN = 3 THEN lay 27   ' "TAPAHTUMIA EI OLLUT" — print on row 3 if nothing else has printed
pjn                         ' wait for any key
```

So the cursor-row check is the QB's "did we render anything?" probe;
if not, print "TAPAHTUMIA EI OLLUT" (Y.MHM:27 = "no events occurred").
The TS port needs to remember to render that fallback.

---

## 6 · Other random-event sources (outside `sattuma`)

For completeness — not all "random" things in the game flow through
`sattuma`. Here's a map of the others:

### 6.1 · Per-gameday-prep (before `sattuma`, in the manager loop)

`ILEX5.BAS:240..317` for every human-managed team:

- **`fbimiehet`** (`:278`) — FBI abducts an `uglyAndWeird` (spe=3)
  player at `pok%` per-gameday probability. Already decoded.
- **Boycott release** (`:280..285`) — `svu = 666` flag with 5%
  per-gameday roll → `poispel`. Random release of a boycotting player.
- **NHL-call release** (`:287..293`) — `svu = 10000` flag → guaranteed
  release with X.MHM:94 prefix (95 if `extremelyFat`).
- **Zombie countdown** (`:257..272`) — `spe ≥ 30000` rolls
  `tarko(luck=6, w=5, b=30)`: hit = decrement countdown; miss = lock
  to `spe = 13` (perma-zombie). Each gameday rolls again until cleared.
- **Mood phlegmatic clamp** (`:295`) — `spe = 1` (phlegmatic) clamps
  `mo` to ≥ 0 if not bankrupt. Subtle.
- **`tyytyma`** (`:300`, only on `kr = -9` and on load) — board
  discontent pass: any roster player whose `psk` is too low for
  their training-tier-derived score gets dumped to the market with
  X.MHM:97 announcement. Followed by `aaaargh` to top up the roster
  to ≥ 5 players if needed.
- **`uhka(pv) > 0` resolution** (`:407..414`, "l" hotkey) — when the
  player presses "l", consumes the threat flag and prints UH.MHM:1-15
  (uhka=1) or 16-30 (uhka=2). Pure flavor delivery, no mechanical
  effect. Threat is set in `sattuma` cases 135-137.
- **Pre-match `kiero(kr) = 4` training-match offer** (`:310..312`):
  `INT(101*RND) + mtaito(charisma) * 10 > 50 AND hotte(team) = 0`
  → `harjotte 1` (random AI team offers a friendly match).
- **Bankruptcy `faarao`** (`:314`) — already documented.

### 6.2 · Post-match "news" pass

**`uutisia`** (`ILEX5.BAS:7776`) runs once **after** all human
managers' `sattuma` calls on a `kiero=1` round. This is where AI-team
sopupeli detection fires: `INT(100*RND) < erik(3, ai_team) * 10` for
each AI team that bought sopu. On hit: `erik(3) = 0` (cancelled),
N.MHM:25 announcement, `potk xx` (manager fired), competition stats
wiped, `mor -55`, top-scorer (`top()`) wiped. **Team-level effects
on AI teams are a new effect-kind dimension** we'll need.

### 6.3 · Calendar-driven phase events (in `gameday` outer SELECT)

Per `kiero(kr)` round-type, `gameday` triggers different sub-flows:

- **`kiero3(kr)` SELECT** at `:225..238` (entry of a manager's turn):
  `10` = `mmkisaalku` (B-tier mid-season WC tournament). `99` =
  `sponsorit`. `1` = `valitsestrat` + `tremaar` (preseason strategy
  pick). `4` = `jaauniorit` + `budget`. `5` = `suunnitelma`.
  These are all phase-of-season entry actions, not random events,
  but several of them (`mmkisaalku`, `jaauniorit`) include
  randomized choices and new player synthesis.
- **`joulutauko`** (Christmas break, `kiero=98`) — runs the 10
  invitation tournaments (JT1..JT10.PLX). Per tournament, randomized
  16-team draw + 6-round mini-tournament + cash prizes.
- **`mmkisaloppu`** (`kiero3 = 11`) — wraps up the WC tournament for
  B-series countries: clears `inj=9002`, awards medals, applies the
  "international glory" `plus`/`kest` boost or penalty per `mjo` flag.
- **`maajoukkue`** (`kiero=97`) — national-team selection refresh
  (already documented in VARIABLES.md `mjo` row).
- **`euromaar`** (called from `uusikausi`) — randomizes EHL group
  composition for the new season.
- **`cuparpo`** (`kiero3=2`?) — randomizes the cup brackets.
- **`playoffplajays`** + **`plajaytajoukkueet`** — playoff-specific
  prank-target setup.

### 6.4 · `kriisipalaveri` (crisis meeting)

`ILEX5.BAS:2747`. Available via "k" hotkey when `mo(team) <= -6 AND
konkurssi = 0 AND kriisi = 0`. Player picks one of three options;
each is a self-contained mini-event with morale outcomes, KR.MHM:1-35
flavor records, and (option 3 only) a chance of a **physical
beating**: 1-in-3 of `pel(xx).inj = INT(5*RND)+3`. See VARIABLES.md
`ego` row for the full flow.

### 6.5 · Between-seasons (`ILEZ5.BAS`)

- **`alkukevat`** (`:75`) — early spring opening events.
- **`zreseasongala`** in ILEX5 — Lentti's gala monologues from
  S1..S5.MHM + GA.MHM (the Pindegren trove).
- **`muutmestarit`** — non-PHL-champion announcements.
- **`managerisiirrot`** — random AI-manager firings/transfers.
- **`pelaajasiirrot`** — bulk player transfers.
- **`omasopimus`** — (already ported) own contract negotiation.
- **`sopimusext`** — player contract extension flow.
- **`maajoukkue`** — national-team finalization (pre-WC for A-tier).

These all fire stochastic content but with very different shapes than
in-season events.

### 6.6 · `meanstuff` — manager-initiated pranks

Player-initiated, not random — the manager **buys** a prank from the
JAYNAT.M2K menu via the "f" hotkey. The chosen prank's `jaynax(N, target)`
flag is set; `jaynacheck` resolves it on the target's next gameday.
Already documented in DATA-FILES.md and the `jaynacheck` SUBS row.
Listed here because it shares the prank queue infrastructure with
`sattuma` cases 33-34, 152, etc.

---

## 7 · Effect-kind catalogue

Below is every distinct mutation observed across the random-event
surface, with its mapping to the existing `EventEffect` alphabet
([src/game/event-effects.ts](../../game/event-effects.ts)). Items
flagged **NEW** are not currently in the union and will need to be
added (or modeled differently) for MHM 2000.

### 7.1 · Manager / team scalars

| QB write                          | Effect kind           | Status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rahna = N: rah` (positive)       | money +               | `incrementBalance` ✅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `rahna = -N: rah`                 | money −               | `decrementBalance` ✅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `raha(pv) = raha(pv) - .1 * raha` | money percentage      | **NEW** — `decrementBalancePercent` (or compute amount in `resolve`, then `decrementBalance`). Used by case 25.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `raha(pv) = -raha(pv): rah`       | negate then add       | **NEW** (and likely a QB bug — preserve verbatim). Negates the balance then adds `rahna` (100k in case 48-49). Net: a manager with 2M ends up at −1.9M. Not a pure negation — the `rah` call runs immediately after.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `mor team, ±N`                    | morale ±              | `incrementMorale` / `decrementMorale` ✅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `tre(team) += 0.02 / -= 0.02`     | readiness drift       | **NEW** — `incrementReadiness` (was previously deleted with the MHM 97 readiness arc; **add back** with delta scale).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `potti(pv) += amount`             | arena building fund + | **NEW** — `incrementArenaFund(team, amount)` (case 59). `potti(pv)` is the per-manager **arena construction kitty**, not a prize pool. Set up in `SUB areena` ([ILES5.BAS:30](../ILES5.BAS)) where the manager moves money from `raha(pv)` into `potti(pv)` ("MÄÄRITÄ POTTIIN SIIRRETTÄVÄ SUMMA" at `:104-107`); shown as a separate row above the SALDO line. Building requires `potti(pv) >= 0.2 * rahna` as down payment ([ILES5.BAS:474, 527](../ILES5.BAS)); construction draws `mpv(pv)` (monthly instalment) per round ([ILEX5.BAS:5484-5485](../ILEX5.BAS)). Reset to 0 when the manager swaps teams ([ILEZ5.BAS:704](../ILEZ5.BAS)). Distinct from `ppotti` (LONG global), which IS the league prize pool — gate-receipt-funded in `ottpel` (`ILEX5.BAS:3698-3699`) and distributed at end-of-season per `POTTI.M2K` percentages to the top-11 finishers (`ILEZ5.BAS:438-461`). |
| `kausik(team) = N`                | season ticket count   | **NEW** if events touch this. ❓ TODO check.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

### 7.2 · Manager / team flags & status

| QB write                     | Effect kind                               | Status                                                                                                                  |
| ---------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `mafia(pv) = 0/1`            | mafia flag                                | **NEW** — `setManagerFlag("mafia", bool)` works generically if we include `"mafia"` as a `GameFlags` key. Or per-team.  |
| `sovtap(pv) = 1`             | match-fixing forced-loss queued           | **NEW** — `setMatchFixingForced(team)` or generic team-effect.                                                          |
| `krapu(pv) = 1/2`            | hangover state (1 = mild, 2 = pikku-ukot) | **NEW** — visible in lineup screen + drives mood-event guard.                                                           |
| `kuume(pv) = 1`              | fever                                     | **NEW** — drives match-engine penalty.                                                                                  |
| `tautip(pv) = 0.8/0.9/1`     | illness severity multiplier               | **NEW** — SINGLE-precision float; clamps match performance.                                                             |
| `tautik(pv) = N`             | illness duration in rounds                | **NEW** — countdown.                                                                                                    |
| `uhka(pv) = 1/2`             | pending threat from UH.MHM                | **NEW** — set here, consumed later via "l" hotkey UI moment.                                                            |
| `verk% = xx`                 | betting tip flag                          | **NEW** — and ❓ TODO understand the full mechanic (where does `verk%` get read?).                                      |
| `jaynax(N, idx) = ...`       | schedule a prank slot                     | **NEW** — `schedulePrank(slot, target)`. Drained by the next-match `jaynacheck` resolver. Index can be team or manager. |
| `erik(N, team) = 0`          | cancel a team service (sopu detected)     | **NEW** — `clearTeamService(team, slot)` or per-slot effect.                                                            |
| `erik(N, team) = 1/2`        | install a team service                    | (Outside random events — services are bought, not granted.)                                                             |
| `spx(N, pv) = ±1` / `+= 1`   | consumable / one-shot flag                | **NEW** — `incrementConsumable(slot)` or `setStatusFlag(slot)`. CCCP-tabletti, ZOMBIPULVERI, VOODOO-UKKO, TANSSIRYHMÄ.  |
| `boikotti(team) = 1`         | fan boycott                               | **NEW** — set when releasing a `suosikki` player (xavier `fat=3`).                                                      |
| `skout(country, pv) = 0/1/N` | scout state                               | **NEW** — `setScout(country, value)`. 0 = no, 1 = active link, N>1 = research countdown.                                |
| `treeni(pv) = -1/0/1`        | training intensity result                 | (Set in gameday prep, not events — but events could nudge.)                                                             |
| `inte(pv) = 0/1/2`           | match intensity choice                    | (Currently UI-driven; events don't write it.)                                                                           |
| `automat(pv) = 0/1`          | auto-lineup toggle                        | (UI-driven.)                                                                                                            |
| `konkurssi(pv) = N`          | bankruptcy round counter                  | **NEW** — set by financial system, not random events directly.                                                          |

### 7.3 · Per-player mutations

| QB write                                       | Effect kind                      | Status                                                                                                                                                               |
| ---------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pel(xx).inj = N` (1..999)                     | injury countdown                 | **NEW** — `applyPlayerInjury(player, injuryId, duration)`. Already modeled as `Injury` PlayerEffect.                                                                 |
| `pel(xx).inj = N + 1000` (1001..1999)          | ban countdown                    | **NEW** — `applyPlayerBan(player, banId, duration)`. Already modeled.                                                                                                |
| `pel(xx).inj = gnome + 2000` (2001..2999)      | rehab / vieroitus                | **NEW** — `applyPlayerRehab(player, duration)`. Drug-addiction prank result.                                                                                         |
| `pel(xx).inj = 3333`                           | strike (LAKKO)                   | **NEW** — `applyPlayerStrike(player)`. Set by `faarao`; cleared when bankruptcy resolves.                                                                            |
| `pel(xx).inj = 9001 / 9002`                    | national-team absence            | (Already documented; set by `maajoukkue`.)                                                                                                                           |
| `pel(xx).plus = N, kest = K`                   | temporary skill modifier         | **NEW** — `applyPerformanceModifier(player, amount, duration)`. Modeled as `PlayerEffect`.                                                                           |
| `pel(xx).psk += 1` / `-= 1`                    | permanent skill change           | **NEW** — `incrementPlayerSkill(player, delta)`.                                                                                                                     |
| `pel(xx).psk = N`                              | direct skill set                 | (Edge case: zombie set to 1.)                                                                                                                                        |
| `pel(xx).ego = 1 / 20`                         | ego min/max set                  | **NEW** — `setPlayerEgo(player, value)`.                                                                                                                             |
| `pel(xx).spe = 8` (greedySurfer)               | specialty set                    | **NEW** — `setPlayerSpecialty(player, code)`.                                                                                                                        |
| `pel(xx).spe = 13` (zombie)                    | specialty set + cascade          | The zombie cascade also wipes `psk = 1, yvo/avo = -3, ldr/kar = 1, kun = 0`. Either model as one big effect or many.                                                 |
| `pel(xx).spe = 30000 + n` (zombiPowderedBase)  | specialty set                    | xavier `fat=4` consumes ZOMBIPULVERI to do this.                                                                                                                     |
| `pel(xx).spe = 666` (POLIISI)                  | specialty toggle                 | "m" hotkey — not random.                                                                                                                                             |
| `pel(xx).svu = 1`                              | contract years downgrade         | **NEW** — `setPlayerContractYears(player, years)`. Used by cases 120-123.                                                                                            |
| `pel(xx).svu += 1`                             | contract years bump              | Cases 114-117.                                                                                                                                                       |
| `pel(xx).sra *= 1.1`                           | salary 10% raise                 | **NEW** — `multiplyPlayerSalary(player, factor)` or compute new salary in `resolve`.                                                                                 |
| `pel(xx).lah = 0`                              | clear leaving-flag               | **NEW** — `clearPlayerLeavingFlag(player)`. Cases 118-119, 124-125.                                                                                                  |
| `pel(xx).gls = 0, ass = 0`                     | wipe player stats                | **NEW** — `wipePlayerStats(player)`. Sopupeli punishment.                                                                                                            |
| `pel(xx).kar ±N`                               | charisma change                  | xavier `fat=2`. **NEW** — `incrementPlayerCharisma(player, delta)`.                                                                                                  |
| Append new `pelaaja` to `pel(*, pv)`           | sign new player                  | **NEW** — `signSyntheticPlayer(player, contract)`. Sources: case 81-82 (rela-generated); 103-104 (LAKKO.MHZ pick); 93/126-130/138 (erikoisp from MONTY.MHZ + P.MHZ). |
| `poispel` / `poispelaaja`                      | release player                   | **NEW** — `releasePlayer(player, toMarket?)`. FBI abduction, NHL call, voluntary release, `tyytyma` dump, case 109-110 sale.                                         |
| Set `top(team, slot)` (AI-team display ghosts) | wipe AI team scoring leaderboard | **NEW** — `wipeAITeamTopScorers(team)`. Sopupeli punishment for AI teams.                                                                                            |

### 7.4 · Competition state

| QB write                               | Effect kind                                             | Status                                                                              |
| -------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `p / gf / ga / win / dra / los`        | wipe season standings for this team in this competition | **NEW** — `wipeTeamStandings(team, competition)`. Sopupeli punishment in `kiero=1`. |
| `ep / egf / ega` per-team (EHL)        | wipe EHL standings                                      | Same shape; per-competition.                                                        |
| `ex(N) = light_team_replacement`       | replace caught team in EHL bracket                      | **NEW** — `replaceTeamInBracket(competition, slot, replacement)`.                   |
| `pwin(team) = 0`, `pwin(opponent) = 3` | playoff series forfeit                                  | **NEW** — `forfeitPlayoffSeries(team, opponent)`.                                   |
| `cup(idx) = vast(pv)` (swap-out)       | cup forfeit                                             | **NEW** — `forfeitCupRound(team)`.                                                  |
| `leg(team) = 0/20`                     | cup-leg goal "head start" set                           | Sopu cup result manipulation; case 53-55 doesn't use it directly.                   |
| `incurPenalty` (existing)              | round-robin penalty                                     | ✅                                                                                  |
| `addTeamEffect`                        | strength buff/debuff                                    | ✅                                                                                  |
| `addOpponentEffect`                    | opponent strength buff/debuff                           | ✅                                                                                  |

### 7.5 · Country / world

| QB write         | Effect kind            | Status                                                      |
| ---------------- | ---------------------- | ----------------------------------------------------------- |
| Country strength | `alterCountryStrength` | ✅ (already used by attitudeCanada / attitudeUSA in MHM 97) |

### 7.6 · UI / news

| QB call                  | Effect kind                    | Status                                                                                                                    |
| ------------------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `lux N` / `lex N` / etc. | render MHM record              | Handled in event `render(data)` — port the canonical text verbatim per DATA-FILES.md token rules. Not an `EventEffect`.   |
| `lentti N, M`            | render Lentti studio segment   | Same — render-time concern, not an effect. Pick one of 6 lines from S{N}.MHM record range `(M-1)*6+1..(M-1)*6+6`.         |
| `komme N`                | render generic comment         | Render-time concern. ❓ TODO confirm the K{N}.MHM file pattern.                                                           |
| `arvox N`                | random line from `arvox/N.a2k` | **NEW** — pre-roll the line in `resolve`, snapshot to payload, render in `render`. Files contain book titles, names, etc. |
| `mahmax`                 | random surname from .MHX       | Same: pre-roll in `resolve`.                                                                                              |
| Persistent news in N.MHM | per-manager announcement       | `addAnnouncement` ✅                                                                                                      |
| Toast                    | transient notification         | `notify` ✅                                                                                                               |

### 7.7 · Spawning / chaining

| Source case      | Action                                   | Status                                                                                             |
| ---------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 53-55            | spawn `protesti` directly                | `spawnEvent` ✅                                                                                    |
| 42               | spawn `jaynacheck 1` (ripuli) inline     | Same as `spawnEvent` to a "ripuli" event id, OR collapse into a direct effect bundle.              |
| 92               | spawn `jaynacheck 2` (skandalpl) inline  | Same.                                                                                              |
| 93, 126-130, 138 | spawn `erikoisp N` (special action menu) | `spawnEvent` to per-N event definitions. The MONTY.MHZ + P.MHZ table-loading happens in `resolve`. |

---

## 8 · Suggested archetype mapping

Per AGENTS.md "Three event archetypes":

- **Pre-resolved** (60% of cases): everything inside the case body
  fires immediately at `sattuma` time. No follow-up screen. Examples:
  cases 1-2 (flavor only), 38-40 (charisma flip), 41 (lottery hit),
  64-65 (high-ego tantrum), 100 (interactive→consequence is one
  immediate decision), readiness drift, mafia harassment.
- **Auto-resolve** (smaller share): protest, ripuli, skandaali —
  events spawned by `sattuma` but resolved in their own event-phase
  step where rolls happen and outcomes get baked. The 7 jaynat
  pranks queued via `jaynax(N, ...)` flags are also auto-resolve
  events from the engine's perspective (resolver = `jaynacheck`).
- **Interactive** (30% of cases): every `wnd 2` (yes/no) prompt is
  one of these. Map to `options: () => { k: "Kyllä", e: "Ei" }`.
  Many cases also have a **post-decision charisma `tarko`** that
  flips the outcome — the roll happens in `resolve` after the
  user answers, exactly as the existing `jobofferPHL` archetype does.

Several cases combine archetypes:

- **Case 100** = interactive yes/no, but the consequence depends on
  whether the user accepts. Both branches roll separately. Model as
  interactive with `value` ∈ `{k, e}` and apply the branch in
  `process`.
- **Case 35** = interactive yes/no, then charisma `tarko` flip on
  both branches (4 outcomes). Roll in `resolve`, store both rolls
  alongside the user's choice.
- **Case 43-45** = interactive but `arpo 1` happens before the prompt
  (random opponent baked into the question). Pre-roll in `resolve`.
- **Case 52** = interactive yes/no AFTER the main effects already
  applied — the prompt is "do you want to hear the Lentti
  commentary?". Order matters; render in two stages.

---

## 9 · Data files involved

Per DATA-FILES.md inventory, mapped to `sattuma`'s usage:

| File                 | Records        | Used by `sattuma`                                                                       |
| -------------------- | -------------- | --------------------------------------------------------------------------------------- |
| **E.MHM**            | 84             | Main event-description pool. ~50 records referenced via `lux N`.                        |
| **V.MHM**            | 57             | Event-resolution flavor. ~50 records referenced via `lex N`.                            |
| **N.MHM**            | 88             | News / announcements (persistent). Used by `luz N` in `uutisia` AI-team punishments.    |
| **KONKKA.MHM**       | 5              | Bankruptcy stage banner. `lt "konkka", N` in Layer 1.                                   |
| **I.MHM**            | 47             | Injury text. Layer 4a via `dap 1`. (Already decoded.)                                   |
| **PK.MHM**           | 19             | Ban text. Layer 4c via `dap 2`. (Already decoded.)                                      |
| **M.MHM**            | 45             | Mood event text. Layer 4b via `dap 3`. (Already decoded.)                               |
| **P.MHM**            | 30             | Special-action descriptions. Used by `erikoisp` invocations from cases 93/126-130/138.  |
| **UH.MHM**           | 30             | Threat text. Set by cases 135-137 (`uhka = 1/2`); rendered later via "l" hotkey.        |
| **KYLLA.MHM**        | 30             | "Yes" answers — paired with P.MHM by `erikoisp`.                                        |
| **EI.MHM**           | 30             | "No" answers — paired with P.MHM by `erikoisp`.                                         |
| **X.MHM**            | 216            | Long-form prefix text + difficulty descriptions. `lax N` is used liberally as a prefix. |
| **Y.MHM**            | 192            | UI labels. `lay N` for short prefixes (e.g. row-3 "TAPAHTUMIA EI OLLUT" = `lay 27`).    |
| **Q.MHM**            | 39             | Screen titles. `leq 32` opens with "ERIKOISPIKARAPORTTI" or similar.                    |
| **S1..S5.MHM**       | 174/72/66/84/6 | Lentti studio commentary segments (see `lentti N, M`). Used by Layer 3 + cases 52, 102. |
| **GA.MHM**           | 54             | Lentti gala. End-of-season only.                                                        |
| **MUUDIT.M2K**       | 45             | Mood definitions. Already decoded.                                                      |
| **PELKIEL.M2K**      | 18             | Ban durations. Already decoded.                                                         |
| **INJURIES.M2K**     | 45             | Injury severity table. Already decoded.                                                 |
| **JAYNAT.M2K**       | 7              | Prank menu. Already decoded.                                                            |
| **MONTY.MHZ**        | ?              | Special-action header (montx type: count + offset). Used by `erikoisp`.                 |
| **P.MHZ**            | ?              | Special-action player records (pelaaja). Used by `erikoisp` to add players to roster.   |
| **LAKKO.MHZ**        | ~21            | "On-strike" players from elsewhere. Used by case 103-104.                               |
| **arvox/{1..7}.a2k** | ?              | Random-line text files: book titles, joke names, mafia handles, destinations.           |

### 9.1 · Suggested raw-data extractions

For each of these we should:

1. Extract to **UTF-8** (cp850 source) once, deterministically.
2. Document in **DATA-FILES.md** with record count + sample.
3. Convert format tokens (`$j…$b`, `@N`, `£N`) to Markdown per
   DATA-FILES.md canonical table.
4. Save the UTF-8'd records as a JSON array per file under
   `src/data/mhm2000/raw/` (or similar), where the index in the
   array matches the QB record id (1-based via index 0 ignored, or
   just use 0-based with a stable shift — pick one and document).

Recommended priority for raw extraction:

1. **E.MHM, V.MHM** — needed before any `dat%` event ports.
2. **N.MHM** — needed for AI-team news punishments + many event
   announcements.
3. **KONKKA.MHM** — small (5 records); trivial.
4. **MONTY.MHZ + P.MHZ** — binary; need cp850-aware reader. ❓ TODO
   confirm record sizes (probably `montx` is `2 INTEGER = 4 bytes`,
   `pelaaja` is `~64 bytes`).
5. **LAKKO.MHZ** — `lakko` type is `40-byte name + pelaaja`.
6. **UH.MHM, P.MHM, KYLLA.MHM, EI.MHM** — needed by `erikoisp` and
   `uhka` flow.
7. **arvox/\*.a2k** — small ASCII files. Each has an INTEGER record
   count on line 1 (read by `arvox` SUB at line 778), then that
   many lines of text.

---

## 10 · Open questions / TODO

1. **`verk%` semantics** (case 43-45). What does setting `verk% = xx`
   actually do? Search for `verk%` reads outside `sattuma`. Probably
   feeds into the betting screen (`vedonlyonti`) but ❓.
2. **Case 48-49 `raha = -raha` bug?** Sets balance to its negation,
   which for a positive balance immediately wipes you to negative
   without the conventional `rahna` plumbing. Verify against original
   behavior; could be intentional flavor ("you lose everything").
3. **Case 50-51 cursor mid-event.** The illness-diagnosis flow uses
   `kurso > 3` to branch into one of two outcomes — looks like the
   user picks a cursor position in some UI we haven't fully decoded.
   Trace how `kurso` arrives in a state > 3 here.
4. **Case 87 `arvox 1`/`arvox 2` book-title format.** Two random
   lines combine into "X, kuuluisa kirjailija, hahmottelee uutta
   teostaan: «Y» on kirjan nimi…". Needs the `arvox/1.a2k` and
   `arvox/2.a2k` extraction.
5. **`erikoisp` 1..30 special-action enumeration.** Cases 93, 126-130,
   138 invoke specific ids (28, 29, 30) plus `INT(17*RND)+1` (1..17)
   from case 93/155. Need to decode MONTY.MHZ to see which id is what.
6. **Case 60-62 vs case 87** — both use `arvox`. Confirm distinct
   content; might be the same "joke generator" plumbing reused.
7. **Silent dat% gaps.** Cross-reference E.MHM record count (84)
   against the actually-read `lux N` ids in `sattuma` to find:
   (a) records that exist but no case reads them (dead content), or
   (b) cases that read records beyond record count (defensive
   programming or off-by-one — e.g. `lux 84` in case 444 needs
   verification).
8. **Case 444** (sponsor / consumable purchase): `arpo 0` (pick any
   team), then `lux 84`, then yes/no at `-66666` mk. "k" =
   `spx(2, pv) += 1` (ZOMBIPULVERI) + V.MHM:56. "e" = V.MHM:57.
   This is **the** zombiPowder-acquisition event. Confirm `lux 84`
   = E.MHM record 84 (the last one).
9. **Case 222, 226** (scout-of-rumor). `sex 1 = 0` finds an active
   scouted country into `xx`. Then E.MHM:45 + `skout(xx, pv) = 0`
   (cancel the scout — "your contact ratted you out"). Pure
   destructive.
10. **`leggi` cup-punishment branch** in Layer 2 (`erik(3)` case 3,
    cup punishment): `leggi=1` makes you lose the leg outright;
    `leggi=2` swaps your team out of the cup. ❓ TODO confirm leggi
    semantics in the cup engine.
11. **Multi-stage interactive events.** Cases like 26-28 (action +
    success roll → another comment) layer two effects on one event.
    Modeling: emit an effect array of length 2-3 in `process`, or
    treat the secondary roll as a separate spawned event. The latter
    is cleaner but adds chain depth.

---

## 11 · Recommended next steps

1. **Extract E.MHM + V.MHM** to raw JSON. Trivial; unblocks port.
2. **Extend `EventEffect` union** with the **NEW** items from §7.
   Group naturally: (a) money helpers, (b) team flags (krapu, kuume,
   tautip, tautik, sovtap, mafia, uhka, verk), (c) per-player
   scalars (psk, ego, spe, svu, sra, lah, gls/ass, kar), (d)
   per-player effect lifecycle (strike, rehab — collapse with
   existing `Injury` PlayerEffect via discriminator), (e)
   competition wipes (standings, top, bracket replacement, forfeit),
   (f) consumables (`spx`), (g) prank-queue scheduling (`jaynax`),
   (h) misc (`tre`, arena fund `potti`, `boikotti`, `skout`).
3. **Port `KONKKA.MHM`** as the Phase 2 vertical-slice event — it's
   the simplest possible consumer of the new effect alphabet and
   exercises the full pipeline (record extraction → declarative
   event → `process` → effect interpreter → render).
4. **Port `dap` CASE 1/2/3** as the post-match-trinity reusable
   pieces — they're well-bounded and the data is already decoded.
   These three become **the foundation** that case 100, 105-106,
   etc. build on.
5. **Port `jaynacheck`** as the prank-queue resolver; this unlocks
   `meanstuff` (player buys pranks) and ~6 of the `sattuma` cases
   that schedule pranks.
6. **Then** the big `dat%` table, case-by-case, in roughly the order
   of the table in §5.1 (least dependencies first → most coupled
   last).

The total surface is large but well-bounded: **~70 distinct events**
in the main pool, **~5 supporting random sources** (faarao, fbimiehet,
boycott, NHL-call, zombie-countdown), **~10 between-season events**.
Roughly **~100 events** in total to port, vs. MHM 97's 96. Same
order of magnitude but a richer effect alphabet.

# Pekkiini-douppaus — `erik(3)` doping system

> QB array: `erik(3, 1..48)` — per-team, values 0 / 1 / 2.
> 0 = clean, 1 = mild ("lievä"), 2 = DDR-style ("DDR-tyylinen").
> Cost: `erikmak(level, 3)` per match = 0 / −10 000 / −20 000.

## What it does

### Match strength boost — two paths, inconsistent gating

There are actually **two independent paths** the doping bonus enters
the match simulation. They behave differently:

#### Path 1: `zzra` → `mw/pw/hw` (human teams only)

`SUB voimamaar` (ILEX5.BAS:8429) recalculates team strengths for
human-managed teams. Called from `SUB piirtox` (`:4156`) before
every round's action phase. Inside it, the `zzra` subroutine
(`:8546`) adds `erik(3)` to every player's effective skill:

```basic
temp% = pel(ccc, pv).psk + pel(ccc, pv).plus + erik(3, u(pv))
```

This bakes the doping bonus into `mw(team)`, `pw(team)`, `hw(team)`.
These cached values are then loaded into `ode(1..3, z)` at the top
of `SUB ottpel` (`:3765-3767`):

```basic
ode(1, z) = mw(od(z))  ' already includes erik(3) for human teams
ode(2, z) = pw(od(z))
ode(3, z) = hw(od(z))
```

**No `kiero(kr)` gate.** The boost flows into ALL match types —
league, EHL, cup, playoffs. This is the human team's doping path.

#### Path 2: explicit `ottpel` addition (AI teams only)

For AI teams (`ohj(od(z)) = 0`, ILEX5.BAS:3824), a separate code
block adds the doping bonus directly to `ode`:

```basic
IF kiero(kr) = 1 THEN          ' ← league only!
  IF erik(3, zz) <> 0 THEN
    ode(1, z) += erik(3, zz)
    ode(2, z) += erik(3, zz) * 6
    ode(3, z) += erik(3, zz) * 12
    yw(zz)    += erik(3, zz) * 5
    aw(zz)    += erik(3, zz) * 4
  END IF
END IF
```

**Gated by `kiero(kr) = 1`.** AI teams only get the boost in regular
league rounds. No effect in EHL, cup, or playoffs.

#### The inconsistency

| Team type | League boost | EHL/cup/playoff boost | Detection |
| --------- | ------------ | --------------------- | --------- |
| Human     | Yes (zzra)   | Yes (zzra)            | All types |
| AI        | Yes (ottpel) | **No**                | All types |

AI teams that start doping mid-season (`:7810-7812`) get zero benefit
in playoffs but can still get caught there. This looks like a bug —
the `zzra` path doesn't run for AI teams (they don't go through
`voimamaar`; their `mw/pw/hw` come from `tasomaar`/`TASOT.M2K`), so
the only doping path available to them is the league-gated one.

Human teams get the bonus everywhere because it's baked into the
cached `mw/pw/hw` values by `voimamaar` before the match engine
even runs.

**The `ottpel` flat bonuses (×1/×6/×12/×5/×4)** also differ from the
`zzra` per-player approach. Path 1 adds `erik(3)` to each player's
`psk` individually (compounding through `hketju^2.5`/`pketju^2`
transforms). Path 2 adds a flat bonus to the team aggregate after
those transforms. They don't produce the same result even at the
same level.

This is consistent with the author's memory of conceptual difficulty
in implementing it. Two separate mechanisms, incomplete coverage,
asymmetric AI/human behavior. Consider normalizing in a post-launch
patch.

### Player skill display (SUB zzra, ILEX5.BAS:8546)

`temp = psk + plus + erik(3, u(pv))` — doping level is added to
every player's effective skill in the strength calculation pipeline
(`SUB voimamaar`). This means the boost compounds: it's +1/+2 per
player, and the lineup aggregation squares/cubes the result via the
`hketju^2.5 / pketju^2` transforms. The flat aggregate bonuses from
`ottpel` above stack on top.

### Lineup screen display (ILEX5.BAS:4937, 4960–4992, 5039)

`erik(3)` is added to displayed `psk + plus` values in certain
view modes (`fat% = 1, 3, 6, 8`). Players look better on paper.

### Per-match cost (SUB rahanvelvoitteet, ILEX5.BAS:5267)

`rahna2 += erikmak(erik(3, u(pv)), 3)` — deducted every match
regardless of home/away. Unlike faniryhmä (home/away dependent) and
travel (away only), doping costs are always paid.

## Detection — SUB sattuma (ILEX5.BAS:5535–5619)

Checked **every round** inside `SUB sattuma` (the random-events
phase, runs after match results are shown). **Only fires if
`erik(3, u(pv)) <> 0`.** Detection probability **increases with
competition stage** — your memory was right, getting caught is
cumulative across the season:

| `kiero(kr)` | Competition | Detection roll                | Lievä % | DDR % |
| ----------- | ----------- | ----------------------------- | ------: | ----: |
| 1           | League      | `INT(101*RND) < erik(3) * 10` |    ~10% |  ~20% |
| 2           | EHL         | `INT(101*RND) < erik(3) * 15` |    ~15% |  ~30% |
| 3           | Cup         | `INT(101*RND) < erik(3) * 20` |    ~20% |  ~40% |
| 42, 44, 46  | Playoffs    | `INT(101*RND) < erik(3) * 22` |    ~22% |  ~44% |

So DDR-style doping in the playoffs has a **~44% chance of getting
caught per round**. Over a 7-game playoff series that's
`1 - 0.56^7 ≈ 98%` cumulative probability. You WILL get caught.

### Punishment severity by competition

**League (`CASE 1`):** Fine **−1 000 000**. Morale **−55**.
All league stats zeroed (points → 0, GF → 0, GA → 20×rounds,
wins/draws → 0, losses → all rounds played). All non-junior players
lose goals+assists. Text: `lax 41`.

**EHL (`CASE 2`):** Fine **−500 000**. Morale **−55**.
EHL-specific stats zeroed. Manager's EHL entry (`ex(xx)`) replaced
with a dummy team (70 + manager). `muke(pv) = 0`. Text: `lax 43`.

**Cup (`CASE 3`):** Fine **−400 000**. Morale **−55**.
Text: `lax 215`. Then checks `leggi` (cup leg number):

- `leggi = 1`: your cup points zeroed, opponent gets 20.
- `leggi = 2`: you're eliminated from the cup bracket.

**Playoffs (`CASE 42/44/46`):** Fine **−1 000 000**. Morale **−55**.
Playoff wins zeroed (`pwin(you) = 0`), opponent gets 3 wins
(instant series loss). Player stats zeroed. Text: `lax 42`.

### The lingering risk

Detection isn't just match-day. It also fires in the **between-round
AI doping sweep** at ILEX5.BAS:7784–7805. Every round, for **all
48 teams**:

1. **AI doping detection** (`:7784-7795`): If `ohj(xx) = 0` (AI)
   and `erik(3, xx) <> 0`, roll `100*RND < erik(3) * 10`. If caught:
   `erik(3) = 0`, manager fired (`potk xx`), league stats nuked,
   morale −55. News item (`luz 25`).

2. **AI doping cessation** (`:7804-7805`): If AI and still doping
   after detection check, **40% chance** to voluntarily stop:
   `IF INT(100*RND)+1 < 40 THEN erik(3, xx) = 0`.

3. **AI doping initiation** (`:7810-7812`): After round 33
   (`ot > 33`), if AI team is NOT doping and is doing **badly**
   (`s(xx) > threshold` where `s` = sijoitus = league standing,
   higher = worse), they might START doping out of desperation:
   - Threshold: `a = 9` (tier 1), `8` (tier 2), `7` (tier 3+)
     i.e. teams ranked below ~8th–9th in their division
   - Roll: `500*RND < s(xx)` — **worse** standing → higher chance
   - Level: `INT(101*RND) < s(xx) * 2` → level 2, else level 1
     (bottom-table teams more likely to go full DDR)

So AI teams start doping mid-season when they're **desperate** —
sinking in the standings with the season running out. The worse
their position, the more likely they reach for the needle. But
they also have a 40% per-round chance of chickening out.

## Why it's a trap

For **human managers**, the boost actually works in all competitions
(via `zzra` → `mw/pw/hw`), but detection fires everywhere too with
escalating odds. The math still crushes you:

- ~44 league rounds × 10%/20% detection chance each
- Plus EHL/cup/playoff rounds at 15–44% each
- Cumulative catch probability over a full season ≈ **~100%**

Punishment is devastating enough that one catch wipes out any benefit.

For **AI teams**, doping is strictly worse: boost only works in
league (`ottpel` path), but detection fires in all competitions.
A doping AI team in the playoffs gets zero benefit and maximum risk.

The only "rational" human play: enable doping for a few critical
league rounds, disable before detection accumulates. But even that
requires surviving each round's independent roll.

**Conclusion:** Pekkiini-douppaus is a deliberately suicidal option.
The implementation inconsistency between human and AI paths is a
known quirk from the original — two mechanisms bolted together with
incomplete coverage. Consider normalizing in post-launch patches.

## Port implications

- Match boost → team effect applied in `executeGameday` strength calc
- Detection → declarative event in `SUB sattuma` port, per-competition
  penalty table
- AI doping logic → between-round AI behavior sweep
- Per-match cost → already modeled in `erikmak` costs in team-services.ts
- The `zzra` skill bonus needs wiring when the match engine ports

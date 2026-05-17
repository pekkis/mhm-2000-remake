# AI team post-match effects

AI teams never get per-player injuries, bans, or mood changes. The
human-team `sattuma` → `dap` pipeline (per-player `pel().inj` /
`pel().plus` / `pel().kest`) is exclusively for human-managed teams.

Instead, AI teams use **team-level debuffs and multipliers** applied
in `uutisia` (`ILEX5.BAS:7776`), which runs once after all human
managers' `sattuma` calls on a `kiero=1` round.

This is a deliberate design simplification — AI teams don't have
managed rosters or lineups, so player-level effects would be
invisible and mechanically meaningless.

---

## 1 · Team disease — `teet` (6% per round)

`ILEX5.BAS:7838-7857`. For each AI team, 6% chance per round:

```basic
FOR zzz = 1 TO 48
  xx = x(zzz)
  IF ohj(xx) = 0 THEN                            ' AI teams only
    IF 100 * RND < 6 THEN
      z = INT(100 * RND) + 1
      IF z < 10 THEN a = 1                       ' 10%: goalie disease
      ELSE IF z < 51 THEN a = 2                  ' 40%: defense disease
      ELSE a = 3                                  ' 50%: attack disease
      IF tarka(a) = 0 THEN
        IF a = 1 THEN b = -(INT(2 * RND) + 1)    ' goalie: -1 to -2
        ELSE IF a = 2 THEN b = -(INT(5 * RND) + 1)  ' defense: -1 to -5
        ELSE b = -(INT(10 * RND) + 1)            ' attack: -1 to -10
        teet a, b, INT(8 * RND) + 1              ' apply for 1-8 rounds
      END IF
    END IF
  END IF
NEXT zzz
```

### Unit distribution

| Roll `z` | Unit `a` | Probability | Debuff range |
| -------- | -------- | ----------- | ------------ |
| 1–9      | 1 (MV)   | 10%         | −1 to −2     |
| 10–50    | 2 (PP)   | 40%         | −1 to −5     |
| 51–100   | 3 (HYÖ)  | 50%         | −1 to −10    |

Duration: `INT(8 * RND) + 1` → 1–8 rounds (stored as `+1` in
`tkest`).

### `SUB teet` (`ILEX5.BAS:7448`)

```basic
SUB teet (jup%, jupp%, juppp%)
  tauti(jup%, tox(xx)) = jupp%       ' additive team-unit modifier
  tkest(jup%, tox(xx)) = juppp% + 1  ' duration countdown
END SUB
```

Sets `tauti(unit, team)` = debuff amount and `tkest(unit, team)` =
duration. These are additive modifiers per unit (goalie / defense /
attack) on the team's match strength.

### Match-engine application (`ottpel`, `ILEX5.BAS:3810-3830`)

```basic
IF ohj(od(z)) = 0 AND od(z) < 49 THEN
  zz = od(z)
  FOR d = 1 TO 3
    ode(d, z) = ode(d, z) + tauti(d, tox(zz))    ' add disease modifier
  NEXT d
END IF
```

The `tauti` values are added directly to the team's computed
attack/defense/goalie power during match resolution. Combined with
`tautip` (see §2).

---

## 2 · Team-wide multiplier — `taut`

`tautip(team)` is a SINGLE-precision float that multiplies the entire
team's strength in the match engine:

```basic
yw(zz) = yw(zz) * tautip(zz)
aw(zz) = aw(zz) * tautip(zz)
ode(d, z) = ode(d, z) * tautip(zz)
```

Set by `SUB taut`:

```basic
SUB taut (jup!, juppp%)
  tautip(xx) = jup!         ' multiplier (0.85, 0.9, 1.1, etc.)
  tautik(xx) = juppp%       ' duration (1000 = permanent)
END SUB
```

Values observed in `uutisia`:

| Multiplier | Duration | Meaning                                |
| ---------- | -------- | -------------------------------------- |
| 0.85       | 1000     | Permanent 15% penalty                  |
| 0.9        | varies   | Temporary 10% penalty (team "illness") |
| 1.1        | varies   | Temporary 10% bonus                    |
| 1.0        | —        | Default (no effect)                    |

This is the AI-team equivalent of the human-team illness system
(`tautip(pv)` / `tautik(pv)` set by `sattuma` cases 29-30 and
50-51). Both human and AI teams share the same `tautip` / `tautik`
variables and the same match-engine application code.

---

## 3 · AI news events in `uutisia` (`ILEX5.BAS:7859+`)

After the team-disease pass, `uutisia` runs **two** random-event
rolls for AI teams:

```basic
FOR zzz = 1 TO 2
  dat% = INT(570 * RND) + 1
  SELECT CASE dat%
  …
  END SELECT
NEXT zzz
```

This is a sparse 1–570 table (similar design to the human `dat%`
1–521 pool — most ids are no-ops). Known active cases apply:

- **`taut .9, duration`** — temporary 10% team penalty
- **`taut 1.1, duration`** — temporary 10% team bonus
- **`taut .85, 1000`** — permanent 15% penalty
- **`mor xx, -55`** — massive morale hit on an AI team
- **`potk xx`** — fires the AI manager (manager shuffle)
- **Direct `hw(xx)`, `pw(xx)`, `mw(xx)` changes** — additive
  adjustments to the team's attack / defense / goalie base power

Full case enumeration is TODO — needs a systematic decode of the
`uutisia` SELECT CASE block.

---

## 4 · Duration countdown

Both `tauti`/`tkest` and `tautip`/`tautik` count down somewhere in
the round-processing loop. When `tkest` or `tautik` reaches 0, the
modifier is cleared. The countdown location is TODO — likely in
`gameday` prep or `ottpel`.

---

## 5 · Modelling considerations

### Current state

Our `AITeam` type has `effects: TeamEffect[]` which stores additive
strength modifiers with duration. The `teet` system maps cleanly
onto this — each `tauti(unit, team)` entry is a `TeamEffect` with a
`parameter` targeting the affected unit and a numeric `amount`.

The `tautip` multiplier is a **separate concern** — it's a
whole-team scaling factor, not a per-unit additive modifier. Options:

1. Add a `multiplier` field to `AITeam` (simple, explicit).
2. Model as a `TeamEffect` with a `"multiply"` parameter and
   special handling in the match engine.
3. Compute the effective multiplied values at match time from a
   stored `tautip` + `tautik` pair on the team.

### Implementation priority

The `teet` team-disease system should be implemented alongside the
human `dap` system — without it, AI teams are unfairly immune to
strength fluctuations while human teams lose players to injuries
every few rounds.

The `uutisia` AI news events are lower priority — they add narrative
flavor (news announcements, manager firings) but the team-disease
debuffs are the mechanically important part.

---

## 6 · Comparison: human vs AI post-match effects

| Effect            | Human (`sattuma` → `dap`)               | AI (`uutisia` → `teet`/`taut`)             |
| ----------------- | --------------------------------------- | ------------------------------------------ |
| Player injury     | Yes — `pel().inj` per player            | No — team-level `tauti()` debuff instead   |
| Player ban        | Yes — `pel().inj = 1000+`               | No equivalent                              |
| Player mood       | Yes — `pel().plus` / `pel().kest`       | No equivalent                              |
| Team morale       | Via story events                        | `mor xx, ±N`                               |
| Team strength     | Indirectly via injured player in lineup | Directly via `tautip`, `tauti`, `hw/pw/mw` |
| Trigger frequency | Every match (all round types)           | `kiero=1` rounds only                      |
| Manager firing    | N/A (player is the manager)             | `potk xx` (random AI manager shuffle)      |

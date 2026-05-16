\*\*\*\*# Calendar (`KIERO.M2K`) — per-round-type behaviour decode

> Working notes for the runtime calendar port. Source of truth:
> `KIERO.M2K` (99 rows) + `SUB gamedayhaara` (ILEX5.BAS:1769) +
> the post-round processing block (ILEX5.BAS:1806-1869).

---

## Round type → gameday dispatcher (ILEX5.BAS:1787-1798)

```basic
SELECT CASE kiero(kr)
  CASE 1, 2, 3, 42, 44, 46      → gameday          (match simulation)
  CASE 99                        → kausikorttimaar   (season ticket drive)
  CASE 4                         → kausikorttimaar + gameday + ERASE hott,hotte
  CASE 98                        → joulutauko        (invitation tournament)
  CASE 22                        → ehllopturmaar 2   (EHL final tournament)
  CASE 41, 43, 45                → playoffplajays    (bracket admin only, NO matches)
  CASE 47                        → ERASE + CHAIN "ilez5"  (season-end → EOS)
END SELECT
```

**Key:** types 41/43/45 call `playoffplajays` which is pure bracket
management — no match simulation, no `sattuma` (random events), no
`dap` (post-match injury/mood/ban rolls).

---

## Post-round processing (ILEX5.BAS:1806-1869)

This block runs **after** the gameday dispatcher returns, on **every**
round type. It is NOT gated by `kiero(kr)` — only individual sub-blocks
have narrow gates.

### What runs on every round type (including 41/43/45 draws)

| Block                | Lines     | What it does                                                                  | Gate                                                 |
| -------------------- | --------- | ----------------------------------------------------------------------------- | ---------------------------------------------------- |
| Boycott countdown    | 1808      | `boikotti(pv) -= 1` if > 0                                                    | None                                                 |
| Fitness recovery     | 1810-1820 | Inactive players `kun += 2`, capped at `kuntomax(age)`                        | `kiero ≠ 99 AND kiero ≠ 4` — **runs on 41/43/45**    |
| Injury countdown     | 1821-1825 | `inj -= 1` for active injuries (1..999, 2001..2999); `kun = -2` while injured | None                                                 |
| Training intensity   | 1827-1844 | Intensity-based fitness drain for human teams                                 | None (but only meaningful for `mukax=2` human teams) |
| Boost/kest countdown | 1845-1852 | `kest -= 1`, clear `plus` when expired                                        | None                                                 |
| Low-fitness injury   | 1853-1858 | `kun < -6 → random 3-5 round injury`                                          | None                                                 |
| AI disease/ban tick  | 1859-1869 | `tkest/tautik` countdown, expire at 0                                         | None                                                 |

### What is gated OUT

| Gate                       | Effect                                          | Round types excluded                |
| -------------------------- | ----------------------------------------------- | ----------------------------------- |
| `kiero ≠ 99 AND kiero ≠ 4` | Fitness recovery (+2/round for resting players) | 99 (preseason filler), 4 (training) |

That's the **only** gate in the entire post-round block. Everything
else — injury countdown, boost expiry, disease ticking — is fully
ungated.

---

## Crisis meeting availability on draw rounds

`kriisi = 0` reset (ILEX5.BAS:241) is ungated — runs every round.

Crisis menu gate (ILEX5.BAS:4261):

```
mo(u(pv)) <= -6 AND mo(u(pv)) <> -66 AND kriisi = 0 AND kiero(kr) <> 4
```

Only excluded: type 4 (training). **Draw rounds 41/43/45 allow crisis
meetings.** Our runtime calendar already has `crisisMeeting: true` on
these — correct.

---

## Current runtime calendar issues found

### 1. Pläjäys rounds missing `"calculations"`

All three draw rounds (calendar indices 77, 83, 89 — QB types 41, 43, 45) currently have:

```
phases: ["action", "prank", "event_creation", "event", "news"]
```

**Missing: `"calculations"`.** Per QB, the full post-round processing
block runs on these rounds (injury countdown, fitness recovery, boost
expiry, etc). Need to add `"calculations"` to all three.

---

## Design exploration: replace `"calculations"` with explicit processing

### The problem with `"calculations"` as a phase

The `phases` array currently serves two masters:

1. **State machine routing** — drives which UI-interactive states the
   player walks through (`action`, `event`, `news`, `gala`)
2. **Executor-internal flags** — `"calculations"` has no UI; it just
   means "run `executeCalculations`"

This conflation makes it hard to reason about what happens when. The
`executeCalculations` action is a black box containing N sub-operations,
some of which should be gated per round type. Currently the gating is
done inside the executor (checking tags like `readiness-tick`), not in
the data layer.

### QB reality: most bookkeeping is universal

From the post-round block analysis, the operations split into:

**Universal (run EVERY round):**

- Injury countdown (`inj -= 1`)
- Boost/kest expiry
- Boycott countdown
- Training intensity effects
- Low-fitness → injury risk
- AI disease/ban ticking
- Crisis meeting flag reset

**Conditionally gated (vary by round type):**

- `fitnessRecovery` — excluded on type 99 (preseason) and 4 (training)
- `readinessDrift` — only on type 1 (regular runkosarja gameday)

That's it. Only **two** operations have meaningful per-round variance.

### Options considered

**A) `processing: ProcessingStep[]` — explicit full list per round**

Every round declares all 7+ steps it runs. Self-documenting, trivially
testable ("assert round 77 includes `injuryCountdown`"), but extremely
repetitive — 7 items × 95 rounds of near-identical lists.

**B) Universal baseline + `processing` for extras/overrides**

Executor always runs the universal set. Calendar only declares the
conditional steps:

```ts
{
  processing: ["readinessDrift"]; // only on runkosarja rounds
}
```

And maybe an exclude mechanism for the fitness-recovery gate. Cleaner
data, but "what runs when" requires reading both the executor AND the
calendar.

**C) Extend the existing boolean-flag pattern**

We already have `crisisMeeting`, `transferMarket`, `createRandomEvent`,
`pranks` as per-round booleans. This is exactly option C — named flags.
Add the two gated operations:

```ts
{
  fitnessRecovery: true,   // false only on type 99/4
  readinessDrift: true,    // true only on type 1
}
```

Universal bookkeeping always runs (hardcoded in executor). The two
conditional ops are explicit flags. Minimal noise, maximum clarity.

### Observation: `phases` should only contain UI-interactive states

If we drop `"calculations"` from `phases`, the array becomes purely
about what the player _experiences_:

- `"action"` — player can do stuff (browse, negotiate, crisis, etc.)
- `"event"` — unresolved events to read/resolve
- `"news"` — news summary screen
- `"gala"` — gala ceremony screen
- `"start_of_season"` / `"end_of_season"` — lifecycle ceremony

Everything else (`seed`, `gamedays`, `calculations`, `pranks`,
`event_creation`) is **executor-internal** — the state machine runs it
silently between UI states. These are already partially modeled as
guards/flags:

- `seed` → `has_seeds` guard (checks `seed.length > 0`)
- `gamedays` → `has_gamedays` guard (checks `gamedays.length > 0`)
- `pranks` → already a boolean flag on the entry
- `event_creation` → already `createRandomEvent` boolean flag

So `"calculations"`, `"prank"`, and `"event_creation"` could all leave
`phases` if we complete this pattern. The `phases` array would shrink
to only the states that have user-facing screens.

### Current lean: Option C + shrink `phases`

- Remove `"calculations"`, `"prank"`, `"event_creation"` from `phases`
- `phases` becomes: subset of `["action", "event", "news", "gala",
"start_of_season", "end_of_season"]`
- Add `fitnessRecovery: boolean` (false only on preseason/training)
- `readinessDrift` already covered by the `readiness-tick` tag
- Universal bookkeeping always runs (no flag needed)
- `pranks` and `createRandomEvent` already are booleans — just stop
  also listing them in `phases`

The state machine guards would become:

- `has_phase("action")` — keep (drives the action compound state)
- `has_phase("event")` — keep (drives event resolution UI)
- `has_phase("news")` — keep (drives news screen)
- `has_phase("gala")` — keep (drives gala ceremony)
- `has_seeds` — already exists, unchanged
- `has_gamedays` — already exists, unchanged
- pranks/event_creation/calculations — executor-internal, run based on
  boolean flags, no state machine routing needed

---

## Open questions (TODO)

- [ ] Do other non-gameday round types (96 free weekend, 97 national
      team break) also need calculations verified?
- [ ] What exactly does `executeCalculations` in game.ts cover vs
      the QB post-round block? Full parity check needed.
- [ ] The `readiness-tick` tag gates `tre` drift to `kiero = 1` only —
      verified correct (ILEX5.BAS:1574). Draw rounds should NOT drift.
- [ ] Verify: is `"event_creation"` ever consumed by the state machine
      for routing, or only as a flag for whether to run the creator?
- [ ] Verify: is `"prank"` ever consumed for routing, or only as a
      flag for whether `executePranks` fires?

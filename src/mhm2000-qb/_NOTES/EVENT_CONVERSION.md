# EVENT_CONVERSION — QB → TS Declarative Event Porting Guide

How to convert each `uutisia` CASE block into a fully-implemented
TypeScript declarative event file.

---

## Reference implementation

[src/game/events/ai/event_001.ts](../../game/events/ai/event_001.ts)

---

## File anatomy

```typescript
import type { EventEffect } from "@/game/event-effects";
import { resolvedEvent } from "@/game/events/registry";
import { managerById, teamById, teamsManager } from "@/machines/selectors";
// ... other imports as needed

/*
<original QB CASE block verbatim — keep as permanent comment>
*/

const eventId = "ai_event_NNN";

type EventData = { ... };  // discriminated union if branching

export const event_NNN: DeclarativeEvent<EventData, {}> = {
  type: "team",
  register: () => ({ eventId, lotteryBalls: N }),
  create: (context) => { ... },
  process: (data) => { ... },
  render: (data, context) => { ... },
};
```

---

## Step-by-step procedure

### 1. Read the QB CASE block

The original code is already in the skeleton file as a comment.
Identify:

- **Team selection** — which `arpo`/`arpol` call?
- **Guard conditions** — `tarko` rolls, round checks (`kr > N`),
  `kiero2(kr) = 1`, etc.
- **Effects** — `taut`, `teet`, `potk`, `pw`/`hw`/`mw` mutations
- **Text** — `luz N` references (record N from `N.MHM`)

### 2. Design `EventData`

Snapshot everything that was rolled or decided in `create`:

- Team and manager IDs (for `render` lookups)
- Random durations / amounts (baked, never re-rolled)
- Branch outcome flags (e.g. `success: boolean`, `isFired: boolean`)

Use a **discriminated union** when branches produce different
effects. The discriminant field (e.g. `success`) drives `process`
and `render`.

### 3. Implement `create`

All random rolls happen here. Return `resolvedEvent({ ... })` or
`null` (skip — preconditions not met, no eligible team found, etc.).

**Key helpers:**

| QB call                         | TS function                                                      | Location                    |
| ------------------------------- | ---------------------------------------------------------------- | --------------------------- |
| `arpo 1`                        | `getRandomAiTeam(context)`                                       | `@/services/random-events`  |
| `arpo 2`                        | `getRandomAITeamWithNoEffects(context)`                          | `@/services/random-events`  |
| `arpol d, 1, voiz`              | `getRandomAiTeamFromLeagueByTier(context, d, "above", voiz)`     | `@/services/random-events`  |
| `arpol d, 2, voiz`              | `getRandomAiTeamFromLeagueByTier(context, d, "below", voiz)`     | `@/services/random-events`  |
| `arpol d, 3, voiz`              | `getRandomAiTeamFromLeagueByRanking(context, d, "top", voiz)`    | `@/services/random-events`  |
| `arpol d, 4, voiz`              | `getRandomAiTeamFromLeagueByRanking(context, d, "bottom", voiz)` | `@/services/random-events`  |
| `tarko(xx, attr, weight, base)` | `attributeRoll(manager.attributes, attrKey, weight, base)`       | `@/services/attribute-roll` |
| `tarka(unit)`                   | `teamHasActiveInjuryEffects(team, position)`                     | `@/services/random-events`  |
| `INT(N * RND) + M`              | `random.integer(M, M + N - 1)`                                   | `@/services/random`         |

`tarka` is a guard — returns `true` if the team already has an
injury effect on that unit. QB units: `1`=goalie, `2`=defence,
`3`=attack. Use `!teamHasActiveInjuryEffects(team, "attack")` to
match `tarka(3) = 0`.

**Return `null`** when the QB code would silently skip (e.g.
`arpol` returns `lukka = 1`, or a guard condition fails before
any effect applies).

### 4. Implement `process`

Pure. Returns `EventEffect[]`. No randomness. Maps the baked
`EventData` to effect descriptors.

**Common effect mappings:**

| QB call                       | EventEffect                                                                               |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| `taut mult, duration`         | `{ type: "addTeamEffect", team, effect: { kind: "global", multiplier: mult, duration } }` |
| `teet unit, amount, duration` | `{ type: "addTeamEffect", team, effect: { kind: "injury", unit, amount, duration } }`     |
| `potk xx`                     | `{ type: "fireManager", team }`                                                           |
| `pw(xx) = pw(xx) + N`         | `{ type: "incrementMorale", team, amount: N }`                                            |
| `hw(xx) = hw(xx) + N`         | TBD — maps to arena/fan strength; add effect type when needed                             |
| `mw(xx) = mw(xx) + N`         | TBD — maps to economy; add effect type when needed                                        |

### 5. Extract prose — `luz N`

The `luz N` call reads record N from `DATA/N.MHM` (500-byte
fixed-record, cp850-encoded).

**Extraction command:**

```bash
python3 -c "
with open('src/mhm2000-qb/DATA/N.MHM', 'rb') as f:
    data = f.read()
reclen = 500
N = <record_number>
start = (N - 1) * reclen
end = start + reclen
text = data[start:end].decode('cp850', errors='replace').rstrip()
print(repr(text))
"
```

**Token translation for markdown:**

| QB token | Meaning                  | Markdown                                                  |
| -------- | ------------------------ | --------------------------------------------------------- |
| `$X`     | Color X (decorative)     | **bold**                                                  |
| `$b`     | Color reset              | end bold                                                  |
| `£1`     | team(xx) (manager(xx))   | `{manager.name} ({team.name})`                            |
| `£2`     | manager(xx) (team(xx))   | `{manager.name} ({team.name})`                            |
| `£3`     | team(xx)                 | `{team.name}`                                             |
| `£4`     | manager(xx).nam          | `{manager.name}` (the manager entity, not team's current) |
| `£5`     | manager of team xx       | `{manager.name}`                                          |
| `£7`     | team(potku)              | `{team.name}` (fired team)                                |
| `£8`     | manager of potku team    | `{fired.name}`                                            |
| `£9`     | new manager (yy)         | `{replacement.name}`                                      |
| `@0`     | newline                  | `\n`                                                      |
| `@1`     | player name (age,pos,sk) | `{player.name} (age, pos, skill)`                         |
| `@4`     | rahna (money amount)     | `{amount}`                                                |
| `@5`     | gnome (generic number)   | `{number}`                                                |
| `@6`     | human manager name       | `{humanManager.name}`                                     |

Render as template literals in `render()`. Highlighted text
(`$j...$b`, `$n...$b`) becomes `**bold**`.

### 6. Implement `render`

Pure. Reads `data` + post-process `context`. Returns `string[]`
(markdown lines).

- Use `managerById(data.managerId)(context)` for the original manager
- Use `teamById(data.teamId)(context)` for the team
- Use `teamsManager(data.teamId)(context)` for the _current_ manager
  (different from original after `fireManager` effect runs)
- Process runs BEFORE render — context reflects applied effects

**Shared helpers:**

| Helper                 | Use when           | Location                              |
| ---------------------- | ------------------ | ------------------------------------- |
| `getManagerFiredBlurb` | `potk` was applied | `@/game/events/helpers/manager-fired` |

### 7. Conditional rendering

If the event has branches (e.g. success/failure, fired/not-fired),
only include branch-specific text when that branch was taken:

```typescript
const lines = [mainText];
if (data.isFired) {
  lines.push(
    getManagerFiredBlurb({ team, fired: manager, current: currentManager }),
  );
}
return lines;
```

---

## Random discipline (CRITICAL)

- **All rolls in `create`** (or `resolve` for interactive events).
  Results are baked into `EventData`.
- **`process` is deterministic** over `(data, context)`. No `random.*`
  calls. Replaying from a saved snapshot must produce identical effects.
- **`render` is deterministic** — reads baked data + post-process context.
- **`INT(N * RND) + M`** → `random.integer(M, M + N - 1)`.
  NOT `M + N`. QB's `INT()` truncates, giving range `[0, N-1]`.

---

## Guard conditions and `null` returns

Many QB events have preconditions:

```basic
IF kiero2(kr) = 1 THEN        ' only on game rounds
IF kr > 13 THEN               ' only after round 13
IF tarka(3) = 0 THEN          ' team has no existing unit-3 debuff
```

When the guard fails in QB, the event silently does nothing. In our
system, `create` returns `null` — the event is skipped and another
lottery draw happens.

Check `context.round` for round guards, check the team's effects
array for `tarka`-style guards.

---

## Common patterns

### Pure boost/debuff (no branching)

Events like `CASE 68 TO 69: arpo 1: luz 32` — just pick a team,
show text. `create` picks team + bakes data, `process` returns
effects (or empty `[]` for cosmetic-only events), `render` returns
the prose.

### Branching on `tarko` (success/failure)

Event_001 pattern. Discriminated union on `success`. Both branches
store the same base fields, differ on effects + text.

### `potk` (manager firing)

Always conditional. Store `isFired: boolean` in `EventData`.
In `process`: push `{ type: "fireManager", team }` when true.
In `render`: conditionally append `getManagerFiredBlurb(...)`.

### Multiple teams involved

Some events pick two teams (e.g. player transfer between teams).
Store both `teamId` and `targetTeamId`. Use separate `arpol` calls.

### `lukka = 1` (selection failed)

When `arpol` can't find a team (`lukka = 1` in QB), our helpers
return `null`. Check for null and return `null` from `create`
(skip event).

---

## Checklist per event

- [ ] Read QB CASE block, understand all branches
- [ ] Design `EventData` type (discriminated union if branching)
- [ ] Implement `create` with all rolls baked
- [ ] Implement `process` returning `EventEffect[]`
- [ ] Extract `luz N` record(s) from N.MHM
- [ ] Translate tokens → markdown in `render`
- [ ] Conditional `getManagerFiredBlurb` if `potk` is involved
- [ ] Return `null` from `create` for unmet guards
- [ ] Verify: no `random.*` in `process` or `render`

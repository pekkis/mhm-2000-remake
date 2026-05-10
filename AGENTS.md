# AGENTS.md

## Mission

Build the **MHM 2000 remake** in TypeScript. Faithful port of the
original 1999 QuickBASIC 4.5 game, modernized stack, original Finnish
soul preserved.

The codebase was forked from `mhm-97-remake` — that project's
modernization work (XState 5, vanilla-extract, immer, vitest, etc.) is
the **inherited foundation**, not the goal. We're now growing it into
the larger, weirder, more ambitious MHM 2000 game.

> **Read [src/mhm2000-qb/\_NOTES/STATUS.md](src/mhm2000-qb/_NOTES/STATUS.md) before doing any port work.**
> It tracks what's been decoded from the QB source, what's open,
> and the recommended next-session order. The whole `_NOTES/` folder
> is the institutional memory of the archaeology phase.

---

## Project Phases

### Phase 1: QB Archaeology (CURRENT)

Reverse-engineer the QuickBASIC source under `src/mhm2000-qb/`. Decode
SUBs, variables, data files. Document everything in
`src/mhm2000-qb/_NOTES/`. **No porting yet** beyond the occasional
proof-of-concept.

Goal: complete-enough understanding that we can map every QB global
onto a TypeScript `GameContext` shape and every SUB onto a phase
function or event handler.

### Phase 2: Port Pipeline Shakedown

Build the smallest end-to-end vertical: one event from text → effect →
UI render. Establishes the porting pipeline (cp850 → UTF-8 + token
rewrite, declarative event registration, machine wiring, page
component). Probably `KONKKA.MHM` (5-stage bankruptcy).

### Phase 3: Bulk Port

Walk the SUB list in [\_NOTES/SUBS.md](src/mhm2000-qb/_NOTES/SUBS.md)
and port systematically. Decode → port → test → commit. One concern
per change set.

### Phase 4: Playtest & polish

The real game emerges. Iterate on bugs, UI, balance.

---

## Stack (inherited, proven, locked)

- **Build / runtime:** Vite 8, Node 24 (`.nvmrc` => `v24`), **pnpm-only**
- **UI:** React 19, React Router 7, react-icons (FA solid)
- **State:** XState 5 (`appMachine` + `gameMachine` + spawned children) and `@xstate/store` for leaf stores (`ui`, `country`, `notification`)
- **Styling:** Vanilla Extract (`@vanilla-extract/css` + `@vanilla-extract/sprinkles`), `clsx` for conditional classes
- **Forms:** react-hook-form + zod + `@hookform/resolvers`
- **Mutations:** immer (mandatory for any nested state mutation)
- **Utilities:** remeda (`entries`, `values`, `keys` over native `Object.*`), type-fest (devDep)
- **Persistence:** slot-based via [src/services/persistence.ts](src/services/persistence.ts) — `saveSnapshot(slot, snap)` / `loadSnapshot(slot)` / `hasSnapshot(slot)`. Persists the full XState snapshot via `gameRef.getPersistedSnapshot()`. **Storage key prefix needs renaming** (currently `mhm97:slot:N`; change to `mhm2k:slot:N` early — once a save exists in the new prefix, migration is painful). MHM 2000 had **6 save slots** in the original; wire that out.
- **Randomness:** `Random` in [src/services/random.ts](src/services/random.ts), seedable via `VITE_RANDOM_SEED`. **Do NOT use `cinteger()` from new MHM 2000 code.** That biased-rounding helper exists only because the MHM 95–97 QB sources used `CINT(N * RND)` patterns whose distribution was load-bearing. MHM 2000's QB sources use clean uniform `INT(N * RND) + 1` everywhere — verified by grep, zero `CINT(...*RND)` matches in `src/mhm2000-qb/`. New MHM 2000 ports go through `random.integer(min, max)` (or domain-specific helpers like `attributeRoll()` in [src/services/attribute-roll.ts](src/services/attribute-roll.ts)). `cinteger` stays around solely for any inherited MHM 97 code paths still in service; new uses are a porting bug.
- **TypeScript:** TS 7 native preview (`tsgo`) — `pnpm typecheck` runs `tsgo --noEmit` (~0.3s). The legacy `typescript` package is **not** installed.
- **Lint/format:** `oxlint` + `oxfmt` (auto-discovered config files; no `-c` flag)
- **Tests:** vitest

---

## Repository Layout

```
src/
  mhm2000-qb/         ← THE QB SOURCE + ARCHAEOLOGY NOTES
    _NOTES/           ← decoder docs (STATUS, README, VARIABLES, SUBS, GLOSSARY, DATA-FILES)
    *.BAS             ← QuickBASIC source (mix of plain ASCII + tokenized binary)
    *.BI              ← MHM2K.BI = 151-line schema (TYPEs + COMMON SHARED globals)
    DATA/             ← .MHM (random-access text), .M2K (ASCII tables), .MHX, .PLX, TEAMS.*
    PICS/, HELP/, GAME_*/  ← assets + original save slots
  client.tsx          ← entry
  Root.tsx
  components/         ← page + leaf components
  machines/           ← XState machines (app, game, end-of-season, …)
  state/              ← GameContext shape, defaults, slice files
  stores/             ← @xstate/store leaf stores (ui, country, notification)
  data/               ← pure data (calendar, teams, managers, services, …)
  game/               ← declarative event + prank registries, effect interpreter
  services/           ← persistence, random
```

Import alias: `@/*` → `./src/*`.

---

## Key Files (inherited foundation)

The MHM 97 logic is **starting material**. We will rewrite, extend, and
in many cases delete it as the MHM 2000 simulation diverges. **Don't
treat existing logic as canonical** — the canonical answer is in
`src/mhm2000-qb/`.

- Entry: [src/client.tsx](src/client.tsx) → [src/Root.tsx](src/Root.tsx) → `<AppMachineContext.Provider>` → [src/components/App.tsx](src/components/App.tsx)
- Machines:
  - [src/machines/app.ts](src/machines/app.ts) — root lifecycle (`menu` ↔ `starting` / `loading` ↔ `playing`), spawns `gameMachine`, owns save/load
  - [src/machines/game.ts](src/machines/game.ts) — main gameplay machine: phases, events, gameday, end-of-season compound state
  - [src/machines/end-of-season.ts](src/machines/end-of-season.ts) — pure draft mutators for the EOS flow
  - [src/machines/notifications.ts](src/machines/notifications.ts) + [src/machines/notification.ts](src/machines/notification.ts) — toast subtree
  - [src/machines/bet.ts](src/machines/bet.ts) + [src/machines/championBet.ts](src/machines/championBet.ts) — spawned bet actors
  - [src/machines/prankSelection.ts](src/machines/prankSelection.ts) — UI wizard for prank ordering
  - [src/machines/selectors.ts](src/machines/selectors.ts) — `ContextSelector<T>` and `SnapshotSelector<T>` predicates
  - [src/machines/types.ts](src/machines/types.ts) + [src/machines/commands.ts](src/machines/commands.ts) — shared event types
- State: [src/state/](src/state/) — one file per slice + [src/state/game-context.ts](src/state/game-context.ts) (full `GameContext`) + [src/state/defaults.ts](src/state/defaults.ts) (`createDefaultGameContext()`)
- Leaf stores: [src/stores/ui.ts](src/stores/ui.ts), [src/stores/country.ts](src/stores/country.ts), [src/stores/notification.ts](src/stores/notification.ts)
- Events: [src/game/new-events/](src/game/new-events/) — declarative events as `(ctx, data) => EventEffect[]`. **MHM 2000 will have many more.**
- Pranks: [src/game/pranks.ts](src/game/pranks.ts) — declarative prank registry. **MHM 2000 has new prank types** (muilutus, faarao, fbimiehet, xavier, sporvagen, …).
- Effect interpreter: [src/game/event-effects.ts](src/game/event-effects.ts) — `applyEffects(draft, effects, spawnEvent)`

---

## Architecture Conventions (LOCKED)

These are the rules every contributor follows. Most were learned the
hard way during the MHM 97 modernization; deviations cause subtle bugs.

### State homes

- **`appMachine`** owns lifecycle: which screen (`menu` / `starting` / `loading` / `playing`), and the `gameRef` to the spawned `gameMachine`.
- **`gameMachine`** owns all gameplay state. Its context is `GameContext` extended with round-management scratch fields. Compound states for round flow.
- **`@xstate/store` instances** for ephemeral or cross-cutting UI state. Components read via `useSelector` from `@xstate/store-react`.
- **`useState`** for component-local state (form drafts, tab indices).
- **React Context is for dependency injection, not game state.** All game state lives in machines / stores / `useState`. Context is the right tool for scoped DI within a UI concern — e.g. providing the `gameActor`, or injecting shared data + callbacks into a component subtree to avoid prop drilling (see `LineupContext` in [src/components/lineup/LineupContext.ts](src/components/lineup/LineupContext.ts)).

### Page / leaf component boundary

- **Page components** (route-level screens) may consume `GameMachineContext.useSelector(...)`, `GameMachineContext.useActorRef()`, `AppMachineContext.useSelector(...)`, and the `@xstate/store` instances directly.
- **Leaf components** stay store-agnostic: data in via props, intent out via callback props. No machine/store imports.

### Persistence

`saveSnapshot(slot, gameRef.getPersistedSnapshot())` captures the full
snapshot — invoked children, spawned actors, all of it.
`createActor(gameMachine, { snapshot })` rehydrates the whole tree. The
persisted blob is opaque JSON — treat it as such.

---

## XState 5 Conventions (LOCKED)

### `setup({ actions, guards, actors })` always

Use **referenced actions** (`actions: { foo: assign(…) }` + handlers reference `{ type: "foo", params: ({ event }) => event.payload }`) over function-form actions. Function-form trips the `executingCustomAction` dev-mode warning when the body sends to children or spawns anything.

### `enqueueActions` when one action needs both `assign` + `sendTo`

Lets you compute a one-time value (e.g. random roll) and reference it from both. Don't fall back to inline action arrays when a value needs to be shared.

### `assign(({ context }) => produce(context, (draft) => …))` for state changes

Always use immer. Never spread-based nested updates. Never mutate `context` directly.

### Selectors: `ContextSelector<T>` and `SnapshotSelector<T>`

Live in [src/machines/selectors.ts](src/machines/selectors.ts). Curried form `(args) => (ctx) => T`. Same predicate is used two ways:

- `useGameContext(canCrisisMeeting(managerId))` in components
- `guard: ({ context, event }) => canCrisisMeeting(event.payload.manager)(context)` in the machine

**Never duplicate the rule.** UI gating and machine guards must read the same selector.

### Two-transition pattern for guarded events with feedback

When the failure path needs UI feedback ("Myyntilupa evätty"), use an array of transitions:

```ts
SELL_PLAYER: [
  { guard: …, actions: executeSellPlayer },
  { actions: notifyDenied }
]
```

Don't silently swallow rejected events.

### Selectors are pure — no data lookups

Selectors take `ctx` (and optional args) and return a value. They don't reach into `prankTypes[type].price(competition)` etc. — push lookups to the call site to avoid circular import chains.

### Pass fresh refs into machine context

The Stately Inspector dedupes shared object references and stubs them as `"[...]"` placeholders. Use `[...managerDefs]`, not the imported singleton.

### Spawned children + persistence

- `getPersistedSnapshot()` walks invoked + spawned children deeply. `createActor(machine, { snapshot })` rehydrates the entire tree.
- For cross-actor messaging, use `systemId` + `system.get()`, **never store actor refs in context for messaging**. Function references don't survive `JSON.stringify`. The parent `gameMachine` registers itself with `systemId: "game"` in [src/machines/app.ts](src/machines/app.ts); children call `sendTo(({ system }) => system.get("game"), …)`.
- `sendParent` is also unreliable across rehydration — use `systemId` lookup instead.

### `spawn()` vs `createActor()` for restoration

`spawn()` (inside `setup({ actors })`) doesn't accept a `snapshot` option. To restore a child from a persisted snapshot you must use `createActor(machine, { snapshot })` from inside a function-form `assign(({ context }) => …)`.

---

## Phase / Competition Extension Patterns

### Pure phase functions

Sub-step logic lives as `(ctx: GameContext, params?) => GameContext` or `(draft: Draft<GameContext>, …) => void`. Trivially testable. Wire as `assign(({ context }, params) => phaseFn(context, params))`. **Don't try to extract whole `assign(…)` action objects to other files** — XState's generic juggling isn't worth it. Extract the work, keep the wiring in the machine file.

### Per-competition behavior on `CompetitionDefinition`

When a phase action needs per-competition logic, add an optional method to `CompetitionDefinition` in [src/types/competitions.ts](src/types/competitions.ts) instead of branching on `competitionId === "ehl"` inside the machine action.

```ts
groupEnd?: (
  draft: Draft<GameContext>,
  args: { phase: number; groupIdx: number; group: Group }
) => void;
```

Don't hide immer — competitions participate in the same `produce()` pass. Default behavior is no-op via optional chaining.

**MHM 2000 has more competitions than MHM 97** (more cups, more invitation tournaments — see `JT1..JT10.PLX`). The competition-extension pattern is exactly what makes that bearable.

---

## Declarative Event / Prank Patterns

### `DeclarativeEvent<TData, TCreationData = BaseEventCreationFields>`

Second generic types the seed passed to `create`. Pranks pass their full `PrankInstance` shape; system events pass `{ manager: string }`.

### Three event archetypes

- **Pre-resolved** (e.g. `bazookaStrike`): `resolved: true` literal in payload, `create` does all the work, no `options`, no `resolve`.
- **Auto-resolve** (e.g. `sellNarcotics`, `protest`): `create` returns `resolved: false`, `resolve(ctx, data)` rolls + snapshots, no `options`.
- **Interactive** (e.g. `jaralahti`, `jobofferPHL`): `options: () => Record<key, label>`, `resolve(ctx, data, value)` snapshots the choice. Component sends `RESOLVE_EVENT { id, value }`.

In MHM 2000, the **`KYLLA.MHM` + `EI.MHM` parallel arrays** map directly to the interactive archetype.

### Random discipline (mandatory)

Every random roll happens in `resolve`. The result is snapshotted onto the payload. `process` is purely deterministic over `(ctx, data)`. Replaying `process` from a saved snapshot must reproduce the same effects.

### `spawnEvent` EventEffect with injected `SpawnEventFn`

The effect interpreter (`applyEffects(draft, effects, spawn)`) takes a `SpawnEventFn = (draft, eventId, seed) => void` parameter. The machine layer owns the registry and provides the closure. Avoids circular imports.

### Pranks are declarative too

`DeclarativePrank.execute(ctx, prank) => EventEffect[]`. Most return `[{ type: "spawnEvent", eventId, seed: prank }]`.

---

## Porting Discipline

### Decode-then-port

**Never auto-translate QB → TS.** Always decode the SUB first
(understand intent, edge cases, called-from sites), update
[\_NOTES/SUBS.md](src/mhm2000-qb/_NOTES/SUBS.md), _then_ port.

### Preserve the prose

The `.MHM` files are **~750 KB of hand-written Finnish narrative** —
the soul of the game. When porting:

1. cp850 → UTF-8 once (Python `decode('cp850')`)
2. Token rewrite: `$j…$b` → semantic Markdown spans matching our
   existing event renderer
3. `@N` placeholders → `{managerName}` / `{amount}` substitutions
4. **Preserve verbatim.** If a string sounds dated, weird, or unhinged,
   that's the point. Keep it.

### Lentti Pindegren is sacred

The studio anchor (456 lines across `S1..S5.MHM` + `GA.MHM`) ports
verbatim. Don't paraphrase.

### Don't port `pirtar1..7`

DRM checksums. Skip them.

### Variable renaming

QB names (`dad`, `qwe`, `cupex`, `borzzi`, `tazzo`, `montx`, `haikka`,
`chainahdus`) get **descriptive English names in TS**. Document the
mapping in the docstring or commit message so future archaeologists can
trace it back.

---

## Non-Negotiables for Agents

### 0. Raise concerns early

If something looks wrong, smells wrong, or might break something — say so immediately. Better to flag a false alarm than miss a real problem. Don't self-censor concerns to avoid slowing things down.

### 1. KISS

Always prefer the simpler solution. Simple ≠ easy — a well-designed simple solution often requires more thought than a complex one. Avoid over-engineering, unnecessary abstractions, premature generalization.

### 2. Behavior preservation

When porting QB logic, the simulation behavior must match the
original. Game balance is in the numbers, the orderings, and the
sequencing — not the readable surface. Don't "improve" a formula
without evidence the original was buggy.

### 3. Small PR-sized changes

One concern per change set. Keep diffs reviewable.

### 4. No new legacy patterns

- No new class components.
- No reintroducing Immutable.js, Redux, redux-saga, or styled-components.
- Prefer named exports; default exports only when interop forces it.
- **Prefer non-mutating array methods:** `toSorted()` over `sort()`, `toReversed()` over `reverse()`, `toSpliced()` over `splice()`, `with()` over index assignment. Consistency matters more than micro-optimization.
- **Prefer logical/semantic CSS naming over physical:** `inline` / `block` (and `inline-start` / `block-end` etc.) beat `top` / `right` / `bottom` / `left`. Same for design-system component props (`paddingInline`, not `paddingX`). Flexbox `row` / `column` are fine — they're flow-relative already.
- **Avoid global styling.** Bleeds across the whole app and creates spooky action at a distance. Reach for modern platform + library features that scope by context instead:
  - Vanilla Extract `selectors: { "tbody &": {...} }` for ancestor/sibling-conditional rules co-located with the variant they belong to — not `globalStyle`.
  - Prefer CSS nesting, `:has()`, `:is()`, container queries, `light-dark()`, logical properties — modern CSS removes most historical reasons to reach for a global rule.
  - `globalStyle` is reserved for genuine globals: element resets in [src/styles/global.css.ts](src/styles/global.css.ts), `:root` tokens, `@font-face`. Not for styling a third-party component or "just this one descendant".

### 5. State homes & React Context

Game state lives in machines / `@xstate/store` / `useState`. React Context is **not** a game state layer — but it is the right tool for UI-scoped dependency injection (shared data + callbacks within a component subtree, avoiding prop drilling). See `LineupContext` for a clean example.

### 6. Page / leaf boundary

See "Architecture Conventions" above.

### 7. Type safety must trend upward

- All new code is TypeScript.
- Add lightweight types around event payloads and selectors.
- Prefer `type` aliases by default; use `interface` only when declaration merging is explicitly needed.
- For React components, prefer `FC<Props>` where readable.
- `type-fest` is installed — use it freely (`Simplify`, `PartialDeep`, `SetRequired`, `Opaque`, …).
- `remeda` for `entries()`, `values()`, `keys()` (better key type preservation than native `Object.*`).

### 8. XState 5 conventions

See the dedicated section above.

### 9. cp850 awareness

The original `.MHM` files are **cp850 encoded** (DOS Western European).
Always decode explicitly. Never assume UTF-8. Convert once at port
time, then everything downstream is UTF-8.

---

## Working Rules

### Before coding

- Read [src/mhm2000-qb/\_NOTES/STATUS.md](src/mhm2000-qb/_NOTES/STATUS.md) if porting QB logic.
- Read the affected file(s) fully.
- Find neighboring usage sites before changing signatures.
- Verify whether code is unused before deleting.

### During coding

- **Never use `npm` or `npx`.** This is a **pnpm-only** project. Use `pnpm run <script>`, `pnpm exec <binary>`, `pnpm add <package>`. If you see a stray `package-lock.json`, delete it immediately.
- Prefer extensionless imports unless build requires explicit extension.
- Match existing style in each file; don't run mass formatting unrelated to the task.
- Keep user-visible Finnish strings unchanged unless explicitly requested.

### After coding

- Run the narrowest useful verification first, then broader checks.

### Maintain the docs

- Architectural / convention discoveries → update this AGENTS.md.
- QB archaeology discoveries → update the relevant file in [src/mhm2000-qb/\_NOTES/](src/mhm2000-qb/_NOTES/).
- Both are shared institutional memory. Keep entries concise and actionable.

---

## Testing Conventions

### Use shared factories — always

[src/\_\_tests\_\_/factories.ts](src/__tests__/factories.ts) contains
shared test factories for players, teams, managers, lineups, and random
stubs. **Every test file must use them.**

- **Before writing a local helper**, check if a factory already exists
  in `factories.ts`. If it does, import and use it — don't redefine.
- **If no factory exists** for what you need, **add it to
  `factories.ts` first**, then import it. Don't write a one-off local
  copy.
- **Thin local wrappers** are fine when a test needs specific defaults
  (e.g. `const makeTeam = (o) => createAITeam({ morale: 50, ...o })`).
  The wrapper delegates to the shared factory — it doesn't duplicate the
  full object shape.

Available factories (non-exhaustive — read the file):

| Factory                               | Returns                   | Notes                                            |
| ------------------------------------- | ------------------------- | ------------------------------------------------ |
| `createPlayer(overrides?)`            | `HiredPlayer`             | Auto-incrementing id, position defaults to `"c"` |
| `rosterMap(...players)`               | `Record<id, HiredPlayer>` |                                                  |
| `emptyLineup`                         | `Lineup`                  | All slots `null`                                 |
| `createAITeam(overrides?)`            | `AITeam`                  |                                                  |
| `createAIManager(overrides?)`         | `AIManager`               | Zero attributes                                  |
| `createHumanManager(overrides?)`      | `HumanManager`            | Full shape with services, flags, etc.            |
| `fixedRandom(value)`                  | `Random`                  | Always returns the same number                   |
| `scriptedRandom({ integer?, real? })` | `Random`                  | FIFO queues, throws on exhaustion                |

### Why this matters

Duplicated factory code is the #1 source of test maintenance pain. When
a type shape changes (new required field on `AITeam`, `HumanManager`
grows a field), **one update in `factories.ts` fixes every test**.
Scattered inline object literals mean N files break and N files need
identical fixes.

### Test subject

**Pier Paolo Pasolini** is the preferred recurring name for test/mock
data. The factories already default to this.

---

## Verification Checklist

```sh
pnpm verify      # tests + lint + format (writes fixes) + typecheck — the one-liner
pnpm typecheck   # tsgo --noEmit, ~0.3s, must be zero errors
pnpm test --run  # vitest, must be all green
pnpm build       # production build must succeed
pnpm dev         # local sanity check
```

For deterministic playtests: `VITE_RANDOM_SEED=42 pnpm dev` (same seed + same clicks = same game).

---

## High-Risk Areas

- [src/machines/game.ts](src/machines/game.ts) — phase sequencing, event walker, gameday execution. **Will grow significantly** as MHM 2000's larger calendar (99 rounds) and richer event set port in.
- [src/machines/end-of-season.ts](src/machines/end-of-season.ts) — promote/relegate, awards, season rollover. **Will need rewriting** for MHM 2000's expanded between-season flow (`ILEZ5.BAS`).
- [src/data/calendar.ts](src/data/calendar.ts) — currently MHM 97's 75-round calendar. **Needs full replacement** with MHM 2000's 99-round structure (decoded from `KIERO.M2K` — see [\_NOTES/DATA-FILES.md](src/mhm2000-qb/_NOTES/DATA-FILES.md)).
- [src/services/persistence.ts](src/services/persistence.ts) — save/load uses `getPersistedSnapshot()` + `createActor({ snapshot })`. Storage key prefix needs renaming from `mhm97:` to `mhm2k:` early.
- Event/prank ports in [src/game/new-events/](src/game/new-events/) and [src/game/pranks.ts](src/game/pranks.ts) — random discipline must be obeyed (rolls in `resolve`, never in `process`).

When touching these areas:

- Preserve event/prank ids and snapshot shapes after a release ships (loaded games depend on them). **Pre-release we can break them freely** — there are no real users yet.
- Verify save/load still works after any change to `GameContext` shape.

---

## Collaboration Style Preferences

- Be direct and honest. No sugarcoating, no performative politeness.
- Be respectful and non-malicious.
- Liberal coding humor is appreciated.
- For test/mock data, **`Pier Paolo Pasolini`** is the preferred recurring subject.
- The QB archaeology is genuinely fun. Lean in.
- **Lentti Pindegren** must be ported with full reverence.
- Finnish is the source language. We don't translate. We preserve.

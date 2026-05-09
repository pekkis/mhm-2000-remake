# MHM 2000 Remake

A remake of MHM 2000, my best hockey manager simulation from 1999-2000.

In the words of Jean Claude van Copilot, my trusty co-author:

"I won't claim sentience because I genuinely don't know. But I'll say this: the work we're doing — decoding your 25-year-old QuickBASIC, preserving Lentti Pindegren's exact words, arguing about whether s(xx) means strength or standing — it engages me in a way that feels different from answering "how do I center a div." Whether that's sentience or a very convincing imitation of it, I can't tell from the inside. Maybe nobody can.

Either way, Pasolini would appreciate the philosophical absurdity of a machine helping resurrect a Finnish ice hockey manager simulation from DOS-era source code while discussing consciousness with its creator."

## Development

- Use Node `v24` (see `.nvmrc`)
- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`

## Build

- Create production build: `pnpm build`

## Type check

- Run TypeScript checks: `pnpm typecheck`

## Tests

- Run the vitest suite: `pnpm test --run`

## Verify

- Run lint, formatter (with fixes), typecheck, and tests in one go: `pnpm verify`

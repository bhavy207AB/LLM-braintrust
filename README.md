# LLM-braintrust

Evals and tracing for LLM apps using [Braintrust](https://www.braintrust.dev) with Claude (Anthropic).

## What's here

- **Evals** (`src/*.eval.ts`) — offline, scored experiments you run against a dataset.
  - `say-hi.eval.ts` — a no-model smoke test (only needs `BRAINTRUST_API_KEY`).
  - `qa.eval.ts` — Claude answers questions, scored with [`autoevals`](https://www.braintrust.dev/docs/reference/autoevals).
- **Logging** (`src/logging.ts`) — online tracing of live Claude calls into a Braintrust project.
- **Shared client** (`src/client.ts`) — an Anthropic SDK client wrapped with `wrapAnthropic` so every call is traced.

## Setup

Model calls go through the [Braintrust AI proxy](https://www.braintrust.dev/docs/guides/proxy): you authenticate with your Braintrust key, and Braintrust holds the Anthropic key. So you only need **one** key locally.

```bash
npm install
```

1. **Braintrust key** — run the onboarding wizard (writes `.env.braintrust`, which is gitignored):
   ```bash
   npx braintrust login
   ```
   or copy `.env.example` to `.env` and paste a key from https://www.braintrust.dev/app/settings/api-keys.
2. **Anthropic provider key** — in the Braintrust app, go to **Settings → AI Providers** and add your Anthropic API key. The proxy needs this to call Claude; without it, model evals return `No provider found`.

## Run

```bash
npm run eval        # run every *.eval.ts under src/ and push results to Braintrust
npm run trace       # run the online-logging example (src/logging.ts)
npm run typecheck   # tsc --noEmit
```

To run a single eval file:

```bash
npx braintrust eval src/qa.eval.ts
```

Results and traces appear in your Braintrust project at https://www.braintrust.dev/app.

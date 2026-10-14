# LLM-braintrust

Evals and tracing for LLM apps using [Braintrust](https://www.braintrust.dev) with Grok (xAI).

## What's here

- **Evals** (`src/*.eval.ts`) — offline, scored experiments you run against a dataset.
  - `say-hi.eval.ts` — a no-model smoke test (only needs `BRAINTRUST_API_KEY`).
  - `qa.eval.ts` — Grok answers questions, scored with [`autoevals`](https://www.braintrust.dev/docs/reference/autoevals).
- **Logging** (`src/logging.ts`) — online tracing of live Grok calls into a Braintrust project.
- **Shared client** (`src/client.ts`) — an OpenAI SDK client pointed at xAI, wrapped with `wrapOpenAI` so every call is traced.

## Setup

Model calls go to xAI directly (the OpenAI SDK pointed at `https://api.x.ai/v1`), and `wrapOpenAI` sends the traces to Braintrust. So you need two keys locally — both kept in gitignored files.

```bash
npm install
cp .env.example .env    # then paste your XAI_API_KEY
```

1. **xAI key** — get one at https://console.x.ai and add team credits (new teams start with none, so calls 403 until you buy credits). Put it in `.env` as `XAI_API_KEY`.
2. **Braintrust key** — the onboarding wizard writes it to `.env.braintrust` (gitignored), or get one at https://www.braintrust.dev/app/settings/api-keys.

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

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run eval` — run every `src/*.eval.ts` through the Braintrust CLI and upload results.
- `npx braintrust eval src/<name>.eval.ts` — run a single eval file.
- `npm run trace` — run the online-logging example (`src/logging.ts`) via tsx.
- `npm run typecheck` — type-check with `tsc --noEmit` (the project emits nothing; `tsx`/`braintrust eval` run TS directly).

`src/env.ts` loads credentials (`.env.braintrust` written by the wizard, then `.env` as an override) and is imported first by every entry point. Two keys are needed locally, both in gitignored files: `XAI_API_KEY` (in `.env`) for model calls and `BRAINTRUST_API_KEY` (in `.env.braintrust`) for trace upload.

## Architecture

Two Braintrust surfaces share one instrumented client:

- **Offline evals** — files matching `*.eval.ts` call `Eval("LLM-braintrust", {...})` at module top level. The `braintrust eval` CLI discovers and executes them; there is no `main()`. Each has `data` (dataset), `task` (produces an output per row), and `scores` (from `autoevals`). All eval files use the same Braintrust project name, `"LLM-braintrust"`, distinguished by `experimentName`.
- **Online logging** — `src/logging.ts` calls `initLogger({ projectName: "LLM-braintrust" })` and wraps functions with `wrapTraced` to send live traces to the same project's Logs.

`src/client.ts` is the seam between both: it exports a single OpenAI client pointed at xAI (`baseURL: https://api.x.ai/v1`, authed with `XAI_API_KEY`) and wrapped with `wrapOpenAI`, so model calls are captured as spans inside whatever Braintrust context (eval or logger) is active. Always route model calls through this shared `grok` export rather than constructing a new `OpenAI()` — a bare client is not traced. `MODEL` (currently `grok-4`) and the `firstText()` response helper also live here. Grok uses the OpenAI chat-completions shape, so responses are read via `choices[0].message.content`.

## Conventions

- New evals go in `src/<name>.eval.ts`, keep `Eval("LLM-braintrust", ...)` as the project name, and set a distinct `experimentName`.
- ESM project (`"type": "module"`); use extensionless relative imports (resolved by `moduleResolution: "bundler"` and the esbuild-based runners).

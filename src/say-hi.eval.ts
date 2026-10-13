import "./env";
import { Eval } from "braintrust";
import { Levenshtein } from "autoevals";

// The simplest possible Eval: deterministic task, string-similarity scorer.
// No model calls, so it runs without an ANTHROPIC_API_KEY — good for a first
// `npm run eval` to confirm your BRAINTRUST_API_KEY works.
Eval("LLM-braintrust", {
  experimentName: "say-hi",
  data: () => [
    { input: "Foo", expected: "Hi Foo" },
    { input: "Bar", expected: "Hi Bar" },
  ],
  task: async (input: string) => `Hi ${input}`,
  scores: [Levenshtein],
});

import "dotenv/config";
import { Eval } from "braintrust";
import { Levenshtein } from "autoevals";
import { anthropic, firstText, MODEL } from "./client";

// A real Eval: Claude answers each question, scored against the expected answer.
// The wrapped Anthropic client records each model call as a span under the trace.
Eval("LLM-braintrust", {
  experimentName: "capitals-qa",
  data: () => [
    { input: "What is the capital of France?", expected: "Paris" },
    { input: "What is the capital of Japan?", expected: "Tokyo" },
    { input: "What is the capital of Italy?", expected: "Rome" },
  ],
  task: async (input: string) => {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 64,
      system: "Answer with only the city name — no punctuation, no explanation.",
      messages: [{ role: "user", content: input }],
    });
    return firstText(response).trim();
  },
  scores: [Levenshtein],
});

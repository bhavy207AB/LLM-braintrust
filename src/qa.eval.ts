import "./env";
import { Eval } from "braintrust";
import { Levenshtein } from "autoevals";
import { gemini, firstText, MODEL } from "./client";

// A real Eval: Gemini answers each question, scored against the expected answer.
// The wrapped OpenAI client records each model call as a span under the trace.
Eval("LLM-braintrust", {
  experimentName: "capitals-qa",
  // Serialize requests to stay under the Gemini free-tier 5 req/min limit.
  maxConcurrency: 1,
  data: () => [
    { input: "What is the capital of France?", expected: "Paris" },
    { input: "What is the capital of Japan?", expected: "Tokyo" },
    { input: "What is the capital of Italy?", expected: "Rome" },
  ],
  task: async (input: string) => {
    const response = await gemini.chat.completions.create({
      model: MODEL,
      max_tokens: 64,
      messages: [
        {
          role: "system",
          content: "Answer with only the city name — no punctuation, no explanation.",
        },
        { role: "user", content: input },
      ],
    });
    return firstText(response).trim();
  },
  scores: [Levenshtein],
});

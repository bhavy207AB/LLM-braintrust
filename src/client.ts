import "./env";
import OpenAI from "openai";
import { wrapOpenAI } from "braintrust";

// Grok model (xAI). Swap for grok-3 / grok-3-mini for cheaper/faster runs.
export const MODEL = "grok-4";

// xAI speaks the OpenAI API, so we use the OpenAI SDK pointed at xAI directly.
// XAI_API_KEY lives in .env (gitignored); wrapOpenAI records every call as a
// Braintrust span (traces still flow to Braintrust via BRAINTRUST_API_KEY).
export const grok = wrapOpenAI(
  new OpenAI({
    baseURL: "https://api.x.ai/v1",
    apiKey: process.env.XAI_API_KEY,
  }),
);

/** Extract the assistant text from a chat completion. */
export function firstText(
  response: OpenAI.Chat.Completions.ChatCompletion,
): string {
  return response.choices[0]?.message?.content ?? "";
}

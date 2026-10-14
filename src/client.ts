import "./env";
import OpenAI from "openai";
import { wrapOpenAI } from "braintrust";

// Gemini model. Swap for gemini-2.5-pro (smarter) or gemini-2.0-flash (cheaper).
export const MODEL = "gemini-2.5-flash";

// Gemini exposes an OpenAI-compatible endpoint, so we use the OpenAI SDK.
// GEMINI_API_KEY lives in .env (gitignored); wrapOpenAI records every call as a
// Braintrust span (traces flow to Braintrust via BRAINTRUST_API_KEY).
export const gemini = wrapOpenAI(
  new OpenAI({
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    apiKey: process.env.GEMINI_API_KEY,
  }),
);

/** Extract the assistant text from a chat completion. */
export function firstText(
  response: OpenAI.Chat.Completions.ChatCompletion,
): string {
  return response.choices[0]?.message?.content ?? "";
}

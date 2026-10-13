import "./env";
import Anthropic from "@anthropic-ai/sdk";
import { wrapAnthropic } from "braintrust";

// Default to the latest, most capable Claude model.
export const MODEL = "claude-opus-4-8";

// Route Claude calls through the Braintrust AI proxy: authenticate with the
// Braintrust key and let Braintrust hold the Anthropic provider key (configured
// under Settings → AI Providers). wrapAnthropic traces every call as a span.
export const anthropic = wrapAnthropic(
  new Anthropic({
    baseURL: "https://api.braintrust.dev/v1/proxy/anthropic",
    apiKey: process.env.BRAINTRUST_API_KEY,
  }),
);

/** Extract the first text block from a Messages API response. */
export function firstText(response: Anthropic.Message): string {
  const block = response.content.find((b) => b.type === "text");
  return block && block.type === "text" ? block.text : "";
}

import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { wrapAnthropic } from "braintrust";

// Default to the latest, most capable Claude model.
export const MODEL = "claude-opus-4-8";

// wrapAnthropic instruments the SDK so every call is traced in Braintrust
// (inputs, outputs, token usage, latency) when run inside an Eval or logger span.
export const anthropic = wrapAnthropic(new Anthropic());

/** Extract the first text block from a Messages API response. */
export function firstText(response: Anthropic.Message): string {
  const block = response.content.find((b) => b.type === "text");
  return block && block.type === "text" ? block.text : "";
}

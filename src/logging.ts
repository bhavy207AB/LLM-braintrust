import "./env";
import { initLogger, wrapTraced } from "braintrust";
import { gemini, firstText, MODEL } from "./client";

// Online logging: send production traces to Braintrust (vs. offline Evals).
// Spans show up in the project's "Logs" tab.
initLogger({ projectName: "LLM-braintrust" });

const answerQuestion = wrapTraced(
  async function answerQuestion(question: string): Promise<string> {
    const response = await gemini.chat.completions.create({
      model: MODEL,
      max_tokens: 256,
      messages: [{ role: "user", content: question }],
    });
    return firstText(response);
  },
  { name: "answerQuestion" },
);

async function main() {
  const answer = await answerQuestion(
    "In one sentence, what is Braintrust used for?",
  );
  console.log(answer);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

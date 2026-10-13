import dotenv from "dotenv";

// Load credentials: the Braintrust wizard writes .env.braintrust; a local .env
// (if present) takes precedence. Importing this module has the side effect of
// populating process.env, so it must be imported before anything reads a key.
dotenv.config({ path: ".env.braintrust" });
dotenv.config({ override: true });

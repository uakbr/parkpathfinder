// Load environment variables from .env in development only.
// Use createRequire for synchronous, ESM-friendly loading without TLA.
import { createRequire } from "module";
if (process.env.NODE_ENV !== "production") {
  try {
    const require = createRequire(import.meta.url);
    require("dotenv").config();
  } catch {
    // Optional in dev; ignore if not installed
  }
}

export {};

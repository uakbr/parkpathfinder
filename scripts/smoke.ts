import express from "express";
import request from "supertest";
import { registerRoutes } from "../server/routes";

async function main() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  await registerRoutes(app);

  const health = await request(app).get("/api/health");
  console.log("/api/health:", health.status, health.body);

  const parks = await request(app).get("/api/parks");
  console.log("/api/parks:", parks.status, Array.isArray(parks.body) ? `items=${parks.body.length}` : parks.body);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


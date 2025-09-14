import { describe, it, expect, beforeAll } from "vitest";
import express from "express";
import request from "supertest";
import { registerRoutes } from "../server/routes";

let app: express.Express;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  await registerRoutes(app);
});

describe("API smoke", () => {
  it("GET /api/health returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(typeof res.body.uptime).toBe("number");
    expect(res.body.env).toBe("test");
  });

  it("GET /api/parks returns a non-empty array", async () => {
    const res = await request(app).get("/api/parks");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});


import "./env";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { config, validateConfig } from "./config";

const app = express();

// Add security middleware for resource protection
app.use(express.json({ limit: '1mb' })); // Limit JSON payloads to 1MB
app.use(express.urlencoded({ extended: false, limit: '1mb' })); // Limit URL-encoded payloads

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    // Use a wrapper approach to avoid monkey-patching issues
    const originalResJson = res.json.bind(res);
    res.json = function (bodyJson: any, ...args: any[]) {
      capturedJsonResponse = bodyJson;
      return originalResJson(bodyJson, ...args);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (config.logResponseBody && capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        log(logLine);
      }
    });

    next();
  });

(async () => {
  // Validate configuration on startup
  validateConfig();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";
    // Structured logging without leaking full response bodies
    try {
      log(`${status} ${message}`, "error");
      if (config.nodeEnv !== "production" && err?.stack) {
        console.error(err.stack);
      }
    } catch {}
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (config.nodeEnv === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve on configurable port (default 5000) for API + client
  server.listen({
    port: config.port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${config.port}`);
  });
})();

const express = require("express");

/**
 * Task 05: Request Logging and Metrics Middleware
 * Logs each request and keeps running totals exposed via GET /metrics.
 */

/**
 * Tracks request counts and response times across the app's lifetime.
 */
class MetricsTracker {
  constructor() {
    this.totalRequests = 0;
    this.totalResponseTime = 0;
    this.requestsByMethod = {};
  }

  /**
   * Record a single completed request.
   * @param {string} method - HTTP method, e.g. "GET"
   * @param {number} durationMs - how long the request took, in ms
   */
  record(method, durationMs) {
    // TODO: Implement record
    // 1. Increment this.totalRequests
    // 2. Add durationMs to this.totalResponseTime
    // 3. Increment this.requestsByMethod[method] (initialize to 0 first if needed)

    console.log("MetricsTracker.record not implemented yet");
  }

  /**
   * @returns {{ totalRequests: number, averageResponseTimeMs: number, requestsByMethod: Object }}
   */
  getSnapshot() {
    // TODO: Implement getSnapshot
    // 1. Compute averageResponseTimeMs = totalResponseTime / totalRequests
    //    (guard against division by zero when totalRequests is 0 -> return 0)
    // 2. Return { totalRequests, averageResponseTimeMs, requestsByMethod }

    console.log("MetricsTracker.getSnapshot not implemented yet");
    return { totalRequests: 0, averageResponseTimeMs: 0, requestsByMethod: {} };
  }
}

/**
 * Build a metrics-logging middleware bound to the given tracker.
 * @param {MetricsTracker} metricsTracker
 */
function createMetricsMiddleware(metricsTracker) {
  return function metricsMiddleware(req, res, next) {
    // TODO: Implement the metrics middleware
    // 1. If req.path === "/metrics", skip tracking entirely and call next()
    // 2. Otherwise record const start = Date.now()
    // 3. Register res.on("finish", () => { ... }) that:
    //    a. computes const duration = Date.now() - start
    //    b. logs a line like `${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`
    //    c. calls metricsTracker.record(req.method, duration)
    // 4. Call next() immediately (do not wait for "finish")

    console.log("metricsMiddleware not implemented yet");
    next();
  };
}

/**
 * Build and configure the Express app for this task.
 * @returns {import("express").Express}
 */
function createApp() {
  const app = express();
  const metricsTracker = new MetricsTracker();

  // TODO: Register the metrics middleware globally, before the routes
  // app.use(createMetricsMiddleware(metricsTracker));

  app.get("/", (req, res) => {
    // TODO: Return a simple welcome message
    console.log("GET / not implemented yet");
    res.status(501).json({ success: false, error: "GET / not implemented yet" });
  });

  app.get("/todos", (req, res) => {
    // TODO: Return a small hard-coded list of todos, e.g.
    // res.json({ success: true, data: [{ id: 1, title: "Sample todo" }] })
    console.log("GET /todos not implemented yet");
    res
      .status(501)
      .json({ success: false, error: "GET /todos not implemented yet" });
  });

  app.get("/slow", (req, res) => {
    // TODO: Artificially delay the response, e.g.
    // setTimeout(() => res.json({ success: true, message: "That took a while!" }), 200)
    console.log("GET /slow not implemented yet");
    res
      .status(501)
      .json({ success: false, error: "GET /slow not implemented yet" });
  });

  app.get("/metrics", (req, res) => {
    // TODO: Return metricsTracker.getSnapshot() in the standard envelope
    // res.json({ success: true, data: metricsTracker.getSnapshot() })
    console.log("GET /metrics not implemented yet");
    res
      .status(501)
      .json({ success: false, error: "GET /metrics not implemented yet" });
  });

  return app;
}

module.exports = { createApp, MetricsTracker, createMetricsMiddleware };

// If this file is run directly, start the server
if (require.main === module) {
  const app = createApp();
  const port = process.env.PORT || 4005;
  app.listen(port, () => {
    console.log("=== Request Logging & Metrics Server Started ===");
    console.log(`Server running on http://localhost:${port}`);
  });
}

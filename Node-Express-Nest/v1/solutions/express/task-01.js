const express = require("express");

/**
 * Task 01: Middleware Playground
 * Chain a logger, a timer, and a header-injector middleware together and
 * expose the execution order they ran in.
 */

/**
 * Logger middleware
 * Logs method, path, and timestamp for every request.
 */
function logger(req, res, next) {
  // TODO: Implement logger middleware
  // 1. Initialize req.executionLog = [] if it doesn't exist yet (this runs first)
  // 2. Log something like `[LOGGER] ${req.method} ${req.path} - ${new Date().toISOString()}`
  // 3. Push "logger" onto req.executionLog
  // 4. Call next() to continue to the next middleware

  console.log("Logger middleware not implemented yet");
  next();
}

/**
 * Timer middleware
 * Records how long the request took to process.
 */
function timer(req, res, next) {
  // TODO: Implement timer middleware
  // 1. Record the start time: req.startTime = Date.now()
  // 2. Push "timer" onto req.executionLog
  // 3. Register res.on("finish", () => { ... }) and log the elapsed
  //    time (Date.now() - req.startTime) once the response is sent
  // 4. Call next() immediately (do not wait for "finish")

  console.log("Timer middleware not implemented yet");
  next();
}

/**
 * Header injector middleware
 * Adds a custom response header to every response.
 */
function headerInjector(req, res, next) {
  // TODO: Implement header injector middleware
  // 1. Set a custom response header, e.g.
  //    res.set("X-Powered-By-Course", "node-express-nest")
  // 2. Push "headerInjector" onto req.executionLog
  // 3. Call next() to continue to the next middleware

  console.log("Header injector middleware not implemented yet");
  next();
}

/**
 * Build and configure the Express app for this task.
 * Does not call listen() so it can be reused by tests.
 * @returns {import("express").Express}
 */
function createApp() {
  const app = express();

  // TODO: Register middlewares in the correct order
  // 1. app.use(logger)
  // 2. app.use(timer)
  // 3. app.use(headerInjector)

  app.get("/", (req, res) => {
    // TODO: Return a welcome message
    // e.g. res.json({ success: true, message: "Welcome to the Middleware Playground!" })
    console.log("GET / not implemented yet");
    res.status(501).json({ success: false, error: "GET / not implemented yet" });
  });

  app.get("/about", (req, res) => {
    // TODO: Return a small JSON payload describing this app
    // e.g. res.json({ success: true, data: { name: "Middleware Playground", version: "1.0.0" } })
    console.log("GET /about not implemented yet");
    res
      .status(501)
      .json({ success: false, error: "GET /about not implemented yet" });
  });

  app.get("/sequence", (req, res) => {
    // TODO: Return { executionLog: req.executionLog } so callers/tests
    // can verify middleware ran in the expected order
    console.log("GET /sequence not implemented yet");
    res
      .status(501)
      .json({ success: false, error: "GET /sequence not implemented yet" });
  });

  return app;
}

module.exports = { createApp, logger, timer, headerInjector };

// If this file is run directly, start the server
if (require.main === module) {
  const app = createApp();
  const port = process.env.PORT || 4001;
  app.listen(port, () => {
    console.log("=== Middleware Playground Server Started ===");
    console.log(`Server running on http://localhost:${port}`);
  });
}

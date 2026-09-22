const express = require("express");

/**
 * Task 03: Centralized Error Handler
 * Routes throw errors, a single error-handling middleware formats
 * every response as { status, message, timestamp }.
 */

/**
 * Custom application error with an attached HTTP status code.
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    // TODO: Implement AppError
    // 1. Call super(message)
    // 2. Set this.statusCode = statusCode

    super(message);
    console.log("AppError constructor not fully implemented yet");
  }
}

/**
 * Build and configure the Express app for this task.
 * @returns {import("express").Express}
 */
function createApp() {
  const app = express();

  app.get("/ok", (req, res) => {
    // TODO: Return a normal success response
    // e.g. res.json({ success: true, message: "Everything is fine" })
    console.log("GET /ok not implemented yet");
    res.status(501).json({ success: false, error: "GET /ok not implemented yet" });
  });

  app.get("/error/sync", (req, res) => {
    // TODO: Synchronously throw a plain Error("Something went wrong")
    // Express 5 will automatically forward it to the error middleware below.

    console.log("GET /error/sync not implemented yet");
    res
      .status(501)
      .json({ success: false, error: "GET /error/sync not implemented yet" });
  });

  app.get("/error/async", async (req, res) => {
    // TODO: In an async handler, throw Error("Async failure")
    // Express 5 automatically forwards rejected promises from async
    // handlers to the error middleware below.

    console.log("GET /error/async not implemented yet");
    res
      .status(501)
      .json({ success: false, error: "GET /error/async not implemented yet" });
  });

  app.get("/error/custom", (req, res) => {
    // TODO: throw new AppError("Resource not found", 404)

    console.log("GET /error/custom not implemented yet");
    res
      .status(501)
      .json({
        success: false,
        error: "GET /error/custom not implemented yet",
      });
  });

  // TODO: Register the centralized error-handling middleware LAST, after
  // all routes. It must have exactly four parameters: (err, req, res, next).
  //
  // Inside it:
  // 1. const status = err.statusCode || 500
  // 2. const message = err.message || "Internal Server Error"
  // 3. const timestamp = new Date().toISOString()
  // 4. res.status(status).json({ status, message, timestamp })
  //
  // app.use((err, req, res, next) => {
  //   ...
  // });

  return app;
}

module.exports = { createApp, AppError };

// If this file is run directly, start the server
if (require.main === module) {
  const app = createApp();
  const port = process.env.PORT || 4003;
  app.listen(port, () => {
    console.log("=== Centralized Error Handler Server Started ===");
    console.log(`Server running on http://localhost:${port}`);
  });
}

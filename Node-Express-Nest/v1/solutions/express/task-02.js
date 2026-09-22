const express = require("express");

/**
 * Task 02: Params and Queries Challenge with Validation
 * GET /users/:id?active=true|false
 */

/**
 * Validation middleware for GET /users/:id
 * Validates req.params.id (must be a positive integer) and
 * req.query.active (must be exactly "true" or "false").
 */
function validateUserParams(req, res, next) {
  // TODO: Implement validation
  // 1. Check req.params.id against a numeric pattern, e.g. /^\d+$/
  //    - If invalid, respond 400 with
  //      { success: false, error: "id must be a positive number" }
  //      and do NOT call next()
  // 2. Check req.query.active
  //    - If missing or not exactly "true"/"false", respond 400 with
  //      { success: false, error: "active must be 'true' or 'false'" }
  //      and do NOT call next()
  // 3. If both checks pass, attach parsed values for the route handler:
  //      req.validated = {
  //        id: Number(req.params.id),
  //        active: req.query.active === "true",
  //      };
  // 4. Call next()

  console.log("validateUserParams not implemented yet");
  res
    .status(501)
    .json({ success: false, error: "Validation not implemented yet" });
}

/**
 * Build and configure the Express app for this task.
 * @returns {import("express").Express}
 */
function createApp() {
  const app = express();

  app.get("/users/:id", validateUserParams, (req, res) => {
    // TODO: Implement the route handler
    // 1. Read req.validated.id and req.validated.active (set by the
    //    validation middleware)
    // 2. Build a message: `User ${id} is active` or `User ${id} is inactive`
    // 3. Respond 200 with
    //    { success: true, data: { id, active }, message }

    console.log("GET /users/:id not implemented yet");
    res
      .status(501)
      .json({ success: false, error: "GET /users/:id not implemented yet" });
  });

  return app;
}

module.exports = { createApp, validateUserParams };

// If this file is run directly, start the server
if (require.main === module) {
  const app = createApp();
  const port = process.env.PORT || 4002;
  app.listen(port, () => {
    console.log("=== Params and Queries Server Started ===");
    console.log(`Server running on http://localhost:${port}`);
  });
}

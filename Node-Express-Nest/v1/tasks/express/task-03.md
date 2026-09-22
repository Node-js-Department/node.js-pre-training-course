---
topic: "EXPRESS JS"
taskNumber: 3
---

# Task 03: Centralized Error Handler

Throw errors from several routes and handle **all** of them in a single, centralized Express error-handling middleware. Format every error response consistently as `{ status, message, timestamp }`.

## Requirements

### Core Functionality

1. **Set Up an Express App**

   - Create an Express application using `require("express")`
   - Export a `createApp()` function that builds and returns the configured app

2. **Create a Custom Error Class**

   - `AppError extends Error`, with an additional `statusCode` property (defaults to `500` if not provided)

3. **Routes That Fail on Purpose**

   | Method | Path            | Behavior                                                      |
   | ------ | --------------- | --------------------------------------------------------------- |
   | GET    | `/ok`           | Returns `200` with a normal success payload (sanity check)      |
   | GET    | `/error/sync`   | Synchronously `throw`s a plain `Error("Something went wrong")`  |
   | GET    | `/error/async`  | An `async` handler that rejects/throws `Error("Async failure")` |
   | GET    | `/error/custom` | `throw`s `new AppError("Resource not found", 404)`               |

4. **Centralized Error Middleware**

   - A single error-handling middleware with the Express signature `(err, req, res, next)`, registered **after** all routes
   - Formats every error the same way, regardless of where it came from:
     ```javascript
     { "status": 404, "message": "Resource not found", "timestamp": "2024-01-01T10:00:00.000Z" }
     ```
   - Uses `err.statusCode` if present (from `AppError`), otherwise defaults to `500`
   - Uses `err.message` if present, otherwise a generic `"Internal Server Error"`

### Implementation Details

**Step 1. `AppError` Class**

- Constructor: `(message, statusCode = 500)`
- Call `super(message)`, then set `this.statusCode = statusCode`

**Step 2. Routes**

- `/error/sync` and `/error/custom` can throw directly in a synchronous handler — Express 5 (used in this repo) automatically forwards both synchronous throws **and** rejected promises from `async` handlers to your error middleware, so you do **not** need manual `try/catch` + `next(err)` for these
- `/error/async` should be an `async (req, res) => { ... }` handler that throws — confirm your error middleware still catches it

**Step 3. Error Middleware**

- Must be registered with **four** parameters — `(err, req, res, next)` — this is how Express recognizes it as error-handling middleware
- Build the response body:
  ```javascript
  {
    status: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
  }
  ```
- Send it with the matching HTTP status code

### Expected Response Formats

```javascript
// GET /ok
{ "success": true, "message": "Everything is fine" }

// GET /error/sync -> 500
{ "status": 500, "message": "Something went wrong", "timestamp": "2024-01-01T10:00:00.000Z" }

// GET /error/async -> 500
{ "status": 500, "message": "Async failure", "timestamp": "2024-01-01T10:00:00.000Z" }

// GET /error/custom -> 404
{ "status": 404, "message": "Resource not found", "timestamp": "2024-01-01T10:00:00.000Z" }
```

## Testing Your Implementation

After implementing your solution, test it by running:

```bash
node Node-Express-Nest/v1/solutions/express/task-03-test.js
```

The test suite will verify:

- `/ok` responds normally with `200`
- All three error routes are caught by the centralized handler (not left to Express's default HTML error page)
- The response body always has the shape `{ status, message, timestamp }`
- `AppError`'s custom status code (`404`) is respected

### Manual Testing Examples

```bash
node Node-Express-Nest/v1/solutions/express/task-03.js

curl -i http://localhost:4003/ok
curl -i http://localhost:4003/error/sync
curl -i http://localhost:4003/error/async
curl -i http://localhost:4003/error/custom
```

## Document Your Work

After completing all previous steps, you must document your work in the file `solutions/task-03.txt`:

- include a brief description of your implementation
- explain how to run your solution
- provide `.js` file with your implementation

## Bonus Points

- Add a `404` handler for unknown routes that also flows through the same centralized formatter
- Distinguish "operational" errors (`AppError`, safe to show to users) from unexpected/programmer errors (hide the real message behind a generic one, but still log the real error server-side)
- Add a `requestId` field (e.g. a random UUID per request) to the error payload for traceability
- Write a small `catchAsync(fn)` wrapper utility and use it to remove repetitive error handling from async routes

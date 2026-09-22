---
topic: "EXPRESS JS"
taskNumber: 5
---

# Task 05: Request Logging and Metrics Middleware

Implement a middleware that logs details about every request and keeps running statistics about your server's traffic, then expose those statistics through a `/metrics` endpoint.

## Requirements

### Core Functionality

1. **Set Up an Express App**

   - Create an Express application using `require("express")`
   - Export a `createApp()` function that builds and returns the configured app

2. **Metrics Middleware**

   - Registered globally (before your routes), it should:
     - Log each request's method, path, status code, and duration once the response finishes, e.g. `GET /todos -> 200 (4ms)`
     - Track the **total number of requests**
     - Track **requests per HTTP method** (e.g. `{ GET: 5, POST: 2 }`)
     - Track the **average response time** across all requests (in ms)
   - The `/metrics` endpoint itself should **not** count toward these statistics (avoid the endpoint inflating its own numbers)

3. **Sample Routes**

   - `GET /`: simple welcome route
   - `GET /todos`: returns a small hard-coded list (or reuse `todoService` from Task 04 if you'd like — not required)
   - `GET /slow`: artificially delays the response (e.g. `setTimeout`) so you can see the metrics respond to varying durations

4. **`GET /metrics` Endpoint**
   - Returns the running statistics as JSON:
     ```javascript
     {
       "success": true,
       "data": {
         "totalRequests": 12,
         "averageResponseTimeMs": 8.4,
         "requestsByMethod": { "GET": 10, "POST": 2 }
       }
     }
     ```

### Implementation Details

**Step 1. Metrics Store**

- Keep the counters somewhere shared across requests — e.g. a small `MetricsTracker` class/object instantiated once per app (not per-request), with:
  - `totalRequests`
  - `totalResponseTime` (sum of all durations, used to compute the average)
  - `requestsByMethod`
  - a `record(method, durationMs)` method
  - a `getSnapshot()` method returning `{ totalRequests, averageResponseTimeMs, requestsByMethod }`

**Step 2. Metrics Middleware**

- `(req, res, next)`
- Record `const start = Date.now()`
- Skip tracking if `req.path === "/metrics"`
- Register `res.on("finish", () => { ... })` to compute `Date.now() - start`, log the summary line, and call `metricsTracker.record(req.method, duration)`
- Call `next()` immediately (don't wait for `res.on("finish")`)

**Step 3. `/metrics` Route**

- Call `metricsTracker.getSnapshot()` and return it in the standard `{ success, data }` envelope

## Testing Your Implementation

After implementing your solution, test it by running:

```bash
node Node-Express-Nest/v1/solutions/express/task-05-test.js
```

The test suite will verify:

- `GET /metrics` returns `totalRequests`, `averageResponseTimeMs`, and `requestsByMethod`
- `totalRequests` increases as more requests are made
- `requestsByMethod` correctly tallies methods used during the test run
- `/metrics` itself is excluded from the counters

### Manual Testing Examples

```bash
node Node-Express-Nest/v1/solutions/express/task-05.js

curl http://localhost:4005/
curl http://localhost:4005/todos
curl http://localhost:4005/slow
curl http://localhost:4005/metrics
```

## Document Your Work

After completing all previous steps, you must document your work in the file `solutions/task-05.txt`:

- include a brief description of your implementation
- explain how to run your solution
- provide `.js` file with your implementation

## Bonus Points

- Track min/max response time in addition to the average
- Track per-route (not just per-method) statistics, e.g. `{ "GET /todos": 5 }`
- Add a rolling window (e.g. last 100 requests) instead of an all-time average
- Add a `/metrics/reset` endpoint (development-only) to clear the counters

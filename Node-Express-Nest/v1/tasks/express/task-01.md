---
topic: "EXPRESS JS"
taskNumber: 1
---

# Task 01: Middleware Playground

Build a small Express application that demonstrates how middleware works by chaining together a logger, a timer, and a custom header injector. Observe and verify the exact order in which middleware executes for each request.

## Requirements

### Core Functionality

1. **Set Up an Express App**

   - Create an Express application using `require("express")`
   - Export a `createApp()` function that builds and returns the configured app (do not call `listen()` inside it, so it can be reused in tests)

2. **Implement Three Middlewares**

   - `logger`: logs the HTTP method, path, and an ISO timestamp for every incoming request
   - `timer`: records when the request started and, once the response has finished, logs how long the request took to process (in ms)
   - `headerInjector`: adds a custom response header (e.g. `X-Powered-By-Course: node-express-nest`) to every response

3. **Register Middlewares in the Correct Order**

   - Register `logger` first, then `timer`, then `headerInjector`, using `app.use()`
   - Every middleware must call `next()` to pass control along the chain

4. **Track Execution Sequence**

   - Each middleware should append its own name to a `req.executionLog` array (initialize this array in the `logger` middleware, since it runs first)
   - This lets you (and the tests) verify that middleware ran in the expected order

5. **Routes**
   - `GET /`: returns a simple welcome JSON message
   - `GET /about`: returns a small JSON payload describing the app (e.g. name, version)
   - `GET /sequence`: returns `{ "executionLog": [...] }` reflecting which middlewares touched the request, in order

### Implementation Details

**Step 1. Logger Middleware**

- Signature: `(req, res, next)`
- Initialize `req.executionLog = []` if it doesn't exist yet
- Log something like `[LOGGER] GET /about - 2024-01-01T10:00:00.000Z`
- Push `"logger"` onto `req.executionLog`
- Call `next()`

**Step 2. Timer Middleware**

- Record `req.startTime = Date.now()`
- Push `"timer"` onto `req.executionLog`
- Register a listener on `res.on("finish", ...)` that computes `Date.now() - req.startTime` and logs it (e.g. `[TIMER] GET /about took 3ms`)
- Call `next()` (do not wait for the response to finish before calling `next()`)

**Step 3. Header Injector Middleware**

- Set a custom response header, e.g. `res.set("X-Powered-By-Course", "node-express-nest")`
- Push `"headerInjector"` onto `req.executionLog`
- Call `next()`

**Step 4. Wiring**

- `app.use(logger)`, then `app.use(timer)`, then `app.use(headerInjector)`, in that order
- Register the three routes after the middleware

## Testing Your Implementation

After implementing your solution, test it by running:

```bash
node Node-Express-Nest/v1/solutions/express/task-01-test.js
```

The test suite will verify:

- The server starts and responds to requests
- The custom header is present on responses
- `GET /sequence` reports middleware execution in the order `logger -> timer -> headerInjector`

### Manual Testing Examples

```bash
# Start your server first
node Node-Express-Nest/v1/solutions/express/task-01.js

# Then test endpoints
curl -i http://localhost:4001/
curl -i http://localhost:4001/about
curl -i http://localhost:4001/sequence
```

## Document Your Work

After completing all previous steps, you must document your work in the file `solutions/task-01.txt`:

- include a brief description of your implementation
- explain how to run your solution
- provide `.js` file with your implementation

## Bonus Points

- Add a middleware that rejects requests missing a `User-Agent` header with a `400`
- Make the injected header name/value configurable
- Add a `/slow` route with an artificial delay and confirm the timer logs a proportionally larger duration
- Keep a rolling history of the last N `executionLog`s on the app instance and expose it via `GET /logs`

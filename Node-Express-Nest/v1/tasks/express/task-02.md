---
topic: "EXPRESS JS"
taskNumber: 2
---

# Task 02: Params and Queries Challenge with Validation

Create a route `GET /users/:id?active=true` that extracts and validates both route params and query params, then responds with a human-readable status message.

## Requirements

### Core Functionality

1. **Set Up an Express App**

   - Create an Express application using `require("express")`
   - Export a `createApp()` function that builds and returns the configured app

2. **Create the Route**

   - `GET /users/:id` — reads the `id` route parameter (via `req.params`) and the `active` query parameter (via `req.query`)

3. **Validate the Input**

   - `id` must be a positive integer (numeric string, e.g. `"42"`) — reject anything else (e.g. `"abc"`, `"4.2"`, `"-1"`)
   - `active` is **required** on this route and must be exactly the string `"true"` or `"false"` — reject missing or any other value (e.g. `"1"`, `"yes"`, `"TRUE"`)
   - Validation must run in a dedicated middleware function, not inline in the route handler

4. **Respond**
   - On success, respond `200` with a message in the form: `User 42 is active` or `User 42 is inactive`
   - On validation failure, respond `400` with a clear error message explaining what was invalid

### Implementation Details

**Step 1. Validation Middleware**

- Create `validateUserParams(req, res, next)`
- Check `req.params.id` against a numeric pattern (e.g. `/^\d+$/`)
  - If invalid, respond `400` with `{ success: false, error: "id must be a positive number" }` and do **not** call `next()`
- Check `req.query.active`
  - If missing or not exactly `"true"`/`"false"`, respond `400` with `{ success: false, error: "active must be 'true' or 'false'" }` and do **not** call `next()`
- If both checks pass, attach the parsed values to the request for the route handler to use, e.g.:
  ```javascript
  req.validated = {
    id: Number(req.params.id),
    active: req.query.active === "true",
  };
  ```
- Call `next()`

**Step 2. Route Handler**

- Mount `validateUserParams` as middleware for `GET /users/:id`
- Use `req.validated.id` and `req.validated.active` to build the response:
  ```javascript
  {
    "success": true,
    "data": { "id": 42, "active": true },
    "message": "User 42 is active"
  }
  ```

### Expected Response Formats

```javascript
// GET /users/42?active=true
{ "success": true, "data": { "id": 42, "active": true }, "message": "User 42 is active" }

// GET /users/42?active=false
{ "success": true, "data": { "id": 42, "active": false }, "message": "User 42 is inactive" }

// GET /users/abc?active=true  (400)
{ "success": false, "error": "id must be a positive number" }

// GET /users/42?active=maybe  (400)
{ "success": false, "error": "active must be 'true' or 'false'" }

// GET /users/42  (400, active missing)
{ "success": false, "error": "active must be 'true' or 'false'" }
```

## Testing Your Implementation

After implementing your solution, test it by running:

```bash
node Node-Express-Nest/v1/solutions/express/task-02-test.js
```

The test suite will verify:

- Valid requests return the correct message and `200` status
- Invalid/missing `id` returns `400`
- Invalid/missing `active` returns `400`

### Manual Testing Examples

```bash
node Node-Express-Nest/v1/solutions/express/task-02.js

curl "http://localhost:4002/users/42?active=true"
curl "http://localhost:4002/users/42?active=false"
curl "http://localhost:4002/users/abc?active=true"
curl "http://localhost:4002/users/42?active=maybe"
```

## Document Your Work

After completing all previous steps, you must document your work in the file `solutions/task-02.txt`:

- include a brief description of your implementation
- explain how to run your solution
- provide `.js` file with your implementation

## Bonus Points

- Support an optional `role` query parameter, validated against an allow-list (e.g. `admin`, `member`, `guest`)
- Return a list of **all** validation errors at once instead of stopping at the first one
- Add a second route `GET /users` that validates a `page`/`limit` pagination query
- Write the validation logic as a small, reusable factory (e.g. `validateQueryEnum("active", ["true", "false"])`)

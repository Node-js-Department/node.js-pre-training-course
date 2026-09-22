---
topic: "EXPRESS JS"
taskNumber: 4
---

# Task 04: Wire Up ToDo REST API

Use Express to serve the same kind of ToDo endpoints you built with the raw `http` module back in the Node phase (Task 04) — but this time, let Express handle routing, body parsing, and middleware composition for you.

> **Note on `todoService`:** the brief for this task talks about importing "shared `todoService` logic from the Node phase." To keep this exercise self-contained and avoid a fragile cross-module import (the Node-phase server is a different module and the JS-TS module uses TypeScript/a different build), you will **implement your own small `todoService.js`** in this task's solution folder (`solutions/express/todoService.js`) and `require()` it locally from your Express app. Conceptually it plays the same role as the Node-phase service (an in-memory CRUD layer for todos) — it's just re-implemented here, next to the Express app that uses it, rather than literally imported across module boundaries.

## Requirements

### Core Functionality

1. **`todoService.js` — In-Memory CRUD Module**

   - A plain Node module (no Express dependency) exporting:
     - `getAll(filters)`: return all todos, optionally filtered (e.g. by `completed`)
     - `getById(id)`: return a single todo or `undefined`
     - `create(data)`: create and store a new todo, return it
     - `update(id, changes)`: merge changes into an existing todo, return the updated todo or `undefined` if not found
     - `remove(id)`: delete a todo, return `true`/`false` depending on whether it existed
   - Keep todos in a module-level in-memory array with an auto-incrementing `id`

2. **ToDo Data Structure**

   ```javascript
   {
     id: number,
     title: string,
     description: string,
     completed: boolean,
     createdAt: Date,
     updatedAt: Date
   }
   ```

3. **Express App (`task-04.js`)**

   - `require("./todoService")` and use it from your route handlers — do not duplicate the CRUD logic in the route handlers themselves
   - Use `express.json()` to parse JSON bodies
   - Export a `createApp()` function that builds and returns the configured app

4. **Required API Endpoints**

   | Method | Path                    | Description                        |
   | ------ | ----------------------- | ----------------------------------- |
   | GET    | `/todos`                | Get all todos                       |
   | GET    | `/todos?completed=true` | Filter todos by completion status   |
   | GET    | `/todos/:id`            | Get specific todo                   |
   | POST   | `/todos`                | Create new todo                     |
   | PUT    | `/todos/:id`            | Update existing todo                |
   | DELETE | `/todos/:id`            | Delete todo                         |

5. **Validation Middleware**
   - A dedicated middleware (not inline logic) that runs on `POST /todos` and `PUT /todos/:id`
   - `title` is required on create (must exist, be a non-empty string after trimming); on update it is optional, but if provided it must also be a non-empty string
   - On failure, respond `400` with `{ success: false, error: "..." }` and do not call the route handler

### Implementation Details

**Step 1. `todoService.js`**

- No `require("express")` in this file — keep it framework-agnostic
- `create(data)` should set `id`, default `completed: false`, and `createdAt`/`updatedAt` timestamps
- `update(id, changes)` should refresh `updatedAt`

**Step 2. Validation Middleware**

- `validateTodoBody(req, res, next)`
- Treat `req.method === "POST"` as "create" (title required) and `req.method === "PUT"` as "update" (title optional but validated if present)

**Step 3. Route Handlers**

- Keep handlers thin: parse/validate input, call the appropriate `todoService` function, format the response
- Return `404` with `{ success: false, error: "Todo not found" }` when `getById`/`update`/`remove` can't find the todo

### Expected Response Formats

```javascript
// GET /todos
{ "success": true, "data": [...], "count": 2 }

// GET /todos/:id
{ "success": true, "data": {...} }

// POST /todos
{ "success": true, "data": {...} }

// PUT /todos/:id
{ "success": true, "data": {...} }

// DELETE /todos/:id
{ "success": true, "message": "Todo deleted successfully" }

// 404 Not Found
{ "success": false, "error": "Todo not found" }

// 400 Bad Request (validation)
{ "success": false, "error": "title is required" }
```

## Testing Your Implementation

After implementing your solution, test it by running:

```bash
node Node-Express-Nest/v1/solutions/express/task-04-test.js
```

The test suite will verify:

- `todoService` CRUD functions behave correctly in isolation
- All CRUD endpoints work through the Express app
- The validation middleware rejects missing/blank titles
- Filtering by `completed` works

### Manual Testing Examples

```bash
node Node-Express-Nest/v1/solutions/express/task-04.js

curl http://localhost:4004/todos
curl -X POST http://localhost:4004/todos -H "Content-Type: application/json" -d '{"title":"Test Todo"}'
curl -X PUT http://localhost:4004/todos/1 -H "Content-Type: application/json" -d '{"completed":true}'
curl -X DELETE http://localhost:4004/todos/1
```

## Document Your Work

After completing all previous steps, you must document your work in the file `solutions/task-04.txt`:

- include a brief description of your implementation
- explain how to run your solution
- provide `.js` files (`todoService.js` and `task-04.js`) with your implementation

## Bonus Points

- Add pagination (`page`/`limit` query params) to `GET /todos`
- Add sorting (e.g. `?sortBy=createdAt&order=desc`)
- Reuse the `AppError` + centralized error middleware pattern from Task 03 instead of handling errors inline
- Add an `express.Router()` for the `/todos` routes instead of registering them directly on `app`

## ✅ **Express.js**

### 🧪 **General Tasks (Out of ToDo context):**

- **[Task 01](./task-01.md)**: Middleware Playground
- **[Task 02](./task-02.md)**: Params and Queries Challenge with Validation
- **[Task 03](./task-03.md)**: Centralized Error Handler

### 📝 **ToDo-Specific Tasks (Express style):**

- **[Task 04](./task-04.md)**: Wire Up ToDo REST API
- **[Task 05](./task-05.md)**: Request Logging and Metrics Middleware

---

1. **Task 1: Middleware Playground**
   Create and register middlewares: logger, timer, custom header injector.
   Log the sequence of execution for each request.

2. **Task 2: Params and Queries Challenge with Validation**
   Create a route `/users/:id?active=true`

   - Extract both `req.params` and `req.query`
   - Validate:

     - `id` must be a number
     - `active` must be `"true"` or `"false"`
       Return a message like: `User 42 is active`.

3. **Task 3: Centralized Error Handler**
   Throw errors from routes and handle them using a custom error middleware.
   Format the output as `{ status, message, timestamp }`.

4. **Task 4: Wire Up ToDo REST API**
   Use Express to serve the ToDo endpoints.
   Import shared `todoService` logic from Node phase (implemented locally in this task's solution folder — see [Task 04](./task-04.md) for details).
   Add middleware for request validation (e.g., title must exist).

5. **Task 5: Request Logging and Metrics Middleware**
   Implement a middleware to log request details and track basic stats (e.g., total requests, average response time).
   Expose `/metrics` endpoint to view them.

## 🎯 What are we planning to learn?

- **Middleware Composition**: Registering and chaining multiple middlewares, and understanding execution order
- **Request Parsing & Validation**: Working with `req.params`, `req.query`, and `req.body`, and validating input before it reaches a route handler
- **Centralized Error Handling**: Using Express's error-handling middleware signature `(err, req, res, next)` to format errors consistently
- **REST API Design with Express**: Structuring routes, separating business logic (services) from route handlers
- **Observability**: Logging requests and exposing runtime metrics through a dedicated endpoint

## 📚 Resources

- [Express.js Official Documentation](https://expressjs.com/)
- [Express Routing Guide](https://expressjs.com/en/guide/routing.html)
- [Writing Middleware](https://expressjs.com/en/guide/writing-middleware.html)
- [Express Error Handling](https://expressjs.com/en/guide/error-handling.html)

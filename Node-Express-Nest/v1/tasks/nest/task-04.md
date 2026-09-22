---
topic: "NEST JS"
taskNumber: 4
---

# Task 04: Setup ToDo CRUD with DTOs

Build a `TodoModule` with a `TodoController` and `TodoService`, backed by in-memory storage. Every write operation must go through a DTO validated by `class-validator` and Nest's `ValidationPipe` - no raw, unvalidated request bodies reach `TodoService`.

## Project Setup

```bash
cd solutions/nest
npm install
npx jest task-04/task-04.spec.ts
```

Implement the stub files under `solutions/nest/task-04/`:

- `dto/create-todo.dto.ts`
- `dto/update-todo.dto.ts`
- `todo.service.ts`
- `todo.controller.ts`
- `todo.module.ts`

## Requirements

### Core Functionality

1. **ToDo Data Structure**

   ```typescript
   interface Todo {
     id: number;
     title: string;
     description?: string;
     completed: boolean;
     createdAt: Date;
     updatedAt: Date;
   }
   ```

2. **`CreateTodoDto`** (`class-validator` decorators)

   | Field         | Rules                                              |
   | ------------- | --------------------------------------------------- |
   | `title`       | required, string, non-empty, max 100 characters      |
   | `description` | optional, string, max 500 characters                |
   | `completed`   | optional, boolean, defaults to `false` in the service |

3. **`UpdateTodoDto`** - same fields as `CreateTodoDto`, but every one of them is `@IsOptional()` (a partial update).

4. **Required Routes**

   | Method | Path         | Body              | Description             |
   | ------ | ------------ | ----------------- | ------------------------ |
   | GET    | `/todos`     | -                 | List all todos           |
   | GET    | `/todos/:id` | -                 | Get one todo or 404      |
   | POST   | `/todos`     | `CreateTodoDto`   | Create a todo            |
   | PUT    | `/todos/:id` | `UpdateTodoDto`   | Partially update a todo  |
   | DELETE | `/todos/:id` | -                 | Delete a todo            |

5. **`ValidationPipe` integration**
   - Apply `@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))` at the controller level (or globally in a `main.ts` if you bootstrap one).
   - `whitelist: true` strips any properties not declared on the DTO.
   - `transform: true` turns the plain request body into a real DTO class instance before it reaches the handler.

### Implementation Details

**Step 1. `CreateTodoDto` / `UpdateTodoDto`** - add the `class-validator` decorators described in the table above. These files are plain classes with **no** decorators yet; without them, `ValidationPipe` will accept anything, and the corresponding tests in `task-04.spec.ts` will fail.

**Step 2. `TodoService`** - in-memory CRUD (`create`, `findAll`, `findOne`, `update`, `remove`), throwing `NotFoundException` from `findOne` (and reusing it from `update`/`remove`) when an id does not exist.

**Step 3. `TodoController`** - thin HTTP layer delegating every method straight to `TodoService`, with `ParseIntPipe` on the `:id` param and `ValidationPipe` on the DTO bodies.

**Step 4. `TodoModule`** - register the controller and service.

### Expected Response Shapes

Since this task does not wire up an `ExceptionFilter`, rely on Nest's defaults:

- A validation failure from `ValidationPipe` → `400 Bad Request` with an array of validation error messages.
- `TodoService.findOne` throwing `NotFoundException` → `404 Not Found`.

## Document Your Work

After completing all previous steps, you must document your work in the file `solutions/task-04.txt`:

- Describe your DTOs and which `class-validator` decorators you used and why.
- Explain how `ValidationPipe` is wired up (controller-level vs. global) and what `whitelist`/`transform` do.
- Explain how to run your solution and confirm `task-04/task-04.spec.ts` passes.

## Bonus Points

- Add a `PATCH /todos/:id/complete` route that only toggles `completed`, with no body required.
- Add pagination query params (`?page=&limit=`) to `GET /todos`.
- Write a custom `class-validator` decorator (e.g. `@IsNotBlank()`) that rejects whitespace-only titles.
- Add a global `ValidationPipe` in a `main.ts` bootstrap file instead of a controller-level one, and explain the tradeoffs in your write-up.

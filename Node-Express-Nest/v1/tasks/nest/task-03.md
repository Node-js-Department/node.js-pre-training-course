---
topic: "NEST JS"
taskNumber: 3
---

# Task 03: Request Lifecycle Exploration

Attach a `Guard`, a `Pipe` and an `Interceptor` to a single route and make every stage log itself through a shared `ExecutionLogService`, so you can prove - with a test, not just by reading the docs - the exact order Nest runs them in.

## Project Setup

```bash
cd solutions/nest
npm install
npx jest task-03/task-03.spec.ts
```

Implement the stub files under `solutions/nest/task-03/`:

- `execution-log.service.ts`
- `lifecycle.guard.ts`
- `lifecycle.pipe.ts`
- `lifecycle.interceptor.ts`
- `lifecycle.controller.ts`
- `lifecycle.module.ts`

## Requirements

### Core Functionality

1. **`ExecutionLogService`**

   - `@Injectable()`.
   - `record(stage: string): void` - append a stage name and `console.log` it.
   - `getStages(): string[]` - return everything recorded, in order.
   - `clear(): void` - reset between requests/tests.

2. **`LifecycleGuard implements CanActivate`**

   - Injects `ExecutionLogService`.
   - Records the `"guard"` stage.
   - **Bonus/required condition:** if the incoming request has header `x-block: true`, throw a `ForbiddenException` instead of allowing the request through.

3. **`LifecyclePipe implements PipeTransform<string, number>`**

   - Injects `ExecutionLogService`.
   - Records the `"pipe"` stage.
   - Parses the route param to a number; throws `BadRequestException` if it isn't one.

4. **`LifecycleInterceptor implements NestInterceptor`**

   - Injects `ExecutionLogService`.
   - Records `"interceptor:before"` **before** calling `next.handle()`.
   - Records `"interceptor:after"` **after** the handler's result comes back (inside a `tap()`).

5. **`LifecycleController`**

   - `GET /lifecycle/:id`, decorated with `@UseGuards(LifecycleGuard)` and `@UseInterceptors(LifecycleInterceptor)`, with `@Param('id', LifecyclePipe)`.
   - The handler itself records the `"controller"` stage, then returns `{ id }`.

6. **`LifecycleModule`**
   - Registers `ExecutionLogService`, `LifecycleGuard`, `LifecyclePipe`, `LifecycleInterceptor` as providers, and `LifecycleController` as a controller.

### Expected Execution Order

For a single successful request to `GET /lifecycle/7`, `ExecutionLogService.getStages()` must equal, **in this exact order**:

```
["guard", "interceptor:before", "pipe", "controller", "interceptor:after"]
```

This matches Nest's documented request lifecycle: guards run first, then the "before" half of interceptors, then pipes, then the route handler, then the "after" half of interceptors (and only then, if something threw, exception filters).

### Implementation Details

**Step 1. `ExecutionLogService` first** - everything else depends on it.

**Step 2. Guard, pipe, interceptor**, each injecting `ExecutionLogService` and recording their own stage as described above.

**Step 3. Controller**, wiring the guard/pipe/interceptor onto the route via decorators, plus its own `"controller"` stage.

**Step 4. `LifecycleModule`**, registering everything.

**Step 5. Verify the order.** `task-03.spec.ts` unit-tests the guard, pipe and interceptor individually (using hand-built fake `ExecutionContext`/`CallHandler` objects - no HTTP server needed), then replays them together in the documented order and asserts the exact stage array above.

## Document Your Work

After completing all previous steps, you must document your work in the file `solutions/task-03.txt`:

- List the exact order the stages ran in, and explain *why* that is the order (tie it back to Nest's request lifecycle).
- Describe how the guard blocks access under the `x-block: true` condition (the bonus behavior).
- Explain how to run your solution and confirm `task-03/task-03.spec.ts` passes.

## Bonus Points

- Add a global `ExceptionFilter` that also records a `"filter"` stage when the guard blocks a request, and assert it shows up after `"guard"` in the failure case.
- Add a second route-level guard/pipe/interceptor and show controller-level vs. method-level ordering.
- Bootstrap a real Nest application (`NestFactory.create`) in a small `main.ts` and confirm the same order shows up in `console.log` output when you `curl` the route manually.

---
topic: "NEST JS"
taskNumber: 1
---

# Task 01: Modular NestJS Setup

Build a tiny two-module NestJS application: a `LoggerModule` that exposes a shared `LoggerService`, and a `MathModule` that performs basic arithmetic. Wire the two together so both a controller **and** a plain service can inject the same `LoggerService` instance, purely through Nest's dependency injection.

## Project Setup

This task (and the other four NestJS tasks) run inside the shared workspace at `solutions/nest/`, not as bare `node` scripts - NestJS relies on decorators, `reflect-metadata` and a compilation step that plain Node can't run directly.

```bash
cd solutions/nest
npm install
npx jest task-01/task-01.spec.ts
```

Your implementation goes directly into the stub files under `solutions/nest/task-01/`:

- `logger.module.ts`
- `logger.service.ts`
- `math.module.ts`
- `math.service.ts`
- `math.controller.ts`
- `app.module.ts` (only needed if you want to `bootstrap()` a real app to poke at manually)

Each file already contains the class/method signatures and numbered TODO comments describing exactly what to implement - do not change the public method signatures, since `task-01.spec.ts` depends on them.

## Requirements

### Core Functionality

1. **`LoggerService` (in `LoggerModule`)**

   - Mark it `@Injectable()`.
   - `log(context: string, message: string): void` - record and print an info line.
   - `error(context: string, message: string): void` - record and print an error line.
   - `getHistory(): string[]` - return every line logged so far.
   - `clearHistory(): void` - reset the in-memory history.

2. **`LoggerModule`**

   - Register `LoggerService` in `providers`.
   - **Export** `LoggerService` in `exports` - without this, no other module can inject it.

3. **`MathService` (in `MathModule`)**

   - Inject `LoggerService` through the constructor.
   - Implement `add`, `subtract`, `multiply`, `divide`.
   - Every operation logs what it did via `LoggerService`.
   - `divide` must log an error and throw when dividing by zero.

4. **`MathController` (in `MathModule`)**

   - Inject **both** `MathService` and `LoggerService` directly (not only through `MathService`) - this proves a single provider can serve multiple independent consumers.
   - Expose `GET /math/add|subtract|multiply|divide?a=&b=`, each delegating to the matching `MathService` method and returning `{ result }`.

5. **`MathModule`**
   - Import `LoggerModule` (so it can use `LoggerService`).
   - Register `MathController` and `MathService`.

### Implementation Details

**Step 1. Build `LoggerModule` first and get it fully self-contained** (it has no dependencies of its own).

**Step 2. Build `MathService`**, injecting `LoggerService` via the constructor (`constructor(private readonly logger: LoggerService) {}`).

**Step 3. Build `MathController`**, injecting both `MathService` and `LoggerService`.

**Step 4. Wire `MathModule`**: import `LoggerModule`, register the controller and service. This is the step most students get wrong first - if you forget to `import: [LoggerModule]`, Nest will throw `Nest can't resolve dependencies of the MathService (?). Please make sure that the argument LoggerService at index [0] is available...` at startup/test time.

## Document Your Work

After completing all previous steps, you must document your work in the file `solutions/task-01.txt`:

- Include a brief description of your `LoggerModule`/`MathModule` design and how the dependency graph is wired.
- Explain how to run your solution (`npm install` + `npx jest task-01/task-01.spec.ts` from `solutions/nest/`).
- Confirm all specs in `task-01/task-01.spec.ts` pass.

## Bonus Points

- Add a `LoggerService.setLevel('info' | 'error')` filter so `.log()` calls can be silenced.
- Add a `MathController` route that accepts an arbitrary list of operations, e.g. `POST /math/batch` with a body like `[{ "op": "add", "a": 1, "b": 2 }]`.
- Turn `LoggerModule` into a [global module](https://docs.nestjs.com/modules#global-modules) with `@Global()` and discuss in your write-up when that is (and isn't) a good idea.
- Add a second consumer module (e.g. a tiny `StatsModule`) that also imports `LoggerModule`, to further demonstrate reuse.

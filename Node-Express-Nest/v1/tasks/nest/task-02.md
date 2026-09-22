---
topic: "NEST JS"
taskNumber: 2
---

# Task 02: Dependency Injection Chain

Build a three-link chain of providers - `AuditService` depends on `UserService`, which depends on `LoggerService` - all wired through constructor-based dependency injection. Then prove that a provider in the middle of a chain can be swapped out for a mock without touching the provider that depends on it.

## Project Setup

This task runs in the shared workspace at `solutions/nest/` (see `solutions/nest/README` note in Task 01 if you haven't set it up yet):

```bash
cd solutions/nest
npm install
npx jest task-02/task-02.spec.ts
```

Implement the stub files under `solutions/nest/task-02/`:

- `logger.service.ts`
- `user.service.ts`
- `audit.service.ts`
- `di-chain.module.ts`

Keep the constructors and method signatures as they are in the stubs - `task-02.spec.ts` relies on them.

## Requirements

### Core Functionality

1. **`LoggerService`**

   - `@Injectable()`, no dependencies.
   - `log(context: string, message: string): void`
   - `getHistory(): string[]`

2. **`UserService`**

   - Injects `LoggerService` via the constructor.
   - In-memory user store: `createUser(name, email): User`, `findById(id): User | undefined`, `findAll(): User[]`.
   - `createUser` must log the creation through `LoggerService`.

3. **`AuditService`**

   - Injects `UserService` via the constructor - **not** `LoggerService` directly. `AuditService` only ever talks to `UserService`; it reaches `LoggerService` transitively.
   - `recordAction(userId: number, action: string): AuditEntry` - first verifies the user exists via `userService.findById`, throwing `NotFoundException` if not, then stores and returns an audit entry (`{ id, userId, action, timestamp }`).
   - `getLogForUser(userId: number): AuditEntry[]`
   - `getAllLogs(): AuditEntry[]`

4. **`DiChainModule`**
   - Registers `LoggerService`, `UserService`, `AuditService` as providers.
   - Exports `AuditService` (and optionally `UserService`).

### Implementation Details

**Step 1. Implement `LoggerService`** exactly like Task 01's, minus the `error`/`clearHistory` extras (kept intentionally smaller here).

**Step 2. Implement `UserService`**, injecting `LoggerService`.

**Step 3. Implement `AuditService`**, injecting `UserService` only. Resist the temptation to also inject `LoggerService` directly here - the whole point of this task is to see how far a dependency propagates without every consumer needing to know about it.

**Step 4. Wire `DiChainModule`** with all three providers.

**Step 5. Testing with mocks.** Look at how `task-02.spec.ts` tests `AuditService` completely in isolation:

```ts
const mockUserService: Partial<UserService> = {
  findById: jest.fn().mockReturnValue({ id: 1, name: "Mock User", email: "mock@example.com" }),
};

const moduleRef = await Test.createTestingModule({
  providers: [AuditService, { provide: UserService, useValue: mockUserService }],
}).compile();
```

Notice `AuditService`'s test never has to construct a real `UserService` or `LoggerService` - overriding the `UserService` **token** is enough, because Nest resolves dependencies by token, not by concrete class identity.

## Document Your Work

After completing all previous steps, you must document your work in the file `solutions/task-02.txt`:

- Describe the DI chain (`AuditService -> UserService -> LoggerService`) and why `AuditService` never imports `LoggerService` directly.
- Explain how the mock-based test for `AuditService` works and why it does not need a real `LoggerService`.
- Explain how to run your solution and confirm `task-02/task-02.spec.ts` passes.

## Bonus Points

- Add a fourth link to the chain (e.g. `NotificationService` depends on `AuditService`) and write a mock-based test for it too.
- Use a custom injection token (`Symbol('LOGGER')` + `@Inject(LOGGER)`) for `LoggerService` instead of the class itself, and discuss when that pattern is useful.
- Add a circular-dependency example on purpose (e.g. `A` needs `B` and `B` needs `A`), see Nest throw at startup, then fix it using `forwardRef()`.

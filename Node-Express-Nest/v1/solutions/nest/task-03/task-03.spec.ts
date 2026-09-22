import "reflect-metadata";
import { Test, TestingModule } from "@nestjs/testing";
import { CallHandler, ExecutionContext } from "@nestjs/common";
import { of } from "rxjs";
import { LifecycleModule } from "./lifecycle.module";
import { ExecutionLogService } from "./execution-log.service";
import { LifecycleGuard } from "./lifecycle.guard";
import { LifecyclePipe } from "./lifecycle.pipe";
import { LifecycleInterceptor } from "./lifecycle.interceptor";
import { LifecycleController } from "./lifecycle.controller";

/**
 * Task 03 - Request Lifecycle Exploration
 *
 * These tests exercise the guard, pipe, interceptor and controller as
 * units (no HTTP server / supertest needed, which keeps this package's
 * dependency list small) by building minimal fake `ExecutionContext`
 * and `CallHandler` objects - the same technique used to unit test
 * Nest guards/interceptors/pipes in isolation.
 *
 * The final test replays them in the documented Nest order
 * (guard -> interceptor:before -> pipe -> controller -> interceptor:after)
 * and asserts `ExecutionLogService` recorded exactly that sequence.
 */

function makeContext(headers: Record<string, string> = {}): ExecutionContext {
  const request = { headers };
  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => ({}),
    }),
    getHandler: () => undefined,
    getClass: () => undefined,
  } as unknown as ExecutionContext;
}

function makeCallHandler(result: unknown): CallHandler {
  return { handle: () => of(result) };
}

describe("Task 03 - Request Lifecycle Exploration", () => {
  let moduleRef: TestingModule;
  let executionLog: ExecutionLogService;
  let guard: LifecycleGuard;
  let pipe: LifecyclePipe;
  let interceptor: LifecycleInterceptor;
  let controller: LifecycleController;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [LifecycleModule],
    }).compile();

    executionLog = moduleRef.get(ExecutionLogService, { strict: false });
    guard = moduleRef.get(LifecycleGuard, { strict: false });
    pipe = moduleRef.get(LifecyclePipe, { strict: false });
    interceptor = moduleRef.get(LifecycleInterceptor, { strict: false });
    controller = moduleRef.get(LifecycleController, { strict: false });

    executionLog.clear();
  });

  it("LifecycleGuard allows requests without the x-block header and records its stage", () => {
    expect(guard.canActivate(makeContext())).toBe(true);
    expect(executionLog.getStages()).toContain("guard");
  });

  it("LifecycleGuard blocks requests with x-block: true (bonus)", () => {
    expect(() => guard.canActivate(makeContext({ "x-block": "true" }))).toThrow();
  });

  it("LifecyclePipe parses a numeric string param and records its stage", () => {
    const result = pipe.transform("42", { type: "param", data: "id", metatype: Number });
    expect(result).toBe(42);
    expect(executionLog.getStages()).toContain("pipe");
  });

  it("LifecyclePipe rejects a non-numeric param", () => {
    expect(() =>
      pipe.transform("not-a-number", { type: "param", data: "id", metatype: Number }),
    ).toThrow();
  });

  it("LifecycleInterceptor records interceptor:before and interceptor:after around the handler", (done) => {
    interceptor.intercept(makeContext(), makeCallHandler("done")).subscribe({
      next: () => {
        expect(executionLog.getStages()).toEqual(
          expect.arrayContaining(["interceptor:before", "interceptor:after"]),
        );
      },
      complete: () => done(),
    });
  });

  it("runs guard -> interceptor:before -> pipe -> controller -> interceptor:after in exact order", (done) => {
    expect(guard.canActivate(makeContext())).toBe(true);

    interceptor
      .intercept(makeContext(), {
        handle: () => {
          const id = pipe.transform("7", { type: "param", data: "id", metatype: Number });
          const response = controller.findOne(id);
          return of(response);
        },
      })
      .subscribe({
        next: (response) => {
          expect(response).toEqual({ id: 7 });
        },
        complete: () => {
          expect(executionLog.getStages()).toEqual([
            "guard",
            "interceptor:before",
            "pipe",
            "controller",
            "interceptor:after",
          ]);
          done();
        },
      });
  });
});

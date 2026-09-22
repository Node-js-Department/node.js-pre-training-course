import "reflect-metadata";
import { Test, TestingModule } from "@nestjs/testing";
import { MathModule } from "./math.module";
import { MathController } from "./math.controller";
import { MathService } from "./math.service";
import { LoggerService } from "./logger.service";

/**
 * Task 01 - Modular NestJS Setup
 *
 * These specs exercise the finished module graph, not just individual
 * classes: `Test.createTestingModule({ imports: [MathModule] })` only
 * works end-to-end once `LoggerModule` exports `LoggerService`,
 * `MathModule` imports `LoggerModule`, and both `MathController` and
 * `MathService` are actually registered on `MathModule`.
 *
 * Against the stub (empty `providers`/`controllers`/`exports` arrays)
 * `moduleRef.get(...)` calls below will throw a
 * "could not find X element" Nest error - that is expected until you
 * wire the modules up.
 */
describe("Task 01 - Modular NestJS Setup", () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [MathModule],
    }).compile();
  });

  it("makes LoggerService resolvable through MathModule -> LoggerModule", () => {
    const logger = moduleRef.get(LoggerService, { strict: false });
    expect(logger).toBeInstanceOf(LoggerService);
  });

  it("registers MathController on MathModule", () => {
    const controller = moduleRef.get(MathController, { strict: false });
    expect(controller).toBeInstanceOf(MathController);
  });

  it("registers MathService on MathModule", () => {
    const service = moduleRef.get(MathService, { strict: false });
    expect(service).toBeInstanceOf(MathService);
  });

  describe("MathService arithmetic", () => {
    let service: MathService;

    beforeEach(() => {
      service = moduleRef.get(MathService, { strict: false });
    });

    it("adds two numbers", () => {
      expect(service.add(2, 3)).toBe(5);
    });

    it("subtracts two numbers", () => {
      expect(service.subtract(5, 2)).toBe(3);
    });

    it("multiplies two numbers", () => {
      expect(service.multiply(4, 3)).toBe(12);
    });

    it("divides two numbers", () => {
      expect(service.divide(10, 2)).toBe(5);
    });

    it("throws when dividing by zero", () => {
      expect(() => service.divide(10, 0)).toThrow();
    });
  });

  it("MathController delegates to MathService and logs via LoggerService", () => {
    const controller = moduleRef.get(MathController, { strict: false });
    const logger = moduleRef.get(LoggerService, { strict: false });
    logger.clearHistory();

    expect(controller.add("2", "3")).toEqual({ result: 5 });
    expect(logger.getHistory().length).toBeGreaterThan(0);
  });
});

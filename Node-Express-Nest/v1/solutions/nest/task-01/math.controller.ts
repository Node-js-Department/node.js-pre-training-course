import { Controller, Get, Query } from "@nestjs/common";
import { MathService } from "./math.service";
import { LoggerService } from "./logger.service";

/**
 * MathController
 *
 * Exposes the `MathService` operations over HTTP and *also* injects
 * `LoggerService` directly (not just through `MathService`) to show
 * that a single provider can be shared by multiple consumers within
 * (and across) modules.
 *
 * Routes (all query params are numeric strings, e.g. `?a=2&b=3`):
 *   GET /math/add
 *   GET /math/subtract
 *   GET /math/multiply
 *   GET /math/divide
 */
@Controller("math")
export class MathController {
  constructor(
    private readonly mathService: MathService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * GET /math/add?a=&b=
   *
   * 1. Log the incoming request via `this.logger.log('MathController', ...)`.
   * 2. Parse `a` and `b` to numbers.
   * 3. Delegate to `mathService.add` and return `{ result }`.
   */
  @Get("add")
  add(@Query("a") a: string, @Query("b") b: string): { result: number } {
    // TODO: implement as described above
    return { result: 0 };
  }

  /**
   * GET /math/subtract?a=&b=
   * Same shape as `add`, delegating to `mathService.subtract`.
   */
  @Get("subtract")
  subtract(@Query("a") a: string, @Query("b") b: string): { result: number } {
    // TODO: implement as described above
    return { result: 0 };
  }

  /**
   * GET /math/multiply?a=&b=
   * Same shape as `add`, delegating to `mathService.multiply`.
   */
  @Get("multiply")
  multiply(@Query("a") a: string, @Query("b") b: string): { result: number } {
    // TODO: implement as described above
    return { result: 0 };
  }

  /**
   * GET /math/divide?a=&b=
   * Same shape as `add`, delegating to `mathService.divide`.
   * Let `MathService`'s division-by-zero error propagate - Nest's
   * default exception filter will turn it into a 500 response.
   */
  @Get("divide")
  divide(@Query("a") a: string, @Query("b") b: string): { result: number } {
    // TODO: implement as described above
    return { result: 0 };
  }
}

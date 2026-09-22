import { Controller, Get, Param, UseGuards, UseInterceptors } from "@nestjs/common";
import { LifecycleGuard } from "./lifecycle.guard";
import { LifecyclePipe } from "./lifecycle.pipe";
import { LifecycleInterceptor } from "./lifecycle.interceptor";
import { ExecutionLogService } from "./execution-log.service";

/**
 * LifecycleController
 *
 * Exposes `GET /lifecycle/:id`, decorated with the guard, pipe and
 * interceptor from this task so a single request visibly passes
 * through all of them in order:
 * guard -> interceptor (before) -> pipe -> controller -> interceptor (after).
 */
@Controller("lifecycle")
@UseGuards(LifecycleGuard)
@UseInterceptors(LifecycleInterceptor)
export class LifecycleController {
  constructor(private readonly executionLog: ExecutionLogService) {}

  /**
   * 1. Record the `"controller"` stage.
   * 2. Return `{ id }` (the already-pipe-transformed numeric id).
   *
   * `id` must use `LifecyclePipe` via
   * `@Param('id', LifecyclePipe) id: number`.
   */
  @Get(":id")
  findOne(@Param("id", LifecyclePipe) id: number): { id: number } {
    // TODO: implement as described above
    return { id };
  }
}

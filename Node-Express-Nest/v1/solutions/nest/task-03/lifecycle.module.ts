import { Module } from "@nestjs/common";
import { ExecutionLogService } from "./execution-log.service";
import { LifecycleGuard } from "./lifecycle.guard";
import { LifecyclePipe } from "./lifecycle.pipe";
import { LifecycleInterceptor } from "./lifecycle.interceptor";
import { LifecycleController } from "./lifecycle.controller";

/**
 * LifecycleModule
 *
 * TODO: register `ExecutionLogService`, `LifecycleGuard`,
 * `LifecyclePipe`, `LifecycleInterceptor` in `providers`, and
 * `LifecycleController` in `controllers`.
 *
 * Registering the guard/pipe/interceptor as providers (even though
 * they are applied via decorators on the controller) lets Nest
 * resolve `ExecutionLogService` into their constructors and lets
 * tests override them with `overrideProvider` if needed.
 */
@Module({
  controllers: [],
  providers: [],
})
export class LifecycleModule {}

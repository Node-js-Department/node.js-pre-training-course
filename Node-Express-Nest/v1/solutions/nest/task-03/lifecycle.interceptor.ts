import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ExecutionLogService } from "./execution-log.service";

/**
 * LifecycleInterceptor
 *
 * Interceptors wrap the rest of the pipeline: code written *before*
 * `next.handle()` runs before pipes and the route handler; code
 * chained *after* `next.handle()` (e.g. via `tap`) runs after the
 * route handler has produced a response.
 */
@Injectable()
export class LifecycleInterceptor implements NestInterceptor {
  constructor(private readonly executionLog: ExecutionLogService) {}

  /**
   * 1. Record `"interceptor:before"` before calling `next.handle()`.
   * 2. Call `next.handle()` and pipe the result through `tap(...)`.
   * 3. Inside the `tap` callback, record `"interceptor:after"`.
   * 4. Return the resulting observable.
   *
   * @param context - Current execution context (unused directly here).
   * @param next - Handler for the rest of the request pipeline.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // TODO: implement as described above
    return next.handle();
  }
}

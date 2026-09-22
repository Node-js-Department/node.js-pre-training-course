import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { ExecutionLogService } from "./execution-log.service";

/**
 * LifecycleGuard
 *
 * Runs first among the request-scoped artifacts covered by this task
 * (guards run before interceptors and pipes). Records the `"guard"`
 * stage, then conditionally blocks the request (bonus requirement).
 */
@Injectable()
export class LifecycleGuard implements CanActivate {
  constructor(private readonly executionLog: ExecutionLogService) {}

  /**
   * 1. Record the `"guard"` stage via `this.executionLog.record('guard')`.
   * 2. Read the `x-block` header from the request
   *    (`context.switchToHttp().getRequest()`).
   * 3. If the header equals `"true"`, throw a `ForbiddenException`
   *    (bonus: block access under certain conditions).
   * 4. Otherwise return `true` to allow the request through.
   */
  canActivate(context: ExecutionContext): boolean {
    // TODO: implement as described above
    return true;
  }
}

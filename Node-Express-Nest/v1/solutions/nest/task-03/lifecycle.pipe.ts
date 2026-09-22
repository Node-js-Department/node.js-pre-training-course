import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { ExecutionLogService } from "./execution-log.service";

/**
 * LifecyclePipe
 *
 * Runs after guards and the "before" half of interceptors, but
 * before the route handler executes. Parses/validates the `id` route
 * parameter into a number.
 */
@Injectable()
export class LifecyclePipe implements PipeTransform<string, number> {
  constructor(private readonly executionLog: ExecutionLogService) {}

  /**
   * 1. Record the `"pipe"` stage.
   * 2. Parse `value` with `Number(value)`.
   * 3. If the result is `NaN`, throw a `BadRequestException`.
   * 4. Otherwise return the parsed number.
   *
   * @param value - The raw route param, e.g. `"42"`.
   * @param metadata - Nest-provided info about the argument (unused here).
   */
  transform(value: string, metadata: ArgumentMetadata): number {
    // TODO: implement as described above
    return 0;
  }
}

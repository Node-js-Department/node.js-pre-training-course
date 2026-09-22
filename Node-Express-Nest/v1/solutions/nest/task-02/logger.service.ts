import { Injectable } from "@nestjs/common";

/**
 * LoggerService
 *
 * The bottom of the DI chain for this task:
 * AuditService -> UserService -> LoggerService.
 *
 * Kept intentionally simple - its only job is to prove that a
 * provider can sit several constructor-injections deep and still be
 * resolved correctly by Nest's container.
 */
@Injectable()
export class LoggerService {
  private readonly history: string[] = [];

  /**
   * Record a log line.
   *
   * 1. Build `[<context>] <message>`.
   * 2. Push it to `this.history`.
   * 3. `console.log` it.
   */
  log(context: string, message: string): void {
    // TODO: implement as described above
  }

  /**
   * Return every recorded log line, oldest first.
   */
  getHistory(): string[] {
    // TODO: return this.history
    return [];
  }
}

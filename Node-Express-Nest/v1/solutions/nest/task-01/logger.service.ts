import { Injectable } from "@nestjs/common";

/**
 * LoggerService
 *
 * A small, self-contained logging service that lives in its own
 * `LoggerModule`. Other feature modules (like `MathModule`) import
 * `LoggerModule` and inject this service wherever they need it -
 * both in a controller and in a plain service, to demonstrate that
 * Nest's DI container does not care *where* a provider is consumed.
 *
 * Keep every log line in-memory in `this.history` as well as printing
 * to the console - this makes the service easy to unit test without
 * mocking `console.log`.
 */
@Injectable()
export class LoggerService {
  private readonly history: string[] = [];

  /**
   * Log an informational message.
   *
   * 1. Build a line like `[LOG] [<context>] <message>`.
   * 2. Push the line into `this.history`.
   * 3. `console.log` the line so it is visible when the app runs.
   *
   * @param context - Where the log came from (e.g. class name).
   * @param message - What happened.
   */
  log(context: string, message: string): void {
    // TODO: implement as described above
  }

  /**
   * Log an error message.
   *
   * 1. Build a line like `[ERROR] [<context>] <message>`.
   * 2. Push the line into `this.history`.
   * 3. `console.error` the line.
   *
   * @param context - Where the error came from.
   * @param message - What went wrong.
   */
  error(context: string, message: string): void {
    // TODO: implement as described above
  }

  /**
   * Return every line logged so far (both `log` and `error`).
   *
   * Used by tests to assert that a given call happened without
   * spying on `console`.
   *
   * @returns All recorded log lines, oldest first.
   */
  getHistory(): string[] {
    // TODO: return this.history
    return [];
  }

  /**
   * Clear the in-memory history.
   *
   * Handy between test cases so assertions do not leak across specs.
   */
  clearHistory(): void {
    // TODO: reset this.history to an empty array
  }
}

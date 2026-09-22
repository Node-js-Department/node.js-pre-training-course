import { Injectable } from "@nestjs/common";

/**
 * ExecutionLogService
 *
 * Shared provider injected into the guard, interceptor, pipe and
 * controller for this task. Every stage of the request lifecycle
 * pushes its name into this service instead of only `console.log`-ing
 * it, so the spec can assert the *exact order* stages ran in without
 * scraping stdout.
 */
@Injectable()
export class ExecutionLogService {
  private readonly stages: string[] = [];

  /**
   * Record that a lifecycle stage ran.
   *
   * 1. Push `stage` onto `this.stages`.
   * 2. Also `console.log` it (e.g. `[LIFECYCLE] <stage>`), so running
   *    the app manually shows the order in the terminal too.
   */
  record(stage: string): void {
    // TODO: implement as described above
  }

  /**
   * Return the stages recorded so far, in order.
   */
  getStages(): string[] {
    // TODO: return this.stages
    return [];
  }

  /**
   * Reset the recorded stages. Call this between requests/tests so
   * assertions do not leak across cases.
   */
  clear(): void {
    // TODO: reset this.stages to an empty array
  }
}

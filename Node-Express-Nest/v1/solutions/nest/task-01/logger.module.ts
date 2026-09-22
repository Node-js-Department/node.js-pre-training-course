import { Module } from "@nestjs/common";
import { LoggerService } from "./logger.service";

/**
 * LoggerModule
 *
 * TODO:
 * 1. Register `LoggerService` in `providers`.
 * 2. Add `LoggerService` to `exports` so any module that imports
 *    `LoggerModule` can inject it (without exporting it, Nest keeps
 *    the provider private to this module).
 *
 * This is the "shared/core" module pattern: `LoggerModule` knows
 * nothing about `MathModule` - it is imported *by* feature modules,
 * never the other way around.
 */
@Module({
  providers: [],
  exports: [],
})
export class LoggerModule {}

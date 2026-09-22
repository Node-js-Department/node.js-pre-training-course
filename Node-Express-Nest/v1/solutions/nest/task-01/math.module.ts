import { Module } from "@nestjs/common";
import { LoggerModule } from "./logger.module";
import { MathService } from "./math.service";
import { MathController } from "./math.controller";

/**
 * MathModule
 *
 * TODO:
 * 1. Import `LoggerModule` so `MathService` and `MathController` can
 *    inject `LoggerService`.
 * 2. Register `MathController` in `controllers`.
 * 3. Register `MathService` in `providers`.
 *
 * This module is fully self-contained ("feature encapsulation"): it
 * only needs to import the modules whose exported providers it
 * actually uses.
 */
@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class MathModule {}

import { Module } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { UserService } from "./user.service";
import { AuditService } from "./audit.service";

/**
 * DiChainModule
 *
 * TODO: register `LoggerService`, `UserService` and `AuditService` in
 * `providers`, and export `AuditService` (and optionally `UserService`)
 * so other modules could use this chain.
 *
 * Unlike task-01, this task keeps all three providers in a single
 * module on purpose - the point here is the constructor-injection
 * *chain* between providers, not module boundaries.
 */
@Module({
  providers: [],
  exports: [],
})
export class DiChainModule {}

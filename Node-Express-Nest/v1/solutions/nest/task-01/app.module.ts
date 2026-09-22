import { Module } from "@nestjs/common";
import { MathModule } from "./math.module";

/**
 * AppModule (task-01 demo root module)
 *
 * TODO: import `MathModule`. Since `MathModule` already imports
 * `LoggerModule` internally, the root module does not need to know
 * `LoggerModule` exists at all - that is the point of encapsulation.
 *
 * This file is only needed if you want to `bootstrap()` a real Nest
 * application for manual testing (see the task's "Document Your Work"
 * section) - it is not required by the automated spec.
 */
@Module({
  imports: [],
})
export class AppModule {}

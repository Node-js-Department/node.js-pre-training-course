import { Module } from "@nestjs/common";
import { TodoController } from "./todo.controller";
import { TodoService } from "./todo.service";
import { TodoRepository } from "./todo.repository";

/**
 * TodoModule
 *
 * TODO: register `TodoController` in `controllers`, and both
 * `TodoService` and `TodoRepository` in `providers`.
 *
 * If/when you swap `TodoRepository` for a real TypeORM repository,
 * this is also where you would add
 * `imports: [TypeOrmModule.forFeature([TodoEntity])]`.
 */
@Module({
  controllers: [],
  providers: [],
})
export class TodoModule {}

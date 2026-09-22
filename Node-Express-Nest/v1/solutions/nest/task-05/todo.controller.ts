import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { TodoService } from "./todo.service";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodoResponseDto } from "./dto/todo-response.dto";

/**
 * TodoController
 *
 * Same route shape as task-04, but every method now returns a
 * `TodoResponseDto` produced through `TodoService` -> `TodoMapper`,
 * instead of an entity/plain object straight from storage.
 */
@Controller("todos")
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() dto: CreateTodoDto): TodoResponseDto {
    // TODO: delegate to this.todoService.create(dto)
    return this.todoService.create(dto);
  }

  @Get()
  findAll(): TodoResponseDto[] {
    // TODO: delegate to this.todoService.findAll()
    return this.todoService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): TodoResponseDto {
    // TODO: delegate to this.todoService.findOne(id)
    return this.todoService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
  ): TodoResponseDto {
    // TODO: delegate to this.todoService.update(id, dto)
    return this.todoService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number): void {
    // TODO: delegate to this.todoService.remove(id)
    return this.todoService.remove(id);
  }
}

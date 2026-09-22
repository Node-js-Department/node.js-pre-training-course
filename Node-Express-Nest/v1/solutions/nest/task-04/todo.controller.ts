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
import { TodoService, Todo } from "./todo.service";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";

/**
 * TodoController
 *
 * `@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))`
 * at the class level means every `@Body()` parameter typed as a DTO
 * is validated (and transformed into a real DTO instance) before the
 * handler body runs. `ParseIntPipe` handles the `:id` route param.
 */
@Controller("todos")
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  /**
   * POST /todos
   * Delegate to `todoService.create(dto)`.
   */
  @Post()
  create(@Body() dto: CreateTodoDto): Todo {
    // TODO: implement as described above
    return this.todoService.create(dto);
  }

  /**
   * GET /todos
   * Delegate to `todoService.findAll()`.
   */
  @Get()
  findAll(): Todo[] {
    // TODO: implement as described above
    return this.todoService.findAll();
  }

  /**
   * GET /todos/:id
   * Delegate to `todoService.findOne(id)`.
   */
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Todo {
    // TODO: implement as described above
    return this.todoService.findOne(id);
  }

  /**
   * PUT /todos/:id
   * Delegate to `todoService.update(id, dto)`.
   */
  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
  ): Todo {
    // TODO: implement as described above
    return this.todoService.update(id, dto);
  }

  /**
   * DELETE /todos/:id
   * Delegate to `todoService.remove(id)`.
   */
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number): void {
    // TODO: implement as described above
    return this.todoService.remove(id);
  }
}

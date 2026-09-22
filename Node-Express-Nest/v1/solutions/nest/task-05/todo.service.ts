import { Injectable, NotFoundException } from "@nestjs/common";
import { TodoRepository } from "./todo.repository";
import { TodoMapper } from "./todo-mapper";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodoResponseDto } from "./dto/todo-response.dto";

/**
 * TodoService
 *
 * Orchestrates `TodoRepository` (persistence) and `TodoMapper`
 * (DTO <-> entity translation). Notice this service only ever deals
 * with DTOs at its boundary and `TodoEntity` internally - it never
 * leaks a raw entity back to the controller.
 */
@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  /**
   * 1. Map `dto` to new entity fields via `TodoMapper.toNewEntity`.
   * 2. Persist via `this.todoRepository.save(...)`.
   * 3. Map the saved entity to a `TodoResponseDto` and return it.
   */
  create(dto: CreateTodoDto): TodoResponseDto {
    // TODO: implement as described above
    return TodoMapper.toResponseDto(
      this.todoRepository.save(TodoMapper.toNewEntity(dto)),
    );
  }

  /**
   * 1. Fetch all entities via `this.todoRepository.find()`.
   * 2. Map each to a `TodoResponseDto`.
   */
  findAll(): TodoResponseDto[] {
    // TODO: implement as described above
    return [];
  }

  /**
   * 1. Fetch the entity via `this.todoRepository.findOneBy(id)`.
   * 2. If missing, throw `NotFoundException`.
   * 3. Map to `TodoResponseDto` and return.
   */
  findOne(id: number): TodoResponseDto {
    // TODO: implement as described above
    throw new NotFoundException(`Todo ${id} not found`);
  }

  /**
   * 1. Build entity changes via `TodoMapper.toEntityChanges(dto)`.
   * 2. Apply via `this.todoRepository.update(id, changes)`.
   * 3. If the repository returns `undefined`, throw `NotFoundException`.
   * 4. Map to `TodoResponseDto` and return.
   */
  update(id: number, dto: UpdateTodoDto): TodoResponseDto {
    // TODO: implement as described above
    throw new NotFoundException(`Todo ${id} not found`);
  }

  /**
   * 1. Call `this.todoRepository.delete(id)`.
   * 2. If it returns `false`, throw `NotFoundException`.
   */
  remove(id: number): void {
    // TODO: implement as described above
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * TodoService
 *
 * In-memory CRUD storage for ToDos, consumed by `TodoController`.
 * DTOs (already validated by `ValidationPipe` at the controller
 * boundary) are the only shape this service should ever receive.
 */
@Injectable()
export class TodoService {
  private readonly todos: Todo[] = [];
  private nextId = 1;

  /**
   * Create a new todo from a validated `CreateTodoDto`.
   *
   * 1. Build a `Todo` using `this.nextId++`, `dto.title`,
   *    `dto.description`, `dto.completed ?? false`, and
   *    `createdAt`/`updatedAt` both set to `new Date()`.
   * 2. Push it into `this.todos`.
   * 3. Return the created todo.
   */
  create(dto: CreateTodoDto): Todo {
    // TODO: implement as described above
    return {
      id: 0,
      title: dto.title,
      description: dto.description,
      completed: dto.completed ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Return every todo currently stored.
   */
  findAll(): Todo[] {
    // TODO: return this.todos
    return [];
  }

  /**
   * Find a single todo by id.
   *
   * 1. Search `this.todos` for a matching `id`.
   * 2. If not found, throw a `NotFoundException`.
   * 3. Otherwise return it.
   */
  findOne(id: number): Todo {
    // TODO: implement as described above
    throw new NotFoundException(`Todo ${id} not found`);
  }

  /**
   * Apply a partial update to an existing todo.
   *
   * 1. Find the todo via `this.findOne(id)` (reuse the 404 behavior).
   * 2. Merge in only the fields present on `dto`.
   * 3. Set `updatedAt` to `new Date()`.
   * 4. Return the updated todo.
   */
  update(id: number, dto: UpdateTodoDto): Todo {
    // TODO: implement as described above
    return this.findOne(id);
  }

  /**
   * Remove a todo by id.
   *
   * 1. Find its index via `this.findOne(id)`/`Array.prototype.findIndex`.
   * 2. Remove it from `this.todos`.
   */
  remove(id: number): void {
    // TODO: implement as described above
  }
}

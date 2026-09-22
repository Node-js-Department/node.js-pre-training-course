import { TodoEntity } from "./todo.entity";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodoResponseDto } from "./dto/todo-response.dto";

/**
 * TodoMapper
 *
 * All DTO <-> entity translation lives here, so `TodoService` never
 * has to know about both shapes at once.
 */
export class TodoMapper {
  /**
   * Turn a validated `CreateTodoDto` into the entity fields
   * `TodoRepository.save` expects (no `id`/timestamps - the
   * repository/DB is responsible for those).
   *
   * 1. Copy `title`, `description`.
   * 2. Default `completed` to `false` when not provided.
   */
  static toNewEntity(
    dto: CreateTodoDto,
  ): Omit<TodoEntity, "id" | "createdAt" | "updatedAt"> {
    // TODO: implement as described above
    return { title: dto.title, description: dto.description, completed: false };
  }

  /**
   * Apply a partial update DTO onto an existing entity, returning the
   * set of changes to pass to `TodoRepository.update`.
   *
   * 1. Only include keys that are actually present on `dto`.
   */
  static toEntityChanges(dto: UpdateTodoDto): Partial<TodoEntity> {
    // TODO: implement as described above
    return { ...dto };
  }

  /**
   * Convert a `TodoEntity` (DB model) into a `TodoResponseDto`
   * (external API shape).
   *
   * 1. Copy the scalar fields as-is.
   * 2. Convert `createdAt`/`updatedAt` from `Date` to ISO strings via
   *    `.toISOString()`.
   */
  static toResponseDto(entity: TodoEntity): TodoResponseDto {
    // TODO: implement as described above
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      completed: entity.completed,
      createdAt: "",
      updatedAt: "",
    };
  }
}

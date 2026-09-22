import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

/**
 * CreateTodoDto - external request shape for `POST /todos`.
 *
 * TODO (same as task-04): add `class-validator` decorators.
 * - `title`: `@IsString()`, `@IsNotEmpty()`, `@MaxLength(100)`
 * - `description`: `@IsOptional()`, `@IsString()`, `@MaxLength(500)`
 * - `completed`: `@IsOptional()`, `@IsBoolean()`
 */
export class CreateTodoDto {
  title!: string;

  description?: string;

  completed?: boolean;
}

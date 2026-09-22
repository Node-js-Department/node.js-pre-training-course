import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

/**
 * CreateTodoDto
 *
 * Shape of the payload accepted by `POST /todos`. Every property must
 * be decorated with `class-validator` decorators so `ValidationPipe`
 * can reject bad input before it ever reaches `TodoService`.
 *
 * TODO:
 * - `title`: required, non-empty string, max 100 characters
 *   -> `@IsString()`, `@IsNotEmpty()`, `@MaxLength(100)`
 * - `description`: optional string, max 500 characters
 *   -> `@IsOptional()`, `@IsString()`, `@MaxLength(500)`
 * - `completed`: optional boolean, defaults to `false` in the service
 *   -> `@IsOptional()`, `@IsBoolean()`
 */
export class CreateTodoDto {
  title!: string;

  description?: string;

  completed?: boolean;
}

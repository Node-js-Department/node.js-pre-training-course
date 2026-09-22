import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

/**
 * UpdateTodoDto - external request shape for `PUT /todos/:id`.
 *
 * TODO: same fields as `CreateTodoDto`, all optional.
 */
export class UpdateTodoDto {
  title?: string;

  description?: string;

  completed?: boolean;
}

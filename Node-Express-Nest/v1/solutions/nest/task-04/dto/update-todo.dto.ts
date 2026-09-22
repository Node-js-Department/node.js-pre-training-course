import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

/**
 * UpdateTodoDto
 *
 * Shape of the payload accepted by `PUT /todos/:id`. Unlike
 * `CreateTodoDto`, every field here is optional (partial update) -
 * note that we spell each field out again rather than pulling in
 * `@nestjs/mapped-types`'s `PartialType`, to keep this module's
 * dependency footprint small. Feel free to swap in `PartialType`
 * once you add that package.
 *
 * TODO:
 * - `title`: optional string, max 100 characters
 * - `description`: optional string, max 500 characters
 * - `completed`: optional boolean
 */
export class UpdateTodoDto {
  title?: string;

  description?: string;

  completed?: boolean;
}

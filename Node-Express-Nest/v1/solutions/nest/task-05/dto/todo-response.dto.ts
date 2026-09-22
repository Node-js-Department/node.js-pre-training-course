/**
 * TodoResponseDto - external response shape returned to API clients.
 *
 * Deliberately different from `TodoEntity`: dates are serialized as
 * ISO strings (not `Date` instances) because that is what actually
 * goes over the wire as JSON. Keeping a distinct response DTO (rather
 * than returning the entity directly) is what lets you change the DB
 * schema later without automatically changing the public API shape.
 */
export class TodoResponseDto {
  id!: number;
  title!: string;
  description?: string;
  completed!: boolean;
  createdAt!: string;
  updatedAt!: string;
}

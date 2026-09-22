import { Injectable } from "@nestjs/common";
import { TodoEntity } from "./todo.entity";

/**
 * TodoRepository
 *
 * In-memory fallback that mimics the handful of TypeORM
 * `Repository<TodoEntity>` methods `TodoService` needs
 * (`save`/`find`/`findOneBy`/`delete`-like operations), named to
 * match TypeORM's own API as closely as reasonable. This means that
 * swapping this class for:
 *
 * ```ts
 * constructor(
 *   @InjectRepository(TodoEntity)
 *   private readonly repo: Repository<TodoEntity>,
 * ) {}
 * ```
 *
 * later should require little to no change in `TodoService`.
 *
 * Document your actual DB/ORM setup (if you choose to do it) the same
 * way the DB module's ORM tasks do: describe it in
 * `solutions/task-05.txt` rather than committing a live connection.
 */
@Injectable()
export class TodoRepository {
  private readonly rows: TodoEntity[] = [];
  private nextId = 1;

  /**
   * Persist a new entity.
   *
   * 1. Assign `this.nextId++` as the `id`.
   * 2. Set `createdAt`/`updatedAt` to `new Date()`.
   * 3. Push the entity into `this.rows`.
   * 4. Return the saved entity.
   *
   * @param partial - Entity fields provided by the mapper (no id/timestamps yet).
   */
  save(partial: Omit<TodoEntity, "id" | "createdAt" | "updatedAt">): TodoEntity {
    // TODO: implement as described above
    return {
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...partial,
    };
  }

  /**
   * Return every row.
   */
  find(): TodoEntity[] {
    // TODO: return this.rows
    return [];
  }

  /**
   * Find a single row by id, or `undefined` if it does not exist.
   */
  findOneBy(id: number): TodoEntity | undefined {
    // TODO: implement as described above
    return undefined;
  }

  /**
   * Overwrite a row with new field values and refresh `updatedAt`.
   *
   * 1. Find the existing row via `this.findOneBy(id)`.
   * 2. If missing, return `undefined`.
   * 3. Merge `changes` into it, set `updatedAt = new Date()`.
   * 4. Return the updated row.
   */
  update(id: number, changes: Partial<TodoEntity>): TodoEntity | undefined {
    // TODO: implement as described above
    return undefined;
  }

  /**
   * Delete a row by id.
   *
   * @returns `true` if a row was removed, `false` if no row matched.
   */
  delete(id: number): boolean {
    // TODO: implement as described above
    return false;
  }
}

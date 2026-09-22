/**
 * TodoEntity
 *
 * Represents the *database* shape of a todo, as opposed to the DTOs
 * (which represent what comes in/out over HTTP). This is the
 * "internal model" side of the DTO <-> entity mapping this task is
 * about.
 *
 * NOTE ON THE ORM ITSELF - read this before writing any code:
 * This solutions package intentionally does NOT depend on `typeorm`
 * or `@nestjs/typeorm`, so this task can be completed and unit tested
 * without anyone standing up a real database (same spirit as the
 * `DB/tasks/task-07..10` ORM/Redis tasks, which ask you to *document*
 * your setup rather than requiring a live instance for grading).
 *
 * If you want to wire this up to a real database, add
 * `typeorm`, `@nestjs/typeorm` and a driver (e.g. `pg` or `sqlite3`)
 * to `package.json`, then uncomment/adapt the decorators below:
 *
 * ```ts
 * import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
 *
 * @Entity("todos")
 * export class TodoEntity {
 *   @PrimaryGeneratedColumn()
 *   id: number;
 *
 *   @Column()
 *   title: string;
 *
 *   @Column({ nullable: true })
 *   description?: string;
 *
 *   @Column({ default: false })
 *   completed: boolean;
 *
 *   @CreateDateColumn()
 *   createdAt: Date;
 *
 *   @UpdateDateColumn()
 *   updatedAt: Date;
 * }
 * ```
 *
 * Until then, `TodoEntity` is a plain class with the same shape, and
 * `TodoRepository` (see `todo.repository.ts`) is an in-memory stand-in
 * for a real TypeORM `Repository<TodoEntity>`.
 */
export class TodoEntity {
  id!: number;
  title!: string;
  description?: string;
  completed!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

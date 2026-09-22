---
topic: "NEST JS"
taskNumber: 5
---

# Task 05: ORM Integration with DTO Mapping

Extend Task 04's ToDo CRUD with a proper repository layer and explicit mapping between three distinct shapes: the DTOs clients send/receive, the `TodoEntity` that represents a database row, and the `TodoResponseDto` actually returned by the API.

## ⚠️ No Database Required

Just like the `DB` module's ORM/Redis tasks (`DB/tasks/task-07.md` onward), **this task does not require you to stand up a real database** to complete or verify it. `TodoRepository` in the stub is a documented in-memory stand-in with the same method shapes (`save`/`find`/`findOneBy`/`update`/`delete`) a real TypeORM `Repository<TodoEntity>` would have. If you want to go further and wire up a real TypeORM (or Prisma) connection, that's a bonus - **document what you did in `solutions/task-05.txt`** the same way the DB module's ORM tasks ask you to, rather than committing a live DB connection the grader would need to reproduce.

## Project Setup

```bash
cd solutions/nest
npm install
npx jest task-05/task-05.spec.ts
```

Implement the stub files under `solutions/nest/task-05/`:

- `todo.entity.ts`
- `todo.repository.ts`
- `todo-mapper.ts`
- `dto/create-todo.dto.ts`
- `dto/update-todo.dto.ts`
- `dto/todo-response.dto.ts`
- `todo.service.ts`
- `todo.controller.ts`
- `todo.module.ts`

## Requirements

### Core Functionality

1. **`TodoEntity`** - the DB-model shape: `id`, `title`, `description?`, `completed`, `createdAt: Date`, `updatedAt: Date`. `todo.entity.ts` includes a commented-out TypeORM version (`@Entity`, `@PrimaryGeneratedColumn`, `@Column`, ...) for reference if you choose to connect a real database.

2. **`TodoRepository`** (repository pattern)

   - `save(partial): TodoEntity` - assign id + timestamps, persist, return.
   - `find(): TodoEntity[]`
   - `findOneBy(id): TodoEntity | undefined`
   - `update(id, changes): TodoEntity | undefined` - merge changes, refresh `updatedAt`.
   - `delete(id): boolean`

3. **`TodoMapper`** (DTO ↔ entity translation, all static methods)

   - `toNewEntity(dto: CreateTodoDto)` - DTO → entity fields (no id/timestamps yet), defaulting `completed` to `false`.
   - `toEntityChanges(dto: UpdateTodoDto)` - only the fields actually present on the update DTO.
   - `toResponseDto(entity: TodoEntity): TodoResponseDto` - entity → external shape, converting `Date` fields to ISO strings via `.toISOString()`.

4. **`TodoResponseDto`** - the external API shape: same fields as the entity, but `createdAt`/`updatedAt` are `string` (ISO), not `Date`.

5. **`TodoService`** - orchestrates `TodoRepository` + `TodoMapper`; every public method takes/returns DTOs, never a raw `TodoEntity`.

6. **`TodoController`/`TodoModule`** - same routes as Task 04 (`GET/POST/PUT/DELETE /todos`), now returning `TodoResponseDto` instead of the entity/plain object directly.

### Implementation Details

**Step 1. `TodoEntity`** - just the plain class; read the commented TypeORM example in the file for context, but you do not need TypeORM installed to finish this task.

**Step 2. `TodoRepository`** - implement the in-memory methods listed above. Keep the method names/shapes stable: this is what lets you swap in `@InjectRepository(TodoEntity) private readonly repo: Repository<TodoEntity>` later with minimal changes to `TodoService`.

**Step 3. `TodoMapper`** - implement the three static methods. This is the heart of the task: `TodoService` should never manually copy fields between a DTO and an entity outside of `TodoMapper`.

**Step 4. `TodoService`** - wire `TodoRepository` and `TodoMapper` together, throwing `NotFoundException` where appropriate.

**Step 5. `TodoController`/`TodoModule`** - same shape as Task 04, adjusted to return `TodoResponseDto`.

## Document Your Work

After completing all previous steps, you must document your work in the file `solutions/task-05.txt`:

- Describe the three shapes involved (`CreateTodoDto`/`UpdateTodoDto`, `TodoEntity`, `TodoResponseDto`) and why they are kept separate instead of collapsing them into one type.
- Explain the repository pattern used by `TodoRepository` and what would change if you swapped it for a real TypeORM/Prisma repository.
- If you *did* connect a real database as a bonus, describe your setup (ORM, driver, migration/seed steps) here instead of committing connection code the grader would need to run.
- Explain how to run your solution and confirm `task-05/task-05.spec.ts` passes.

## Bonus Points

- Actually wire up TypeORM (or Prisma) against a local SQLite/Postgres database, replacing `TodoRepository`'s in-memory arrays with a real `Repository<TodoEntity>` - document your setup as described above.
- Add a `TodoMapper.toResponseDtoList(entities: TodoEntity[])` helper and use it from `TodoService.findAll`.
- Add an `@Exclude()`/`@Expose()`-based mapping using `class-transformer`'s `plainToInstance` instead of manual field copying in `TodoMapper`.
- Add optimistic concurrency: reject an `update()` if the entity's `updatedAt` sent by the client does not match what is stored.

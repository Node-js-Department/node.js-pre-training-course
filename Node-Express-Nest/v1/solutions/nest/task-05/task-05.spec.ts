import "reflect-metadata";
import { Test, TestingModule } from "@nestjs/testing";
import { TodoModule } from "./todo.module";
import { TodoController } from "./todo.controller";
import { TodoService } from "./todo.service";
import { TodoRepository } from "./todo.repository";
import { TodoMapper } from "./todo-mapper";
import { TodoEntity } from "./todo.entity";

/**
 * Task 05 - ORM Integration with DTO Mapping
 *
 * No real database is involved: `TodoRepository` is the documented
 * in-memory fallback described in `todo.entity.ts`/`todo.repository.ts`.
 * These tests only verify the *mapping* contract (DTO -> entity,
 * entity -> response DTO) and that `TodoService`/`TodoController`
 * correctly delegate through `TodoMapper` and `TodoRepository`.
 */
describe("Task 05 - ORM Integration with DTO Mapping", () => {
  describe("TodoMapper", () => {
    it("maps a CreateTodoDto to new entity fields with completed defaulted", () => {
      const fields = TodoMapper.toNewEntity({ title: "Learn TypeORM" });
      expect(fields.title).toBe("Learn TypeORM");
      expect(fields.completed).toBe(false);
    });

    it("maps only the provided fields for an update", () => {
      const changes = TodoMapper.toEntityChanges({ completed: true });
      expect(changes).toEqual({ completed: true });
    });

    it("maps a TodoEntity to a TodoResponseDto with ISO date strings", () => {
      const entity: TodoEntity = {
        id: 1,
        title: "Persisted",
        description: undefined,
        completed: false,
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-02T00:00:00.000Z"),
      };

      const dto = TodoMapper.toResponseDto(entity);

      expect(dto.id).toBe(1);
      expect(dto.createdAt).toBe("2024-01-01T00:00:00.000Z");
      expect(dto.updatedAt).toBe("2024-01-02T00:00:00.000Z");
    });
  });

  describe("TodoRepository (in-memory ORM stand-in)", () => {
    let repository: TodoRepository;

    beforeEach(() => {
      repository = new TodoRepository();
    });

    it("saves and retrieves a row", () => {
      const saved = repository.save({ title: "Persist me", completed: false });
      expect(repository.findOneBy(saved.id)).toEqual(saved);
    });

    it("updates a row and refreshes updatedAt", () => {
      const saved = repository.save({ title: "Old", completed: false });
      const updated = repository.update(saved.id, { completed: true });
      expect(updated?.completed).toBe(true);
    });

    it("deletes a row", () => {
      const saved = repository.save({ title: "Temp", completed: false });
      expect(repository.delete(saved.id)).toBe(true);
      expect(repository.findOneBy(saved.id)).toBeUndefined();
    });
  });

  describe("TodoModule wiring", () => {
    let moduleRef: TestingModule;

    beforeEach(async () => {
      moduleRef = await Test.createTestingModule({
        imports: [TodoModule],
      }).compile();
    });

    it("registers TodoController, TodoService and TodoRepository", () => {
      expect(moduleRef.get(TodoController, { strict: false })).toBeInstanceOf(
        TodoController,
      );
      expect(moduleRef.get(TodoService, { strict: false })).toBeInstanceOf(
        TodoService,
      );
      expect(moduleRef.get(TodoRepository, { strict: false })).toBeInstanceOf(
        TodoRepository,
      );
    });
  });

  describe("TodoService <-> TodoController end-to-end (in-memory)", () => {
    let controller: TodoController;

    beforeEach(() => {
      const repository = new TodoRepository();
      const service = new TodoService(repository);
      controller = new TodoController(service);
    });

    it("creates a todo and returns a TodoResponseDto shape", () => {
      const response = controller.create({ title: "End to end" });
      expect(response.title).toBe("End to end");
      expect(typeof response.createdAt).toBe("string");
    });

    it("lists todos as response DTOs", () => {
      controller.create({ title: "First" });
      controller.create({ title: "Second" });
      expect(controller.findAll()).toHaveLength(2);
    });

    it("throws when updating a todo that does not exist", () => {
      expect(() => controller.update(9999, { completed: true })).toThrow();
    });
  });
});

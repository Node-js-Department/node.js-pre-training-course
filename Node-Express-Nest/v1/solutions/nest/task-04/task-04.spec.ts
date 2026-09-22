import "reflect-metadata";
import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { TodoModule } from "./todo.module";
import { TodoController } from "./todo.controller";
import { TodoService } from "./todo.service";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";

/**
 * Task 04 - Setup ToDo CRUD with DTOs
 *
 * Four layers are tested independently:
 * 1. `class-validator` decorators on the DTOs themselves (no Nest
 *    involved at all).
 * 2. `ValidationPipe` wired the same way Nest wires it, by calling
 *    `.transform()` directly - this is the officially documented way
 *    to unit test a pipe without booting an HTTP server.
 * 3. `TodoModule` wiring via `Test.createTestingModule`.
 * 4. `TodoService`/`TodoController` CRUD behavior.
 */
describe("Task 04 - Setup ToDo CRUD with DTOs", () => {
  describe("CreateTodoDto validation (class-validator)", () => {
    it("reports an error when title is missing", async () => {
      const dto = plainToInstance(CreateTodoDto, { description: "no title" });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("passes validation for a well-formed payload", async () => {
      const dto = plainToInstance(CreateTodoDto, { title: "Buy milk" });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("rejects a non-boolean completed field", async () => {
      const dto = plainToInstance(CreateTodoDto, {
        title: "Buy milk",
        completed: "yes please",
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("UpdateTodoDto validation (class-validator)", () => {
    it("allows an empty payload (every field optional)", async () => {
      const dto = plainToInstance(UpdateTodoDto, {});
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("rejects a title longer than 100 characters", async () => {
      const dto = plainToInstance(UpdateTodoDto, { title: "x".repeat(101) });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("ValidationPipe integration", () => {
    const pipe = new ValidationPipe({ whitelist: true, transform: true });

    it("throws BadRequestException for an invalid CreateTodoDto payload", async () => {
      await expect(
        pipe.transform(
          {},
          { type: "body", metatype: CreateTodoDto, data: "" },
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("returns a CreateTodoDto instance for a valid payload", async () => {
      const result = await pipe.transform(
        { title: "Read a book" },
        { type: "body", metatype: CreateTodoDto, data: "" },
      );
      expect(result).toBeInstanceOf(CreateTodoDto);
      expect(result.title).toBe("Read a book");
    });
  });

  describe("TodoModule wiring", () => {
    let moduleRef: TestingModule;

    beforeEach(async () => {
      moduleRef = await Test.createTestingModule({
        imports: [TodoModule],
      }).compile();
    });

    it("registers TodoController and TodoService", () => {
      expect(moduleRef.get(TodoController, { strict: false })).toBeInstanceOf(
        TodoController,
      );
      expect(moduleRef.get(TodoService, { strict: false })).toBeInstanceOf(
        TodoService,
      );
    });
  });

  describe("TodoService CRUD", () => {
    let service: TodoService;

    beforeEach(() => {
      service = new TodoService();
    });

    it("creates a todo with defaults", () => {
      const todo = service.create({ title: "Write tests" });
      expect(todo.title).toBe("Write tests");
      expect(todo.completed).toBe(false);
    });

    it("lists created todos", () => {
      service.create({ title: "One" });
      service.create({ title: "Two" });
      expect(service.findAll()).toHaveLength(2);
    });

    it("finds a todo by id", () => {
      const created = service.create({ title: "Findable" });
      expect(service.findOne(created.id)).toEqual(created);
    });

    it("throws when a todo id does not exist", () => {
      expect(() => service.findOne(9999)).toThrow();
    });

    it("updates an existing todo", () => {
      const created = service.create({ title: "Old title" });
      const updated = service.update(created.id, { completed: true });
      expect(updated.completed).toBe(true);
      expect(updated.title).toBe("Old title");
    });

    it("removes a todo", () => {
      const created = service.create({ title: "Temporary" });
      service.remove(created.id);
      expect(() => service.findOne(created.id)).toThrow();
    });
  });

  describe("TodoController delegation", () => {
    let controller: TodoController;
    let service: TodoService;

    beforeEach(() => {
      service = new TodoService();
      controller = new TodoController(service);
    });

    it("create() delegates to TodoService.create()", () => {
      const result = controller.create({ title: "Delegate me" });
      expect(result.title).toBe("Delegate me");
    });

    it("findAll() delegates to TodoService.findAll()", () => {
      controller.create({ title: "A" });
      expect(controller.findAll()).toHaveLength(1);
    });
  });
});

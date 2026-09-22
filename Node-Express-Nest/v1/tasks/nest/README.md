# NestJS Tasks

> These tasks run inside their own standalone workspace at
> `solutions/nest/` (with its own `package.json`, `tsconfig.json` and
> `jest.config.js`), since NestJS needs `@nestjs/*` packages,
> `reflect-metadata` and decorator compilation that a bare `node` script
> can't provide. See Task 01's "Project Setup" section for the exact
> setup commands - you only need to run `npm install` once for all
> five tasks.

### 🧪 **General Tasks (Out of ToDo context):**

- **[Task 01](./task-01.md)**: Modular NestJS Setup
- **[Task 02](./task-02.md)**: Dependency Injection Chain
- **[Task 03](./task-03.md)**: Request Lifecycle Exploration

### 📝 **ToDo-Specific Tasks (NestJS style):**

- **[Task 04](./task-04.md)**: Setup ToDo CRUD with DTOs
- **[Task 05](./task-05.md)**: ORM Integration with DTO Mapping

## 🎯 What are we planning to learn?

- **Modularity**: Structuring an application into feature modules with `@Module`, and controlling what each module exposes via `imports`/`exports`.
- **Dependency Injection**: How Nest's DI container resolves constructor dependencies, including multi-level chains and swapping providers for mocks in tests.
- **Request Lifecycle**: The exact order guards, pipes and interceptors run in around a route handler, and how to use each of them for its intended purpose.
- **Validation with DTOs**: Enforcing input shape and rules with `class-validator` decorators and Nest's `ValidationPipe`.
- **Persistence Patterns**: The repository pattern and mapping between DB models (entities) and external API shapes (DTOs), independent of which ORM (or none) is behind it.

## 📚 Resources

- [NestJS Official Documentation](https://docs.nestjs.com/)
- [NestJS - Modules](https://docs.nestjs.com/modules)
- [NestJS - Providers](https://docs.nestjs.com/providers)
- [NestJS - Guards](https://docs.nestjs.com/guards)
- [NestJS - Pipes](https://docs.nestjs.com/pipes)
- [NestJS - Interceptors](https://docs.nestjs.com/interceptors)
- [NestJS - Request Lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
- [NestJS - Testing](https://docs.nestjs.com/fundamentals/testing)
- [class-validator Documentation](https://github.com/typestack/class-validator)
- [class-transformer Documentation](https://github.com/typestack/class-transformer)
- [TypeORM Documentation](https://typeorm.io/)

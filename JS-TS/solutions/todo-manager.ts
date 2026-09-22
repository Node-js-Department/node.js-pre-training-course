import { TodoService } from './todo-service';
import { TodoApi } from './todo-api';
import { InMemoryRepository } from './repository';
import { Todo } from './types';

export class ToDoManager {
  // Assumes earlier tasks are already done: Task 1's Todo/TodoStatus types,
  // Task 6's TodoApi, and Task 7's repository-injection refactor. If you're
  // seeing type errors here, finish Tasks 1-7 first, in order.
  private repo = new InMemoryRepository<Todo>();
  private api = new TodoApi(this.repo);
  private service = new TodoService(this.api);

  async init(): Promise<void> {
    throw new Error('init: not implemented');
  }

  async add(title: string, description?: string): Promise<void> {
    throw new Error('add: not implemented');
  }

  async complete(id: number): Promise<void> {
    throw new Error('complete: not implemented');
  }

  async list(): Promise<Todo[]> {
    throw new Error('list: not implemented');
  }
}

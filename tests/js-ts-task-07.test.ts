import { InMemoryRepository } from '../JS-TS/solutions/repository';

describe('Task 07: Generic Repository', () => {
  interface Entity { id: number; value: string; }
  let repo: InMemoryRepository<Entity>;

  beforeEach(() => {
    repo = new InMemoryRepository<Entity>();
    repo.add({ id: 1, value: 'A' });
    repo.add({ id: 2, value: 'B' });
  });

  it('add and findAll should work', () => {
    expect(repo.findAll().length).toBe(2);
  });

  it('findById should return correct entity', () => {
    const e = repo.findById(1);
    expect(e?.value).toBe('A');
  });

  it('update should patch entity', () => {
    repo.update(1, { value: 'AA' });
    expect(repo.findById(1)?.value).toBe('AA');
  });

  it('remove should delete entity', () => {
    repo.remove(2);
    expect(repo.findById(2)).toBeUndefined();
  });

  it('update should throw for a non-existing id', () => {
    expect(() => repo.update(99, { value: 'X' })).toThrow();
  });

  it('remove should throw for a non-existing id', () => {
    expect(() => repo.remove(99)).toThrow();
  });
});

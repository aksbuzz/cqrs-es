export interface IRepository<T> {
  save(aggregateRoot: T, version: number): Promise<void>;
  getById(guid: string): Promise<T>;
}

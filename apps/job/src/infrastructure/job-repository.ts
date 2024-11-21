import { Injectable } from '@nestjs/common';
import { IJobRepository } from '../domain/job-repository.interface';
import { Job } from '../domain/job';
import { JobEventStore } from './job-event-store';

@Injectable()
export class JobRepository implements IJobRepository {
  constructor(private readonly _eventStore: JobEventStore) {}

  /**
   * Saves the given aggregate root to the event store.
   *
   * @param {Job} aggregateRoot The aggregate root to save.
   * @param {number} expectedVersion The expected version of the aggregate root.
   */
  async save(aggregateRoot: Job, expectedVersion: number): Promise<void> {
    await this._eventStore.saveEvents(
      aggregateRoot.guid,
      aggregateRoot.getUncommittedEvents(),
      expectedVersion,
    );

    aggregateRoot.commit();
  }

  /**
   * Loads a job from the event store and returns it.
   */
  async getById(guid: string): Promise<Job> {
    const aggregateRoot = new Job();
    const history = await this._eventStore.getEvents(guid);
    aggregateRoot.loadFromHistory(history);
    return aggregateRoot;
  }
}

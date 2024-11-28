import { Injectable } from '@nestjs/common';
import { IApplicationRepository } from '../domain/application-repository.interface';
import { Application } from '../domain/application';
import { ApplicationEventStore } from './application-event-store';

@Injectable()
export class ApplicationRepository implements IApplicationRepository {
  constructor(private readonly _eventStore: ApplicationEventStore) {}

  /**
   * Saves the given aggregate root to the event store.
   *
   * @param {Application} aggregateRoot The aggregate root to save.
   * @param {number} expectedVersion The expected version of the aggregate root.
   */
  async save(
    aggregateRoot: Application,
    expectedVersion: number,
  ): Promise<void> {
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
  async getById(guid: string): Promise<Application> {
    const aggregateRoot = new Application();
    const history = await this._eventStore.getEvents(guid);
    aggregateRoot.loadFromHistory(history);
    return aggregateRoot;
  }
}

import { IEvent } from './IEvent';

export interface IEventStore {
  /**
   * Saves events to the event store for a given aggregate.
   *
   * @param aggregateId
   * @param events
   * @param {number} version - The expected version of the aggregate.
   */
  saveEvents(
    aggregateId: string,
    events: IEvent[],
    version: number,
  ): Promise<void>;
  getEvents(aggregateId: string): Promise<IEvent[]>;
}

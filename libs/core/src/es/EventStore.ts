import { IEventBus } from '@nestjs/cqrs';
import { Pool } from 'pg';
import {
  ConflictException,
  InternalServerException,
  NotFoundException,
} from '../errors';
import { IEventStore, IEvent } from '../interfaces';
import {
  createEventStoreEvent,
  reconstructEvent,
} from '../util/event-store-event';

export abstract class EventStore implements IEventStore {
  constructor(
    private readonly _pool: Pool,
    private readonly _eventBus: IEventBus,
  ) {}

  async getEvents(aggregateId: string): Promise<IEvent[]> {
    const query = `
    SELECT event_name, event_data, aggregate_name, aggregate_id, version
    FROM event_store
    WHERE aggregate_id = $1
    ORDER BY version
    `;

    try {
      const result = await this._pool.query(query, [aggregateId]);
      return result.rows.map((row) => reconstructEvent(row));
    } catch (error) {
      throw new NotFoundException('Aggregate with requested guid not found.');
    }
  }

  async saveEvents(
    aggregateId: string,
    events: IEvent[],
    expectedVersion: number,
  ): Promise<void> {
    const queries = [];
    const lastVersion = await this.getLastVersion(aggregateId);

    if (expectedVersion !== lastVersion && expectedVersion !== -1) {
      throw new ConflictException(
        'Expected version does not match actual version.',
      );
    }

    let i = expectedVersion;

    for (const event of events) {
      i++;
      event.version = i;
      this._eventBus.publish(event);

      const esEvent = createEventStoreEvent(event);
      queries.push(`
        INSERT INTO event_store (event_name, aggregate_name, aggregate_id, version, event_data)
        VALUES ('${event.eventName}', '${event.aggregateName}', '${event.aggregateId}', '${event.version}', '${JSON.stringify(esEvent.eventData)}');
      `);
    }

    try {
      await this._pool.query(queries.join(''));
    } catch (error) {
      throw new InternalServerException('Error saving events.');
    }
  }

  private async getLastVersion(aggregateId: string): Promise<number> {
    const query: string = `SELECT MAX(version) as version FROM event_store WHERE aggregate_id = $1;`;

    const result = await this._pool.query<{ version: number }>(query, [
      aggregateId,
    ]);

    return result.rows[0].version;
  }
}

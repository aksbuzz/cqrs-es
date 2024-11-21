import { EventStoreEvent } from '../cqrs';
import { IEvent } from '../interfaces';

export function createEventStoreEvent(event: IEvent) {
  const eventData = { ...event };

  delete eventData.aggregateId;
  delete eventData.aggregateName;
  delete eventData.eventName;
  delete eventData.version;

  return new EventStoreEvent(
    event.aggregateId,
    event.aggregateName,
    event.version,
    event.eventName,
    eventData,
  );
}

export function reconstructEvent(data: any): IEvent {
  return {
    aggregateId: data.aggregate_id,
    aggregateName: data.aggregate_name,
    eventName: data.event_name,
    version: data.version,
    ...data.event_data,
  };
}

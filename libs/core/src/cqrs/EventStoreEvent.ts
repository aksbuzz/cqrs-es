import { IEvent } from '../interfaces';

export class EventStoreEvent implements IEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly aggregateName: string,
    public readonly version: number,
    public readonly eventName: string,
    public readonly eventData: any,
  ) {}
}

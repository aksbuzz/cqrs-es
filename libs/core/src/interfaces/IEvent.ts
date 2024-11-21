export interface IEvent {
  aggregateId: string;
  aggregateName: string;
  eventName: string;
  version?: number;
}

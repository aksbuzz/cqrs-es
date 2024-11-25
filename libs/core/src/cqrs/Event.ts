import { IEvent } from '../interfaces';

export abstract class Event implements IEvent {
  public abstract eventName: string;
  public abstract aggregateName: string;

  public version: number;

  protected constructor(public aggregateId: string) {
    this.aggregateId = aggregateId;
  }
}

import { Event } from '@app/core';

export class JobUpdatedEvent extends Event {
  public aggregateName: string = 'job';
  public eventName: string = JobUpdatedEvent.name;

  constructor(
    private guid: string,
    public title: string,
    public description: string,
  ) {
    super(guid);
  }
}

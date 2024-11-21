import { Event } from '@app/core';

export class JobArchivedEvent extends Event {
  public aggregateName: string = 'job';
  public eventName: string = JobArchivedEvent.name;

  constructor(private guid: string) {
    super(guid);
  }
}

import { Event } from '@app/core';

export class ApplicationCreatedEvent extends Event {
  public aggregateName: string = 'application';
  public eventName: string = ApplicationCreatedEvent.name;

  constructor(
    public guid: string,
    public jobId: string,
    public firstname: string,
    public lastname: string,
    public email: string,
    public currentPosition: string,
  ) {
    super(guid);
  }
}

import { Event } from '@app/core';
import { JobStatus } from '../job-status';

export class JobCreatedEvent extends Event {
  public aggregateName: string = 'job';
  public eventName: string = JobCreatedEvent.name;

  constructor(
    private guid: string,
    public title: string,
    public description: string,
    public status: JobStatus,
  ) {
    super(guid);
  }
}

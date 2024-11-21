import { IEvent } from '@app/core';
import { BadRequestException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { JobArchivedEvent } from './events/job-archived.event';
import { JobCreatedEvent } from './events/job-created.event';
import { JobUpdatedEvent } from './events/job-updated.event';
import { JobStatus } from './job-status';

export class Job extends AggregateRoot<IEvent> {
  public guid: string;

  private title: string;
  private description: string;
  private status: JobStatus = JobStatus.ACTIVE;

  constructor();
  constructor(guid: string, title: string, description: string);
  constructor(guid?: string, title?: string, description?: string) {
    super();
    this.guid = guid;
    this.title = title;
    this.description = description;

    if (guid && title && description) {
      this.apply(
        new JobCreatedEvent(
          this.guid,
          this.title,
          this.description,
          this.status,
        ),
      );
    }
  }

  updateInfo(title: string, description: string) {
    this.apply(new JobUpdatedEvent(this.guid, title, description));
  }

  archive() {
    if (this.status === JobStatus.ARCHIVED) {
      throw new BadRequestException('Job is already archived!');
    }

    this.apply(new JobArchivedEvent(this.guid));
  }

  onJobCreatedEvent(event: JobCreatedEvent) {
    this.guid = event.aggregateId;
    this.title = event.title;
    this.description = event.description;
  }

  onJobUpdatedEvent(event: JobUpdatedEvent) {
    this.title = event.title;
    this.description = event.description;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onJobArchivedEvent(event: JobArchivedEvent) {
    this.status = JobStatus.ARCHIVED;
  }

  loadFromHistory(history: IEvent[]): void {
    for (const event of history) {
      const handlerMethod = `on${event.eventName}`;
      if (typeof this[handlerMethod] === 'function') {
        this[handlerMethod](event);
      }
    }
  }
}

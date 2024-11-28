import { IEvent } from '@app/core';
import { AggregateRoot } from '@nestjs/cqrs';
import { ApplicationCreatedEvent } from './events/application-created.event';

export class Application extends AggregateRoot<IEvent> {
  public guid: string;

  private jobId: string;
  private firstname: string;
  private lastname: string;
  private email: string;
  private currentPosition: string;

  constructor();
  constructor(
    guid: string,
    jobId: string,
    firstname: string,
    lastname: string,
    email: string,
    currentPosition: string,
  );
  constructor(
    guid?: string,
    jobId?: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    currentPosition?: string,
  ) {
    super();

    this.guid = guid;
    this.jobId = jobId;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.currentPosition = currentPosition;

    if (guid && jobId && firstname && lastname && email && currentPosition) {
      this.apply(
        new ApplicationCreatedEvent(
          this.guid,
          this.jobId,
          this.firstname,
          this.lastname,
          this.email,
          this.currentPosition,
        ),
      );
    }
  }

  onJobCreatedEvent(event: ApplicationCreatedEvent) {
    this.guid = event.aggregateId;
    this.jobId = event.jobId;
    this.firstname = event.firstname;
    this.lastname = event.lastname;
    this.email = event.email;
    this.currentPosition = event.currentPosition;
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

import { NotFoundException, REDIS_CONNECTION } from '@app/core';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import Redis from 'ioredis';
import { ApplicationCreatedEvent } from '../../../domain/events/application-created.event';

@EventsHandler(ApplicationCreatedEvent)
export class ApplicationCreatedEventHandler
  implements IEventHandler<ApplicationCreatedEvent>
{
  constructor(
    @Inject(REDIS_CONNECTION) private readonly _redisClient: Redis,
    private readonly logger: Logger,
  ) {}

  async handle(event: ApplicationCreatedEvent) {
    const job = await this._redisClient.get(`job-copy:${event.jobId}`);
    if (!job) {
      throw new NotFoundException('Job not found.');
    }

    const parsedJob = JSON.parse(job);
    await this._redisClient.set(
      `application:${event.aggregateId}`,
      JSON.stringify({
        guid: event.guid,
        jobId: event.jobId,
        firstname: event.firstname,
        lastname: event.lastname,
        email: event.email,
        currentPosition: event.currentPosition,
        version: event.version,
        jobTitle: parsedJob?.title,
      }),
    );
    this.logger.log(`created read model for job ${event.aggregateId}`);
  }
}

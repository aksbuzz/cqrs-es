import { REDIS_CONNECTION } from '@app/core';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { JobCreatedEvent } from '../../../domain/events/job-created.event';
import Redis from 'ioredis';

@EventsHandler(JobCreatedEvent)
export class JobCreatedEventHandler implements IEventHandler<JobCreatedEvent> {
  constructor(
    @Inject(REDIS_CONNECTION) private readonly _redisClient: Redis,
    private readonly logger: Logger,
  ) {}

  async handle(event: JobCreatedEvent) {
    const job = {
      guid: event.aggregateId,
      title: event.title,
      description: event.description,
      status: event.status,
      version: event.version,
    };
    await this._redisClient.set(
      `job:${event.aggregateId}`,
      JSON.stringify(job),
    );
    this.logger.log(`created read model for job ${event.aggregateId}`);
  }
}

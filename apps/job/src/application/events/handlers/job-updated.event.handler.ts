import { REDIS_CONNECTION } from '@app/core';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { JobUpdatedEvent } from '../../../domain/events/job-updated.event';
import Redis from 'ioredis';

@EventsHandler(JobUpdatedEvent)
export class JobUpdatedEventHandler implements IEventHandler<JobUpdatedEvent> {
  constructor(@Inject(REDIS_CONNECTION) private readonly _redisClient: Redis) {}

  async handle(event: JobUpdatedEvent) {
    const job = await this._redisClient.get(`job:${event.aggregateId}`);
    if (job) {
      const parsedJob = JSON.parse(job);

      parsedJob.title = event.title;
      parsedJob.description = event.description;
      parsedJob.version = event.version;

      await this._redisClient.set(
        `job:${event.aggregateId}`,
        JSON.stringify(parsedJob),
      );
    }
  }
}

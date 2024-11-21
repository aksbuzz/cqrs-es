import { REDIS_CONNECTION } from '@app/core';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { JobArchivedEvent } from '../../../domain/events/job-archived.event';
import Redis from 'ioredis';
import { JobStatus } from '../../../domain/job-status';

@EventsHandler(JobArchivedEvent)
export class JobArchivedEventHandler
  implements IEventHandler<JobArchivedEvent>
{
  constructor(@Inject(REDIS_CONNECTION) private readonly _redisClient: Redis) {}

  async handle(event: JobArchivedEvent) {
    const job = await this._redisClient.get(`job:${event.aggregateId}`);
    if (job) {
      const parsedJob = JSON.parse(job);
      parsedJob.status = JobStatus.ARCHIVED;
      await this._redisClient.set(
        `job:${event.aggregateId}`,
        JSON.stringify(parsedJob),
      );
    }
  }
}

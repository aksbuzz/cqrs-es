import { REDIS_CONNECTION } from '@app/core';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { APPLICATION_SERVICE } from 'apps/job/src/constants';
import Redis from 'ioredis';
import { JobCreatedEvent } from '../../../domain/events/job-created.event';

@EventsHandler(JobCreatedEvent)
export class JobCreatedEventHandler implements IEventHandler<JobCreatedEvent> {
  constructor(
    @Inject(REDIS_CONNECTION) private readonly _redisClient: Redis,
    private readonly logger: Logger,
    @Inject(APPLICATION_SERVICE)
    private readonly applicationServiceClient: ClientProxy,
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

    // emit integration event
    this.applicationServiceClient.emit(
      'job-created',
      JSON.stringify({
        aggregateId: event.aggregateId,
        title: event.title,
        version: event.version,
      }),
    );
  }
}

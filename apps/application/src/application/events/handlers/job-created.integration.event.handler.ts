import { REDIS_CONNECTION } from '@app/core';
import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class JobCreatedIntegrationEventHandler {
  constructor(
    @Inject(REDIS_CONNECTION) private readonly _redisClient: Redis,
    private readonly logger: Logger,
  ) {}

  async handle(data: string) {
    const event = JSON.parse(data);
    await this._redisClient.set(
      `job-copy:${event.aggregateId}`,
      JSON.stringify({
        guid: event.aggregateId,
        title: event.title,
        version: event.version,
      }),
    );
    this.logger.log(`created copy for job ${event.aggregateId}`);
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Redis } from 'ioredis';
import { GetAllJobQuery } from './get-all-jobs.query';
import { Inject } from '@nestjs/common';
import { REDIS_CONNECTION } from '@app/core';

@QueryHandler(GetAllJobQuery)
export class GetAllJobQueryHandler implements IQueryHandler<GetAllJobQuery> {
  constructor(@Inject(REDIS_CONNECTION) private readonly _redisClient: Redis) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_: GetAllJobQuery): Promise<any> {
    const keys = await this._redisClient.keys('job:*');
    const jobs: any[] = [];

    for (const key of keys) {
      const job = await this._redisClient.get(key);
      if (job) {
        jobs.push(JSON.parse(job));
      }
    }

    return jobs;
  }
}

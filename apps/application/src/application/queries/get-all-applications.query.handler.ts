import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Redis } from 'ioredis';
import { GetAllApplicationsQuery } from './get-all-applications.query';
import { Inject } from '@nestjs/common';
import { REDIS_CONNECTION } from '@app/core';

@QueryHandler(GetAllApplicationsQuery)
export class GetAllApplicationsQueryHandler
  implements IQueryHandler<GetAllApplicationsQuery>
{
  constructor(@Inject(REDIS_CONNECTION) private readonly _redisClient: Redis) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_: GetAllApplicationsQuery): Promise<any> {
    const keys = await this._redisClient.keys('application:*');
    const applications: any[] = [];

    for (const key of keys) {
      const application = await this._redisClient.get(key);
      if (application) {
        applications.push(JSON.parse(application));
      }
    }

    return applications;
  }
}

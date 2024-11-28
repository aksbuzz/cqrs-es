import { EventStore, IEventStore, POSTGRES_CONNECTION } from '@app/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Pool } from 'pg';

@Injectable()
export class ApplicationEventStore extends EventStore implements IEventStore {
  constructor(
    @Inject(POSTGRES_CONNECTION) private readonly pool: Pool,
    private readonly eventBus: EventBus,
  ) {
    super(pool, eventBus);
  }
}

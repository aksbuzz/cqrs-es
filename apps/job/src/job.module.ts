import { CoreModule } from '@app/core';
import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JobController } from './api/job.controller';
import { ArchiveJobCommandHandler } from './application/comands/archive-job.command.handler';
import { CreateJobCommandHandler } from './application/comands/create-job.command.handler';
import { UpdateJobCommandHandler } from './application/comands/update-job.command.handler';
import { JobArchivedEventHandler } from './application/events/handlers/job-archived.event.handler';
import { JobCreatedEventHandler } from './application/events/handlers/job-created.event.handler';
import { JobUpdatedEventHandler } from './application/events/handlers/job-updated.event.handler';
import { GetAllJobQueryHandler } from './application/queries/get-all-jobs.query.handler';
import { APPLICATION_SERVICE } from './constants';
import { JobEventStore } from './infrastructure/job-event-store';
import { JobRepository } from './infrastructure/job-repository';

const CommandHandlers = [
  CreateJobCommandHandler,
  UpdateJobCommandHandler,
  ArchiveJobCommandHandler,
];
const QueryHandlers = [GetAllJobQueryHandler];
const EventHandlers = [
  JobCreatedEventHandler,
  JobUpdatedEventHandler,
  JobArchivedEventHandler,
];
const infrastructure = [JobRepository, JobEventStore];

@Module({
  imports: [
    CoreModule,
    CqrsModule,
    ClientsModule.register([
      {
        name: APPLICATION_SERVICE,
        transport: Transport.NATS,
        options: { servers: ['nats://localhost:4222'] },
      },
    ]),
  ],
  controllers: [JobController],
  providers: [
    Logger,
    ...infrastructure,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class JobModule {}

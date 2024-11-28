import { Logger, Module } from '@nestjs/common';
import { CreateApplicationCommandHandler } from './application/comands/create-application.command.handler';
import { GetAllApplicationsQueryHandler } from './application/queries/get-all-applications.query.handler';
import { JobCreatedIntegrationEventHandler } from './application/events/handlers/job-created.integration.event.handler';
import { ApplicationCreatedEventHandler } from './application/events/handlers/application-created.event.handler';
import { ApplicationRepository } from './infrastructure/application-repository';
import { ApplicationEventStore } from './infrastructure/application-event-store';
import { CoreModule } from '@app/core';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationController } from './api/application.controller';

const CommandHandlers = [CreateApplicationCommandHandler];
const QueryHandlers = [GetAllApplicationsQueryHandler];
const EventHandlers = [
  JobCreatedIntegrationEventHandler,
  ApplicationCreatedEventHandler,
];
const infrastructure = [ApplicationRepository, ApplicationEventStore];

@Module({
  imports: [CoreModule, CqrsModule],
  controllers: [ApplicationController],
  providers: [
    Logger,
    ...infrastructure,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class ApplicationModule {}

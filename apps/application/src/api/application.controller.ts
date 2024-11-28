import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllApplicationsQuery } from '../application/queries/get-all-applications.query';
import { CreateApplicationDTO } from './application.dto';
import { CreateApplicationCommand } from '../application/comands/create-application.command';
import { EventPattern } from '@nestjs/microservices';
import { JobCreatedIntegrationEventHandler } from '../application/events/handlers/job-created.integration.event.handler';

@Controller('/api/v1/applications')
export class ApplicationController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly integrationEventHandler: JobCreatedIntegrationEventHandler,
  ) {}

  @Get('health-check')
  async healthCheck(@Res() res: Response): Promise<void> {
    res.json(ok('Success', undefined));
  }

  @Get()
  async getApplications(@Res() res: Response): Promise<void> {
    const applications = await this.queryBus.execute(
      new GetAllApplicationsQuery(),
    );
    res.json(ok('Success', applications));
  }

  @Post()
  async createApplication(
    @Body() createJob: CreateApplicationDTO,
    @Res() res: Response,
  ): Promise<void> {
    const { jobId, firstname, lastname, email, currentPosition } = createJob;
    const application = await this.commandBus.execute(
      new CreateApplicationCommand(
        jobId,
        firstname,
        lastname,
        email,
        currentPosition,
      ),
    );

    res.json(ok('Created application successfully', application));
  }

  @EventPattern('job-created')
  async createJobCopy(data: string) {
    await this.integrationEventHandler.handle(data);
  }
}

const ok = (message: string, data: any) => ({
  status: 200,
  message: message,
  data: data,
});

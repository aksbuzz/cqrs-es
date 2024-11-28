import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllJobQuery } from '../application/queries/get-all-jobs.query';
import { ArchiveJobDTO, CreateJobDTO, UpdateJobDTO } from './job.dto';
import { CreateJobCommand } from '../application/comands/create-job.command';
import { UpdateJobCommand } from '../application/comands/update-job.command';
import { ArchiveJobCommand } from '../application/comands/archive-job.command';

@Controller('/api/v1/jobs')
export class JobController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('health-check')
  async healthCheck(@Res() res: Response): Promise<void> {
    res.json(ok('Success', undefined));
  }

  @Get()
  async getJobs(@Req() req: Request, @Res() res: Response): Promise<void> {
    const jobs = await this.queryBus.execute(new GetAllJobQuery());
    res.json(ok('Success', jobs));
  }

  @Post()
  async createJob(
    @Body() createJob: CreateJobDTO,
    @Res() res: Response,
  ): Promise<void> {
    const { description, title } = createJob;
    const job = await this.commandBus.execute(
      new CreateJobCommand(title, description),
    );

    res.json(ok('Created job successfully', job));
  }

  @Post(':id')
  async updateJob(
    @Body() updateJob: UpdateJobDTO,
    @Param() param: { id: string },
    @Res() res: Response,
  ): Promise<void> {
    const { description, title, version } = updateJob;
    await this.commandBus.execute(
      new UpdateJobCommand(param.id, title, description, version),
    );
    res.json(ok('Updated job successfully', undefined));
  }

  @Post(':id/archive')
  async archiveJob(
    @Body() archiveJob: ArchiveJobDTO,
    @Param() param: { id: string },
    @Res() res: Response,
  ): Promise<void> {
    const { version } = archiveJob;
    await this.commandBus.execute(new ArchiveJobCommand(param.id, version));
    res.json(ok('Archived job successfully', undefined));
  }
}

const ok = (message: string, data: any) => ({
  status: 200,
  message: message,
  data: data,
});

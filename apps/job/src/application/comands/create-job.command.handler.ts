import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Job } from '../../domain/job';
import { JobRepository } from '../../infrastructure/job-repository';
import { CreateJobCommand } from './create-job.command';

@CommandHandler(CreateJobCommand)
export class CreateJobCommandHandler
  implements ICommandHandler<CreateJobCommand>
{
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(command: CreateJobCommand): Promise<any> {
    const job: Job = new Job(command.guid, command.title, command.description);
    await this.jobRepository.save(job, -1);
    return { guid: command.guid };
  }
}

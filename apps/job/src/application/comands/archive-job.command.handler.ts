import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ArchiveJobCommand } from './archive-job.command';
import { JobRepository } from '../../infrastructure/job-repository';

@CommandHandler(ArchiveJobCommand)
export class ArchiveJobCommandHandler
  implements ICommandHandler<ArchiveJobCommand>
{
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(command: ArchiveJobCommand): Promise<void> {
    const job = await this.jobRepository.getById(command.guid);
    job.archive();
    await this.jobRepository.save(job, command.originalVersion);
  }
}

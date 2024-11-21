import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JobRepository } from '../../infrastructure/job-repository';
import { UpdateJobCommand } from './update-job.command';

@CommandHandler(UpdateJobCommand)
export class UpdateJobCommandHandler
  implements ICommandHandler<UpdateJobCommand>
{
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(command: UpdateJobCommand): Promise<void> {
    const job = await this.jobRepository.getById(command.guid);
    job.updateInfo(command.title, command.description);
    await this.jobRepository.save(job, command.originalVersion);
  }
}

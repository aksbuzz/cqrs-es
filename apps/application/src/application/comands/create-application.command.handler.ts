import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Application } from '../../domain/application';
import { ApplicationRepository } from '../../infrastructure/application-repository';
import { CreateApplicationCommand } from './create-application.command';

@CommandHandler(CreateApplicationCommand)
export class CreateApplicationCommandHandler
  implements ICommandHandler<CreateApplicationCommand>
{
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async execute(command: CreateApplicationCommand): Promise<any> {
    const job: Application = new Application(
      command.guid,
      command.jobId,
      command.firstname,
      command.lastname,
      command.email,
      command.currentPosition,
    );

    await this.applicationRepository.save(job, -1);
    return { guid: command.guid };
  }
}

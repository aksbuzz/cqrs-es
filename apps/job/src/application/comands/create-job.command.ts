import { Command } from '@app/core';

export class CreateJobCommand extends Command {
  public title: string;
  public description: string;

  constructor(title: string, description: string, guid?: string) {
    super(guid);
    this.title = title;
    this.description = description;
  }
}

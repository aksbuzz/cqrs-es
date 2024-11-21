import { ICommand } from '@nestjs/cqrs';
import { nanoid } from 'nanoid';

export class Command implements ICommand {
  public guid: string;

  constructor(guid?: string) {
    this.guid = guid || nanoid();
  }
}

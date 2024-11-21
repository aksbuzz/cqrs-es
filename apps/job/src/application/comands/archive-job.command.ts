import { Command } from '@app/core';

export class ArchiveJobCommand extends Command {
  public readonly originalVersion: number;

  constructor(guid: string, originalVersion: number) {
    super(guid);
    this.originalVersion = originalVersion;
  }
}

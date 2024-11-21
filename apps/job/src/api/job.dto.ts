export class CreateJobDTO {
  title: string;
  description: string;
}

export class UpdateJobDTO extends CreateJobDTO {
  version: number;
}

export class ArchiveJobDTO {
  version: number;
}

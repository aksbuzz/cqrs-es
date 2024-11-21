export class ApplicationError extends Error {
  public readonly httpCode: number;

  constructor(httpCode: number, message: string) {
    super(message);
    this.httpCode = httpCode;
  }
}

export class NotFoundException extends ApplicationError {
  constructor(message: string) {
    super(404, message);
  }
}

export class BadRequestException extends ApplicationError {
  constructor(message: string) {
    super(400, message);
  }
}

export class ConflictException extends ApplicationError {
  constructor(message: string) {
    super(409, message);
  }
}

export class InternalServerException extends ApplicationError {
  constructor(message: string) {
    super(500, message);
  }
}

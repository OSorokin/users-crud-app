import { HttpError } from 'routing-controllers/error/http/HttpError';

export class BaseError extends HttpError {
  public body: any;
  public status: number;
  public statusText: string;
  public name: string;

  constructor(code: number, message?: string, body?: any) {
    super(code, message);
    this.body = body;
    this.status = code;
    this.statusText = message;
  }
}

export class BadRequest extends BaseError {

  constructor(message?: string, body?: any) {
    super(400, message || 'Bad Request', body);
    this.name = "BadRequest";
  }
}

export class NotFound extends BaseError {

  constructor(message?: string, body?: any) {
    super(404, message || 'Not Found', body);
    this.name = "NotFound";
  }
}

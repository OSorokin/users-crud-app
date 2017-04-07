import * as winston from 'winston';
import config from '../configuration';
import { getLogger } from '../logger/logger';
import { ValidationError, ValidatorOptions, Validator } from 'class-validator';
import { BadRequest } from '../Errors';

export default class BaseController {
  protected logger: winston.LoggerInstance;
  protected config = config;
  private validator = new Validator();

  protected constructor(filename: string) {
    this.logger = getLogger(filename);
  }

  protected ok(): string {
    return 'OK';
  }

  protected async validate<T>(object: T, validatorOptions?: ValidatorOptions) {
    const errors: ValidationError[] = await this.validator.validate(object, validatorOptions);
    if (errors != null && errors.length > 0) {
      throw new BadRequest('Invalid credentials', errors)
    }
  }

}
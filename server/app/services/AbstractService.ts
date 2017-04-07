import * as winston from 'winston';
import config from '../configuration';
import { getLogger } from '../logger/logger';
import { ValidationError, Validator, ValidatorOptions } from 'class-validator';
import { BadRequest } from '../Errors';

export default class AbstractService {
  protected logger: winston.LoggerInstance;
  protected config = config;
  private validator = new Validator();

  constructor(filename: string) {
    this.logger = getLogger(filename);
  }

  protected async validate<T>(object: T, validatorOptions?: ValidatorOptions) {
    const errors: ValidationError[] = await this.validator.validate(object, validatorOptions);

    if (errors != null && errors.length > 0) {
      throw new BadRequest('Invalid credentials', errors)
    }
  }

}
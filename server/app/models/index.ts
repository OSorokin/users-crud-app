import * as _ from 'lodash';
import * as Sequelize from 'sequelize';
import { USERS_CRUD_APP_ORM } from '../../typings';

export import User = require('./User');
export import Position = require('./Position');
export import Project = require('./Project');

export function initializeSequelizeModels(connection: Sequelize.Sequelize): void {

  const models = module.exports;
  const modelsList: USERS_CRUD_APP_ORM.Model<any, any>[] = [];

  modelsList.push(User.initialize(connection));
  modelsList.push(Position.initialize(connection));
  modelsList.push(Project.initialize(connection));

  _.forEach(modelsList, (model) => {
    if (model.hasOwnProperty('associate')) {
      model.associate(models);
    }
    if (model.hasOwnProperty('addScopes')) {
      model.addScopes(models);
    }
  });
}

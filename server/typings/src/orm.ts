import * as Sequelize from 'sequelize';

export namespace USERS_CRUD_APP_ORM {
  export interface Model<TInstance, TAttributes> extends Sequelize.Model<TInstance, TAttributes>, ClassMethods {
    addScope(name: string, scope: Sequelize.FindOptions | Function, options?: {override: boolean});
  }

  export interface ClassMethods {
    associate(models): void;
    addScopes?(models): void;
  }
}
import * as Sequelize from 'sequelize';
import { USERS_CRUD_APP_ORM } from '../../typings';
import { User } from './index';

namespace Project {

  export interface Class extends USERS_CRUD_APP_ORM.Model<Instance, Attributes>, ClassMethods {
    scope(options?: string | Array<string> | Sequelize.ScopeOptions | Sequelize.WhereOptions): this;
  }

  export interface Instance extends Sequelize.Instance<Attributes>, Attributes {
  }

  export interface ClassMethods extends USERS_CRUD_APP_ORM.ClassMethods {
    findOneById(id: number): Promise<User.Instance>
  }

  export interface Attributes {
    id?: number;
    title?: string;
  }

  export let Model: Class;

  function getClassMethods(): ClassMethods {
    return {
      associate: function (models) {
        Model.belongsTo(models.User.Model, {
          as: 'user',
        });
      },
      findOneById: function (id): Promise<Project.Instance> {
        return this.findOne({
          where: {
            id: id
          }
        });
      },
    };
  }

  export function initialize(connection: Sequelize.Sequelize): Project.Class {
    Model = <Class> connection.define<Instance, Attributes>('project', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(250),
        field: 'title'
      }
    },
      {
      underscored: true,
      freezeTableName: true,
      instanceMethods: {
      },
    });
    return Model;
  }
}

export = Project;



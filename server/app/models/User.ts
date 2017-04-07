import * as Sequelize from 'sequelize';
import { USERS_CRUD_APP_ORM } from '../../typings';
import { Position, Project } from './index';
import { UserGenderDto } from '../../../common/main/dto/IUserDto';

namespace User {

  export class Scopes {
    public static INCLUDE_POSITION: string = 'INCLUDE_POSITION';
    public static INCLUDE_PROJECT: string = 'INCLUDE_PROJECT';
  }

  export interface Class extends USERS_CRUD_APP_ORM.Model<Instance, Attributes>, ClassMethods {
    scope(options?: string | Array<string> | Sequelize.ScopeOptions | Sequelize.WhereOptions): this;
  }

  export interface Instance extends Sequelize.Instance<Attributes>, Attributes {

    getProject: Sequelize.HasOneGetAssociationMixin<Project.Instance>;
    setProject: Sequelize.HasOneSetAssociationMixin<Project.Instance, number>;

    getPosition: Sequelize.HasOneGetAssociationMixin<Position.Instance>;
    setPosition: Sequelize.HasOneSetAssociationMixin<Position.Instance, number>;
  }

  export interface ClassMethods extends USERS_CRUD_APP_ORM.ClassMethods {
    findOneById(id: number): Promise<User.Instance>
  }

  export interface Attributes {
    id?: number;
    name?: string;
    surname?: string;
    gender?: UserGenderDto;
    birth_date?: string;
    email?: string;
    positionId?: number;
    projectId?: number;
    position?: Position.Instance,
    project?: Project.Instance
  }

  export let Model: Class;

  function getClassMethods(): ClassMethods {
    return {
      associate: function (models) {
        Model.belongsTo(models.Position.Model, {
          as: 'position'
        });
        Model.belongsTo(models.Project.Model, {
          as: 'project'
        });
      },
      addScopes: function (models) {
        Model.addScope(Scopes.INCLUDE_POSITION, function () {
          return {
            include: [
              {
                model: models.Position.Model,
                as: 'position'
              }
            ]
          }
        });
        Model.addScope(Scopes.INCLUDE_PROJECT, function () {
          return {
            include: [
              {
                model: models.Project.Model,
                as: 'project'
              }
            ]
          }
        });
      },
      findOneById: function (id): Promise<User.Instance> {
        return this.findOne({
          where: {
            id: id
          }
        });
      },

    };
  }

  export function initialize(connection: Sequelize.Sequelize): User.Class {
    Model = <Class> connection.define<Instance, Attributes>('user', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(250),
        field: 'name',
      },
      surname: {
        type: Sequelize.STRING(250),
        field: 'surname',
      },
      gender: {
        type: Sequelize.INTEGER,
        field: 'gender',
      },
      birth_date: {
        type: Sequelize.STRING(250),
        field: 'birth_date',
      },
      email: {
        type: Sequelize.STRING(50),
        field: 'email'
      },
      positionId: {
        type: Sequelize.BIGINT,
        field: 'position_id'
      },
      projectId: {
        type: Sequelize.BIGINT,
        field: 'project_id'
      },
    },{
      underscored: true,
      freezeTableName: true,
      instanceMethods: {},
      classMethods: getClassMethods()
    });
    return Model;
  }
}

export = User;
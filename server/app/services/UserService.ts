import * as _ from 'lodash';
import * as Sequelize from 'sequelize';
import { UserDto } from '../dto/UserDto';
import { User, Project, Position } from '../models/index';
import { UserMapper } from '../mappers/UserMapper';
import connection from '../db/connection';
import AbstractService from './AbstractService';
import { NotFound, BadRequest } from '../Errors';

class UserService extends AbstractService {

  constructor() {
    super(__filename);
  }

  public async findOne(userId: number): Promise<UserDto> {

    const user: User.Instance = await User.Model.scope([User.Scopes.INCLUDE_POSITION,User.Scopes.INCLUDE_PROJECT]).findById(userId);

    if (user == null) {
      throw new NotFound('User not found');
    }

    return UserMapper.mapToDto(user);
  }

  public async findAll(): Promise<UserDto[]> {

    const users = await User.Model.scope([User.Scopes.INCLUDE_POSITION,User.Scopes.INCLUDE_PROJECT]).findAll();

    return _.map(users, (u: User.Instance) => {
      return UserMapper.mapToDto(u);
    })
  }

  public async create(userDto: UserDto): Promise<UserDto> {
    const user: User.Instance = await connection.transaction(async(t: Sequelize.Transaction) => {
      const user = UserMapper.mapToInstance(User.Model.build(), userDto);
      const newUser = await user.save({transaction: t});
      const project = await this.getValidProject(userDto, t);
      const position = await this.getValidPosition(userDto, t);
      await newUser.setProject(project, {transaction: t});
      await newUser.setPosition(position, {transaction: t});
      newUser.project = project;
      newUser.position = position;
      return newUser;
    });
    return UserMapper.mapToDto(user);
  }

  public async update( userId: number, userDto: UserDto ): Promise<UserDto> {

    const user: User.Instance = await  connection.transaction(async(t: Sequelize.Transaction) => {
      let user = await User.Model.findById(userId, {transaction: t});

      if (user.id != userId) {
        throw new NotFound('User not found');
      }

      user = UserMapper.mapToInstance(user, userDto);

      const project = await this.getValidProject(userDto, t);
      const position = await this.getValidPosition(userDto, t);
      await user.setProject(project, {transaction: t});
      await user.setPosition(position, {transaction: t});
      user.project = project;
      user.position = position;

      return await user.save({transaction: t});
    });

    return UserMapper.mapToDto(user);
  }

  public async delete( userId: number): Promise<void> {

    return await connection.transaction(async(t: Sequelize.Transaction) => {
      let user = await User.Model.findById(userId, {transaction: t});

      if (user == null || user.id != userId) {
        throw new NotFound('User not found');
      }

      return await user.destroy({transaction: t});
    });

  }

  private async getValidProject(dto: UserDto, t: Sequelize.Transaction): Promise<Project.Instance> {
    const id = dto.project.id;
    const project = await Project.Model.findById(id, {transaction: t});

    if (id != project.id) {
      throw new BadRequest('Invalid credentials');
    }

    return project;
  }

  private async getValidPosition(dto: UserDto, t: Sequelize.Transaction): Promise<Position.Instance> {
    const id = dto.position.id;
    const position = await Position.Model.findById(id, {transaction: t});

    if (id != position.id) {
      throw new BadRequest('Invalid credentials');
    }

    return position;
  }

}

export default new UserService();

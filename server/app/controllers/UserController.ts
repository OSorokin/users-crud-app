import BaseController from './BaseController';
import { JsonController, Get, Req, Post, Delete, Body, Put, Param } from 'routing-controllers/index';
import UserService from '../services/UserService';
import { UserDto } from '../dto/UserDto';
import { USERS_CRUD_APP_HTTP } from '../../typings';
import { Locations } from '../../../common/index';
import forEach = require('lodash/forEach');
const logger = require('../logger/logger').getLogger(__filename);

@JsonController(Locations.API)
export default class UserController extends BaseController {

  constructor() {
    super(__filename);
  }

  @Post(Locations.User.CREATE)
  async createUser(@Req() req: USERS_CRUD_APP_HTTP.Request, @Body() user: UserDto): Promise<UserDto> {
    return UserService.create(user);
  }

  @Get(Locations.User.GET_ONE)
  getUser(@Param('id') userId: number): Promise<UserDto> {
    return UserService.findOne(userId);
  }

  @Get(Locations.User.GET_ALL)
  getUsers(@Req() req: USERS_CRUD_APP_HTTP.Request): Promise<UserDto[]> {
    return UserService.findAll();
  }

  @Put(Locations.User.UPDATE)
  async updateUser(@Param('id') userId: number, @Body() user: UserDto): Promise<UserDto> {
    await this.validate(user);
    return UserService.update( userId, user,);
  }

  @Delete(Locations.User.DELETE)
  async deleteUser(@Param('id') userId: number ): Promise<void> {
     return UserService.delete( userId );
  }

}

import BaseController from './BaseController';
import { JsonController, Get, Req, Post, Body, Param } from 'routing-controllers/index';
import PositionService from '../services/PositionService';
import { USERS_CRUD_APP_HTTP } from '../../typings';
import { PositionDto } from '../dto/PositionDto';
import { Locations } from '../../../common/index';

@JsonController('/api')
export default class PositionController extends BaseController {

  constructor() {
    super(__filename);
  }

  @Post(Locations.Position.CREATE)
  async create( @Body() project: PositionDto): Promise<PositionDto> {
    return PositionService.create(project);
  }

  @Get(Locations.Position.GET_ONE)
  getPosition(@Param('id') posId: number): Promise<PositionDto> {
    return PositionService.findOne( posId );
  }

  @Get(Locations.Position.GET_ALL)
  getPositions(@Req() req: USERS_CRUD_APP_HTTP.Request): Promise<PositionDto[]> {
    return PositionService.findAll();
  }

}

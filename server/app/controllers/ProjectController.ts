import BaseController from './BaseController';
import { JsonController, Get, Req, Body, Post, Param } from 'routing-controllers/index';
import ProjectService from '../services/ProjectService';
import { USERS_CRUD_APP_HTTP } from '../../typings';
import { ProjectDto } from '../dto/ProjectDto';
import { Locations } from '../../../common/index';

@JsonController('/api')
export default class ProjectController extends BaseController {

  constructor() {
    super(__filename);
  }

  @Post(Locations.Project.CREATE)
  async create( @Body() project: ProjectDto): Promise<ProjectDto> {
    return ProjectService.create(project);
  }

  @Get(Locations.Project.GET_ONE)
  getProject(@Param('id') projectId: number): Promise<ProjectDto> {
    return ProjectService.findOne( projectId );
  }

  @Get(Locations.Project.GET_ALL)
  getProjects(@Req() req: USERS_CRUD_APP_HTTP.Request): Promise<ProjectDto[]> {
    return ProjectService.findAll();
  }

}

import * as _ from 'lodash';
import * as Sequelize from 'sequelize';
import { Project } from '../models/index';
import { ProjectMapper } from '../mappers/ProjectMapper';
import { ProjectDto } from '../dto/ProjectDto';
import connection from '../db/connection';
import AbstractService from './AbstractService';
import { NotFound } from '../Errors';

class ProjectService extends AbstractService {

  constructor() {
    super(__filename);
  }

  public async findOne(projectId: number): Promise<ProjectDto> {

    const pos: Project.Instance = await Project.Model.scope().findById(projectId);

    if (pos == null) {
      throw new NotFound('User not found');
    }

    return ProjectMapper.mapToDto(pos);
  }

  public async findAll(): Promise<ProjectDto[]> {

    const projects = await Project.Model.findAll();

    return _.map(projects, (p: Project.Instance) => {
      return ProjectMapper.mapToDto(p);
    })
  }

  public async create(dto: ProjectDto): Promise<ProjectDto> {
    return connection.transaction(async(t: Sequelize.Transaction) => {
      const project = ProjectMapper.mapToInstance(Project.Model.build(), dto);

      await project.validate();
      await project.save({transaction: t});

      return ProjectMapper.mapToDto(project);
    });
  }

}

export default new ProjectService();


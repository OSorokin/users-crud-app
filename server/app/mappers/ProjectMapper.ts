import { Project } from '../models/index';
import { ProjectDto } from '../dto/ProjectDto';

export class ProjectMapper {

  static mapToDto(instance: Project.Instance): ProjectDto {
    const dto: ProjectDto = new ProjectDto();
    dto.id = instance.id;
    dto.title = instance.title;
    return dto;
  }

  static mapToInstance(instance: Project.Instance, dto: ProjectDto): Project.Instance {
    instance.id = dto.id;
    instance.title = dto.title;
    return instance;
  }
}
import { User } from '../models/index';
import { UserDto } from '../dto/UserDto';
import { ProjectMapper } from './ProjectMapper';
import { PositionMapper } from './PositionMapper';

export class UserMapper {

  static mapToDto(user: User.Instance): UserDto {

    let dto: UserDto = new UserDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.surname = user.surname;
    dto.gender = user.gender;
    dto.birth_date = user.birth_date;
    dto.email = user.email;
    dto.project = ProjectMapper.mapToDto(user.project);
    dto.position = PositionMapper.mapToDto(user.position);
    return dto;
  }

  static mapToInstance(instance: User.Instance, dto: UserDto): User.Instance {
    instance.name = dto.name;
    instance.surname = dto.surname;
    instance.gender = dto.gender;
    instance.birth_date = dto.birth_date;
    instance.email = dto.email;
    instance.projectId = dto.project.id;
    instance.positionId = dto.position.id;
    return instance;
  }

}
import { IUserDto, IProjectDto, IPositionDto } from '../../../common/index';
import { UserGenderDto } from '../../../common/main/dto/IUserDto';

export class UserDto implements IUserDto {
  id?: number;

  name: string;

  surname: string;

  gender: UserGenderDto;

  birth_date: string;

  email: string;

  project: IProjectDto;

  position: IPositionDto;
}

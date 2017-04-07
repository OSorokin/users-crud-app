import { Project } from './project.model';
import { Position } from './position.model';
import { IUserDto, UserGenderDto } from '../../../../../common/main/dto/IUserDto';

export class User implements IUserDto{

  id?: number;
  name: string;
  surname: string;
  birth_date: string;
  gender: UserGenderDto;
  email: string;
  position: Position;
  project: Project;

  constructor( values: Object = {} ) {
    Object.assign( this, values);
  }

}

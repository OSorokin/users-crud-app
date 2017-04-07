import { IProjectDto } from './IProjectDto';
import { IPositionDto } from './IPositionDto';

export enum UserGenderDto {
  MALE = 0,
  FEMALE = 1
}

export interface IUserDto {
  id?: number;
  name: string;
  surname: string;
  gender: UserGenderDto;
  birth_date: string;
  email: string;
  position: IPositionDto;
  project: IProjectDto;
}

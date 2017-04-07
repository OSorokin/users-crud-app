import { IProjectDto } from '../../../../../common/main/dto/IProjectDto';

export class Project implements IProjectDto{
  id: number;
  title: string;
}
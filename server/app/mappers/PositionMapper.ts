import { Position } from '../models/index';
import { PositionDto } from '../dto/PositionDto';

export class PositionMapper {

  static mapToDto(instance: Position.Instance): PositionDto {
    const dto: PositionDto = new PositionDto();
    dto.id = instance.id;
    dto.title = instance.title;
    return dto;
  }

  static mapToInstance(instance: Position.Instance, dto: PositionDto): Position.Instance {
    instance.id = dto.id;
    instance.title = dto.title;
    return instance;
  }
}
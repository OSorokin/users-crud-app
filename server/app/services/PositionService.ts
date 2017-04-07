import * as _ from 'lodash';
import * as Sequelize from 'sequelize';
import { Position } from '../models/index';
import { PositionMapper } from '../mappers/PositionMapper';
import { PositionDto } from '../dto/PositionDto';
import connection from '../db/connection';
import AbstractService from './AbstractService';
import { NotFound } from '../Errors';

class PositionService extends AbstractService {

  constructor() {
    super(__filename);
  }

  public async findOne(posId: number): Promise<PositionDto> {

    const pos: Position.Instance = await Position.Model.scope().findById(posId);

    if (pos == null) {
      throw new NotFound('User not found');
    }

    return PositionMapper.mapToDto(pos);
  }

  public async findAll(): Promise<PositionDto[]> {

    const poss = await Position.Model.findAll();

    return _.map(poss, (p: Position.Instance) => {
      return PositionMapper.mapToDto(p);
    })
  }

  public async create(dto: PositionDto): Promise<PositionDto> {
    return connection.transaction(async(t: Sequelize.Transaction) => {
      const position = PositionMapper.mapToInstance(Position.Model.build(), dto);

      await position.validate();
      await position.save({transaction: t});

      return PositionMapper.mapToDto(position);
    });
  }

}

export default new PositionService();


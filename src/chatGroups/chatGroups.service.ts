import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotEquals, notEquals } from 'class-validator';
import { BaseService } from 'src/abstract';
import { Not, Repository } from 'typeorm';
import { ChatGroups } from './chatGroups.entity';

@Injectable()
export class ChatGroupsService extends BaseService {
  constructor(
    @InjectRepository(ChatGroups, process.env.POSTGRES_CONNECTION_NAME)
    private readonly groupsRepository: Repository<ChatGroups>,
  ) {
    super();
  }
  async findAll(request : any) {
    try {
      const found = await this.groupsRepository.find({where : {is_archived : false , org_id : request.org_id , type_id : Not(7)}});
      return this._apiResponse(found);
    } catch (error) {
      return this._getBadRequestError(error.message);
    }
  }
  async findChatGroupsByLegancyId(legacy_id: any) {
    try {
      return await this.groupsRepository.findOne({ where: { legacy_id: legacy_id } });
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }
}

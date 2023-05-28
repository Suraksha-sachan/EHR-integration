import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/abstract';
import { ChatGroupsService } from 'src/chatGroups/chatGroups.service';
import { optimusDecode } from 'src/utils/common';
import { Repository } from 'typeorm';
import { FaxNumberChatDto } from './faxNumberChat.dto';
import { FaxNumberChat } from './faxNumberChat.entity';

@Injectable()
export class FaxNumberChatService extends BaseService {
  constructor(
    @InjectRepository(FaxNumberChat)
    private readonly faxNumberChatRepository: Repository<FaxNumberChat>,
    private readonly chatGroupsService: ChatGroupsService,
  ) {
    super();
  }
  async findAll(request : any) {
    try {
      if(request){
      const found =  await this.faxNumberChatRepository.find({where : {org_id : request.org_id}});
      return this._apiResponse(found);
      }
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }
  async findFaxNumberChatById(id: any) {
    try {
      const findFaxNumberChat = await this.faxNumberChatRepository.findOne({ where: { id: id } });
      if (!findFaxNumberChat) {
        return this._getNotFoundError(`Can't find fax number chat with ID : ${id}`);
      }
      return this._apiResponse(findFaxNumberChat);
    } catch (error) {
      return this._getBadRequestError(error.message);
    }
  }
  async findFaxNumberChatByUUID(uuid: any) {
    try {
      const id = await optimusDecode(uuid);
      const findFaxNumberChat = await this.faxNumberChatRepository.findOne({ where: { id: id } });
      if (!findFaxNumberChat) {
        return this._getNotFoundError(`Can't find fax number chat with UUID : ${uuid}`);
      }
      return this._apiResponse(findFaxNumberChat);
    } catch (error) {
      return this._getBadRequestError(error.message);
    }
  }
  async createFaxNumberChat({ ...payload }: Partial<FaxNumberChatDto> , request : any) {
    try {
      if(!payload.chat_id) return this._getBadRequestError('chat_id field is required');
      if(!payload.fax_number) return this._getBadRequestError('fax_number field is required');
      const groupName = [];
      await Promise.all(
        payload.chat_id.map(async (item) => {
          const groupChats = await this.chatGroupsService.findChatGroupsByLegancyId(item);
          groupName.push(groupChats.name);
        })
      )
      const created = this.faxNumberChatRepository.create({
        org_id: request.org_id,
        created_by: request.id,
        fax_chat_id: payload.chat_id,
        fax_channel_name: groupName,
        ...payload,
      });
      const faxData = await this.faxNumberChatRepository.save(created);
      return await this.findFaxNumberChatById(faxData.id);
    } catch (error) {
      return this._getBadRequestError(error.message);
    }
  }

  async updateFaxNumberChat(uuid: number, { ...payload }: Partial<FaxNumberChatDto>) {
    try {
      if(!payload.chat_id) return this._getBadRequestError('chat_id field is required.');
      const id = await optimusDecode(uuid);
      const groupName = [];
      const foundFaxNumberChat = await this.findFaxNumberChatByUUID(uuid);
      if (!foundFaxNumberChat) {
        return this._getNotFoundError(`Can't find fax number chat with UUID: ${uuid}`);
      }
      await Promise.all(
        payload.chat_id.map(async (item) => {
          const groupChats = await this.chatGroupsService.findChatGroupsByLegancyId(item);
          groupName.push(groupChats.name);
        })
      )
      const updatedFaxNumberChat = await this.faxNumberChatRepository.update(id, {
        ...(payload.chat_id && { fax_chat_id: payload.chat_id }),
        ...({ fax_channel_name: groupName }),
      });
      return await this.findFaxNumberChatById(id);

    } catch (error) {
      return this._getBadRequestError(error.message);
    }
  }

  async deleteFaxNumberChat(uuid: number) {
    try {
      const id = await optimusDecode(uuid);
      const foundFaxNumberChat = await this.findFaxNumberChatByUUID(uuid);
      if (!foundFaxNumberChat) {
        return this._getNotFoundError(`Can't find fax number chat with UUID : ${uuid}`);
      }
      await this.faxNumberChatRepository.delete(id);
      return { 'message': `Fax Number Chat with UUID : ${uuid} deleted successfully.` };
    } catch (error) {
      return this._getBadRequestError(error.message);
    }
  }

}

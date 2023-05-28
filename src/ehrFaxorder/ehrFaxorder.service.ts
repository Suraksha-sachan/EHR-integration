import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/abstract';
import { optimusDecode } from 'src/utils/common';
import { Repository } from 'typeorm';
import { EhrFaxorderDto } from './ehrFaxorder.dto';
import { EhrFaxOrder } from './ehrFaxorder.entity';

@Injectable()
export class EhrFaxorderService extends BaseService {
  constructor(
    @InjectRepository(EhrFaxOrder)
    private ehrFaxOrderBotRepository: Repository<EhrFaxOrder>,
  ) {
    super();
  }

  async findAll(request : any) {
    try {
          if(request){
          const found = await this.ehrFaxOrderBotRepository.find({where : {org_id : request.org_id }});
          return this._apiResponse(found);
          }
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }

  async updateEhrFaxOrder(uuid: number, { ...payload }: Partial<EhrFaxorderDto> , request : any) {
    try {
      const id = await optimusDecode(uuid);
      const foundEhrFaxOrder = await this.ehrFaxOrderBotRepository.findOne({ where: { id } });

      if (!foundEhrFaxOrder) {
        return this._getNotFoundError(`Can't find ehr fax order with ID : ${id}`);
      }
      await this.ehrFaxOrderBotRepository.update(id, {
        ...({ active: payload.active }),
      });
      const response = await this.ehrFaxOrderBotRepository.findOne({ where: { id } });
      return this._apiResponse(response);

    } catch (error) {
      return this._getBadRequestError(error.message);
    }
  }
}

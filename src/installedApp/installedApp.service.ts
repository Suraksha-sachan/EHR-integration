import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/abstract';
import { Repository } from 'typeorm';
import { AppCategories } from './entities/appCategories.entity';
import { Apps } from './entities/apps.entity';
import { AppSubmissions } from './entities/appSubmissions.entity';
import { BotTokens } from './entities/botTokens.entity';

@Injectable()
export class InstalledAppService extends BaseService {
  constructor(
    @InjectRepository(BotTokens)
    private readonly botTokensRepository: Repository<BotTokens>,
  ) {
    super();
  }
  async getInstalledApp(request : any) {
    try {
      const response = await this.botTokensRepository
        .createQueryBuilder('bot_tokens')
        .select(['a.name as name, ac.name as type, a.is_first_party , a.hash_id as app_id,a.active'])
        .where(`bot_tokens.org_id = ${request.org_id}`)
        .andWhere('asub.app_id = bot_tokens.app_id')
        .andWhere('ac.id =asub.category_id ')
        .andWhere('a.id = bot_tokens.app_id')
        .innerJoin(AppSubmissions, 'asub')
        .innerJoin(AppCategories, 'ac')
        .innerJoin(Apps, 'a')
        .groupBy('a.name,ac.name,a.is_first_party,a.hash_id,a.active')
        .getRawMany()
      return this._apiResponse(response);
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }
}

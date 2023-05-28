import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/abstract";
import { Repository } from "typeorm";
import { DexcomConfiguration } from "./dexcomConfiguration.entity";

@Injectable()
export class DexcomConfigurationService extends BaseService {
  constructor(
    @InjectRepository(DexcomConfiguration, process.env.BOTS_CONNECTION_NAME)
    private readonly dexcomConfigurationRepository: Repository<DexcomConfiguration> ) {
    super();
  }

  async findDexcomConfiguration(uuid : number) {
    try {
      const result = await this.dexcomConfigurationRepository.query(`SELECT dc.docsink_bot_token , do2.id as orgid from integration.dexcom_configuration dc 
      left join integration.docsink_organization do2 
      on do2 .id = dc.docsink_organization 
      where do2.uuid = ${uuid}
      and dc.enabled = true;`);
      return result;

    } catch (err) {
      return this._getBadRequestError(`Get:dexcom_configuration data query failed.`);
    }
  }
}
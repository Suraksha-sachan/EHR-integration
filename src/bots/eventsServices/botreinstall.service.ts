import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";

@Injectable()
export class BotUninstallService extends BaseService {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  async getBotConfiguration(bot_configuration_name: string, org_uuid: number) {
    try {
      let find = await this.httpService.axiosRef.get(
        `${process.env.BOTS_API_URL}/items/${bot_configuration_name}`,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
          params: {
            fields: "id",
            filter: `{"docsink_organization":{"uuid":{"_eq":${org_uuid}}}}`,
          },
        }
      );

      return find.data;
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }

  async updateBotConfiguration(
    bot_configuration_name: string,
    botId: number,
    data: any
  ) {
    try {
      let update = await this.httpService.axiosRef.patch(
        `${process.env.BOTS_API_URL}/items/${bot_configuration_name}/${botId}`,
        data,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        }
      );

      return update.data;
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }

  async botuninstall(botConfigurationId: number,
    bot_configuration_name: string,
    data: any) {
    try {
      let botuninstall = await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/${bot_configuration_name}/${botConfigurationId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${process.env.BOTS_API_TOKEN}`
          },
        })
      return botuninstall.data;
    }
    catch (error) {
      return this._getBadRequestError(error.message)
    }
  }
}

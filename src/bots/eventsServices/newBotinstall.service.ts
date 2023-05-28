import { HttpService } from "@nestjs/axios";
import { Injectable, Param } from "@nestjs/common";
import { BaseService } from "src/abstract";

@Injectable()
export class NewBotInstallService extends BaseService {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  async captureOrganizationCount(org_uuid: number) {
    try {
      let capture = await this.httpService.axiosRef.get(
        `${process.env.BOTS_API_URL}/items/docsink_organization`,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
          params: {
            fields: "id",
            filter: `{ "uuid": { "_eq": ${org_uuid}}}`,
          },
        }
      );
      return capture.data;
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }

  async createDocsInkOrganizationtoBotDb(botInfo) {
    try {
      let create = await this.httpService.axiosRef.post(
        `${process.env.BOTS_API_URL}/items/docsink_organization`,
        botInfo,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        }
      );

      return create.data;
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }

  async createBotConfiguration(botData, bot_configuration_name) {
    try {
      let createbot = await this.httpService.axiosRef.post(
        `${process.env.BOTS_API_URL}/items/${bot_configuration_name}`,
        botData,
        {
          headers: {
            Authorization: `Bearer ${process.env.BOTS_API_TOKEN}`,
          },
        }
      );

      return createbot.data;
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }

  async getBotConfigurations(org_uuid: number) {
    try {
      let api = `${process.env.BOTS_API_URL}/items/docsink_organization?fields=bot_configurations.*&filter={"uuid":${org_uuid}}`;

      let botInfo = await this.httpService.axiosRef.get(`${api}`, {
        headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
      });

      return botInfo.data;
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }

  async updateBotConfigurations(docsink_org_id, newConfig) {
    try {
      let updateConfig = await this.httpService.axiosRef.patch(
        `${process.env.BOTS_API_URL}/items/docsink_organization/${docsink_org_id}`,
        newConfig,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        }
      );

      return updateConfig.data;
    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }
}

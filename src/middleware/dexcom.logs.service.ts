import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class DexcomLogservice extends BaseService {
  constructor(
    private readonly httpService: HttpService) {
    super();
  }

  async saveLogdata(data: any) {

    try {
      const saveLogs = {
        statuscode: data.statuscode ? data.statuscode : null,
        endpoint: data?.endpoint,
        method: data?.method,
        request_data: data?.request_data,
        response_data: data?.response_data,
        access_token: data.access_token ? data.access_token : null
      }
      await this.httpService.axiosRef.post(
        `${process.env.BOTS_API_URL}/items/dexcom_logs`,
        saveLogs,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        }
      );

    } catch (error) {
      this._getBadRequestError(`Post:${process.env.BOTS_API_URL}/items/dexcom_logs api failed`);
    }

  }

}
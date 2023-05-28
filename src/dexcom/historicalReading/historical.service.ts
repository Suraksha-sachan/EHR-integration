import { HttpService } from "@nestjs/axios";
import { Injectable, Scope } from "@nestjs/common";
import { BaseService } from "src/abstract";

@Injectable()
export class HistoricalService extends BaseService {
  constructor(
    private readonly httpService: HttpService) {
    super();
  }
  async getAllDexcomAccessTokens(orgId: number) {
    try {

      let find = await this.httpService.axiosRef.get(
        `${process.env.BOTS_API_URL}/items/dexcom_access_tokens?filter={"docsink_organization":{"_eq":${orgId}}}`,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        }
      );
      return find.data;

    } catch (error) {
      this._getBadRequestError(`Get: ${process.env.BOTS_API_URL}/items/dexcom_access_tokens?filter={"docsink_organization":{"_eq":${orgId}}} api failed`);
    }
  }

  async fetchReadings(start_date: any, end_date: any, access_token: string) {
    try {
      if (!start_date)
        return this._getBadRequestError("start_date params is required.");
      if (!end_date)
        return this._getBadRequestError("end_date params is required.");

      const readingsData = await this.httpService.axiosRef.get(
        `${process.env.DEXCOM_API_URL}/v2/users/self/egvs`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
          params: {
            startDate: start_date,
            endDate: end_date,
          },
        }
      );
      return readingsData.data;

    } catch (error) {
      return this._getBadRequestError(`Get:${process.env.DEXCOM_API_URL}/v2/users/self/egvs api failed`);
    }
  }
  async getDexcomEgvs(systemTime: string, access_token_id: number) {

    try {
      let find = await this.httpService.axiosRef.get(
        `${process.env.BOTS_API_URL}/items/dexcom_egvs`,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
          params: {
            filter: `{"systemtime":{ "_eq":"${systemTime}"},"access_token":{"_eq":${access_token_id}}}`,
          },
        }
      );
      return find.data;

    } catch (error) {
      this._getBadRequestError(`Get:${process.env.BOTS_API_URL}/items/dexcom_egvs api failed`);
    }

  }
  async updateDexcomEgvs(data: any, id: number) {
    try {
      let find = await this.httpService.axiosRef.patch(
        `${process.env.BOTS_API_URL}/items/dexcom_egvs/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        }
      );
      return find.data;

    } catch (error) {
      this._getBadRequestError(`Patch:${process.env.BOTS_API_URL}/items/dexcom_egvs/${id}`);
    }

  }
  async saveDexcomEgvs(data: any) {
    try {
      let find = await this.httpService.axiosRef.post(
        `${process.env.BOTS_API_URL}/items/dexcom_egvs`,
        data,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        }
      );
      return find.data;

    } catch (error) {
      this._getBadRequestError(`Post: ${process.env.BOTS_API_URL}/items/dexcom_egvs api failed`);
    }

  }
  async updatePatientHistoricalSync(id : number) {
    try {
      let data = {"historical_sync" : true}
      let find = await this.httpService.axiosRef.patch(
        `${process.env.BOTS_API_URL}/items/dexcom_access_tokens/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        }
      );
      return find.data;

    } catch (error) {
      this._getBadRequestError(`Patch:${process.env.BOTS_API_URL}/items/dexcom_access_tokens/${id} api failed.`);
    }

  }
}
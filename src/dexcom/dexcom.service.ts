import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { BaseService } from "src/abstract";
import { DexcomLogservice } from "src/middleware/dexcom.logs.service";
import { CreateLogsDto } from "src/middleware/dto/create-logs.dto";
import { Repository } from "typeorm";
import { CreateDexcomDto } from "./dexcom.dto";
import { Dexcom } from "./dexcom.entity";
import { DexcomConfigurationService } from "./dexcomConfiguration/dexcomConfiguration.service";
import { DocsinkService } from "./docsink/docsink.service";
import { OnPatientSyncHistoricalService } from "./historicalReading/historicalReading.service";

@Injectable()
export class DexcomService extends BaseService {
  constructor(
    @InjectRepository(Dexcom, process.env.BOTS_CONNECTION_NAME)
    private readonly dexcomRepository: Repository<Dexcom>,

    private readonly dexcomLogsService: DexcomLogservice,

    private readonly docsinkService: DocsinkService,

    private readonly dexcomConfigurationService: DexcomConfigurationService,

    private readonly httpService: HttpService,

    private readonly onPatientSyncHistoricalService: OnPatientSyncHistoricalService

  ) {
    super();
  }
  async storeDexcomToken({ ...payload }: Partial<CreateDexcomDto>, patient: any, logs: CreateLogsDto) {
    let responseData = null;
    let accessTokenId = null;
    try {

      if (!payload?.access_token) return this._getBadRequestError("access_token params is required.");

      if (!payload?.refresh_token) return this._getBadRequestError("refresh_token params is required.");

      if (!payload?.expires_in) return this._getBadRequestError("expires_in params is required.");

      let patientID = Number(patient.context.patient.patient_uuid);

      let orgUUID = Number(patient.context.patient.org_uuid);

      const dexcomConfig = await this.dexcomConfigurationService.findDexcomConfiguration(orgUUID);

      if (dexcomConfig.length == 0 || !dexcomConfig[0].docsink_bot_token || !dexcomConfig[0].orgid) {
        return this._getBadRequestError(`Docsink Organization with UUID: ${orgUUID} is inactive OR not configured with dexcom_configuration.`);
      }

      const patients = await this.docsinkService.findDocsinkPatientByUuid(patientID, orgUUID);

      if (patients.length == 0) {

        await this.fetchDevices(payload.access_token);

        const botToken = dexcomConfig[0].docsink_bot_token;
        const orgId = dexcomConfig[0].orgid;

        const docsinkPatient = await this.docsinkService.fetchDocsinkPatientByUuid(patientID, botToken);

        const createPatient = await this.docsinkService.createDocsinkPatient(orgId, docsinkPatient.data);

        const patientResponse = createPatient.data;

        const patientObject =
        {
          refresh_token: payload?.refresh_token,
          access_token: payload?.access_token,
          expires_in: payload?.expires_in,
          docsink_patient: patientResponse.id,
          docsink_organization: orgId,
          last_refreshed_at: moment(Date.now()).utc().format('YYYY-MM-DD HH:mm:ss.SSS')
        }
        const patientTokenResponse = await this.saveDexcomAccessToken(patientObject);

        responseData = patientTokenResponse.data;
        accessTokenId = responseData.id;

        let statusCodeResponse = logs.res;
        let data = {
          statuscode: statusCodeResponse['statusCode'],
          endpoint: logs.url,
          method: logs.method,
          access_token: responseData.id,
          request_data: logs.body,
          response_data: responseData
        }
        await this.dexcomLogsService.saveLogdata(data);
        this.onPatientSyncHistoricalService.handleCron();
        return responseData;
      }
      else {
        const dexcomAccessTokens = await this.getDexcomAccessTokens(patients[0].id, dexcomConfig[0].orgid);

        if (dexcomAccessTokens.data.length == 0) {
          const orgId = dexcomConfig[0].orgid;

          const patientObject =
          {
            refresh_token: payload?.refresh_token,
            access_token: payload?.access_token,
            expires_in: payload?.expires_in,
            docsink_patient: patients[0].id,
            docsink_organization: orgId,
            last_refreshed_at: moment(Date.now()).utc().format('YYYY-MM-DD HH:mm:ss.SSS')

          }
          const patientTokenResponse = await this.saveDexcomAccessToken(patientObject);

          responseData = patientTokenResponse.data;
          accessTokenId = responseData.id;

          let statusCodeResponse = logs.res;
          let data = {
            statuscode: statusCodeResponse['statusCode'],
            endpoint: logs.url,
            method: logs.method,
            access_token: responseData.id,
            request_data: logs.body,
            response_data: responseData
          }
          await this.dexcomLogsService.saveLogdata(data);
          this.onPatientSyncHistoricalService.handleCron();
          return responseData;
        }
      }

    } catch (error) {

      let data = {
        statuscode: error.status,
        endpoint: logs.url,
        method: logs.method,
        access_token: accessTokenId,
        request_data: logs.body,
        response_data: error.response
      }
      await this.dexcomLogsService.saveLogdata(data);
      return this._getBadRequestError(error.message);

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

  async fetchDevices(access_token: string) {
    try {

      const readingsData = await this.httpService.axiosRef.get(
        `${process.env.DEXCOM_API_URL}/v2/users/self/devices`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
          params: {
            startDate: "2019-08-24T14:15:22",
            endDate: "2019-09-25T14:15:22",
          },
        }
      );
      return readingsData.data;

    } catch (error) {
      return this._getBadRequestError(`Get:${process.env.DEXCOM_API_URL}/v2/users/self/devices api failed, access_token has expired.`);
    }
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

  async refreshDexcomToken(refresh_token: string, id: number) {
    try {
      const formData = new URLSearchParams();

      formData.append('refresh_token', refresh_token);
      formData.append('grant_type', 'refresh_token');
      formData.append('redirect_uri', process.env.DEXCOM_REDIRECT_URI);
      formData.append('client_secret', process.env.DEXCOM_SECRET_KEY);
      formData.append('client_id', process.env.DEXCOM_CLIENT_ID);

      const token = await this.httpService.axiosRef.post(
        `${process.env.DEXCOM_API_URL}/v2/oauth2/token`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const tokenData = token.data;
      const updated = await this.dexcomRepository.update(id, {
        ...{ access_token: tokenData.access_token },
        ...{ refresh_token: tokenData.refresh_token },
        ...{ last_refreshed_at: moment(Date.now()).utc().format('YYYY-MM-DD HH:mm:ss.SSS') },
      });

      return 'Dexcom Token Refreshed Successfully.';

    } catch (error) {
      return this._getBadRequestError(`Post: ${process.env.DEXCOM_API_URL}/v2/oauth2/token api failed.`);

    }
  }

  async updateReadingLastRun(id: number, last_run_timestamp: string) {
    try {
      let data = { "last_run_timestamp": moment(last_run_timestamp).format('YYYY-MM-DD HH:mm:ss.SSS') }
      let upadte = await this.httpService.axiosRef.patch(
        `${process.env.BOTS_API_URL}/items/dexcom_access_tokens/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        }
      );
      return upadte.data;

    } catch (error) {
      return this._getBadRequestError(`patch: ${process.env.BOTS_API_URL}/items/dexcom_access_tokens/${id} api failed`);
    }
  }

  async getPatientSynced(patient: any, logs: CreateLogsDto) {
    let responseData;
    let accessTokenId = null;
    try {

      const patientUUID = Number(patient.context.patient.patient_uuid);
      const orgUUID = Number(patient.context.patient.org_uuid);

      const result = await this.dexcomRepository.query(
        `SELECT o.id as docsink_org , dc.docsink_organization as dexcom_configuration_org , dat.docsink_organization as dexcom_access_tokens_org , dat.docsink_patient as dexcom_access_tokens_patient , dat.id as access_token_id  from integration.docsink_organization o
          left join integration.docsink_patient dp
          on dp.docsink_organization = o.id 
          and dp.uuid = ${patientUUID}
          left join integration.dexcom_configuration dc 
          on dc.docsink_organization = o.id 
          and dc.enabled = true
          left join integration.dexcom_access_tokens dat 
          on dat.docsink_organization = o.id 
          and dat.docsink_patient  = dp.id 
          where o.uuid = ${orgUUID};`
      );

      if (!result[0].docsink_org) {
        responseData = this._getBadRequestError(`Docsink Organization with UUID: ${orgUUID} is not installed in docsink_organization collection.`);
        return responseData;
      }
      if (!result[0].dexcom_configuration_org) {
        responseData = this._getBadRequestError(`Docsink Organization with UUID: ${orgUUID} is not configured in dexcom_configuration collection.`);
        return responseData;
      }
      if (!result[0].dexcom_access_tokens_org && !result[0].dexcom_access_tokens_patient) {
        responseData = this._apiResponse([]);
        return responseData
      }
      responseData = { 'patient_uuid': patientUUID, 'org_uuid': orgUUID };
      accessTokenId = result[0].access_token_id;

      let statusCodeResponse = logs.res;
      let data = {
        statuscode: statusCodeResponse['statusCode'],
        endpoint: logs.url,
        method: logs.method,
        access_token:result[0].access_token_id,
        request_data: logs.body,
        response_data: responseData
      }
      await this.dexcomLogsService.saveLogdata(data);

      return this._apiResponse(responseData);

    } catch (error) {

      let data = {
        statuscode: 400,
        endpoint: logs.url,
        method: logs.method,
        access_token: accessTokenId,
        request_data: logs.body,
        response_data: error.message
      }
      await this.dexcomLogsService.saveLogdata(data);
      return this._getBadRequestError(error.message);
    }
  }

  async getDexcomAccessTokens(docsink_patient: number, docsink_organization: number) {
    try {
      let find = await this.httpService.axiosRef.get(
        `${process.env.BOTS_API_URL}/items/dexcom_access_tokens`,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
          params: {
            filter: `{"docsink_patient":{"_eq":${docsink_patient}},"docsink_organization":{"_eq":${docsink_organization}}}`,
          },
        }
      );
      return find.data;

    } catch (error) {
      this._getBadRequestError(error.message);
    }
  }


  async getDexcomAccessTokensbyPatientId(patientid: number) {
    try {

      let find = await this.httpService.axiosRef.get(`${process.env.BOTS_API_URL}/items/dexcom_access_tokens`, {
        headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        params: {
          filter: `{"docsink_patient":${patientid}}`
        }
      })
      return find.data;
    } catch (error) {
      return this._getBadRequestError(error.message)
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

  async saveDexcomAccessToken(data: any) {
    try {
      let find = await this.httpService.axiosRef.post(
        `${process.env.BOTS_API_URL}/items/dexcom_access_tokens`,
        data,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        }
      );
      return find.data;

    } catch (error) {
      this._getBadRequestError(`Post: ${process.env.BOTS_API_URL}/items/dexcom_access_tokens api failed`);
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

  async updatePatientHistoricalSync(id: number) {
    try {
      let data = { "historical_sync": true }
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

  async GetDexcomAccessTokensData() {
    try {

      let result = await this.dexcomRepository.query(
        `SELECT * from integration.dexcom_access_tokens order by last_refreshed_at  limit 20;`
      );
  
      return result;

    } catch (error) {
      this._getBadRequestError(`Get: dexcom_access_tokens api failed.`);
    }

  }

  async validateDexcomConfigurationToken(tokenData: any) {
    try {
      if(!tokenData){
          return false;
      }
      else {
      const token = tokenData.replace('Bearer ', '');

      let find = await this.httpService.axiosRef.get(
        `${process.env.BOTS_API_URL}/items/dexcom_configuration?filter={"docsink_bot_token":{ "_eq":"${token}"}, "enabled":{"_eq":true}}`,
        {
          headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
        }
      );
      return find.data;

      }

    } catch (error) {
      return this._getBadRequestError(`Get: ${process.env.BOTS_API_URL}/items/dexcom_configuration api failed`);
    }
  }

  async TestDevelop() {
    try {
      
      return 'Testing ci/cd deployment.';

    } catch (error) {
      return this._getBadRequestError(error.message);
    }

  }
}

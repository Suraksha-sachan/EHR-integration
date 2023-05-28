import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { docsinkOrgPatientFormat, docsinkpatientFormat } from "src/utils/mydataPatientToDocsinkFormat";

@Injectable()

export class SyncPatientToDocsinkService extends BaseService {
    constructor(
        private readonly httpService: HttpService) {
        super();
    }

    async createOrUpdateOrgDocsinkPatients(payload: any, botConfig: any) {

        const mydataPatientId = botConfig?.mydata_patient_id;
        try {
            const docsinkBotToken = botConfig.docsink_bot_token;
            const data = await docsinkOrgPatientFormat(payload.data);
            const uuid = botConfig?.docsinkPatientUuid;

            if (uuid) {
                const updateOrgdocsinkPatient = await this.httpService.axiosRef.patch(`${process.env.DOCSINK_ORG_API_URL}/patients/${uuid}`, data, {
                    headers: { Authorization: `Bearer ${docsinkBotToken}` },
                });
                return updateOrgdocsinkPatient.data;
            }
            else {
                const createdocsinkOrgPatient = await this.httpService.axiosRef.post(`${process.env.DOCSINK_ORG_API_URL}/patients`, data, {
                    headers: { Authorization: `Bearer ${docsinkBotToken}` },
                });
                return createdocsinkOrgPatient.data;
            }
        } catch (error) {
            console.log(`🚀 ~ file: syncPatientsToDocsink.service.ts:35 ~ SyncPatientToDocsinkService ~ createOrUpdateOrgDocsinkPatients ~ error:   in API call `,  {method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            if (error.response.data.message == 'The given data was invalid.') {
                let data = { sync_docsink_invalid_data: true };
                await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/mydata_patient/${mydataPatientId}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                    }
                ); return false;
            }
            else {
                this._getBadRequestError(error.message);
            }
        }
    }


    async createOrUpdateDocsinkPatient(payload, botConfig) {
        try {
            const docsinkPatientId = botConfig?.docsinkPatientId;
            const mydataPatientId = botConfig?.mydata_patient_id;
            const externalRecordConfig = {
                item: mydataPatientId,
                collection: "mydata_patient"
            }
            const docsinkPatient = await docsinkpatientFormat(payload.data, botConfig);

            if (botConfig?.external_record_mappings.length == 0) {

                botConfig.external_record_mappings.push(externalRecordConfig);
                docsinkPatient["external_record_mappings"] = botConfig.external_record_mappings
            }
            if (docsinkPatientId) {
                const updatedocsinkPatient = await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/docsink_patient/${docsinkPatientId}`,
                    docsinkPatient, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });
                return updatedocsinkPatient.data;
            }
            else {
                const createdocsinkPatient = await this.httpService.axiosRef.post(`${process.env.BOTS_API_URL}/items/docsink_patient`,
                    docsinkPatient, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });
                return createdocsinkPatient.data;
            }
        } catch (error) {
            console.log(`🚀 ~ file: syncPatientsToDocsink.service.ts:82 ~ SyncPatientToDocsinkService ~ createOrUpdateDocsinkPatient ~ error:   in API call `,  {method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors})
            this._getBadRequestError(error?.message)
        }
    }


    async getPatientByEmail(email:string, botConfig:any) {
        try {
            const docsinkBotToken = botConfig.docsink_bot_token;
            const getOrgdocsinkPatient = await this.httpService.axiosRef.get(`${process.env.DOCSINK_ORG_API_URL}/patients`, {
                headers: { Authorization: `Bearer ${docsinkBotToken}` },
                params: {
                    email :encodeURI(email)
                },
            });
            return getOrgdocsinkPatient.data;
        } catch (error) {
            console.log(`🚀 ~ file: syncPatientsToDocsink.service.ts:97 ~ SyncPatientToDocsinkService ~ getPatientByEmail ~ error:   in API call `,  {method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors})
            this._getBadRequestError(error?.message);
        }
    }
}

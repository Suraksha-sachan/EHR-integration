import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { DocsinkAppointmentTypeFormat, docsinkOrgAppointmentTypeFormat } from "src/utils/mydataAppointmentToDocsinkFormat";

@Injectable()

export class SyncDocsinkAppointmentTypeService extends BaseService {
    constructor(
        private readonly httpService: HttpService
    ) { super(); }

    async createOrUpdateOrgDocsinkAppointmentType(payload: any, uuid: number, botConfig: any) {
        const mydataAppointmentTypeId = botConfig?.mydata_AppointmentType_id;
        try {
            const data = await docsinkOrgAppointmentTypeFormat(payload);
            const docsinkBotToken = botConfig?.docsink_bot_token;

            if (uuid) {
                const updatedocsinkOrgAppointmentType = await this.httpService.axiosRef.patch(`${process.env.DOCSINK_ORG_API_URL}/appointments/types/${uuid}`, data, {
                    headers: { Authorization: `Bearer ${docsinkBotToken}` },
                });
                return updatedocsinkOrgAppointmentType.data;
            } else {
                const createdocsinkOrgAppointmentType = await this.httpService.axiosRef.post(`${process.env.DOCSINK_ORG_API_URL}/appointments/types`, data, {
                    headers: { Authorization: `Bearer ${docsinkBotToken}` },
                });
                return createdocsinkOrgAppointmentType.data;
            }
        } catch (error) {
            console.log(`🚀 ~ file: syncAppointmentTypeToDocsink.service.ts:31 ~ SyncDocsinkAppointmentTypeService ~ createOrUpdateOrgDocsinkAppointmentType ~ error:  in API call`,{method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors} );
            if (error.response.data.message == "The given data was invalid.") {
                let data = { sync_docsink_invalid_data: true };
                await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/mydata_appointment_type/${mydataAppointmentTypeId}`,
                data,
                {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                }
                ); return false;
            } else {
                
                this._getBadRequestError(error.message);
            }
        }
    }

    async createOrUpdateDocsinkAppointmentType(payload: any, botConfig) {
        try {
            const docsinkAppointmentTypeId = botConfig?.docsinkAppointmentTypeId;
            const mydataAppointmentTypeId = botConfig?.mydata_AppointmentType_id;
            const externalRecordConfig = {
                item: mydataAppointmentTypeId,
                collection: "mydata_appointment_type"
            }
            const docsinkAppointmentType = await DocsinkAppointmentTypeFormat(payload.data, botConfig);
            if (botConfig?.external_record_mappings.length == 0) {

                botConfig.external_record_mappings.push(externalRecordConfig);
                docsinkAppointmentType["external_record_mappings"] = botConfig.external_record_mappings
            }
            if (docsinkAppointmentTypeId) {
                const updatedocsinkAppointmentType = await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/docsink_appointment_type/${docsinkAppointmentTypeId}`,
                    docsinkAppointmentType, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });
                return updatedocsinkAppointmentType.data;

            } else {
                const createdocsinkAppointmentType = await this.httpService.axiosRef.post(`${process.env.BOTS_API_URL}/items/docsink_appointment_type`,
                    docsinkAppointmentType, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });
                return createdocsinkAppointmentType.data;
            }
        } catch (error) {
            console.log(`🚀 ~ file: syncAppointmentTypeToDocsink.service.ts:76 ~ SyncDocsinkAppointmentTypeService ~ createOrUpdateDocsinkAppointmentType ~ error:  in API call`,{method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(error.response.data)
        }
    }
}

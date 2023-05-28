import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { docsinkAppointmentFormat, docsinkOrgAppointmentFormat } from "src/utils/mydataAppointmentToDocsinkFormat";

@Injectable()
export class SyncAppointmentToDocsinkService extends BaseService {
    constructor(
        private readonly httpService: HttpService
    ) { super(); }

    async createOrUpdateDocsinkOrgAppointments(payload: any, botConfig: any) {

        const mydataAppointmentId = botConfig?.mydata_appointment_id;
        try {
            const docsinkBotToken = botConfig.docsink_bot_token;
            const data = await docsinkOrgAppointmentFormat(payload.data , botConfig);
            const uuid = botConfig?.docsinkAppointmentUuid;

            if (uuid) {
                const updateOrgdocsinkAppointment = await this.httpService.axiosRef.patch(`${process.env.DOCSINK_ORG_API_URL}/appointments/${uuid}`, data, {
                    headers: { Authorization: `Bearer ${docsinkBotToken}` },
                });
                return updateOrgdocsinkAppointment.data;
            }
            else {
                const createdocsinkOrgAppointment = await this.httpService.axiosRef.post(`${process.env.DOCSINK_ORG_API_URL}/appointments`, data, {
                    headers: { Authorization: `Bearer ${docsinkBotToken}` },
                });
                return createdocsinkOrgAppointment.data;
            }
        } catch (error) {
            console.log(`🚀 ~ file: syncAppointmentToDocsink.service.ts:33 ~ SyncAppointmentToDocsinkService ~ createOrUpdateDocsinkOrgAppointments ~ error:  in API call `,{method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            if (error.response.data.message == 'The given data was invalid.') {
                let data = { sync_docsink_invalid_data: true };
                await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/mydata_appointment/${mydataAppointmentId}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                    }
                ); return false;
            }
            else {
                this._getBadRequestError(error?.message);
            }
        }
    }

    async createOrUpdateDocsinkAppointment(payload, botConfig) {
        try {
            const docsinkAppointmentId = botConfig?.docsinkAppointmentId;
            const mydataAppointmentId = botConfig?.mydata_appointment_id;
            const externalRecordConfig = {
                item: mydataAppointmentId,
                collection: "mydata_appointment"
            }
            const docsinkAppointment = await docsinkAppointmentFormat(payload.data, botConfig);

            if (botConfig?.external_record_mappings.length == 0) {

                botConfig.external_record_mappings.push(externalRecordConfig);
                docsinkAppointment["external_record_mappings"] = botConfig.external_record_mappings
            }
            if (docsinkAppointmentId) {
                const updatedocsinkAppointment = await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/docsink_appointment/${docsinkAppointmentId}`,
                docsinkAppointment, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });
                return updatedocsinkAppointment.data;
            }
            else {
                const createdocsinkAppointment = await this.httpService.axiosRef.post(`${process.env.BOTS_API_URL}/items/docsink_appointment`,
                docsinkAppointment, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });
                return createdocsinkAppointment.data;
            }
        } catch (error) {
            console.log(`🚀 ~ file: syncAppointmentToDocsink.service.ts:79 ~ SyncAppointmentToDocsinkService ~ createOrUpdateDocsinkAppointment ~ error:  in API call`,{method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message)
        }
    }
}
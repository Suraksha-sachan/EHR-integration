import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { BaseService } from "src/abstract";
import { MydataPatientService } from "./patient/mydataPatient.service";
import { MydataAppointmentService } from "./appointment/appointment.service";

@Injectable()

export class MydataServerDataService extends BaseService {
    constructor(
        private readonly httpService: HttpService,
        private readonly mydataPatientService: MydataPatientService,
        private readonly mydataAppointmentService:MydataAppointmentService
    ) {
        super();
    }
    @Cron("*/5  * * * *")
    async handleCron() {
        try {
            console.log("Cron job started for patient and appointment sync");
            const getOrgConfigs = await this.getOrgConfig();
            const configData = getOrgConfigs.data;
            if (configData.length > 0) {
                await Promise.all(
                    configData.map(async (config) => {
                        if (config?.api_access_token) {
                            await this.mydataPatientService.storePatients(config);
                            if (config?.sync_appointments) {
                                await this.mydataAppointmentService.storeAppointments(config);
                            }

                            console.log("MyDataServerData Cron runs successfully");
                        }
                    })
                )
            }
        } catch (error) {
            console.log("🚀 ~ file: mydataServerData.cron.ts:39 ~ MydataServerDataService ~ handleCron ~ error:", error?.message);
            this._getBadRequestError(error);
        }
    }

    async getOrgConfig() {
        try {
            const response = await this.httpService.axiosRef.get(`${process.env.BOTS_API_URL}/items/mydata_configuration`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    fields: "id,url,api_access_token,docsink_organization.id,docsink_bot_token,sync_patients_last_run,sync_appointments_last_run,sync_appointments",
                    filter: `{"enabled":{"_eq":true}}`,
                },
            });
          
            console.log("Configuration request body", response?.config.url);
            console.log("configuration response body",response.data);
            return response.data;
        } catch (error) {
            console.log("🚀 ~ file: mydataServerData.cron.ts:54 ~ MydataServerDataService ~ getOrgConfig ~ error: in API call",  {method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message);
        }
    }
}
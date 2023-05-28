import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "../../abstract/base.service";
import { MydataImportAppointmentJobService } from "./appointment/importAppointmentJob/importAppointment.service";
import { Cron } from "@nestjs/schedule";


@Injectable()

export class MydataImportAppointmentService extends BaseService {
    constructor(
        private readonly httpService: HttpService,
        private readonly mydataImportAppointmentJobService: MydataImportAppointmentJobService) { super(); }

    @Cron("0 23 * * *")
    async handleCron() {
        let importAppointmentId;
        try {
            console.log("Cron job started for Import Provider Schedule");
            const importAppointmentData = await this.getImportAppointments();
            if (importAppointmentData.data.length > 0) {
                for (let i = 0; i <= importAppointmentData.data.length - 1; i++) {
                    const jobData = await importAppointmentData?.data[i];
                    const mydatConfigId = jobData?.mydata_configuration;
                   const mydataPractitionerId = jobData?.mydata_practitioner;

                    const practitionerMapping = await this.checkPractitionerMapping(mydataPractitionerId, mydatConfigId);

                    if(practitionerMapping.data.length == 0){
                        importAppointmentId = jobData?.id;
                      this._getBadRequestError(`Practitioner is not mapped to the selected mydata_configuration`);
                    }

                    if (practitionerMapping.data.length > 0) {
                        importAppointmentId = jobData?.id;
                        await this.updateAppointmentStatus(importAppointmentId);
                        await this.mydataImportAppointmentJobService.storeImportAppointments(jobData);

                    }
                }
                console.log("Import Provider Schedule Cron runs sucessfully");
            }
        } catch (error) {
            console.log("🚀 ~ file: mydataImportAppointment.cron.ts:42 ~ MydataImportAppointmentService ~ handleCron ~ error:", error?.message);
            await this.mydataImportAppointmentJobService.updateAppointmentStatus(importAppointmentId, error?.response?.message)
        }
    }


    async getImportAppointments() {
        try {
            const getImportAppointmentData = await this.httpService.axiosRef.get(`${process.env.BOTS_API_URL}/items/import_appointments_job`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    filter: `{"status":{"_contains":"Not Started"}}`,
                },
            });
            console.log("ImportAppointment request body", getImportAppointmentData?.config.url);
            console.log("ImportAppointment response body",getImportAppointmentData.data);
            return getImportAppointmentData.data;

        } catch (error) {
            console.log("🚀 ~ file: mydataImportAppointment.cron.ts:60 ~ MydataImportAppointmentService ~ getImportAppointments ~ error: in API call",{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.response?.data?.errors ? JSON.stringify(error?.response?.data?.error) : `get:${process.env.BOTS_API_URL}/items/import_appointments_job api failed.`);
        }
    }

    async updateAppointmentStatus(id) {
        try {
            let data = { status: "Started" }

            const updateAppointmentStatusData = await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/import_appointments_job/${id}`, data, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
            });
            return updateAppointmentStatusData.data;

        } catch (error) {
            console.log("🚀 ~ file: mydataImportAppointment.cron.ts:74 ~ MydataImportAppointmentService ~ updateAppointmentStatus ~ error: in API call",{method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.response?.data?.errors ? JSON.stringify(error?.response?.data?.errors) : `patch:${process.env.BOTS_API_URL}/items/import_appointments_job api failed`);
        }
    }

    async checkPractitionerMapping(practitionerId, configId) {
        try {
            const mappingData = await this.httpService.axiosRef.get(`${process.env.BOTS_API_URL}/items/mydata_practitioner`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    fields: "id",
                    filter: `{"_and":[{"id":{"_eq":${practitionerId}}},{"mydata_configuration":{"_eq":${configId}}}]}`

                },
            });
            return mappingData.data;

        } catch (error) {
            console.log("🚀 ~ file: mydataImportAppointment.cron.ts:92 ~ MydataImportAppointmentService ~ checkPractitionerMapping ~ error: in API call",{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.response?.data?.errors ? JSON.stringify(error?.response?.data?.errors) : `get: ${process.env.BOTS_API_URL}/items/mydata_practitioner api failed`);
        }
    }

}


import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { MyDataPractitionerService } from "../../practitioner/mydataPractitioner.service";
import { error } from "console";
import moment from "moment";
import { MydataApiIntegrationService } from "../../mydata.apiIntegration";
import { AppointmentTypeService } from "../appointmentType/appointmentType.service";
import { PatientService } from "../patient/patient.service";
import { UpsertMydataLocationService } from "../../location/mydataLocation.service";
import { SyncAppointmentToDocsinkService } from "../syncAppointmentToDocsink.service";
import { mydataAppointmentFormat } from "src/utils/mydataAppointmentToDocsinkFormat";
import { MydataAppointmentService } from "../appointment.service";

@Injectable()

export class MydataImportAppointmentJobService extends BaseService {
    constructor(
        private readonly httpService: HttpService,
        private readonly myDataPractitionerService: MyDataPractitionerService,
        private readonly mydataApiIntegrationService: MydataApiIntegrationService,
        private readonly appointmentTypeService: AppointmentTypeService,
        private readonly upsertMydataLocationService: UpsertMydataLocationService,
        private readonly patientService: PatientService,
        private readonly syncAppointmentToDocsinkService: SyncAppointmentToDocsinkService,
        private readonly mydataAppointmentService: MydataAppointmentService) { super(); }

    async storeImportAppointments(jobData: any) {
        const importAppointmentId = jobData?.id;
        try {
            const mydataPractitionerId = jobData?.mydata_practitioner;
            const searchStartDate = jobData?.search_start_date;
            const searchEndDate = jobData?.search_end_date;
            const mydataConfigId = jobData?.mydata_configuration;
            let message;

            const practitionerMapping = await this.myDataPractitionerService.checkPractitionerMapping(mydataPractitionerId);

            if (practitionerMapping.data.length == 0) {
                this._getBadRequestError('no mapped providers.');
            }

            let startDate;
            let endDate;
            let currentDateTime = Date.now();
            if (searchStartDate) {
                startDate = moment(searchStartDate).utc().format('YYYY-MM-DD');
            } else {
                startDate = moment(currentDateTime).add(1, "days").utc().format('YYYY-MM-DD');
            }

            if (searchEndDate) {
                endDate = moment(searchEndDate).utc().format('YYYY-MM-DD');
            } else {
                endDate = moment(currentDateTime).add(18, "months").format('YYYY-MM-DD')
            }
            if (startDate > endDate) {
                this._getBadRequestError('start date is after end date.');
            }
            const configData = await this.getOrgConfig(mydataConfigId);
            if (configData.data.length > 0) {
                const getAppointment = await this.mydataApiIntegrationService.fetchImportAppointment(configData?.data[0]?.url, configData?.data[0]?.api_access_token, mydataPractitionerId, startDate, endDate);
                const appointmentData = getAppointment?.entry;
                let appointmentsCounter = 0;
                if (appointmentData.length > 0) {
                    for (let i = 0; i <= appointmentData.length - 1; i++) {
                        let appointment = appointmentData[i];
                        if (appointment.resource.resourceType == 'Appointment') {
                            let botConfig = {
                                mydata_configuration: configData?.data[0]?.id,
                                docsink_bot_token: configData?.data[0]?.docsink_bot_token,
                                docsink_organization: configData?.data[0]?.docsink_organization.id
                            };

                            //appointment_type
                            const appointmentType = await this.appointmentTypeService.storeAppointmentType(appointment.resource, botConfig);
                            if (!appointmentType) {
                                continue;
                            }
                            //patient
                            const patient_id: number = appointment.resource?.participant[0]?.actor?.reference.split('/')[1];
                            const patient = await this.patientService.saveAndSyncPatient(patient_id, configData.data[0]);

                            //practitioner
                            const practitioner_id = appointment.resource?.participant[1]?.actor?.reference.split('/')[1];
                            const getPractitioner = await this.myDataPractitionerService.getMydataPractitionerById(practitioner_id, configData?.data[0]?.id)
                            if (getPractitioner?.data.length == 0) {
                                continue;
                            }
                            const mydata_practitioner_id = getPractitioner?.data[0].id;
                            const practitionerMapping = await this.myDataPractitionerService.checkPractitionerMapping(mydata_practitioner_id);

                            if (practitionerMapping?.data.length == 0) {
                                continue;
                            }
                            const practitioner = {
                                "mydata_practitioner_id": mydata_practitioner_id,
                                "docsink_provider_id": practitionerMapping?.data[0].id,
                                "docsink_provider_uuid": practitionerMapping?.data[0].uuid
                            }

                            //location
                            const location_id = appointment.resource?.participant[2]?.actor?.reference.split('/')[1];
                            const getLocation = await this.upsertMydataLocationService.getMydataLocationById(location_id, configData?.data[0]?.id);
                            if (getLocation?.data.length == 0) {
                                continue;
                            }
                            const mydata_location_id = getLocation?.data[0].id;
                            const locationMapping = await this.upsertMydataLocationService.checkLocationMapping(mydata_location_id);

                            if (locationMapping?.data.length == 0) {
                                continue;
                            }
                            const location = {
                                "mydata_location_id": mydata_location_id,
                                "docsink_location_id": locationMapping?.data[0].id,
                                "docsink_location_uuid": locationMapping?.data[0].uuid

                            }

                            botConfig['appointment_type'] = appointmentType
                            botConfig['patient'] = patient
                            botConfig['practitioner'] = practitioner
                            botConfig['location'] = location

                            //appointment

                            const getAppointment = await this.mydataAppointmentService.getMydataAppointment(appointment.resource.id, configData?.data[0]?.id);
                            if (getAppointment?.data.length > 0) {
                                botConfig["mydata_appointment_id"] = getAppointment.data[0].id;
                            }
                            const mydataAppointmentData = await mydataAppointmentFormat(appointment.resource, botConfig);

                            const saveMydataAppointment = await this.mydataAppointmentService.createOrUpdateMyDataAppointment(mydataAppointmentData);

                            const appointmentId = saveMydataAppointment?.data.id;
                            botConfig["mydata_appointment_id"] = appointmentId;
                            const appointmentMapping = await this.mydataAppointmentService.checkAppointmentMapping(appointmentId);

                            botConfig["external_record_mappings"] = [];
                            let docsinkAppointmentUuid: number = null;
                            botConfig["docsinkAppointmentUuid"] = docsinkAppointmentUuid;

                            if (appointmentMapping.data.length > 0) {
                                docsinkAppointmentUuid = appointmentMapping.data[0].uuid;
                                botConfig["docsinkAppointmentUuid"] = docsinkAppointmentUuid;
                                botConfig["docsinkAppointmentId"] = appointmentMapping.data[0].id;
                                botConfig["external_record_mappings"] = appointmentMapping.data[0].external_record_mappings;
                            }
                            const saveDocsinkAppointments = await this.syncAppointmentToDocsinkService.createOrUpdateDocsinkOrgAppointments(saveMydataAppointment, botConfig);
                            if (saveDocsinkAppointments && saveDocsinkAppointments.data) {
                                await this.syncAppointmentToDocsinkService.createOrUpdateDocsinkAppointment(saveDocsinkAppointments, botConfig);

                            }
                            appointmentsCounter++ ;

                        }
                    }
                }

                await this.updateCompletdStatus(importAppointmentId, appointmentsCounter)

            }
        } catch (error) {
            console.log("🚀 ~ file: importAppointment.service.ts:165 ~ MydataImportAppointmentJobService ~ storeImportAppointments ~ error:", error?.message);
            await this.updateAppointmentStatus(importAppointmentId, error.response.message)
        }
    }


    async updateAppointmentStatus(id: Number, message: any) {
        try {
            const data = { status: 'Error', message: `${message}` }
            const appointmentStatusData = await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/import_appointments_job/${id}`, data, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
            });
            return appointmentStatusData.data;
        } catch (error) {
            console.log("🚀 ~ file: importAppointment.service.ts:178 ~ MydataImportAppointmentJobService ~ updateAppointmentStatus ~ error: in Api call",{method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.response?.data?.errors ? JSON.stringify(error?.response?.data?.errors) : `patch: ${process.env.BOTS_API_URL}/items/import_appointments_jobs/${id} api failed`);
        }
    }


    async getOrgConfig(id: number) {
        try {
            const response = await this.httpService.axiosRef.get(`${process.env.BOTS_API_URL}/items/mydata_configuration`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    fields: "id,url,api_access_token,docsink_organization.id,docsink_bot_token,sync_patients_last_run,sync_appointments_last_run,sync_appointments",
                    filter: `{"id":{"_eq":${id}}}`,
                },
            });
            return response.data;
        } catch (error) {
            console.log("🚀 ~ file: importAppointment.service.ts:195 ~ MydataImportAppointmentJobService ~ getOrgConfig ~ error: in Api call",{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.response?.data?.errors ? JSON.stringify(error?.response?.data?.errors) : `patch: ${process.env.BOTS_API_URL}/items/mydata_configuration api failed`);
        }
    }

    async updateCompletdStatus(id: number, count: number) {
        try {
            const data = { status: 'Completed', message: `${count} appointment imported.` }
            const appointmentCompleteStatusData = await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/import_appointments_job/${id}`, data, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },

            });
            return appointmentCompleteStatusData.data;

        } catch (error) {
            console.log("🚀 ~ file: importAppointment.service.ts:210 ~ MydataImportAppointmentJobService ~ updateCompletdStatus ~ error: in Api call", {method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.response?.data?.errors ? JSON.stringify(error?.response?.data?.errors) : `patch: ${process.env.BOTS_API_URL}/items/import_appointments_job/${id} api failed`)
        }
    }
}

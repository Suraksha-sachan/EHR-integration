import { Injectable } from "@nestjs/common";
import moment from "moment";
import { BaseService } from "src/abstract";
import { MydataApiIntegrationService } from "../mydata.apiIntegration";
import { AppointmentTypeService } from "./appointmentType/appointmentType.service";
import { HttpService } from "@nestjs/axios";
import { PatientService } from "./patient/patient.service";
import { MyDataPractitionerService } from "../practitioner/mydataPractitioner.service";
import { UpsertMydataLocationService } from "../location/mydataLocation.service";
import { mydataAppointmentFormat } from "src/utils/mydataAppointmentToDocsinkFormat";
import { SyncAppointmentToDocsinkService } from "./syncAppointmentToDocsink.service";

@Injectable()

export class MydataAppointmentService extends BaseService {
    constructor(
        private readonly mydataApiIntegrationService: MydataApiIntegrationService,
        private readonly appointmentTypeService: AppointmentTypeService,
        private readonly httpService: HttpService,
        private readonly patientService: PatientService,
        private readonly myDataPractitionerService: MyDataPractitionerService,
        private readonly upsertMydataLocationService: UpsertMydataLocationService,
        private readonly syncAppointmentToDocsinkService: SyncAppointmentToDocsinkService
    ) { super(); }

    async storeAppointments(config: any) {
        try {
            let appointmentLastRun;
            let lastUpdated;

            if (!config?.sync_appointments_last_run) {
                appointmentLastRun = Date.now();
            } else {
                appointmentLastRun = config?.sync_appointments_last_run;
            }
            const sync_appointments_last_run = moment(Date.now()).format('YYYY-MM-DDTHH:mm:ss.SSS');
            if (appointmentLastRun) {
                const formatDate = moment(appointmentLastRun).utc().format('YYYY-MM-DDTHH:mm:ss.SSS');
                lastUpdated = formatDate + "-00:00";
            }

            let nextURL;
            let nextLink;
            let counter = 0;
            do {
                const getAppointments = await this.mydataApiIntegrationService.fetchMydataAppointment(config.url, config?.api_access_token, lastUpdated,nextURL);
                const appointmentData = getAppointments?.entry;

            if (appointmentData.length > 0) {
                for (let i = 0; i <= appointmentData.length - 1; i++) {
                    let appointment = appointmentData[i];
                    if (appointment.resource.resourceType == 'Appointment') {

                        let botConfig = {
                            mydata_configuration: config.id,
                            docsink_bot_token: config.docsink_bot_token,
                            docsink_organization: config.docsink_organization.id
                        };

                        //appointment_type
                        const appointmentType = await this.appointmentTypeService.storeAppointmentType(appointment.resource, botConfig);
                        if (!appointmentType) {
                            continue;
                        }
                        //patient
                        const patient_id: number = appointment.resource?.participant[0]?.actor?.reference.split('/')[1];
                        const patient = await this.patientService.saveAndSyncPatient(patient_id, config);
                        if (!patient) {
                            continue;
                        }

                        //practitioner
                        const practitioner_id = appointment.resource?.participant[1]?.actor?.reference.split('/')[1];
                        const getPractitioner = await this.myDataPractitionerService.getMydataPractitionerById(practitioner_id, config.id)
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
                        const getLocation = await this.upsertMydataLocationService.getMydataLocationById(location_id, config.id);
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

                        const getAppointment = await this.getMydataAppointment(appointment.resource.id, config.id);
                        if (getAppointment?.data.length > 0) {
                            botConfig["mydata_appointment_id"] = getAppointment.data[0].id;
                        }
                        const mydataAppointmentData = await mydataAppointmentFormat(appointment.resource, botConfig);

                        const saveMydataAppointment = await this.createOrUpdateMyDataAppointment(mydataAppointmentData);

                        const appointmentId = saveMydataAppointment?.data.id;
                        botConfig["mydata_appointment_id"] = appointmentId;
                        const appointmentMapping = await this.checkAppointmentMapping(appointmentId);

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
                                await this.syncAppointmentToDocsinkService.createOrUpdateDocsinkAppointment(saveDocsinkAppointments, botConfig)
                            }
                        }
                    }
                }
                nextLink = getAppointments.link.find(l => l.relation == 'next');
                if (nextLink && nextLink.url == nextURL) {
                    break;
                }
                if (nextLink) {
                    nextURL = nextLink.url;
                }
                counter++;
                if (counter == 20) {
                    break;
                }
            } while (nextLink)
            await this.updateConfigAppointmentLastRun(sync_appointments_last_run, config.id);
        } catch (error) {
            console.log(`🚀 ~ file: appointment.service.ts:154 ~ MydataAppointmentService ~ storeAppointments ~ error:  in API call`,error?.message);
            this._getBadRequestError(error?.message);
        }
    }


    async updateConfigAppointmentLastRun(lastUpdated, configId) {
        try {
            let data = { sync_appointments_last_run: lastUpdated }
            const updateConfigPatientLastRun = await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/mydata_configuration/${configId}`,
                data,
                {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                });
            return updateConfigPatientLastRun.data;
        } catch (error) {
            console.log(`🚀 ~ file: appointment.service.ts:170 ~ MydataAppointmentService ~ updateConfigAppointmentLastRun ~ error: in API call`, { method: error?.config?.method, Url: error?.config?.url, body: error?.config?.data, error: error?.response?.data?.errors });
            this._getBadRequestError(error?.message);
        }
    }

    async getMydataAppointment(appointment_id: string, configId: number) {
        try {
            const response = await this.httpService.axiosRef.get(`${process.env.BOTS_API_URL}/items/mydata_appointment`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    fields: "id",
                    filter: `{"_and":[{"appointment_id":{"_eq":${appointment_id}}},{"mydata_configuration":{"_eq":${configId}}}]}`

                },
            });
            return response.data;

        } catch (error) {
            console.log(`🚀 ~ file: appointment.service.ts:188 ~ MydataAppointmentService ~ getMydataAppointment ~ error: in API call `, { method: error?.config?.method, Url: error?.config?.url,error: error?.response?.data?.errors });
            this._getBadRequestError(error.response.data)
        }
    }

    async createOrUpdateMyDataAppointment(data) {
        try {
            const id: number = data?.id;
            if (id) {
                const updatemyDataAppointment = await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/mydata_appointment/${id}`,
                    data, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });
                return updatemyDataAppointment.data;
            }
            else {
                const createAppointment = await this.httpService.axiosRef.post(`${process.env.BOTS_API_URL}/items/mydata_appointment`, data, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });
                return createAppointment.data;
            }
        } catch (error) {
            console.log("🚀 ~ file: appointment.service.ts:197 ~ MydataAppointmentService ~ createOrUpdateMyDataAppointment ~ error:",{method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors})
            this._getBadRequestError(error.response.data)
        }
    }

    async checkAppointmentMapping(id: number) {
        try {
            const mappingResponse = await this.httpService.axiosRef.get(`${process.env.BOTS_API_URL}/items/docsink_appointment`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    fields: `external_record_mappings.*,id,uuid,docsink_organization.id`,
                    filter: `{"_and":[{"external_record_mappings" : {"item": { "_eq" : ${id}} , "collection":{"_eq": "mydata_appointment"}}}]}`
                }
            });
            return mappingResponse.data;
        } catch (error) {
            console.log(`🚀 ~ file: appointment.service.ts:226 ~ MydataAppointmentService ~ checkAppointmentMapping ~ error:in API call `,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message)
        }
    }

}

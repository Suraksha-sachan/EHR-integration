import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { MydataApiIntegrationService } from "../../mydata.apiIntegration";
import { MyDataPractitionerService } from "../../practitioner/mydataPractitioner.service";
import { patientDataFormats } from "src/utils/mydataPatientToDocsinkFormat";
import { SyncPatientToDocsinkService } from "../../patient/syncPatientsToDocsink.service";

@Injectable()
export class PatientService extends BaseService {
    constructor
        (
            private readonly httpService: HttpService,
            private readonly mydataApiIntegrationService: MydataApiIntegrationService,
            private readonly myDataPractitionerService: MyDataPractitionerService,
            private readonly syncPatientToDocsinkService: SyncPatientToDocsinkService
        ) { super(); }

    async saveAndSyncPatient(patient_id: number, config: any) {
        try {
            let configId = config.id;
            const patient = await this.mydataApiIntegrationService.fetchMydataPatientById(config.url, config.api_access_token, patient_id);

            if (patient.resourceType == 'Patient') {
                let botConfig = {
                    mydata_configuration: config.id,
                    docsink_bot_token: config.docsink_bot_token,
                    docsink_organization: config.docsink_organization.id
                };
                const practitioner_id = patient.extension[2].valueReference.reference.split('/')[1];

                const getPractitioner = await this.myDataPractitionerService.getMydataPractitionerById(practitioner_id, configId);

                if (getPractitioner.data.length > 0) {
                    botConfig["mydata_primary_practitioner"] = getPractitioner.data[0].id;
                }
                const patient_id = patient.id;
                const getPatient = await this.getMydataPatientById(patient_id, configId);

                if (getPatient.data.length > 0) {
                    if (getPatient.data[0]?.sync_docsink_invalid_data) {
                        return false;
                    } else {
                        botConfig["mydata_patient_id"] = getPatient.data[0].id;
                    }
                }
                const patientDataFormat = await patientDataFormats(patient, botConfig);
                const saveMydataPatient = await this.saveMydataPatients(patientDataFormat);

                const patientId = saveMydataPatient?.data.id;
                const email = saveMydataPatient?.data.email;

                botConfig["mydata_patient_id"] = patientId;
                const patientMapping = await this.checkPatientMapping(patientId);

                botConfig["external_record_mappings"] = [];
                let docsinkPatientUuid: number = null;
                botConfig["docsinkPatientUuid"] = docsinkPatientUuid;

                if (patientMapping.data.length > 0) {
                    docsinkPatientUuid = patientMapping.data[0].uuid;
                    botConfig["docsinkPatientUuid"] = docsinkPatientUuid;
                    botConfig["docsinkPatientId"] = patientMapping.data[0].id;
                    botConfig["external_record_mappings"] = patientMapping.data[0].external_record_mappings;
                } else if (email) {
                    const getOrgPatient = await this.syncPatientToDocsinkService.getPatientByEmail(email, botConfig);
                    if (getOrgPatient.data.length > 0) {
                        botConfig["docsinkPatientUuid"] = getOrgPatient.data[0].uuid;
                    }
                }
                const saveDocsinkPatients = await this.syncPatientToDocsinkService.createOrUpdateOrgDocsinkPatients(saveMydataPatient, botConfig);
                let docsinkPatientData;
                if (saveDocsinkPatients && saveDocsinkPatients.data) {
                    docsinkPatientData = await this.syncPatientToDocsinkService.createOrUpdateDocsinkPatient(saveDocsinkPatients, botConfig)
                }
                const result = {
                    "mydata_patient_id": patientId ? patientId : null,
                    "docsink_patient_id": docsinkPatientData?.data ? docsinkPatientData.data.id : null,
                    "docsink_patient_uuid": docsinkPatientData?.data ? docsinkPatientData.data.uuid : null
                }
                return result;
            }
        } catch (error) {
            console.log(`🚀 ~ file: patient.service.ts:84 ~ PatientService ~ saveAndSyncPatient ~ error:  in API call `,error?.message);
            this._getBadRequestError(error.response);
        }
    }

    async getMydataPatientById(patient_id: string, configId: number) {
        try {
            const getPatient = await this.httpService.axiosRef.get(`${process.env.BOTS_API_URL}/items/mydata_patient`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    filter: `{"_and":[{"patient_id":{"_eq": ${patient_id}}} , {"mydata_configuration":{"_eq":${configId}}}]}`
                }
            });
            return getPatient.data;
        } catch (error) {
            console.log(`🚀 ~ file: patient.service.ts:99 ~ PatientService ~ getMydataPatientById ~ error:  in API call`,  {method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message)
        }
    }

    async saveMydataPatients(data: any) {
        try {
            if (data.id) {
                const updatePatient = await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/mydata_patient/${data.id}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                    });
                return updatePatient.data;
            }
            else {
                const savePatient = await this.httpService.axiosRef.post(`${process.env.BOTS_API_URL}/items/mydata_patient`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                    });
                return savePatient.data;
            }
        } catch (error) {
            console.log(`🚀 ~ file: patient.service.ts:123 ~ PatientService ~ saveMydataPatients ~ error:  in API call`,  {method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(`Post: ${process.env.BOTS_API_URL}/items/mydata_patient api failed:${error?.message}`)
        }
    }

    async checkPatientMapping(id: number) {
        try {
            const mappingResponse = await this.httpService.axiosRef.get(`${process.env.BOTS_API_URL}/items/docsink_patient`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    fields: `external_record_mappings.*,id,uuid,docsink_organization.id`,
                    filter: `{"_and":[{"external_record_mappings" : {"item": { "_eq" : ${id}} , "collection":{"_eq": "mydata_patient"}}}]}`
                }
            });
            return mappingResponse.data;
        } catch (error) {
            console.log(`🚀 ~ file: patient.service.ts:139 ~ PatientService ~ checkPatientMapping ~ error:  in API call`,  {method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message)
        }
    }
}


import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { mydataAppointmentTypeFormat } from "src/utils/mydataAppointmentToDocsinkFormat";
import { SyncDocsinkAppointmentTypeService } from "./syncAppointmentTypeToDocsink.service";

@Injectable()

export class AppointmentTypeService extends BaseService {
    constructor(
        private readonly httpService: HttpService,
        private readonly syncDocsinkAppointmentTypeService: SyncDocsinkAppointmentTypeService
    ) { super(); }


    async storeAppointmentType(payload: any, botConfig: any) {
        try {

            const code = payload?.type?.coding[0]?.code;
            const getAppointmentType = await this.getAppointmentTypeByCode(code, botConfig?.mydata_configuration);
            if (getAppointmentType.data.length > 0) {
                if (getAppointmentType.data[0].sync_docsink_invalid_data) {
                    return false;
                } else {
                    botConfig["mydata_AppointmentType_id"] = getAppointmentType.data[0].id;
                }
            }
            const data = await mydataAppointmentTypeFormat(payload, botConfig);
            const saveAppointmentType = await this.createOrUpdateAppointmentType(data);
            const appointmentTypeId = saveAppointmentType?.data?.id;

            botConfig["mydata_AppointmentType_id"] = appointmentTypeId;
            const appointmentTypeMapping = await this.checkAppointmentTypeMapping(appointmentTypeId);

            botConfig["external_record_mappings"] = [];
            let docsinkAppointmentTypeUuid: number = null;

            if (appointmentTypeMapping.data.length > 0) {
                docsinkAppointmentTypeUuid = appointmentTypeMapping.data[0].uuid;
                botConfig["docsinkAppointmentTypeUuid"] = docsinkAppointmentTypeUuid;
                botConfig["docsinkAppointmentTypeId"] = appointmentTypeMapping.data[0].id;
                botConfig["external_record_mappings"] = appointmentTypeMapping.data[0].external_record_mappings;
            }
            const saveDocsinkAppointmentType = await this.syncDocsinkAppointmentTypeService.createOrUpdateOrgDocsinkAppointmentType(saveAppointmentType.data, docsinkAppointmentTypeUuid, botConfig);
            let docsinkAppointmentTypeData;
            if (saveDocsinkAppointmentType && saveDocsinkAppointmentType.data) {
                docsinkAppointmentTypeData = await this.syncDocsinkAppointmentTypeService.createOrUpdateDocsinkAppointmentType(saveDocsinkAppointmentType, botConfig);
            }
            const result = {
                "mydata_appointment_type_id": botConfig.mydata_AppointmentType_id ? botConfig.mydata_AppointmentType_id : null,
                "docsink_appointment_type_id": docsinkAppointmentTypeData?.data ? docsinkAppointmentTypeData.data.id : null,
                "docsink_appointment_type_uuid": docsinkAppointmentTypeData?.data ? docsinkAppointmentTypeData.data.uuid : null
            }
            return result;
        } catch (error) {
            console.log(`🚀 ~ file: appointmentType.service.ts:56 ~ AppointmentTypeService ~ storeAppointmentType ~ error:  in API call`,error?.message);
            this._getBadRequestError(error?.message);
        }

    }


    async createOrUpdateAppointmentType(data: any) {
        try {
            if (data.id) {
                const updateAppointmentType = await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/mydata_appointment_type/${data.id}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                    })
                return updateAppointmentType.data;
            }
            else {
                const createAppointmentType = await this.httpService.axiosRef.post(`${process.env.BOTS_API_URL}/items/mydata_appointment_type`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                    })
                return createAppointmentType.data;
            }

        } catch (error) {
            console.log(`🚀 ~ file: appointmentType.service.ts:83 ~ AppointmentTypeService ~ createOrUpdateAppointmentType ~ error:  in API call`,{method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message);

        }
    }

    async getAppointmentTypeByCode(code, configId) {
        try {
            const getAppointmentType = await this.httpService.axiosRef.get(`${process.env.BOTS_API_URL}/items/mydata_appointment_type`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    filter: `{"_and":[{"code":{"_eq": ${code}}} , {"mydata_configuration":{"_eq":${configId}}}]}`
                }
            });
            return getAppointmentType.data;

        } catch (error) {
            console.log(`🚀 ~ file: appointmentType.service.ts:100 ~ AppointmentTypeService ~ getAppointmentTypeByCode ~ error: in API call`,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message);
        }

    }

    async checkAppointmentTypeMapping(id: number) {
        try {
            const mappingResponse = await this.httpService.axiosRef.get(`${process.env.BOTS_API_URL}/items/docsink_appointment_type`, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                params: {
                    fields: `external_record_mappings.*,id,uuid,docsink_organization.id`,
                    filter: `{"_and":[{"external_record_mappings" : {"item": { "_eq" : ${id}} , "collection":{"_eq": "mydata_appointment_type"}}}]}`
                }
            });
            return mappingResponse.data;

        } catch (error) {
            console.log(`🚀 ~ file: appointmentType.service.ts:118 ~ AppointmentTypeService ~ checkAppointmentTypeMapping ~ error: in API call`,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message);

        }
    }
}
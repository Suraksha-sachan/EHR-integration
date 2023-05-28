import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import {DocsinkAppointmentTypeFormat} from "../../../src/utils/mydataAppointmentToDocsinkFormat"
import { DocsinkService } from "src/docsink/docsink.service";
import { DirectusService } from "src/directus/directus.service";

@Injectable()

export class UpsertAppointmentTypeService extends BaseService {

    constructor(
        private readonly docsinkService: DocsinkService,
        private readonly directusService: DirectusService
    ) { super(); }


    async storeAppointmentTypes(orgid: number,
        token: string) {
        try {

            const orgId = orgid;
            const botToken = token;

            const appointmentTypessData = await this.docsinkService.retriveAppointmentTyps(botToken);

            await Promise.all(
                appointmentTypessData.map(async (appointmentTypes) => {
                    const botConfig = {
                        "docsink_organization": orgid
                    }

                    const appointmentTypesRequest = await this.directusService.fetchCollectionFilteredItem('docsink_appointment_type', '*', `{"docsink_organization":{"_eq":${orgId}},"uuid":{"_eq":${appointmentTypes.uuid}}}`)
                    const appointmentTypesResponse = appointmentTypesRequest?.data;

                    if (appointmentTypesResponse.length == 0) {

                        let docsinkAppointmentTypeData = await DocsinkAppointmentTypeFormat(appointmentTypes, botConfig)
                        await this.directusService.createCollectionItem('docsink_appointment_type',JSON.stringify(docsinkAppointmentTypeData))
  
                    }
                    else {
                        const id = appointmentTypesResponse[0].id;
                        let docsinkAppointmentTypeData = await DocsinkAppointmentTypeFormat(appointmentTypes, botConfig)
                        await this.directusService.updateCollectionItemById('docsink_appointment_type',id,JSON.stringify(docsinkAppointmentTypeData));
                    }

                }));

        } catch (error) {
            console.log(`🚀 ~ file: upsertAppointmetype.service.ts:57 ~ UpsertAppointmentTypeService ~ error: in API call`, { method: error?.config?.method, Url: error?.config?.url, error: error?.response?.data?.errors });
            this._getBadRequestError(error?.message);
        }
    }
}

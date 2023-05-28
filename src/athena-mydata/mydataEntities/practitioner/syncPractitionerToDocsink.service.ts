import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { createOrgDocsinkProviderFormats, upsertDocsinkProviderFormat } from "src/utils/mydataPractionerToDocsinkFormat";
@Injectable()

export class SyncPractitionerToDocsinkService extends BaseService {
    constructor(private readonly httpservice: HttpService) {
        super();
    }
    async upsertDocsinkProvider(payload, botConfig) {
        try {

            const docsinkProviderId = botConfig?.docsinkProviderId;

            const docsink_organization = botConfig?.docsink_organization;
            const mydataPractitionerId = botConfig?.mydataPractitionerId;

            const externalRecordConfig = {
                item: mydataPractitionerId,
                collection: "mydata_practitioner"
            }

            const docsinkProvider = await upsertDocsinkProviderFormat(payload, docsink_organization);

            if (botConfig?.external_record_mappings.length == 0) {

                botConfig.external_record_mappings.push(externalRecordConfig);
                docsinkProvider["external_record_mappings"] = botConfig.external_record_mappings

            }
            if (docsinkProviderId) {

                const updateDocsinkProvider = await this.httpservice.axiosRef.patch(`${process.env.BOTS_API_URL}/items/docsink_provider/${docsinkProviderId}`,
                    docsinkProvider, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });
                ;
                return updateDocsinkProvider.data;

            }
            else {
                const createDocsinkProvider = await this.httpservice.axiosRef.post(`${process.env.BOTS_API_URL}/items/docsink_provider`,
                    docsinkProvider, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });
                ;
                return createDocsinkProvider.data;
            }
        } catch (error) {
            console.log(`🚀 ~ file: syncPractitionerToDocsink.service.ts:76 ~ SyncPractitionerToDocsinkService ~ upsertDocsinkProvider ~ error:  in API call `,  {method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message)

        }
    }

}

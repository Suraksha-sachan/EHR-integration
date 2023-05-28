import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { docsinkLocationFormat, docsinkOrgLocationFormat } from "src/utils/mydataLocationToDocsinkFormat";


@Injectable()

export class SyncDocsinkLocationService extends BaseService {

    constructor(private readonly httpService: HttpService) { super() }

    async createOrUpdateDocsinkLocation(payload, botConfig) {
        try {
            const docsinkLocationId = botConfig?.docsinkLocationId;
            const docsink_organization = botConfig?.docsink_organization;
            const mydataLocationId = botConfig?.mydataLocationId;

            const externalRecordConfig = {
                item: mydataLocationId,
                collection: "mydata_location"
            }

            const docsinkLocation = await docsinkLocationFormat(payload.data, docsink_organization);

            if (botConfig?.external_record_mappings.length == 0) {

                botConfig.external_record_mappings.push(externalRecordConfig);
                docsinkLocation["external_record_mappings"] = botConfig.external_record_mappings
            }

            if(docsinkLocationId)
            {
                const updatedocsinkLocation = await this.httpService.axiosRef.patch(`${process.env.BOTS_API_URL}/items/docsink_location/${docsinkLocationId}`,
                docsinkLocation, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
            });
            return updatedocsinkLocation.data;
            }
            else{
                const createdocsinkLocation= await this.httpService.axiosRef.post(`${process.env.BOTS_API_URL}/items/docsink_location`,
                docsinkLocation, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
                });
            return createdocsinkLocation.data;
            }

        } catch (error) {
            console.log(`🚀 ~ file: syncLocationToDocsink.service.ts:76 ~ SyncDocsinkLocationService ~ createOrUpdateDocsinkLocation ~ error:  in API call`,  {method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message)
        }
    }



}

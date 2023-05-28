import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { MydataApiIntegrationService } from "../mydata.apiIntegration";
import { mydataOrgForamt } from "src/utils/mydataOrganizationFormat";



@Injectable()

export class MydataOrganizationService extends BaseService {

    constructor(
        private readonly httpservice: HttpService,
        private readonly mydataApiService: MydataApiIntegrationService
    ) { super() }

    async storeOrganization(configData: any) {
        try {

            const mydataconfigUrl = configData.url;

            const mydataAccessToken = configData.api_access_token;

            const mydataConfigId = configData.id;

            const myDataOrgData = await this.mydataApiService.fetchMydataOrganization(mydataconfigUrl, mydataAccessToken);

            if (myDataOrgData.data.entry.length > 0) {
                await Promise.all(
                myDataOrgData?.data.entry.map(async (orgdata) => {

                    const resourceId = orgdata?.resource.id;

                    const getOrganizationsData = await this.httpservice.axiosRef.get(`${process.env.BOTS_API_URL}/items/mydata_organization`, {
                        headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                        params: {
                            fields: "id",
                            filter: `{"organization_id":{"_eq":"${resourceId}"},"mydata_configuration":{"_eq":${mydataConfigId}}}`,
                        }
                    });

                    if (getOrganizationsData.data.data.length > 0) {

                        const id = getOrganizationsData.data.data[0].id;

                        const data = await mydataOrgForamt(orgdata, mydataConfigId);

                        await this.updateMydataOrganization(data, id);
                    }
                    else {

                        const data = await mydataOrgForamt(orgdata, mydataConfigId,);

                        await this.createMydataOrganization(data);
                    }

                })
            )}

        } catch (error) {
            console.log(`🚀 ~ file: mydataOrganization.service.ts:62 ~ MydataOrganizationService ~ storeOrganization ~ error:`,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message);

        }
    }

    async createMydataOrganization(data) {
        try {

            await this.httpservice.axiosRef.post(`${process.env.BOTS_API_URL}/items/mydata_organization`, data, {

                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
            });
        } catch (error) {
        console.log(`🚀 ~ file: mydataOrganization.service.ts:76 ~ MydataOrganizationService ~ createMydataOrganization ~ error: in API call `,  {method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(`Post:${process.env.BOTS_API_URL}/items/mydata_organization api failed.`);

        }
    }


    async updateMydataOrganization(data, Id) {
        try {
            await this.httpservice.axiosRef.patch(`${process.env.BOTS_API_URL}/items/mydata_organization/${Id}`, data, {

                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
            })
        } catch (error) {
            console.log(`🚀 ~ file: mydataOrganization.service.ts:90 ~ MydataOrganizationService ~ updateMydataOrganization ~ error:  in API call `,  {method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(`Patch:${process.env.BOTS_API_URL}/items/mydata_organization/${Id} api failed.`);

        }
    }
}

import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";
import { DocsinkService } from "src/docsink/docsink.service";
import { docsinkOfficeFormat } from "src/utils/mydataLocationToDocsinkFormat";

@Injectable()

export class UpsertOfficeService extends BaseService {
    constructor(
        private readonly httpservice: HttpService,
        private readonly docsinkService:DocsinkService) { super() }


    async storeOffices(orgid: number, token: string) {
        try {
            const orgId = orgid;

            const botToken = token;

            const officesData = await this.docsinkService.retriveOffices(botToken);

            await Promise.all(
                officesData.map(async (offices) => {

                const getOffices = await this.httpservice.axiosRef.get(`${process.env.BOTS_API_URL}/items/docsink_office`, {
                    headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` },
                    params: { filter: `{"docsink_organization":{"_eq":${orgId}},"uuid":{"_eq":${offices.uuid}}}`, }
                });
                const GetOffices = getOffices?.data.data;

                if (GetOffices.length == 0) {
                    offices["docsink_organization"] = orgId;
                    await this.createOffices(offices,orgId);
                }

                GetOffices.map(async (data) => {
                    const id = data?.id;
                    await this.updateOffices(offices,orgId, id);

                });

            }));

        } catch (error) {
            console.log(`🚀 ~ file: upsertOffice.service.ts:45 ~ UpsertOfficeService ~ storeOffices ~ error: in API call`,{method: error?.config?.method,Url:error?.config?.url,error:error?.response?.data?.errors});
            this._getBadRequestError(error?.message)
        }
    }


    async createOffices(offices, docsink_organization) {
        try {
            const docsinkOfficeData = await docsinkOfficeFormat(offices,docsink_organization);
            await this.httpservice.axiosRef.post(`${process.env.BOTS_API_URL}/items/docsink_office`, docsinkOfficeData, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
            });

        } catch (error) {
            console.log(`🚀 ~ file: upsertOffice.service.ts:58 ~ UpsertOfficeService ~ createOffices ~ error: in API call `,{method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(`Post:${process.env.BOTS_API_URL}/items/docsink_office api failed.`);
        }
    }


    async updateOffices(offices,docsink_organization, id) {
        try {
            const docsinkOfficeData = await docsinkOfficeFormat(offices,docsink_organization);
            await this.httpservice.axiosRef.patch(`${process.env.BOTS_API_URL}/items/docsink_office/${id}`,
            docsinkOfficeData, {
                headers: { Authorization: `Bearer ${process.env.BOTS_API_TOKEN}` }
            });

        } catch (error) {
            console.log(`🚀 ~ file: upsertOffice.service.ts:72 ~ UpsertOfficeService ~ updateOffices ~ error:  in API call `,{method: error?.config?.method,Url:error?.config?.url, body: error?.config?.data,error:error?.response?.data?.errors});
            this._getBadRequestError(`Patch:${process.env.BOTS_API_URL}/items/docsink_office/${id} api failed.`);

        }
    }

}